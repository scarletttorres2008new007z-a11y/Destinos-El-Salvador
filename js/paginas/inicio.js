/* =====================================================================
   Página Inicio (index.html)
   - Tarjetas que aparecen suavemente al bajar.
   - Carrusel de testimonios (botones, puntos y avance automático).
   - Ventana con los detalles de cada experiencia (datos en js/datos/experiencias.js).
   ===================================================================== */
(function () {
    'use strict';

    const INTERVALO_TESTIMONIOS = 5000;

    // ---------------------------------------------------------------
    // Aparición de tarjetas al bajar
    // ---------------------------------------------------------------
    function iniciarAparicionDeTarjetas() {
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) return;
                entrada.target.style.opacity = '1';
                entrada.target.style.transform = 'translateY(0)';
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.place-card, .stat-item, .action-btn').forEach((tarjeta) => {
            tarjeta.style.opacity = '0';
            tarjeta.style.transform = 'translateY(30px)';
            tarjeta.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observador.observe(tarjeta);
        });

        // Los botones de actividades se elevan un poco al pasar el ratón
        document.querySelectorAll('.action-btn').forEach((boton, i) => {
            boton.style.animationDelay = (i * 0.1) + 's';
            boton.addEventListener('mouseenter', () => { boton.style.transform = 'translateY(-4px)'; });
            boton.addEventListener('mouseleave', () => { boton.style.transform = 'translateY(0)'; });
        });
    }

    // ---------------------------------------------------------------
    // Testimonios
    // ---------------------------------------------------------------
    function iniciarTestimonios() {
        const testimonios = document.querySelectorAll('.testimonial');
        const puntos = document.querySelectorAll('.dot');
        let actual = 0;

        function mostrar(indice) {
            actual = (indice + testimonios.length) % testimonios.length;
            testimonios.forEach((testimonio, i) => testimonio.classList.toggle('active', i === actual));
            puntos.forEach((punto, i) => punto.classList.toggle('active', i === actual));
        }

        document.querySelector('.prev-btn').addEventListener('click', () => mostrar(actual - 1));
        document.querySelector('.next-btn').addEventListener('click', () => mostrar(actual + 1));
        puntos.forEach((punto, i) => punto.addEventListener('click', () => mostrar(i)));

        setInterval(() => mostrar(actual + 1), INTERVALO_TESTIMONIOS);
        mostrar(0);
    }

    // ---------------------------------------------------------------
    // Detalles de cada experiencia
    // ---------------------------------------------------------------
    function iniciarExperiencias() {
        const elemento = document.getElementById('exp-modal');
        const ventana = crearVentana(elemento);
        const imagen = elemento.querySelector('.exp-modal-img');
        const titulo = elemento.querySelector('.exp-modal-title');
        const ubicacion = elemento.querySelector('.exp-modal-location');
        const descripcion = elemento.querySelector('.exp-modal-desc');
        const actividades = elemento.querySelector('.exp-modal-activities');
        const informacion = elemento.querySelector('.exp-modal-info');

        function mostrarExperiencia(clave) {
            const experiencia = EXPERIENCIAS[clave];
            if (!experiencia) return;
            imagen.src = experiencia.imagen;
            imagen.alt = experiencia.alt;
            titulo.textContent = experiencia.nombre;
            ubicacion.textContent = experiencia.ubicacion;
            descripcion.textContent = experiencia.descripcion;
            llenarLista(actividades, experiencia.actividades);
            llenarLista(informacion, experiencia.info);
            ventana.abrir();
        }

        document.querySelectorAll('.exp-btn[data-exp]').forEach((boton) => {
            boton.addEventListener('click', () => mostrarExperiencia(boton.dataset.exp));
        });
    }

    iniciarAparicionDeTarjetas();
    iniciarTestimonios();
    iniciarExperiencias();
})();
