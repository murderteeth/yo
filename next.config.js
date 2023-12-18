/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'assets.smold.app',
      pathname: '/**/*',
    }, {
      protocol: 'https',
      hostname: 'raw.githubusercontent.com',
      pathname: '/**/*',
    }]
  },
  env: {
    WALLETCONNECT_PROJECT_NAME: process.env.WALLETCONNECT_PROJECT_NAME,
    WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID,
    SMOL_ASSETS_URL: process.env.SMOL_ASSETS_URL,
    YDAEMON: process.env.YDAEMON,
  }
}

module.exports = nextConfig