module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/test/jest"],
  testMatch: ["**/*.spec.js"],
  transform: { "^.+\\.js$": "babel-jest" },
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^components/(.*)$": "<rootDir>/src/components/$1",
    "^boot/(.*)$": "<rootDir>/src/boot/$1",
    "^store/(.*)$": "<rootDir>/src/store/$1",
    "^layouts/(.*)$": "<rootDir>/src/layouts/$1",
    "^pages/(.*)$": "<rootDir>/src/pages/$1"
  }
};
