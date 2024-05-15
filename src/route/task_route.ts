import express from "express";
import Task from "../models/Task";

const router = express.Router();

router.get("/", async (_, res) => {
  const result = await Task.find({});
  return res.status(200).json(result);
});

router.post("/", async (req, res, next) => {
  const { name, description, icon, status } = req.body;

  const newTask = new Task({
    name,
    description,
    icon,
    status,
  });

  try {
    const result = await newTask.save();
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
