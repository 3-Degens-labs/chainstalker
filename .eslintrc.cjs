module.exports = {
  extends: ["eslint:recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint/eslint-plugin", "react-hooks", "import"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
  },
  env: { browser: true },
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
    "import/order": "error",
    "no-use-before-define": ["error", { classes: false }],
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parserOptions: { project: "./tsconfig.json" },
      rules: {
        "@typescript-eslint/no-var-requires": "off", // to be able to require resources, e.g. .png, .jpg
        "@typescript-eslint/ban-ts-comment": "off",
        "no-unused-vars": "off", // checked by TypeScript's 'noUnusedLocals'
      },
    },
    {
      files: ["*.cjs"],
      parserOptions: {
        project: null, // reset parserOptions from tsconfig above
      },
      env: { node: true },
    },
  ],
};
