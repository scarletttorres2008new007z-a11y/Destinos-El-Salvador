package sv.destinos.galeria;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/galeria/fotos")
public class GaleriaController {

    private final GaleriaService servicio;

    public GaleriaController(GaleriaService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public List<FotoDto> aprobadas(@RequestParam(required = false) String categoria) {
        return servicio.aprobadas(categoria);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> subir(@RequestPart("fotos") List<MultipartFile> fotos,
                                     @RequestParam(required = false) String email) {
        int recibidas = servicio.recibir(fotos, email);
        return Map.of(
                "recibidas", recibidas,
                "mensaje", recibidas == 1
                        ? "Recibimos tu foto. Aparecerá en la galería para todos cuando la agencia la revise."
                        : "Recibimos tus " + recibidas + " fotos. Aparecerán en la galería para todos cuando la agencia las revise.");
    }
}
