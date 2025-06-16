// config/routes.config.js - Configuración actualizada con múltiples instancias
export const ROUTES = [
  {
    url: "/auth",
    service: "auth",
    auth: false,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100,
    },
    instances: [
      "http://localhost:3001/auth",
      "http://localhost:3011/auth", // Segunda instancia del servicio auth
      "http://localhost:3021/auth", // Tercera instancia del servicio auth
    ],
    proxy: {
      changeOrigin: true,
      pathRewrite: {
        "^/auth": "",
      },
    },
  },
  {
    url: "/user",
    service: "user",
    auth: false,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100,
    },
    instances: [
      "http://localhost:3001/user",
      "http://localhost:3011/user", // Segunda instancia del servicio auth
      "http://localhost:3021/user", // Tercera instancia del servicio auth
    ],
    proxy: {
      changeOrigin: true,
      pathRewrite: {
        "^/auth": "",
      },
    },
  },
  {
    url: "/events",
    service: "events",
    auth: true,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100,
    },
    instances: ["http://localhost:3002/events", "http://localhost:3012/events"],
    proxy: {
      changeOrigin: true,
      pathRewrite: {
        "^/events": "",
      },
    },
  },
  {
    url: "/inscriptions",
    service: "inscriptions",
    auth: true,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100,
    },
    instances: [
      "http://localhost:3003/inscriptions",
      "http://localhost:3013/inscriptions",
    ],
    proxy: {
      changeOrigin: true,
      pathRewrite: {
        "^/inscriptions": "",
      },
    },
  },
  {
    url: "/schedule",
    service: "schedule",
    auth: true,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100,
    },
    instances: [
      "http://localhost:3004/schedule",
      "http://localhost:3014/schedule",
    ],
    proxy: {
      changeOrigin: true,
      pathRewrite: {
        "^/schedule": "",
      },
    },
  },
  {
    url: "/notifications",
    service: "notifications",
    auth: true,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100,
    },
    instances: [
      "http://localhost:3005/notifications",
      "http://localhost:3015/notifications",
    ],
    proxy: {
      changeOrigin: true,
      pathRewrite: {
        "^/notifications": "",
      },
    },
  },
];
