import baseConfig from "../../../eslint.config.js";
import globals from "globals";

export default [
  ...baseConfig,
  {
    ignores: ["dist"],
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.node,
    },
  },
];
