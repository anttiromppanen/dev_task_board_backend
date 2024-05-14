/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import mongoose from "mongoose";

interface ITask {
  name: string;
  description: string;
  icon: string;
  status: string;
}

interface TaskModelInterface extends mongoose.Model<any> {
  build(attr: ITask): any;
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

const Task = mongoose.model<any, TaskModelInterface>("Task", taskSchema);
// adds build function to schema statics
taskSchema.statics.build = (attr: ITask) => new Task(attr);

export default Task;
