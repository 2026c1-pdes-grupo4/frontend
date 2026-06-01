# language: es
Característica: Agencia gestiona sus propiedades

  Antecedentes:
    Dado que la agencia está autenticada en el panel

  Escenario: Ver lista de propiedades propias
    Cuando navega a la pestaña Propiedades
    Entonces la lista muestra al menos una propiedad

  Escenario: Crear una nueva propiedad
    Cuando navega a la pestaña Propiedades
    Y hace clic en "Nueva propiedad"
    Y completa el formulario con dirección "Av. Santa Fe 1234" y precio "180000"
    Y envía el formulario
    Entonces la propiedad con dirección "Av. Santa Fe 1234" aparece en la lista

  Escenario: Eliminar una propiedad
    Cuando navega a la pestaña Propiedades
    Y cuenta las propiedades en la lista
    Y elimina la primera propiedad
    Entonces la lista tiene una propiedad menos
