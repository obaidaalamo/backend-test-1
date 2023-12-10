import { ID } from "../../../domain/entities/Entity";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (userId: ID, { blogRepository }: ServiceLocator) => {
  const blog = await blogRepository!.get(userId);
  if (!blog) {
    throw new Error("Invalid User");
  }
  return blog;
};
