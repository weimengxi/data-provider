const path = require('path');
var fs = require('fs');
var webpack = require('webpack');

module.exports = {

    entry: {
        'examples/example': './examples/index.js'
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
        contentBase: [path.join(__dirname, 'examples/'), path.join(__dirname, 'src/')],
        watchContentBase: true,
        port: 8011,
        compress: true,
        stats: 'minimal',
        inline: true,
        open: true,
        https: true,
        host: 'w.xiangyun.org',
        proxy: {
            // 工单管理
            "/api": {
                pathRewrite: {"^/api": ""},
                target: "https://weimengxi.xiangyun.org/",
                logLevel: 'debug',
                secure: false,
                changeOrigin: true,
            }
        }
    }
};