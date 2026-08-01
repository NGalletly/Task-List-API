import "./graphQL/task-list";
import "./graphQL/task";
import { builder } from "./builder";

export const schema = builder.toSchema();
