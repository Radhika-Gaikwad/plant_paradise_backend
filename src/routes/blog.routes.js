import express from "express";
import {
  addBlogController,
  editBlogController,
  deleteBlogController,
  getBlogsController,
  getBlogByIdController,
} from "../controller/blog.controller.js";

const router = express.Router();

// Blog Routes
router.post("/add", addBlogController);
router.patch("/edit/:blogId", editBlogController);
router.delete("/delete/:blogId", deleteBlogController);
router.get("/all", getBlogsController);
router.get("/:blogId", getBlogByIdController);

export default router;
