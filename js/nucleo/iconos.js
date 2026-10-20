/* =====================================================================
   Biblioteca de íconos del sitio

   Cada ícono es un dibujo SVG hecho sobre una cuadrícula de 24 x 24.
   Los números que aparecen en los atributos (d, cx, cy, r, x, y...) son
   las coordenadas de ese dibujo: indican dónde empieza y termina cada
   trazo, igual que en un plano. No se escriben a mano; se copian de una
   librería de íconos de línea (estilo Feather) y se guardan aquí una sola
   vez, con un nombre fácil de recordar.

   Cómo se usa un ícono en el HTML:
       <svg class="icono" width="20" height="20" aria-hidden="true">
           <use href="#icono-telefono"></use>
       </svg>

   Cómo se usa desde JavaScript:
       elemento.innerHTML = icono('cerrar', 20);

   Para agregar un ícono nuevo basta con añadir una línea a ICONOS.
   El color y el grosor del trazo se controlan desde CSS (clase .icono).
   ===================================================================== */

const ICONOS = {
    // Navegación y acciones
    'anterior': '<path d="m15 18-6-6 6-6"/>',
    'siguiente': '<path d="m9 18 6-6-6-6"/>',
    'desplegar': '<path d="m6 9 6 6 6-6"/>',
    'flecha-derecha': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'flecha-arriba': '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',
    'cerrar': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'confirmar': '<path d="M20 6 9 17l-5-5"/>',
    'enviar': '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/>',
    'subir': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    'enlace-externo': '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>',
    'reproducir': '<path fill="currentColor" stroke="none" d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/>',

    // Contacto
    'mensaje': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    'telefono': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    'whatsapp': '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    'correo': '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    'ubicacion': '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    'reloj': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    'calendario': '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    'pregunta': '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    'personas': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',

    // Redes sociales
    'facebook': '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    'instagram': '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
    'twitter': '<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>',
    'youtube': '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><path d="m9.75 15.02 5.75-3.27-5.75-3.27v6.54z"/>',

    // Viajes y servicios
    'estrella': '<path fill="currentColor" stroke="none" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    'pin': '<path fill="currentColor" stroke="none" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>',
    'camara': '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    'lapiz': '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    'cama': '<path d="M2 20V8"/><path d="M2 16h20v4"/><path d="M22 16v-4a3 3 0 0 0-3-3h-8v7"/><circle cx="6.5" cy="12" r="2"/>',
    'bus': '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M3 11h18"/><path d="M7 17v3"/><path d="M17 17v3"/><circle cx="7.5" cy="14" r=".5"/><circle cx="16.5" cy="14" r=".5"/>',
    'cubiertos': '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>',
    'diana': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',

    // Valores de la empresa
    'ojo': '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    'corazon': '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    'hoja': '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    'brujula': '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>',
    'medalla': '<circle cx="12" cy="8" r="7"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/>'
};

/**
 * Devuelve el HTML de un ícono para usarlo dentro de plantillas de JavaScript.
 * @param {string} nombre - Nombre del ícono en ICONOS (por ejemplo 'cerrar').
 * @param {number} tamano - Ancho y alto en píxeles.
 * @returns {string}
 */
function icono(nombre, tamano) {
    return '<svg class="icono" width="' + tamano + '" height="' + tamano + '" aria-hidden="true">' +
        '<use href="#icono-' + nombre + '"></use></svg>';
}

// Inserta una sola vez, al inicio de la página, todos los dibujos como
// <symbol>. Cada <use href="#icono-..."> de la página los reutiliza.
(function insertarIconos() {
    const simbolos = Object.keys(ICONOS).map(function (nombre) {
        return '<symbol id="icono-' + nombre + '" viewBox="0 0 24 24">' + ICONOS[nombre] + '</symbol>';
    }).join('');

    document.body.insertAdjacentHTML('afterbegin',
        '<svg class="iconos-del-sitio" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + simbolos + '</svg>');
})();
