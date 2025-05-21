module.exports = {
  plugins: ['@babel/plugin-proposal-optional-chaining'],
  presets: ["@quasar/babel-preset-app"],
  env: {
    production: {
      plugins: [["transform-remove-console", { exclude: ["error", "warn"] }]]
    }
  }
};
