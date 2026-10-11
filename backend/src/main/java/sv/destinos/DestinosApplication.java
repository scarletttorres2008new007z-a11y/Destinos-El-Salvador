package sv.destinos;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Servidor de Destinos El Salvador: sirve las páginas del sitio y la API REST en /api.
 */
@SpringBootApplication
@EnableAsync
public class DestinosApplication {

    public static void main(String[] args) {
        // Las fechas de viaje se comparan con el día de hoy en El Salvador
        TimeZone.setDefault(TimeZone.getTimeZone("America/El_Salvador"));
        SpringApplication.run(DestinosApplication.class, args);
    }
}
