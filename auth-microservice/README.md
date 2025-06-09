# Microservicio de Autenticación

Un microservicio completo de autenticación construido con Node.js, Express y MongoDB usando Mongoose como ODM.

## 🚀 Características

- ✅ Registro y autenticación de usuarios
- ✅ JWT tokens con refresh tokens
- ✅ Sistema de roles y permisos granular
- ✅ Validación TOTP (preparado para 2FA)
- ✅ Middleware de autenticación y autorización
- ✅ Timestamps personalizados
- ✅ Limpieza automática de tokens expirados
- ✅ Estructura modular y escalable

## 📁 Estructura del Proyecto

```
src/
├── config/
│   └── database.js          # Configuración de MongoDB
├── controllers/
│   └── authController.js    # Controladores de autenticación
├── middleware/
│   └── auth.js             # Middlewares de autenticación
├── models/
│   └── User.js             # Modelo de usuario con Mongoose
├── routes/
│   └── auth.js             # Rutas de autenticación
├── services/
│   └── authService.js      # Lógica de negocio
└── index.js                # Punto de entrada
```

## 🛠️ Instalación

1. **Clonar e instalar dependencias:**

```bash
npm install
```

2. **Configurar variables de entorno:**
   Edita el archivo `.env` con tus configuraciones:

```env
MONGODB_URI=mongodb://localhost:27017/auth_microservice
PORT=3000
NODE_ENV=development
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=tu_refresh_secret_super_seguro_aqui
JWT_REFRESH_EXPIRE=7d
BCRYPT_SALT_ROUNDS=12
```

3. **Iniciar el servidor:**

```bash
npm start
```

## 📊 Esquema de Usuario

```javascript
{
  user: "string",           // Nombre de usuario único
  password: "string",       // Contraseña hasheada
  status: boolean,          // Estado activo/inactivo
  rol: {
    id: "string",          // ID del rol
    title: "string",       // Título del rol
    permissions: [{
      id: "string",        // ID del permiso
      modulo: "string"     // Módulo al que aplica
    }]
  },
  totpValidation: boolean,  // Validación TOTP habilitada
  createAt: number,        // Timestamp de creación
  updatedAt: number,       // Timestamp de última actualización
  lastLogin: number,       // Timestamp del último login
  refreshTokens: [{
    token: "string",       // Refresh token
    createdAt: number,     // Timestamp de creación
    expiresAt: number      // Timestamp de expiración
  }]
}
```

## 🔌 API Endpoints

### Rutas Públicas

#### POST `/api/auth/register`

Registrar un nuevo usuario.

**Body:**

```json
{
  "user": "usuario123",
  "password": "password123",
  "rol": {
    "id": "user",
    "title": "Usuario",
    "permissions": []
  },
  "totpValidation": false
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      /* datos del usuario */
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### POST `/api/auth/login`

Iniciar sesión.

**Body:**

```json
{
  "user": "usuario123",
  "password": "password123"
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      /* datos del usuario */
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### POST `/api/auth/refresh-token`

Renovar access token.

**Body:**

```json
{
  "refreshToken": "refresh_token"
}
```

### Rutas Protegidas

#### GET `/api/auth/profile`

Obtener perfil del usuario actual.

**Headers:**

```
Authorization: Bearer <access_token>
```

#### POST `/api/auth/logout`

Cerrar sesión actual.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "refreshToken": "refresh_token"
}
```

#### POST `/api/auth/logout-all`

Cerrar todas las sesiones.

**Headers:**

```
Authorization: Bearer <access_token>
```

#### GET `/api/auth/verify-token`

Verificar si el token es válido.

**Headers:**

```
Authorization: Bearer <access_token>
```

### Rutas de Administración

#### GET `/api/auth/admin/users`

Listar usuarios (solo administradores).

**Headers:**

```
Authorization: Bearer <access_token>
```

## 🔒 Middlewares de Autenticación

### `authenticateToken`

Verifica que el usuario tenga un token válido.

### `requirePermission(moduloName)`

Verifica que el usuario tenga permisos para un módulo específico.

### `requireRole(roleId)`

Verifica que el usuario tenga un rol específico.

### `requireActiveUser`

Verifica que el usuario esté activo.

### `optionalAuth`

Autenticación opcional (no falla si no hay token).

## 🧪 Ejemplos de Uso

### Registro de Usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "user": "testuser",
    "password": "password123",
    "rol": {
      "id": "user",
      "title": "Usuario",
      "permissions": []
    }
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user": "testuser",
    "password": "password123"
  }'
```

### Acceso a Ruta Protegida

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔧 Configuración de Desarrollo

Para desarrollo, puedes usar nodemon:

```bash
npm install -g nodemon
nodemon src/index.js
```

## 🐳 Docker (Opcional)

Si quieres usar Docker, puedes crear un `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Notas Importantes

1. **Seguridad**: Cambia los secrets en producción
2. **Base de datos**: Asegúrate de tener MongoDB corriendo
3. **CORS**: Configura los orígenes permitidos según tu frontend
4. **Logs**: En producción, considera usar un sistema de logging más robusto
5. **Rate Limiting**: Considera agregar rate limiting para las rutas de autenticación

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request
