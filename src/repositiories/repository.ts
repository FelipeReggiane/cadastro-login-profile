import { NextFunction } from "express";
import { updateWhile } from "typescript";
import config from "../../knexfile";

const knex = require("knex")(config);

// register
async function createUserDB(
  user: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  },
  next: NextFunction
) {
  try {
    const { name, email, password } = user;
    const newUser = await knex("users").insert({ name, email, password });
    return await newUser;
  } catch (error: any) {
    console.log({ error: error.message });
    if (error.code === "ER_DUP_ENTRY") {
      error.message = "This email is already in use, please choose other";
      error.status = 409;
      next(error);
    }
    next(error);
  }
}

// login
async function findUserDB(
  user: {
    email: string;
    password: string;
  },
  next: NextFunction
) {
  try {
    const { email, password } = user;
    const userDB = await knex("users").where({ email }).first();
    console.log({ userDB });
    if (!userDB) {
      console.log("entrou if");
      const error = {
        message: "Email or password invalid",
        status: 401,
      };
      throw error;
    }
    return userDB;
  } catch (error) {
    console.log("entrou catch");
    next(error);
  }
}

export default { createUserDB, findUserDB };
