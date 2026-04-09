const PY_BACKEND_URL = process.env.PY_BACKEND_URL || "http://127.0.0.1:5000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/legacy/:path*", destination: `${PY_BACKEND_URL}/:path*` },
      { source: "/experiments", destination: `${PY_BACKEND_URL}/experiments` },
      { source: "/run", destination: `${PY_BACKEND_URL}/run` },
      { source: "/start", destination: `${PY_BACKEND_URL}/start` },
      { source: "/stop", destination: `${PY_BACKEND_URL}/stop` },
      { source: "/runner-status", destination: `${PY_BACKEND_URL}/runner-status` },
      { source: "/program", destination: `${PY_BACKEND_URL}/program` },
      { source: "/configure", destination: `${PY_BACKEND_URL}/configure` },
      { source: "/reset", destination: `${PY_BACKEND_URL}/reset` },
      { source: "/health-check", destination: `${PY_BACKEND_URL}/health-check` }
    ];
  }
};

export default nextConfig;
