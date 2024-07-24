import express from "express";
import {
  getAllPatients
} from "../controllers/patient.controller.js";

const patientRouter = express.Router();

patientRouter.get("/", getAllPatients);


export default patientRouter;
