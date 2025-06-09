# Servicio de Eventos

- Gestion de eventos

  1. creacion de eventos
  2. modificacion de informacion de eventos
  3. modificacion de fechas de eventos
  4. modificacion de ubicacion/locacion de evento
  5. modificacion de capacidad de evento
  6. modificacion de estado de evento

- Obtencion de informacion
  1. obtener lista de eventos completa
  2. obtener lista de eventos activos
  3. obtener lista de eventos por fecha ( rango, o fecha inicio / fecha fin.)

## Esquema de eventos

event.schema = {
title:string,
description:string,
startDate:date,
endDate:date,
location:{
name:string,
address:string,
city:string,
},
capacity:number,
organizerId:string ( relacion con schema de User)
pricing:{
type:string,
price:number
},
status:string ( Plantificación, Activo, Finalizado, Cancelado, Postergado.)
}

## Proceso de obtencion de informacion de eventos

1. al recibir solicitud para obtener informacion de los eventos, se decodifica token de usuario
2. se valida que sea organizador u/o Administrador

## Proceso de creacion, modificacion de eventos.

1. Al crear evento valida decodifica el token del usuario recibido
2. valida si es valido
3. Se valida que sea organizador u/o Administrador.

## Middleware utilizados

authMiddleware: valida el token del usuario y verifica si es valido y esta activo.
permissionMiddleware: Valida si el usuario tiene los permisos requerido para acceder a ese enpoint
