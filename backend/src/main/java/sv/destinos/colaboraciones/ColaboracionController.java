package sv.destinos.colaboraciones;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/colaboraciones")
public class ColaboracionController {

    private final ColaboracionService servicio;

    public ColaboracionController(ColaboracionService servicio) {
        this.servicio = servicio;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> crear(@Valid @RequestBody ColaboracionSolicitud solicitud) {
        servicio.crear(solicitud);
        return Map.of("mensaje", "Recibimos tu propuesta. La revisaremos y te responderemos por correo.");
    }
}
