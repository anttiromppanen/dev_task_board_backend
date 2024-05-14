import express from "express";
import Task from "../models/Task";

const router = express.Router();

router.get("/", (_, res) => res.json({ test: "test" }));

router.post("/", (req, res) => {
  const { name, description, icon, status } = req.body;

  const newTask = Task.build({
    name,
    description,
    icon,
    status,
  });

  res.json({ test: "test post" });
});

export default router;
