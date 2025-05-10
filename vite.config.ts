import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables for the current mode
  const env = loadEnv(mode, process.cwd());

  // Log the token (masked) to make sure it's loaded
  console.log(
    "API Token loaded:",
    env.VITE_SPORTMONKS_TOKEN
      ? `${env.VITE_SPORTMONKS_TOKEN.substring(
          0,
          4
        )}...${env.VITE_SPORTMONKS_TOKEN.substring(
          env.VITE_SPORTMONKS_TOKEN.length - 4
        )}`
      : "NOT FOUND"
  );

  return {
    base:
      process.env.NODE_ENV === "development"
        ? "/"
        : process.env.VITE_BASE_PATH || "/",
    optimizeDeps: {
      entries: ["src/main.tsx", "src/tempobook/**/*"],
    },
    plugins: [
      react(),
      tempo(),
      svgr({
        svgrOptions: {
          exportType: "default",
          ref: true,
          svgo: false,
          titleProp: true,
        },
        include: "**/*.svg",
      }),
    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@": path.resolve(__dirname, "./src"),
        assets: "/src/assets",
      },
    },
    server: {
      proxy: {
        "/api/sportmonks": {
          target: "https://api.sportmonks.com/v3",
          changeOrigin: true,
          rewrite: (path) => {
            // Add the token directly to the path
            const apiToken = env.VITE_SPORTMONKS_TOKEN;
            if (path.includes("?")) {
              return (
                path.replace(/^\/api\/sportmonks/, "") +
                `&api_token=${apiToken}`
              );
            } else {
              return (
                path.replace(/^\/api\/sportmonks/, "") +
                `?api_token=${apiToken}`
              );
            }
          },
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              // Set the token in the Authorization header as well
              const apiToken = env.VITE_SPORTMONKS_TOKEN;
              proxyReq.setHeader(
                "Authorization",
                `Bearer ${apiToken}`
              );

              console.log("Proxying request to:", req.url);
            });
          },
        },
      },
    },
    // Make environment variables available in client code
    define: {
      "import.meta.env.VITE_SPORTMONKS_TOKEN": JSON.stringify(
        env.VITE_SPORTMONKS_TOKEN
      ),
      "import.meta.env.VITE_API_BASE": JSON.stringify(
        env.VITE_API_BASE || "https://api.sportmonks.com/v3/football"
      ),
    },
  };
});
