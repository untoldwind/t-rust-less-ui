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
        extensions: [".ts", ".tsx", ".js", ".jsx", ".scss", ".css", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'awesome-typescript-loader',
                }],
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "[name].css"
                    }
                }, {
                    loader: "extract-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "resolve-url-loader"
                }, {
                    loader: "sass-loader",
                    options: { 
                        implementation: require("sass")
                    }
                }]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    }
                }]
            }
        ]
    }
}

module.exports = [
    Object.assign(
      {
        target: "electron-main",
        entry: { main: "./src/main/index.ts" },
        plugins: [new WriteFilePlugin(), new CopyWebpackPlugin([
            { from: "./src/main/app-package.json", to: path.join(__dirname, "dist", "package.json") }
        ])],
        node: {
            __dirname: false,
            __filename: false
        }
      },
      commonConfig),
    Object.assign(
      {
        entry: { 
            renderer: [
                "./src/renderer/index.tsx",
                "./src/renderer/app.scss",
            ] 
        },
        plugins: [new WriteFilePlugin(), new CopyWebpackPlugin([
            { from: "./src/renderer/index.html", to: path.join(__dirname, "dist", "index.html") },
            { from: "./src/renderer/preload.js", to: path.join(__dirname, "dist", "preload.js") }
        ])]
      },
      commonConfig)
  ];