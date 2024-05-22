import express from "express";
import TaskBoard from "../models/TaskBoard";
import logger from "../helpers/logger";

const router = express.Router();

router.get("/", async (_, res) => {
  const result = await TaskBoard.find({});
  return res.status(200).json(result);
});

// post used instead of get for returning data for ease of use
router.post("/get-multiple", async (req, res, next) => {
  const { taskboards } = req.body;
  let result;

  try {
    result = await TaskBoard.find().where("_id").in(taskboards).exec();
  } catch (error) {
    logger.error(error);
    return next(error);
  }
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
  const { name, description } = req.body;

  const newTaskBoard = new TaskBoard({
    name,
    description: description || "",
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
  const { name, description } = req.body;
  let taskBoardById;

  try {
    taskBoardById = await TaskBoard.findById(id);

    if (!taskBoardById)
      return res.status(404).json({ error: "Taskboard not found" });

    if (name.length <= 0)
      return res.status(404).json({ error: "Name cannot be empty" });

    taskBoardById.set("name", name);
    taskBoardById.set("description", description || "");

    await taskBoardById.save();
  } catch (error) {
    logger.error("Error updating taskboard name", error);
    return next(error);
  }

  return res.status(200).json(taskBoardById);
});

export default router;
