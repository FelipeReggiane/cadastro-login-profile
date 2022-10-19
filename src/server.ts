import express, { NextFunction, Request, Response } from "express";
import { router } from "./routes";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use(router);

// catch all
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500);
  res.json({ error: error.message });
});

export default app;