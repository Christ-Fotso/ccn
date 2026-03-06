/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Cloudflare tunnel origins for HMR in dev
  devIndicators: {
    appIsrStatus: false,
  },
  // Ensure we can handle long requests from MCP
  serverExternalPackages: ['mcporter'],
};

export default nextConfig;
