module.exports = {
  preset: "jest-expo",
  watchman: false,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/.expo/"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|expo(nent)?|@expo(nent)?/.*|expo-.*|@expo/.*|@unimodules/.*|unimodules|nativewind|react-native-css-interop|@react-navigation/.*))",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
