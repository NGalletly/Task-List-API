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
