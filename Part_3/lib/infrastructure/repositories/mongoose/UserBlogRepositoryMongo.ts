import MongooseUserBlog from "../../orm/mongoose/schemas/UserBlog";
import { ID } from "../../../domain/entities/Entity";
import UserBlog from "../../../domain/entities/UserBlog";
import UserBlogSTO from "../../stos/mongoose/UserBlogSTO";
import UserBlogRepository from "../../../domain/repositories/UserBlogRepository";

export default class UserBlogRepositoryMongo implements UserBlogRepository {
  async persist(domainEntity: UserBlog): Promise<UserBlog | null> {
    const { user_id, blog_post_id, title, description } = domainEntity;
    const mongooseUserBlog = new MongooseUserBlog({
      user_id,
      blog_post_id,
      title,
      description,
    });
    await mongooseUserBlog.save();
    return UserBlogSTO(mongooseUserBlog);
  }

  async merge(domainEntity: UserBlog): Promise<UserBlog | null> {
    const { id, user_id, blog_post_id, title, description } = domainEntity;
    const mongooseUserBlog = await MongooseUserBlog.findByIdAndUpdate(
      id,
      {
        user_id,
        blog_post_id,
        title,
        description,
      },
      {
        new: true,
      }
    );
    return UserBlogSTO(mongooseUserBlog);
  }

  async remove(entityId: ID): Promise<boolean | null> {
    return MongooseUserBlog.findOneAndDelete({ _id: entityId });
  }

  async removeAllByUser(entityId: ID): Promise<boolean | null> {
    const blog = await MongooseUserBlog.find({ user_id: entityId });
    for (let x = 0; x < blog.length; x++) {
      const element = blog[x];
      MongooseUserBlog.findOneAndDelete({ _id: element._id });
    }
    return true;
  }

  async get(entityId: ID): Promise<UserBlog | null> {
    const mongooseUserBlog = await MongooseUserBlog.findById(entityId);
    if (!mongooseUserBlog) return null;
    return UserBlogSTO(mongooseUserBlog);
  }

  async getByUser(user: string): Promise<UserBlog | null> {
    const mongooseUserBlog = await MongooseUserBlog.findOne({ user });
    if (!mongooseUserBlog) return null;
    return UserBlogSTO(mongooseUserBlog);
  }

  async find(): Promise<UserBlog[]> {
    const mongooseUserBlog = await MongooseUserBlog.find().sort({
      createdAt: -1,
    });
    return mongooseUserBlog
      .map((mongooseUserBlog) => UserBlogSTO(mongooseUserBlog))
      .filter((blog: UserBlog | null): blog is UserBlog => blog != null);
  }
}
