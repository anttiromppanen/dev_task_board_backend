import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import { errorHandler, unknownEndpoint } from "./helpers/middleware";
import requestLogger from "./helpers/requestLogger";
import taskboardRoute from "./route/taskboard_route";
import taskboardTaskRoute from "./route/taskboard_task_route";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json()); // parse application/json

app.use(requestLogger);
app.use("/api/taskboard", taskboardRoute);
app.use("/api/taskboard/", taskboardTaskRoute);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
