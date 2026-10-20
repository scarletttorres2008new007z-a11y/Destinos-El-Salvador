/* =====================================================================
   Página Cultura (cultura.html)
   - Portada: las fotos de las piezas se alternan con un fundido.
   - Museo virtual: sala con perspectiva 3D (hecha con CSS) que se gira
     con el ratón, el dedo o los botones; al tocar una pieza se abre un
     panel con su historia. El contenido está en js/datos/museo.js.
   ===================================================================== */
(function () {
    'use strict';

    const INTERVALO_PORTADA = 4500;
    const ESCRITORIO = '(min-width: 900px)';
    const AYUDA_SALA = 'Arrastra para girar la sala y toca una pieza';
    const AYUDA_PIEZA = 'Usa las flechas para pasar a otra pieza';

    // ---------------------------------------------------------------
    // Portada
    // ---------------------------------------------------------------
    function iniciarPortada() {
        const obras = Array.from(document.querySelectorAll('.hero-obra'));
        const nombre = document.getElementById('hero-obra-nombre');
        if (obras.length < 2 || PREFIERE_MENOS_MOVIMIENTO) return;
        let actual = 0;

        setInterval(() => {
            obras[actual].classList.remove('activa');
            actual = (actual + 1) % obras.length;
            obras[actual].classList.add('activa');

            nombre.classList.add('cambiando');
            setTimeout(() => {
                nombre.textContent = obras[actual].dataset.nombre;
                nombre.classList.remove('cambiando');
            }, 300);
        }, INTERVALO_PORTADA);
    }

    // ---------------------------------------------------------------
    // Museo virtual
    // ---------------------------------------------------------------
    function iniciarMuseo() {
        const raiz = document.getElementById('museo-3d');
        const carrusel = raiz.querySelector('.museo-carrusel');
        const obras = Array.from(raiz.querySelectorAll('.museo-obra'));
        const panel = document.getElementById('museo-panel');
        const ayuda = document.getElementById('museo-ayuda');
        const paso = 360 / obras.length; // grados entre una pieza y la siguiente

        let giro = 0;         // ángulo actual de la sala
        let giroMeta = 0;     // ángulo al que se está girando
        let seleccion = -1;   // pieza abierta en el panel (-1 = ninguna)
        let animando = false;

        const campos = {
            numero: panel.querySelector('.museo-panel-numero'),
            nombre: panel.querySelector('.museo-panel-nombre'),
            lugar: panel.querySelector('.museo-panel-lugar'),
            historia: panel.querySelector('.museo-panel-historia'),
            significado: panel.querySelector('.museo-panel-significado'),
            datos: panel.querySelector('.museo-panel-datos')
        };

        // Lleva un ángulo al rango de -180 a 180 grados
        function normalizarAngulo(angulo) {
            const a = ((angulo % 360) + 360) % 360;
            return a > 180 ? a - 360 : a;
        }

        function indiceDePieza(angulo) {
            return ((Math.round(angulo / paso) % obras.length) + obras.length) % obras.length;
        }

        // Coloca cada pieza en un círculo alrededor del visitante
        function colocarPiezas() {
            const radio = Math.min(520, Math.max(230, carrusel.clientWidth * 0.38));
            const profundidad = radio * 0.9;

            obras.forEach((obra, i) => {
                const relativo = normalizarAngulo(i * paso - giro);
                const radianes = relativo * Math.PI / 180;
                const x = Math.sin(radianes) * radio;
                const z = (Math.cos(radianes) - 1) * profundidad;
                const distancia = Math.abs(relativo);

                obra.style.transform = 'translate(-50%, -50%) translate3d(' + x.toFixed(1) + 'px, 0, ' + z.toFixed(1) + 'px) rotateY(' + (-relativo * 0.45).toFixed(2) + 'deg)';
                obra.style.zIndex = String(100 + Math.round(z));

                // Las piezas vecinas se ven claras y las del fondo se desvanecen
                const opacidad = distancia <= paso
                    ? 1 - (distancia / paso) * 0.15
                    : Math.max(0.1, 0.85 - ((distancia - paso) / paso) * 0.75);
                obra.style.opacity = opacidad.toFixed(3);

                obra.classList.toggle('al-frente', distancia < paso / 2);
                obra.classList.toggle('cerca', distancia < paso * 1.2);
                obra.tabIndex = distancia < paso / 2 ? 0 : -1;
            });
        }

        // Gira poco a poco hasta llegar a giroMeta
        function animarGiro() {
            if (animando) return;
            animando = true;
            (function cuadro() {
                const diferencia = giroMeta - giro;
                if (PREFIERE_MENOS_MOVIMIENTO || Math.abs(diferencia) < 0.05) {
                    giro = giroMeta;
                    colocarPiezas();
                    animando = false;
                    return;
                }
                giro += diferencia * 0.12;
                colocarPiezas();
                requestAnimationFrame(cuadro);
            })();
        }

        // Gira por el camino más corto hasta la pieza i
        function girarHasta(i) {
            giroMeta = giro + normalizarAngulo(i * paso - giro);
            animarGiro();
        }

        function llenarPanel(i) {
            const pieza = PIEZAS_DEL_MUSEO[i];
            campos.numero.textContent = 'Pieza ' + (i + 1) + ' de ' + PIEZAS_DEL_MUSEO.length;
            campos.nombre.textContent = pieza.nombre;
            campos.lugar.textContent = pieza.lugar;
            campos.historia.textContent = pieza.historia;
            campos.significado.textContent = pieza.significado;
            llenarLista(campos.datos, pieza.datos);
            panel.scrollTop = 0;
        }

        function seleccionar(i) {
            const yaAbierto = seleccion >= 0;
            seleccion = i;
            girarHasta(i);
            obras.forEach((obra, j) => obra.classList.toggle('seleccionada', j === i));

            function mostrarContenido() {
                llenarPanel(i);
                panel.classList.remove('cambiando');
            }
            if (yaAbierto && !PREFIERE_MENOS_MOVIMIENTO) {
                panel.classList.add('cambiando');
                setTimeout(mostrarContenido, 200);
            } else {
                mostrarContenido();
            }

            panel.hidden = false;
            void panel.offsetWidth; // reinicia la transición de entrada
            panel.classList.add('abierto');
            raiz.classList.add('con-seleccion');
            ayuda.textContent = AYUDA_PIEZA;

            // En móvil el panel queda debajo de la sala: se baja hasta él
            if (!window.matchMedia(ESCRITORIO).matches && !yaAbierto) {
                setTimeout(() => {
                    panel.scrollIntoView({ behavior: PREFIERE_MENOS_MOVIMIENTO ? 'auto' : 'smooth', block: 'nearest' });
                }, 350);
            }
        }

        function cerrarPanel() {
            seleccion = -1;
            panel.classList.remove('abierto');
            raiz.classList.remove('con-seleccion');
            obras.forEach((obra) => obra.classList.remove('seleccionada'));
            ayuda.textContent = AYUDA_SALA;
            setTimeout(() => {
                if (seleccion === -1) panel.hidden = true;
            }, 400);
        }

        function mover(direccion) {
            const siguiente = (indiceDePieza(giro) + direccion + obras.length) % obras.length;
            if (seleccion >= 0) {
                seleccionar(siguiente);
            } else {
                girarHasta(siguiente);
            }
        }

        // ----- Botones y teclado -----
        panel.querySelector('.museo-panel-cerrar').addEventListener('click', cerrarPanel);
        panel.querySelector('.museo-anterior').addEventListener('click', () => mover(-1));
        panel.querySelector('.museo-siguiente').addEventListener('click', () => mover(1));
        raiz.querySelector('.museo-vista-general').addEventListener('click', cerrarPanel);
        raiz.querySelectorAll('.museo-girar').forEach((boton) => {
            boton.addEventListener('click', () => mover(Number(boton.dataset.dir)));
        });
        document.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape' && seleccion >= 0) cerrarPanel();
        });

        // ----- Arrastrar para girar la sala -----
        let arrastre = null;

        carrusel.addEventListener('pointerdown', (evento) => {
            arrastre = { x: evento.clientX, inicio: evento.clientX, movido: false, id: evento.pointerId };
        });

        carrusel.addEventListener('pointermove', (evento) => {
            if (!arrastre) return;
            const desplazamiento = evento.clientX - arrastre.x;
            arrastre.x = evento.clientX;
            // Solo cuenta como arrastre después de moverse más de 6 px
            if (!arrastre.movido && Math.abs(evento.clientX - arrastre.inicio) > 6) {
                arrastre.movido = true;
                carrusel.classList.add('arrastrando');
                carrusel.setPointerCapture(arrastre.id);
            }
            if (arrastre.movido) {
                giro -= desplazamiento * (paso / 220);
                giroMeta = giro;
                colocarPiezas();
            }
        });

        carrusel.addEventListener('pointerup', () => {
            if (!arrastre) return;
            const movido = arrastre.movido;
            arrastre = null;
            carrusel.classList.remove('arrastrando');
            if (!movido) return;
            // Se ajusta a la pieza más cercana
            giroMeta = Math.round(giro / paso) * paso;
            animarGiro();
            if (seleccion >= 0) seleccionar(indiceDePieza(giro));
        });

        carrusel.addEventListener('pointercancel', () => {
            arrastre = null;
            carrusel.classList.remove('arrastrando');
            giroMeta = Math.round(giro / paso) * paso;
            animarGiro();
        });

        // ----- Cada pieza -----
        obras.forEach((obra, i) => {
            obra.addEventListener('click', (evento) => {
                if (carrusel.classList.contains('arrastrando')) {
                    evento.preventDefault();
                    return;
                }
                seleccionar(i);
            });

            // Inclinación suave de la pieza del frente al pasar el ratón
            obra.addEventListener('pointermove', (evento) => {
                if (evento.pointerType !== 'mouse' || !obra.classList.contains('al-frente') || PREFIERE_MENOS_MOVIMIENTO) return;
                const caja = obra.getBoundingClientRect();
                const px = (evento.clientX - caja.left) / caja.width - 0.5;
                const py = (evento.clientY - caja.top) / caja.height - 0.5;
                obra.style.setProperty('--inclinar-x', (-py * 8).toFixed(2) + 'deg');
                obra.style.setProperty('--inclinar-y', (px * 10).toFixed(2) + 'deg');
            });
            obra.addEventListener('pointerleave', () => {
                obra.style.setProperty('--inclinar-x', '0deg');
                obra.style.setProperty('--inclinar-y', '0deg');
            });
        });

        colocarPiezas();
        window.addEventListener('resize', colocarPiezas);
    }

    iniciarPortada();
    iniciarMuseo();
})();
