import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname);

const nextConfig = {
  turbopack: {
    resolveAlias: {
      "@": projectRoot,
    },
  },
  webpack(config) {
    config.resolve.alias["@"] = projectRoot;
    return config;
  },
};

export default nextConfig;
