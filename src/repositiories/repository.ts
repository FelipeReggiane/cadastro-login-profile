import config from "../../knexfile";

const knex = require("knex")(config);

// register
async function createUserDB(user: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    const { name, email, password } = user;
    const newUser = await knex("users").insert({ name, email, password });
    return await newUser;
  } catch (error: any) {
    throw error;
  }
}

// login
async function findUserDB(user: { email: string; password: string }) {
  try {
    const { email, password } = user;
    const userDB = await knex("users").where({ email }).first();
    if (!userDB) {
      const error = {
        message: "Email or password invalid",
        status: 401,
      };
      throw error;
    }
    return await userDB;
  } catch (error) {
    throw error;
  }
}

// middleware to profile
async function findUserByEmail(email: string) {
  try {
    const userDB = await knex("users").where({ email }).first();
    if (!userDB) {
      const error = {
        message: "Internal server error",
        status: 500,
      };
      throw error;
    }
    return userDB;
  } catch (error) {
    throw error;
  }
}

// profile
async function findProfileByEmail(email: string) {
  try {
    const userDB = await knex("users")
      .select("name", "email")
      .where({ email })
      .first();
    if (!userDB) {
      const error = {
        message: "Internal server error",
        status: 500,
      };
      throw error;
    }
    return userDB;
  } catch (error) {
    throw error;
  }
}

export default {
  createUserDB,
  findUserDB,
  findUserByEmail,
  findProfileByEmail,
};
