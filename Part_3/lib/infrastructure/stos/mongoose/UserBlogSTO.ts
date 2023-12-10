import UserBlog from "../../../domain/entities/UserBlog";

export default (schemaEntity: any): UserBlog | null => {
  if (!schemaEntity) return null;
  return new UserBlog({
    id: schemaEntity.id,
    user_id: schemaEntity.user_id,
    blog_post_id: schemaEntity.blog_post_id,
    title: schemaEntity.title,
    description: schemaEntity.description,
  });
};
