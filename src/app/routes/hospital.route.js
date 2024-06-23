import express from "express";
import { protect, restrictTo } from "../controllers/auth.controller.js";
import {
  createHospital,
  getAdminHospitals,
  getHospitalById,
  getHospitals,
  updateHospital,
} from "../controllers/hospital.controller.js";

const hospitalRouter = express.Router();

hospitalRouter.get("/", getHospitals);

hospitalRouter.post("/", protect, restrictTo("admin"), createHospital);
hospitalRouter.get("/admin", protect, restrictTo("admin"), getAdminHospitals);
hospitalRouter.patch("/", protect, restrictTo("hospital"), updateHospital);

hospitalRouter.route("/:hospitalId").get(getHospitalById);

export default hospitalRouter;
