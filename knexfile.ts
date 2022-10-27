import type { Knex } from "knex";
import * as dotenv from "dotenv";

dotenv.config();

// Update with your config settings.

const config: Knex.Config = {
  client: process.env.CLIENT,
  connection: {
    host: process.env.HOST,
    port: Number(process.env.PORT),
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
};

export default config;
