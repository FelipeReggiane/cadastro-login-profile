import type { Knex } from "knex";

// Update with your config settings.

const config: Knex.Config = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    port: 3333,
    user: "user",
    password: "password",
    database: "db",
  },
};

export default config;