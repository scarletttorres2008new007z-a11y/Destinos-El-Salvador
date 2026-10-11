package sv.destinos.reservas;

/** Respuesta al crear una reserva: el código que el visitante guarda para consultarla. */
public record ReservaCreada(String codigo, String estado, String mensaje) {
}
