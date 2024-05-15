"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongodb_1 = __importDefault(require("./config/mongodb"));
const logger_1 = __importDefault(require("./helpers/logger"));
const task_route_1 = __importDefault(require("./route/task_route"));
const requestLogger_1 = __importDefault(require("./helpers/requestLogger"));
const middleware_1 = require("./helpers/middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json()); // parse application/json
(0, mongodb_1.default)().catch(console.dir);
app.use(requestLogger_1.default);
app.use("/api/task", task_route_1.default);
app.use(middleware_1.unknownEndpoint);
app.use(middleware_1.errorHandler);
const { PORT } = process.env || 3001;
app
    .listen(PORT, () => {
    logger_1.default.info(`Server running on port ${PORT}`);
})
    .on("error", (error) => {
    throw new Error(error.message);
});
