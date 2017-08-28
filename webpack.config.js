const path = require('path');

module.exports = {

    entry: {
        example: './examples/index.js'  
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
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
                    presets: [
                        ['env', {
                            "targets": {
                                "browsers": ["last 2 chrome versions"]
                            }
                        }], 'stage-2'
                    ]
                }
            }
        }]
    },
    resolve: {
        alias: {}
    },
    devtool: 'source-map',
    devServer: {
        contentBase: [path.resolve(__dirname)],
        compress: false,
        stats: 'minimal',
        watchContentBase: true,
        port: 8011
    }
};