import GetBlog from "./GetBlog";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (BlogData: any, serviceLocator: ServiceLocator) => {
  const { userBlogRepository } = serviceLocator;
  let blog = await GetBlog(BlogData.id, serviceLocator);
  if (blog == null) throw new Error("Unknown ID");
  blog = { ...blog, ...BlogData };
  return userBlogRepository!.merge(blog);
};
