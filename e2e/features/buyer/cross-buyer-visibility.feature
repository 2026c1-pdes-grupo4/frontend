# language: es
Característica: Visibilidad de propiedades entre distintos compradores

  Escenario: Una propiedad comprada por un comprador ya no aparece disponible para otro comprador
    Dado que el comprador "buyer1" compra una propiedad disponible
    Cuando el comprador "buyer2" se autentica y navega a la página de propiedades
    Entonces esa propiedad ya no aparece en la lista
