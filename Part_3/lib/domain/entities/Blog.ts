import Entity, { ID } from "./Entity";

export default class Blog extends Entity {
  user_id: string;
  title: string;
  description: string;
  main_image: string;
  additional_images?: string;
  date_time: number;

  constructor({
    id,
    user_id,
    title,
    description,
    main_image,
    additional_images,
    date_time,
  }: {
    id?: ID;
    user_id: string;

    title: string;
    description: string;
    main_image: string;
    additional_images?: string;
    date_time: number;
  }) {
    super({ id });
    this.user_id = user_id;
    this.title = title;
    this.description = description;
    this.main_image = main_image;
    this.additional_images = additional_images;
    this.date_time = date_time;
  }
}
