import express from "express";
import { sendMessage } from "../controllers/contact.controller.js";

const contactRouter = express.Router();

contactRouter.post("/", sendMessage);

export default contactRouter;
