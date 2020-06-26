const path = require("path");
const WriteFilePlugin = require("write-file-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const commonConfig = {
    output: {
        path: path.resolve(__dirname, 'app'),
        filename: '[name].js',
        sourceMapFilename: '[name].js.map'
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".scss", ".css", ".json", ".node"]
    },
    devServer: {
        port: 8123,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'awesome-typescript-loader',
                    options: {
                        useBabel: true,
                        useCache: true,
                        babelOptions: {
                            babelrc: false,
                            presets: [
                                "@babel/preset-env"
                            ],
                            "plugins": [
                                "@babel/plugin-transform-runtime",
                            ],
                        },
                        babelCore: "@babel/core",
                        reportFiles: [
                            'src/**/*.{ts,tsx}'
                        ],
                    },
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
            plugins: [new WriteFilePlugin(), new CopyWebpackPlugin({
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
            plugins: [new WriteFilePlugin(), new CopyWebpackPlugin({
                patterns: [
                    { from: "./src/renderer/index.html", to: path.join(__dirname, "app", "index.html") },
                    { from: "./src/renderer/preload.js", to: path.join(__dirname, "app", "preload.js") }
                ]
            }), new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css",
            })]
        },
        commonConfig)
];