// config/routes.config.js - Configuración corregida
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
      "http://localhost:3001", // ← SIN el prefijo /auth
    ],
    proxy: {
      changeOrigin: true,
      pathRewrite: {
        // NO reescribir nada - mantener la URL completa tal como viene
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
      "http://localhost:3001", // ← SIN el prefijo /user
    ],
    proxy: {
      changeOrigin: true,
      pathRewrite: {
        // NO reescribir nada - mantener la URL completa tal como viene
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
    instances: [
      "http://localhost:3002", // ← SIN el prefijo /events
    ],
    proxy: {
      changeOrigin: true,
      pathRewrite: {
        // NO reescribir nada - mantener la URL completa tal como viene
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
      "http://localhost:3003", // ← SIN el prefijo /inscriptions
    ],
    proxy: {
      changeOrigin: true,
      pathRewrite: {
        // NO reescribir nada - mantener la URL completa tal como viene
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
      "http://localhost:3004", // ← SIN el prefijo /schedule
    ],
    proxy: {
      changeOrigin: true,
      pathRewrite: {
        // NO reescribir nada - mantener la URL completa tal como viene
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
      "http://localhost:3005", // ← SIN el prefijo /notifications
    ],
    proxy: {
      changeOrigin: true,
      pathRewrite: {
        // NO reescribir nada - mantener la URL completa tal como viene
      },
    },
  },
];
