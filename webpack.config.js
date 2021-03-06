const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { platform } = require("os");
const webpack = require("webpack");

const commonConfig = {
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'app'),
        filename: '[name].js',
        sourceMapFilename: '[name].js.map'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".scss", ".css", ".json", ".node"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                }],
            },
            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: "/",
                    },
                }, {
                    loader: "css-loader"
                }]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: "/",
                    },
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader",
                    options: {
                        implementation: require("sass")
                    }
                }]
            },
            {
                test: /\.node$/,
                use: [{
                    loader: "native-ext-loader",
                    options: {
                    }
                }],
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
            devServer: {
                writeToDisk: true,
                hot: false,
                inline: false,
            },
            plugins: [new CopyWebpackPlugin({
                patterns: [
                    { from: "./src/main/app-package.json", to: path.join(__dirname, "app", "package.json") }
                ]
            })],
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
                ],
                "blueprint-core": [
                    "@blueprintjs/core/lib/css/blueprint.css",
                ],
                "blueprint-icons": [
                    "@blueprintjs/icons/lib/css/blueprint-icons.css",
                ],
                "blueprint-select": [
                    "@blueprintjs/select/lib/css/blueprint-select.css",
                ],
            },
            devServer: {
                port: 8123,
                hot: true,
                inline: true,
            },
            plugins: [new webpack.ProvidePlugin({
                process: 'process/browser',
              }), new CopyWebpackPlugin({
                patterns: process.platform === "win32" ? [
                    { from: "./src/renderer/index.html", to: path.join(__dirname, "app", "index.html") },
                    { from: "./src/renderer/preload.js", to: path.join(__dirname, "app", "preload.js") },                    
//                    { from: "./native/target/x86_64-pc-windows-msvc/release/build/openssl-sys-*/out/openssl-build/install/bin/*.dll", flatten: true, toType: "dir", to: path.join(__dirname, "app") },
                ] : [
                    { from: "./src/renderer/index.html", to: path.join(__dirname, "app", "index.html") },
                    { from: "./src/renderer/preload.js", to: path.join(__dirname, "app", "preload.js") },                    
                ]
            }), new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css",
            })]
        },
        commonConfig)
];