const { resolve } = require("path");

module.exports = (config) => {
  config.set({
    // ... normal karma configuration

    // make sure to include webpack as a framework
    frameworks: ["jasmine", "webpack"],

    plugins: ["karma-*"],

    files: [
      // all files ending in ".test.js"
      // !!! use watched: false as we use webpacks watch
      { pattern: "spec/**/*.spec.ts", watched: false },
    ],

    preprocessors: {
      // add webpack as preprocessor
      "spec/**/*.spec.ts": ["webpack", "sourcemap"],
    },

    webpack: {
      // karma watches the test entry points
      // Do NOT specify the entry option
      // webpack watches dependencies

      // webpack configuration
      resolve: {
        extensions: [".ts", ".js", ".tsx", ".jsx"],
      },
      module: {
        // loaders: { test: /\.tsx$/, loader: "ts-loader" },
      },
      stats: {
        colors: true,
        timings: true,
        modules: false,
        reasons: true,
        errorDetails: true,
      },
      devtool: "inline-source-map",
    },
    reporters: ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    concurrency: Infinity,
  });
};
