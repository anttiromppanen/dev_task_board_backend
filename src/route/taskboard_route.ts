import express from "express";
import TaskBoard from "../models/TaskBoard";
import logger from "../helpers/logger";

const router = express.Router();

router.get("/", async (_, res) => {
  const result = await TaskBoard.find({});
  return res.status(200).json(result);
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  let result;

  try {
    result = await TaskBoard.findById(id);
    if (!result) return res.status(404).json({ error: "Taskboard not found" });
  } catch (error) {
    logger.error("Error finding taskboard", error);
    return next(error);
  }

  return res.status(200).json(result);
});

router.post("/", async (req, res, next) => {
  const { name } = req.body;

  const newTaskBoard = new TaskBoard({
    name,
    tasks: [],
  });

  let response;

  try {
    response = await newTaskBoard.save();
  } catch (error) {
    logger.error("Error saving taskboard", error);
    return next(error);
  }

  return res.status(201).json(response);
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  let taskBoardById;

  try {
    taskBoardById = await TaskBoard.findById(id);

    if (!taskBoardById)
      return res.status(404).json({ error: "Taskboard not found" });

    if (name.length <= 0)
      return res.status(404).json({ error: "Name cannot be empty" });

    taskBoardById.set("name", name);

    await taskBoardById.save();
  } catch (error) {
    logger.error("Error updating taskboard name", error);
    return next(error);
  }

  return res.status(200).json(taskBoardById);
});

export default router;
