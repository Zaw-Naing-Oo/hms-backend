import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import globalErrorHander from "./app/controllers/error.controller.js";
import appointmentRouter from "./app/routes/appointment.route.js";
import blogRouter from "./app/routes/blog.route.js";
import commentRouter from "./app/routes/comment.route.js";
import contactRouter from "./app/routes/contact.route.js";
import doctorRouter from "./app/routes/doctor.route.js";
import hospitalRouter from "./app/routes/hospital.route.js";
import noticeRouter from "./app/routes/notice.route.js";
import overviewRouter from "./app/routes/overview.route.js";
import userRouter from "./app/routes/user.route.js";
import config from "./config/index.js";
import AppError from "./utils/appError.js";
import patientRouter from "./app/routes/patient.route.js";


process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err);

  process.exit(1);
});

const app = express();

if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const corsOptions = {
  origin: config.CLIENT_URL,
  credentials: true,
};

// app.use(cors(corsOptions));
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/patients", patientRouter)
app.use("/api/v1/hospitals", hospitalRouter);
app.use("/api/v1/doctors", doctorRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/notices", noticeRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/overview", overviewRouter);
app.use("/api/v1/contact", contactRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the API! 🚀",
  });
});

// 404 route
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHander);

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err);

  server.close(() => {
    process.exit(1);
  });
});

export default app;
