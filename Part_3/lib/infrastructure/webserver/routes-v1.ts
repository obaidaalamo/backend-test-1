import { Router } from "express";

import AuthRoutes from "../../interfaces/routes/v1/auth";
import UsersRoutes from "../../interfaces/routes/v1/users";
import UsersBlogRoutes from "../../interfaces/routes/v1/blogs";
import UsersBlogsRoutes from "../../interfaces/routes/v1/userBlogs";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UsersRoutes);
router.use("/blogs", UsersBlogRoutes);
router.use("/user_blogs", UsersBlogsRoutes);

export default router;
