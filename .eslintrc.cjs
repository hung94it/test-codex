module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "eslint:recommended", "eslint-config-prettier"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json"
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off"
  }
};
