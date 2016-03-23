var path = require('path');
var webpack = require('webpack');

module.exports = {
    //devtool: 'eval-cheap-module-source-map',
    // the main entry of our app
    entry: {
        app: './src/test2.ts',
        vendor: ['vue']
    },
    // output configuration
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/assets/'
    },

    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.ts']
    },
    module: {
        loaders: [
            {test: /\.ts$/, loader: 'ts-loader'}
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
    ]
};
