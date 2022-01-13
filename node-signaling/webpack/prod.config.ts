import * as webpack from 'webpack';
import merge from 'webpack-merge';
import 'webpack-dev-server';
import common from './common.config';

const config: webpack.Configuration = merge(common, {
  mode: "production"
});

export default config;
