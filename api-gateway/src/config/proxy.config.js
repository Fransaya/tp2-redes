import { createProxyMiddleware } from "http-proxy-middleware";
import rateLimit from "express-rate-limit";
import { loadBalancer } from "./loadBalancer.js";

export const setupProxies = (app, routes) => {
  routes.forEach((route) => {
    // Setup rate limiting
    if (route.rateLimit) {
      const limiter = rateLimit(route.rateLimit);
      app.use(route.url, limiter);
    }

    // Setup proxy with load balancing
    const proxyMiddleware = createProxyMiddleware({
      router: async (req) => {
        try {
          const targetInstance = await loadBalancer.getNextInstance(route);
          console.log(
            `Routing ${req.path} to ${targetInstance} for service ${route.service}`
          );
          return targetInstance;
        } catch (error) {
          console.error(
            `Error selecting instance for ${route.service}:`,
            error
          );
          // Fallback a la primera instancia si hay error
          return route.instances[0];
        }
      },
      changeOrigin: route.proxy.changeOrigin,
      pathRewrite: route.proxy.pathRewrite,
      onError: (err, req, res) => {
        console.error(`Proxy error for ${route.service}:`, err.message);
        res.status(503).json({
          error: "Service temporarily unavailable",
          service: route.service,
        });
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `[${new Date().toISOString()}] ${req.method} ${
            req.path
          } -> ${proxyReq.getHeader("host")}`
        );
      },
    });

    app.use(route.url, proxyMiddleware);
  });
};
