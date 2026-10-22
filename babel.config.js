module.exports = {
  plugins: ['@babel/plugin-proposal-optional-chaining'],
  presets: ["@quasar/babel-preset-app"],
  env: {
    test: {
      presets: [["@quasar/babel-preset-app", { modules: "commonjs" }]]
    },
    production: {
      plugins: [["transform-remove-console", { exclude: ["error", "warn"] }]]
    }
  }
};
