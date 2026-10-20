/* =====================================================================
   Página Nosotros (nosotros.html)
   - Aparición suave de bloques al bajar (con retraso escalonado).
   - Pestañas de misión, visión y valores (también con teclado).
   - Línea de tiempo que se completa al bajar y marca cada etapa.
   - Ventana con el perfil de cada integrante (datos en js/datos/equipo.js).
   - Contadores animados de logros.
   - Movimiento suave de la foto del encabezado.
   Todo respeta la preferencia del sistema de "reducir movimiento".
   ===================================================================== */
(function () {
    'use strict';

    const sinMovimiento = PREFIERE_MENOS_MOVIMIENTO || !('IntersectionObserver' in window);

    // ---------------------------------------------------------------
    // Aparición al bajar
    // ---------------------------------------------------------------
    function iniciarRevelado() {
        const elementos = document.querySelectorAll('[data-revelar]');

        // Dentro de un grupo, cada elemento aparece un poco después del anterior
        document.querySelectorAll('[data-revelar-grupo]').forEach((grupo) => {
            grupo.querySelectorAll('[data-revelar]').forEach((elemento, i) => {
                elemento.style.transitionDelay = (i * 90) + 'ms';
            });
        });

        if (sinMovimiento) {
            elementos.forEach((elemento) => elemento.classList.add('revelado'));
            return;
        }

        document.body.classList.add('nos-animado');
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) return;
                const elemento = entrada.target;
                elemento.classList.add('revelado');
                observador.unobserve(elemento);
                // Quita el retraso para que el hover posterior responda al instante
                elemento.addEventListener('transitionend', () => {
                    elemento.style.transitionDelay = '';
                }, { once: true });
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        elementos.forEach((elemento) => observador.observe(elemento));
    }

    // ---------------------------------------------------------------
    // Pestañas de misión, visión y valores
    // ---------------------------------------------------------------
    function iniciarPestanas() {
        const pestanas = Array.from(document.querySelectorAll('.nos-pestana'));

        function activar(pestana, conFoco) {
            pestanas.forEach((otra) => {
                const activa = otra === pestana;
                const panel = document.getElementById(otra.getAttribute('aria-controls'));
                otra.classList.toggle('activa', activa);
                otra.setAttribute('aria-selected', String(activa));
                otra.tabIndex = activa ? 0 : -1;
                panel.hidden = !activa;
                panel.classList.remove('activo');
                if (activa) {
                    void panel.offsetWidth; // reinicia la transición de entrada del panel
                    panel.classList.add('activo');
                }
            });
            if (conFoco) pestana.focus();
        }

        // Flechas, Inicio y Fin mueven entre pestañas
        function pestanaPorTecla(tecla, i) {
            const total = pestanas.length;
            if (tecla === 'ArrowRight') return pestanas[(i + 1) % total];
            if (tecla === 'ArrowLeft') return pestanas[(i - 1 + total) % total];
            if (tecla === 'Home') return pestanas[0];
            if (tecla === 'End') return pestanas[total - 1];
            return null;
        }

        pestanas.forEach((pestana, i) => {
            pestana.addEventListener('click', () => activar(pestana, false));
            pestana.addEventListener('keydown', (evento) => {
                const destino = pestanaPorTecla(evento.key, i);
                if (!destino) return;
                evento.preventDefault();
                activar(destino, true);
            });
        });
    }

    // ---------------------------------------------------------------
    // Línea de tiempo: la línea naranja avanza con el desplazamiento
    // y cada etapa se marca cuando la línea la alcanza
    // ---------------------------------------------------------------
    function iniciarLineaDeTiempo() {
        const linea = document.querySelector('.nos-linea');
        const relleno = linea.querySelector('.nos-linea-progreso span');
        const hitos = Array.from(linea.querySelectorAll('.nos-hito'));

        function actualizar() {
            const caja = linea.getBoundingClientRect();
            const referencia = window.innerHeight * 0.6;
            const avance = Math.min(Math.max((referencia - caja.top) / caja.height, 0), 1);
            relleno.style.transform = 'scaleY(' + avance.toFixed(4) + ')';

            hitos.forEach((hito) => {
                const punto = hito.querySelector('.nos-hito-punto').getBoundingClientRect();
                hito.classList.toggle('alcanzado', punto.top + punto.height / 2 <= referencia);
            });
        }

        const actualizarPorCuadro = porCuadro(actualizar);
        window.addEventListener('scroll', actualizarPorCuadro, { passive: true });
        window.addEventListener('resize', actualizarPorCuadro);
        actualizar();
    }

    // ---------------------------------------------------------------
    // Equipo: ventana con el perfil completo
    // ---------------------------------------------------------------
    function plantillaPerfil(miembro) {
        const especialidades = miembro.especialidades.map((e) => '<li>' + escaparHtml(e) + '</li>').join('');
        return '' +
            '<div class="nos-modal-cabecera">' +
                '<span class="nos-avatar nos-avatar-' + miembro.color + ' nos-avatar-grande" aria-hidden="true">' + escaparHtml(miembro.iniciales) + '</span>' +
                '<div>' +
                    '<h3 id="nos-modal-nombre">' + escaparHtml(miembro.nombre) + '</h3>' +
                    '<p class="nos-modal-rol">' + escaparHtml(miembro.rol) + '</p>' +
                '</div>' +
            '</div>' +
            '<p class="nos-modal-bio">' + escaparHtml(miembro.bio) + '</p>' +
            '<h4>Especialidades</h4>' +
            '<ul class="nos-modal-chips">' + especialidades + '</ul>' +
            '<dl class="nos-modal-datos">' +
                '<div><dt>Idiomas</dt><dd>' + escaparHtml(miembro.idiomas) + '</dd></div>' +
                '<div><dt>Lugar favorito</dt><dd>' + escaparHtml(miembro.lugar) + '</dd></div>' +
            '</dl>';
    }

    function iniciarEquipo() {
        const tarjetas = Array.from(document.querySelectorAll('.nos-miembro'));
        const ventana = document.getElementById('nos-modal');
        const caja = ventana.querySelector('.nos-modal-caja');
        const cuerpo = ventana.querySelector('.nos-modal-cuerpo');
        const contador = ventana.querySelector('.nos-modal-contador');
        const claves = tarjetas.map((tarjeta) => tarjeta.dataset.miembro);
        const DURACION_FUNDIDO = 180;
        const DURACION_CIERRE = 250;
        let actual = 0;
        let origen = null;
        let temporizador = null;

        function mostrarMiembro(indice) {
            actual = (indice + claves.length) % claves.length;
            cuerpo.innerHTML = plantillaPerfil(EQUIPO[claves[actual]]);
            contador.textContent = (actual + 1) + ' de ' + claves.length;
        }

        // Cambio de integrante con un fundido corto del contenido
        function cambiar(paso) {
            if (PREFIERE_MENOS_MOVIMIENTO) {
                mostrarMiembro(actual + paso);
                return;
            }
            cuerpo.classList.add('cambiando');
            clearTimeout(temporizador);
            temporizador = setTimeout(() => {
                mostrarMiembro(actual + paso);
                cuerpo.classList.remove('cambiando');
            }, DURACION_FUNDIDO);
        }

        function abrir(indice, tarjeta) {
            origen = tarjeta;
            mostrarMiembro(indice);
            ventana.hidden = false;
            document.body.classList.add('nos-sin-scroll');
            requestAnimationFrame(() => ventana.classList.add('abierto'));
            ventana.querySelector('.nos-modal-cerrar').focus();
        }

        function cerrar() {
            ventana.classList.remove('abierto');
            document.body.classList.remove('nos-sin-scroll');
            setTimeout(() => {
                ventana.hidden = true;
                if (origen) origen.focus();
            }, PREFIERE_MENOS_MOVIMIENTO ? 0 : DURACION_CIERRE);
        }

        tarjetas.forEach((tarjeta, i) => {
            tarjeta.addEventListener('click', () => abrir(i, tarjeta));
        });

        // El fondo y la X tienen data-cerrar; las flechas tienen data-paso
        ventana.addEventListener('click', (evento) => {
            if (evento.target.closest('[data-cerrar]')) cerrar();
            const flecha = evento.target.closest('[data-paso]');
            if (flecha) cambiar(Number(flecha.dataset.paso));
        });

        document.addEventListener('keydown', (evento) => {
            if (ventana.hidden) return;
            if (evento.key === 'Escape') cerrar();
            if (evento.key === 'ArrowRight') cambiar(1);
            if (evento.key === 'ArrowLeft') cambiar(-1);
            if (evento.key === 'Tab') mantenerFocoDentro(evento, Array.from(caja.querySelectorAll('button')));
        });
    }

    // ---------------------------------------------------------------
    // Contadores de logros
    // ---------------------------------------------------------------
    function iniciarContadores() {
        const numeros = document.querySelectorAll('[data-contador]');
        const DURACION = 1800;

        function escribir(elemento, valor) {
            elemento.textContent = valor + (elemento.dataset.sufijo || '');
        }

        function terminar(elemento) {
            elemento.closest('.nos-logro').classList.add('completo');
        }

        function animar(elemento) {
            const final = Number(elemento.dataset.contador);
            const inicio = performance.now();

            function paso(ahora) {
                const t = Math.min((ahora - inicio) / DURACION, 1);
                const suave = 1 - Math.pow(1 - t, 3); // desacelera al final
                escribir(elemento, Math.round(final * suave));
                if (t < 1) {
                    requestAnimationFrame(paso);
                } else {
                    terminar(elemento);
                }
            }
            requestAnimationFrame(paso);
        }

        if (sinMovimiento) {
            numeros.forEach((elemento) => {
                escribir(elemento, Number(elemento.dataset.contador));
                terminar(elemento);
            });
            return;
        }

        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) return;
                observador.unobserve(entrada.target);
                animar(entrada.target);
            });
        }, { threshold: 0.6 });

        numeros.forEach((elemento) => {
            escribir(elemento, 0);
            observador.observe(elemento);
        });
    }

    // ---------------------------------------------------------------
    // Encabezado: la foto se mueve un poco más lento que la página
    // ---------------------------------------------------------------
    function iniciarEncabezado() {
        if (PREFIERE_MENOS_MOVIMIENTO) return;
        const encabezado = document.querySelector('.nos-hero');
        const foto = encabezado.querySelector('.nos-hero-img');

        const mover = porCuadro(() => {
            const y = window.scrollY;
            if (y > encabezado.offsetHeight) return;
            foto.style.transform = 'translateY(' + (y * 0.25).toFixed(1) + 'px) scale(1.05)';
        });
        window.addEventListener('scroll', mover, { passive: true });
        mover();
    }

    iniciarRevelado();
    iniciarPestanas();
    iniciarLineaDeTiempo();
    iniciarEquipo();
    iniciarContadores();
    iniciarEncabezado();
})();
