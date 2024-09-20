// Generated using webpack-cli https://github.com/webpack/webpack-cli
const CopyPlugin = require("copy-webpack-plugin");

const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = 'style-loader';

const config = {
    entry: [
        './src/esmodules/module.ts',
    ],
    watch: isProduction ? false : true,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "esmodules/module.js",
        clean: true,
    },
    plugins: [
        new CopyPlugin({
            patterns: [

              { from: "./static"},
            ],
            options: {
              concurrency: 100,
            },
          }),
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|json)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
};

// config.context = path.resolve(__dirname, `src`)

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
    } else {
        config.mode = 'development';
        config.watch = true;
    }

    return config;
};
