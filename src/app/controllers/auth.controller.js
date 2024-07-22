import jwt from "jsonwebtoken";
import { promisify } from "util";
import config from "../../config/index.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import filterObj from "../../utils/filterObj.js";
import { sendSms } from "../../utils/sendSms.js";
import Patient from "../models/patient.model.js";
import User from "../models/user.model.js";

const signToken = (id) =>
  jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      user,
      token,
    },
  });
};

const sendVerificationOTP = async (user, req, res, next) => {
  const otp = await user.createVeificationOTP();

  // Send OTP to user's mobile number
  const message = `Your Patientoo verification code is ${otp}. This code will expire in 10 minutes.`;

  try {
    const result = await sendSms(user.mobileNo, message);

    if (result.success_message) {
      return res.status(200).json({
        status: "success",
        mobileNo: user.mobileNo,
        message: `OTP sent to ${user.mobileNo}`,
      });
    } else {
      return next(
        new AppError(
          result.error_message || "There was an error sending the OTP.",
          500
        )
      );
    }
  } catch (error) {
    console.log(error);

    return next(
      new AppError(
        "There was an error sending the OTP. Please try again later!",
        500
      )
    );
  }
};

export const resendVerificationOTP = async (req, res, next) => {
  const { mobileNo } = req.body;

  const user = await User.findOne({ mobileNo });

  if (!user) {
    return next(new AppError("User not found!", 400));
  }

  if (user.isVerified) {
    return next(new AppError("User already verified!", 400));
  }

  await sendVerificationOTP(user, req, res, next);
};

export const signup = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const userData = filterObj(
    req.body,
    "name",
    "mobileNo",
    "password",
    "confirmPassword"
  );


  /* check user already exit  */
  const existingUser = await User.findOne({ mobileNo: userData.mobileNo });
  if (existingUser) {
    return next(new AppError("User already exists with this mobile number!", 400));
  }

  const newPatient = await Patient.create({
    name: userData.name,
    contactNumber: userData.mobileNo,
  });

  userData.role = "patient";
  userData.profileModel = "Patient";
  userData.profile = newPatient._id;

  const newUser = await User.create(userData);


  /* new code */
  newUser.isVerified = true;
  await newUser.save({ validateBeforeSave: false });

  return res.status(200).json({
    status: "success",
    user: newUser,
    message: "User registration successful!",
  })


  /* old code */
  // await sendVerificationOTP(newUser, req, res, next);
});

export const login = catchAsync(async (req, res, next) => {
  const { mobileNo, password } = req.body;

  if (!mobileNo || !password) {
    return next(
      new AppError("Please provide mobile number and password!", 400)
    );
  }

  const user = await User.findOne({ mobileNo }).select("+password").populate({
    path: "profile",
    select: "-__v -createdAt -updatedAt",
  });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect mobile number or password!", 401));
  }

  if (!user.isVerified) {
    return res.status(401).json({
      status: "fail",
      message: "User not verified!",
      data: {
        user,
      },
    });
  }

  console.log(user);

  return sendTokenResponse(user, 200, res);
});

export const verifyOTP = catchAsync(async (req, res, next) => {
  const { mobileNo, otp } = req.body;

  const user = await User.findOne({ mobileNo }).select(
    "+verificationOTP +verificationOTPExpires"
  );

  if (!user) {
    return next(new AppError("User not found!", 404));
  }

  if (user.isVerified) {
    return next(new AppError("User already verified!", 400));
  }

  if (user.verificationOTPExpires < Date.now()) {
    return next(new AppError("OTP expired! Please request a new OTP.", 400));
  }

  if (user.verificationOTP !== otp) {
    return next(new AppError("Invalid OTP!", 400));
  }

  user.isVerified = true;
  user.verificationOTP = undefined;
  user.verificationOTPExpires = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "User verified successfully!",
    isVerified: true,
  });
});

export const protect = catchAsync(async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  // console.log(token);

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, config.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  if (!currentUser.isVerified) {
    return next(new AppError("User not verified!", 401));
  }

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    const { role } = req.user;

    if (!roles.includes(role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  });
};

export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(
      new AppError(
        "Please provide your current password and new password and confirm new password",
        400
      )
    );
  }

  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("Your provided current password is wrong.", 401));
  }

  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  await user.save();

  res.clearCookie("jwt");

  return res.status(200).json({
    status: "success",
    message: "Password changed successfully!",
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { mobileNo } = req.body;

  // console.log(mobileNo);

  const user = await User.findOne({ mobileNo });

  if (!user) {
    return next(new AppError("User not found!", 404));
  }

  const otp = await user.createResetPasswordOTP();

  // Send OTP to user's mobile number
  const message = `Your Patientoo reset password code is ${otp}. This code will expire in 10 minutes.`;

  try {
    const result = await sendSms(user.mobileNo, message);
    console.log(result);

    if (result.success_message) {
      return res.status(200).json({
        status: "success",
        mobileNo: user.mobileNo,
        message: `OTP sent to ${user.mobileNo}`,
      });
    } else {
      return next(
        new AppError(
          result.error_message || "There was an error sending the OTP.",
          500
        )
      );
    }
  } catch (error) {
    console.log(error);

    return next(
      new AppError(
        "There was an error sending the OTP. Please try again later!",
        500
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { mobileNo, otp, newPassword, confirmNewPassword } = req.body;

  const user = await User.findOne({
    mobileNo,
    resetPasswordOTP: otp,
  });

  if (!user) {
    return next(new AppError("Invalid OTP!", 400));
  }

  if (user.resetPasswordOTPExpires < Date.now()) {
    return next(new AppError("OTP expired! Please request a new OTP.", 400));
  }

  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpires = undefined;

  await user.save();

  return res.status(200).json({
    status: "success",
    message: "Password reset successfully!",
  });
});
