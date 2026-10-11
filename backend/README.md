# Backend de Destinos El Salvador

Java 17 o más nuevo + Spring Boot 3 + MySQL 8. Sirve las páginas del sitio (las de la raíz del repositorio, sin cambios) y una API REST en `/api`.

## Arrancarlo en tu computadora (lo más fácil)

Solo necesitas **Java 17 o más nuevo**, recomendado Java 21 ([descargar](https://adoptium.net/es/temurin/releases/?version=21)). No hace falta instalar MySQL, Docker ni Maven.

1. Haz doble clic en `iniciar-servidor.bat` (en la raíz del proyecto).
2. Espera a que aparezca «Started DestinosApplication». La primera vez tarda unos minutos.
3. Abre http://localhost:8080 en el navegador.

Así usa una base de datos compatible con MySQL guardada en `backend/datos/`. Para apagarlo, cierra la ventana negra.

En Mac o Linux: `cd backend` y luego `./mvnw spring-boot:run -Dspring-boot.run.profiles=local`.

### Ver los datos guardados

Con el servidor encendido, abre http://localhost:8080/h2-console y entra con:

- JDBC URL: `jdbc:h2:file:./datos/destinos;MODE=MySQL;DATABASE_TO_LOWER=TRUE;AUTO_SERVER=TRUE`
- User Name: `sa`, Password: vacío

Luego escribe por ejemplo `SELECT * FROM reservas` y presiona Run. Esta consola solo existe en el modo local.

## Arrancarlo con MySQL de verdad (para publicarlo)

Necesitas Java 17 o más nuevo y Docker Desktop (o un MySQL 8 instalado).

1. En la raíz del repositorio, levanta MySQL: `docker compose up -d`
2. En la carpeta `backend/`: `mvnw.cmd spring-boot:run` (en Mac o Linux, `./mvnw spring-boot:run`)
3. Abre http://localhost:8080

La primera vez, Flyway crea las tablas y carga los 4 paquetes (`src/main/resources/db/migration`).

Si abres las páginas con doble clic (sin servidor), todo sigue funcionando como antes: los formularios ofrecen enviar por correo y las fotos de Galería solo se ven en ese navegador.

## Correos de aviso con Gmail

Cada solicitud, reserva, propuesta o foto nueva manda un aviso a la agencia. Para activarlo, crea una contraseña de aplicación en tu cuenta de Google (Seguridad > Contraseñas de aplicaciones) y arranca con:

```
GMAIL_USUARIO=tu-cuenta@gmail.com GMAIL_CLAVE_APP=xxxxxxxxxxxxxxxx CORREO_AGENCIA=info@svelsalvador.com ./mvnw spring-boot:run
```

En Windows (PowerShell): `$env:GMAIL_USUARIO="..."; $env:GMAIL_CLAVE_APP="..."; .\mvnw.cmd spring-boot:run`

Sin esas variables, todo se guarda igual en MySQL y el aviso solo se anota en la consola.

## Variables de entorno

| Variable | Para qué | Valor por defecto |
| --- | --- | --- |
| `DB_URL` | Conexión a MySQL | `jdbc:mysql://localhost:3306/destinos` |
| `DB_USUARIO`, `DB_CLAVE` | Usuario y contraseña de MySQL | `destinos` / `destinos` (solo para tu computadora) |
| `GMAIL_USUARIO`, `GMAIL_CLAVE_APP` | Cuenta que envía los avisos | vacío (avisos apagados) |
| `CORREO_AGENCIA` | Quién recibe los avisos | `info@svelsalvador.com` |
| `SITIO_CARPETA` | Carpeta con las páginas HTML | `..` (la raíz del repositorio) |
| `UPLOADS_CARPETA` | Dónde se guardan las fotos de visitantes | `uploads` |
| `PUERTO` | Puerto del servidor | `8080` |

## API (fase 1)

| Método | Ruta | Para qué |
| --- | --- | --- |
| GET | `/api/paquetes` | Paquetes de la página de Contacto |
| POST | `/api/contacto` | Formulario «Contáctanos» |
| POST | `/api/reservas` | Formulario de reserva; responde con el código (DES-2026-0001) |
| GET | `/api/reservas/{codigo}?email=` | Consultar una reserva |
| POST | `/api/colaboraciones` | Formulario «Colabora» |
| POST | `/api/galeria/fotos` | Subir fotos (campo `fotos`, hasta 12 de 5 MB, JPG/PNG/WEBP) |
| GET | `/api/galeria/fotos?categoria=` | Fotos de visitantes ya aprobadas |

Los errores de validación responden 400 con `{"mensaje": "...", "errores": {"campo": "..."}}`. Cada formulario acepta hasta 5 envíos por minuto desde la misma dirección.

Las fotos de visitantes quedan en estado `PENDIENTE`. Hasta que llegue el panel de la agencia (fase 2), se aprueban en MySQL:

```sql
UPDATE fotos_galeria SET estado = 'APROBADA', categoria = 'volcanoes' WHERE id = 1;
```

## Pruebas

```
./mvnw test
```

Usan una base de datos H2 en memoria, así que no necesitan MySQL.
