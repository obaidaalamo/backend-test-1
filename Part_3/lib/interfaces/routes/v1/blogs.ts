import { Router } from "express";
import BlogController from "../../controllers/BlogController";

const router = Router();

router.get("/", BlogController.findBlog);
router.get("/:id", BlogController.getBlog);
router.post("/", BlogController.createBlog);
router.patch("/:id", BlogController.updateBlog);
router.delete("/:id", BlogController.deleteBlog);

export default router;
