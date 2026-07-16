# language: es
Característica: Acceso y autenticación del comprador

  Escenario: Login con contraseña incorrecta muestra un error
    Cuando intenta iniciar sesión con usuario "buyer2" y contraseña incorrecta
    Entonces ve un mensaje de error de autenticación
    Y sigue en la página de login

  Escenario: Un comprador no puede acceder al panel de administración
    Dado que el comprador está autenticado en el panel
    Cuando navega directamente a "/admin"
    Entonces es redirigido fuera del panel

  Escenario: Un comprador no puede acceder al panel de inmobiliaria
    Dado que el comprador está autenticado en el panel
    Cuando navega directamente a "/agency"
    Entonces es redirigido fuera del panel
