const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    bundlesource: "./src/source.js",
    bundledatabase: "./src/database.js",
    bundlecustomer: "./src/customer.js",
  },

  output: {
    path: path.resolve(__dirname, "dist/bundles"),
    filename: "[name].js",
  },
  watch: true,
};
