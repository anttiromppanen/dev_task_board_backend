import mongoose from "mongoose";
import TaskBoard, { ITask, TaskModel } from "../models/TaskBoard";

export const initialTestTasks: ITask[] = [
  new TaskModel({
    name: "Test task 1",
    description: "Description for test task 1",
    icon: "AcademicCap",
    status: "Completed",
  }),
  new TaskModel({
    name: "Test task 2",
    description: "Description for test task 2",
    icon: "Clock",
    status: "In progress",
  }),
  new TaskModel({
    name: "Test task 3",
    description: "Description for test task 3",
    icon: "CurrencyEuro",
    status: "Won't do",
  }),
];

export const initialTestTasksToTaskModel = initialTestTasks.map(
  (task) => new TaskModel(task),
);

export const customMongoId = new mongoose.Types.ObjectId();

export const initialTestTaskboard = new TaskBoard({
  _id: customMongoId,
  name: "Initial test taskboard",
  description: "Initial taskboard description",
  tasks: initialTestTasks,
});
