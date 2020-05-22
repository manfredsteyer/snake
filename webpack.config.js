const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const shellConfig = {
  entry: ["./src/app/strategy/custom.strategy.ts"],
  resolve: {
    mainFields: ["browser", "module", "main"],
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-typescript"],
          plugins: [
            "@babel/plugin-proposal-class-properties"
          ]
        },
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ModuleFederationPlugin({
      name: "strategy",
      library: { type: "var", name: "strategy" },
      filename: "remoteEntry.js",
      exposes: {
        Strategy: './src/app/strategy/custom.strategy.ts',
      }
    }),
    new CopyPlugin({ patterns: [
      { from: 'public', to: '' },
    ]}),      
  ],
  output: {
    publicPath: "https://manfredsteyer.github.io/snake/",
    filename: "[id].[name].js",
    path: __dirname + "/dist/strategy",
    chunkFilename: "[id].[chunkhash].js"
  },
  mode: "production"
};
module.exports = shellConfig;
