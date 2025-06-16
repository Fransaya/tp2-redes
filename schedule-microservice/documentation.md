# API Endpoints - Schedule Service

## Autenticación y Autorización

Todos los endpoints requieren:

- **Autenticación**: Token JWT válido en el header `Authorization: Bearer <token>`
- **Autorización**: Roles específicos según el endpoint
  - `admin`: Acceso completo a todo el sistema
  - `organizador`: Gestión de eventos asignados
  - `expositor`: Solo lectura de su agenda personal

---

## 📅 SCHEDULES (Programas/Agendas)

### GET `/schedules`

**Descripción**: Obtiene todos los programas de un evento específico

**Query Parameters**:

- `eventId` (string, required): ID del evento

**Roles permitidos**: Todos los autenticados

**Respuesta exitosa (200)**:

```json
{
  "success": true,
  "data": [
    {
      "id": "schedule_uuid",
      "name": "Programa Principal",
      "description": "Agenda completa del evento",
      "eventId": "event_uuid",
      "startDate": "2024-03-15T09:00:00Z",
      "endDate": "2024-03-15T18:00:00Z",
      "timezone": "America/Argentina/Buenos_Aires",
      "status": "published",
      "version": 1,
      "createdBy": "user_uuid",
      "createdAt": "2024-03-01T10:00:00Z",
      "updatedAt": "2024-03-05T14:30:00Z"
    }
  ]
}
```

### POST `/schedules`

**Descripción**: Crea un nuevo programa para un evento

**Roles permitidos**: `admin`, `organizador`

**Body esperado**:

```json
{
  "name": "Programa Principal",
  "description": "Agenda completa del evento",
  "eventId": "event_uuid",
  "startDate": "2024-03-15T09:00:00Z",
  "endDate": "2024-03-15T18:00:00Z",
  "timezone": "America/Argentina/Buenos_Aires"
}
```

**Validaciones**:

- `name`: Requerido, máximo 200 caracteres
- `eventId`: Requerido, debe existir en Event Service
- `startDate`: Requerido
- `endDate`: Requerido, debe ser posterior a startDate

### GET `/schedules/by-id`

**Descripción**: Obtiene un programa específico por ID

**Query Parameters**:

- `id` (string, required): ID del programa

**Roles permitidos**: Todos los autenticados

### PUT `/schedules/update`

**Descripción**: Actualiza un programa existente

**Roles permitidos**: `admin`, `organizador`

**Query Parameters**:

- `id` (string, required): ID del programa

### DELETE `/schedules/delete`

**Descripción**: Elimina un programa (solo si no tiene actividades asociadas)

**Roles permitidos**: `admin`

**Query Parameters**:

- `id` (string, required): ID del programa

### POST `/schedules/publish`

**Descripción**: Publica un programa cambiando su estado de `draft` a `published`

**Validaciones**:

- El programa debe estar en estado `draft`
- Debe tener al menos una actividad
- No debe tener conflictos críticos sin resolver

**Roles permitidos**: `admin`, `organizador`

**Query Parameters**:

- `id` (string, required): ID del programa

---

## 🏢 ROOMS (Salas)

### GET `/rooms`

**Descripción**: Obtiene todas las salas de un evento

**Query Parameters**:

- `eventId` (string, required): ID del evento
- `status` (string, optional): Filtrar por estado (`active`, `inactive`, `maintenance`)

**Roles permitidos**: Todos los autenticados

### POST `/rooms`

**Descripción**: Crea una nueva sala

**Roles permitidos**: `admin`, `organizador`

**Body esperado**:

```json
{
  "name": "Auditorio Principal",
  "description": "Sala principal con capacidad para 500 personas",
  "eventId": "event_uuid",
  "capacity": 500,
  "location": "Planta Baja, Sector A",
  "equipment": ["proyector", "micrófono", "sistema_audio"],
  "accessibility": true,
  "floor": "PB",
  "building": "Edificio Central"
}
```

### GET `/rooms/{id}`

**Descripción**: Obtiene información detallada de una sala

**Roles permitidos**: Todos los autenticados

### PUT `/rooms/{id}`

**Descripción**: Actualiza información de una sala

**Roles permitidos**: `admin`, `organizador`

**Restricciones**:

