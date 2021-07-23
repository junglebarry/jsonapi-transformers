module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/spec"],
  testMatch: ["**/*.spec.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
