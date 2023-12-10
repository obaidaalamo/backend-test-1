import Blog from "../../../domain/entities/Blog";

export default (schemaEntity: any): Blog | null => {
  if (!schemaEntity) return null;
  return new Blog({
    id: schemaEntity.id,
    user_id: schemaEntity.user_id,
    title: schemaEntity.title,
    description: schemaEntity.description,
    main_image: schemaEntity.main_image,
    additional_images: schemaEntity.additional_images,
    date_time: schemaEntity.date_time,
  });
};
