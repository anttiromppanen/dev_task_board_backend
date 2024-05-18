/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import mongoose from "mongoose";

export type IStatus = "In progress" | "Completed" | "Won't do";

export interface ITask {
  name: string;
  description: string;
  icon: string;
  status: IStatus;
}

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
  },
  icon: {
    type: String,
    required: true,
    minlength: 1,
  },
  status: {
    type: String,
    enum: {
      values: ["In progress", "Completed", "Won't do"],
      message: "{VALUE} is not supported",
    },
    required: true,
  },
});

export const TaskModel = mongoose.model("Task", taskSchema);

export interface ITaskBoard {
  name: string;
  tasks: ITask[];
}

const taskBoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [30, "Name cannot be over 30 characters long"],
  },
  tasks: [taskSchema],
});

taskSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

taskBoardSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const TaskBoard = mongoose.model("TaskBoard", taskBoardSchema);

export default TaskBoard;
