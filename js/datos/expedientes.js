/* =====================================================================
   Datos: El Salvador oculto, expedientes secretos (página Destinos)
   Para agregar un expediente nuevo basta con añadir un objeto a
   EXPEDIENTES siguiendo la misma estructura: la portada, las pestañas,
   las pistas, el mapa y el desafío se generan automáticamente.
   Las fotografías se guardan en img/expedientes/ y sus créditos en CREDITOS.md.
   ===================================================================== */

const EXPEDIENTES_MAPA = {
    src: 'img/expedientes/mapa-relieve-el-salvador.jpg',
    // Límites geográficos del mapa de relieve (grados decimales)
    norte: 14.6, sur: 13.0, oeste: -90.2, este: -87.6,
    credito: 'Mapa: Carport, a partir de datos de NordNordWest (CC BY-SA 3.0), Wikimedia Commons',
    fuente: 'https://commons.wikimedia.org/wiki/File:El_Salvador_relief_location_map.jpg'
};

const EXPEDIENTES = [
    {
        id: 'ceren',
        numero: '001',
        titulo: 'El pueblo que quedó enterrado',
        lugar: 'Joya de Cerén',
        clasificacion: ['Arqueología', 'Vulcanología'],
        portada: {
            src: 'img/expedientes/ceren-portada.jpg',
            alt: 'Estructuras 12 y 10 del sitio arqueológico Joya de Cerén bajo su techo de protección'
        },
        intro: 'Una aldea agrícola quedó sepultada bajo ceniza volcánica hacia el año 600 d. C. y conservó, casi intacta, la vida diaria de sus habitantes.',
        ficha: [
            ['Ubicación', 'San Juan Opico, La Libertad'],
            ['Periodo', 'Clásico, hacia el 600 d. C.'],
            ['Descubrimiento', '1976'],
            ['Protección', 'Patrimonio Mundial de la UNESCO desde 1993']
        ],
        contexto: [
            'Joya de Cerén era una pequeña comunidad agrícola prehispánica del valle de Zapotitán. Hacia el año 600 d. C., la erupción del volcán Loma Caldera, que se abrió a pocos cientos de metros de la aldea, la cubrió con varios metros de ceniza y material volcánico.',
            'En 1976, una máquina que nivelaba el terreno para un proyecto agrícola dejó al descubierto una construcción de tierra. Dos años después, el arqueólogo Payson Sheets, de la Universidad de Colorado, inició las primeras exploraciones, y desde 1988 las investigaciones han continuado casi sin interrupción.',
            'A diferencia de los grandes centros ceremoniales, Joya de Cerén no muestra palacios ni pirámides, sino casas, bodegas, cocinas, cultivos y objetos de uso cotidiano. Por eso la UNESCO la inscribió en 1993 como Patrimonio Mundial: permite conocer cómo vivían las familias campesinas de Centroamérica en esa época.'
        ],
        nota: 'La ceniza no destruyó la aldea: la selló. Gracias a ello se conservaron huellas de plantas, vasijas con alimentos y hasta los surcos de los cultivos.',
        evidencias: [
            {
                src: 'img/expedientes/ceren-estructura-11.jpg',
                alt: 'Estructura 11 de Joya de Cerén con las capas de ceniza visibles en la pared de la excavación',
                titulo: 'Estructura 11 y las capas de ceniza',
                descripcion: 'En las paredes de la excavación se distinguen las capas de material volcánico que cubrieron la aldea.',
                autor: 'Mario Roberto Durán Ortiz (Mariordo)', licencia: 'CC BY-SA 3.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:ES_Joya_Ceren_05_2012_Estructura_11_Area_1_1505.jpg'
            },
            {
                src: 'img/expedientes/ceren-temazcal.jpg',
                alt: 'Estructura 9 de Joya de Cerén, un baño de vapor o temazcal con cúpula de tierra',
                titulo: 'Estructura 9: el temazcal',
                descripcion: 'Baño de vapor comunitario con cúpula de tierra, uno de los edificios mejor conservados del sitio.',
                autor: 'Mario Roberto Durán Ortiz (Mariordo)', licencia: 'CC BY-SA 3.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:ES_Joya_Ceren_05_2012_Estructura_9_Area_2_Tamazcal_1478.JPG'
            },
            {
                src: 'img/expedientes/ceren-estructura-12.jpg',
                alt: 'Estructura 12 de Joya de Cerén con ventanas de celosía',
                titulo: 'Estructura 12: un edificio especial',
                descripcion: 'Tiene una puerta y ventanas de celosía que controlaban el paso. Los objetos hallados en su interior llevaron a interpretarlo como un lugar de uso ritual.',
                autor: 'Mario Roberto Durán Ortiz (Mariordo)', licencia: 'CC BY-SA 3.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:ES_Estructura_12_Area_1_Joya_Ceren_05_2012_1515.jpg'
            },
            {
                src: 'img/expedientes/ceren-estructura-3.jpg',
                alt: 'Estructura 3 del área 3 de Joya de Cerén, una construcción de tierra sobre plataforma',
                titulo: 'Estructura 3: un edificio comunitario',
                descripcion: 'Construcción de tierra sobre plataforma, en el área 3 del sitio.',
                autor: 'Mario Roberto Durán Ortiz (Mariordo)', licencia: 'CC BY-SA 3.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:ES_Joya_Ceren_05_2012_Estructura_3_Area_3_1469.jpg'
            }
        ],
        pistas: [
            {
                titulo: 'Ninguna víctima encontrada',
                texto: 'Hasta hoy no se han recuperado restos humanos en el sitio. En un camino de tierra blanca (sacbé) se registraron decenas de huellas, y más de la mitad se dirigen hacia el sur, lejos de la aldea.'
            },
            {
                titulo: 'Una despensa intacta',
                texto: 'Las excavaciones encontraron vasijas con frijoles, petates para dormir, herramientas de jardín, milpas, huertos de hierbas y agave y árboles frutales como guayabo y cacao.'
            },
            {
                titulo: 'Campos de yuca bajo la ceniza',
                texto: 'En 2007 se identificaron camas de cultivo de yuca, cosechadas poco antes de la erupción. Es una de las primeras evidencias arqueológicas de campos de yuca en América.'
            },
            {
                titulo: 'La estación del año',
                texto: 'El estado de las plantas, los frijoles almacenados y el maíz maduro sugieren que la erupción ocurrió entre agosto y septiembre, durante la estación lluviosa.'
            },
            {
                titulo: 'Edificios con funciones distintas',
                texto: 'La UNESCO registra 18 estructuras identificadas, 10 de ellas excavadas total o parcialmente: viviendas, bodegas, cocinas, edificios comunitarios, construcciones religiosas y un temazcal.'
            }
        ],
        sabemos: {
            hechos: [
                'La aldea fue sepultada por la erupción del volcán Loma Caldera, hacia el año 600 d. C.',
                'La ceniza conservó materiales que rara vez sobreviven: plantas, alimentos, petates y herramientas.',
                'No se han encontrado restos humanos en las excavaciones.',
                'Es Patrimonio Mundial de la UNESCO desde 1993.'
            ],
            debate: [
                'La fecha exacta de la erupción varía según el método de datación; la UNESCO la sitúa hacia el año 600 d. C.',
                'La época del año (agosto o septiembre) se deduce del estado de las plantas y los cultivos, no de un registro escrito.'
            ],
            interpretaciones: [
                'Que los habitantes lograron huir se interpreta a partir de la ausencia de restos humanos y de las huellas que se alejan de la aldea.',
                'La función ritual de la Estructura 12 se propone por los objetos encontrados en ella, como figurillas, conchas y astas de venado.'
            ],
            leyendas: [
                'El apodo «la Pompeya de América» es una comparación divulgativa: a diferencia de Pompeya, en Joya de Cerén no se han encontrado víctimas.'
            ]
        },
        fuentes: [
            { texto: 'UNESCO, Centro del Patrimonio Mundial. «Joya de Cerén Archaeological Site» (n.º 675).', url: 'https://whc.unesco.org/es/list/675/' },
            { texto: 'Sheets, P. y Dixon, C. «Joya de Cerén: An Intimate Portrait of the Ancient Maya». Popular Archaeology.', url: 'https://popular-archaeology.com/article/joya-de-ceren-an-intimate-portrait-of-the-ancient-maya/' },
            { texto: 'Sheets, P. (2006). The Cerén Site: An Ancient Village Buried by Volcanic Ash in Central America. 2.ª ed. Thomson Wadsworth.' }
        ],
        ubicacion: {
            lat: 13.8275, lon: -89.3561,
            referencia: 'Cantón Joya de Cerén, San Juan Opico, departamento de La Libertad. A unos 36 km al noroeste de San Salvador.',
            relacionados: [
                { id: 'ilopango', texto: 'Siglos antes, la ceniza de la erupción de Ilopango también cubrió el valle de Zapotitán, donde se encuentra Joya de Cerén.' }
            ]
        },
        desafio: {
            pregunta: '¿Qué evidencia permite pensar que los habitantes de Joya de Cerén alcanzaron a huir de la erupción?',
            opciones: [
                { texto: 'No se han encontrado restos humanos y hay huellas que se alejan de la aldea.', correcta: true,
                  explicacion: 'Correcto. Es una interpretación basada en evidencia: la ausencia de restos humanos y las huellas registradas en el sacbé, que en su mayoría se dirigen hacia el sur.' },
                { texto: 'Documentos escritos de la época describen la evacuación.', correcta: false,
                  explicacion: 'No es así. No existe ningún documento escrito sobre la erupción; todo lo que sabemos proviene de la arqueología y la vulcanología.' },
                { texto: 'La aldea fue reconstruida en el mismo lugar después de la erupción.', correcta: false,
                  explicacion: 'Incorrecto. La aldea quedó sepultada y no fue reconstruida; justamente por eso se conservó hasta su descubrimiento en 1976.' },
                { texto: 'La ceniza era tan fina que no llegó a cubrir las casas.', correcta: false,
                  explicacion: 'Incorrecto. Varias capas de ceniza y material volcánico, de varios metros de espesor, cubrieron por completo las construcciones.' }
            ]
        }
    },
    {
        id: 'ilopango',
        numero: '002',
        titulo: 'El origen de un paisaje',
        lugar: 'Lago de Ilopango',
        clasificacion: ['Geología', 'Vulcanología'],
        portada: {
            src: 'img/expedientes/ilopango-portada.jpg',
            alt: 'Vista de la caldera del lago de Ilopango desde la carretera panorámica'
        },
        intro: 'Este lago ocupa la caldera de un volcán que, en el siglo V, protagonizó una de las mayores erupciones de los últimos milenios en Centroamérica.',
        ficha: [
            ['Ubicación', 'Entre San Salvador, La Paz y Cuscatlán'],
            ['Tipo', 'Lago en una caldera volcánica'],
            ['Superficie', 'Unos 70 km² (8 × 11 km)'],
            ['Última erupción', '1879-1880']
        ],
        contexto: [
            'El lago de Ilopango, al este de San Salvador, no ocupa un valle común: llena una caldera, una gran depresión que se forma cuando el terreno se hunde tras el vaciado de una cámara de magma durante erupciones muy grandes. Sus paredes se elevan entre 100 y 500 metros sobre el agua.',
            'La caldera se formó y se modificó a lo largo de muchas erupciones. La más reciente de gran tamaño es conocida por los geólogos como Tierra Blanca Joven (TBJ), por los depósitos claros que dejó en buena parte del centro de El Salvador.',
            'Mucho después, entre el 31 de diciembre de 1879 y marzo de 1880, el volcán tuvo su única erupción con registro histórico: tras semanas de sismos, un domo de lava emergió en el centro del lago. Sus restos son hoy las Islas Quemadas.'
        ],
        nota: 'La pregunta abierta del caso no es si la erupción TBJ ocurrió, sino cuándo exactamente: dos equipos de investigación proponen fechas distintas.',
        evidencias: [
            {
                src: 'img/expedientes/ilopango-caldera-aerea.jpg',
                alt: 'Vista aérea de la caldera de Ilopango llena por el lago, con depósitos claros en primer plano',
                titulo: 'La caldera desde el aire',
                descripcion: 'La caldera de 8 × 11 km vista desde el este-sureste. En primer plano se ven exposiciones claras de la formación Tierra Blanca Joven.',
                autor: 'Lee Siebert, Smithsonian Institution (Global Volcanism Program)', licencia: 'Dominio público',
                licenciaUrl: '',
                fuente: 'https://commons.wikimedia.org/wiki/File:Ilopango_caldera.jpg'
            },
            {
                src: 'img/expedientes/ilopango-islas-quemadas.jpg',
                alt: 'Islotes rocosos de las Islas Quemadas en el lago de Ilopango',
                titulo: 'Las Islas Quemadas',
                descripcion: 'Islotes que marcan la cima de un domo de lava, en su mayor parte sumergido, formado en la erupción de 1879-1880.',
                autor: 'JMRAFFi', licencia: 'CC BY-SA 4.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:Ilopango_Isla_quemada.jpg'
            },
            {
                src: 'img/expedientes/ilopango-san-vicente.jpg',
                alt: 'Panorámica con el lago de Ilopango y el volcán de San Vicente al fondo',
                titulo: 'Un paisaje volcánico',
                descripcion: 'El lago de Ilopango con el volcán de San Vicente (Chichontepec) al fondo.',
                autor: 'Arne Müseler', licencia: 'CC BY-SA 3.0 DE',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/de/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:El-salvador_san-salvador_Lago_de_Ilopango_volc%C3%A1n_de_San_Vicente_Chichontepec.JPG'
            }
        ],
        pistas: [
            {
                titulo: 'Una fecha escrita en el hielo',
                texto: 'En un núcleo de hielo de Groenlandia (TUNU2013), a más de 7000 km, se hallaron partículas de vidrio volcánico que coinciden con la ceniza de Ilopango. Esa capa permitió fechar la erupción en el año 431 d. C., con un margen de ± 2 años.'
            },
            {
                titulo: 'Los anillos de un árbol',
                texto: 'La datación por radiocarbono de los anillos de un árbol de caoba sepultado por la erupción dio un rango de 425 a 440 d. C., coherente con la fecha del hielo.'
            },
            {
                titulo: 'Ceniza sobre dos millones de km²',
                texto: 'Según el estudio publicado en 2020, cerca de 2 millones de km² recibieron más de medio centímetro de ceniza en pocos días, y la columna eruptiva alcanzó unos 45 km de altura.'
            },
            {
                titulo: 'Un territorio inhabitable',
                texto: 'Las corrientes de material volcánico llegaron a unos 50 km del volcán y dejaron depósitos de hasta 70 m en valles cercanos. Las zonas a menos de unos 80 km quedaron inhabitables durante años o décadas.'
            },
            {
                titulo: 'Islas que nacieron en 1880',
                texto: 'En enero de 1880 el nivel del lago subió y el desagüe por el río Jiboa inundó el valle. El 23 de enero un domo de lava rompió la superficie del agua y llegó a unos 50 m de altura antes de que explosiones posteriores destruyeran gran parte de él.'
            }
        ],
        sabemos: {
            hechos: [
                'El lago ocupa una caldera formada y modificada por varias erupciones de gran tamaño.',
                'La erupción Tierra Blanca Joven fue de índice de explosividad volcánica (VEI) 6, una de las mayores del Holoceno en Centroamérica.',
                'Sus depósitos cubren buena parte del centro y occidente de El Salvador.',
                'La erupción de 1879-1880 formó el domo cuyos restos son las Islas Quemadas.'
            ],
            debate: [
                'Fecha: un estudio de 2019 (Dull y colaboradores) propuso el año 539-540 d. C. y la relacionó con un enfriamiento global de esa época. Un estudio de 2020 (Smith y colaboradores) propone el 431 ± 2 d. C. a partir del hielo de Groenlandia y los anillos de árboles.',
                'El volumen expulsado es una estimación: entre 50 y 95 km³ de magma según el estudio de 2020.'
            ],
            interpretaciones: [
                'El impacto sobre las poblaciones mayas cercanas fue grave en un radio de decenas de kilómetros, pero en las tierras bajas mayas, a más de 450 km, la ceniza fue de apenas milímetros.',
                'La relación de la erupción con cambios sociales de la región se sigue investigando; no hay pruebas de que provocara por sí sola el colapso de ninguna civilización.'
            ],
            leyendas: []
        },
        fuentes: [
            { texto: 'Smith, V. C. et al. (2020). «The magnitude and impact of the 431 CE Tierra Blanca Joven eruption of Ilopango, El Salvador». PNAS 117 (42): 26061-26068.', url: 'https://doi.org/10.1073/pnas.2003008117' },
            { texto: 'Dull, R. A. et al. (2019). «Radiocarbon and geologic evidence reveal Ilopango volcano as source of the colossal "mystery" eruption of 539/40 CE». Quaternary Science Reviews 222: 105855.', url: 'https://doi.org/10.1016/j.quascirev.2019.07.037' },
            { texto: 'Smithsonian Institution, Global Volcanism Program. «Ilopango» (343060).', url: 'https://volcano.si.edu/volcano.cfm?vn=343060' }
        ],
        ubicacion: {
            lat: 13.672, lon: -89.053,
            referencia: 'Al este de San Salvador, entre los departamentos de San Salvador, La Paz y Cuscatlán.',
            relacionados: [
                { id: 'tazumal', texto: 'Bajo la ceniza de esta erupción, en Tazumal y Casa Blanca (Chalchuapa, a unos 75 km), se hallaron objetos con influencia de Teotihuacan.' },
                { id: 'ceren', texto: 'La ceniza también cubrió el valle de Zapotitán, donde siglos después se levantó la aldea de Joya de Cerén.' }
            ]
        },
        desafio: {
            pregunta: '¿Qué son las Islas Quemadas del lago de Ilopango?',
            opciones: [
                { texto: 'La cima de un domo de lava que surgió en la erupción de 1879-1880.', correcta: true,
                  explicacion: 'Correcto. El domo emergió del lago el 23 de enero de 1880; los islotes son la parte que hoy sobresale del agua.' },
                { texto: 'Los restos de una aldea prehispánica incendiada.', correcta: false,
                  explicacion: 'Incorrecto. Su nombre puede sugerirlo, pero son formaciones de roca volcánica, no restos arqueológicos.' },
                { texto: 'Islas formadas por la gran erupción Tierra Blanca Joven del siglo V.', correcta: false,
                  explicacion: 'Incorrecto. Esa erupción formó la caldera, pero las Islas Quemadas se originaron casi 1450 años después, en 1880.' },
                { texto: 'Rocas arrastradas al lago por el río Jiboa.', correcta: false,
                  explicacion: 'Incorrecto. El río Jiboa es el desagüe del lago; las islas se formaron por lava que salió desde el fondo.' }
            ]
        }
    },
    {
        id: 'tazumal',
        numero: '003',
        titulo: 'Las huellas de una civilización',
        lugar: 'Tazumal',
        clasificacion: ['Arqueología'],
        portada: {
            src: 'img/expedientes/tazumal-portada.jpg',
            alt: 'Lado oeste de la pirámide principal de Tazumal, estructura B1-1, en Chalchuapa'
        },
        intro: 'En Chalchuapa, las estructuras de Tazumal guardan siglos de construcción y objetos que conectan a El Salvador con otras regiones de Mesoamérica.',
        ficha: [
            ['Ubicación', 'Chalchuapa, Santa Ana'],
            ['Periodo', 'Clásico y Posclásico temprano'],
            ['Estructura principal', 'B1-1, plataforma de 73 × 87 m'],
            ['Excavación inicial', 'Stanley Boggs, desde 1942']
        ],
        contexto: [
            'Tazumal forma parte de la zona arqueológica de Chalchuapa, en el departamento de Santa Ana, a unos 80 km al oeste de San Salvador. Esta zona tuvo ocupación humana durante unos 3500 años, desde alrededor del 1500 a. C.',
            'El conjunto de Tazumal fue habitado durante el periodo Clásico y el Posclásico temprano. Su secuencia de cerámica continúa sin interrupción hasta cerca del año 1200 d. C. La estructura principal, conocida como B1-1, se levanta sobre una plataforma de unos 73 por 87 metros; junto a ella se construyó la estructura B1-2 en el Posclásico temprano (900-1200 d. C.).',
            'El arqueólogo Stanley Boggs excavó y restauró las estructuras principales a partir de 1942. Las restauraciones con cemento de mediados del siglo XX se convirtieron después en un problema de conservación.'
        ],
        nota: 'El nombre «Tazumal» proviene de la finca donde se encontraron las estructuras principales; no es el nombre que le dieron sus constructores.',
        evidencias: [
            {
                src: 'img/expedientes/tazumal-estructura-1.jpg',
                alt: 'Escalinatas y cuerpos escalonados de la estructura principal de Tazumal',
                titulo: 'La estructura principal',
                descripcion: 'Cuerpos escalonados y escalinatas de la estructura B1-1, el edificio más grande del sitio.',
                autor: 'Cam Ventoza', licencia: 'CC BY-SA 3.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:Ruinas_del_Tazumal.JPG'
            },
            {
                src: 'img/expedientes/tazumal-reconstruccion-b1-2.jpg',
                alt: 'Ilustración de cómo pudo verse la estructura B1-2 de Tazumal en el Posclásico temprano',
                titulo: 'Ilustración: la estructura B1-2',
                descripcion: 'Reconstrucción hipotética de la estructura B1-2 en su fase 3B (Posclásico temprano), basada en dibujos y estudios arqueológicos. Es una interpretación, no una fotografía.',
                autor: 'Juan Miguel', licencia: 'CC BY-SA 3.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:Tazumal_estructura_B1-2-3B.png'
            },
            {
                src: 'img/expedientes/tazumal-restauracion.jpg',
                alt: 'Personas trabajando sobre la pirámide de Tazumal durante trabajos de restauración en 2005',
                titulo: 'Trabajos de restauración (2005)',
                descripcion: 'Trabajos sobre la pirámide tras el derrumbe de 2004, cuando se revisaron las antiguas restauraciones con cemento.',
                autor: 'Jose Huwaidi', licencia: 'CC BY-SA 4.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:Archeologists_on_a_piramid-Tazumal_restaurando.jpg'
            },
            {
                src: 'img/expedientes/tazumal-museo.jpg',
                alt: 'Sala del museo de sitio de Tazumal con vitrinas y una escultura',
                titulo: 'Museo de sitio',
                descripcion: 'El museo del parque arqueológico exhibe piezas halladas en Tazumal y en la zona de Chalchuapa.',
                autor: 'Orlando Salvador Flores Castaneda', licencia: 'CC BY-SA 3.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:Interior_del_Museo_del_Tazumal.jpg'
            }
        ],
        pistas: [
            {
                titulo: 'Objetos que viajaron',
                texto: 'Artefactos de obsidiana verde encontrados en Tazumal indican vínculos con el centro de México, y adornos de oro apuntan a contactos con el sur de Centroamérica.'
            },
            {
                titulo: 'Cerámica de Nicoya y primeros metales',
                texto: 'En Tazumal y en la zona de Chalchuapa se han registrado cerámicas de la región de Nicoya y algunos de los trabajos en metal más antiguos del área.'
            },
            {
                titulo: 'Debajo de la ceniza',
                texto: 'Bajo la ceniza de la erupción de Ilopango (siglo V) se hallaron en Tazumal y Casa Blanca objetos con influencia de Teotihuacan, la gran ciudad del centro de México.'
            },
            {
                titulo: 'Construido por etapas',
                texto: 'La estructura B1-2 se añadió en el Posclásico temprano (900-1200 d. C.), cuando la estructura principal ya había dejado de usarse a finales del periodo Clásico.'
            },
            {
                titulo: 'Un derrumbe revelador',
                texto: 'En octubre de 2004 se derrumbó parte de una de las estructuras restauradas con cemento. El cemento había convertido el edificio en una trampa de agua, y las raíces de árboles cercanos aumentaron el daño. Las excavaciones posteriores revelaron características originales.'
            }
        ],
        sabemos: {
            hechos: [
                'Tazumal es parte de la zona arqueológica de Chalchuapa, con una ocupación de miles de años.',
                'Su secuencia de cerámica continúa sin interrupción desde el Clásico hasta cerca del 1200 d. C.',
                'Las restauraciones con cemento de mediados del siglo XX dañaron las estructuras y obligaron a nuevas intervenciones tras 2004.'
            ],
            debate: [
                'La influencia de Teotihuacan y, más tarde, del centro de México se deduce del estilo de los objetos; los investigadores discuten si se debió a comercio, alianzas o presencia de grupos foráneos.'
            ],
            interpretaciones: [
                'Los objetos de otras regiones se interpretan como prueba de redes de intercambio de larga distancia en las que participaba Chalchuapa.',
                'Las ilustraciones de cómo se veían las estructuras son reconstrucciones basadas en evidencia, no imágenes exactas del pasado.'
            ],
            leyendas: [
                'Con frecuencia se repite que «Tazumal» significa en lengua quiché «pirámide donde fueron quemadas las víctimas». No hay fuentes que lo confirmen: el nombre viene de la finca donde se hallaron las estructuras.'
            ]
        },
        fuentes: [
            { texto: 'Erquicia, J. H. (2007). «Los Gavilanes: un sitio del Posclásico temprano en la zona arqueológica de Chalchuapa, El Salvador». XX Simposio de Investigaciones Arqueológicas en Guatemala, pp. 854-867.', url: 'https://www.mesoweb.com/Simposio/pdf/20/Erquicia.2007.pdf' },
            { texto: 'Smith, V. C. et al. (2020). «The magnitude and impact of the 431 CE Tierra Blanca Joven eruption of Ilopango, El Salvador». PNAS 117 (42).', url: 'https://doi.org/10.1073/pnas.2003008117' },
            { texto: 'Wikipedia. «Tazumal» (síntesis con referencias a publicaciones arqueológicas).', url: 'https://es.wikipedia.org/wiki/Tazumal' }
        ],
        ubicacion: {
            lat: 13.9794, lon: -89.6742,
            referencia: 'Chalchuapa, departamento de Santa Ana. A unos 80 km al oeste de San Salvador.',
            relacionados: [
                { id: 'ilopango', texto: 'La ceniza de la erupción de Ilopango llegó hasta Chalchuapa y selló objetos del periodo Clásico temprano.' }
            ]
        },
        desafio: {
            pregunta: '¿Qué sugieren objetos hallados en Tazumal como la obsidiana verde, los adornos de oro y la cerámica de Nicoya?',
            opciones: [
                { texto: 'Que Chalchuapa mantenía contactos e intercambios con otras regiones de Mesoamérica y Centroamérica.', correcta: true,
                  explicacion: 'Correcto. Estos materiales proceden de otras regiones o imitan sus estilos, por lo que se interpretan como evidencia de redes de intercambio de larga distancia.' },
                { texto: 'Que todos los objetos se fabricaban con materiales del lugar.', correcta: false,
                  explicacion: 'Incorrecto. Precisamente su valor como evidencia es que provienen de otras regiones, como el centro de México o el sur de Centroamérica.' },
                { texto: 'Que el sitio estuvo deshabitado durante el periodo Clásico.', correcta: false,
                  explicacion: 'Incorrecto. Tazumal fue habitado durante el Clásico y el Posclásico temprano, con una secuencia de cerámica sin interrupciones.' },
                { texto: 'Que las estructuras se construyeron en el siglo XX.', correcta: false,
                  explicacion: 'Incorrecto. En el siglo XX se excavaron y restauraron, pero fueron construidas hace más de mil años.' }
            ]
        }
    }
];

const EXPEDIENTE_SECCIONES = [
    { id: 'contexto', titulo: 'Contexto del caso' },
    { id: 'evidencias', titulo: 'Evidencias' },
    { id: 'pistas', titulo: 'Las pistas' },
    { id: 'sabemos', titulo: 'Lo que sabemos' },
    { id: 'ubicacion', titulo: 'Ubicación' },
    { id: 'desafio', titulo: 'Desafío' }
];
