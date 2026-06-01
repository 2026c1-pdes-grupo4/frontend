# language: es
Característica: Agencia consulta sus clientes

  Antecedentes:
    Dado que la agencia está autenticada en el panel

  Escenario: Ver tabla de clientes
    Cuando navega a la pestaña Clientes
    Entonces la tabla de clientes muestra al menos una fila

  Escenario: La tabla de clientes muestra usuario y email
    Cuando navega a la pestaña Clientes
    Entonces cada fila de cliente tiene usuario y email visibles
