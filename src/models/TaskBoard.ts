/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import mongoose from "mongoose";

// must match the status field from schema
export type IStatus = "In progress" | "Completed" | "Won't do" | "Todo";
// must match the icon field from schema
type IconType =
  | "Clock"
  | "AcademicCap"
  | "Camera"
  | "CalendarDays"
  | "CurrencyEuro"
  | "PresentationChart";

export interface ITask {
  name: string;
  description: string;
  icon: IconType;
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
  },
  icon: {
    type: String,
    enum: {
      values: [
        "Clock",
        "AcademicCap",
        "Camera",
        "CalendarDays",
        "CurrencyEuro",
        "PresentationChart",
      ],
      message: "{VALUE} is not supported",
    },
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: ["In progress", "Completed", "Won't do", "Todo"],
      message: "{VALUE} is not supported",
    },
    required: true,
  },
});

export const TaskModel = mongoose.model("Task", taskSchema);

export interface ITaskBoard {
  name: string;
  description: string;
  tasks: ITask[];
}

const taskBoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [30, "Name cannot be over 30 characters long"],
  },
  description: String,
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
