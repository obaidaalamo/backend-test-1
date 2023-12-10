import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (user_id: string, { blogRepository }: ServiceLocator) => {
  const blog = await blogRepository!.getByUser(user_id);
  if (!blog) {
    return null;
  }
  return blog;
};
