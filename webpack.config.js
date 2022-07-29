const { resolve, join } = require('path');

const srcPath = resolve(__dirname, 'src');
const buildPath = resolve(__dirname, 'build');

module.exports = ({ production }) => {
  return {
    target: "node",
    entry: join(srcPath, 'index.ts'),
    output: {
      filename: 'main.js',
      path: buildPath,
      clean: true,
    },
    mode: production ? 'production' : 'development',
    devtool: false,
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /(node_modules|bower_components)/,
          use: 'ts-loader',
        },
      ],
    },
  };
};