- No se puede reducir la capacidad si hay actividades programadas que excedan la nueva capacidad

### DELETE `/rooms/{id}`

**Descripción**: Elimina una sala (solo si no tiene actividades programadas)

**Roles permitidos**: `admin`

### GET `/rooms/availability`

**Descripción**: Verifica la disponibilidad de una sala en una fecha específica

**Query Parameters**:

- 'id' (requires): id de sala
- `startTime` (string, optional): fecha de inicio
- `endTime` (string, optional): fecha de fin para verificar disponibilidad

**Respuesta**:

```json
{
  "success": true,
  "data": {
    "roomId": "room_uuid",
    "date": "2024-03-15",
    "available": true,
    "occupiedSlots": [
      {
        "startTime": "09:00:00",
        "endTime": "10:30:00",
        "activityTitle": "Conferencia Inaugural"
      }
    ],
    "availableSlots": [
      {
        "startTime": "10:30:00",
        "endTime": "12:00:00"
      }
    ]
  }
}
```

---

## 🎯 ACTIVITIES (Actividades/Sesiones)

### GET `/`

**Descripción**: Obtiene actividades filtradas

**Query Parameters**:

- `scheduleId` (string): Filtrar por programa
- `roomId` (string): Filtrar por sala
- `date` (string): Filtrar por fecha (YYYY-MM-DD)
- `type` (string): Filtrar por tipo de actividad
- `status` (string): filtrar por estado de actividad

**Roles permitidos**: Todos los autenticados

### POST `/`

**Descripción**: Crea una nueva actividad

**Roles permitidos**: `admin`, `organizador`

**Body esperado**:

```json
{
  "title": "Conferencia Inaugural",
  "description": "Presentación de apertura del evento",
  "scheduleId": "schedule_uuid",
  "roomId": "room_uuid",
  "type": "keynote",
  "startTime": "2024-03-15T09:00:00Z",
  "endTime": "2024-03-15T10:30:00Z",
  "capacity": 500,
  "registrationRequired": false,
  "tags": ["apertura", "keynote"],
  "language": "español",
  "level": "intermediate"
}
```

**Validaciones automáticas**:

- Verificar disponibilidad de sala
- Calcular duración automáticamente
- Detectar conflictos de programación
- Validar que la capacidad no exceda la de la sala

### GET `/by-id`

**Descripción**: Obtiene detalles completos de una actividad, incluyendo expositores

**Respuesta incluye**:

```json
{
  "success": true,
  "data": {
    "activity": {
      "id": "activity_uuid",
      "title": "Conferencia Inaugural"
      // ... otros campos de actividad
    },
    "speakers": [
      {
        "id": "speaker_uuid",
        "role": "main_speaker",
        "speakerOrder": 1,
        "userInfo": {
          "name": "Juan Pérez",
          "company": "Tech Corp"
        }
      }
    ],
    "room": {
      "name": "Auditorio Principal",
      "location": "Planta Baja, Sector A"
    }
  }
}
```

### PUT `/`

**Descripción**: Actualiza una actividad existente

**Roles permitidos**: `admin`, `organizador`

### DELETE `/`

**Descripción**: Elimina una actividad

**Roles permitidos**: `admin`

**Validaciones**:

- No se puede eliminar si está en estado `confirmed` o `completed`
- Debe notificar a participantes registrados

## Activities Spekers

### POST `/activity-speakers`

**Descripción**: Asigna un expositor a una actividad

**Body esperado**:

```json
{
  "speakerId": "speaker_uuid",
  "role": "main_speaker",
  "speakerOrder": 1
}
```

**Validaciones**:

- Verificar que el expositor no tenga conflictos de horario
- Validar que el rol no esté duplicado (solo un main_speaker por actividad)

### DELETE `/activity-speakers`

**Descripción**: Remueve un expositor de una actividad

**Roles permitidos**: `admin`, `organizador`

---

## 🎤 SPEAKERS (Expositores)

### GET `/speakers`

**Descripción**: Obtiene expositores de un evento

**Query Parameters**:

- `eventId` (string, required): ID del evento
- `status` (string): Filtrar por estado (`pending`, `confirmed`, `cancelled`)

**Roles permitidos**: Todos los autenticados

### POST `/speakers`

**Descripción**: Registra un nuevo expositor para el evento

