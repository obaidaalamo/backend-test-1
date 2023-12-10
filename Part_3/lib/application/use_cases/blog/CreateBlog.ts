import Blog from "../../../domain/entities/Blog";
import BlogValidator from "../../../domain/validators/BlogValidator";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (blogData: any, { blogRepository }: ServiceLocator) => {
  await BlogValidator.tailor("create").validateAsync(blogData);
  const blog = new Blog({
    user_id: blogData.user_id,
    title: blogData.title,
    description: blogData.description,
    main_image: blogData.main_image,
    additional_images: blogData.additional_images,
    date_time: blogData.date_time,
  });
  return blogRepository!.persist(blog);
};
