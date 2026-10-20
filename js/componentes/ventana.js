/* =====================================================================
   Ventana emergente reutilizable (clase .exp-modal)
   La usan las Experiencias de Inicio y los detalles de Destinos.
   Se cierra con la X, con el botón "Cerrar", con un clic fuera del
   contenido o con la tecla Escape, y devuelve el foco a donde estaba.
   ===================================================================== */

/**
 * Prepara una ventana emergente ya escrita en el HTML.
 * @param {HTMLElement} ventana - Elemento con la clase .exp-modal.
 * @returns {{abrir: Function, cerrar: Function}}
 */
function crearVentana(ventana) {
    const dialogo = ventana.querySelector('.exp-modal-dialog');
    const botonCerrar = ventana.querySelector('.exp-modal-close');
    let ultimoFoco = null;

    function abrir() {
        ultimoFoco = document.activeElement;
        dialogo.scrollTop = 0;
        ventana.classList.add('is-open');
        ventana.setAttribute('aria-hidden', 'false');
        document.body.classList.add('exp-modal-open');
        botonCerrar.focus();
    }

    function cerrar() {
        if (!ventana.classList.contains('is-open')) return;
        ventana.classList.remove('is-open');
        ventana.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('exp-modal-open');
        if (ultimoFoco) ultimoFoco.focus();
    }

    ventana.querySelectorAll('.exp-modal-close, .exp-modal-btn').forEach((boton) => {
        boton.addEventListener('click', cerrar);
    });

    // Clic en el fondo oscuro (fuera del contenido)
    ventana.addEventListener('click', (evento) => {
        if (evento.target === ventana) cerrar();
    });

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape') cerrar();
    });

    return { abrir, cerrar };
}
