/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 开发环境配置：确保source-map可用，代码不压缩
  productionBrowserSourceMaps: true,
  webpack: (config, { dev, isServer }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // 开发环境：确保source-map可用（Next.js默认已处理）
    // 移除可能导致问题的webpack优化配置
    
    // 修复 RainbowKit worker 构建问题
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        assert: false,
        http: false,
        https: false,
        os: false,
        url: false,
        zlib: false,
      };
    }
    
    // 修复 HeartbeatWorker 的构建问题
    if (!dev && !isServer) {
      const TerserPlugin = require('terser-webpack-plugin');
      config.optimization.minimizer = config.optimization.minimizer.map((plugin) => {
        if (plugin instanceof TerserPlugin) {
          return new TerserPlugin({
            ...plugin.options,
            terserOptions: {
              ...plugin.options.terserOptions,
              parse: {
                ...plugin.options.terserOptions?.parse,
                ecma: 2020,
              },
              compress: {
                ...plugin.options.terserOptions?.compress,
                module: true,
              },
              mangle: {
                ...plugin.options.terserOptions?.mangle,
                module: true,
              },
            },
          });
        }
        return plugin;
      });
    }
    
    return config;
  },
  transpilePackages: ['@rainbow-me/rainbowkit'],
  swcMinify: false,

};

module.exports = nextConfig;