**Roles permitidos**: `admin`, `organizador`

**Body esperado**:

```json
{
  "userId": "user_uuid",
  "eventId": "event_uuid",
  "bio": "Experto en tecnología con 10 años de experiencia...",
  "company": "Tech Solutions",
  "position": "CTO",
  "expertise": ["javascript", "nodejs", "react"],
  "socialMedia": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "twitter": "https://twitter.com/johndoe",
    "website": "https://johndoe.com"
  },
  "profileImage": "https://example.com/profile.jpg"
}
```

### GET `/speakers/{id}`

**Descripción**: Obtiene información completa de un expositor

**Roles permitidos**: Todos los autenticados

### PUT `/speakers/{id}`

**Descripción**: Actualiza información del expositor

**Roles permitidos**: `admin`, `organizador`, `expositor` (solo su propio perfil)

### DELETE `/speakers/{id}`

**Descripción**: Elimina un expositor del evento

**Roles permitidos**: `admin`

**Validaciones**:

- No se puede eliminar si tiene actividades asignadas

### GET `/speakers/{id}/schedule`

**Descripción**: Obtiene la agenda personal del expositor

**Respuesta**:

```json
{
  "success": true,
  "data": {
    "speakerId": "speaker_uuid",
    "activities": [
      {
        "id": "activity_uuid",
        "title": "Conferencia sobre React",
        "startTime": "2024-03-15T14:00:00Z",
        "endTime": "2024-03-15T15:30:00Z",
        "room": "Sala B",
        "role": "main_speaker",
        "status": "confirmed"
      }
    ]
  }
}
```

---

## ⚠️ CONFLICTS (Conflictos de Programación)

### GET `/conflicts`

**Descripción**: Obtiene conflictos detectados en el evento

**Query Parameters**:

- `eventId` (string, required): ID del evento
- `status` (string): Filtrar por estado (`detected`, `acknowledged`, `resolved`, `ignored`)
- `severity` (string): Filtrar por severidad (`low`, `medium`, `high`, `critical`)

**Roles permitidos**: `admin`, `organizador`

### POST `/conflicts/detect`

**Descripción**: Registra la deteccion de un conflicto

**Body esperado**:

```json
{
  "eventId": "event_uuid",
  "checkTypes": ["room_overlap", "speaker_overlap", "capacity_exceeded"]
}
```

**Tipos de conflictos detectados**:

- `room_overlap`: Dos actividades en la misma sala al mismo tiempo
- `speaker_overlap`: Un expositor en dos actividades simultáneas
- `capacity_exceeded`: Actividad excede capacidad de la sala
- `time_conflict`: Actividades fuera del horario del evento

### GET `/conflicts/{id}`

**Descripción**: Obtiene detalles específicos de un conflicto

### PUT `/conflicts/{id}/resolve`

**Descripción**: Marca un conflicto como resuelto

**Body esperado**:

```json
{
  "resolution": "Se cambió la sala de la actividad a Auditorio B",
  "resolvedBy": "user_uuid"
}
```

### DELETE `/conflicts/{id}`

**Descripción**: Marca un conflicto como ignorado

**Roles permitidos**: `admin`

---

## 📊 Códigos de Estado HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Datos inválidos o faltantes
- **401 Unauthorized**: Token JWT inválido o faltante
- **403 Forbidden**: Sin permisos para realizar la operación
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflicto de recursos (ej: horarios superpuestos)
- **422 Unprocessable Entity**: Validaciones de negocio fallidas
- **500 Internal Server Error**: Error interno del servidor

## 🔄 Integraciones con Otros Servicios

### Con Auth Service

- Validación de tokens JWT en cada request
- Obtención de información de usuario para `createdBy` y `userId`
- Verificación de roles y permisos

### Con Event Service

- Validación de existencia de eventos antes de crear programas
- Sincronización de fechas y configuraciones del evento
- Notificación de cambios en el programa

### Con Registration Service

- Consulta de inscripciones por actividad para validar capacidades
- Notificación de cambios que afecten inscripciones

### Con Notification Service

- Envío automático de notificaciones por:
  - Cambios en horarios de actividades
  - Nuevas actividades publicadas
  - Conflictos detectados (a organizadores)
  - Confirmaciones de participación (a expositores)
