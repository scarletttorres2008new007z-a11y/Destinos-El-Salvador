# Destinos El Salvador

Sitio web estático de turismo. Son páginas HTML, CSS y JavaScript sin
librerías ni compilación: se abre `index.html` con doble clic o se sube
la carpeta tal cual a cualquier hosting.

## Estructura

```
index.html            Inicio
destinos.html         Destinos, buscador y expedientes secretos
cultura.html          Museo virtual
galeria.html          Galería de fotos y videos
contacto.html         Contacto, reservas, colaboraciones y preguntas
nosotros.html         Sobre nosotros

css/
  base.css            Reinicio, variables (colores, sombras, radios) e iconos
  layout.css          Menú, pie de página, secciones y botones flotantes
  componentes.css     Piezas que se repiten: tarjetas, ventanas, contacto rápido
  formularios.css     Campos, filtros y rejillas
  adaptable.css       Ajustes para tableta y móvil (se carga al final)
  paginas/            Un archivo por página (destinos.css + expedientes.css en Destinos)

js/
  nucleo/             Base que usan todas las páginas
    iconos.js         Todos los iconos del sitio, con nombre
    utilidades.js     Funciones pequeñas: antirrebote, escaparHtml, foco...
  componentes/        Comportamientos que se reutilizan
    navegacion.js     Menú móvil, enlace activo y desplazamiento suave
    contacto-rapido.js  Ventana del botón flotante (WhatsApp, correo, teléfono)
    boton-subir.js    Botón para volver arriba
    ventana.js        Ventana emergente accesible (abrir, cerrar, Escape)
    formulario.js     Validación y envío por correo de los formularios
  datos/              Solo contenido, sin lógica
  paginas/            Un archivo por página; cada uno se ejecuta solo

img/                  Fotos del sitio (créditos en CREDITOS.md)
```

## Cómo se cargan los archivos

Cada página carga los CSS en este orden: `base`, `layout`, `componentes`,
`formularios`, el de la página y `adaptable`.

Los scripts van al final del `<body>`: primero los compartidos
(`nucleo/` y `componentes/`), luego los datos y por último el script de
la página. No se usan módulos (`import`) para que el sitio funcione
también al abrirlo con doble clic (`file://`).

## Convenciones

- Nombres de archivos, funciones, variables y comentarios en español.
- Colores siempre con las variables de `css/base.css` (`--azul`,
  `--naranja`, `--celeste`, `--blanco`...). Colores sólidos, sin gradientes.
- Sin estilos ni scripts dentro del HTML.
- Los nombres de clase que ya existían se conservaron para no cambiar el
  diseño; las clases nuevas están en español.

## Tareas comunes

**Usar un icono.** En HTML:

```html
<svg class="icono" width="20" height="20" aria-hidden="true"><use href="#icono-telefono"></use></svg>
```

En JavaScript: `icono('telefono', 20)`.

**Agregar un icono.** Añade una entrada a `ICONOS` en `js/nucleo/iconos.js`.
Los números del dibujo son coordenadas en una cuadrícula de 24 × 24.

**Agregar una experiencia, un expediente, una pieza del museo o un
integrante del equipo.** Edita el archivo correspondiente en `js/datos/`;
no hace falta tocar la lógica.

**Agregar una página.** Copia una página existente, crea su CSS en
`css/paginas/` y su script en `js/paginas/`, y añade el enlace al menú de
todas las páginas.
