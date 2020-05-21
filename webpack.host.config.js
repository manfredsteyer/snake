const AotPlugin = require("@ngtools/webpack").AngularCompilerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const CopyPlugin = require('copy-webpack-plugin');


const shellConfig = {
  entry: ["./src/polyfills.ts", "./src/main.ts"],
  resolve: {
    mainFields: ["browser", "module", "main"]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist/shell"),
    port: 5000
  },  
  module: {
    rules: [
      { test: /\.ts$/, loader: "@ngtools/webpack" }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      remotes: {
        strategy: "strategy" 
      }
    }),
    new AotPlugin({
      skipCodeGeneration: false,
      tsConfigPath: "./src/tsconfig.json",
      directTemplateLoading: true,
      entryModule: path.resolve(
        __dirname,
        "./src/app/app.module#AppModule"
      )
    }),
    // new CopyPlugin([
    //   { from: 'projects/shell/src/assets', to: 'assets' },
    // ]),    
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],
  output: {
    filename: "[name].js",
    path: __dirname + "/dist/shell",
    chunkFilename: "[id].[chunkhash].js"
  },
  mode: "production"
};

module.exports = shellConfig;
