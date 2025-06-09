# API Gateway - Microservicios

Un API Gateway que actúa como punto de entrada único para múltiples microservicios, enrutando las solicitudes basándose en las rutas recibidas.

## 🚀 ¿Cómo funciona?

El API Gateway recibe todas las solicitudes HTTP y las redirige al microservicio correspondiente basándose en la ruta:

```
Cliente → API Gateway (puerto 3000) → Microservicio específico
```

### Ejemplo de enrutamiento:

- `GET /user/new` → Se redirige a `http://localhost:3001/new`
- `POST /auth/login` → Se redirige a `http://localhost:3002/login`
- `GET /product/123` → Se redirige a `http://localhost:3003/123`

## 📋 Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y ajusta las URLs de tus microservicios:

```bash
cp .env.example .env
```

### 3. Configurar microservicios

Edita el archivo `src/config/services.config.js` para agregar o modificar microservicios:

```javascript
export const MICROSERVICES_CONFIG = {
  user: {
    target: "http://localhost:3001",
    pathRewrite: { "^/user": "" },
    description: "Microservicio de gestión de usuarios",
  },
  // Agregar más microservicios aquí...
};
```

## 🏃‍♂️ Ejecutar

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm start
```

## 📡 Rutas disponibles

### Microservicios

- `/user/*` → Microservicio de usuarios (puerto 3001)
- `/auth/*` → Microservicio de autenticación (puerto 3002)
- `/product/*` → Microservicio de productos (puerto 3003)
- `/order/*` → Microservicio de órdenes (puerto 3004)

### Sistema

- `/` → Información del gateway y rutas disponibles
- `/health` → Estado del API Gateway
- `/health/services` → Estado de los microservicios

## 🔧 Ejemplos de uso

### Crear un usuario

```bash
curl -X POST http://localhost:3000/user/new \
  -H "Content-Type: application/json" \
  -d '{"name": "Juan", "email": "juan@example.com"}'
```

### Autenticarse

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "juan@example.com", "password": "123456"}'
```

### Obtener productos

```bash
curl http://localhost:3000/product/list
```

## 🛠️ Características

- ✅ **Enrutamiento automático** basado en rutas
- ✅ **Configuración flexible** mediante variables de entorno
- ✅ **Logging detallado** de todas las solicitudes
- ✅ **Manejo de errores** cuando los microservicios no responden
- ✅ **Headers personalizados** para identificar el gateway
- ✅ **Rutas de salud** para monitoreo
- ✅ **Timeout configurable** para cada microservicio
- ✅ **CORS configurable**

## 🔍 Monitoreo

### Verificar estado del gateway

```bash
curl http://localhost:3000/health
```

### Verificar estado de microservicios

```bash
curl http://localhost:3000/health/services
```

## 📝 Logs

El gateway registra todas las operaciones:

```
🚀 API Gateway iniciado en puerto 3000
🚀 Configurando ruta: /user/* -> http://localhost:3001
🚀 Configurando ruta: /auth/* -> http://localhost:3002
📥 2024-01-15T10:30:00.000Z - POST /user/new - IP: ::1
🔄 [USER] Redirigiendo POST /user/new -> http://localhost:3001/new
✅ [USER] Respuesta recibida - Status: 201
```

## 🐳 Docker

Si usas Docker Compose, actualiza las URLs en `.env`:

```env
USER_SERVICE_URL=http://user-service:3001
AUTH_SERVICE_URL=http://auth-service:3002
PRODUCT_SERVICE_URL=http://product-service:3003
ORDER_SERVICE_URL=http://order-service:3004
```

## 🚨 Manejo de errores

Cuando un microservicio no está disponible:

```json
{
  "error": "Servicio no disponible",
  "service": "user",
  "message": "El microservicio user no está respondiendo",
  "details": "connect ECONNREFUSED 127.0.0.1:3001",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔧 Personalización

Para agregar un nuevo microservicio:

1. Agrega la configuración en `src/config/services.config.js`
2. Agrega la variable de entorno en `.env`
3. Reinicia el gateway

El enrutamiento se configura automáticamente.
