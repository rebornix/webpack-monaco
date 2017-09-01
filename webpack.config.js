const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/vs\/css!/, function (resource) {
            var request = resource.request.replace(/vs\/css!/, ``);
            if (request.indexOf('.css') < 0) {
                request = request.concat('.css');
            }
            resource.request = request;
        })
    ],
    resolve: {
        alias: {
            // "vs/basic-languages/src": path.resolve(__dirname, 'node_modules/monaco-languages/release'),
            vs: path.resolve(__dirname, 'vscode')
            // vs: path.resolve(__dirname, 'node_modules/monaco-editor/dev/vs')
        },
        extensions: ['.js', '.css']
    },
    output: {
        libraryTarget: "amd",
        library: "editor",
        filename: 'bundle.js',
        devtoolLineToLine: true,
        sourceMapFilename: "./bundle.js.map",
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.svg$/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    }
};
