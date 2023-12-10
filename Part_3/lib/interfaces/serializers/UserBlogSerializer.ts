import UserBlog from "../../domain/entities/UserBlog";
import { ServiceLocator } from "../../infrastructure/config/service-locator";
import Serializer from "./Serializer";

export default class BlogSerializer extends Serializer {
  _serializeSingleEntity(
    entity: UserBlog,
    serviceLocator: ServiceLocator
  ): object {
    const userObj = {
      id: entity.id,
      user_id: entity.user_id,
      blog_post_id: entity.blog_post_id,
      title: entity.title,
      description: entity.description,
    };
    return userObj;
  }
}
