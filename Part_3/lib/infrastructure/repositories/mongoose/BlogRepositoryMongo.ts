import MongooseBlog from "../../orm/mongoose/schemas/Blog";
import { ID } from "../../../domain/entities/Entity";
import BlogRepository from "../../../domain/repositories/BlogRepository";
import Blog from "../../../domain/entities/Blog";
import BlogSTO from "../../stos/mongoose/BlogSTO";

export default class BlogRepositoryMongo implements BlogRepository {
  async persist(domainEntity: Blog): Promise<Blog | null> {
    const {
      title,
      description,
      main_image,
      additional_images,
      date_time,
      user_id,
    } = domainEntity;
    const mongooseBlog = new MongooseBlog({
      user_id,
      title,
      description,
      main_image,
      additional_images,
      date_time,
    });
    await mongooseBlog.save();
    return BlogSTO(mongooseBlog);
  }

  async merge(domainEntity: Blog): Promise<Blog | null> {
    const {
      id,
      user_id,
      title,
      description,
      main_image,
      additional_images,
      date_time,
    } = domainEntity;
    const mongooseBlog = await MongooseBlog.findByIdAndUpdate(
      id,
      {
        user_id,
        title,
        description,
        main_image,
        additional_images,
        date_time,
      },
      {
        new: true,
      }
    );
    return BlogSTO(mongooseBlog);
  }

  async remove(entityId: ID): Promise<boolean | null> {
    return MongooseBlog.findOneAndDelete({ _id: entityId });
  }
  async removeAllByUser(entityId: ID): Promise<boolean | null> {
    const blog = await MongooseBlog.find({ user_id: entityId });
    for (let x = 0; x < blog.length; x++) {
      const element = blog[x];
      MongooseBlog.findOneAndDelete({ _id: element._id });
    }
    return true;
  }

  async get(entityId: ID): Promise<Blog | null> {
    const mongooseBlog = await MongooseBlog.findById(entityId);
    if (!mongooseBlog) return null;
    return BlogSTO(mongooseBlog);
  }

  async getByUser(user: string): Promise<Blog | null> {
    const mongooseBlog = await MongooseBlog.findOne({ user });
    if (!mongooseBlog) return null;
    return BlogSTO(mongooseBlog);
  }

  async find(): Promise<Blog[]> {
    const mongooseBlog = await MongooseBlog.find().sort({ createdAt: -1 });
    return mongooseBlog
      .map((mongooseBlog) => BlogSTO(mongooseBlog))
      .filter((blog: Blog | null): blog is Blog => blog != null);
  }
}
