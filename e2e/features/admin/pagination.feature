# language: es
@paginacion
Característica: Paginación en el panel de admin

  Antecedentes:
    Dado que el admin está autenticado en el panel

  Escenario: La primera página muestra como máximo 10 usuarios
    Cuando navega a la pestaña Usuarios
    Entonces ve como máximo 10 filas en la tabla

  Escenario: Puede navegar a la siguiente página de usuarios
    Cuando navega a la pestaña Usuarios
    Y hace clic en siguiente página
    Entonces ve usuarios de la segunda página

  Escenario: El botón anterior está deshabilitado en la primera página
    Cuando navega a la pestaña Usuarios
    Entonces el botón de página anterior está deshabilitado

  Escenario: El botón siguiente está deshabilitado en la última página
    Cuando navega a la pestaña Usuarios
    Y hace clic en siguiente página
    Entonces el botón de página siguiente está deshabilitado
