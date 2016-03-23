var path = require('path');
var webpack = require('webpack');

module.exports = {
    //devtool: 'eval-cheap-module-source-map',
    // the main entry of our app
    entry: {
        app: './spec/test.ts'
    },
    // output configuration
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'test.js',
        publicPath: '/assets/'
    },

    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.ts']
    },
    module: {
        loaders: [
            {test: /\.ts$/, loader: 'ts-loader'}
        ]
    }
};
