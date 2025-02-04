import config from "../../config/index.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import sendEmail from "../../utils/email.js";

export const sendMessage = catchAsync(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  console.log(name, email, subject, message);

  if (!name || !message) {
    return next(new AppError("Please provide your name and message", 400));
  }

  const fullMessage = `
  Name: ${name}
  Email: ${email || "No email provided"}
  Subject: ${subject || "No subject"}
  Message: ${message}
`;



  await sendEmail(res, {


    email: config.EMAIL_TO,
    // emailFrom: email,
    emailFrom: email,
    // subject: "New message from Hospital Management System",
    // message: `Name: ${name}\nEmail: ${email || ""}\nSubject: ${subject || ""
    //   }\nMessage: ${message}`,

    subject,
    fullMessage
  });


});
