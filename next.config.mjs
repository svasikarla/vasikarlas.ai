/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.29.77'],
  async redirects() {
    return [
      // /projects was merged into /work.
      { source: '/projects', destination: '/work', permanent: true },
    ];
  },
};

export default nextConfig;
