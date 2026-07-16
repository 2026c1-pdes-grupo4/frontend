# language: es
Característica: Admin gestiona usuarios

  Antecedentes:
    Dado que el admin está autenticado en el panel
    Cuando navega a la pestaña Usuarios

  Escenario: Crear un nuevo usuario
    Cuando hace clic en nuevo usuario
    Y completa el formulario de usuario con datos válidos
    Y guarda el formulario de usuario
    Entonces el nuevo usuario aparece en la tabla

  Escenario: Editar un usuario existente
    Cuando hace clic en editar sobre el primer usuario
    Y modifica el username del usuario
    Y guarda el formulario de usuario
    Entonces la tabla refleja el cambio de username

  Escenario: Eliminar un usuario
    Cuando hace clic en eliminar sobre el primer usuario
    Y confirma la eliminación del usuario
    Entonces el usuario ya no aparece en la tabla
