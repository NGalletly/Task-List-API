import { builder } from "../builder";
import { prisma } from "../db";

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

builder.mutationField("createTaskList", (t) =>
  t.prismaField({
    type: "TaskList",
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: (query, root, args) =>
      prisma.taskList.create({
        ...query,
        data: {
          name: args.name,
        },
      }),
  }),
);

builder.mutationField("deleteTaskList", (t) =>
  t.field({
    type: "Boolean",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (root, args) => {
      await prisma.taskList.delete({
        where: {
          id: args.id,
        },
      });
      return true;
    },
  }),
);
