export const ROUTES = [
  {
    url: "/auth",
    service: "auth",
    auth: false,
    reteLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100,
    },
    proxy: {
      target: "http://localhost:3001",
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
    reteLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100,
    },
    proxy: {
      target: "http://localhost:3002",
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
    reteLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100,
    },
    proxy: {
      target: "http://localhost:3003",
      changeOrigin: true,
      pathRewrite: {
        "^/inscriptions": "",
      },
    },
  },
  {
    url: "/programations",
    service: "programations",
    auth: true,
    reteLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100,
    },
    proxy: {
      target: "http://localhost:3004",
      changeOrigin: true,
      pathRewrite: {
        "^/programations": "",
      },
    },
  },
  {
    url: "notifications",
    service: "notifications",
    auth: true,
    reteLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100,
    },
    proxy: {
      target: "http://localhost:3005",
      changeOrigin: true,
      pathRewrite: {
        "^/notifications": "",
      },
    },
  },
];
