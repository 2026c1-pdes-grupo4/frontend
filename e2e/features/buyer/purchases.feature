# language: es
Característica: Comprador realiza una compra

  Antecedentes:
    Dado que el comprador está autenticado en el panel

  Escenario: Comprar una propiedad disponible
    Cuando navega a la página de propiedades
    Y hace clic en "Comprar" en la primera propiedad disponible
    Y confirma la compra
    Entonces ve el mensaje de confirmación de compra

  Escenario: No puede comprar una propiedad ya vendida
    Dado que ya compró una propiedad disponible
    Cuando navega a la página de propiedades
    Entonces esa propiedad ya no aparece en la lista
