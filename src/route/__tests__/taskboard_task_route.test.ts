/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";
import supertest from "supertest";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import app from "../../app";
import {
  cleanData,
  connect,
  disconnect,
  insertInitialData,
} from "../../helpers/mongodb_memory_test_helper";
import { customMongoId, initialTestTasks } from "../../helpers/test_helper";

const api = supertest(app);

const newNote = {
  name: "New test note",
  description: "New description",
  icon: "New icon",
  status: "Won't do",
};

describe("api /api/taskboard", () => {
  beforeAll(async () => {
    await connect();
  });
  beforeEach(async () => {
    await insertInitialData();
  });
  afterAll(async () => {
    await cleanData();
    await disconnect();
  });

  describe("GET", () => {
    test("should return 200 for valid request", async () => {
      const boardId = customMongoId;

      const board = await api.get(`/api/taskboard/${boardId}`);
      const firstTask = board.body.tasks[0];

      const response = await api.get(
        `/api/taskboard/${boardId}/task/${firstTask.id}`,
      );

      const initialTask = initialTestTasks[0];

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toStrictEqual(initialTask.name);
      expect(response.body.description).toStrictEqual(initialTask.description);
      expect(response.body.icon).toStrictEqual(initialTask.icon);
      expect(response.body.status).toStrictEqual(initialTask.status);
    });
  });

  describe("POST", () => {
    test("should return 201 for succesfull creation", async () => {
      const taskboardId = customMongoId;

      const response = await api
        .post(`/api/taskboard/${taskboardId}/task`)
        .set("Content-Type", "application/json")
        .send(newNote);

      expect(response.statusCode).toBe(201);
      expect(response.body.name).toEqual(newNote.name);
      expect(response.body.description).toEqual(newNote.description);
      expect(response.body.icon).toEqual(newNote.icon);
      expect(response.body.status).toEqual(newNote.status);
    });

    test("should return 400 when fields are missing", async () => {
      const { name, ...noteWithoutName } = newNote;
      const { description, ...noteWithoutDescription } = newNote;
      const { icon, ...noteWithoutIcon } = newNote;
      const { status, ...noteWithoutStatus } = newNote;

      const taskboardId = customMongoId;

      await api
        .post(`/api/taskboard/${taskboardId}/task`)
        .set("Content-Type", "application/json")
        .send(noteWithoutName)
        .expect(400);

      await api
        .post(`/api/taskboard/${taskboardId}/task`)
        .set("Content-Type", "application/json")
        .send(noteWithoutDescription)
        .expect(400);

      await api
        .post(`/api/taskboard/${taskboardId}/task`)
        .set("Content-Type", "application/json")
        .send(noteWithoutIcon)
        .expect(400);

      await api
        .post(`/api/taskboard/${taskboardId}/task`)
        .set("Content-Type", "application/json")
        .send(noteWithoutStatus)
        .expect(400);
    });

    test("should return 404 when taskboard not found", async () => {
      const randomTaskboardId = new mongoose.Types.ObjectId();

      const response = await api
        .post(`/api/taskboard/${randomTaskboardId}/task`)
        .set("Content-Type", "application/json")
        .send(newNote);

      expect(response.statusCode).toBe(404);
      if (response.error)
        expect(response.error.text).toContain("Taskboard not found");
    });

    test("should return 400 when malformatted id", async () => {
      const invalidId = "aasdf234234fsda";

      const response = await api
        .post(`/api/taskboard/${invalidId}/task`)
        .set("Content-Type", "application/json")
        .send(newNote);

      expect(response.statusCode).toBe(400);
      if (response.error)
        expect(response.error.text).toContain("Invalid ID format");
    });
  });

  describe("PUT", () => {
    test("should return 200 for successful update", async () => {
      const taskboardId = customMongoId;
      const taskboard = await api.get(`/api/taskboard/${taskboardId}`);
      const firstTask = taskboard.body.tasks[0];

      await api
        .put(`/api/taskboard/${taskboardId}/task/${firstTask.id}`)
        .set("Content-Type", "application/json")
        .send({ ...firstTask, description: "Updated task" })
        .expect(200);

      await api
        .put(`/api/taskboard/${taskboardId}/task/${firstTask.id}`)
        .set("Content-Type", "application/json")
        .send({ ...firstTask, name: "Updated name" })
        .expect(200);

      await api
        .put(`/api/taskboard/${taskboardId}/task/${firstTask.id}`)
        .set("Content-Type", "application/json")
        .send({ ...firstTask, icon: "Updated icon" })
        .expect(200);

      await api
        .put(`/api/taskboard/${taskboardId}/task/${firstTask.id}`)
        .set("Content-Type", "application/json")
        .send({ ...firstTask, status: "In progress" })
        .expect(200);
    });

    test("should update fields when successful request", async () => {
      const taskboardId = customMongoId;
      const taskboard = await api.get(`/api/taskboard/${taskboardId}`);
      const firstTask = taskboard.body.tasks[0];

      const response = await api
        .put(`/api/taskboard/${taskboardId}/task/${firstTask.id}`)
        .set("Content-Type", "application/json")
        .send({
          name: "Updated name",
          description: "Updated task",
          icon: "Updated icon",
          status: "Won't do",
        })
        .expect(200);

      expect(response.body.tasks[0]).toStrictEqual({
        id: firstTask.id,
        name: "Updated name",
        description: "Updated task",
        icon: "Updated icon",
        status: "Won't do",
      });
    });

    test("should return 404 when taskboard not found", async () => {
      const randomTaskboardId = new mongoose.Types.ObjectId();

      const response = await api
        .put(`/api/taskboard/${randomTaskboardId}/task/task1234`)
        .set("Content-Type", "application/json")
        .send({});

      expect(response.statusCode).toBe(404);
      if (response.error)
        expect(response.error.text).toContain("Taskboard not found");
    });

    test("should return 404 when task not found", async () => {
      const taskboardId = customMongoId;

      const response = await api
        .put(`/api/taskboard/${taskboardId}/task/task1234`)
        .set("Content-Type", "application/json")
        .send({});

      expect(response.statusCode).toBe(404);
      if (response.error)
        expect(response.error.text).toContain("Task not found");
    });

    test("should not accepct empty values", async () => {
      const taskboardId = customMongoId;
      const taskboard = await api.get(`/api/taskboard/${taskboardId}`);
      const firstTask = taskboard.body.tasks[0];
      const newValues = { name: "", description: "", icon: "", status: "" };

      const response = await api
        .put(`/api/taskboard/${taskboardId}/task/${firstTask.id}`)
        .set("Content-Type", "application/json")
        .send(newValues);

      expect(response.statusCode).toBe(200);
      expect(response.body.tasks[0]).toStrictEqual(firstTask);
    });
  });
});
