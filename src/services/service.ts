import { NextFunction } from "express";
import repository from "../repositiories/repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUser = async (user: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    // Criptografando senha para mandar para o repository
    const saltRounds: number = parseInt(process.env.SALT_ROUNDS!);

    const cryptedPassword = await bcrypt.hash(user.password, saltRounds);

    user.password = cryptedPassword;

    const returnRepository = await repository.createUserDB(user);
    return returnRepository;
  } catch (error: any) {
    const err = { message: "Internal server errror", status: 500 };
    if (error.code === "ER_DUP_ENTRY") {
      err.message = "Email provided already exists";
      err.status = 409;
    }
    throw err;
  }
};

const loginUser = async (user: { email: string; password: string }) => {
  try {
    const userDB = await repository.findUserDB(user);
    const comparePassword = await bcrypt.compare(
      user.password,
      userDB.password
    );
    if (!comparePassword) {
      const err = {
        message: "Email or password invalid",
        status: 401,
      };
      throw err;
    } else {
      var token = jwt.sign(
        {
          email: userDB.email,
        },
        userDB.password
      );
      return token;
    }
  } catch (error: any) {
    if (error.status === 401) {
      const err = {
        message: "Email or password invalid",
        status: 401,
      };
      throw err;
    }
    throw error;
  }
};

const profileUser = async (email: any) => {
  try {
    const userDB = await repository.findProfileByEmail(email);
    return userDB;
  } catch (error) {
    throw error;
  }
};

export default { createUser, loginUser, profileUser };
