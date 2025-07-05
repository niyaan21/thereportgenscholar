
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // This is to suppress the 'require.extensions' warning from handlebars, a dependency of genkit.
    // It's a known issue and doesn't affect functionality.
    config.module.rules.push({
      test: /handlebars/,
      loader: 'ignore-loader',
    });
    
    return config;
  },
};

export default nextConfig;
