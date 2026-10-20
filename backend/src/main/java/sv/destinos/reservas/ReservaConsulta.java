package sv.destinos.reservas;

import java.time.LocalDate;

/** Lo que ve el visitante al consultar su reserva con el código y su correo. */
public record ReservaConsulta(String codigo, String paquete, LocalDate fechaInicio, LocalDate fechaFin,
                              String personas, String estado) {

    public static ReservaConsulta de(Reserva r) {
        return new ReservaConsulta(r.getCodigo(), r.getPaquete().getNombre(), r.getFechaInicio(),
                r.getFechaFin(), r.getPersonas(), r.getEstado().name());
    }
}
