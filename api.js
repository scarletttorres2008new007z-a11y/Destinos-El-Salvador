// Conexión con el backend (Java + Spring Boot + MySQL).
// Si la página se abre como archivo (file://) o el servidor no responde,
// el sitio sigue funcionando como antes: los formularios ofrecen enviar por correo.
const DestinosAPI = (function() {
    // Mismo servidor que entrega la página; se puede cambiar con window.DESTINOS_API_BASE
    const base = window.DESTINOS_API_BASE !== undefined
        ? window.DESTINOS_API_BASE
        : (location.protocol.startsWith('http') ? '' : null);
    const disponible = base !== null;

    async function pedir(ruta, opciones) {
        if (!disponible) throw { tipo: 'sin-servidor' };
        let respuesta;
        try {
            respuesta = await fetch(base + ruta, opciones);
        } catch (e) {
            throw { tipo: 'sin-servidor' };
        }
        let datos = null;
        try {
            datos = await respuesta.json();
        } catch (e) {
            datos = null;
        }
        if (respuesta.ok) return datos;
        // 400: datos que el servidor no aceptó; 429: demasiados envíos seguidos
        if ((respuesta.status === 400 || respuesta.status === 429) && datos) {
            throw { tipo: 'datos', mensaje: datos.mensaje || 'Revisa los datos marcados.', errores: datos.errores || {} };
        }
        // Sin backend (por ejemplo, un servidor solo de archivos) o error del servidor
        throw { tipo: 'sin-servidor' };
    }

    return {
        disponible,
        obtener: ruta => pedir(ruta, { headers: { 'Accept': 'application/json' } }),
        enviar: (ruta, datos) => pedir(ruta, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(datos)
        }),
        subirFotos: (archivos, email) => {
            const datos = new FormData();
            archivos.forEach(archivo => datos.append('fotos', archivo, archivo.name));
            if (email) datos.append('email', email);
            return pedir('/api/galeria/fotos', { method: 'POST', body: datos, headers: { 'Accept': 'application/json' } });
        }
    };
})();
