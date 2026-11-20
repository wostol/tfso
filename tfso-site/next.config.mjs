/** @type {import('next').NextConfig} */
const nextConfig = {
  // standalone — Next.js собирает минимальный Node.js-сервер в .next/standalone,
  // который работает без папки node_modules. Это рекомендуемый режим для Docker.
  output: 'standalone',
  // На сайте мы используем статические изображения из /public, оптимизация не нужна.
  images: {
    unoptimized: true,
  },
  // В лабораторном MVP мы игнорируем ошибки типов в сборке (next.config уже был таким).
  // В реальном проекте эту опцию лучше убрать и держать строгую типизацию.
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
