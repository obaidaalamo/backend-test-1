import constants from "./constants";
import environment from "./environment";

// Types
import PasswordManager from "../../domain/services/PasswordManager";
import AccessTokenManager from "../../application/security/AccessTokenManager";

import Serializer from "../../interfaces/serializers/Serializer";
import BlogRepository from "../../domain/repositories/BlogRepository";
import UserRepository from "../../domain/repositories/UserRepository";
import UserBlogRepository from "../../domain/repositories/UserBlogRepository";

// Implementations

import BcryptPasswordManager from "../security/BcryptPasswordManager";
import JwtAccessTokenManager from "../security/JwtAccessTokenManager";

import UserSerializer from "../../interfaces/serializers/UserSerializer";
import BlogSerializer from "../../interfaces/serializers/BlogSerializer";
import UserBlogSerializer from "../../interfaces/serializers/UserBlogSerializer";

// Mongo
import UserRepositoryMongo from "../repositories/mongoose/UserRepositoryMongo";
import BlogRepositoryMongo from "../repositories/mongoose/BlogRepositoryMongo";
import UserBlogRepositoryMongo from "../repositories/mongoose/UserBlogRepositoryMongo";

export type ServiceLocator = {
  passwordManager: PasswordManager;
  accessTokenManager: AccessTokenManager;

  userSerializer: Serializer;
  blogSerializer: Serializer;
  userBlogSerializer: Serializer;
  userRepository?: UserRepository;
  blogRepository?: BlogRepository;
  userBlogRepository?: UserBlogRepository;
};

function buildBeans() {
  const beans: ServiceLocator = {
    passwordManager: new BcryptPasswordManager(),
    accessTokenManager: new JwtAccessTokenManager(),
    userSerializer: new UserSerializer(),
    blogSerializer: new BlogSerializer(),
    userBlogSerializer: new UserBlogSerializer(),
  };

  if (environment.database.dialect === constants.SUPPORTED_DATABASE.MONGO) {
    beans.userRepository = new UserRepositoryMongo();
    beans.blogRepository = new BlogRepositoryMongo();
    beans.userBlogRepository = new UserBlogRepositoryMongo();
  }

  return beans;
}

export default buildBeans();
