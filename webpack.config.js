const path = require("path");
const WriteFilePlugin = require("write-file-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const commonConfig = {
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].js.map'
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'awesome-typescript-loader',
                }],
            }
        ]
    }
}

module.exports = [
    Object.assign(
      {
        target: 'electron-main',
        entry: { main: './src/main/index.ts' },
        plugins: [new WriteFilePlugin(), new CopyWebpackPlugin([
            { from: './src/main/app-package.json', to: path.join(__dirname, 'dist', 'package.json') }
        ])],
        node: {
            __dirname: false,
            __filename: false
        }
      },
      commonConfig),
    Object.assign(
      {
        entry: { renderer: './src/renderer/index.tsx' },
        plugins: [new WriteFilePlugin(), new CopyWebpackPlugin([
            { from: './src/renderer/index.html', to: path.join(__dirname, 'dist', 'index.html') },
            { from: './src/renderer/preload.js', to: path.join(__dirname, 'dist', 'preload.js') }
        ])]
      },
      commonConfig)
  ];