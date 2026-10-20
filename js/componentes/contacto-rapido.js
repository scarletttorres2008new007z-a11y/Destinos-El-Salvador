/* =====================================================================
   Contacto rápido (todas las páginas)
   El botón flotante de la esquina abre una ventana con las formas de
   contactarnos. Los estilos están en css/componentes.css.
   ===================================================================== */
(function () {
    'use strict';

    const TELEFONO = '+503 1234-5678';
    const OPCIONES = [
        { icono: 'whatsapp', titulo: 'WhatsApp', detalle: 'Escríbenos al ' + TELEFONO, enlace: 'https://wa.me/50312345678', nuevaPestana: true },
        { icono: 'correo', titulo: 'Email', detalle: 'info@svelsalvador.com', enlace: 'mailto:info@svelsalvador.com' },
        { icono: 'telefono', titulo: 'Llamar', detalle: TELEFONO, enlace: 'tel:+50312345678' }
    ];
    const DURACION_CIERRE = 250;

    const botonFlotante = document.querySelector('.fab-btn');
    if (!botonFlotante) return;

    function crearHtmlVentana() {
        const opciones = OPCIONES.map((opcion) => `
            <button class="contact-option">
                <span class="option-icon">${icono(opcion.icono, 22)}</span>
                <span class="option-label">
                    <span class="option-text">${opcion.titulo}</span>
                    <span class="option-detail">${opcion.detalle}</span>
                </span>
            </button>`).join('');

        return `
            <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
                <div class="modal-header">
                    <div>
                        <h3 id="contact-modal-title">Contáctanos</h3>
                        <p class="modal-subtitle">Elige cómo prefieres comunicarte con nosotros</p>
                    </div>
                    <button class="modal-close" aria-label="Cerrar">${icono('cerrar', 20)}</button>
                </div>
                <div class="modal-body">${opciones}</div>
            </div>`;
    }

    function abrirVentana() {
        const ventana = document.createElement('div');
        ventana.className = 'modal-overlay';
        ventana.innerHTML = crearHtmlVentana();

        function cerrar() {
            if (ventana.classList.contains('closing')) return;
            document.removeEventListener('keydown', alPulsarTecla);
            ventana.classList.add('closing');
            setTimeout(() => ventana.remove(), DURACION_CIERRE);
        }

        function alPulsarTecla(evento) {
            if (evento.key === 'Escape') cerrar();
        }

        ventana.querySelector('.modal-close').addEventListener('click', cerrar);
        ventana.addEventListener('click', (evento) => {
            if (evento.target === ventana) cerrar();
        });
        document.addEventListener('keydown', alPulsarTecla);

        ventana.querySelectorAll('.contact-option').forEach((boton, i) => {
            boton.addEventListener('click', () => {
                const opcion = OPCIONES[i];
                if (opcion.nuevaPestana) {
                    window.open(opcion.enlace, '_blank');
                } else {
                    window.location.href = opcion.enlace;
                }
                cerrar();
            });
        });

        document.body.appendChild(ventana);
        setTimeout(() => ventana.querySelector('.modal-close').focus(), 0);
    }

    botonFlotante.addEventListener('click', abrirVentana);
})();
