/* =====================================================================
   Botón "Subir" (todas las páginas)
   Aparece al bajar más de 500 px y vuelve al inicio de la página.
   Los estilos están en css/layout.css (.scroll-to-top).
   ===================================================================== */
(function () {
    'use strict';

    const DISTANCIA_PARA_MOSTRAR = 500;

    const boton = document.createElement('button');
    boton.className = 'scroll-to-top';
    boton.setAttribute('aria-label', 'Subir');
    boton.innerHTML = icono('flecha-arriba', 22);
    document.body.appendChild(boton);

    window.addEventListener('scroll', () => {
        boton.classList.toggle('visible', window.scrollY > DISTANCIA_PARA_MOSTRAR);
    });

    boton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();
