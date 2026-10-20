/* =====================================================================
   Página Contacto (contacto.html)
   - Pestañas: Información, Reservas, Colaboración y Preguntas frecuentes.
   - Tres formularios con validación (lógica en js/componentes/formulario.js).
   - Tarjetas de paquetes y de tipos de colaboración.
   - Acordeón de preguntas frecuentes.
   ===================================================================== */
(function () {
    'use strict';

    // ---------------------------------------------------------------
    // Pestañas
    // ---------------------------------------------------------------
    function iniciarPestanas() {
        const pestanas = document.querySelectorAll('.contact-tab');
        const paneles = document.querySelectorAll('.contact-content');

        pestanas.forEach((pestana) => {
            pestana.addEventListener('click', () => {
                pestanas.forEach((otra) => otra.classList.toggle('active', otra === pestana));
                paneles.forEach((panel) => panel.classList.toggle('active', panel.id === pestana.dataset.tab));
            });
        });

        // El botón del encabezado abre la pestaña Información y baja al formulario
        document.querySelector('.contacto-hero-btn').addEventListener('click', (evento) => {
            evento.preventDefault();
            const pestanaInformacion = document.querySelector('.contact-tab[data-tab="informacion"]');
            if (!pestanaInformacion.classList.contains('active')) pestanaInformacion.click();
            document.getElementById('formulario').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // ---------------------------------------------------------------
    // Formulario de contacto
    // ---------------------------------------------------------------
    function iniciarFormularioDeContacto() {
        document.getElementById('fechaViaje').min = HOY;

        prepararFormulario({
            form: 'contactForm', aviso: 'contactoAviso', exito: 'contactoExito',
            mailto: 'contactoMailto', titulo: 'contactoExitoTitulo', volver: 'contactoVolver',
            textoTitulo: '¡Formulario completo', correo: 'info@svelsalvador.com', asunto: 'Solicitud de viaje',
            reglas: {
                nombre: (v) => v.length >= 2,
                email: esCorreoValido,
                telefono: (v) => v === '' || esTelefonoValido(v),
                interes: (v) => v !== '',
                fechaViaje: (v) => v === '' || v >= HOY,
                mensaje: (v) => v.length >= 10
            },
            nombres: {
                nombre: 'nombre', email: 'correo', telefono: 'teléfono',
                interes: 'interés', fechaViaje: 'fecha', mensaje: 'mensaje'
            },
            lineas: (t) => [
                'Nombre: ' + t('nombre'),
                'Correo: ' + t('email'),
                'Teléfono: ' + (t('telefono') || '-'),
                'País: ' + (t('pais') || '-'),
                'Interés: ' + t('interes'),
                'Presupuesto: ' + (t('presupuesto') || '-'),
                'Fecha tentativa: ' + (t('fechaViaje') || '-'),
                'Duración: ' + (t('duracion') || '-'),
                '',
                t('mensaje')
            ]
        });
    }

    // ---------------------------------------------------------------
    // Reservas: el paquete se elige en las tarjetas de arriba
    // ---------------------------------------------------------------
    function paqueteElegido() {
        return document.querySelector('.paquete-radio:checked');
    }

    // Ejemplo: "Cultura & Historia (3 días / 2 noches, $199)"
    function describirPaquete(radio) {
        const tarjeta = radio.closest('.paquete');
        return tarjeta.querySelector('h4').textContent + ' (' +
            tarjeta.querySelector('.paquete-duracion').textContent.trim() + ', ' +
            tarjeta.querySelector('.paquete-precio').textContent.trim() + ')';
    }

    function iniciarPaquetes() {
        const radios = document.querySelectorAll('.paquete-radio');
        const resumen = document.getElementById('reservaPaquete');
        const campoPaquete = document.getElementById('reservaPaqueteCampo');

        radios.forEach((radio) => {
            radio.addEventListener('change', () => {
                radios.forEach((otro) => {
                    const tarjeta = otro.closest('.paquete');
                    tarjeta.classList.toggle('seleccionado', otro.checked);
                    tarjeta.querySelector('.paquete-boton').textContent = otro.checked ? 'Seleccionado' : 'Seleccionar';
                });

                // Resumen del paquete dentro del formulario
                const nombre = document.createElement('strong');
                nombre.textContent = describirPaquete(radio);
                const cambiar = document.createElement('a');
                cambiar.href = '#reservas-paquetes';
                cambiar.textContent = 'Cambiar';
                resumen.replaceChildren(nombre, ' ', cambiar);
                campoPaquete.classList.remove('invalido');
                campoPaquete.classList.add('correcto');
            });
        });
    }

    function iniciarFormularioDeReserva() {
        const fechaInicio = document.getElementById('res-fecha-inicio');
        const fechaFin = document.getElementById('res-fecha-fin');
        const campoPaquete = document.getElementById('reservaPaqueteCampo');

        fechaInicio.min = HOY;
        fechaFin.min = HOY;
        fechaInicio.addEventListener('change', () => { fechaFin.min = fechaInicio.value || HOY; });

        prepararFormulario({
            form: 'reservationForm', aviso: 'reservaAviso', exito: 'reservaExito',
            mailto: 'reservaMailto', titulo: 'reservaExitoTitulo', volver: 'reservaVolver',
            textoTitulo: '¡Reserva lista', correo: 'reservas@svelsalvador.com', asunto: 'Solicitud de reserva',
            reglas: {
                nombre: (v) => v.length >= 2,
                email: esCorreoValido,
                telefono: esTelefonoValido,
                fechaInicio: (v) => v !== '' && v >= HOY,
                fechaFin: (v, form) => v !== '' && v >= (form.elements.fechaInicio.value || HOY)
            },
            nombres: {
                nombre: 'nombre', email: 'correo', telefono: 'teléfono',
                fechaInicio: 'fecha de inicio', fechaFin: 'fecha de fin'
            },
            revisarExtra: () => {
                const elegido = paqueteElegido();
                campoPaquete.classList.toggle('invalido', !elegido);
                return elegido ? [] : [{ nombre: 'paquete', foco: document.getElementById('pkg-aventura') }];
            },
            lineas: (t) => [
                'Paquete: ' + describirPaquete(paqueteElegido()),
                'Nombre: ' + t('nombre'),
                'Correo: ' + t('email'),
                'Teléfono: ' + t('telefono'),
                'Fecha de inicio: ' + t('fechaInicio'),
                'Fecha de fin: ' + t('fechaFin'),
                'Viajeros: ' + t('personas'),
                'Hospedaje: ' + (t('hospedaje') || '-'),
                '',
                'Comentarios: ' + (t('comentarios') || '-')
            ]
        });
    }

    // ---------------------------------------------------------------
    // Colaboraciones: cada tarjeta elige su tipo en el formulario
    // ---------------------------------------------------------------
    function iniciarColaboracion() {
        const tarjetas = document.querySelectorAll('.colabora-tarjeta');
        const tipo = document.getElementById('collab-tipo');

        function marcarTarjeta() {
            tarjetas.forEach((tarjeta) => tarjeta.classList.toggle('activa', tarjeta.dataset.tipo === tipo.value));
        }

        tarjetas.forEach((tarjeta) => {
            tarjeta.addEventListener('click', () => {
                tipo.value = tarjeta.dataset.tipo;
                tipo.dispatchEvent(new Event('change'));
                document.getElementById('formularioColabora').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
        tipo.addEventListener('change', marcarTarjeta);

        prepararFormulario({
            form: 'collaborationForm', aviso: 'colaboraAviso', exito: 'colaboraExito',
            mailto: 'colaboraMailto', titulo: 'colaboraExitoTitulo', volver: 'colaboraVolver',
            textoTitulo: '¡Propuesta lista', correo: 'info@svelsalvador.com', asunto: 'Propuesta de colaboración',
            reglas: {
                nombre: (v) => v.length >= 2,
                email: esCorreoValido,
                tipo: (v) => v !== '',
                web: (v) => v === '' || /^https?:\/\/\S+\.\S+/.test(v),
                propuesta: (v) => v.length >= 20
            },
            nombres: {
                nombre: 'nombre o empresa', email: 'correo', tipo: 'tipo de colaboración',
                web: 'sitio web', propuesta: 'propuesta'
            },
            lineas: (t) => [
                'Nombre o empresa: ' + t('nombre'),
                'Correo: ' + t('email'),
                'Tipo de colaboración: ' + t('tipo'),
                'Sitio web o portafolio: ' + (t('web') || '-'),
                'Redes sociales: ' + (t('redes') || '-'),
                '',
                t('propuesta')
            ]
        });
    }

    // ---------------------------------------------------------------
    // Preguntas frecuentes: acordeón
    // ---------------------------------------------------------------
    function iniciarPreguntasFrecuentes() {
        document.querySelectorAll('.faq-acordeon .faq-question').forEach((boton) => {
            boton.addEventListener('click', () => {
                const abierta = boton.getAttribute('aria-expanded') === 'true';
                boton.setAttribute('aria-expanded', String(!abierta));
                boton.closest('.faq-item').classList.toggle('abierto', !abierta);
            });
        });
    }

    // En pantallas pequeñas, los botones flotantes se ocultan mientras se
    // escribe en un formulario (ver .escribiendo en css/paginas/contacto.css)
    function ocultarBotonesAlEscribir() {
        document.addEventListener('focusin', (evento) => {
            if (evento.target.matches('.contacto-form input, .contacto-form select, .contacto-form textarea')) {
                document.body.classList.add('escribiendo');
            }
        });
        document.addEventListener('focusout', () => document.body.classList.remove('escribiendo'));
    }

    iniciarPestanas();
    iniciarFormularioDeContacto();
    iniciarPaquetes();
    iniciarFormularioDeReserva();
    iniciarColaboracion();
    iniciarPreguntasFrecuentes();
    ocultarBotonesAlEscribir();
})();
