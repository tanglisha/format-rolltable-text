// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const CopyPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const moduleExcludes = (env) => {
    if (isProduction) {
        return [
          "/node_modules/",
        ];
    }
    return [];
};

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
  devtool: "source-map",
  mode: isProduction ? "production" : "development",
  entry: {
    module: "./src/esmodules/module.ts",
    // foundry: env.FOUNDRY_HOME + "/resources/app/main.mjs"
  },
  watch: isProduction ? false : true,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "esmodules/[name].js",
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "module.json", to: "module.json" },
        { from: "templates/**/*", to: "." },
        { from: "styles/**/*", to: "." },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
}),

    new RemoveEmptyScriptsPlugin(),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        // module typescript files
        test: /\.(ts|tsx)$/i,
        exclude: moduleExcludes(),
        use: ["ts-loader"],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|json)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
    modules: ["node_modules"],
  },
  stats: {
    children: true,
  },
};

// config.context = path.resolve(__dirname, 'src');

module.exports = () => {
  if (isProduction) {
    // prod mode
    config.mode = "production";
  } else {
    // dev mode
    // config.module.rules.push({
    //     test: /\.(ts|tsx)$/i,
    //     include: [
    //       /\.test\.(ts|tsx)$/i,
    //     ],
    //     use: ["ts-loader"]
    //   });
    config.mode = "development";
    // config.entry.tests = {
    //   filename: "./__tests__/module.test.ts",
    //   import: "./__tests__/primary.test.ts",
    // };
  }
  return config;
};
