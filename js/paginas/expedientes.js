/* =====================================================================
   El Salvador oculto: expedientes secretos (página Destinos)
   Dibuja las carpetas de cada expediente y la ventana del expediente
   abierto, con seis secciones navegables. El contenido está en
   js/datos/expedientes.js; aquí solo están las plantillas y la lógica.
   ===================================================================== */
(function () {
    'use strict';

    const cuadricula = document.getElementById('expedientes-grid');
    const expediente = document.getElementById('dossier');
    if (!cuadricula || !expediente) return;

    const dialogo = expediente.querySelector('.dossier-dialog');
    const pestanas = expediente.querySelector('.dossier-tabs');
    const contenido = expediente.querySelector('.dossier-content');
    const botonAnterior = expediente.querySelector('.dossier-prev');
    const botonSiguiente = expediente.querySelector('.dossier-next');

    const LETRAS = 'ABCDEFGHIJ';
    const SECCION_UBICACION = 4;
    const SECCION_DESAFIO = 5;
    const ZOOM_MAPA = 0.06;

    const resueltos = new Set();
    let actual = null;
    let seccionActual = 0;
    let visitadas = new Set();
    let ultimoFoco = null;

    // ---------------------------------------------------------------
    // Ayudantes
    // ---------------------------------------------------------------
    function buscarExpediente(id) {
        return EXPEDIENTES.find((e) => e.id === id);
    }

    // Convierte latitud y longitud en porcentajes sobre la imagen del mapa
    function posicionEnMapa(lat, lon) {
        const mapa = EXPEDIENTES_MAPA;
        return {
            x: ((lon - mapa.oeste) / (mapa.este - mapa.oeste)) * 100,
            y: ((mapa.norte - lat) / (mapa.norte - mapa.sur)) * 100
        };
    }

    function enlaceExterno(direccion, texto) {
        return `<a href="${direccion}" target="_blank" rel="noopener">${texto}</a>`;
    }

    function creditoDeFoto(evidencia) {
        const licencia = evidencia.licenciaUrl ? enlaceExterno(evidencia.licenciaUrl, evidencia.licencia) : evidencia.licencia;
        return `Foto: ${evidencia.autor} · ${licencia} · ${enlaceExterno(evidencia.fuente, 'Wikimedia Commons')}`;
    }

    function etiquetas(clasificacion) {
        return clasificacion.map((c) => `<span class="exp-tag">${c}</span>`).join('');
    }

    // ---------------------------------------------------------------
    // Carpetas (portadas)
    // ---------------------------------------------------------------
    function plantillaCarpeta(e) {
        const resuelto = resueltos.has(e.id);
        return `
<article class="exp-folder${resuelto ? ' is-solved' : ''}" data-expediente="${e.id}">
    <span class="exp-folder-tab">EXP. ${e.numero}</span>
    <div class="exp-folder-body">
        <div class="exp-folder-sheet">
            <div class="exp-folder-photo">
                <img src="${e.portada.src}" alt="${e.portada.alt}" loading="lazy">
                <span class="exp-folder-clip" aria-hidden="true"></span>
            </div>
            <div class="exp-folder-tags">${etiquetas(e.clasificacion)}</div>
            <p class="exp-folder-place">${e.lugar}</p>
            <h4 class="exp-folder-title">${e.titulo}</h4>
            <p class="exp-folder-intro">${e.intro}</p>
            <div class="exp-folder-footer">
                <button type="button" class="exp-open-btn" data-expediente="${e.id}">Abrir expediente</button>
                <span class="exp-folder-status">${resuelto ? 'Caso resuelto' : 'Pendiente'}</span>
            </div>
            <span class="exp-stamp exp-stamp-folder" aria-hidden="true">${resuelto ? 'Resuelto' : 'Confidencial'}</span>
        </div>
    </div>
</article>`;
    }

    function dibujarCarpetas() {
        cuadricula.innerHTML = EXPEDIENTES.map(plantillaCarpeta).join('');
        cuadricula.querySelectorAll('.exp-open-btn').forEach((boton) => {
            boton.addEventListener('click', () => abrirExpediente(boton.dataset.expediente, 0));
        });
    }

    // ---------------------------------------------------------------
    // Secciones del expediente abierto (una plantilla por sección)
    // ---------------------------------------------------------------
    function plantillaContexto(e) {
        return `
<div class="dossier-doc">
    <p class="dossier-doc-label">Documento 1 · Contexto del caso</p>
    <div class="dossier-context">
        <div class="dossier-context-text">
            ${e.contexto.map((parrafo) => `<p>${parrafo}</p>`).join('')}
            <aside class="dossier-note"><span class="dossier-note-label">Nota del investigador</span>${e.nota}</aside>
        </div>
        <dl class="dossier-ficha">
            <div class="dossier-ficha-head">Ficha del caso</div>
            ${e.ficha.map(([dato, valor]) => `<div class="dossier-ficha-row"><dt>${dato}</dt><dd>${valor}</dd></div>`).join('')}
        </dl>
    </div>
</div>`;
    }

    function plantillaEvidencias(e) {
        const primera = e.evidencias[0];
        const miniaturas = e.evidencias.map((evidencia, i) => `
            <button type="button" class="evidence-thumb${i === 0 ? ' is-active' : ''}" data-index="${i}" role="listitem" aria-label="Ver evidencia ${LETRAS[i]}: ${evidencia.titulo}">
                <img src="${evidencia.src}" alt="" loading="lazy">
                <span>Evidencia ${LETRAS[i]}</span>
            </button>`).join('');

        return `
<div class="dossier-doc">
    <p class="dossier-doc-label">Documento 2 · Evidencias</p>
    <div class="evidence-viewer">
        <figure class="evidence-main">
            <div class="evidence-main-img"><img src="${primera.src}" alt="${primera.alt}"></div>
            <figcaption>
                <span class="evidence-code">Evidencia ${LETRAS[0]}</span>
                <strong class="evidence-title">${primera.titulo}</strong>
                <span class="evidence-desc">${primera.descripcion}</span>
                <span class="evidence-credit">${creditoDeFoto(primera)}</span>
            </figcaption>
        </figure>
        <div class="evidence-thumbs" role="list">${miniaturas}
        </div>
    </div>
</div>`;
    }

    function plantillaPistas(e) {
        const pistas = e.pistas.map((pista, i) => `
        <li class="clue">
            <button type="button" class="clue-toggle" aria-expanded="false" aria-controls="clue-${e.id}-${i}">
                <span class="clue-num">Pista ${String(i + 1).padStart(2, '0')}</span>
                <span class="clue-title">${pista.titulo}</span>
                <span class="clue-icon" aria-hidden="true"></span>
            </button>
            <div class="clue-panel" id="clue-${e.id}-${i}"><div class="clue-panel-inner"><p>${pista.texto}</p></div></div>
        </li>`).join('');

        return `
<div class="dossier-doc">
    <p class="dossier-doc-label">Documento 3 · Las pistas</p>
    <div class="clues-progress">
        <span class="clues-count">Pistas reveladas: <strong>0</strong> de ${e.pistas.length}</span>
        <span class="clues-bar" aria-hidden="true">${e.pistas.map(() => '<span></span>').join('')}</span>
    </div>
    <ol class="clues-list">${pistas}
    </ol>
</div>`;
    }

    // Un grupo de "Lo que sabemos"; no se muestra si no tiene elementos
    function plantillaGrupoSabemos(clase, sello, titulo, elementos) {
        if (!elementos || elementos.length === 0) return '';
        return `
<section class="known-group known-${clase}">
    <span class="known-stamp">${sello}</span>
    <h5>${titulo}</h5>
    <ul>${elementos.map((texto) => `<li>${texto}</li>`).join('')}</ul>
</section>`;
    }

    function plantillaSabemos(e) {
        const s = e.sabemos;
        const fuentes = e.fuentes.map((f) => `<li>${f.url ? enlaceExterno(f.url, f.texto) : f.texto}</li>`).join('');
        return `
<div class="dossier-doc">
    <p class="dossier-doc-label">Documento 4 · Lo que sabemos</p>
    <div class="known-grid">
        ${plantillaGrupoSabemos('facts', 'Verificado', 'Hechos comprobados', s.hechos)}
        ${plantillaGrupoSabemos('debate', 'En debate', 'Hipótesis y debates', s.debate)}
        ${plantillaGrupoSabemos('interp', 'Interpretación', 'Interpretaciones de los investigadores', s.interpretaciones)}
        ${plantillaGrupoSabemos('legend', 'No comprobado', 'Leyendas y creencias populares', s.leyendas)}
    </div>
    <div class="dossier-sources">
        <h5>Fuentes consultadas</h5>
        <ol>${fuentes}</ol>
    </div>
</div>`;
    }

    function plantillaUbicacion(e) {
        const u = e.ubicacion;
        const aqui = posicionEnMapa(u.lat, u.lon);

        // Líneas hacia los expedientes relacionados
        const lineas = u.relacionados.map((relacion) => {
            const otro = buscarExpediente(relacion.id);
            const destino = posicionEnMapa(otro.ubicacion.lat, otro.ubicacion.lon);
            return `<line x1="${aqui.x}" y1="${aqui.y}" x2="${destino.x}" y2="${destino.y}"/>`;
        }).join('');

        // Un marcador por expediente; el actual queda resaltado
        const marcadores = EXPEDIENTES.map((otro) => {
            const punto = posicionEnMapa(otro.ubicacion.lat, otro.ubicacion.lon);
            const esActual = otro.id === e.id;
            return `<button type="button" class="map-pin${esActual ? ' is-current' : ''}" style="left:${punto.x}%;top:${punto.y}%" data-expediente="${otro.id}"${esActual ? ' tabindex="-1" aria-current="true"' : ''} aria-label="Expediente ${otro.numero}: ${otro.lugar}"><span class="map-pin-label">${otro.numero} · ${otro.lugar}</span></button>`;
        }).join('');

        const conexiones = u.relacionados.map((relacion) => {
            const otro = buscarExpediente(relacion.id);
            return `<button type="button" class="location-link" data-expediente="${otro.id}"><span>EXP. ${otro.numero} · ${otro.lugar}</span>${relacion.texto}</button>`;
        }).join('');

        const mapaOsm = `https://www.openstreetmap.org/export/embed.html?bbox=${u.lon - ZOOM_MAPA}%2C${u.lat - ZOOM_MAPA}%2C${u.lon + ZOOM_MAPA}%2C${u.lat + ZOOM_MAPA}&layer=mapnik&marker=${u.lat}%2C${u.lon}`;
        const enlaceOsm = `https://www.openstreetmap.org/?mlat=${u.lat}&mlon=${u.lon}#map=13/${u.lat}/${u.lon}`;

        return `
<div class="dossier-doc">
    <p class="dossier-doc-label">Documento 5 · Ubicación</p>
    <div class="location-grid">
        <figure class="location-map">
            <div class="location-map-frame">
                <img src="${EXPEDIENTES_MAPA.src}" alt="Mapa de relieve de El Salvador con la ubicación de los expedientes" loading="lazy">
                <svg class="location-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lineas}</svg>
                ${marcadores}
            </div>
            <figcaption>${enlaceExterno(EXPEDIENTES_MAPA.fuente, EXPEDIENTES_MAPA.credito)}</figcaption>
        </figure>
        <div class="location-info">
            <p class="location-coords">${Math.abs(u.lat).toFixed(4)}° N · ${Math.abs(u.lon).toFixed(4)}° O</p>
            <p class="location-ref">${u.referencia}</p>
            <div class="location-osm">
                <iframe title="Mapa de ${e.lugar} en OpenStreetMap" data-src="${mapaOsm}" loading="lazy"></iframe>
            </div>
            <a class="location-osm-link" href="${enlaceOsm}" target="_blank" rel="noopener">Ver mapa ampliado en OpenStreetMap</a>
            ${conexiones ? `<div class="location-links"><p class="location-links-label">Conexiones con otros expedientes</p>${conexiones}</div>` : ''}
        </div>
    </div>
</div>`;
    }

    function plantillaDesafio(e) {
        const opciones = e.desafio.opciones.map((opcion, i) => `
        <button type="button" class="challenge-option" data-index="${i}">
            <span class="challenge-letter">${LETRAS[i]}</span>
            <span class="challenge-text">${opcion.texto}</span>
            <span class="challenge-mark" aria-hidden="true"></span>
        </button>`).join('');

        return `
<div class="dossier-doc dossier-challenge">
    <p class="dossier-doc-label">Documento 6 · Desafío final</p>
    <p class="challenge-question">${e.desafio.pregunta}</p>
    <div class="challenge-options">${opciones}
    </div>
    <div class="challenge-result" aria-live="polite"></div>
</div>`;
    }

    function plantillaResultado(elegida, correcta) {
        const respuestaCorrecta = elegida.correcta ? '' :
            `<p class="challenge-explanation challenge-explanation-correct"><strong>Respuesta correcta:</strong> ${correcta.explicacion}</p>`;
        return `
<span class="exp-stamp exp-stamp-result">${elegida.correcta ? 'Caso resuelto' : 'Revisar evidencias'}</span>
<p class="challenge-explanation">${elegida.explicacion}</p>
${respuestaCorrecta}
<button type="button" class="challenge-retry">Intentar de nuevo</button>`;
    }

    const PLANTILLAS = {
        contexto: plantillaContexto,
        evidencias: plantillaEvidencias,
        pistas: plantillaPistas,
        sabemos: plantillaSabemos,
        ubicacion: plantillaUbicacion,
        desafio: plantillaDesafio
    };

    // ---------------------------------------------------------------
    // Interacciones de cada sección (se activan después de dibujarla)
    // ---------------------------------------------------------------
    function activarEvidencias(e) {
        const principal = contenido.querySelector('.evidence-main');
        const miniaturas = contenido.querySelectorAll('.evidence-thumb');

        miniaturas.forEach((miniatura) => {
            miniatura.addEventListener('click', () => {
                const i = Number(miniatura.dataset.index);
                const evidencia = e.evidencias[i];
                miniaturas.forEach((otra) => otra.classList.toggle('is-active', otra === miniatura));

                // Reinicia la animación de cambio
                principal.classList.remove('is-changing');
                void principal.offsetWidth;
                principal.classList.add('is-changing');

                const imagen = principal.querySelector('img');
                imagen.src = evidencia.src;
                imagen.alt = evidencia.alt;
                principal.querySelector('.evidence-code').textContent = 'Evidencia ' + LETRAS[i];
                principal.querySelector('.evidence-title').textContent = evidencia.titulo;
                principal.querySelector('.evidence-desc').textContent = evidencia.descripcion;
                principal.querySelector('.evidence-credit').innerHTML = creditoDeFoto(evidencia);
            });
        });
    }

    function activarPistas() {
        const contador = contenido.querySelector('.clues-count strong');
        const barras = contenido.querySelectorAll('.clues-bar span');
        const reveladas = new Set();

        contenido.querySelectorAll('.clue-toggle').forEach((boton, i) => {
            boton.addEventListener('click', () => {
                const abierta = boton.getAttribute('aria-expanded') === 'true';
                boton.setAttribute('aria-expanded', String(!abierta));
                boton.closest('.clue').classList.toggle('is-open', !abierta);
                if (!abierta) reveladas.add(i);
                contador.textContent = reveladas.size;
                barras.forEach((barra, j) => barra.classList.toggle('is-on', j < reveladas.size));
            });
        });
    }

    function activarUbicacion() {
        // El mapa de OpenStreetMap se carga solo al abrir esta sección
        const mapa = contenido.querySelector('.location-osm iframe');
        if (mapa && !mapa.src) mapa.src = mapa.dataset.src;

        contenido.querySelectorAll('.map-pin:not(.is-current), .location-link').forEach((boton) => {
            boton.addEventListener('click', () => abrirExpediente(boton.dataset.expediente, SECCION_UBICACION));
        });
    }

    function activarDesafio(e) {
        const opciones = contenido.querySelectorAll('.challenge-option');
        const resultado = contenido.querySelector('.challenge-result');
        const correcta = e.desafio.opciones.find((opcion) => opcion.correcta);

        function responder(boton) {
            const elegida = e.desafio.opciones[Number(boton.dataset.index)];

            opciones.forEach((otro) => {
                otro.disabled = true;
                if (e.desafio.opciones[Number(otro.dataset.index)].correcta) {
                    otro.classList.add('is-correct');
                    otro.querySelector('.challenge-mark').innerHTML = icono('confirmar', 18);
                }
            });
            if (!elegida.correcta) {
                boton.classList.add('is-wrong');
                boton.querySelector('.challenge-mark').innerHTML = icono('cerrar', 18);
            }

            resultado.className = 'challenge-result is-visible ' + (elegida.correcta ? 'is-success' : 'is-error');
            resultado.innerHTML = plantillaResultado(elegida, correcta);
            resultado.querySelector('.challenge-retry').addEventListener('click', () => mostrarSeccion(SECCION_DESAFIO, true));

            if (elegida.correcta) {
                resueltos.add(e.id);
                expediente.querySelector('.dossier-status').textContent = 'Caso resuelto';
                expediente.classList.add('is-solved');
                dibujarCarpetas();
            }
        }

        opciones.forEach((boton) => boton.addEventListener('click', () => responder(boton)));
    }

    const ACTIVADORES = {
        evidencias: activarEvidencias,
        pistas: activarPistas,
        ubicacion: activarUbicacion,
        desafio: activarDesafio
    };

    // ---------------------------------------------------------------
    // Navegación entre secciones
    // ---------------------------------------------------------------
    function actualizarPestanas(indice) {
        pestanas.querySelectorAll('.dossier-tab').forEach((pestana, i) => {
            const activa = i === indice;
            pestana.classList.toggle('is-active', activa);
            pestana.classList.toggle('is-visited', visitadas.has(i));
            pestana.setAttribute('aria-selected', String(activa));
            pestana.tabIndex = activa ? 0 : -1;
            if (activa) {
                // Centra la pestaña activa cuando la barra se desplaza (móvil)
                pestanas.scrollTo({ left: pestana.offsetLeft - (pestanas.clientWidth - pestana.offsetWidth) / 2, behavior: 'smooth' });
            }
        });
    }

    function actualizarBotonesDeNavegacion(indice) {
        const anterior = EXPEDIENTE_SECCIONES[indice - 1];
        const siguiente = EXPEDIENTE_SECCIONES[indice + 1];
        botonAnterior.hidden = !anterior;
        botonSiguiente.hidden = !siguiente;
        if (anterior) botonAnterior.querySelector('.dossier-nav-name').textContent = anterior.titulo;
        if (siguiente) botonSiguiente.querySelector('.dossier-nav-name').textContent = siguiente.titulo;
    }

    function mostrarSeccion(indice, forzar) {
        if (!actual) return;
        if (indice === seccionActual && !forzar && contenido.childElementCount) return;
        seccionActual = indice;
        visitadas.add(indice);
        const seccion = EXPEDIENTE_SECCIONES[indice];

        actualizarPestanas(indice);

        contenido.innerHTML = PLANTILLAS[seccion.id](actual);
        contenido.setAttribute('aria-labelledby', 'dossier-tab-' + seccion.id);
        contenido.classList.remove('is-entering');
        void contenido.offsetWidth;
        contenido.classList.add('is-entering');
        contenido.scrollTop = 0;

        if (ACTIVADORES[seccion.id]) ACTIVADORES[seccion.id](actual);
        actualizarBotonesDeNavegacion(indice);
    }

    function dibujarPestanas() {
        pestanas.innerHTML = EXPEDIENTE_SECCIONES.map((seccion, i) => `
<button type="button" class="dossier-tab" role="tab" id="dossier-tab-${seccion.id}" aria-controls="dossier-content" aria-selected="false" data-index="${i}">
    <span class="dossier-tab-num">${i + 1}</span>
    <span class="dossier-tab-label">${seccion.titulo}</span>
</button>`).join('');

        pestanas.querySelectorAll('.dossier-tab').forEach((pestana) => {
            pestana.addEventListener('click', () => mostrarSeccion(Number(pestana.dataset.index)));
        });
    }

    // ---------------------------------------------------------------
    // Abrir y cerrar
    // ---------------------------------------------------------------
    function llenarEncabezado(e) {
        const resuelto = resueltos.has(e.id);
        expediente.querySelector('.dossier-number').textContent = 'Expediente ' + e.numero;
        expediente.querySelector('.dossier-class').innerHTML = etiquetas(e.clasificacion);
        expediente.querySelector('.dossier-title').textContent = e.titulo;
        expediente.querySelector('.dossier-place').textContent = e.lugar;
        expediente.querySelector('.dossier-status').textContent = resuelto ? 'Caso resuelto' : 'En investigación';
        expediente.classList.toggle('is-solved', resuelto);
    }

    function abrirExpediente(id, indice) {
        const e = buscarExpediente(id);
        if (!e) return;
        const yaAbierto = expediente.classList.contains('is-open');
        if (!yaAbierto) ultimoFoco = document.activeElement;
        actual = e;
        visitadas = new Set();
        seccionActual = -1;

        llenarEncabezado(e);
        dibujarPestanas();
        mostrarSeccion(indice || 0, true);

        if (yaAbierto) {
            // Cambio de un expediente a otro: animación corta
            dialogo.classList.remove('is-switching');
            void dialogo.offsetWidth;
            dialogo.classList.add('is-switching');
        } else {
            expediente.classList.add('is-open');
            expediente.setAttribute('aria-hidden', 'false');
            document.body.classList.add('dossier-open');
        }
        dialogo.focus();
    }

    function cerrarExpediente() {
        expediente.classList.remove('is-open');
        expediente.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('dossier-open');
        const mapa = contenido.querySelector('.location-osm iframe');
        if (mapa) mapa.removeAttribute('src');
        actual = null;
        if (ultimoFoco) ultimoFoco.focus();
    }

    // Elementos que pueden recibir el foco y que se ven en pantalla
    function enfocablesVisibles() {
        const selector = 'button:not([disabled]):not([hidden]), a[href], iframe, [tabindex]:not([tabindex="-1"])';
        return Array.from(dialogo.querySelectorAll(selector)).filter((el) => el.offsetParent !== null);
    }

    function iniciarEventos() {
        botonAnterior.addEventListener('click', () => mostrarSeccion(seccionActual - 1));
        botonSiguiente.addEventListener('click', () => mostrarSeccion(seccionActual + 1));
        expediente.querySelector('.dossier-close').addEventListener('click', cerrarExpediente);
        expediente.addEventListener('click', (evento) => {
            if (evento.target === expediente) cerrarExpediente();
        });

        // Flechas izquierda y derecha para cambiar de pestaña
        pestanas.addEventListener('keydown', (evento) => {
            if (evento.key !== 'ArrowRight' && evento.key !== 'ArrowLeft') return;
            const total = EXPEDIENTE_SECCIONES.length;
            const nueva = (seccionActual + (evento.key === 'ArrowRight' ? 1 : -1) + total) % total;
            mostrarSeccion(nueva);
            pestanas.querySelectorAll('.dossier-tab')[nueva].focus();
        });

        document.addEventListener('keydown', (evento) => {
            if (!expediente.classList.contains('is-open')) return;
            if (evento.key === 'Escape') cerrarExpediente();
            if (evento.key === 'Tab') mantenerFocoDentro(evento, enfocablesVisibles(), dialogo);
        });
    }

    iniciarEventos();
    dibujarCarpetas();
})();
