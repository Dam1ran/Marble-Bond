const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: {
    entry: "./src/index.ts",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/audio', to: 'audio', },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "imgs",
          },
        },
      },
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, "src")],
        use: "ts-loader",
      },      
      // },
      // {
      //   test: /\.(mp3|wav|wma|ogg)$/,
      //   use: {
      //     loader: 'file-loader',
      //     options: {
      //       name: '[name].[ext]',
      //       outputPath: 'audio/',
      //       publicPath: 'audio/'
      //     }
      //   }
      // }
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  node: {
    fs: 'empty'
  }
};
