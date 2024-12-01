/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['*'], // السماح بجميع النطاقات (غير موصى به، ولكن قد يكون ضرورياً في بعض الأحيان)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // السماح بجميع النطاقات والـ subdomains
      },
    ],
  },
};
  
  export default nextConfig;
  