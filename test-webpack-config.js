const webpack = require('webpack');
const path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    enry: [
        './spec/module.spec.ts'
    ],
    output: {
        filename: 'dist/bundle.js'
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.LoaderOptionsPlugin({
            debug: true,
        })
    ],
    resolve: {
        extensions: ['.ts', '.js', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
            },
        ],
    },
}   