import { describe, it, expect, vi } from "vitest";
import { graphql } from "graphql";
import { schema } from "../src/schema";
import { prisma } from "../src/db";

vi.mock("../src/db", () => ({
  prisma: {
    task: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("deleteTask bad path error handling check", () => {
  it("returns a not found error instead of crashing when the task doesn't exist", async () => {
    vi.mocked(prisma.task.findUnique).mockResolvedValueOnce(null);

    const mutation = `
      mutation DeleteTask($id: ID!) {
        deleteTask(id: $id)
      }
    `;

    const result = await graphql({
      schema,
      source: mutation,
      variableValues: { id: "does-not-exist" },
    });

    expect(result.errors?.[0]?.message).toBe("Task not found");
    expect(result.errors?.[0]?.extensions?.code).toBe("NOT_FOUND");
    expect(prisma.task.delete).not.toHaveBeenCalled();
  });
});
