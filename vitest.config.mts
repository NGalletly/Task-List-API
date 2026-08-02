import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    server: {
      deps: {
        inline: ["graphql", /@pothos/],
      },
    },
  },
  ssr: {
    noExternal: ["graphql"],
  },
  resolve: {
    alias: {
      graphql: path.resolve(import.meta.dirname, "./node_modules/graphql"),
    },
  },
});
