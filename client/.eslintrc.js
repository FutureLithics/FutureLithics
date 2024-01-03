module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["prettier", "eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "prettier"],
  rules: {
    "no-mixed-spaces-and-tabs": 1,
    "no-unused-vars": 1,
  },
};
