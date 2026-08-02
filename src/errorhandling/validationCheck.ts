import { GraphQLError } from "graphql";
import { z, ZodError } from "zod";

export function validationCheck<T>(schema: z.ZodType<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new GraphQLError(err.issues[0].message, {
        extensions: { code: "INVALID_INPUT" },
      });
    }
    throw err;
  }
}
