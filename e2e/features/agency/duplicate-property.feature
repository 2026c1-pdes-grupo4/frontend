# language: es
Característica: Detección de propiedades duplicadas al publicar

  Escenario: Una segunda agencia publica la misma propiedad con otro precio
    Dado que la inmobiliaria "inmo1" está autenticada
    Y publica una propiedad nueva con precio "115000"
    Cuando la inmobiliaria "inmo2" se autentica
    Y completa el formulario de nueva propiedad con los mismos datos catastrales y precio "130000"
    Entonces se le pide confirmar que ya existe esa propiedad
    Y al confirmar, la propiedad aparece en su lista con precio "130000"

  Escenario: Al venderse una propiedad, deja de estar disponible para todas las inmobiliarias que la publican
    Dado que la inmobiliaria "inmo1" está autenticada
    Y publica una propiedad nueva con precio "115000"
    Cuando la inmobiliaria "inmo2" se autentica
    Y completa el formulario de nueva propiedad con los mismos datos catastrales y precio "130000"
    Y se le pide confirmar que ya existe esa propiedad
    Y al confirmar, la propiedad aparece en su lista con precio "130000"
    Cuando el comprador "buyer1" compra la propiedad publicada por "inmo1"
    Entonces esa propiedad ya no aparece en los resultados de búsqueda para el comprador "buyer1"
    Y la inmobiliaria "inmo2" todavía la ve en su lista de publicaciones
