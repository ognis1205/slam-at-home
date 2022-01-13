import * as path from 'path';
import * as webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

const SRC_ROOT = path.join(__dirname, '..', 'src');

const DIST_ROOT = path.join(__dirname, '..', 'dist');

const TS_CONFIG = path.join(__dirname, '..', '');

const config: webpack.Configuration = {
  entry: path.join(SRC_ROOT, 'index.ts'),
  output: {
    filename: 'index.js',
    path: DIST_ROOT
  },
  target: 'node',
  externals: [nodeExternals()],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.ts$/,
        exclude: [ /node_modules/ ],
        options: {
          configFile: 'tsconfig.json'
        }
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  }
};

export default config;
