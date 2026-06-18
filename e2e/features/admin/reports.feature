# language: es
Característica: Admin consulta reportes del sistema

  Antecedentes:
    Dado que el admin está autenticado en el panel
    Cuando navega a la pestaña Reportes

  Escenario: Ver top 5 compradores
    Entonces la tabla de top compradores muestra al menos una fila
    Y cada fila de comprador tiene usuario y cantidad de compras

  Escenario: Ver top 5 propiedades mejor puntuadas
    Entonces la tabla de propiedades mejor puntuadas muestra al menos una fila
    Y cada fila de propiedad tiene dirección y puntaje promedio

  Escenario: Ver top 5 inmobiliarias por ventas
    Entonces la tabla de top inmobiliarias muestra al menos una fila
    Y cada fila de inmobiliaria tiene nombre y cantidad de ventas
