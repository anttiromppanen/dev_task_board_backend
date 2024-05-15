"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_pino_logger_1 = __importDefault(require("express-pino-logger"));
exports.default = (0, express_pino_logger_1.default)({
    level: "info",
    enabled: true,
});
