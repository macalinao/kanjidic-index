"use strict";

// Required in Yarn 2 (PNP)
// https://github.com/yarnpkg/berry/issues/8#issuecomment-681069562
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  env: {
    browser: true,
  },
  extends: ["@saberhq/eslint-config"],
  parserOptions: {
    project: ["tsconfig.json"],
  },
};
