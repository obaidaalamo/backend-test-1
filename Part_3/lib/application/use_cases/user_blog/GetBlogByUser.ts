import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (
  user_id: string,
  { userBlogRepository }: ServiceLocator
) => {
  const user_blog = await userBlogRepository!.getByUser(user_id);
  if (!user_blog) {
    return null;
  }
  return user_blog;
};
