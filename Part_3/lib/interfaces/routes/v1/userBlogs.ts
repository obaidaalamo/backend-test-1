import { Router } from "express";
import UserBlogController from "../../controllers/UserBlogController";

const router = Router();

router.get("/", UserBlogController.findUserBlog);
router.get("/:id", UserBlogController.getUserBlog);
router.post("/", UserBlogController.createUserBlog);
router.patch("/:id", UserBlogController.updateUserBlog);
router.delete("/:id", UserBlogController.deleteUserBlog);

export default router;
