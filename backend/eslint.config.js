import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: { globals: { ...globals.browser, process: "readonly" } },
    rules: {
      "no-console": "warn", // Custom rule to warn on console.log statements
    },
  },

  pluginJs.configs.recommended,
];
