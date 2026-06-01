# language: es
Característica: Agencia consulta sus ventas

  Antecedentes:
    Dado que la agencia está autenticada en el panel

  Escenario: Ver tabla de ventas
    Cuando navega a la pestaña Ventas
    Entonces la tabla de ventas muestra al menos una fila

  Escenario: La venta muestra precio y fecha
    Cuando navega a la pestaña Ventas
    Entonces cada fila de venta tiene precio y fecha visibles
