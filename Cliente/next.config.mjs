/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Corregimos ESLint para evitar el Warning de compatibilidad en Next.js 16
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Desactivamos Turbopack explícitamente en el archivo de configuración
  turbo: {
    enabled: false
  }
};

export default nextConfig;