import express from "express";
import { protect, restrictTo } from "../controllers/auth.controller.js";
import {
  createNewBlog,
  deleteBlog,
  dislikeBlog,
  getAllBlogs,
  getAllTags,
  getBlog,
  getBlogReaction,
  likeBlog,
  updateBlog,
} from "../controllers/blog.controller.js";

const blogRouter = express.Router();

blogRouter.get("/tags", getAllTags);

blogRouter.patch("/:blogId/like", protect, likeBlog);
blogRouter.patch("/:blogId/dislike", protect, dislikeBlog);
blogRouter.get("/:blogId/reactions", protect, getBlogReaction);

blogRouter
  .route("/")
  .get(getAllBlogs)
  .post(protect, restrictTo("admin", "hospital"), createNewBlog);

blogRouter
  .route("/:blogId")
  .get(getBlog)
  .patch(protect, restrictTo("admin", "hospital"), updateBlog)
  .delete(protect, restrictTo("admin", "hospital"), deleteBlog);

export default blogRouter;
