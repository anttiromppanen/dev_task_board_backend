import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import logger from "./logger";

const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("error:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "SyntaxError") {
    return res.status(400).json({ error: err.message });
  }

  return next(err);
};

export { unknownEndpoint, errorHandler };
