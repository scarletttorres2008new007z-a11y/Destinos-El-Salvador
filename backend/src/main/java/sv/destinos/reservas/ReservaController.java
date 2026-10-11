package sv.destinos.reservas;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaService servicio;

    public ReservaController(ReservaService servicio) {
        this.servicio = servicio;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservaCreada crear(@Valid @RequestBody ReservaSolicitud solicitud) {
        Reserva r = servicio.crear(solicitud);
        return new ReservaCreada(r.getCodigo(), r.getEstado().name(),
                "Recibimos tu reserva. Te escribiremos para confirmarla.");
    }

    @GetMapping("/{codigo}")
    public ReservaConsulta consultar(@PathVariable String codigo, @RequestParam(defaultValue = "") String email) {
        return servicio.consultar(codigo, email);
    }
}
