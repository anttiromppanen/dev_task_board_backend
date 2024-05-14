"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./logger/logger"));
const requestLogger_1 = __importDefault(require("./logger/requestLogger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(requestLogger_1.default);
const { PORT } = process.env;
app.get("/", (_, res) => res.status(200).send({ text: "Hello world" }));
app
    .listen(PORT, () => {
    logger_1.default.info(`Server running on port ${PORT}`);
})
    .on("error", (error) => {
    throw new Error(error.message);
});
