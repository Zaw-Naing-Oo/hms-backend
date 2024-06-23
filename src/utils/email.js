import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import config from "../config/index.js";

const sendEmail = async (res, options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport(
    smtpTransport({
      host: config.MAIL_HOST,
      port: config.MAIL_PORT,
      secure: true,
      auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  );

  // 2) Define the email options
  const mailOptions = {
    from: "Patientoo <contact@patientoo.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        status: "fail",
        message: "Something went wrong. Please try again later.",
      });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({
        status: "success",
        message: "Message sent successfully!",
      });
    }
  });
};

export default sendEmail;
