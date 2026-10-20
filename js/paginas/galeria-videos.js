/* =====================================================================
   Videos destacados (página Galería)
   Son videos reales de YouTube. Al tocar la portada se carga el
   reproductor en la misma tarjeta (solo uno a la vez).
   Si la página se abre como archivo local (file://), YouTube no permite
   reproducir videos insertados, así que el video se abre en otra pestaña.
   ===================================================================== */
(function () {
    'use strict';

    const tarjetas = document.querySelectorAll('.video-tarjeta');
    const puedeInsertar = location.protocol === 'http:' || location.protocol === 'https:';
    let tarjetaActiva = null;

    function detener(tarjeta) {
        const marco = tarjeta.querySelector('.video-marco');
        if (marco) marco.remove();
        tarjeta.classList.remove('reproduciendo');
        tarjeta.querySelector('.video-portada').hidden = false;
    }

    function crearReproductor(id, titulo) {
        const marco = document.createElement('div');
        marco.className = 'video-marco';
        const reproductor = document.createElement('iframe');
        reproductor.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
        reproductor.title = titulo;
        reproductor.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
        reproductor.allowFullscreen = true;
        reproductor.referrerPolicy = 'strict-origin-when-cross-origin';
        marco.appendChild(reproductor);
        return marco;
    }

    tarjetas.forEach((tarjeta) => {
        const id = tarjeta.dataset.video;
        const portada = tarjeta.querySelector('.video-portada');
        const titulo = tarjeta.querySelector('h4').textContent;

        portada.addEventListener('click', () => {
            if (!puedeInsertar) {
                window.open('https://www.youtube.com/watch?v=' + id, '_blank', 'noopener');
                return;
            }
            if (tarjetaActiva && tarjetaActiva !== tarjeta) detener(tarjetaActiva);
            portada.hidden = true;
            portada.after(crearReproductor(id, titulo));
            tarjeta.classList.add('reproduciendo');
            tarjetaActiva = tarjeta;
        });
    });
})();
