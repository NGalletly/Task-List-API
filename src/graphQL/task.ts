import { builder } from "../builder";
import { prisma } from "../db";

builder.prismaObject("Task", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    completed: t.exposeBoolean("completed"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    taskList: t.relation("taskList"),
    taskListId: t.exposeID("taskListId"),
  }),
});

builder.queryField("task", (t) =>
  t.prismaField({
    type: "Task",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: (query, root, args) =>
      prisma.task.findUnique({ ...query, where: { id: args.id } }),
  }),
);

builder.mutationField("addTask", (t) =>
  t.prismaField({
    type: "Task",
    args: {
      title: t.arg.string({ required: true }),
      taskListId: t.arg.id({ required: true }),
    },
    resolve: (query, root, args) =>
      prisma.task.create({
        ...query,
        data: { title: args.title, taskListId: args.taskListId },
      }),
  }),
);

builder.mutationField("deleteTask", (t) =>
  t.field({
    type: "Boolean",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (root, args) => {
      await prisma.task.delete({
        where: {
          id: args.id,
        },
      });
      return true;
    },
  }),
);

builder.mutationField("updateTask", (t) =>
  t.prismaField({
    type: "Task",
    args: {
      id: t.arg.id({ required: true }),
      title: t.arg.string({ required: false }),
      completed: t.arg.boolean({ required: false }),
    },
    resolve: (query, root, args) => {
      const data: { title?: string; completed?: boolean } = {};
      if (args.title != null) data.title = args.title;
      if (args.completed != null) data.completed = args.completed;

      return prisma.task.update({
        ...query,
        where: { id: args.id },
        data,
      });
    },
  }),
);

const TaskListResult = builder.simpleObject("TaskListResult", {
  fields: (t) => ({
    items: t.field({ type: ["Task"] }),
    totalCount: t.int(),
    hasMore: t.boolean(),
  }),
});

builder.queryField("tasks", (t) =>
  t.field({
    type: TaskListResult,
    args: {
      completed: t.arg.boolean({ required: false }),
      taskListId: t.arg.id({ required: false }),

      skip: t.arg.int({ required: false }),
      take: t.arg.int({ required: false }),
    },
    resolve: async (root, args) => {
      const where = {
        ...(args.completed != null ? { completed: args.completed } : {}),
        ...(args.taskListId != null ? { taskListId: args.taskListId } : {}),
      };

      const skip = args.skip ?? 0;
      const take = args.take ?? 20;

      const [items, totalCount] = await Promise.all([
        prisma.task.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: "asc" },
        }),
        prisma.task.count({ where }),
      ]);

      return {
        items,
        totalCount,
        hasMore: skip + items.length < totalCount,
      };
    },
  }),
);
