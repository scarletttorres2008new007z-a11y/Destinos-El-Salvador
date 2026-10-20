/* =====================================================================
   Datos: Experiencias imperdibles (página Inicio)
   Cada clave coincide con el atributo data-exp del botón "Detalles"
   de su tarjeta en index.html. Para agregar una experiencia nueva se
   añade aquí un objeto con la misma estructura y su tarjeta en el HTML.
   ===================================================================== */

const EXPERIENCIAS = {
    tunco: {
        nombre: 'Playa El Tunco',
        imagen: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1200&auto=format&fit=crop',
        alt: 'Playa El Tunco',
        ubicacion: '📍 La Libertad',
        descripcion: 'Pequeño pueblo de playa famoso por la gran roca que le da nombre y por sus olas constantes durante todo el año. De día reúne a surfistas de todo el mundo y, al caer la tarde, se llena de vida con restaurantes, música y uno de los atardeceres más bonitos del Pacífico.',
        actividades: [
            'Tomar clases de surf o alquilar una tabla.',
            'Ver el atardecer junto a la roca de El Tunco.',
            'Probar mariscos y pupusas frente al mar.',
            'Disfrutar la vida nocturna del pueblo.'
        ],
        info: [
            'Mejor época: de noviembre a abril (temporada seca).',
            'Presupuesto aproximado: $25-40 por día.',
            'A unos 45 minutos de San Salvador.'
        ]
    },
    santaana: {
        nombre: 'Volcán de Santa Ana',
        imagen: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
        alt: 'Volcán de Santa Ana',
        ubicacion: '📍 Parque Nacional Los Volcanes, Santa Ana',
        descripcion: 'También llamado Ilamatepec, es el volcán más alto de El Salvador. Su cráter guarda una laguna color turquesa con fumarolas, y desde la cima se ven el Lago de Coatepeque, el volcán de Izalco y, en días despejados, el océano Pacífico.',
        actividades: [
            'Hacer la caminata guiada hasta el cráter.',
            'Asomarte a la laguna turquesa del volcán.',
            'Visitar el Cerro Verde y el volcán de Izalco.'
        ],
        info: [
            'Las caminatas salen con guía por la mañana.',
            'Lleva agua, protector solar y un abrigo ligero.',
            'Presupuesto aproximado: $15-25 por día.'
        ]
    },
    ceren: {
        nombre: 'Joya de Cerén',
        imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
        alt: 'Joya de Cerén',
        ubicacion: '📍 San Juan Opico, La Libertad',
        descripcion: 'Conocida como la Pompeya de América, es una aldea maya que quedó sepultada por la ceniza de una erupción volcánica hace unos 1,400 años. Gracias a eso se conservaron casas, objetos y cultivos de la vida cotidiana, y por eso fue declarada Patrimonio de la Humanidad por la UNESCO.',
        actividades: [
            'Recorrer las estructuras de la antigua aldea maya.',
            'Visitar el museo del sitio y sus piezas originales.',
            'Conocer cómo vivían las familias mayas del lugar.'
        ],
        info: [
            'A unos 40 minutos de San Salvador.',
            'Presupuesto aproximado: $5-15 por día.',
            'Lleva sombrero y agua: parte del recorrido es al sol.'
        ]
    },
    coatepeque: {
        nombre: 'Lago de Coatepeque',
        imagen: 'https://images.unsplash.com/photo-1698615195164-61794e24fd84?auto=format&fit=crop&w=1200&q=80',
        alt: 'Muelle en el Lago de Coatepeque',
        ubicacion: '📍 Santa Ana',
        descripcion: 'Formado dentro de una antigua caldera volcánica, el lago es famoso por su agua azul intenso, que en algunas épocas del año cambia a turquesa. Está rodeado de colinas verdes, muelles y restaurantes con vista.',
        actividades: [
            'Pasear en lancha o en kayak.',
            'Nadar desde los muelles.',
            'Comer en un restaurante con vista al lago.'
        ],
        info: [
            'Queda cerca del Volcán de Santa Ana: se pueden visitar el mismo día.',
            'Presupuesto aproximado: $20-35 por día.',
            'Por la mañana el agua suele verse más azul.'
        ]
    },
    suchitoto: {
        nombre: 'Suchitoto',
        imagen: 'https://images.unsplash.com/photo-1680374635221-aca00abf60f5?auto=format&fit=crop&w=1200&q=80',
        alt: 'Calle empedrada frente a la iglesia de Suchitoto',
        ubicacion: '📍 Cuscatlán',
        descripcion: 'Pueblo colonial de casas blancas y calles empedradas, considerado la capital cultural de El Salvador. Tiene galerías, talleres de añil, festivales de arte y miradores hacia el lago Suchitlán.',
        actividades: [
            'Caminar por el centro histórico y la iglesia Santa Lucía.',
            'Participar en un taller de teñido con añil.',
            'Pasear en lancha por el lago Suchitlán.'
        ],
        info: [
            'A aproximadamente una hora de San Salvador.',
            'Los fines de semana hay más actividades culturales.',
            'Presupuesto aproximado: $20-30 por día.'
        ]
    },
    flores: {
        nombre: 'Ruta de las Flores',
        imagen: 'https://images.unsplash.com/photo-1694842492258-deb917102d57?auto=format&fit=crop&w=1200&q=80',
        alt: 'Sombrillas de colores en Concepción de Ataco',
        ubicacion: '📍 Sonsonate y Ahuachapán',
        descripcion: 'Recorrido por pueblos de montaña como Nahuizalco, Juayúa, Apaneca y Concepción de Ataco, conocidos por sus murales, cafetales, artesanías y clima fresco.',
        actividades: [
            'Visitar la feria gastronómica de Juayúa los fines de semana.',
            'Hacer un tour de café en una finca local.',
            'Recorrer los murales y tiendas de Ataco.'
        ],
        info: [
            'Mejor época: de noviembre a febrero, cuando florece la ruta.',
            'Lleva un suéter: en la montaña hace más fresco.',
            'Presupuesto aproximado: $20-35 por día.'
        ]
    }
};
