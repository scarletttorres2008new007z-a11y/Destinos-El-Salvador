-- Fase 1: tablas de los formularios de Contacto y de las fotos de Galería.
-- La base de datos se crea con utf8mb4 (ver docker-compose.yml) para aceptar tildes y ñ.

CREATE TABLE paquetes (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo        VARCHAR(40)   NOT NULL UNIQUE,
    nombre        VARCHAR(120)  NOT NULL,
    etiqueta      VARCHAR(60)   NOT NULL,
    dias          INT           NULL,
    noches        INT           NULL,
    precio_usd    DECIMAL(10,2) NULL,
    descripcion   VARCHAR(500)  NOT NULL,
    imagen_url    VARCHAR(255)  NOT NULL,
    credito_foto  VARCHAR(255)  NULL,
    orden         INT           NOT NULL DEFAULT 0,
    activo        BOOLEAN       NOT NULL DEFAULT TRUE,
    creado_en     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservas (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo        VARCHAR(20)   NULL UNIQUE,
    paquete_id    BIGINT        NOT NULL,
    nombre        VARCHAR(120)  NOT NULL,
    email         VARCHAR(180)  NOT NULL,
    telefono      VARCHAR(30)   NOT NULL,
    fecha_inicio  DATE          NOT NULL,
    fecha_fin     DATE          NOT NULL,
    personas      VARCHAR(5)    NOT NULL,
    hospedaje     VARCHAR(30)   NULL,
    comentarios   TEXT          NULL,
    precio_usd    DECIMAL(10,2) NULL,
    estado        VARCHAR(20)   NOT NULL DEFAULT 'PENDIENTE',
    creado_en     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservas_paquete FOREIGN KEY (paquete_id) REFERENCES paquetes (id)
);

CREATE TABLE solicitudes_contacto (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre        VARCHAR(120)  NOT NULL,
    email         VARCHAR(180)  NOT NULL,
    telefono      VARCHAR(30)   NULL,
    pais          VARCHAR(10)   NULL,
    interes       VARCHAR(30)   NOT NULL,
    presupuesto   VARCHAR(30)   NULL,
    fecha_viaje   DATE          NULL,
    duracion      VARCHAR(10)   NULL,
    mensaje       TEXT          NOT NULL,
    estado        VARCHAR(20)   NOT NULL DEFAULT 'NUEVA',
    creado_en     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE colaboraciones (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre        VARCHAR(120)  NOT NULL,
    email         VARCHAR(180)  NOT NULL,
    tipo          VARCHAR(30)   NOT NULL,
    web           VARCHAR(255)  NULL,
    redes         VARCHAR(255)  NULL,
    propuesta     TEXT          NOT NULL,
    estado        VARCHAR(20)   NOT NULL DEFAULT 'NUEVA',
    creado_en     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fotos_galeria (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo          VARCHAR(120)  NOT NULL,
    categoria       VARCHAR(20)   NOT NULL DEFAULT 'all',
    archivo         VARCHAR(80)   NOT NULL UNIQUE,
    autor           VARCHAR(120)  NULL,
    licencia        VARCHAR(40)   NULL,
    fuente_url      VARCHAR(255)  NULL,
    origen          VARCHAR(20)   NOT NULL DEFAULT 'VISITANTE',
    estado          VARCHAR(20)   NOT NULL DEFAULT 'PENDIENTE',
    email_visitante VARCHAR(180)  NULL,
    creado_en       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fotos_estado ON fotos_galeria (estado);
CREATE INDEX idx_reservas_estado ON reservas (estado);
