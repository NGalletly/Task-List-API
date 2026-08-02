import { builder } from "../builder";
import { prisma } from "../db";
import { z } from "zod";
import { validationCheck } from "../errorhandling/validationCheck";
import { entityLookUp } from "../errorhandling/entityLookUp";

const addTaskListSchema = z.object({
  name: z.string().trim().min(1, "Task List name can't be empty"),
});

const deleteTaskListSchema = z.object({
  id: z.string().trim().min(1, "id can't be empty"),
});

builder.prismaObject("TaskList", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    lastUpdated: t.expose("lastUpdated", { type: "DateTime" }),
    tasks: t.relation("tasks"),
  }),
});

builder.queryField("taskLists", (t) =>
  t.prismaField({
    type: ["TaskList"],
    resolve: (query) => prisma.taskList.findMany({ ...query }),
  }),
);

builder.mutationField("addTaskList", (t) =>
  t.prismaField({
    type: "TaskList",
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: (query, root, args) => {
      const { name } = validationCheck(addTaskListSchema, { name: args.name });
      return prisma.taskList.create({
        ...query,
        data: { name },
      });
    },
  }),
);

builder.mutationField("deleteTaskList", (t) =>
  t.field({
    type: "Boolean",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (root, args) => {
      const { id } = validationCheck(deleteTaskListSchema, { id: args.id });
      await entityLookUp(
        () => prisma.taskList.findUnique({ where: { id } }),
        "TaskList",
      );
      await prisma.taskList.delete({
        where: {
          id,
        },
      });
      return true;
    },
  }),
);
