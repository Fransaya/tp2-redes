export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
