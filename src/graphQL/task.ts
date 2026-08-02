import { builder } from "../builder";
import { prisma } from "../db";
import { z } from "zod";
import { GraphQLError } from "graphql";
import { validationCheck } from "../errorhandling/validationCheck";
import { entityLookUp } from "../errorhandling/entityLookUp";

const taskSchema = z.object({
  id: z.string().trim().min(1, "Id can't be empty"),
});

const addTaskSchema = z.object({
  title: z.string().trim().min(1, "Task title can't be empty"),
  taskListId: z.string().trim().min(1, "TaskList Id can't be empty"),
});

const deleteTaskSchema = z.object({
  id: z.string().trim().min(1, "Id can't be empty"),
});

const updateTaskSchema = z.object({
  id: z.string().trim().min(1, "Id can't be empty"),
  title: z.string().trim().min(1, "Task title can't be empty.").optional(),
  completed: z.boolean().optional(),
});

const tasksQuerySchema = z.object({
  completed: z.boolean().optional(),
  taskListId: z.string().trim().min(1, "taskListId can't be empty").optional(),
  skip: z.number().int().min(0, "skip can't be negative integer").optional(),
  take: z.number().int().min(1, "take has to be at least 1").optional(),
});

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
    resolve: async (query, root, args) => {
      const { id } = validationCheck(taskSchema, { id: args.id });
      const task = await entityLookUp(
        () => prisma.task.findUnique({ ...query, where: { id } }),
        "Task",
      );
      return task;
    },
  }),
);

builder.mutationField("addTask", (t) =>
  t.prismaField({
    type: "Task",
    args: {
      title: t.arg.string({ required: true }),
      taskListId: t.arg.id({ required: true }),
    },
    resolve: async (query, root, args) => {
      const { title, taskListId } = validationCheck(addTaskSchema, {
        title: args.title,
        taskListId: args.taskListId,
      });

      await entityLookUp(
        () => prisma.taskList.findUnique({ where: { id: taskListId } }),
        "TaskList",
      );

      return prisma.task.create({
        ...query,
        data: { title, taskListId },
      });
    },
  }),
);

builder.mutationField("deleteTask", (t) =>
  t.field({
    type: "Boolean",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (root, args) => {
      const { id } = validationCheck(deleteTaskSchema, { id: args.id });

      await entityLookUp(
        () => prisma.task.findUnique({ where: { id } }),
        "Task",
      );

      await prisma.task.delete({
        where: {
          id,
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
    resolve: async (query, root, args) => {
      const { title, id, completed } = validationCheck(updateTaskSchema, {
        title: args.title,
        id: args.id,
        completed: args.completed,
      });

      await entityLookUp(
        () => prisma.task.findUnique({ where: { id } }),
        "Task",
      );

      const data: { title?: string; completed?: boolean } = {};
      if (title != null) data.title = title;
      if (completed != null) data.completed = completed;

      if (Object.keys(data).length === 0) {
        throw new GraphQLError("Nothing to update", {
          extensions: { code: "INVALID_INPUT" },
        });
      }

      return prisma.task.update({
        ...query,
        where: { id },
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
      const {
        completed,
        taskListId,
        skip: validatedSkip,
        take: validatedTake,
      } = validationCheck(tasksQuerySchema, {
        completed: args.completed,
        taskListId: args.taskListId,
        skip: args.skip,
        take: args.take,
      });

      const where = {
        ...(completed != null ? { completed } : {}),
        ...(taskListId != null ? { taskListId } : {}),
      };

      const skip = validatedSkip ?? 0;
      const take = validatedTake ?? 20;

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
