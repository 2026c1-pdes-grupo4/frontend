# language: es
Característica: Admin gestiona agencias

  Antecedentes:
    Dado que el admin está autenticado en el panel
    Cuando navega a la pestaña Agencias

  Escenario: Crear una nueva agencia
    Cuando hace clic en nueva agencia
    Y completa el formulario de agencia con datos válidos
    Y guarda el formulario de agencia
    Entonces la nueva agencia aparece en la tabla de agencias

  Escenario: Editar una agencia existente
    Cuando hace clic en editar sobre la primera agencia
    Y modifica el username de la agencia
    Y guarda el formulario de agencia
    Entonces la tabla de agencias refleja el cambio de username

  Escenario: Eliminar una agencia
    Cuando hace clic en eliminar sobre la primera agencia
    Y confirma la eliminación de la agencia
    Entonces la agencia ya no aparece en la tabla de agencias
