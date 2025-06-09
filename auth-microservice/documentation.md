# Servicio de Autenticacion

- gestion de registro:

  1. registro de usuario

- autenticacion de usuario:
  1. validacion de usuario ( asistente, organizadores, expositores ): existencia del mismo, estado ( activo / inactivo )
  2. auth basic ( inicio de sesion basico, inicio de sesion con auth0)
  3. generar token jwt y validar session.
  4. generar refresh token
  5. totp : segundo factor de autenticacion.

user.shcema = {
user:"string",
password:"string",
status:boolean,
rol:{
id: string,
title: string,
permissions:[{id: string, modulo:string }]
}
totpValidation:boolean,
createAt: number // timestamp
updatedAt: number // timestamp
}

## Proceso de login

1. El usuario se registra con credenciales básicas (Auth Basic)
   1.1. Se valida que el usuari no este registrado
   1.2. Se guarda la informacion del mismo dentro de la base de datos.
2. Al registrarse, se le proporciona un código **QR** para configurar **TOTP**

3. Para iniciar sesión:
   - Primero usa Auth Basic con usuario y contraseña
   - Luego proporciona un código **TOTP** válido
   - Al validarse correctamente, recibe un token **JWT** y un refresh token
4. El token **JWT** se utiliza para acceder a los demás servicios
5. Cuando el **JWT** expira, se utiliza el refresh token para obtener un nuevo **JWT** (configuración sugerida 1 h y 24 hs)

## Rutas de autenticacion

1. _POST_ login: inicio de sesion:

- valido si eeeeeeeeexiste un usuario registrado con ese nombre
- comparo si la password coincide
- actualizo el lastLogin
- elimino las sesiones y token del usuario
- genero acces token y refresh token
- guardo el refresh-token en base de datos
- devuelvo usuario, accessToken y refrshToken.

2. _post_ refresh-token: obtener un nuevo token de refresco

- valido que recibio el refresh token
- decodido el refresh token
- con los datos del token decodificado genero uno nuevo

3. _post_ validate-totp: validar codigo totp del usuario

- obtengo el totpSecret del usuario por id
- valido si el totp es valido en base al secret del usuario
- actualizo la validacion de totp

4. _post_ logout: cerrar sesion

- valido si recibi el refresh token
- busco usuario por id y elimino / limpio el refresh token
- limpio las cookies

5. _get_ verify-token: validar token de usuario

- obtengo el token del header
- valido si recibi el token y valido el servicio el token
- obteng el usuario decodificado
- devuelvo el usuario decodificado al front

## Rutas de usuario

1. _post_ register: registrar nuevo usuario.

- recibo user, email y contraseña
- valido que recibi los datos correctamente
- valido que no existra otro usuario con ese username o email
- hasheo la pasword
- asigno un rol por defecto al crearlo
- guardo la info del usuario
- genero un qr para vincular con el totp
- devuelvo informacion del usuario nuevo y qr para validar.

2. _get_ info: obtener informacion del usuario.

- recibo id del usuario
- devuelvo informacion registrada del mismo ( sin password)

3. _get_: permission: obtengo permisos del usuario.

- recibo id del usuario
- consulto permiso del usuario en base a id recibido.
- devuelvo unicamente los permisos del usuario

4. _get_ : check-permission: verifico y valido permisos de un usuario para acceder a un modulo.

- obtengo id usuario y nombre de modulo.
- obtengo informacion del usuario y valido si el usuario tiene permiso para el modulo recibido. (con middleware de base de datos)

4. _put_ update-info: modificar informacion del usuario.

- obtengo user id e informacion modificada del usuario
- valido que recibir correctamente los datos
- actualizo usuario, rol, status, totpValidation y fecha de modificacion

5. _pust_: update-status: modificar estado de usuario.

- recibo id usuario y estado modificado.
- busco el usuario y modifico el estado.

6. _put_ update-password: cambiar contraseña de usuario.

- recibo user id y nueva contraseña.
- obtengo info de usuario
- asigno y modifico contraseña.
  ( falta valida que la nueva clave no sea igual a la anterior)
