import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDb from "./config/mongodb";
import logger from "./helpers/logger";
import taskRoute from "./route/task_route";
import requestLogger from "./helpers/requestLogger";
import { errorHandler, unknownEndpoint } from "./helpers/middleware";

dotenv.config();
const app = express();
app.use(bodyParser.json()); // parse application/json

connectDb().catch(console.dir);

app.use(requestLogger);
app.use("/api/task", taskRoute);

app.use(unknownEndpoint);
app.use(errorHandler);

const { PORT } = process.env || 3001;

app
  .listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
