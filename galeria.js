// Galería Visual: filtros por categoría, vista ampliada (lightbox) y fotos del visitante
document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.galeria-compacta');
    const lightbox = document.getElementById('galeriaLightbox');
    if (!grid || !lightbox) return;

    const todas = () => Array.from(grid.querySelectorAll('.gallery-item'));

    /* ---------- Filtros por categoría ---------- */
    const botonesFiltro = document.querySelectorAll('.gallery-filters .filter-btn');
    const avisoVacio = document.createElement('p');
    avisoVacio.className = 'galeria-vacia';
    avisoVacio.textContent = 'No hay fotos en esta categoría.';
    avisoVacio.hidden = true;
    grid.after(avisoVacio);

    let filtroActual = 'all';
    let temporizadorFiltro = null;

    function corresponde(item, filtro) {
        return filtro === 'all' || item.dataset.category === filtro;
    }

    function aplicarFiltro(filtro) {
        filtroActual = filtro;
        botonesFiltro.forEach(btn => {
            const activo = btn.dataset.filter === filtro;
            btn.classList.toggle('active', activo);
            btn.setAttribute('aria-pressed', activo ? 'true' : 'false');
        });

        // Primero se desvanecen las fotos que salen; luego se ocultan y entran las nuevas
        todas().forEach(item => {
            if (!item.hidden && !corresponde(item, filtro)) item.classList.add('saliendo');
        });

        clearTimeout(temporizadorFiltro);
        temporizadorFiltro = setTimeout(() => {
            let hayFotos = false;
            todas().forEach(item => {
                item.classList.remove('saliendo', 'entrando');
                if (corresponde(item, filtro)) {
                    hayFotos = true;
                    const estabaOculta = item.hidden;
                    item.hidden = false;
                    if (estabaOculta) {
                        void item.offsetWidth;
                        item.classList.add('entrando');
                    }
                } else {
                    item.hidden = true;
                }
            });
            avisoVacio.hidden = hayFotos;
        }, 200);
    }

    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.filter !== filtroActual) aplicarFiltro(btn.dataset.filter);
        });
    });

    grid.addEventListener('animationend', (e) => {
        if (e.target.classList.contains('gallery-item')) e.target.classList.remove('entrando');
    });

    /* ---------- Vista ampliada (lightbox) ---------- */
    const imagen = lightbox.querySelector('.lightbox-img');
    const titulo = lightbox.querySelector('.lightbox-titulo');
    const descripcion = lightbox.querySelector('.lightbox-descripcion');
    const credito = lightbox.querySelector('.lightbox-credito');
    const contador = lightbox.querySelector('.lightbox-contador');
    const btnCerrar = lightbox.querySelector('.lightbox-cerrar');
    const btnAnterior = lightbox.querySelector('.lightbox-anterior');
    const btnSiguiente = lightbox.querySelector('.lightbox-siguiente');

    let visibles = [];
    let actual = 0;
    let ultimoFoco = null;

    function mostrar(indice) {
        actual = (indice + visibles.length) % visibles.length;
        const item = visibles[actual];
        const mini = item.querySelector('img');

        imagen.classList.remove('visible');
        imagen.onload = () => imagen.classList.add('visible');
        imagen.src = item.dataset.full || mini.src;
        imagen.alt = mini.alt;
        if (imagen.complete) imagen.classList.add('visible');

        titulo.textContent = item.querySelector('h3').textContent;
        descripcion.textContent = item.querySelector('p').textContent;
        contador.textContent = (actual + 1) + ' / ' + visibles.length;

        credito.textContent = '';
        if (item.dataset.autor) {
            credito.append('Foto: ' + item.dataset.autor + ' · ');
            const enlace = document.createElement('a');
            enlace.href = item.dataset.fuente;
            enlace.target = '_blank';
            enlace.rel = 'noopener';
            enlace.textContent = item.dataset.licencia + ', Wikimedia Commons';
            credito.append(enlace);
        } else if (item.dataset.usuario) {
            credito.textContent = 'Foto agregada por ti en esta visita. Solo se ve en este navegador.';
        }

        const varias = visibles.length > 1;
        btnAnterior.hidden = !varias;
        btnSiguiente.hidden = !varias;
    }

    function abrir(item) {
        // Solo se navega entre las fotos que deja ver el filtro activo
        visibles = todas().filter(i => !i.hidden);
        ultimoFoco = document.activeElement;
        mostrar(visibles.indexOf(item));
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => lightbox.classList.add('abierto'));
        btnCerrar.focus();
    }

    function cerrar() {
        if (lightbox.hidden) return;
        lightbox.classList.remove('abierto');
        document.body.style.overflow = '';
        setTimeout(() => { lightbox.hidden = true; }, 250);
        if (ultimoFoco) ultimoFoco.focus();
    }

    grid.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) abrir(item);
    });

    grid.addEventListener('keydown', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            abrir(item);
        }
    });

    btnCerrar.addEventListener('click', cerrar);
    btnAnterior.addEventListener('click', () => mostrar(actual - 1));
    btnSiguiente.addEventListener('click', () => mostrar(actual + 1));

    // Tocar o hacer clic en el fondo oscuro cierra la vista
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-escenario')) cerrar();
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') cerrar();
        else if (e.key === 'ArrowLeft') mostrar(actual - 1);
        else if (e.key === 'ArrowRight') mostrar(actual + 1);
        else if (e.key === 'Tab') {
            // Mantener el foco dentro de la vista ampliada
            const enfocables = Array.from(lightbox.querySelectorAll('button:not([hidden]), a[href]'));
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

    // Gestos táctiles: deslizar a los lados para cambiar de foto, hacia abajo para cerrar
    let inicioX = 0;
    let inicioY = 0;
    lightbox.addEventListener('touchstart', (e) => {
        inicioX = e.changedTouches[0].clientX;
        inicioY = e.changedTouches[0].clientY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - inicioX;
        const dy = e.changedTouches[0].clientY - inicioY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            mostrar(dx < 0 ? actual + 1 : actual - 1);
        } else if (dy > 80 && Math.abs(dy) > Math.abs(dx)) {
            cerrar();
        }
    }, { passive: true });

    /* ---------- Fotos del visitante (solo en este navegador) ---------- */
    const input = document.getElementById('fotosUsuario');
    const previa = document.querySelector('.subir-previa');
    const mensajes = document.querySelector('.subir-mensajes');
    const acciones = document.querySelector('.subir-acciones');
    const btnAgregar = document.querySelector('.subir-agregar');
    const btnCancelar = document.querySelector('.subir-cancelar');
    if (!input || !previa) return;

    const TIPOS = ['image/jpeg', 'image/png', 'image/webp'];
    const EXTENSIONES = /\.(jpe?g|png|webp)$/i;
    const MAX_MB = 5;
    const MAX_FOTOS = 12;
    let seleccion = [];
    let contadorId = 0;

    function mensaje(texto, tipo) {
        const p = document.createElement('p');
        p.className = 'subir-msg' + (tipo === 'ok' ? ' ok' : '');
        p.textContent = texto;
        mensajes.append(p);
    }

    function actualizarAcciones() {
        acciones.hidden = seleccion.length === 0;
        btnAgregar.textContent = seleccion.length > 1
            ? 'Agregar ' + seleccion.length + ' fotos a la galería'
            : 'Agregar a la galería';
    }

    function quitar(id, liberar) {
        const foto = seleccion.find(f => f.id === id);
        if (!foto) return;
        if (liberar) URL.revokeObjectURL(foto.url);
        foto.li.remove();
        seleccion = seleccion.filter(f => f.id !== id);
        actualizarAcciones();
    }

    function agregarPrevia(archivo) {
        const foto = { id: ++contadorId, archivo, url: URL.createObjectURL(archivo) };
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = foto.url;
        img.alt = 'Vista previa de ' + archivo.name;
        img.addEventListener('error', () => {
            mensaje('«' + archivo.name + '» no se pudo leer como imagen y se quitó de la selección.');
            quitar(foto.id, true);
        });
        const nombre = document.createElement('span');
        nombre.className = 'previa-nombre';
        nombre.textContent = archivo.name;
        const btnQuitar = document.createElement('button');
        btnQuitar.type = 'button';
        btnQuitar.className = 'previa-quitar';
        btnQuitar.setAttribute('aria-label', 'Quitar ' + archivo.name);
        btnQuitar.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
        btnQuitar.addEventListener('click', () => quitar(foto.id, true));
        li.append(img, nombre, btnQuitar);
        previa.append(li);
        foto.li = li;
        seleccion.push(foto);
    }

    input.addEventListener('change', () => {
        mensajes.textContent = '';
        Array.from(input.files).forEach(archivo => {
            const formatoValido = TIPOS.includes(archivo.type) || (!archivo.type && EXTENSIONES.test(archivo.name));
            if (!formatoValido || !EXTENSIONES.test(archivo.name)) {
                mensaje('«' + archivo.name + '» no es un formato válido. Usa JPG, JPEG, PNG o WEBP.');
            } else if (archivo.size > MAX_MB * 1024 * 1024) {
                const mb = (archivo.size / 1024 / 1024).toFixed(1);
                mensaje('«' + archivo.name + '» pesa ' + mb + ' MB y supera el límite de ' + MAX_MB + ' MB por foto.');
            } else if (seleccion.length >= MAX_FOTOS) {
                mensaje('«' + archivo.name + '» no se agregó: puedes seleccionar hasta ' + MAX_FOTOS + ' fotos a la vez.');
            } else {
                agregarPrevia(archivo);
            }
        });
        // Permite volver a elegir el mismo archivo después de quitarlo
        input.value = '';
        actualizarAcciones();
    });

    btnCancelar.addEventListener('click', () => {
        seleccion.slice().forEach(f => quitar(f.id, true));
        mensajes.textContent = '';
        mensaje('Selección cancelada.', 'ok');
    });

    btnAgregar.addEventListener('click', () => {
        const nuevas = seleccion.slice();
        nuevas.reverse().forEach(foto => {
            const figura = document.createElement('figure');
            figura.className = 'gallery-item';
            figura.dataset.category = 'all';
            figura.dataset.usuario = 'true';
            figura.tabIndex = 0;
            figura.setAttribute('role', 'button');
            figura.setAttribute('aria-label', 'Ampliar foto: ' + foto.archivo.name);

            const img = document.createElement('img');
            img.src = foto.url;
            img.alt = 'Foto compartida: ' + foto.archivo.name;

            const etiqueta = document.createElement('span');
            etiqueta.className = 'gallery-etiqueta';
            etiqueta.textContent = 'Tu foto';

            const pie = document.createElement('figcaption');
            pie.className = 'gallery-overlay';
            const h3 = document.createElement('h3');
            h3.textContent = 'Foto compartida';
            const p = document.createElement('p');
            p.textContent = foto.archivo.name.replace(/\.[^.]+$/, '');
            pie.append(h3, p);

            figura.append(img, etiqueta, pie);
            figura.hidden = filtroActual !== 'all';
            grid.prepend(figura);
            if (!figura.hidden) figura.classList.add('entrando');
            quitar(foto.id, false);
        });

        mensajes.textContent = '';
        mensaje((nuevas.length === 1 ? 'Se agregó 1 foto' : 'Se agregaron ' + nuevas.length + ' fotos') +
            ' a la galería en la categoría «Todas». Solo se ven en este navegador y se perderán al recargar la página.', 'ok');

        if (filtroActual !== 'all') aplicarFiltro('all');
        const filtros = document.querySelector('.gallery-filters') || grid;
        window.scrollTo({ top: filtros.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    });
});
