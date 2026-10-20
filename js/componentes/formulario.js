/* =====================================================================
   Formularios con validación y envío por correo (página Contacto)

   El sitio no tiene servidor: cuando todos los datos son correctos se
   muestra un mensaje de éxito con un botón "Enviar por correo" que abre
   el correo de la persona con la solicitud ya escrita.

   Cada formulario se configura con un objeto (ver js/paginas/contacto.js):
     form, aviso, exito, mailto, titulo, volver -> ids de los elementos
     reglas      -> { nombreDelCampo: función que devuelve true si es válido }
     nombres     -> { nombreDelCampo: nombre que se muestra en el aviso }
     revisarExtra (opcional) -> función que devuelve errores adicionales
     lineas      -> función que arma el texto del correo
     correo, asunto, textoTitulo -> datos del correo y del mensaje final
   ===================================================================== */

/** Fecha de hoy en formato AAAA-MM-DD (el que usan los campos de fecha). */
const HOY = (function () {
    const ahora = new Date();
    return new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
})();

/** @param {string} valor @returns {boolean} */
function esCorreoValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

/** Acepta dígitos, espacios, guiones, paréntesis y +, con al menos 8 dígitos. */
function esTelefonoValido(valor) {
    return /^\+?[0-9\s\-()]+$/.test(valor) && valor.replace(/\D/g, '').length >= 8;
}

/**
 * Activa la validación y el mensaje final de un formulario.
 * @param {Object} config - Configuración descrita al inicio de este archivo.
 */
function prepararFormulario(config) {
    const form = document.getElementById(config.form);
    const aviso = document.getElementById(config.aviso);
    const exito = document.getElementById(config.exito);
    const enlaceCorreo = document.getElementById(config.mailto);
    const camposConRegla = Object.keys(config.reglas).map((nombre) => form.elements[nombre]);

    // Texto que eligió o escribió la persona en un campo
    function textoDe(nombre) {
        const campo = form.elements[nombre];
        if (!campo) return '';
        if (campo.tagName === 'SELECT') return campo.value ? campo.options[campo.selectedIndex].text : '';
        return campo.value.trim();
    }

    // Marca el campo en rojo o en verde y devuelve si es válido
    function revisarCampo(campo) {
        const valor = campo.value.trim();
        const valido = config.reglas[campo.name](valor, form);
        const grupo = campo.closest('.campo');
        grupo.classList.toggle('invalido', !valido);
        grupo.classList.toggle('correcto', valido && valor !== '');
        campo.setAttribute('aria-invalid', valido ? 'false' : 'true');
        return valido;
    }

    function mostrarAviso(errores) {
        const lista = errores.map((error) => error.nombre).join(', ');
        aviso.textContent = errores.length === 1
            ? 'Falta revisar un dato: ' + lista + '.'
            : 'Faltan ' + errores.length + ' datos por revisar: ' + lista + '.';
        aviso.hidden = false;
        errores[0].foco.focus();
    }

    function mostrarExito() {
        aviso.hidden = true;
        const cuerpo = config.lineas(textoDe).join('\n');
        enlaceCorreo.href = 'mailto:' + config.correo +
            '?subject=' + encodeURIComponent(config.asunto + ' - ' + textoDe('nombre')) +
            '&body=' + encodeURIComponent(cuerpo);

        const primerNombre = textoDe('nombre').split(' ')[0];
        document.getElementById(config.titulo).textContent = config.textoTitulo + ', ' + primerNombre + '!';
        form.hidden = true;
        exito.hidden = false;
        exito.focus();
    }

    // Revisa al salir del campo y corrige en vivo si ya estaba marcado
    camposConRegla.forEach((campo) => {
        campo.addEventListener('blur', () => {
            if (campo.value.trim() !== '') revisarCampo(campo);
        });
        campo.addEventListener('input', () => {
            if (campo.closest('.campo').classList.contains('invalido')) revisarCampo(campo);
        });
        campo.addEventListener('change', () => {
            if (campo.tagName === 'SELECT' || campo.type === 'date') revisarCampo(campo);
        });
    });

    form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const errores = camposConRegla
            .filter((campo) => !revisarCampo(campo))
            .map((campo) => ({ nombre: config.nombres[campo.name], foco: campo }));
        if (config.revisarExtra) errores.unshift(...config.revisarExtra());

        if (errores.length) {
            mostrarAviso(errores);
        } else {
            mostrarExito();
        }
    });

    document.getElementById(config.volver).addEventListener('click', () => {
        exito.hidden = true;
        form.hidden = false;
        form.elements.nombre.focus();
    });
}
