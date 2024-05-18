import express from "express";
import mongoose from "mongoose";
import logger from "../helpers/logger";
import TaskBoard, { TaskModel } from "../models/TaskBoard";

const router = express.Router();

router.get("/:taskboardId/task/:taskId", async (req, res, next) => {
  const { taskboardId, taskId } = req.params;
  let taskById;

  try {
    const taskboard = await TaskBoard.findById(taskboardId);

    if (!taskboard)
      return res.status(404).json({ error: "Taskboard not found" });

    taskById = taskboard.tasks.find((task) => task.id === taskId);

    if (!taskById) return res.status(404).json({ error: "Task not found" });
  } catch (error) {
    logger.error("Error finding task", error);
    return next(error);
  }

  return res.status(200).json(taskById);
});

router.post("/:taskboardId/task/", async (req, res, next) => {
  const { taskboardId } = req.params;
  const { name, description, icon, status } = req.body;

  if (!name || !description || !icon || !status) {
    return res.status(400).json({
      error: "All fields (name, description, icon, status) are required",
    });
  }

  const newTask = new TaskModel({
    name,
    description,
    icon,
    status,
  });

  try {
    const isTaskboardIdValid = mongoose.Types.ObjectId.isValid(taskboardId);

    if (!isTaskboardIdValid)
      return res.status(400).json({ error: "Invalid ID format" });

    const taskboardById = await TaskBoard.findById(taskboardId);

    if (!taskboardById)
      return res.status(404).json({ error: "Taskboard not found" });

    taskboardById.tasks.push(newTask);
    await taskboardById.save();
  } catch (error) {
    logger.error("Error creating new task", error);
    next(error);
  }

  return res.status(201).json(newTask);
});

router.put("/:taskBoardId/task/:taskId", async (req, res, next) => {
  const { taskBoardId, taskId } = req.params;
  const { name, description, icon, status } = req.body;
  let taskById;

  try {
    const taskBoardById = await TaskBoard.findById(taskBoardId);

    if (!taskBoardById)
      return res.status(404).json({ error: "Taskboard not found" });

    taskById = taskBoardById.tasks.find((task) => task.id === taskId);

    if (!taskById) return res.status(404).json({ error: "Task not found" });

    taskById.set("name", name);
    taskById.set("description", description);
    taskById.set("icon", icon);
    taskById.set("status", status);

    await taskById.save();
  } catch (error) {
    logger.error("Error updating task", error);
    next(error);
  }

  return res.status(200).json(taskById);
});

export default router;
