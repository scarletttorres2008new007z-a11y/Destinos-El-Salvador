package sv.destinos.paquetes;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/paquetes")
public class PaqueteController {

    private final PaqueteRepository paquetes;

    public PaqueteController(PaqueteRepository paquetes) {
        this.paquetes = paquetes;
    }

    @GetMapping
    public List<PaqueteDto> listar() {
        return paquetes.findByActivoTrueOrderByOrdenAsc().stream().map(PaqueteDto::de).toList();
    }
}
