import BlogValidator from "../../../domain/validators/BlogValidator";
import GetBlog from "./GetBlog";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (BlogData: any, serviceLocator: ServiceLocator) => {
  const { blogRepository } = serviceLocator;
  let blog = await GetBlog(BlogData.id, serviceLocator);
  if (blog == null) throw new Error("Unknown ID");
  blog = { ...blog, ...BlogData };
  await BlogValidator.tailor("update").validateAsync(blog);
  return blogRepository!.merge(blog);
};
