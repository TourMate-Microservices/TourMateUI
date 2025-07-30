// next.config.ts
import type { NextConfig } from 'next';
import withFlowbiteReact from 'flowbite-react/plugin/nextjs';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.pravatar.cc', pathname: '/**' },
      { protocol: 'https', hostname: 'img.freepik.com', pathname: '/**' },
      { protocol: 'https', hostname: 'bestlocationhotels.com', pathname: '/**' },
      { protocol: 'https', hostname: 'thanhnien.mediacdn.vn', pathname: '/**' },
      { protocol: 'https', hostname: 'media-cdn-v2.laodong.vn', pathname: '/**' },
      { protocol: 'https', hostname: 'ik.imagekit.io', pathname: '/**' },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.css$/i,
      include: /node_modules\/aos/,
      sideEffects: true, // Giúp giữ lại CSS của AOS không bị tree-shaken
    });
    return config;
  },
};

export default withFlowbiteReact(nextConfig);
