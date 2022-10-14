import { NextFunction } from "express";
import repository from "../repositiories/repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUser = async (
  user: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  },
  next: NextFunction
) => {
  try {
    // Criptografando senha para mandar para o repository
    const saltRounds: number = parseInt(process.env.SALT_ROUNDS!);

    const cryptedPassword = await bcrypt.hash(user.password, saltRounds);

    user.password = cryptedPassword;

    const returnRepository = repository.createUserDB(user, next);
    return returnRepository;
  } catch (error: any) {
    error.status = 500;
    next(error);
  }
};

const loginUser = async (
  user: {
    email: string;
    password: string;
  },
  next: NextFunction
) => {
  try {
    const userDB = await repository.findUserDB(user, next);

    const comparePassword = await bcrypt.compare(
      user.password,
      userDB.password
    );
    if (!comparePassword) {
      const error = {
        message: "Email or password invalid",
        status: 401,
      };
      return next(error);
    } else {
      var token = jwt.sign(
        {
          email: userDB.email,
        },
        userDB.password
      );
      return token;
    }
  } catch (error) {
    next(error);
  }
};

const profileUser = async (email: any, next: NextFunction) => {
  try {
    const userDB = await repository.findProfileByEmail(email, next);
    return userDB;
  } catch (error) {
    next(error);
  }
};

export default { createUser, loginUser, profileUser };
