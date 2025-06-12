# Microservicio de registros

- Gestionar inscripciones de participantes a los eventos
- Procesar diferentes tipos de inscripciones y tarifas
- Generar códigos QR/credenciales para el acceso

---

## Endpoints

### GET

/by-id: obtiene inscripcion por id
/all: obtiene todas las inscripciones ( activas o inactivas )
/active: obtiene todas las inscripciones con status = true
/by-event: obtiene inscripciones por evento
/by-type: obtiene inscripciones por tipo de inscripcion
/by-status: obtiene inscripciones por estado
/by-event-and-status: obtiene inscripciones por estado y evento

### POST

/ : crear / registrar inscripcion
/generate-qr: genera el qr para la inscripcion

### PUT

/info: modificar informacion de inscripcion
/cancel: modificar detalle estado a cancelado y estado a cancel.
/paid: modificar detalle estado a Confirmado y estado a true.
/pending: Modificar estado a Pendiente y estado a true.

### DELETE

/delete: eliminar inscripcion.

---

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
