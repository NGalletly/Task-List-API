import { GraphQLError } from "graphql";

export async function entityLookUp<T>(
  find: () => Promise<T | null>,
  entityName: string,
): Promise<T> {
  const result = await find();
  if (!result) {
    throw new GraphQLError(`${entityName} not found`, {
      extensions: { code: "NOT_FOUND" },
    });
  }
  return result;
}
