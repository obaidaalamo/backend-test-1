import Blog from "../entities/Blog";
import { ID } from "../entities/Entity";

export default interface BlogRepository {
  persist(domainEntity: Blog): Promise<Blog | null>;

  merge(domainEntity: Blog): Promise<Blog | null>;

  remove(entityId: ID): Promise<boolean | null>;

  get(entityId: ID): Promise<Blog | null>;

  getByUser(user_id: string): Promise<Blog | null>;

  find(entityId: ID): Promise<Blog[]>;

  removeAllByUser(entityId: ID): Promise<boolean | null>;
}
