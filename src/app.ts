import express, { Router, urlencoded } from "express";
import { errorHandler } from "./middleware/errorHandle";
import { notFound } from "./middleware/notFound";
import cors from "cors";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();

  app.use(cors());

  app.use(express.json());

  app.use(urlencoded({ extended: true }));

  app.use("/api", apiRouter);

  app.use(notFound);

  app.use(errorHandler);

  return app;
}
