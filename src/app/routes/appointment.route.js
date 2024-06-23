import express from "express";
import {
  createNewAppointment,
  getAppointmentById,
  getAppointments,
} from "../controllers/appointment.controller.js";
import { protect, restrictTo } from "../controllers/auth.controller.js";

const appointmentRouter = express.Router();

appointmentRouter.post(
  "/",
  protect,
  restrictTo("patient"),
  createNewAppointment
);

appointmentRouter.get("/", protect, getAppointments);

appointmentRouter.get("/:appointmentId", protect, getAppointmentById);

export default appointmentRouter;
