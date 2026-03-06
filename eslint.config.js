const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const prettier = require("eslint-config-prettier");

module.exports = [
  js.configs.recommended,
  ...tseslint.configs["flat/recommended"],
  prettier,
];
