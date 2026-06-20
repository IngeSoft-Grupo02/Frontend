import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: '/admin/tiendas', destination: '/admin/stores', permanent: false },
      { source: '/admin/tiendas/nueva', destination: '/admin/stores/new', permanent: false },
      { source: '/admin/tiendas/:id/editar', destination: '/admin/stores/:id/edit', permanent: false },
      { source: '/admin/usuarios', destination: '/admin/users', permanent: false },
      { source: '/admin/usuarios/nuevo', destination: '/admin/users/new', permanent: false },
      { source: '/admin/usuarios/:email/editar', destination: '/admin/users/:email/edit', permanent: false },
      { source: '/admin/categorias', destination: '/admin/categories', permanent: false },
      { source: '/admin/categorias/nueva', destination: '/admin/categories/new', permanent: false },
      { source: '/admin/categorias/:name/editar', destination: '/admin/categories/:name/edit', permanent: false },
      { source: '/admin/auditoria', destination: '/admin/audit', permanent: false },
      { source: '/admin/carga-masiva', destination: '/admin/bulk', permanent: false },
      { source: '/admin/perfil', destination: '/admin/profile', permanent: false },
      { source: '/admin/recuperar-contrasena', destination: '/admin/password-recovery', permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
