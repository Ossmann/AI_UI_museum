/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ['upload.wikimedia.org'], // Add domains separately for remote images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**',
      }
    ]
  }
}