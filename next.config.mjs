/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export default {
  output: 'export',            // plain files: any static host, no Node runtime
  basePath,
  trailingSlash: true,         // /en/services/ -> en/services/index.html
  images: { unoptimized: true },
  reactStrictMode: true,
};
