/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
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
