/* =====================================================================
   Utilidades compartidas por todas las páginas
   Funciones pequeñas y genéricas que no dependen de ninguna página.
   ===================================================================== */

/** true si la persona pidió al sistema reducir las animaciones. */
const PREFIERE_MENOS_MOVIMIENTO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Devuelve una versión de `funcion` que solo se ejecuta cuando dejan de
 * llegar llamadas durante `espera` milisegundos (útil al escribir en un buscador).
 * @param {Function} funcion
 * @param {number} espera - Milisegundos de pausa.
 * @returns {Function}
 */
function antirrebote(funcion, espera) {
    let temporizador;
    return function (...argumentos) {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => funcion(...argumentos), espera);
    };
}

/**
 * Devuelve una versión de `funcion` que se ejecuta como máximo una vez por
 * cuadro de animación (útil en eventos de scroll y resize).
 * @param {Function} funcion
 * @returns {Function}
 */
function porCuadro(funcion) {
    let pendiente = false;
    return function () {
        if (pendiente) return;
        pendiente = true;
        requestAnimationFrame(() => {
            pendiente = false;
            funcion();
        });
    };
}

/**
 * Convierte un texto en HTML seguro (los signos < > & se muestran tal cual).
 * @param {string} texto
 * @returns {string}
 */
function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

/**
 * Pasa un texto a minúsculas y sin tildes para comparar búsquedas
 * ("Volcán" y "volcan" quedan iguales).
 * @param {string} texto
 * @returns {string}
 */
function normalizarTexto(texto) {
    return (texto || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

/**
 * Crea una lista de <li> con un texto en cada elemento y la coloca en `lista`.
 * @param {HTMLElement} lista - Elemento <ul> u <ol> que se vacía y se llena.
 * @param {string[]} textos
 */
function llenarLista(lista, textos) {
    lista.replaceChildren(...textos.map((texto) => {
        const elemento = document.createElement('li');
        elemento.textContent = texto;
        return elemento;
    }));
}

/**
 * Mantiene el foco del teclado dentro de una ventana al pulsar Tab:
 * desde el último elemento vuelve al primero y al revés con Shift + Tab.
 * @param {KeyboardEvent} evento - Evento keydown con la tecla Tab.
 * @param {HTMLElement[]} enfocables - Elementos que pueden recibir el foco, en orden.
 * @param {HTMLElement} [contenedor] - Ventana que también puede tener el foco.
 */
function mantenerFocoDentro(evento, enfocables, contenedor) {
    if (enfocables.length === 0) return;
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    const activo = document.activeElement;

    if (evento.shiftKey && (activo === primero || activo === contenedor)) {
        evento.preventDefault();
        ultimo.focus();
    } else if (!evento.shiftKey && activo === ultimo) {
        evento.preventDefault();
        primero.focus();
    }
}
