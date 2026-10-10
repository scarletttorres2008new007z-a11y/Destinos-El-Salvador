// Galería Visual: vista ampliada (lightbox) con teclado y gestos táctiles
document.addEventListener('DOMContentLoaded', function() {
    const items = Array.from(document.querySelectorAll('.galeria-compacta .gallery-item'));
    const lightbox = document.getElementById('galeriaLightbox');
    if (!items.length || !lightbox) return;

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

    // Solo se navega entre las fotos que deja ver el filtro activo
    function fotosVisibles() {
        return items.filter(item => item.style.display !== 'none');
    }

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
        }

        const varias = visibles.length > 1;
        btnAnterior.hidden = !varias;
        btnSiguiente.hidden = !varias;
    }

    function abrir(item) {
        visibles = fotosVisibles();
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

    items.forEach(item => {
        item.addEventListener('click', () => abrir(item));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                abrir(item);
            }
        });
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
});
