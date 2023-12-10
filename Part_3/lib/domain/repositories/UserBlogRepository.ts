import UserBlog from "../entities/UserBlog";
import { ID } from "../entities/Entity";

export default interface UserBlogRepository {
  persist(domainEntity: UserBlog): Promise<UserBlog | null>;

  merge(domainEntity: UserBlog): Promise<UserBlog | null>;

  remove(entityId: ID): Promise<boolean | null>;

  get(entityId: ID): Promise<UserBlog | null>;

  getByUser(user_id: string): Promise<UserBlog | null>;

  find(entityId: ID): Promise<UserBlog[]>;

  removeAllByUser(entityId: ID): Promise<boolean | null>;
}
