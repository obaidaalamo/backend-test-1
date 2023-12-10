import Joi from "joi";

export default Joi.object({
  user: Joi.object().required(),

  title: Joi.string().label("title").min(5).max(50).required(),

  description: Joi.string().label("description").max(500).required(),

  main_image: Joi.string().label("main_image").required(),

  additional_images: Joi.array().label("additional_images").max(5).optional(),

  phone: Joi.date().label("phone").required(),
}).unknown();
