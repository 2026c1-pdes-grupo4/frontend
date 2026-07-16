# language: es
Característica: Comprador gestiona sus favoritos

  Antecedentes:
    Dado que el comprador está autenticado en el panel

  Escenario: Guardar una propiedad como favorita con puntaje y comentario
    Cuando navega a la página de propiedades
    Y hace clic en el botón de favorito de una propiedad disponible
    Y completa el formulario de favorito con puntaje 4 y comentario "Me encanta la ubicación, guardada para cuando sea funcionario público poder comprarla"
    Y envía el formulario de favorito
    Y navega a la página de favoritos
    Entonces esa propiedad aparece en la lista de favoritos con puntaje 4 y comentario "Me encanta la ubicación, guardada para cuando sea funcionario público poder comprarla"

  Escenario: Editar el puntaje y comentario de un favorito
    Dado que ya tiene una propiedad guardada como favorita
    Cuando navega a la página de favoritos
    Y hace clic en editar el primer favorito
    Y cambia el puntaje a 5 y el comentario a "Comentario actualizado"
    Y guarda los cambios del favorito
    Entonces el primer favorito muestra puntaje 5 y comentario "Comentario actualizado"

  Escenario: Eliminar un favorito
    Dado que ya tiene una propiedad guardada como favorita
    Cuando navega a la página de favoritos
    Y cuenta los favoritos en la lista
    Y elimina el primer favorito
    Entonces la lista de favoritos tiene un elemento menos
