-- Los 4 paquetes que hoy muestra la página de Contacto.
INSERT INTO paquetes (codigo, nombre, etiqueta, dias, noches, precio_usd, descripcion, imagen_url, credito_foto, orden) VALUES
('aventura', 'Aventura Completa', 'Naturaleza', 5, 4, 299.00,
 'Volcanes, senderos y miradores para quienes buscan acción al aire libre.',
 'img/contacto/paquetes/volcan-santa-ana.jpg', 'Foto: Erneestoo, CC BY-SA 4.0', 1),
('cultura', 'Cultura & Historia', 'Cultura', 3, 2, 199.00,
 'Pueblos coloniales, sitios arqueológicos y tradiciones salvadoreñas.',
 'img/contacto/paquetes/suchitoto.jpg', 'Foto: Koky2013, CC BY-SA 3.0', 2),
('surf', 'Surf Paradise', 'Playa', 7, 6, 399.00,
 'Una semana entre las mejores olas del Pacífico y atardeceres en la costa.',
 'img/contacto/paquetes/playa-el-tunco.jpg', 'Foto: William Adach, CC BY-SA 2.0', 3),
('personalizado', 'Personalizado', 'A tu medida', NULL, NULL, NULL,
 'Armamos el recorrido según tus fechas, intereses y presupuesto.',
 'img/contacto/paquetes/laguna-verde.jpg', 'Foto: ElmerGuevara, CC BY-SA 4.0', 4);
