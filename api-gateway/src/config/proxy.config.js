// proxy/setupProxies.js - Implementación optimizada
import { createProxyMiddleware } from "http-proxy-middleware";
import { ROUTES } from "./routes.config.js";

// Load balancer con round-robin optimizado
class LoadBalancer {
  constructor() {
    this.counters = new Map();
  }

  getNextInstance(instances) {
    const key = instances.join(",");
    const current = this.counters.get(key) || 0;
    const nextIndex = (current + 1) % instances.length;
    this.counters.set(key, nextIndex);
    return instances[nextIndex];
  }
}

const loadBalancer = new LoadBalancer();

export const setupProxies = (app, routes) => {
  console.log("routes: ", routes);
  routes.forEach((route) => {
    const proxyMiddleware = createProxyMiddleware({
      target: "http://localhost", // Dummy target, será sobrescrito
      changeOrigin: true,
      timeout: 5000, // 5 segundos timeout
      proxyTimeout: 5000,

      // Router dinámico para load balancing
      router: (req) => {
        // console.log("req", req);

        // const selectedInstance = loadBalancer.getNextInstance(route.instances);
        const urlRequest = req.originalUrl;
        console.log("urlRequest: ", urlRequest);

        // Encontrar la ruta cuyo "url" sea el prefijo del request
        const matchedRoute = ROUTES.find((route) =>
          urlRequest.startsWith(route.url)
        );

        if (!matchedRoute) {
          console.error(
            "No se encontró ninguna ruta que coincida con el request:",
            urlRequest
          );
          // podés manejar el error o responder con 404, por ejemplo
          return res.status(404).send("Ruta no encontrada");
        }

        // Obtener la siguiente instancia del balanceador para esa ruta
        const selectedInstance = loadBalancer.getNextInstance(
          matchedRoute.instances
        );

        console.log("selectedInstance:", selectedInstance);

        // Preservar la URL original completa
        console.log(
          `📍 ${route.service}: ${req.method} ${req.originalUrl} -> ${selectedInstance}${req.originalUrl}`
        );
        if (selectedInstance !== undefined) {
          return selectedInstance;
        }
      },

      // CLAVE: Configurar el contexto para que matchee correctamente
      context: [route.url, `${route.url}/**`],

      // CLAVE: NO reescribir el path
      pathRewrite: {},

      // Configuración de headers optimizada
      // onProxyReq: (proxyReq, req, res) => {
      //   // Forzar el path completo en el proxy request
      //   const fullPath = req.originalUrl;
      //   proxyReq.path = fullPath;

      //   // Agregar headers necesarios
      //   proxyReq.setHeader("X-Forwarded-For", req.ip);
      //   proxyReq.setHeader("X-Forwarded-Proto", req.protocol);
      //   proxyReq.setHeader("X-Forwarded-Host", req.get("host"));
      //   const authHeader = req.headers["authorization"];
      //   if (authHeader) {
      //     proxyReq.setHeader("Authorization", authHeader);
      //   }

      //   // Log para debugging
      //   console.log(
      //     `➡️  Proxying: ${req.method} ${fullPath} to ${proxyReq.getHeader(
      //       "host"
      //     )}${proxyReq.path}`
      //   );
      // },

      onProxyReq: (proxyReq, req, res) => {
        const fullPath = req.originalUrl;

        // Encontrar la ruta
        const matchedRoute = ROUTES.find((route) =>
          fullPath.startsWith(route.url)
        );

        if (matchedRoute) {
          const moduleName = matchedRoute.service;

          // 👇 Construir una URL completa ficticia para manipular los query params correctamente
          const url = new URL(`http://dummy${fullPath}`); // 'dummy' host solo para usar la clase URL

          // 👇 Esto se encarga de reemplazar si existe o agregar si no
          url.searchParams.set("moduleName", moduleName);

          // 👇 Reconstruir path + query
          const newPath = url.pathname + "?" + url.searchParams.toString();

          // 👇 Aplicar al proxy
          proxyReq.path = newPath;

          // 👇 Pasar token original si lo hay
          const authHeader = req.headers["authorization"];
          if (authHeader) {
            proxyReq.setHeader("Authorization", authHeader);
          }

          // 👇 Forwarded headers
          proxyReq.setHeader("X-Forwarded-For", req.ip);
          proxyReq.setHeader("X-Forwarded-Proto", req.protocol);
          proxyReq.setHeader("X-Forwarded-Host", req.get("host"));

          console.log(
            `➡️  Proxying: ${req.method} ${fullPath} to ${proxyReq.getHeader(
              "host"
            )}${proxyReq.path}`
          );
        }
      },

      // Manejo de respuestas
      onProxyRes: (proxyRes, req, res) => {
        console.log(
          `⬅️  Response: ${proxyRes.statusCode} from ${req.originalUrl}`
        );

        // Headers de CORS si es necesario
        proxyRes.headers["Access-Control-Allow-Origin"] = "*";
        proxyRes.headers["Access-Control-Allow-Methods"] =
          "GET,PUT,POST,DELETE,OPTIONS";
        proxyRes.headers["Access-Control-Allow-Headers"] =
          "Content-Type, Authorization";
      },

      // Manejo de errores mejorado
      onError: (err, req, res) => {
        console.error(`❌ Proxy Error for ${req.originalUrl}:`, {
          message: err.message,
          code: err.code,
          syscall: err.syscall,
          address: err.address,
          port: err.port,
        });

        // Respuesta de error más informativa
        if (!res.headersSent) {
          res.status(502).json({
            error: "Bad Gateway",
            message: "Service temporarily unavailable",
            service: route.service,
            timestamp: new Date().toISOString(),
            requestId: req.headers["x-request-id"] || "unknown",
          });
        }
      },

      // Configuración de logging
      logLevel: process.env.NODE_ENV === "development" ? "debug" : "warn",
    });

    // Aplicar el middleware una sola vez
    app.use(proxyMiddleware);
  });
};

// Middleware adicional para debugging
export const debugMiddleware = (req, res, next) => {
  const start = Date.now();

  console.log(`🚀 Incoming: ${req.method} ${req.originalUrl}`, {
    headers: req.headers,
    query: req.query,
    body: req.method !== "GET" ? req.body : undefined,
  });

  // Override del res.end para medir tiempo
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - start;
    console.log(
      `⏱️  Request completed in ${duration}ms: ${req.method} ${req.originalUrl}`
    );
    originalEnd.apply(this, args);
  };

  next();
};
