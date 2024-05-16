import {
  test,
  expect,
  describe,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest";
import supertest from "supertest";
import app from "../../app";
import {
  cleanData,
  connect,
  disconnect,
  insertInitialData,
} from "../../helpers/mongodb_memory_test_helper";

const api = supertest(app);

describe("api /api/task", () => {
  beforeAll(async () => {
    await connect();
  });
  beforeEach(async () => {
    await cleanData();
  });
  afterAll(async () => {
    await disconnect();
  });

  test("should start out with empty database", async () => {
    const response = await api.get("/api/task");
    expect(response.statusCode).toBe(200);
    expect(response.body).lengthOf(0);
  });

  test("should return all tasks", async () => {
    await insertInitialData();
    const response = await api.get("/api/task");
    expect(response.statusCode).toBe(200);
    expect(response.body).lengthOf(3);
  });
});
