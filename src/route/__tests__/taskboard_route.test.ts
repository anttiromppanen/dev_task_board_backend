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
import {
  customMongoId,
  initialTestTaskboard,
  initialTestTasks,
} from "../../helpers/test_helper";

const api = supertest(app);

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
    test("should return 200 when taskboard found", async () => {
      const mongoId = customMongoId;

      const result = await api.get(`/api/taskboard/${mongoId}`);

      expect(result.statusCode).toBe(200);
      expect(result.body.name).toEqual(initialTestTaskboard.name);
      expect(result.body.tasks).toHaveLength(initialTestTasks.length);
    });

    test("should return 404 when taskboard not found", async () => {
      const randomId = new mongoose.Types.ObjectId();
      const result = await api.get(`/api/taskboard/${randomId}`);

      expect(result.statusCode).toBe(404);
      if (result.error)
        expect(result.error.text).toContain("Taskboard not found");
    });

    test("should return 400 when invalid id", async () => {
      const invalidId = "invalidid12445";
      const result = await api.get(`/api/taskboard/${invalidId}`);

      expect(result.statusCode).toBe(400);
      if (result.error)
        expect(result.error.text).toContain("Invalid ID format");
    });
  });

  describe("POST", () => {
    test("should return 201 when taskboard created succesfully", async () => {
      const newTaskBoard = {
        name: "Test taskboard",
      };

      const result = await api
        .post("/api/taskboard")
        .set("Content-Type", "application/json")
        .send(newTaskBoard);

      expect(result.statusCode).toBe(201);
      expect(result.body.name).toEqual(newTaskBoard.name);
      expect(result.body.tasks).toEqual([]);
    });

    test("should return 400 if name is empty", async () => {
      const result = await api
        .post("/api/taskboard")
        .set("Content-Type", "application/json")
        .send({ name: "" });

      expect(result.statusCode).toBe(400);
    });

    test("should return 400 if name is over 30 characters long", async () => {
      const nameOver30 = {
        name: "asdf asdf asdf asdf asdf asdf a",
      };

      const result = await api
        .post("/api/taskboard")
        .set("Content-Type", "application/json")
        .send(nameOver30);

      expect(result.statusCode).toBe(400);
      if (result.error)
        expect(result.error.text).toContain(
          "Name cannot be over 30 characters long",
        );
    });
  });

  describe("PUT", () => {
    test("should return 200 when taskboard name updated succesfully", async () => {
      const initialBoardId = customMongoId;

      const response = await api
        .put(`/api/taskboard/${initialBoardId}`)
        .set("Content-Type", "application/json")
        .send({ name: "Updated name" });

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe("Updated name");
    });

    test("should return 404 when taskboard not found", async () => {
      const randomId = new mongoose.Types.ObjectId();

      const response = await api
        .put(`/api/taskboard/${randomId}`)
        .set("Content-Type", "application/json")
        .send({ name: "Updated name" });

      expect(response.statusCode).toBe(404);
      if (response.error)
        expect(response.error.text).toContain("Taskboard not found");
    });

    test("should return 400 when malformatted id", async () => {
      const invalidId = "invalid12342345id";

      const response = await api
        .put(`/api/taskboard/${invalidId}`)
        .set("Content-Type", "application/json")
        .send({ name: "Updated name" });

      expect(response.statusCode).toBe(400);
    });

    test("should return 404 when name is empty", async () => {
      const initialBoardId = customMongoId;

      const response = await api
        .put(`/api/taskboard/${initialBoardId}`)
        .set("Content-Type", "application/json")
        .send({ name: "" });

      expect(response.statusCode).toBe(404);
      if (response.error)
        expect(response.error.text).toContain("Name cannot be empty");
    });
  });
});
