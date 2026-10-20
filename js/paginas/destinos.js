/* =====================================================================
   Página Destinos (destinos.html)
   - Buscador y filtros por categoría, que trabajan juntos.
   - Ventana con la foto y toda la información de cada tarjeta.
   Los expedientes secretos de esta página están en js/paginas/expedientes.js.
   ===================================================================== */
(function () {
    'use strict';

    const ESPERA_AL_ESCRIBIR = 150;
    const tarjetas = document.querySelectorAll('.destination-card, .gem-card');

    // ---------------------------------------------------------------
    // Buscador y filtros
    // Busca en nombre, lugar, descripción, actividades y etiquetas sin
    // importar mayúsculas ni tildes ("volcan" encuentra "Volcán").
    // ---------------------------------------------------------------
    function iniciarBuscador() {
        const cuadricula = document.querySelector('.destinations-grid');
        const buscador = document.querySelector('.search-input');
        const botonesFiltro = document.querySelectorAll('.search-section .filter-btn');
        const joyasEscondidas = document.querySelector('.hidden-gems');
        const estado = { filtro: 'all', texto: '' };
        let aviso = null;

        // Texto de cada tarjeta preparado una sola vez para buscar más rápido
        tarjetas.forEach((tarjeta) => {
            tarjeta.dataset.busqueda = normalizarTexto(tarjeta.textContent.replace(/\s+/g, ' '));
        });

        function crearAviso() {
            aviso = document.createElement('p');
            aviso.className = 'dest-sin-resultados';
            aviso.setAttribute('role', 'status');
            cuadricula.before(aviso);
        }

        function aplicar() {
            const palabras = normalizarTexto(estado.texto).split(/\s+/).filter(Boolean);
            let visibles = 0;

            tarjetas.forEach((tarjeta) => {
                const pasaFiltro = estado.filtro === 'all' || tarjeta.dataset.category === estado.filtro;
                const pasaTexto = palabras.every((palabra) => tarjeta.dataset.busqueda.includes(palabra));
                const mostrar = pasaFiltro && pasaTexto;
                tarjeta.classList.toggle('dest-oculta', !mostrar);
                if (mostrar) visibles++;
            });

            // Las joyas escondidas se ocultan como bloque si ninguna coincide
            joyasEscondidas.classList.toggle('dest-oculta', !joyasEscondidas.querySelector('.gem-card:not(.dest-oculta)'));

            if (!aviso) crearAviso();
            aviso.hidden = visibles > 0;
            aviso.textContent = visibles > 0 ? '' :
                'No encontramos destinos con "' + estado.texto.trim() + '". Prueba con otra palabra, por ejemplo playa, volcán o Suchitoto.';
        }

        botonesFiltro.forEach((boton) => {
            boton.addEventListener('click', () => {
                botonesFiltro.forEach((otro) => otro.classList.toggle('active', otro === boton));
                estado.filtro = boton.dataset.filter;
                aplicar();
            });
        });

        buscador.addEventListener('input', antirrebote(() => {
            estado.texto = buscador.value;
            aplicar();
        }, ESPERA_AL_ESCRIBIR));

        // Escape borra la búsqueda
        buscador.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape' && buscador.value) {
                buscador.value = '';
                estado.texto = '';
                aplicar();
            }
        });
    }

    // ---------------------------------------------------------------
    // Ventana de detalles
    // ---------------------------------------------------------------
    function iniciarDetalles() {
        const elemento = document.getElementById('dest-modal');
        const ventana = crearVentana(elemento);
        const figura = elemento.querySelector('.dest-modal-figure');
        const imagen = elemento.querySelector('.dest-modal-img');
        const credito = elemento.querySelector('.dest-modal-credit');
        const contenido = elemento.querySelector('.dest-modal-content');

        function crearEnlace(texto, direccion) {
            const enlace = document.createElement('a');
            enlace.href = direccion;
            enlace.textContent = texto;
            enlace.target = '_blank';
            enlace.rel = 'noopener';
            return enlace;
        }

        function mostrarFoto(foto) {
            if (!foto) {
                imagen.removeAttribute('src');
                imagen.alt = '';
                credito.textContent = '';
                figura.classList.add('is-hidden');
                return;
            }
            imagen.src = foto.dataset.full || foto.src;
            imagen.alt = foto.alt;
            credito.textContent = 'Foto: ';
            credito.append(
                crearEnlace(foto.dataset.author, foto.dataset.source), ' · ',
                crearEnlace(foto.dataset.license, foto.dataset.licenseUrl), ' · Wikimedia Commons'
            );
            figura.classList.remove('is-hidden');
        }

        // Copia el texto de la tarjeta (sin su botón) dentro de la ventana
        function mostrarInformacion(tarjeta) {
            const copia = tarjeta.querySelector('.card-content').cloneNode(true);
            copia.querySelectorAll('.details-btn').forEach((boton) => boton.remove());
            const titulo = copia.querySelector('h3, h4');
            if (titulo) titulo.id = 'dest-modal-title';
            contenido.replaceChildren(...copia.childNodes);
        }

        tarjetas.forEach((tarjeta) => {
            tarjeta.querySelector('.details-btn').addEventListener('click', () => {
                mostrarFoto(tarjeta.querySelector('.dest-img'));
                mostrarInformacion(tarjeta);
                ventana.abrir();
            });
        });
    }

    iniciarDetalles();
    iniciarBuscador();
})();
