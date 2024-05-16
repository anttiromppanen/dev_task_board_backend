import { ITask } from "../models/Task";

export const initialTestTasks: ITask[] = [
  {
    name: "Test task 1",
    description: "Description for test task 1",
    icon: "Test icon 1",
    status: "Completed",
  },
  {
    name: "Test task 2",
    description: "Description for test task 2",
    icon: "Test icon 2",
    status: "In progess",
  },
  {
    name: "Test task 3",
    description: "Description for test task 3",
    icon: "Test icon 3",
    status: "Won't do",
  },
];

export const taskWithValidFields: ITask | undefined = undefined;

export const taskWithInvalidFields: ITask | undefined = undefined;
