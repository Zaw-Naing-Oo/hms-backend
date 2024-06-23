import express from "express";
import { protect, restrictTo } from "../controllers/auth.controller.js";
import {
  createDoctor,
  deleteDoctor,
  getAllDoctors,
  getDoctorById,
  getHospitalDoctors,
  getSpecialities,
  updateDoctor,
} from "../controllers/doctor.controller.js";

const doctorRouter = express.Router();

doctorRouter.get("/specialities", getSpecialities);

doctorRouter.get(
  "/my-doctors",
  protect,
  restrictTo("hospital"),
  getHospitalDoctors
);

doctorRouter
  .route("/")
  .get(getAllDoctors)
  .post(protect, restrictTo("hospital"), createDoctor);

doctorRouter
  .route("/:doctorId")
  .get(getDoctorById)
  .patch(protect, restrictTo("hospital"), updateDoctor)
  .delete(protect, restrictTo("hospital"), deleteDoctor);

export default doctorRouter;
