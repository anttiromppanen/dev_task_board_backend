"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.unknownEndpoint = void 0;
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};
exports.unknownEndpoint = unknownEndpoint;
const errorHandler = (err, req, res, next) => {
    console.log("error:", err);
    if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
    }
    if (err.name === "SyntaxError") {
        return res.status(400).json({ error: err.message });
    }
    return next(err);
};
exports.errorHandler = errorHandler;
