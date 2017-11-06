const path = require('path');
var fs = require('fs');
var webpack = require('webpack');

module.exports = {

    entry: {
        'example': './examples/index.js'
    },

    output: {
        path: path.resolve(__dirname),
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            include: [path.resolve(__dirname)],
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'stage-2'],
                    plugins: ['transform-runtime']
                }
            }
        }]
    },
    resolve: {
        alias: {}
    },
    devtool: 'source-map',
    devServer: {
        //
        contentBase: [path.join(__dirname, 'examples/'), path.join(__dirname)],
        watchContentBase: true,
        port: 8011,
        compress: true,
        stats: 'minimal',
        inline: true,
        open: true,
        // https: true,
        proxy: {
            // 工单管理
            "/api": {
                pathRewrite: {"^/api": "mock/59a51e3c7b7ac306cc2f08a8/api/"},
                target: "https://www.easy-mock.com/",
                logLevel: 'debug',
                secure: false,
                changeOrigin: true
            }
        }
    }
};
