import { ServiceLocator } from "../../../infrastructure/config/service-locator";
import { ID } from "../../../domain/entities/Entity";

export default async (userId: ID, { blogRepository }: ServiceLocator) =>
  blogRepository!.find(userId);
