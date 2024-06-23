import express from "express";
import { protect, restrictTo } from "../controllers/auth.controller.js";
import {
  getAdminOverview,
  getHospitalOverview,
  getPatientOverview,
} from "../controllers/overview.controller.js";

const overviewRouter = express.Router();

overviewRouter.get("/admin", protect, restrictTo("admin"), getAdminOverview);
overviewRouter.get(
  "/hospital",
  protect,
  restrictTo("hospital"),
  getHospitalOverview
);
overviewRouter.get(
  "/patient",
  protect,
  restrictTo("patient"),
  getPatientOverview
);

export default overviewRouter;
