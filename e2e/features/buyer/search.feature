# language: es
Característica: Comprador busca y filtra propiedades

  Antecedentes:
    Dado que el comprador está autenticado en el panel

  Escenario: Filtrar propiedades por ciudad
    Cuando navega a la página de propiedades
    Y filtra por ciudad "Buenos Aires"
    Entonces hay al menos una propiedad en la lista
    Y todas las propiedades de la lista son de la ciudad "Buenos Aires"

  Escenario: Filtrar propiedades por rango de precio
    Cuando navega a la página de propiedades
    Y filtra por precio mínimo "100000" y precio máximo "300000"
    Entonces hay al menos una propiedad en la lista
    Y todas las propiedades de la lista tienen un precio entre "100000" y "300000"

  Escenario: Limpiar los filtros restaura la lista completa
    Cuando navega a la página de propiedades
    Y cuenta las propiedades del listado de búsqueda
    Y filtra por ciudad "Buenos Aires"
    Y hace clic en "Clear"
    Entonces la lista de propiedades vuelve a tener la misma cantidad que al principio
