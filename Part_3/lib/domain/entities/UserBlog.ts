import Entity, { ID } from "./Entity";

export default class UserBlog extends Entity {
  user_id: string;
  blog_post_id: string;
  title: string;
  description: string;

  constructor({
    id,
    user_id,
    blog_post_id,
    title,
    description,
  }: {
    id?: ID;
    user_id: string;
    blog_post_id: string;
    title: string;
    description: string;
  }) {
    super({ id });
    this.user_id = user_id;
    this.blog_post_id = blog_post_id;
    this.title = title;
    this.description = description;
  }
}
