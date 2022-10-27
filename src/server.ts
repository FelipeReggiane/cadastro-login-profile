import express, { Request, Response } from "express";
import { router } from "./routes";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use(router);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// catch all
app.use((error: any, req: Request, res: Response) => {
  res.status(error.status || 500);
  res.json({ error: error.message, stack: error.stack });
});

export default app;
