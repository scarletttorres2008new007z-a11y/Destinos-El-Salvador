/* =====================================================================
   Navegación (todas las páginas)
   - Abre y cierra el menú en móvil.
   - Marca en el menú el enlace de la página actual.
   - Desplaza suavemente hasta las secciones enlazadas con "#".
   ===================================================================== */
(function () {
    'use strict';

    const PAGINA_INICIAL = 'index.html';
    const ICONO_ABRIR = '☰';
    const ICONO_CERRAR = '✕';

    const botonMenu = document.querySelector('.mobile-menu-btn');
    const menuMovil = document.querySelector('.mobile-menu');

    function iniciarMenuMovil() {
        if (!botonMenu || !menuMovil) return;

        botonMenu.addEventListener('click', () => {
            const abierto = menuMovil.classList.toggle('active');
            botonMenu.textContent = abierto ? ICONO_CERRAR : ICONO_ABRIR;
        });

        // Al elegir un enlace del menú principal, el menú móvil se cierra
        document.querySelectorAll('.nav-link').forEach((enlace) => {
            enlace.addEventListener('click', () => {
                menuMovil.classList.remove('active');
                botonMenu.textContent = ICONO_ABRIR;
            });
        });
    }

    // Compara el nombre del archivo abierto con el destino de cada enlace
    function marcarPaginaActual() {
        const paginaActual = decodeURIComponent(location.pathname.split('/').pop() || PAGINA_INICIAL);
        document.querySelectorAll('.nav-link, .mobile-menu a').forEach((enlace) => {
            const destino = decodeURIComponent(enlace.getAttribute('href') || '');
            enlace.classList.toggle('active', destino === paginaActual);
        });
    }

    function iniciarDesplazamientoSuave() {
        document.querySelectorAll('a[href^="#"]').forEach((enlace) => {
            enlace.addEventListener('click', (evento) => {
                evento.preventDefault();
                const destino = document.getElementById(enlace.getAttribute('href').substring(1));
                if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    iniciarMenuMovil();
    marcarPaginaActual();
    iniciarDesplazamientoSuave();
})();
