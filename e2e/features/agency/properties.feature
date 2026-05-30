# language: es
Característica: Agencia gestiona sus propiedades

  Antecedentes:
    Dado que la agencia está autenticada en el panel

  Escenario: Ver lista de propiedades propias
    Cuando navega a la pestaña Propiedades
    Entonces la lista muestra al menos una propiedad
