import { Request, Response } from "express";
import { ValidationError } from "joi";
import ListBlog from "../../application/use_cases/user_blog/ListBlog";
import GetBlog from "../../application/use_cases/user_blog/GetBlog";
import CreateBlog from "../../application/use_cases/user_blog/CreateBlog";
import UpdateBlog from "../../application/use_cases/user_blog/UpdateBlog";
import DeleteBlog from "../../application/use_cases/user_blog/DeleteBlog";
import { ServiceLocator } from "../../infrastructure/config/service-locator";
import UserBlog from "../../domain/entities/UserBlog";

export default {
  async findUserBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    const userId = request.params.id;

    // Treatment
    const userBlogs = await ListBlog(userId, serviceLocator);

    // Output
    const output = userBlogs.map((userBlog: UserBlog) =>
      serviceLocator.userBlogSerializer.serialize(userBlog, serviceLocator)
    );
    return response.json(output);
  },

  async getUserBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    const userId = request.params.id;

    // Treatment
    let user_blog = null;
    try {
      user_blog = await GetBlog(userId, serviceLocator);
    } catch (err) {
      console.log(err);
    }

    // Output
    if (!user_blog) {
      return response.status(404).json({ message: "Not Found" });
    }
    const output = serviceLocator.userBlogSerializer.serialize(
      user_blog,
      serviceLocator
    );
    return response.json(output);
  },

  async createUserBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    let data = request.body;
    data = {
      user_id: data.user_id,
      blog_post_id: data.blog_post_id,
      title: data.title,
      description: data.description,
    };

    // Treatment
    let user_blog = null;
    let error = null;
    try {
      user_blog = await CreateBlog(data, serviceLocator);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        error = err.details[0].message;
      } else if (err instanceof Error) {
        // 'Error occurred while creating user_blog'
        error = err.message;
      }
    }

    // Output
    if (!user_blog) {
      return response.status(400).json({ message: error });
    }
    const output = serviceLocator.userBlogSerializer.serialize(
      user_blog,
      serviceLocator
    );
    return response.status(201).json(output);
  },

  async updateUserBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    const userBlogId = request.params.id;
    const inputData = request.body;
    const data: any = {
      id: userBlogId,
    };

    const acceptedFields: string[][] = [["title"], ["description"]];
    acceptedFields.forEach((acceptedField) => {
      if (inputData[acceptedField[0]] === undefined) return;
      data[acceptedField.length > 1 ? acceptedField[1] : acceptedField[0]] =
        inputData[acceptedField[0]];
    });

    // Treatment
    let userBlog = null;
    let error = null;
    try {
      userBlog = await UpdateBlog(data, serviceLocator);
    } catch (err) {
      if (err instanceof ValidationError) {
        error = err.details[0].message;
      } else if (err instanceof Error) {
        // 'Error occurred while creating userBlog'
        error = err.message;
      }
    }

    // Output
    if (!userBlog) {
      return response.status(400).json({ message: error });
    }
    const output = serviceLocator.userBlogSerializer.serialize(
      userBlog,
      serviceLocator
    );
    return response.json(output);
  },

  async deleteUserBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    const toDeleteBlogId = request.params.id;

    // ---------------------------------------------
    // THIS IS HOW TO ACCESS userId FROM AccessToken
    // ---------------------------------------------
    const userId = request.userId;
    // ---------------------------------------------
    // ---------------------------------------------

    // Treatment
    let user = null;

    try {
      user = await DeleteBlog(toDeleteBlogId, serviceLocator);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err);
      }
    }

    // Output
    if (!user) {
      return response.status(404).json({ message: "Not Found" });
    }
    return response.sendStatus(204);
  },
};
