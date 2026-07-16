# language: es
Característica: Comprador consulta su historial de compras

  Antecedentes:
    Dado que el comprador está autenticado en el panel

  Escenario: Navegar a la página de Mis Compras
    Cuando navega a la página de mis compras
    Entonces ve la tabla de compras

  Escenario: Ver compras después de comprar una propiedad
    Dado que ya compró una propiedad disponible
    Cuando navega a la página de mis compras
    Entonces la tabla de compras muestra al menos una fila
    Y cada fila de compra tiene propiedad y precio visibles
