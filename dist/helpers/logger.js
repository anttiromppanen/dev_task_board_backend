"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
exports.default = (0, pino_1.default)({
    level: process.env.PINO_LOG_LEVEL || "info",
    formatters: {
        level: (label) => ({ level: label.toUpperCase() }),
    },
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
});
