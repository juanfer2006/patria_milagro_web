/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Autorizar el dominio de Supabase Storage para optimización de imágenes nativa de Next.js.
    // Si PROJECT_REF cambia, actualizar esta configuración antes del despliegue final.
    // La Rebanada B usa unoptimized=true en sus componentes de imagen para evitar bloqueos
    // en desarrollo cuando el dominio de Supabase aún no está configurado.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
