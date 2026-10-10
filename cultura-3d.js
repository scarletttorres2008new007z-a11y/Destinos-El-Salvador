/* ==========================================================
   Cultura Salvadoreña: portada y sala 3D del museo
   Las piezas son las imágenes de img/cultura/, colocadas en
   una sala con perspectiva 3D (CSS) que se gira con ratón o tacto.
   ========================================================== */
(function () {
    'use strict';

    // ---------- Contenido del museo ----------
    var PIEZAS = [
        {
            id: 'torito',
            nombre: 'Figura del Torito Pinto',
            lugar: 'Fiestas patronales de todo el país',
            historia: 'El Torito Pinto es una danza tradicional de origen colonial que recrea, con humor, una corrida de toros. Un danzante lleva la figura o la máscara del toro, cubierta de manchas y adornada con cintas de colores, mientras otros personajes lo provocan y lo esquivan entre risas del público.',
            significado: 'La danza nació como una burla popular a las corridas de toros que trajeron los españoles. Hoy representa la creatividad del pueblo para transformar la historia en fiesta, y une a niños, jóvenes y adultos alrededor de la música y el baile.',
            datos: [
                '"Pinto" significa manchado: el toro siempre luce manchas de colores.',
                'Se baila al ritmo del pito y el tambor en desfiles y fiestas patronales.',
                'Las máscaras se elaboran a mano con madera, cartón o papel maché y se pintan con colores vivos.',
                'Inspira también una canción infantil muy conocida en El Salvador.'
            ]
        },
        {
            id: 'ceramica',
            nombre: 'Cántaro de barro decorado',
            lugar: 'Ilobasco, Santo Domingo de Guzmán y otros pueblos alfareros',
            historia: 'Desde tiempos precolombinos, los pueblos de El Salvador modelan el barro para crear cántaros, ollas y comales. Las alfareras dan forma a cada pieza a mano, la pulen, la cuecen en hornos de leña y la decoran con pigmentos de colores, puntos y flores.',
            significado: 'El cántaro servía para acarrear y mantener fresca el agua, y todavía se usa en muchos hogares del campo. Cada pieza conserva técnicas que pasan de generación en generación y une la vida diaria con el arte popular.',
            datos: [
                'Ilobasco, en Cabañas, es famoso por su artesanía de barro y sus diminutas «sorpresas».',
                'En Santo Domingo de Guzmán, Sonsonate, las alfareras nahuas conservan técnicas ancestrales.',
                'En Guatajiagua, Morazán, la cerámica lenca se tiñe de negro con nacascolo.',
                'El barro mantiene el agua fresca de forma natural.'
            ]
        },
        {
            id: 'marimba',
            nombre: 'Marimba',
            lugar: 'Presente en plazas, iglesias y fiestas de todo el país',
            historia: 'La marimba combina raíces africanas, indígenas y europeas. En El Salvador se conserva la marimba de arco, una versión portátil con resonadores de tecomate que el músico cuelga de su cuerpo, junto a marimbas de mayor tamaño con teclas de madera y cajas de resonancia.',
            significado: 'Su sonido acompaña procesiones, bailes, bodas y fiestas patronales. Para muchas comunidades la marimba es la voz de la celebración y un símbolo del encuentro entre culturas que formó la identidad salvadoreña.',
            datos: [
                'Las teclas suelen fabricarse con maderas duras como el hormigo.',
                'Debajo de cada tecla hay un resonador que amplifica el sonido.',
                'Se toca con baquetas que tienen cabezas forradas de hule.',
                'Varios marimbistas pueden tocar el mismo instrumento a la vez.'
            ]
        },
        {
            id: 'pupusa',
            nombre: 'Pupusa',
            lugar: 'Plato nacional de El Salvador',
            historia: 'La pupusa es una tortilla gruesa de maíz o de arroz rellena de queso, frijoles, chicharrón o loroco, cocinada sobre un comal. Sus raíces se remontan a los pueblos pipiles, y hoy se prepara en cada rincón del país y en las comunidades salvadoreñas del mundo.',
            significado: 'Más que un alimento, la pupusa reúne a las familias y a los amigos alrededor de la mesa. Es el sabor que los salvadoreños reconocen como casa, dentro y fuera del país.',
            datos: [
                'Fue declarada plato nacional por la Asamblea Legislativa en 2005.',
                'El Día Nacional de la Pupusa se celebra el segundo domingo de noviembre.',
                'Se acompaña con curtido de repollo y salsa de tomate.',
                'Olocuilta es famosa por sus pupusas de masa de arroz.'
            ]
        },
        {
            id: 'palma',
            nombre: 'Artesanía de La Palma',
            lugar: 'La Palma, departamento de Chalatenango',
            historia: 'En la década de 1970 el artista Fernando Llort se estableció en La Palma y fundó el taller La Semilla de Dios. Allí enseñó a los habitantes a pintar con su estilo de figuras sencillas y colores intensos, y el pueblo se convirtió en un gran taller de artesanos.',
            significado: 'Sus cruces, cajitas y semillas pintadas muestran casitas, campesinos, animales, flores y montañas: la vida cotidiana del campo salvadoreño contada con alegría. Es una de las expresiones artísticas más reconocidas del país.',
            datos: [
                'El estilo se conoce como arte naíf: formas simples y colores planos.',
                'Se pinta sobre madera de pino y sobre semillas de copinol.',
                'Gran parte de la economía de La Palma gira en torno a la artesanía.',
                'Sus diseños se reconocen como un símbolo de la identidad salvadoreña.'
            ]
        }
    ];

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------- Portada: las imágenes se alternan con un fundido ----------
    function iniciarPortada() {
        var obras = Array.prototype.slice.call(document.querySelectorAll('.hero-obra'));
        var nombre = document.getElementById('hero-obra-nombre');
        if (obras.length < 2 || reduceMotion) { return; }
        var actual = 0;
        setInterval(function () {
            obras[actual].classList.remove('activa');
            actual = (actual + 1) % obras.length;
            obras[actual].classList.add('activa');
            if (nombre) {
                nombre.classList.add('cambiando');
                setTimeout(function () {
                    nombre.textContent = obras[actual].getAttribute('data-nombre');
                    nombre.classList.remove('cambiando');
                }, 300);
            }
        }, 4500);
    }

    // ---------- Sala 3D ----------
    function iniciarMuseo() {
        var raiz = document.getElementById('museo-3d');
        if (!raiz) { return; }
        var carrusel = raiz.querySelector('.museo-carrusel');
        var obras = Array.prototype.slice.call(raiz.querySelectorAll('.museo-obra'));
        var panel = document.getElementById('museo-panel');
        var ayuda = document.getElementById('museo-ayuda');
        var paso = 360 / obras.length;

        var giro = 0, giroMeta = 0, seleccion = -1;
        var animando = false;

        function normalizar(a) {
            a = ((a % 360) + 360) % 360;
            return a > 180 ? a - 360 : a;
        }
        function indiceAlFrente() {
            return ((Math.round(giro / paso) % obras.length) + obras.length) % obras.length;
        }

        // Coloca cada pieza en un círculo alrededor del visitante
        function colocar() {
            var ancho = carrusel.clientWidth;
            var radio = Math.min(520, Math.max(230, ancho * 0.38));
            var profundidad = radio * 0.9;
            obras.forEach(function (obra, i) {
                var rel = normalizar(i * paso - giro);
                var rad = rel * Math.PI / 180;
                var x = Math.sin(rad) * radio;
                var z = (Math.cos(rad) - 1) * profundidad;
                var rotY = -rel * 0.45;
                obra.style.transform = 'translate(-50%, -50%) translate3d(' + x.toFixed(1) + 'px, 0, ' + z.toFixed(1) + 'px) rotateY(' + rotY.toFixed(2) + 'deg)';
                obra.style.zIndex = String(100 + Math.round(z));
                var abs = Math.abs(rel);
                // Las piezas vecinas se ven claras y las del fondo se desvanecen
                var opacidad = abs <= paso ? 1 - (abs / paso) * 0.15 : Math.max(0.1, 0.85 - ((abs - paso) / paso) * 0.75);
                obra.style.opacity = opacidad.toFixed(3);
                obra.classList.toggle('al-frente', abs < paso / 2);
                obra.classList.toggle('cerca', abs < paso * 1.2);
                obra.tabIndex = Math.abs(rel) < paso / 2 ? 0 : -1;
            });
        }

        function animar() {
            if (animando) { return; }
            animando = true;
            (function cuadro() {
                var diferencia = giroMeta - giro;
                if (reduceMotion || Math.abs(diferencia) < 0.05) {
                    giro = giroMeta;
                    colocar();
                    animando = false;
                    return;
                }
                giro += diferencia * 0.12;
                colocar();
                requestAnimationFrame(cuadro);
            })();
        }

        function irA(i) {
            // Camino más corto hacia la pieza i
            var objetivo = i * paso;
            giroMeta = giro + normalizar(objetivo - giro);
            animar();
        }

        // ----- Panel informativo -----
        var el = {
            numero: panel.querySelector('.museo-panel-numero'),
            nombre: panel.querySelector('.museo-panel-nombre'),
            lugar: panel.querySelector('.museo-panel-lugar'),
            historia: panel.querySelector('.museo-panel-historia'),
            significado: panel.querySelector('.museo-panel-significado'),
            datos: panel.querySelector('.museo-panel-datos')
        };

        function rellenarPanel(i) {
            var p = PIEZAS[i];
            el.numero.textContent = 'Pieza ' + (i + 1) + ' de ' + PIEZAS.length;
            el.nombre.textContent = p.nombre;
            el.lugar.textContent = p.lugar;
            el.historia.textContent = p.historia;
            el.significado.textContent = p.significado;
            el.datos.innerHTML = '';
            p.datos.forEach(function (d) {
                var li = document.createElement('li');
                li.textContent = d;
                el.datos.appendChild(li);
            });
            panel.scrollTop = 0;
        }

        function seleccionar(i) {
            var yaAbierto = seleccion >= 0;
            seleccion = i;
            irA(i);
            obras.forEach(function (o, j) { o.classList.toggle('seleccionada', j === i); });
            function mostrar() {
                rellenarPanel(i);
                panel.classList.remove('cambiando');
            }
            if (yaAbierto && !reduceMotion) {
                panel.classList.add('cambiando');
                setTimeout(mostrar, 200);
            } else {
                mostrar();
            }
            panel.hidden = false;
            void panel.offsetWidth;
            panel.classList.add('abierto');
            raiz.classList.add('con-seleccion');
            ayuda.textContent = 'Usa las flechas para pasar a otra pieza';
            if (!window.matchMedia('(min-width: 900px)').matches && !yaAbierto) {
                setTimeout(function () {
                    panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
                }, 350);
            }
        }

        function cerrar() {
            seleccion = -1;
            panel.classList.remove('abierto');
            raiz.classList.remove('con-seleccion');
            obras.forEach(function (o) { o.classList.remove('seleccionada'); });
            ayuda.textContent = 'Arrastra para girar la sala y toca una pieza';
            setTimeout(function () { if (seleccion === -1) { panel.hidden = true; } }, 400);
        }

        function mover(dir) {
            var siguiente = (indiceAlFrente() + dir + obras.length) % obras.length;
            if (seleccion >= 0) { seleccionar(siguiente); } else { irA(siguiente); }
        }

        panel.querySelector('.museo-panel-cerrar').addEventListener('click', cerrar);
        panel.querySelector('.museo-anterior').addEventListener('click', function () { mover(-1); });
        panel.querySelector('.museo-siguiente').addEventListener('click', function () { mover(1); });
        raiz.querySelector('.museo-vista-general').addEventListener('click', cerrar);
        raiz.querySelectorAll('.museo-girar').forEach(function (b) {
            b.addEventListener('click', function () { mover(Number(b.getAttribute('data-dir'))); });
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && seleccion >= 0) { cerrar(); }
        });

        // ----- Arrastrar para girar la sala -----
        var arrastre = null;
        carrusel.addEventListener('pointerdown', function (e) {
            arrastre = { x: e.clientX, inicio: e.clientX, movido: false, id: e.pointerId };
        });
        carrusel.addEventListener('pointermove', function (e) {
            if (!arrastre) { return; }
            var dx = e.clientX - arrastre.x;
            arrastre.x = e.clientX;
            if (Math.abs(e.clientX - arrastre.inicio) > 6 && !arrastre.movido) {
                arrastre.movido = true;
                carrusel.classList.add('arrastrando');
                if (carrusel.setPointerCapture) { carrusel.setPointerCapture(arrastre.id); }
            }
            if (arrastre.movido) {
                giro -= dx * (paso / 220);
                giroMeta = giro;
                colocar();
            }
        });
        function soltar() {
            if (!arrastre) { return; }
            var movido = arrastre.movido;
            arrastre = null;
            carrusel.classList.remove('arrastrando');
            if (movido) {
                // Ajustar a la pieza más cercana
                giroMeta = Math.round(giro / paso) * paso;
                animar();
                if (seleccion >= 0) { seleccionar(((Math.round(giro / paso) % obras.length) + obras.length) % obras.length); }
            }
        }
        carrusel.addEventListener('pointerup', soltar);
        carrusel.addEventListener('pointercancel', function () {
            arrastre = null;
            carrusel.classList.remove('arrastrando');
            giroMeta = Math.round(giro / paso) * paso;
            animar();
        });

        obras.forEach(function (obra, i) {
            obra.addEventListener('click', function (e) {
                if (carrusel.classList.contains('arrastrando')) { e.preventDefault(); return; }
                seleccionar(i);
            });
            // Inclinación suave de la pieza del frente al pasar el ratón
            obra.addEventListener('pointermove', function (e) {
                if (e.pointerType !== 'mouse' || !obra.classList.contains('al-frente') || reduceMotion) { return; }
                var r = obra.getBoundingClientRect();
                var px = (e.clientX - r.left) / r.width - 0.5;
                var py = (e.clientY - r.top) / r.height - 0.5;
                obra.style.setProperty('--inclinar-x', (-py * 8).toFixed(2) + 'deg');
                obra.style.setProperty('--inclinar-y', (px * 10).toFixed(2) + 'deg');
            });
            obra.addEventListener('pointerleave', function () {
                obra.style.setProperty('--inclinar-x', '0deg');
                obra.style.setProperty('--inclinar-y', '0deg');
            });
        });

        colocar();
        window.addEventListener('resize', colocar);
    }

    document.addEventListener('DOMContentLoaded', function () {
        iniciarPortada();
        iniciarMuseo();
    });
})();
