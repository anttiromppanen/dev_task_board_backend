import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";

const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV !== "test") {
    console.log("error:", err);
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "SyntaxError") {
    return res.status(400).json({ error: err.message });
  }

  return next(err);
};

export { unknownEndpoint, errorHandler };
