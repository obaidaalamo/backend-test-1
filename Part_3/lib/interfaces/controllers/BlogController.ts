import { Request, Response } from "express";
import { ValidationError } from "joi";
import ListBlog from "../../application/use_cases/blog/ListBlog";
import GetBlog from "../../application/use_cases/blog/GetBlog";
import CreateBlog from "../../application/use_cases/blog/CreateBlog";
import UpdateBlog from "../../application/use_cases/blog/UpdateBlog";
import DeleteBlog from "../../application/use_cases/blog/DeleteBlog";
import { ServiceLocator } from "../../infrastructure/config/service-locator";
import Blog from "../../domain/entities/Blog";

export default {
  async findBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    const userId = request.params.id;

    // Treatment
    const blogs = await ListBlog(userId, serviceLocator);

    // Output
    const output = blogs.map((blog: Blog) =>
      serviceLocator.blogSerializer.serialize(blog, serviceLocator)
    );
    return response.json(output);
  },

  async getBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    const userId = request.params.id;

    // Treatment
    let blog = null;
    try {
      blog = await GetBlog(userId, serviceLocator);
    } catch (err) {
      console.log(err);
    }

    // Output
    if (!blog) {
      return response.status(404).json({ message: "Not Found" });
    }
    const output = serviceLocator.blogSerializer.serialize(
      blog,
      serviceLocator
    );
    return response.json(output);
  },

  async createBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    let data = request.body;
    data = {
      user: data.user,
      title: data.title,
      description: data.description,
      main_image: data.main_image,
      additional_images: data.additional_images,
      date_time: data.date_time,
    };

    // Treatment
    let blog = null;
    let error = null;
    try {
      blog = await CreateBlog(data, serviceLocator);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        error = err.details[0].message;
      } else if (err instanceof Error) {
        // 'Error occurred while creating blog'
        error = err.message;
      }
    }

    // Output
    if (!blog) {
      return response.status(400).json({ message: error });
    }
    const output = serviceLocator.blogSerializer.serialize(
      blog,
      serviceLocator
    );
    return response.status(201).json(output);
  },

  async updateBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    const blogId = request.params.id;
    const inputData = request.body;
    const data: any = {
      id: blogId,
    };

    const acceptedFields: string[][] = [
      ["title"],
      ["description"],
      ["main_image"],
      ["additional_images"],
      ["date_time"],
    ];
    acceptedFields.forEach((acceptedField) => {
      if (inputData[acceptedField[0]] === undefined) return;
      data[acceptedField.length > 1 ? acceptedField[1] : acceptedField[0]] =
        inputData[acceptedField[0]];
    });

    // Treatment
    let blog = null;
    let error = null;
    try {
      blog = await UpdateBlog(data, serviceLocator);
    } catch (err) {
      if (err instanceof ValidationError) {
        error = err.details[0].message;
      } else if (err instanceof Error) {
        // 'Error occurred while creating blog'
        error = err.message;
      }
    }

    // Output
    if (!blog) {
      return response.status(400).json({ message: error });
    }
    const output = serviceLocator.blogSerializer.serialize(
      blog,
      serviceLocator
    );
    return response.json(output);
  },

  async deleteBlog(request: Request, response: Response) {
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
