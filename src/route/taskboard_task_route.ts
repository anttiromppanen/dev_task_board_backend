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
    return next(error);
  }

  return res.status(201).json(newTask);
});

router.put("/:taskboardId/task/:taskId", async (req, res, next) => {
  const { taskboardId, taskId } = req.params;
  const { name, description, icon, status } = req.body;
  let taskById;
  let taskBoardById;

  try {
    taskBoardById = await TaskBoard.findById(taskboardId);

    if (!taskBoardById)
      return res.status(404).json({ error: "Taskboard not found" });

    taskById = taskBoardById.tasks.find((task) => task.id === taskId);

    if (!taskById) return res.status(404).json({ error: "Task not found" });

    // description can be an empty string
    taskById.set("description", description);
    if (name.length > 0) taskById.set("name", name);
    if (icon.length > 0) taskById.set("icon", icon);
    if (
      status.length > 0 ||
      status === "In progress" ||
      status === "Completed" ||
      status === "Won't do" ||
      status === "Todo"
    )
      taskById.set("status", status);

    await taskBoardById.save();
  } catch (error) {
    logger.error("Error updating task", error);
    return next(error);
  }

  return res.status(200).json(taskBoardById);
});

router.delete("/:taskboardId/task/:taskId", async (req, res, next) => {
  const { taskboardId, taskId } = req.params;
  let taskBoardById;

  // starts a new transaction to ensure atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    taskBoardById = await TaskBoard.findById(taskboardId).session(session);

    if (!taskBoardById)
      return res.status(404).json({ error: "Taskboard not found" });

    const taskIndex = taskBoardById.tasks.findIndex(
      (task) => task.id === taskId,
    );

    if (taskIndex === -1)
      return res.status(404).json({ error: "Task not found" });

    taskBoardById.tasks.splice(taskIndex, 1);

    await taskBoardById.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(204).json({});
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    logger.error("Error deleting task", error);
    return next(error);
  }
});

export default router;
