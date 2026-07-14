# language: es
Característica: Admin crea usuarios e inmobiliarias

  Antecedentes:
    Dado que el admin está autenticado en el panel

  Escenario: El admin crea un nuevo usuario
    Cuando navega a la pestaña Usuarios
    Y hace clic en Nuevo Usuario
    Y completa el formulario de usuario y lo guarda
    Entonces el nuevo usuario aparece en la tabla de usuarios

  Escenario: El admin cancela la creación de un usuario
    Cuando navega a la pestaña Usuarios
    Y hace clic en Nuevo Usuario
    Y cancela el formulario de usuario
    Entonces el formulario de usuario ya no está visible

  Escenario: El admin crea una nueva inmobiliaria
    Cuando navega a la pestaña Inmobiliarias
    Y hace clic en Nueva Inmobiliaria
    Y completa el formulario de inmobiliaria y lo guarda
    Entonces la nueva inmobiliaria aparece en la tabla de inmobiliarias
