/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  compress: true,
  swcMinify: true,
  webpack: (config, {}) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: {
        loader: 'raw-loader'
      },
    })
    return config;
  },
};

export default nextConfig;