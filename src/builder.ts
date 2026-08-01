import { prisma } from "./db";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "./generated/pothos-types";
import { getDatamodel } from "./generated/pothos-types";

export const builder = new SchemaBuilder<{
  Scalars: { DateTime: { Input: Date; Output: Date } };
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: { client: prisma, dmmf: getDatamodel() },
});

builder.scalarType("DateTime", {
  serialize: (date) => new Date(date).toISOString(),
  parseValue: (date) => new Date(date as string),
});

builder.queryType({});

builder.mutationType({});
