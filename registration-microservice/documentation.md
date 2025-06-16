# Microservicio de registros

- Gestionar inscripciones de participantes a los eventos
- Procesar diferentes tipos de inscripciones y tarifas
- Generar códigos QR/credenciales para el acceso

---

# Endpoints de Inscripciones (`/inscription`)

## 1. Obtener todas las inscripciones

- **Ruta:** `GET /inscription/all`
- **Descripción:** Devuelve la lista completa de inscripciones registradas.
- **Respuesta exitosa:** `200 OK` con array de inscripciones.

---

## 2. Obtener inscripciones activas

- **Ruta:** `GET /inscription/active`
- **Descripción:** Devuelve todas las inscripciones activas (no canceladas).
- **Respuesta exitosa:** `200 OK` con array de inscripciones activas.

---

## 3. Obtener inscripción por ID

- **Ruta:** `GET /inscription/by-id?inscriptionId={id}`
- **Descripción:** Devuelve la información de una inscripción específica por su ID.
- **Parámetros de consulta:**
  - `inscriptionId` (string, requerido): ID de la inscripción.
- **Respuesta exitosa:** `200 OK` con el objeto inscripción.
- **Errores:**
  - `404 Not Found` si no existe la inscripción.

---

## 4. Obtener inscripciones por evento

- **Ruta:** `GET /inscription/by-event?eventId={id}`
- **Descripción:** Devuelve todas las inscripciones asociadas a un evento.
- **Parámetros de consulta:**
  - `eventId` (string, requerido): ID del evento.
- **Respuesta exitosa:** `200 OK` con array de inscripciones.
- **Errores:**
  - `404 Not Found` si no hay inscripciones para ese evento.

---

## 5. Obtener inscripciones por tipo de inscripción

- **Ruta:** `GET /inscription/by-type?typeInscriptionId={id}`
- **Descripción:** Devuelve todas las inscripciones de un tipo específico.
- **Parámetros de consulta:**
  - `typeInscriptionId` (string, requerido): ID del tipo de inscripción.
- **Respuesta exitosa:** `200 OK` con array de inscripciones.
- **Errores:**
  - `404 Not Found` si no hay inscripciones para ese tipo.

---

## 6. Obtener inscripciones por estado

- **Ruta:** `GET /inscription/by-status?status={estado}`
- **Descripción:** Devuelve todas las inscripciones con un estado específico (ej: Pendiente, Confirmado, Cancelado).
- **Parámetros de consulta:**
  - `status` (string, requerido): Estado de la inscripción.
- **Respuesta exitosa:** `200 OK` con array de inscripciones.
- **Errores:**
  - `404 Not Found` si no hay inscripciones con ese estado.

---

## 7. Obtener inscripciones por evento y estado

- **Ruta:** `GET /inscription/by-event-and-status?eventId={id}&status={estado}`
- **Descripción:** Devuelve todas las inscripciones de un evento con un estado específico.
- **Parámetros de consulta:**
  - `eventId` (string, requerido): ID del evento.
  - `status` (string, requerido): Estado de la inscripción.
- **Respuesta exitosa:** `200 OK` con array de inscripciones.
- **Errores:**
  - `404 Not Found` si no hay inscripciones para ese evento y estado.

---

## 8. Registrar nueva inscripción

- **Ruta:** `POST /inscription/`
- **Descripción:** Registra una nueva inscripción.  
  Valida existencia y estado del evento, tipo de inscripción, capacidad disponible y que no exista una inscripción previa con los mismos datos.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Body:**
  - Objeto con los datos de la inscripción (evento, tipo, email, teléfono, etc).
- **Respuesta exitosa:** `201 Created` con la inscripción creada.
- **Errores:**
  - `401 Unauthorized` si no se envía token.
  - `400 Bad Request` si faltan datos o hay validaciones fallidas.

---

## 9. Actualizar información de inscripción

- **Ruta:** `PUT /inscription/info?inscriptionId={id}`
- **Descripción:** Actualiza los datos de una inscripción existente.  
  Valida existencia y estado del evento, tipo de inscripción y que el evento no haya pasado.
- **Parámetros de consulta:**
  - `inscriptionId` (string, requerido): ID de la inscripción.
- **Body:**
  - Objeto con los campos a actualizar.
- **Respuesta exitosa:** `200 OK` con la inscripción actualizada.
- **Errores:**
  - `404 Not Found` si no existe la inscripción.

---

## 10. Actualizar estado de inscripción

- **Ruta:**
  - `PUT /inscription/pending?inscriptionId={id}` (marca como pendiente)
  - `PUT /inscription/paid?inscriptionId={id}` (marca como confirmada)
  - `PUT /inscription/cancel?inscriptionId={id}` (marca como cancelada)
- **Descripción:** Cambia el estado de una inscripción.
- **Parámetros de consulta:**
  - `inscriptionId` (string, requerido): ID de la inscripción.
- **Respuesta exitosa:** `200 OK` con la inscripción actualizada.
- **Errores:**
  - `404 Not Found` si no existe la inscripción.

---

