const path = require('path');

module.exports = {

    entry: './src/index.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'DataSourceGateway.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: [path.resolve(__dirname, 'src/')],
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'stage-2']
                }
            }
        }]
    },
    resolve: {
        alias: {}
    },
    devtool: 'source-map',
    devServer: {
        contentBase: [path.join(__dirname, "src/"), path.join(__dirname, "dist/")],
        compress: true,
        stats: 'minimal',
        watchContentBase: true,
        port: 8010
    }
};