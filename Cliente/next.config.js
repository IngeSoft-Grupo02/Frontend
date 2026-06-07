/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // Si usas imágenes externas, agrega sus dominios aquí. 
    // Ejemplo para imágenes de prueba:
    domains: ['images.unsplash.com'], 
  },
};

module.exports = nextConfig;