const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
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
                    options: {
                        transpileOnly: true
                    }
                }],
                exclude: /node_modules/,
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
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                type: "asset",
            }
        ]
    },
    entry: {
        renderer: [
            "./src/index.tsx",
            "./src/app.scss",
        ],
        "hack-font": [
            "hack-font/build/web/hack.css",
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
        "blueprint-popover2": [
            "@blueprintjs/popover2/lib/css/blueprint-popover2.css",
        ],
    },
    devServer: {
        port: 8123,
        hot: true,
    },
    plugins: [new webpack.ProvidePlugin({
        process: 'process/browser',
      }), new CopyWebpackPlugin({
        patterns: [
            { from: "./src/index.html", to: path.join(__dirname, "app", "index.html") },
        ]
    }), new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
    }),
    new ForkTsCheckerWebpackPlugin()]
}
