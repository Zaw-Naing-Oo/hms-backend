import express from "express";
import {
  forgotPassword,
  login,
  protect,
  resendVerificationOTP,
  resetPassword,
  restrictTo,
  signup,
  updatePassword,
  verifyOTP,
} from "../controllers/auth.controller.js";
import {
  createAdmin,
  deleteAdmin,
  getAdmins,
  getMe,
  updateAdmin,
  updateMe,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/me", protect, getMe);

userRouter.post("/signup", signup);
userRouter.post("/login", login);

userRouter
  .route("/admin", protect, restrictTo("admin"))
  .get(getAdmins)
  .post(createAdmin);

userRouter
  .route("/admin/:adminId", protect, restrictTo("admin"))
  .patch(updateAdmin)
  .delete(deleteAdmin);

userRouter.patch("/verify-otp", verifyOTP);
userRouter.patch("/resend-otp", resendVerificationOTP);

userRouter.patch("/update-me", protect, restrictTo("patient"), updateMe);
userRouter.patch("/update-password", protect, updatePassword);

userRouter.post("/forgot-password", forgotPassword);
userRouter.patch("/reset-password", resetPassword);

export default userRouter;
