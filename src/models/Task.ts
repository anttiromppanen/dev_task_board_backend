/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import mongoose from "mongoose";

export type IStatus = "In progess" | "Completed" | "Won't do";

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
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: ["In progess", "Completed", "Won't do"],
      message: "{VALUE} is not supported",
    },
    required: true,
  },
});

taskSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
