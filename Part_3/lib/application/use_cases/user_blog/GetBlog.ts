import { ID } from "../../../domain/entities/Entity";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (userId: ID, { userBlogRepository }: ServiceLocator) => {
  const user_blog = await userBlogRepository!.get(userId);
  if (!user_blog) {
    throw new Error("Invalid User");
  }
  return user_blog;
};