## 11. Eliminar inscripción

- **Ruta:** `DELETE /inscription/delete?inscriptionId={id}`
- **Descripción:** Elimina una inscripción por su ID.
- **Parámetros de consulta:**
  - `inscriptionId` (string, requerido): ID de la inscripción.
- **Respuesta exitosa:** `200 OK` con mensaje de éxito.
- **Errores:**
  - `404 Not Found` si no existe la inscripción.

# Endpoints de Tipos de Inscripción (`/type-inscription`)

## 1. Obtener todos los tipos de inscripción

- **Ruta:** `GET /type-inscription/all`
- **Descripción:** Devuelve una lista con todos los tipos de inscripción registrados.
- **Respuesta exitosa:** `200 OK` con array de tipos de inscripción.

---

## 2. Obtener tipos de inscripción activos

- **Ruta:** `GET /type-inscription/active`
- **Descripción:** Devuelve una lista de los tipos de inscripción que están activos.
- **Respuesta exitosa:** `200 OK` con array de tipos de inscripción activos.

---

## 3. Obtener tipo de inscripción por ID

- **Ruta:** `GET /type-inscription/by-id?typeInscriptionId={id}`
- **Descripción:** Devuelve la información de un tipo de inscripción específico según su ID.
- **Parámetros de consulta:**
  - `typeInscriptionId` (string, requerido): ID del tipo de inscripción.
- **Respuesta exitosa:** `200 OK` con el objeto del tipo de inscripción.
- **Errores:**
  - `404 Not Found` si no existe el tipo de inscripción.

---

## 4. Crear un nuevo tipo de inscripción

- **Ruta:** `POST /type-inscription/`
- **Descripción:** Crea un nuevo tipo de inscripción.
- **Body:**
  - Objeto con los datos del nuevo tipo de inscripción.
- **Respuesta exitosa:** `201 Created` con el objeto creado.

---

## 5. Actualizar un tipo de inscripción

- **Ruta:** `PUT /type-inscription/update?typeInscriptionId={id}`
- **Descripción:** Actualiza la información de un tipo de inscripción existente.
- **Parámetros de consulta:**
  - `typeInscriptionId` (string, requerido): ID del tipo de inscripción.
- **Body:**
  - Objeto con los campos a actualizar.
- **Respuesta exitosa:** `200 OK` con el objeto actualizado.
- **Errores:**
  - `404 Not Found` si no existe el tipo de inscripción.

---

## 6. Activar un tipo de inscripción

- **Ruta:** `PUT /type-inscription/activate?typeInscriptionId={id}`
- **Descripción:** Activa un tipo de inscripción (lo marca como disponible).
- **Parámetros de consulta:**
  - `typeInscriptionId` (string, requerido): ID del tipo de inscripción.
- **Respuesta exitosa:** `200 OK` con el objeto activado.
- **Errores:**
  - `404 Not Found` si no existe el tipo de inscripción.

---

## 7. Desactivar un tipo de inscripción

- **Ruta:** `PUT /type-inscription/deactivate?typeInscriptionId={id}`
- **Descripción:** Desactiva un tipo de inscripción (lo marca como no disponible).
- **Parámetros de consulta:**
  - `typeInscriptionId` (string, requerido): ID del tipo de inscripción.
- **Respuesta exitosa:** `200 OK` con el objeto desactivado.
- **Errores:**
  - `404 Not Found` si no existe

## Tipos de inscripciones

- schema individual para tipos de inscripciones ya definidos, con tarifas definidas por tipo de inscripcion.

### Esquema de inscripciones

inscriptions.schema = {
name:string
lastname:string
dateOfBirth:date,
email:string,
phone:string,
status:boolean
statusDetail:string
event:Event.schema
typeInscription: TypeInscription.schema
amount:number,
createdAt:date
}

### Esquema de tipos de inscripciones

typeInscription.schema = {
name:string
description:string,
price:number,
status:boolean,
}

---

### Workflow de inscripciones

1. Registro de inscripcion:
   1.1 Validar que el evento existe y esta activo
   1.2 validar que el tipo de inscripcion existe y esta activo
   1.3 validar estado de evento y capacity > 0
   1.4 Validar que no exista una persona con mismo email ya inscripto
   1.5 Registrar inscripcion
   1.6 Generar codigo QR/credencial de inscripcion

2. Modificacion de inscripcion:
   2.1 Modificar estado de inscripcion a cancelada siempre y cuando fecha de evento no haya pasado
   2.2 Modificar estado de inscripcion a pagada siempre y cuando fecha de evento no haya pasado
   2.3 Modificar estado de inscripcion a pendiente pago siempre y cuando fecha de evento no haya pasado

3. Eliminacion de inscripcion:
   3.1 Eliminar inscripcion siempre y cuando fecha de evento no haya pasado
   3.2 Restar 1 a capacity del evento
4. Generar codigo qr
5. valida que la inscripcion este en estado confirmado y true.
6. valida que el evento no haya finalizado ( fecha inicio mayor a fecha actual)
7. que el evento este en estado activo o true
8.

---
