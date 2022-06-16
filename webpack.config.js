const { resolve, join } = require('path');

const srcPath = resolve(__dirname, 'src');
const buildPath = resolve(__dirname, 'build');
const createFilename = (ext, production) => (!production ? `[name].${ext}` : `[name].[contenthash].${ext}`);

module.exports = ({ production }) => {
  return {
    target: "node",
    entry: join(srcPath, 'index.ts'),
    output: {
      filename: `${createFilename('js', production)}`,
      path: buildPath,
      assetModuleFilename: '[file]',
      clean: true,
    },
    mode: production ? 'production' : 'development',
    devtool: production ? false : 'inline-source-map',
    resolve: {
      extensions: ['.ts'],
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
