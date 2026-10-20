/* =====================================================================
   Página Galería (galeria.html)
   - Filtros por categoría con un fundido suave.
   - Vista ampliada (lightbox) con flechas, teclado y gestos táctiles.
   - Fotos del visitante: se agregan solo en su navegador, sin servidor.
   Los videos destacados están en js/paginas/galeria-videos.js.
   ===================================================================== */
(function () {
    'use strict';

    const cuadricula = document.querySelector('.galeria-compacta');
    const fotos = () => Array.from(cuadricula.querySelectorAll('.gallery-item'));

    // ---------------------------------------------------------------
    // Filtros por categoría
    // ---------------------------------------------------------------
    const DURACION_SALIDA = 200;
    const botonesFiltro = document.querySelectorAll('.gallery-filters .filter-btn');
    let filtroActual = 'all';
    let temporizadorFiltro = null;
    let avisoVacio = null;

    function crearAvisoVacio() {
        avisoVacio = document.createElement('p');
        avisoVacio.className = 'galeria-vacia';
        avisoVacio.textContent = 'No hay fotos en esta categoría.';
        avisoVacio.hidden = true;
        cuadricula.after(avisoVacio);
    }

    function correspondeAlFiltro(foto, filtro) {
        return filtro === 'all' || foto.dataset.category === filtro;
    }

    function aplicarFiltro(filtro) {
        filtroActual = filtro;
        botonesFiltro.forEach((boton) => {
            const activo = boton.dataset.filter === filtro;
            boton.classList.toggle('active', activo);
            boton.setAttribute('aria-pressed', String(activo));
        });

        // Primero se desvanecen las fotos que salen; luego se ocultan y entran las nuevas
        fotos().forEach((foto) => {
            if (!foto.hidden && !correspondeAlFiltro(foto, filtro)) foto.classList.add('saliendo');
        });

        clearTimeout(temporizadorFiltro);
        temporizadorFiltro = setTimeout(() => {
            let hayFotos = false;
            fotos().forEach((foto) => {
                foto.classList.remove('saliendo', 'entrando');
                if (!correspondeAlFiltro(foto, filtro)) {
                    foto.hidden = true;
                    return;
                }
                hayFotos = true;
                if (foto.hidden) {
                    foto.hidden = false;
                    void foto.offsetWidth; // reinicia la animación de entrada
                    foto.classList.add('entrando');
                }
            });
            avisoVacio.hidden = hayFotos;
        }, DURACION_SALIDA);
    }

    function iniciarFiltros() {
        crearAvisoVacio();
        botonesFiltro.forEach((boton) => {
            boton.addEventListener('click', () => {
                if (boton.dataset.filter !== filtroActual) aplicarFiltro(boton.dataset.filter);
            });
        });
        cuadricula.addEventListener('animationend', (evento) => {
            if (evento.target.classList.contains('gallery-item')) evento.target.classList.remove('entrando');
        });
    }

    // ---------------------------------------------------------------
    // Vista ampliada
    // ---------------------------------------------------------------
    function iniciarVistaAmpliada() {
        const vista = document.getElementById('galeriaLightbox');
        const imagen = vista.querySelector('.lightbox-img');
        const titulo = vista.querySelector('.lightbox-titulo');
        const descripcion = vista.querySelector('.lightbox-descripcion');
        const credito = vista.querySelector('.lightbox-credito');
        const contador = vista.querySelector('.lightbox-contador');
        const botonCerrar = vista.querySelector('.lightbox-cerrar');
        const botonAnterior = vista.querySelector('.lightbox-anterior');
        const botonSiguiente = vista.querySelector('.lightbox-siguiente');
        const DURACION_CIERRE = 250;
        const DESLIZAR_LADO = 50;
        const DESLIZAR_ABAJO = 80;

        let visibles = [];
        let actual = 0;
        let ultimoFoco = null;

        function escribirCredito(foto) {
            credito.textContent = '';
            if (foto.dataset.autor) {
                const enlace = document.createElement('a');
                enlace.href = foto.dataset.fuente;
                enlace.target = '_blank';
                enlace.rel = 'noopener';
                enlace.textContent = foto.dataset.licencia + ', Wikimedia Commons';
                credito.append('Foto: ' + foto.dataset.autor + ' · ', enlace);
            } else if (foto.dataset.usuario) {
                credito.textContent = 'Foto agregada por ti en esta visita. Solo se ve en este navegador.';
            }
        }

        function mostrar(indice) {
            actual = (indice + visibles.length) % visibles.length;
            const foto = visibles[actual];
            const miniatura = foto.querySelector('img');

            // La imagen grande aparece con un fundido cuando termina de cargar
            imagen.classList.remove('visible');
            imagen.onload = () => imagen.classList.add('visible');
            imagen.src = foto.dataset.full || miniatura.src;
            imagen.alt = miniatura.alt;
            if (imagen.complete) imagen.classList.add('visible');

            titulo.textContent = foto.querySelector('h3').textContent;
            descripcion.textContent = foto.querySelector('p').textContent;
            contador.textContent = (actual + 1) + ' / ' + visibles.length;
            escribirCredito(foto);

            const hayVarias = visibles.length > 1;
            botonAnterior.hidden = !hayVarias;
            botonSiguiente.hidden = !hayVarias;
        }

        function abrir(foto) {
            // Solo se navega entre las fotos que deja ver el filtro activo
            visibles = fotos().filter((f) => !f.hidden);
            ultimoFoco = document.activeElement;
            mostrar(visibles.indexOf(foto));
            vista.hidden = false;
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(() => vista.classList.add('abierto'));
            botonCerrar.focus();
        }

        function cerrar() {
            if (vista.hidden) return;
            vista.classList.remove('abierto');
            document.body.style.overflow = '';
            setTimeout(() => { vista.hidden = true; }, DURACION_CIERRE);
            if (ultimoFoco) ultimoFoco.focus();
        }

        cuadricula.addEventListener('click', (evento) => {
            const foto = evento.target.closest('.gallery-item');
            if (foto) abrir(foto);
        });

        cuadricula.addEventListener('keydown', (evento) => {
            const foto = evento.target.closest('.gallery-item');
            if (foto && (evento.key === 'Enter' || evento.key === ' ')) {
                evento.preventDefault();
                abrir(foto);
            }
        });

        botonCerrar.addEventListener('click', cerrar);
        botonAnterior.addEventListener('click', () => mostrar(actual - 1));
        botonSiguiente.addEventListener('click', () => mostrar(actual + 1));

        // Tocar el fondo oscuro cierra la vista
        vista.addEventListener('click', (evento) => {
            if (evento.target === vista || evento.target.classList.contains('lightbox-escenario')) cerrar();
        });

        document.addEventListener('keydown', (evento) => {
            if (vista.hidden) return;
            if (evento.key === 'Escape') cerrar();
            else if (evento.key === 'ArrowLeft') mostrar(actual - 1);
            else if (evento.key === 'ArrowRight') mostrar(actual + 1);
            else if (evento.key === 'Tab') {
                mantenerFocoDentro(evento, Array.from(vista.querySelectorAll('button:not([hidden]), a[href]')));
            }
        });

        // Gestos: deslizar a los lados cambia de foto; hacia abajo, cierra
        let inicioX = 0;
        let inicioY = 0;
        vista.addEventListener('touchstart', (evento) => {
            inicioX = evento.changedTouches[0].clientX;
            inicioY = evento.changedTouches[0].clientY;
        }, { passive: true });

        vista.addEventListener('touchend', (evento) => {
            const dx = evento.changedTouches[0].clientX - inicioX;
            const dy = evento.changedTouches[0].clientY - inicioY;
            if (Math.abs(dx) > DESLIZAR_LADO && Math.abs(dx) > Math.abs(dy)) {
                mostrar(dx < 0 ? actual + 1 : actual - 1);
            } else if (dy > DESLIZAR_ABAJO && Math.abs(dy) > Math.abs(dx)) {
                cerrar();
            }
        }, { passive: true });
    }

    // ---------------------------------------------------------------
    // Fotos del visitante (solo en este navegador)
    // ---------------------------------------------------------------
    function iniciarFotosDelVisitante() {
        const selector = document.getElementById('fotosUsuario');
        const previa = document.querySelector('.subir-previa');
        const mensajes = document.querySelector('.subir-mensajes');
        const acciones = document.querySelector('.subir-acciones');
        const botonAgregar = document.querySelector('.subir-agregar');
        const botonCancelar = document.querySelector('.subir-cancelar');

        const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
        const EXTENSIONES_PERMITIDAS = /\.(jpe?g|png|webp)$/i;
        const MAXIMO_MB = 5;
        const MAXIMO_FOTOS = 12;

        let seleccion = [];
        let ultimoId = 0;

        function mostrarMensaje(texto, esExito) {
            const parrafo = document.createElement('p');
            parrafo.className = 'subir-msg' + (esExito ? ' ok' : '');
            parrafo.textContent = texto;
            mensajes.append(parrafo);
        }

        function actualizarAcciones() {
            acciones.hidden = seleccion.length === 0;
            botonAgregar.textContent = seleccion.length > 1
                ? 'Agregar ' + seleccion.length + ' fotos a la galería'
                : 'Agregar a la galería';
        }

        function quitar(id, liberarMemoria) {
            const foto = seleccion.find((f) => f.id === id);
            if (!foto) return;
            if (liberarMemoria) URL.revokeObjectURL(foto.url);
            foto.elemento.remove();
            seleccion = seleccion.filter((f) => f.id !== id);
            actualizarAcciones();
        }

        // Valida un archivo y devuelve el motivo si no se puede usar
        function motivoDeRechazo(archivo) {
            const formatoValido = TIPOS_PERMITIDOS.includes(archivo.type) || (!archivo.type && EXTENSIONES_PERMITIDAS.test(archivo.name));
            if (!formatoValido || !EXTENSIONES_PERMITIDAS.test(archivo.name)) {
                return '«' + archivo.name + '» no es un formato válido. Usa JPG, JPEG, PNG o WEBP.';
            }
            if (archivo.size > MAXIMO_MB * 1024 * 1024) {
                const megas = (archivo.size / 1024 / 1024).toFixed(1);
                return '«' + archivo.name + '» pesa ' + megas + ' MB y supera el límite de ' + MAXIMO_MB + ' MB por foto.';
            }
            if (seleccion.length >= MAXIMO_FOTOS) {
                return '«' + archivo.name + '» no se agregó: puedes seleccionar hasta ' + MAXIMO_FOTOS + ' fotos a la vez.';
            }
            return '';
        }

        function agregarVistaPrevia(archivo) {
            const foto = { id: ++ultimoId, archivo, url: URL.createObjectURL(archivo) };
            const elemento = document.createElement('li');

            const imagen = document.createElement('img');
            imagen.src = foto.url;
            imagen.alt = 'Vista previa de ' + archivo.name;
            imagen.addEventListener('error', () => {
                mostrarMensaje('«' + archivo.name + '» no se pudo leer como imagen y se quitó de la selección.');
                quitar(foto.id, true);
            });

            const nombre = document.createElement('span');
            nombre.className = 'previa-nombre';
            nombre.textContent = archivo.name;

            const botonQuitar = document.createElement('button');
            botonQuitar.type = 'button';
            botonQuitar.className = 'previa-quitar';
            botonQuitar.setAttribute('aria-label', 'Quitar ' + archivo.name);
            botonQuitar.innerHTML = icono('cerrar', 14);
            botonQuitar.addEventListener('click', () => quitar(foto.id, true));

            elemento.append(imagen, nombre, botonQuitar);
            previa.append(elemento);
            foto.elemento = elemento;
            seleccion.push(foto);
        }

        // Crea la tarjeta de una foto del visitante para la cuadrícula
        function crearFotoEnGaleria(foto) {
            const figura = document.createElement('figure');
            figura.className = 'gallery-item';
            figura.dataset.category = 'all';
            figura.dataset.usuario = 'true';
            figura.tabIndex = 0;
            figura.setAttribute('role', 'button');
            figura.setAttribute('aria-label', 'Ampliar foto: ' + foto.archivo.name);

            const imagen = document.createElement('img');
            imagen.src = foto.url;
            imagen.alt = 'Foto compartida: ' + foto.archivo.name;

            const etiqueta = document.createElement('span');
            etiqueta.className = 'gallery-etiqueta';
            etiqueta.textContent = 'Tu foto';

            const pie = document.createElement('figcaption');
            pie.className = 'gallery-overlay';
            const titulo = document.createElement('h3');
            titulo.textContent = 'Foto compartida';
            const nombre = document.createElement('p');
            nombre.textContent = foto.archivo.name.replace(/\.[^.]+$/, '');
            pie.append(titulo, nombre);

            figura.append(imagen, etiqueta, pie);
            return figura;
        }

        selector.addEventListener('change', () => {
            mensajes.textContent = '';
            Array.from(selector.files).forEach((archivo) => {
                const motivo = motivoDeRechazo(archivo);
                if (motivo) {
                    mostrarMensaje(motivo);
                } else {
                    agregarVistaPrevia(archivo);
                }
            });
            // Permite volver a elegir el mismo archivo después de quitarlo
            selector.value = '';
            actualizarAcciones();
        });

        botonCancelar.addEventListener('click', () => {
            seleccion.slice().forEach((foto) => quitar(foto.id, true));
            mensajes.textContent = '';
            mostrarMensaje('Selección cancelada.', true);
        });

        botonAgregar.addEventListener('click', () => {
            const nuevas = seleccion.slice();
            nuevas.reverse().forEach((foto) => {
                const figura = crearFotoEnGaleria(foto);
                figura.hidden = filtroActual !== 'all';
                cuadricula.prepend(figura);
                if (!figura.hidden) figura.classList.add('entrando');
                quitar(foto.id, false);
            });

            mensajes.textContent = '';
            mostrarMensaje((nuevas.length === 1 ? 'Se agregó 1 foto' : 'Se agregaron ' + nuevas.length + ' fotos') +
                ' a la galería en la categoría «Todas». Solo se ven en este navegador y se perderán al recargar la página.', true);

            if (filtroActual !== 'all') aplicarFiltro('all');
            const filtros = document.querySelector('.gallery-filters');
            window.scrollTo({ top: filtros.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
        });
    }

    iniciarFiltros();
    iniciarVistaAmpliada();
    iniciarFotosDelVisitante();
})();
