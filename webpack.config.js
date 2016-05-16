var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './index',
    output: {
        path: './dist',
        filename: 'c3.js',
        publicPath: '/dist/',
        library: 'c3',
        libraryTarget: 'umd'
    },
    externals: {
        d3: 'd3'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('c3.css')
    ],
    devServer: {
        inline: true,
        port: 3000
    }
};