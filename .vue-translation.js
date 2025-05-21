const path = require("path");
const { JSONAdapter } = require("vue-translation-manager");

module.exports = {
  srcPath: path.join(__dirname, "src/"),
  adapter: new JSONAdapter({
    path: path.join(__dirname, "src/i18n/")
  }),
  languages: ["en-us"]
};
