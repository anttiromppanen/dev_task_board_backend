import { test, expect, describe } from "vitest";
import supertest from "supertest";
import app from "../../app";

const api = supertest(app);

describe("Global test for api", () => {
  test("responds with 404 for unknown endpoint", async () => {
    const response = await api.get("/unknown");

    expect(response.statusCode).toBe(404);
    if (response.error)
      expect(response.error.text).toContain("unknown endpoint");
  });
});
