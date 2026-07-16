# language: es
Característica: Admin elimina una inmobiliaria

  Antecedentes:
    Dado que el admin está autenticado en el panel

  Escenario: Al eliminar una inmobiliaria, sus publicaciones dejan de estar disponibles
    Cuando navega a la pestaña Inmobiliarias
    Y hace clic en Nueva Inmobiliaria
    Y completa el formulario de inmobiliaria y lo guarda
    Y esa inmobiliaria publica una propiedad
    Y elimina esa inmobiliaria
    Entonces la inmobiliaria ya no aparece en la tabla de inmobiliarias
    Y esa propiedad ya no aparece en los resultados de búsqueda de los compradores
    Y la inmobiliaria eliminada ya no puede iniciar sesión
