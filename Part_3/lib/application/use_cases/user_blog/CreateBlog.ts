import UserBlog from "../../../domain/entities/UserBlog";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (
  blogData: any,
  { userBlogRepository }: ServiceLocator
) => {
  const blog = new UserBlog({
    user_id: blogData.user_id,
    blog_post_id: blogData.blog_post_id,
    title: blogData.title,
    description: blogData.description,
  });
  return userBlogRepository!.persist(blog);
};
