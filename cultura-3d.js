/* ==========================================================
   Cultura Salvadoreña: portada 3D y museo cultural interactivo
   Requiere Three.js (vendor/three.min.js, MIT).
   Todos los objetos están modelados con geometría de Three.js.
   ========================================================== */
(function () {
    'use strict';

    // ---------- Contenido del museo ----------
    var PIEZAS = [
        {
            id: 'torito',
            nombre: 'Máscara del Torito Pinto',
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
            nombre: 'Cántaro de barro negro de Guatajiagua',
            lugar: 'Guatajiagua, departamento de Morazán',
            historia: 'Las alfareras lencas de Guatajiagua modelan el barro a mano, sin torno, tal como lo hacían sus antepasadas. Después de pulir cada pieza con una piedra lisa, la cuecen al aire libre y la bañan con un tinte natural que le da su característico color negro brillante.',
            significado: 'Es una de las tradiciones alfareras indígenas más antiguas que siguen vivas en El Salvador. Cada cántaro, comal u olla conserva conocimientos que pasan de madres a hijas y mantiene viva la identidad del pueblo lenca.',
            datos: [
                'El color negro se obtiene con nacascolo, el fruto de un árbol de la zona.',
                'Las piezas se bruñen a mano con piedras de río para darles brillo.',
                'Los dibujos blancos se trazan con barro claro antes de la cocción.',
                'Se elaboran cántaros, comales, ollas y figuras decorativas.'
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
            nombre: 'Cruz de artesanía de La Palma',
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

    // ---------- Utilidades ----------
    function soportaWebGL() {
        try {
            var c = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function mat(color, opciones) {
        var p = { color: color, roughness: 0.6, metalness: 0 };
        if (opciones) {
            for (var k in opciones) { p[k] = opciones[k]; }
        }
        return new THREE.MeshStandardMaterial(p);
    }

    function malla(geo, material) {
        var m = new THREE.Mesh(geo, material);
        m.castShadow = true;
        m.receiveShadow = true;
        return m;
    }

    // Ruido sencillo y determinista para dar irregularidad artesanal
    function ruido(x, y, z) {
        return Math.sin(x * 12.9 + y * 4.1) * 0.5 + Math.sin(z * 9.7 + x * 3.3) * 0.3 + Math.sin(y * 17.3 + z * 5.9) * 0.2;
    }

    // ---------- Modelos 3D ----------
    // Cada modelo devuelve un grupo apoyado en y = 0, de aproximadamente una unidad de alto.

    function crearTorito() {
        var g = new THREE.Group();
        var blanco = mat('#f7f3ea', { roughness: 0.45 });
        var naranja = mat('#f97316', { roughness: 0.5 });
        var azul = mat('#0057a6', { roughness: 0.5 });
        var celeste = mat('#00a3da', { roughness: 0.5 });
        var hocico = mat('#f4c7a8', { roughness: 0.55 });
        var cuerno = mat('#efe0bf', { roughness: 0.4 });
        var oscuro = mat('#1f1a17', { roughness: 0.3 });

        var cabeza = new THREE.Group();
        cabeza.position.y = 0.55;
        g.add(cabeza);

        var escala = new THREE.Vector3(0.42, 0.44, 0.4);
        var craneo = malla(new THREE.SphereGeometry(1, 48, 32), blanco);
        craneo.scale.copy(escala);
        cabeza.add(craneo);

        // Hocico
        var morro = malla(new THREE.SphereGeometry(1, 40, 24), hocico);
        morro.scale.set(0.3, 0.2, 0.22);
        morro.position.set(0, -0.2, 0.3);
        cabeza.add(morro);
        [-1, 1].forEach(function (s) {
            var nariz = malla(new THREE.SphereGeometry(0.035, 16, 12), oscuro);
            nariz.position.set(0.09 * s, -0.17, 0.5);
            cabeza.add(nariz);
        });

        // Ojos
        [-1, 1].forEach(function (s) {
            var ojo = malla(new THREE.SphereGeometry(0.075, 24, 16), blanco);
            ojo.position.set(0.17 * s, 0.07, 0.33);
            cabeza.add(ojo);
            var pupila = malla(new THREE.SphereGeometry(0.045, 20, 14), oscuro);
            pupila.position.set(0.175 * s, 0.07, 0.39);
            cabeza.add(pupila);
            var ceja = malla(new THREE.BoxGeometry(0.14, 0.03, 0.04), azul);
            ceja.position.set(0.17 * s, 0.17, 0.34);
            ceja.rotation.z = -0.25 * s;
            cabeza.add(ceja);
        });

        // Cuernos curvos
        [-1, 1].forEach(function (s) {
            var geo = new THREE.ConeGeometry(0.07, 0.5, 20, 16);
            var pos = geo.attributes.position;
            for (var i = 0; i < pos.count; i++) {
                var y = pos.getY(i) + 0.25; // 0 en la base, 0.5 en la punta
                pos.setX(i, pos.getX(i) - 0.9 * y * y * s);
            }
            geo.computeVertexNormals();
            geo.translate(0, 0.25, 0);
            var c = malla(geo, cuerno);
            c.position.set(0.3 * s, 0.26, 0.02);
            c.rotation.z = -1.0 * s;
            cabeza.add(c);
        });

        // Orejas
        [-1, 1].forEach(function (s) {
            var oreja = malla(new THREE.SphereGeometry(1, 24, 16), blanco);
            oreja.scale.set(0.16, 0.07, 0.05);
            oreja.position.set(0.47 * s, 0.08, -0.02);
            oreja.rotation.z = 0.35 * s;
            cabeza.add(oreja);
            var interior = malla(new THREE.SphereGeometry(1, 24, 16), naranja);
            interior.scale.set(0.11, 0.045, 0.02);
            interior.position.set(0.48 * s, 0.08, 0.03);
            interior.rotation.z = 0.35 * s;
            cabeza.add(interior);
        });

        // Manchas pintas sobre la superficie de la cabeza
        var manchas = [
            [0.55, 0.9, naranja, 0.13], [-0.75, 0.75, azul, 0.12], [1.35, 0.5, celeste, 0.1],
            [-1.4, 0.35, naranja, 0.1], [0.2, -0.05, azul, 0.08], [-0.25, 1.35, celeste, 0.09],
            [2.2, 0.6, azul, 0.11], [-2.3, 0.7, naranja, 0.12], [3.1, 0.9, celeste, 0.12]
        ];
        manchas.forEach(function (m) {
            var az = m[0], el = m[1];
            var n = new THREE.Vector3(Math.sin(az) * Math.cos(el - 0.6), Math.sin(el - 0.6) + 0.35, Math.cos(az) * Math.cos(el - 0.6)).normalize();
            var p = new THREE.Vector3(n.x * escala.x, n.y * escala.y, n.z * escala.z);
            var normal = new THREE.Vector3(n.x / escala.x, n.y / escala.y, n.z / escala.z).normalize();
            var mancha = malla(new THREE.SphereGeometry(1, 20, 12), m[2]);
            mancha.scale.set(m[3], m[3] * 0.85, 0.025);
            mancha.position.copy(p).addScaledVector(normal, -0.008);
            mancha.lookAt(mancha.position.clone().add(normal));
            cabeza.add(mancha);
        });

        // Roseta de la frente
        var roseta = malla(new THREE.TorusGeometry(0.07, 0.025, 12, 32), naranja);
        roseta.position.set(0, 0.3, 0.33);
        roseta.rotation.x = -0.45;
        cabeza.add(roseta);
        var centro = malla(new THREE.SphereGeometry(0.045, 16, 12), celeste);
        centro.position.set(0, 0.3, 0.34);
        cabeza.add(centro);

        // Cintas de colores que cuelgan a los lados
        var cintas = new THREE.Group();
        cintas.name = 'cintas';
        [azul, naranja, celeste, azul, naranja, celeste].forEach(function (m, i) {
            var lado = i < 3 ? -1 : 1;
            var k = i % 3;
            var cinta = malla(new THREE.BoxGeometry(0.05, 0.42 - k * 0.06, 0.012), m);
            cinta.geometry.translate(0, -(0.42 - k * 0.06) / 2, 0);
            cinta.position.set(lado * (0.3 + k * 0.05), -0.02, 0.18 - k * 0.12);
            cinta.rotation.z = lado * 0.12;
            cinta.userData.fase = i * 0.9;
            cintas.add(cinta);
        });
        cabeza.add(cintas);

        return g;
    }

    function crearCeramica() {
        var g = new THREE.Group();
        var barro = mat('#2a2421', { roughness: 0.32 });
        var blanco = mat('#ece4d6', { roughness: 0.6 });

        var perfil = [
            [0.0, 0.0], [0.2, 0.0], [0.27, 0.06], [0.38, 0.2], [0.44, 0.34], [0.43, 0.46],
            [0.36, 0.6], [0.24, 0.72], [0.15, 0.8], [0.14, 0.88], [0.18, 0.96], [0.2, 0.98]
        ];
        var curva = new THREE.SplineCurve(perfil.map(function (p) { return new THREE.Vector2(p[0], p[1]); }));
        var puntos = curva.getPoints(80);
        var cuerpo = malla(new THREE.LatheGeometry(puntos, 72), barro);
        cuerpo.material.side = THREE.DoubleSide;
        g.add(cuerpo);

        function radioEn(y) {
            for (var i = 1; i < puntos.length; i++) {
                if (puntos[i].y >= y) {
                    var a = puntos[i - 1], b = puntos[i];
                    var t = (y - a.y) / ((b.y - a.y) || 1);
                    return a.x + (b.x - a.x) * t;
                }
            }
            return puntos[puntos.length - 1].x;
        }

        // Líneas blancas horizontales
        [0.2, 0.52, 0.62, 0.84].forEach(function (y) {
            var r = radioEn(y);
            var aro = malla(new THREE.TorusGeometry(r + 0.004, 0.009, 8, 96), blanco);
            aro.rotation.x = Math.PI / 2;
            aro.position.y = y;
            g.add(aro);
        });

        // Greca en zigzag alrededor del cuerpo
        var zig = [];
        var picos = 18;
        for (var i = 0; i < picos * 2; i++) {
            var ang = (i / (picos * 2)) * Math.PI * 2;
            var y = i % 2 === 0 ? 0.28 : 0.44;
            var r = radioEn(y) + 0.006;
            zig.push(new THREE.Vector3(Math.cos(ang) * r, y, Math.sin(ang) * r));
        }
        var greca = malla(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(zig, true, 'catmullrom', 0.05), 400, 0.008, 6, true), blanco);
        g.add(greca);

        // Puntos decorativos en el hombro
        for (var j = 0; j < 12; j++) {
            var a = (j / 12) * Math.PI * 2;
            var rr = radioEn(0.57) + 0.004;
            var punto = malla(new THREE.SphereGeometry(0.016, 10, 8), blanco);
            punto.position.set(Math.cos(a) * rr, 0.57, Math.sin(a) * rr);
            g.add(punto);
        }

        // Asas
        [-1, 1].forEach(function (s) {
            var asa = malla(new THREE.TorusGeometry(0.08, 0.022, 12, 24, Math.PI), barro);
            asa.position.set(0.2 * s, 0.7, 0);
            asa.rotation.z = s > 0 ? -Math.PI / 2 : Math.PI / 2;
            asa.rotation.y = 0;
            g.add(asa);
        });

        return g;
    }

    function crearMarimba() {
        var g = new THREE.Group();
        var madera = mat('#a0622d', { roughness: 0.55 });
        var tecla = mat('#6e3218', { roughness: 0.4 });
        var resonador = mat('#7b4a26', { roughness: 0.5 });
        var naranja = mat('#f97316', { roughness: 0.5 });
        var azul = mat('#0057a6', { roughness: 0.5 });

        var n = 13;
        var ancho = 1.3;
        var alturaTeclas = 0.78;

        // Patas
        [[-0.6, 0.18], [0.6, 0.12], [-0.6, -0.18], [0.6, -0.12]].forEach(function (p) {
            var pata = malla(new THREE.CylinderGeometry(0.025, 0.03, alturaTeclas - 0.04, 12), madera);
            pata.position.set(p[0], (alturaTeclas - 0.04) / 2, p[1]);
            g.add(pata);
        });
        // Travesaño
        var trav = malla(new THREE.BoxGeometry(1.24, 0.04, 0.04), madera);
        trav.position.set(0, 0.2, 0);
        g.add(trav);

        // Marco trapezoidal: dos rieles
        var rielFrente = malla(new THREE.BoxGeometry(ancho + 0.08, 0.06, 0.05), madera);
        rielFrente.position.set(0, alturaTeclas - 0.04, 0.17);
        rielFrente.rotation.y = 0.045;
        g.add(rielFrente);
        var rielFondo = malla(new THREE.BoxGeometry(ancho + 0.08, 0.06, 0.05), madera);
        rielFondo.position.set(0, alturaTeclas - 0.04, -0.17);
        rielFondo.rotation.y = -0.045;
        g.add(rielFondo);

        // Franja decorativa al frente
        var franja = malla(new THREE.BoxGeometry(ancho + 0.08, 0.015, 0.008), naranja);
        franja.position.set(0, alturaTeclas - 0.03, 0.198);
        franja.rotation.y = 0.045;
        g.add(franja);
        var franja2 = malla(new THREE.BoxGeometry(ancho + 0.08, 0.012, 0.008), azul);
        franja2.position.set(0, alturaTeclas - 0.055, 0.198);
        franja2.rotation.y = 0.045;
        g.add(franja2);

        // Teclas y resonadores
        for (var i = 0; i < n; i++) {
            var t = i / (n - 1);
            var x = -ancho / 2 + 0.05 + t * (ancho - 0.1);
            var largo = 0.46 - t * 0.2;
            var k = malla(new THREE.BoxGeometry(0.075, 0.03, largo), tecla);
            k.position.set(x, alturaTeclas + 0.005, 0);
            g.add(k);
            var lr = 0.42 - t * 0.28;
            var tubo = malla(new THREE.CylinderGeometry(0.03, 0.03, lr, 16), resonador);
            tubo.position.set(x, alturaTeclas - 0.06 - lr / 2, 0);
            g.add(tubo);
            var tapa = malla(new THREE.CylinderGeometry(0.034, 0.034, 0.012, 16), madera);
            tapa.position.set(x, alturaTeclas - 0.06 - lr, 0);
            g.add(tapa);
        }

        // Baquetas
        [[-0.22, 0.25], [0.12, -0.2]].forEach(function (b) {
            var baqueta = new THREE.Group();
            var palo = malla(new THREE.CylinderGeometry(0.008, 0.008, 0.5, 8), madera);
            palo.rotation.z = Math.PI / 2;
            baqueta.add(palo);
            var cabeza = malla(new THREE.SphereGeometry(0.032, 16, 12), naranja);
            cabeza.position.x = 0.25;
            baqueta.add(cabeza);
            baqueta.position.set(b[0], alturaTeclas + 0.055, 0.06);
            baqueta.rotation.y = b[1];
            g.add(baqueta);
        });

        g.scale.setScalar(0.82);
        return g;
    }

    function crearPupusa() {
        var g = new THREE.Group();
        var plato = mat('#fbfaf7', { roughness: 0.25 });
        var masa = mat('#dba763', { roughness: 0.8 });
        var tostado = mat('#9a6431', { roughness: 0.85 });
        var queso = mat('#f6ecd0', { roughness: 0.5 });
        var repollo = mat('#cfe3a3', { roughness: 0.7 });
        var zanahoria = mat('#f08a3c', { roughness: 0.6 });
        var salsa = mat('#c9432c', { roughness: 0.35 });
        var azul = mat('#0057a6', { roughness: 0.4 });

        // Plato con borde azul
        var perfilPlato = [[0, 0.0], [0.42, 0.0], [0.5, 0.02], [0.62, 0.07], [0.66, 0.085], [0.665, 0.09]]
            .map(function (p) { return new THREE.Vector2(p[0], p[1]); });
        var p = malla(new THREE.LatheGeometry(perfilPlato, 80), plato);
        p.material.side = THREE.DoubleSide;
        g.add(p);
        var borde = malla(new THREE.TorusGeometry(0.645, 0.012, 8, 96), azul);
        borde.rotation.x = Math.PI / 2;
        borde.position.y = 0.083;
        g.add(borde);

        function hacerPupusa(radio, x, z, giro) {
            var pg = new THREE.Group();
            var geo = new THREE.SphereGeometry(1, 64, 24);
            var pos = geo.attributes.position;
            for (var i = 0; i < pos.count; i++) {
                var vx = pos.getX(i), vy = pos.getY(i), vz = pos.getZ(i);
                var d = 1 + ruido(vx, vy, vz) * 0.04;
                pos.setXYZ(i, vx * d, vy * (1 + ruido(vz, vx, vy) * 0.15), vz * d);
            }
            geo.computeVertexNormals();
            var cuerpo = malla(geo, masa);
            cuerpo.scale.set(radio, 0.07, radio);
            cuerpo.position.y = 0.07;
            pg.add(cuerpo);

            // Marcas tostadas del comal
            for (var j = 0; j < 16; j++) {
                var a = j * 2.4 + giro;
                var r = (0.1 + (j % 4) * 0.22) * radio;
                var h = Math.sqrt(Math.max(0, 1 - (r / radio) * (r / radio))) * 0.07 + 0.07;
                var marca = malla(new THREE.SphereGeometry(1, 14, 8), tostado);
                var tam = 0.035 + (j % 2) * 0.02;
                marca.scale.set(tam, 0.006, tam * 0.8);
                marca.position.set(Math.cos(a) * r, h - 0.002, Math.sin(a) * r);
                pg.add(marca);
            }
            // Queso que se asoma por el borde
            [0.4, 2.6].forEach(function (a) {
                var q = malla(new THREE.SphereGeometry(1, 16, 10), queso);
                q.scale.set(0.06, 0.025, 0.05);
                q.position.set(Math.cos(a + giro) * radio * 0.98, 0.05, Math.sin(a + giro) * radio * 0.98);
                pg.add(q);
            });
            pg.position.set(x, 0.07, z);
            return pg;
        }

        var segunda = hacerPupusa(0.3, -0.08, -0.12, 1.2);
        g.add(segunda);
        var primera = hacerPupusa(0.32, 0.06, 0.08, 0.3);
        primera.position.y = 0.14;
        primera.rotation.z = -0.06;
        g.add(primera);

        // Curtido
        var curtido = new THREE.Group();
        for (var c = 0; c < 36; c++) {
            var esZanahoria = c % 4 === 0;
            var tira = malla(new THREE.BoxGeometry(esZanahoria ? 0.012 : 0.02, 0.008, 0.09 + (c % 5) * 0.012), esZanahoria ? zanahoria : repollo);
            var ang = c * 2.39;
            var rad = 0.02 + (c % 7) * 0.012;
            tira.position.set(Math.cos(ang) * rad, 0.01 + (c % 6) * 0.012, Math.sin(ang) * rad);
            tira.rotation.set((c % 3) * 0.3, ang, (c % 4) * 0.25);
            curtido.add(tira);
        }
        curtido.position.set(0.4, 0.075, -0.22);
        g.add(curtido);

        // Salsa en un tazón pequeño
        var perfilTazon = [[0, 0], [0.06, 0], [0.09, 0.03], [0.1, 0.06], [0.1, 0.065]]
            .map(function (v) { return new THREE.Vector2(v[0], v[1]); });
        var tazon = malla(new THREE.LatheGeometry(perfilTazon, 40), plato);
        tazon.material = plato.clone();
        tazon.material.side = THREE.DoubleSide;
        tazon.position.set(-0.4, 0.06, 0.25);
        g.add(tazon);
        var liquido = malla(new THREE.CircleGeometry(0.093, 32), salsa);
        liquido.rotation.x = -Math.PI / 2;
        liquido.position.set(-0.4, 0.11, 0.25);
        g.add(liquido);

        g.scale.setScalar(0.95);
        return g;
    }

    function crearPalma() {
        var g = new THREE.Group();
        var fondo = mat('#fdfaf2', { roughness: 0.55 });
        var madera = mat('#c89a63', { roughness: 0.7 });
        var azul = mat('#0057a6', { roughness: 0.5 });
        var celeste = mat('#00a3da', { roughness: 0.5 });
        var naranja = mat('#f97316', { roughness: 0.5 });
        var verde = mat('#3f9b4a', { roughness: 0.55 });
        var rojo = mat('#d6402b', { roughness: 0.5 });
        var oscuro = mat('#1f1a17', { roughness: 0.4 });

        var cruz = new THREE.Group();
        var prof = 0.06;
        var zf = prof / 2 + 0.001; // frente pintado

        // Cuerpo de madera y cara frontal blanca
        var vertical = malla(new THREE.BoxGeometry(0.24, 1.0, prof), madera);
        vertical.position.y = 0.5;
        cruz.add(vertical);
        var horizontal = malla(new THREE.BoxGeometry(0.76, 0.24, prof), madera);
        horizontal.position.y = 0.68;
        cruz.add(horizontal);
        var caraV = malla(new THREE.PlaneGeometry(0.22, 0.98), fondo);
        caraV.position.set(0, 0.5, zf);
        cruz.add(caraV);
        var caraH = malla(new THREE.PlaneGeometry(0.74, 0.22), fondo);
        caraH.position.set(0, 0.68, zf + 0.0005);
        cruz.add(caraH);

        function plano(geo, material, x, y, capa) {
            var m = malla(geo, material);
            m.position.set(x, y, zf + 0.002 + (capa || 0) * 0.002);
            m.castShadow = false;
            cruz.add(m);
            return m;
        }
        function forma(puntos, material, x, y, capa) {
            var s = new THREE.Shape();
            s.moveTo(puntos[0][0], puntos[0][1]);
            for (var i = 1; i < puntos.length; i++) { s.lineTo(puntos[i][0], puntos[i][1]); }
            s.closePath();
            return plano(new THREE.ShapeGeometry(s), material, x, y, capa);
        }

        // Centro: sol naranja con rayos
        plano(new THREE.CircleGeometry(0.075, 40), naranja, 0, 0.68, 1);
        for (var r = 0; r < 12; r++) {
            var a = (r / 12) * Math.PI * 2;
            var rayo = forma([[-0.012, 0], [0.012, 0], [0, 0.04]], naranja, Math.cos(a) * 0.085, 0.68 + Math.sin(a) * 0.085, 1);
            rayo.rotation.z = a - Math.PI / 2;
        }
        plano(new THREE.CircleGeometry(0.04, 32), fondo, 0, 0.68, 2);
        plano(new THREE.CircleGeometry(0.008, 12), oscuro, -0.014, 0.69, 3);
        plano(new THREE.CircleGeometry(0.008, 12), oscuro, 0.014, 0.69, 3);

        // Brazos: palomas celestes y flores
        [-1, 1].forEach(function (s) {
            var cuerpo = plano(new THREE.CircleGeometry(0.03, 24), celeste, 0.2 * s, 0.68, 1);
            cuerpo.scale.set(1.4, 0.8, 1);
            forma([[0, 0], [0.05, 0.05], [0.07, 0.0]], celeste, 0.19 * s, 0.68, 1).scale.x = s;
            plano(new THREE.CircleGeometry(0.014, 16), celeste, 0.245 * s, 0.695, 1);
            plano(new THREE.CircleGeometry(0.004, 8), oscuro, 0.25 * s, 0.698, 2);
            // Flor
            for (var p = 0; p < 5; p++) {
                var ang = (p / 5) * Math.PI * 2;
                plano(new THREE.CircleGeometry(0.014, 16), rojo, 0.315 * s + Math.cos(ang) * 0.017, 0.68 + Math.sin(ang) * 0.017, 1);
            }
            plano(new THREE.CircleGeometry(0.01, 12), naranja, 0.315 * s, 0.68, 2);
        });

        // Parte superior: montaña y nubes
        forma([[-0.09, 0], [0, 0.09], [0.09, 0]], celeste, 0, 0.86, 1);
        forma([[-0.03, 0], [0, 0.03], [0.03, 0]], fondo, 0, 0.92, 2);
        plano(new THREE.CircleGeometry(0.018, 16), azul, -0.05, 0.96, 1);
        plano(new THREE.CircleGeometry(0.022, 16), azul, -0.025, 0.965, 1);

        // Parte inferior: casita, campesina y colinas
        plano(new THREE.PlaneGeometry(0.12, 0.09), azul, 0, 0.48, 1);
        forma([[-0.08, 0], [0.08, 0], [0, 0.065]], naranja, 0, 0.525, 1);
        plano(new THREE.PlaneGeometry(0.03, 0.05), fondo, 0, 0.46, 2);
        plano(new THREE.PlaneGeometry(0.022, 0.022), celeste, -0.04, 0.49, 2);
        plano(new THREE.PlaneGeometry(0.022, 0.022), celeste, 0.04, 0.49, 2);

        plano(new THREE.CircleGeometry(0.02, 20), mat('#a86b3c'), 0, 0.345, 1);
        forma([[-0.04, -0.07], [0.04, -0.07], [0.015, 0], [-0.015, 0]], rojo, 0, 0.325, 1);
        plano(new THREE.PlaneGeometry(0.07, 0.012), azul, 0, 0.36, 2);

        var colina1 = plano(new THREE.CircleGeometry(0.08, 32, 0, Math.PI), verde, -0.05, 0.12, 1);
        colina1.scale.y = 0.7;
        var colina2 = plano(new THREE.CircleGeometry(0.09, 32, 0, Math.PI), celeste, 0.05, 0.12, 0);
        colina2.scale.y = 0.6;
        plano(new THREE.PlaneGeometry(0.22, 0.12), verde, 0, 0.07, 0);

        // Marco azul en todo el contorno frontal
        function filete(w, h, x, y) { plano(new THREE.PlaneGeometry(w, h), azul, x, y, 3); }
        filete(0.01, 0.42, -0.11, 0.21); filete(0.01, 0.42, 0.11, 0.21);
        filete(0.01, 0.2, -0.11, 0.9); filete(0.01, 0.2, 0.11, 0.9);
        filete(0.22, 0.01, 0, 0.995); filete(0.22, 0.01, 0, 0.005);
        filete(0.27, 0.01, -0.245, 0.795); filete(0.27, 0.01, 0.245, 0.795);
        filete(0.27, 0.01, -0.245, 0.565); filete(0.27, 0.01, 0.245, 0.565);
        filete(0.01, 0.24, -0.375, 0.68); filete(0.01, 0.24, 0.375, 0.68);

        // Base para que la cruz se sostenga
        var base = malla(new THREE.BoxGeometry(0.36, 0.06, 0.2), madera);
        base.position.y = 0.03;
        g.add(base);
        cruz.position.y = 0.05;
        g.add(cruz);
        g.scale.setScalar(0.9);
        return g;
    }

    var CONSTRUCTORES = {
        torito: crearTorito,
        ceramica: crearCeramica,
        marimba: crearMarimba,
        pupusa: crearPupusa,
        palma: crearPalma
    };

    // Tamaño de cada pieza sobre su pedestal
    var ESCALA_MUSEO = { torito: 1.1, ceramica: 1.15, marimba: 1.1, pupusa: 1.2, palma: 1.1 };

    // ---------- Control de giro con ratón y tacto ----------
    function controlGiro(elemento, alGirar, alSoltar) {
        var activo = false, ultimoX = 0, ultimoY = 0, inicioX = 0, inicioY = 0;
        elemento.addEventListener('pointerdown', function (e) {
            activo = true;
            ultimoX = inicioX = e.clientX;
            ultimoY = inicioY = e.clientY;
            if (elemento.setPointerCapture) { elemento.setPointerCapture(e.pointerId); }
        });
        elemento.addEventListener('pointermove', function (e) {
            if (!activo) { return; }
            var dx = e.clientX - ultimoX, dy = e.clientY - ultimoY;
            ultimoX = e.clientX;
            ultimoY = e.clientY;
            alGirar(dx, dy);
        });
        function fin(e) {
            if (!activo) { return; }
            activo = false;
            var movido = Math.abs(e.clientX - inicioX) + Math.abs(e.clientY - inicioY);
            if (alSoltar) { alSoltar(e, movido < 6); }
        }
        elemento.addEventListener('pointerup', fin);
        elemento.addEventListener('pointercancel', function () { activo = false; });
        return { arrastrando: function () { return activo; } };
    }

    function crearRenderer(canvas, transparente) {
        var r = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: !!transparente });
        r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        r.shadowMap.enabled = true;
        r.shadowMap.type = THREE.PCFSoftShadowMap;
        return r;
    }

    function cuandoVisible(elemento, alCambiar) {
        if (!('IntersectionObserver' in window)) { alCambiar(true); return; }
        new IntersectionObserver(function (entradas) {
            alCambiar(entradas[0].isIntersecting);
        }, { threshold: 0.01 }).observe(elemento);
    }

    // ---------- Portada: máscara del Torito Pinto ----------
    function iniciarPortada() {
        var canvas = document.getElementById('cultura-hero-canvas');
        if (!canvas) { return; }
        var contenedor = canvas.parentElement;
        var renderer = crearRenderer(canvas, true);
        var escena = new THREE.Scene();
        var camara = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
        camara.position.set(0, 0.8, 4.1);
        camara.lookAt(0, 0.58, 0);

        escena.add(new THREE.HemisphereLight('#ffffff', '#003a70', 1.6));
        var sol = new THREE.DirectionalLight('#ffffff', 2.4);
        sol.position.set(1.8, 3, 2.4);
        sol.castShadow = true;
        sol.shadow.mapSize.set(1024, 1024);
        sol.shadow.camera.left = -1.2; sol.shadow.camera.right = 1.2;
        sol.shadow.camera.top = 1.2; sol.shadow.camera.bottom = -1.2;
        sol.shadow.radius = 4;
        escena.add(sol);
        var contra = new THREE.DirectionalLight('#00a3da', 0.9);
        contra.position.set(-2, 1, -2);
        escena.add(contra);

        var suelo = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.ShadowMaterial({ opacity: 0.22 }));
        suelo.rotation.x = -Math.PI / 2;
        suelo.receiveShadow = true;
        escena.add(suelo);

        var pieza = new THREE.Group();
        var torito = crearTorito();
        torito.scale.setScalar(1.15);
        pieza.add(torito);
        pieza.position.y = 0.12;
        escena.add(pieza);
        var cintas = torito.getObjectByName('cintas');

        var giroY = -0.5, giroX = 0, velocidad = 0, ultimoToque = -9999;
        controlGiro(canvas, function (dx, dy) {
            velocidad = dx * 0.01;
            giroY += dx * 0.01;
            giroX = Math.max(-0.4, Math.min(0.4, giroX + dy * 0.006));
            ultimoToque = performance.now();
        }, function () { ultimoToque = performance.now(); });

        function ajustar() {
            var w = contenedor.clientWidth, h = contenedor.clientHeight;
            if (!w || !h) { return; }
            renderer.setSize(w, h, false);
            camara.aspect = w / h;
            camara.updateProjectionMatrix();
        }
        ajustar();
        if ('ResizeObserver' in window) { new ResizeObserver(ajustar).observe(contenedor); }
        else { window.addEventListener('resize', ajustar); }

        var visible = true, anterior = performance.now();
        function cuadro(ahora) {
            if (!visible) { return; }
            var dt = Math.min(0.05, (ahora - anterior) / 1000);
            anterior = ahora;
            var quieto = ahora - ultimoToque > 2500;
            if (quieto && !reduceMotion) {
                giroY += dt * 0.35;
                giroX *= 0.96;
            } else if (!quieto) {
                giroY += velocidad * 0.9;
                velocidad *= 0.9;
            }
            pieza.rotation.y = giroY;
            pieza.rotation.x = giroX;
            if (!reduceMotion) {
                pieza.position.y = 0.12 + Math.sin(ahora / 1400) * 0.025;
                cintas.children.forEach(function (c) {
                    c.rotation.x = Math.sin(ahora / 700 + c.userData.fase) * 0.12;
                });
            }
            renderer.render(escena, camara);
            requestAnimationFrame(cuadro);
        }
        cuandoVisible(contenedor, function (v) {
            var antes = visible;
            visible = v;
            if (v && !antes) { anterior = performance.now(); requestAnimationFrame(cuadro); }
        });
        requestAnimationFrame(cuadro);
    }

    // ---------- Museo cultural 3D ----------
    function iniciarMuseo() {
        var raiz = document.getElementById('museo-3d');
        if (!raiz) { return; }
        var canvas = document.getElementById('museo-canvas');
        var escenario = canvas.parentElement; // .museo-lienzo
        var panel = document.getElementById('museo-panel');
        var botones = Array.prototype.slice.call(raiz.querySelectorAll('.museo-pieza-btn'));
        var ayuda = document.getElementById('museo-ayuda');

        var renderer = crearRenderer(canvas, false);
        var escena = new THREE.Scene();
        escena.background = new THREE.Color('#003a70');
        var camara = new THREE.PerspectiveCamera(40, 1, 0.1, 60);

        // Sala
        var piso = new THREE.Mesh(new THREE.CircleGeometry(14, 64), mat('#0b4b8c', { roughness: 0.9 }));
        piso.rotation.x = -Math.PI / 2;
        piso.receiveShadow = true;
        escena.add(piso);
        // Muro de color sólido (sin sombreado para evitar efectos de degradado)
        var muro = new THREE.Mesh(
            new THREE.CylinderGeometry(9, 9, 14, 96, 1, true),
            new THREE.MeshBasicMaterial({ color: '#0057a6', side: THREE.BackSide })
        );
        muro.position.set(0, 7, 4);
        escena.add(muro);
        // Franjas sólidas en el muro
        var franjaNaranja = new THREE.Mesh(
            new THREE.CylinderGeometry(8.98, 8.98, 0.08, 96, 1, true),
            new THREE.MeshBasicMaterial({ color: '#f97316', side: THREE.BackSide })
        );
        franjaNaranja.position.set(0, 2.9, 4);
        escena.add(franjaNaranja);
        var franjaCeleste = new THREE.Mesh(
            new THREE.CylinderGeometry(8.98, 8.98, 0.04, 96, 1, true),
            new THREE.MeshBasicMaterial({ color: '#00a3da', side: THREE.BackSide })
        );
        franjaCeleste.position.set(0, 2.78, 4);
        escena.add(franjaCeleste);

        // Luces
        escena.add(new THREE.HemisphereLight('#ffffff', '#0b4b8c', 1.1));
        var principal = new THREE.DirectionalLight('#ffffff', 2.2);
        principal.position.set(3, 7, 6);
        principal.castShadow = true;
        principal.shadow.mapSize.set(2048, 2048);
        var sc = principal.shadow.camera;
        sc.left = -6; sc.right = 6; sc.top = 6; sc.bottom = -6; sc.near = 1; sc.far = 20;
        principal.shadow.bias = -0.0005;
        principal.shadow.radius = 3;
        escena.add(principal);
        var foco = new THREE.SpotLight('#ffffff', 0, 9, 0.38, 0.6, 1.2);
        foco.position.set(0, 5, 2);
        escena.add(foco);
        escena.add(foco.target);

        // Pedestales en arco
        var radio = 4.2;
        var angulos = [-0.92, -0.46, 0, 0.46, 0.92];
        var centroSala = new THREE.Vector3(0, 0, radio);
        var estaciones = [];
        var seleccionables = [];
        var blancoPedestal = mat('#f7f7f4', { roughness: 0.5 });
        var bordeNaranja = mat('#f97316', { roughness: 0.5 });

        PIEZAS.forEach(function (pieza, i) {
            var a = angulos[i];
            var estacion = new THREE.Group();
            estacion.position.set(Math.sin(a) * radio, 0, radio - Math.cos(a) * radio);
            estacion.lookAt(centroSala.x, 0, centroSala.z);
            escena.add(estacion);

            var pedestal = malla(new THREE.BoxGeometry(0.95, 1.0, 0.95), blancoPedestal);
            pedestal.position.y = 0.5;
            estacion.add(pedestal);
            var tapa = malla(new THREE.BoxGeometry(1.05, 0.06, 1.05), blancoPedestal);
            tapa.position.y = 1.03;
            estacion.add(tapa);
            var placa = malla(new THREE.BoxGeometry(0.5, 0.06, 0.01), bordeNaranja);
            placa.position.set(0, 0.82, 0.48);
            estacion.add(placa);

            var giro = new THREE.Group();
            giro.position.y = 1.06;
            estacion.add(giro);
            var modelo = CONSTRUCTORES[pieza.id]();
            modelo.scale.multiplyScalar(ESCALA_MUSEO[pieza.id]);
            // Medidas de la pieza (aún sin padre) para encuadrarla con la cámara
            var caja = new THREE.Box3().setFromObject(modelo);
            var tam = caja.getSize(new THREE.Vector3());
            giro.add(modelo);
            modelo.traverse(function (o) { o.userData.indice = i; });
            pedestal.userData.indice = i;
            tapa.userData.indice = i;
            seleccionables.push(modelo, pedestal, tapa);

            estaciones.push({
                grupo: estacion,
                centroY: 1.06 + (caja.min.y + caja.max.y) / 2,
                tamano: Math.max(tam.x, tam.y, tam.z),
                giro: giro,
                giroY: 0,
                giroX: 0,
                velocidad: 0,
                escala: 1
            });
        });

        // Cámara: vista general y vistas de cada pieza
        var vistaGeneral = {
            pos: new THREE.Vector3(0, 2.7, 8.2),
            mira: new THREE.Vector3(0, 1.25, 0.8)
        };
        function vistaDe(i) {
            var e = estaciones[i].grupo;
            var frente = new THREE.Vector3(0, 0, 1).applyQuaternion(e.quaternion);
            var base = e.position.clone();
            var cy = estaciones[i].centroY;
            var dist = (0.95 + estaciones[i].tamano * 1.15) * Math.max(1, 0.85 / camara.aspect);
            return {
                pos: base.clone().addScaledVector(frente, dist).add(new THREE.Vector3(0, cy + dist * 0.25, 0)),
                mira: base.clone().add(new THREE.Vector3(0, cy - 0.05, 0))
            };
        }
        var camPos = vistaGeneral.pos.clone();
        var camMira = vistaGeneral.mira.clone();
        var destino = vistaGeneral;
        var orbitaGeneral = 0;
        var seleccion = -1;
        var desplazamiento = 0, desplazamientoMeta = 0;

        function esEscritorio() { return window.matchMedia('(min-width: 900px)').matches; }

        function ajustar() {
            var w = escenario.clientWidth, h = escenario.clientHeight;
            if (!w || !h) { return; }
            renderer.setSize(w, h, false);
            camara.aspect = w / h;
            camara.fov = w / h < 0.8 ? 60 : (w < 600 ? 52 : 40);
            camara.updateProjectionMatrix();
        }
        ajustar();
        if ('ResizeObserver' in window) { new ResizeObserver(ajustar).observe(escenario); }
        else { window.addEventListener('resize', ajustar); }

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

        function seleccionar(i, desdeBoton) {
            seleccion = i;
            destino = vistaDe(i);
            rellenarPanel(i);
            panel.hidden = false;
            // Forzar reflujo para que la transición de entrada se vea
            void panel.offsetWidth;
            panel.classList.add('abierto');
            raiz.classList.add('con-seleccion');
            botones.forEach(function (b, j) {
                b.classList.toggle('activo', j === i);
                b.setAttribute('aria-pressed', j === i ? 'true' : 'false');
            });
            ayuda.textContent = 'Arrastra para girar la pieza';
            desplazamientoMeta = esEscritorio() ? 1 : 0;
            if (reduceMotion) { camPos.copy(destino.pos); camMira.copy(destino.mira); }
            if (!esEscritorio() && desdeBoton) {
                setTimeout(function () {
                    escenario.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
                }, 50);
            }
        }

        function cerrar() {
            seleccion = -1;
            destino = vistaGeneral;
            panel.classList.remove('abierto');
            raiz.classList.remove('con-seleccion');
            botones.forEach(function (b) {
                b.classList.remove('activo');
                b.setAttribute('aria-pressed', 'false');
            });
            ayuda.textContent = 'Arrastra para recorrer la sala y toca una pieza';
            desplazamientoMeta = 0;
            setTimeout(function () { if (seleccion === -1) { panel.hidden = true; } }, 400);
            if (reduceMotion) { camPos.copy(destino.pos); camMira.copy(destino.mira); }
        }

        botones.forEach(function (b, i) {
            b.addEventListener('click', function () { seleccionar(i, true); });
        });
        panel.querySelector('.museo-panel-cerrar').addEventListener('click', cerrar);
        panel.querySelector('.museo-anterior').addEventListener('click', function () {
            seleccionar((seleccion - 1 + PIEZAS.length) % PIEZAS.length);
        });
        panel.querySelector('.museo-siguiente').addEventListener('click', function () {
            seleccionar((seleccion + 1) % PIEZAS.length);
        });
        raiz.querySelector('.museo-vista-general').addEventListener('click', cerrar);
        raiz.querySelectorAll('.museo-girar').forEach(function (b) {
            b.addEventListener('click', function () {
                var dir = Number(b.getAttribute('data-dir'));
                if (seleccion >= 0) {
                    estaciones[seleccion].velocidad = 0;
                    estaciones[seleccion].giroMeta = estaciones[seleccion].giroY + dir * Math.PI / 4;
                } else {
                    orbitaMeta = Math.max(-0.5, Math.min(0.5, orbitaGeneral + dir * 0.25));
                }
            });
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && seleccion >= 0) { cerrar(); }
        });

        // ----- Interacción en el lienzo -----
        var rayo = new THREE.Raycaster();
        var puntero = new THREE.Vector2();
        var hover = -1;
        var orbitaMeta = null;

        function piezaBajo(e) {
            var r = canvas.getBoundingClientRect();
            puntero.x = ((e.clientX - r.left) / r.width) * 2 - 1;
            puntero.y = -((e.clientY - r.top) / r.height) * 2 + 1;
            rayo.setFromCamera(puntero, camara);
            var hit = rayo.intersectObjects(seleccionables, true)[0];
            return hit ? hit.object.userData.indice : -1;
        }

        var control = controlGiro(canvas, function (dx, dy) {
            if (seleccion >= 0) {
                var est = estaciones[seleccion];
                est.giroMeta = null;
                est.giroY += dx * 0.012;
                est.velocidad = dx * 0.012;
                est.giroX = Math.max(-0.5, Math.min(0.5, est.giroX + dy * 0.008));
            } else {
                orbitaMeta = null;
                orbitaGeneral = Math.max(-0.5, Math.min(0.5, orbitaGeneral - dx * 0.003));
            }
        }, function (e, fueClic) {
            if (!fueClic) { return; }
            var i = piezaBajo(e);
            if (i >= 0 && i !== seleccion) { seleccionar(i); }
        });

        canvas.addEventListener('pointermove', function (e) {
            if (control.arrastrando() || e.pointerType === 'touch') { return; }
            hover = piezaBajo(e);
            canvas.style.cursor = hover >= 0 && hover !== seleccion ? 'pointer' : (seleccion >= 0 ? 'grab' : 'grab');
        });
        canvas.addEventListener('pointerleave', function () { hover = -1; });

        // ----- Bucle de animación -----
        var visible = true, anterior = performance.now();
        var tmpPos = new THREE.Vector3(), tmpMira = new THREE.Vector3();
        function cuadro(ahora) {
            if (!visible) { return; }
            var dt = Math.min(0.05, (ahora - anterior) / 1000);
            anterior = ahora;
            var suave = reduceMotion ? 1 : 1 - Math.pow(0.02, dt);

            if (orbitaMeta !== null) {
                orbitaGeneral += (orbitaMeta - orbitaGeneral) * suave;
                if (Math.abs(orbitaMeta - orbitaGeneral) < 0.001) { orbitaMeta = null; }
            }

            // Destino de cámara (la vista general puede orbitar)
            if (seleccion < 0) {
                var c = Math.cos(orbitaGeneral), s = Math.sin(orbitaGeneral);
                // En pantallas verticales la cámara se aleja para ver las cinco piezas
                var rel = vistaGeneral.pos.clone().sub(centroSala).multiplyScalar(Math.max(1, 1.25 / camara.aspect));
                tmpPos.set(rel.x * c + rel.z * s, rel.y, -rel.x * s + rel.z * c).add(centroSala);
                tmpMira.copy(vistaGeneral.mira);
            } else {
                tmpPos.copy(destino.pos);
                tmpMira.copy(destino.mira);
            }
            camPos.lerp(tmpPos, suave);
            camMira.lerp(tmpMira, suave);
            camara.position.copy(camPos);
            camara.lookAt(camMira);

            // Desplazar la imagen cuando el panel ocupa la derecha (escritorio)
            desplazamiento += (desplazamientoMeta - desplazamiento) * suave;
            var w = renderer.domElement.width, h = renderer.domElement.height;
            if (desplazamiento > 0.001) {
                var anchoPanel = Math.min(420, escenario.clientWidth * 0.42) * renderer.getPixelRatio();
                camara.setViewOffset(w, h, desplazamiento * anchoPanel / 2, 0, w, h);
            } else if (camara.view && camara.view.enabled) {
                camara.clearViewOffset();
            }

            // Piezas
            estaciones.forEach(function (est, i) {
                if (est.giroMeta !== undefined && est.giroMeta !== null) {
                    est.giroY += (est.giroMeta - est.giroY) * suave;
                    if (Math.abs(est.giroMeta - est.giroY) < 0.001) { est.giroMeta = null; }
                } else if (i === seleccion && !control.arrastrando()) {
                    est.giroY += est.velocidad;
                    est.velocidad *= 0.92;
                } else if (i !== seleccion && !reduceMotion) {
                    est.giroY += dt * 0.25;
                }
                if (i !== seleccion) { est.giroX *= 0.95; }
                est.giro.rotation.y = est.giroY;
                est.giro.rotation.x = est.giroX;
                var meta = (i === hover && i !== seleccion) ? 1.06 : 1;
                est.escala += (meta - est.escala) * suave;
                est.giro.scale.setScalar(est.escala);
            });

            // Foco sobre la pieza seleccionada
            var focoMeta = seleccion >= 0 ? 28 : 0;
            foco.intensity += (focoMeta - foco.intensity) * suave;
            if (seleccion >= 0) {
                var e = estaciones[seleccion].grupo;
                var f = new THREE.Vector3(0, 0, 1).applyQuaternion(e.quaternion);
                foco.position.copy(e.position).addScaledVector(f, 1.6).add(new THREE.Vector3(0, 4.2, 0));
                foco.target.position.copy(e.position).add(new THREE.Vector3(0, 1.3, 0));
            }

            renderer.render(escena, camara);
            requestAnimationFrame(cuadro);
        }
        cuandoVisible(escenario, function (v) {
            var antes = visible;
            visible = v;
            if (v && !antes) { anterior = performance.now(); requestAnimationFrame(cuadro); }
        });
        requestAnimationFrame(cuadro);
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (typeof THREE === 'undefined' || !soportaWebGL()) {
            document.documentElement.classList.add('sin-webgl');
            return;
        }
        iniciarPortada();
        iniciarMuseo();
    });
})();
