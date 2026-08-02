import { describe, it, expect, vi } from "vitest";
import { graphql } from "graphql";
import { schema } from "../src/schema"; // your built Pothos schema
import { prisma } from "../src/db";

vi.mock("../src/db", () => ({
  prisma: {
    taskList: {
      findUnique: vi.fn(),
    },
    task: {
      create: vi.fn(),
    },
  },
}));

describe("Integration test for data pipeline flowing", () => {
  it("sanitises data through Zod -> prisma and returns to user appropriate data", async () => {
    vi.mocked(prisma.taskList.findUnique).mockResolvedValueOnce({
      id: "list1",
      name: "Work",
      createdAt: new Date(),
      lastUpdated: new Date(),
    } as any);

    vi.mocked(prisma.task.create).mockImplementationOnce((args: any) =>
      Promise.resolve({
        id: "task-1",
        title: args.data.title,
        completed: false,
        taskListId: args.data.taskListId,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any),
    );

    const mutation = `
      mutation AddTask($title: String!, $taskListId: ID!) {
        addTask(title: $title, taskListId: $taskListId) {
          id
          title
          taskListId
        }
      }
    `;

    const variables = {
      title: "   buy paper   ",
      taskListId: "   list1   ",
    };

    const result = await graphql({
      schema,
      source: mutation,
      variableValues: variables,
      contextValue: {},
    });

    expect(result.errors).toBeUndefined();

    expect(prisma.task.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          title: "buy paper",
          taskListId: "list1",
        },
      }),
    );

    expect(result.data?.addTask).toEqual({
      id: "task-1",
      title: "buy paper",
      taskListId: "list1",
    });
  });
});
