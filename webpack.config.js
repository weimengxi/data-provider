const path = require('path');

module.exports = {

    entry: {
        'index': './src/index.js',
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
        contentBase: [path.resolve(__dirname), path.join(__dirname, 'examples/')],
        compress: false,
        stats: 'minimal',
        watchContentBase: true,
        port: 8011
    }
};