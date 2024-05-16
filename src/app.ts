import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import { errorHandler, unknownEndpoint } from "./helpers/middleware";
import requestLogger from "./helpers/requestLogger";
import taskRoute from "./route/task_route";

dotenv.config();
const app = express();
app.use(bodyParser.json()); // parse application/json

app.use(requestLogger);
app.use("/api/task", taskRoute);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
