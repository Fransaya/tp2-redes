import { axiosUserMicroservice } from "../utils/axiosConfig";

export const authMiddleware = (req, res, next) => {
  const headers = req.headers.authorization;
  if (!headers || !headers.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Obtengo el token de la solicitud
  const token = headers.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verifico el token con microservicio de usuarios
  axiosUserMicroservice
    .get("/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      // Si la verificación es exitosa, se agrega el usuario al request
      req.user = response.data.user;
      next();
    })
    .catch((error) => {
      // Si hay un error en la verificación, se retorna un error 401
      return res.status(401).json({ message: "Unauthorized" });
    });
};
