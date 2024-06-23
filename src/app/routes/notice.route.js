import express from "express";
import { protect, restrictTo } from "../controllers/auth.controller.js";
import {
  createNewNotice,
  deleteNotice,
  getAllNotices,
  getNotice,
  updateNotice,
} from "../controllers/notice.controller.js";

const noticeRouter = express.Router();

noticeRouter.get("/", getAllNotices);

noticeRouter.use(protect);

noticeRouter.route("/").post(restrictTo("admin"), createNewNotice);

noticeRouter
  .route("/:noticeId")
  .get(getNotice)
  .patch(restrictTo("admin"), updateNotice)
  .delete(restrictTo("admin"), deleteNotice);

export default noticeRouter;
