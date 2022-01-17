import * as webpack from 'webpack';
import merge from 'webpack-merge';
import 'webpack-dev-server';
import common from './common.config';

const config: webpack.Configuration = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: common.output.path,
    host: "0.0.0.0",
    port: 4000
  }
});

export default config;
