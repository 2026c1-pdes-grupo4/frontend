# language: es
Característica: Comprador guarda propiedades como favoritas

  Antecedentes:
    Dado que el comprador está autenticado en el panel

  Escenario: Guardar una propiedad como favorita
    Cuando navega a la página de propiedades
    Y hace clic en el ícono de favorito de la primera propiedad
    Y califica con 4 estrellas y escribe el comentario "Muy buena ubicación"
    Y guarda el favorito
    Entonces la propiedad aparece marcada como favorita
