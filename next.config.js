/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  // Skip build errors for payment callback pages (they use client-side search params)
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Don't fail build on page errors
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    
    // Externalize pdfjs-dist worker for server-side
    config.externals = config.externals || {};
    if (typeof config.externals === 'object' && !Array.isArray(config.externals)) {
      config.externals['pdfjs-dist/build/pdf.worker.entry'] = 'commonjs pdfjs-dist/build/pdf.worker.entry';
    }
    
    return config;
  },
}

module.exports = nextConfig
