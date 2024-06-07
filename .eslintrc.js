module.exports = {
  root: true,
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 2022,
    requireConfigFile: false,
  },
  env: {
    node: true,
    es6: true,
    mocha: true,
  },
  globals: {
    ONE_MINUTE: "readonly",
    ONE_DAY: "readonly",
  },
  extends: ["eslint:recommended", "prettier"],
  rules: {
    "arrow-parens": ["error", "always"],
    camelcase: "error",
    indent: ["error", 2, { SwitchCase: 1 }],
    "no-unused-vars": ["error", { vars: "all", args: "after-used" }],
    "no-var": "error",
    "one-var": ["error", { const: "never", let: "consecutive" }],
  },
  overrides: [
    {
      files: "./src/**/*.js",
    },
  ],
};
