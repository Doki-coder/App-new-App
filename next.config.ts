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
  i18n: {
    locales: ['en', 'fa'],
    defaultLocale: 'fa',
    localeDetection: false, // Recommended to disable for explicit language management
  },
};

export default nextConfig;
