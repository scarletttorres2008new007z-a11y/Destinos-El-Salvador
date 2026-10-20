package sv.destinos.galeria;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/**
 * Guarda en disco las fotos que suben los visitantes.
 * El tipo se comprueba por el contenido del archivo, no por su nombre, y se guarda con un nombre nuevo al azar.
 */
@Component
public class AlmacenFotos {

    public static final String RUTA_PUBLICA = "/uploads/galeria/";

    private final Path carpeta;

    public AlmacenFotos(@Value("${app.uploads.carpeta}") String carpeta) {
        this.carpeta = Path.of(carpeta, "galeria").toAbsolutePath().normalize();
    }

    public Path getCarpeta() {
        return carpeta;
    }

    /** Devuelve la extensión (jpg, png o webp) según los primeros bytes, o null si no es una imagen aceptada. */
    public String extensionReal(MultipartFile archivo) {
        byte[] cabecera = new byte[12];
        int leidos;
        try (InputStream in = archivo.getInputStream()) {
            leidos = in.readNBytes(cabecera, 0, cabecera.length);
        } catch (IOException ex) {
            return null;
        }
        if (leidos >= 3 && (cabecera[0] & 0xFF) == 0xFF && (cabecera[1] & 0xFF) == 0xD8 && (cabecera[2] & 0xFF) == 0xFF) {
            return "jpg";
        }
        if (leidos >= 8 && Arrays.equals(Arrays.copyOf(cabecera, 8),
                new byte[] {(byte) 0x89, 'P', 'N', 'G', '\r', '\n', 0x1A, '\n'})) {
            return "png";
        }
        if (leidos == 12 && cabecera[0] == 'R' && cabecera[1] == 'I' && cabecera[2] == 'F' && cabecera[3] == 'F'
                && cabecera[8] == 'W' && cabecera[9] == 'E' && cabecera[10] == 'B' && cabecera[11] == 'P') {
            return "webp";
        }
        return null;
    }

    public String guardar(MultipartFile archivo, String extension) {
        String nombre = UUID.randomUUID() + "." + extension;
        try {
            Files.createDirectories(carpeta);
            try (InputStream in = archivo.getInputStream()) {
                Files.copy(in, carpeta.resolve(nombre), StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException ex) {
            throw new UncheckedIOException("No se pudo guardar la foto", ex);
        }
        return nombre;
    }

    public void borrar(String nombre) {
        try {
            Files.deleteIfExists(carpeta.resolve(nombre));
        } catch (IOException ignorado) {
            // Si no se puede borrar, solo queda un archivo huérfano en la carpeta
        }
    }
}
