import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    agentUpgrade: 'security',
  } as any,
};

export default nextConfig;
