// =====================================================================
// Sobre nosotros: interacciones de la página
// - Aparición suave de bloques al bajar (con retraso escalonado)
// - Pestañas de misión, visión y valores (también con teclado)
// - Línea de tiempo que se completa al bajar y marca cada etapa
// - Ventana con el perfil de cada integrante del equipo
// - Contadores animados de logros
// - Movimiento suave de la foto del encabezado
// Todo respeta la preferencia del sistema de "reducir movimiento".
// =====================================================================
(function () {
    'use strict';

    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Perfiles del equipo (el orden es el de las tarjetas)
    const EQUIPO = {
        carlos: {
            nombre: 'Carlos Mendoza',
            rol: 'Director General',
            iniciales: 'CM',
            color: 'azul',
            bio: 'Con 15 años de experiencia en turismo, Carlos lidera nuestro equipo con pasión y dedicación. Diseña cada ruta pensando en el viajero y en las comunidades que lo reciben.',
            especialidades: ['Diseño de rutas', 'Turismo sostenible', 'Alianzas con comunidades'],
            idiomas: 'Español e inglés',
            lugar: 'Volcán de Santa Ana'
        },
        ana: {
            nombre: 'Ana García',
            rol: 'Directora de Operaciones',
            iniciales: 'AG',
            color: 'celeste',
            bio: 'Especialista en gestión turística, Ana coordina todos nuestros tours y garantiza que cada detalle de tu viaje sea perfecto: transporte, horarios, alojamiento y seguridad.',
            especialidades: ['Logística de viajes', 'Atención al viajero', 'Seguridad en ruta'],
            idiomas: 'Español, inglés y francés',
            lugar: 'Suchitoto'
        },
        roberto: {
            nombre: 'Roberto Silva',
            rol: 'Guía Especializado',
            iniciales: 'RS',
            color: 'naranja',
            bio: 'Historiador y guía certificado, Roberto conoce cada rincón de El Salvador y comparte su conocimiento con entusiasmo, desde los sitios mayas hasta los pueblos coloniales.',
            especialidades: ['Historia prehispánica', 'Sitios arqueológicos', 'Senderismo'],
            idiomas: 'Español e inglés',
            lugar: 'Joya de Cerén'
        },
        maria: {
            nombre: 'María López',
            rol: 'Coordinadora de Marketing',
            iniciales: 'ML',
            color: 'oscuro',
            bio: 'Encargada de promocionar las maravillas de El Salvador y de mantener a nuestros viajeros informados sobre las mejores ofertas y temporadas para viajar.',
            especialidades: ['Fotografía de viaje', 'Redes sociales', 'Atención en línea'],
            idiomas: 'Español e inglés',
            lugar: 'Ruta de las Flores'
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        if (!document.body.classList.contains('pagina-nosotros')) return;
        iniciarRevelado();
        iniciarPestanas();
        iniciarLineaDeTiempo();
        iniciarEquipo();
        iniciarContadores();
        iniciarEncabezado();
    });

    // Ejecuta una función como máximo una vez por cuadro de animación
    function porCuadro(fn) {
        let pendiente = false;
        return function () {
            if (pendiente) return;
            pendiente = true;
            requestAnimationFrame(function () {
                pendiente = false;
                fn();
            });
        };
    }

    // ---------------------------------------------------------------
    // Aparición al bajar
    // ---------------------------------------------------------------
    function iniciarRevelado() {
        const elementos = document.querySelectorAll('[data-revelar]');

        // Dentro de un grupo, cada elemento aparece un poco después del anterior
        document.querySelectorAll('[data-revelar-grupo]').forEach(function (grupo) {
            grupo.querySelectorAll('[data-revelar]').forEach(function (el, i) {
                el.style.transitionDelay = (i * 90) + 'ms';
            });
        });

        if (sinMovimiento || !('IntersectionObserver' in window)) {
            elementos.forEach(function (el) { el.classList.add('revelado'); });
            return;
        }

        document.body.classList.add('nos-animado');
        const observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) return;
                const el = entrada.target;
                el.classList.add('revelado');
                observador.unobserve(el);
                // Quita el retraso para que el hover posterior responda al instante
                el.addEventListener('transitionend', function limpiar() {
                    el.style.transitionDelay = '';
                    el.removeEventListener('transitionend', limpiar);
                });
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        elementos.forEach(function (el) { observador.observe(el); });
    }

    // ---------------------------------------------------------------
    // Pestañas de misión, visión y valores
    // ---------------------------------------------------------------
    function iniciarPestanas() {
        const pestanas = Array.from(document.querySelectorAll('.nos-pestana'));
        if (!pestanas.length) return;

        function activar(pestana, conFoco) {
            pestanas.forEach(function (p) {
                const activa = p === pestana;
                const panel = document.getElementById(p.getAttribute('aria-controls'));
                p.classList.toggle('activa', activa);
                p.setAttribute('aria-selected', activa ? 'true' : 'false');
                p.tabIndex = activa ? 0 : -1;
                panel.hidden = !activa;
                panel.classList.remove('activo');
                if (activa) {
                    // Fuerza el reinicio de la transición de entrada del panel
                    void panel.offsetWidth;
                    panel.classList.add('activo');
                }
            });
            if (conFoco) pestana.focus();
        }

        pestanas.forEach(function (pestana, i) {
            pestana.addEventListener('click', function () { activar(pestana, false); });
            pestana.addEventListener('keydown', function (e) {
                let destino = null;
                if (e.key === 'ArrowRight') destino = pestanas[(i + 1) % pestanas.length];
                if (e.key === 'ArrowLeft') destino = pestanas[(i - 1 + pestanas.length) % pestanas.length];
                if (e.key === 'Home') destino = pestanas[0];
                if (e.key === 'End') destino = pestanas[pestanas.length - 1];
                if (destino) {
                    e.preventDefault();
                    activar(destino, true);
                }
            });
        });
    }

    // ---------------------------------------------------------------
    // Línea de tiempo: la línea naranja avanza con el desplazamiento
    // y cada etapa se marca cuando la línea la alcanza
    // ---------------------------------------------------------------
    function iniciarLineaDeTiempo() {
        const linea = document.querySelector('.nos-linea');
        if (!linea) return;
        const relleno = linea.querySelector('.nos-linea-progreso span');
        const hitos = Array.from(linea.querySelectorAll('.nos-hito'));

        function actualizar() {
            const caja = linea.getBoundingClientRect();
            const referencia = window.innerHeight * 0.6;
            const avance = Math.min(Math.max((referencia - caja.top) / caja.height, 0), 1);
            relleno.style.transform = 'scaleY(' + avance.toFixed(4) + ')';

            hitos.forEach(function (hito) {
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
    function iniciarEquipo() {
        const tarjetas = Array.from(document.querySelectorAll('.nos-miembro'));
        const modal = document.getElementById('nos-modal');
        if (!tarjetas.length || !modal) return;

        const caja = modal.querySelector('.nos-modal-caja');
        const cuerpo = modal.querySelector('.nos-modal-cuerpo');
        const contador = modal.querySelector('.nos-modal-contador');
        const claves = tarjetas.map(function (t) { return t.dataset.miembro; });
        let actual = 0;
        let origen = null;
        let temporizador = null;

        function escapar(texto) {
            const div = document.createElement('div');
            div.textContent = texto;
            return div.innerHTML;
        }

        function pintar(indice) {
            actual = (indice + claves.length) % claves.length;
            const m = EQUIPO[claves[actual]];
            cuerpo.innerHTML =
                '<div class="nos-modal-cabecera">' +
                    '<span class="nos-avatar nos-avatar-' + m.color + ' nos-avatar-grande" aria-hidden="true">' + escapar(m.iniciales) + '</span>' +
                    '<div>' +
                        '<h3 id="nos-modal-nombre">' + escapar(m.nombre) + '</h3>' +
                        '<p class="nos-modal-rol">' + escapar(m.rol) + '</p>' +
                    '</div>' +
                '</div>' +
                '<p class="nos-modal-bio">' + escapar(m.bio) + '</p>' +
                '<h4>Especialidades</h4>' +
                '<ul class="nos-modal-chips">' +
                    m.especialidades.map(function (e) { return '<li>' + escapar(e) + '</li>'; }).join('') +
                '</ul>' +
                '<dl class="nos-modal-datos">' +
                    '<div><dt>Idiomas</dt><dd>' + escapar(m.idiomas) + '</dd></div>' +
                    '<div><dt>Lugar favorito</dt><dd>' + escapar(m.lugar) + '</dd></div>' +
                '</dl>';
            contador.textContent = (actual + 1) + ' de ' + claves.length;
        }

        // Cambio de integrante con un fundido corto del contenido
        function cambiar(paso) {
            if (sinMovimiento) {
                pintar(actual + paso);
                return;
            }
            cuerpo.classList.add('cambiando');
            clearTimeout(temporizador);
            temporizador = setTimeout(function () {
                pintar(actual + paso);
                cuerpo.classList.remove('cambiando');
            }, 180);
        }

        function abrir(indice, tarjeta) {
            origen = tarjeta;
            pintar(indice);
            modal.hidden = false;
            document.body.classList.add('nos-sin-scroll');
            requestAnimationFrame(function () { modal.classList.add('abierto'); });
            modal.querySelector('.nos-modal-cerrar').focus();
        }

        function cerrar() {
            modal.classList.remove('abierto');
            document.body.classList.remove('nos-sin-scroll');
            setTimeout(function () {
                modal.hidden = true;
                if (origen) origen.focus();
            }, sinMovimiento ? 0 : 250);
        }

        tarjetas.forEach(function (tarjeta, i) {
            tarjeta.addEventListener('click', function () { abrir(i, tarjeta); });
        });

        modal.addEventListener('click', function (e) {
            if (e.target.closest('[data-cerrar]')) cerrar();
            const flecha = e.target.closest('[data-paso]');
            if (flecha) cambiar(parseInt(flecha.dataset.paso, 10));
        });

        document.addEventListener('keydown', function (e) {
            if (modal.hidden) return;
            if (e.key === 'Escape') cerrar();
            if (e.key === 'ArrowRight') cambiar(1);
            if (e.key === 'ArrowLeft') cambiar(-1);
            // Mantiene el foco dentro de la ventana
            if (e.key === 'Tab') {
                const enfocables = caja.querySelectorAll('button');
                const primero = enfocables[0];
                const ultimo = enfocables[enfocables.length - 1];
                if (e.shiftKey && document.activeElement === primero) {
                    e.preventDefault();
                    ultimo.focus();
                } else if (!e.shiftKey && document.activeElement === ultimo) {
                    e.preventDefault();
                    primero.focus();
                }
            }
        });
    }

    // ---------------------------------------------------------------
    // Contadores de logros
    // ---------------------------------------------------------------
    function iniciarContadores() {
        const numeros = document.querySelectorAll('[data-contador]');
        if (!numeros.length) return;

        function formato(el, valor) {
            return valor + (el.dataset.sufijo || '');
        }

        function animar(el) {
            const fin = parseInt(el.dataset.contador, 10);
            const duracion = 1800;
            const inicio = performance.now();

            function paso(ahora) {
                const t = Math.min((ahora - inicio) / duracion, 1);
                const suave = 1 - Math.pow(1 - t, 3); // desacelera al final
                el.textContent = formato(el, Math.round(fin * suave));
                if (t < 1) {
                    requestAnimationFrame(paso);
                } else {
                    el.closest('.nos-logro').classList.add('completo');
                }
            }
            requestAnimationFrame(paso);
        }

        if (sinMovimiento || !('IntersectionObserver' in window)) {
            numeros.forEach(function (el) {
                el.textContent = formato(el, parseInt(el.dataset.contador, 10));
                el.closest('.nos-logro').classList.add('completo');
            });
            return;
        }

        const observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) return;
                observador.unobserve(entrada.target);
                animar(entrada.target);
            });
        }, { threshold: 0.6 });

        numeros.forEach(function (el) {
            el.textContent = formato(el, 0);
            observador.observe(el);
        });
    }

    // ---------------------------------------------------------------
    // Encabezado: la foto se mueve un poco más lento que la página
    // ---------------------------------------------------------------
    function iniciarEncabezado() {
        const hero = document.querySelector('.nos-hero');
        const foto = hero && hero.querySelector('.nos-hero-img');
        if (!foto || sinMovimiento) return;

        const mover = porCuadro(function () {
            const y = window.scrollY;
            if (y > hero.offsetHeight) return;
            foto.style.transform = 'translateY(' + (y * 0.25).toFixed(1) + 'px) scale(1.05)';
        });
        window.addEventListener('scroll', mover, { passive: true });
        mover();
    }
})();
