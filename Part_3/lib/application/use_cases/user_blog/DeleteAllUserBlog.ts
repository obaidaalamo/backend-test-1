import { ID } from "../../../domain/entities/Entity";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default (blogId: ID, { userBlogRepository }: ServiceLocator) =>
  userBlogRepository!.removeAllByUser(blogId);
