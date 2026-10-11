package sv.destinos.galeria;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import sv.destinos.comun.AvisoCorreo;
import sv.destinos.comun.DatosInvalidosException;
import sv.destinos.comun.Textos;

@Service
public class GaleriaService {

    /** Mismos límites que la página: 12 fotos por envío y 5 MB por foto. */
    public static final int MAX_FOTOS = 12;
    public static final long MAX_BYTES = 5L * 1024 * 1024;

    private final FotoGaleriaRepository fotos;
    private final AlmacenFotos almacen;
    private final AvisoCorreo aviso;

    public GaleriaService(FotoGaleriaRepository fotos, AlmacenFotos almacen, AvisoCorreo aviso) {
        this.fotos = fotos;
        this.almacen = almacen;
        this.aviso = aviso;
    }

    @Transactional(readOnly = true)
    public List<FotoDto> aprobadas(String categoria) {
        List<FotoGaleria> lista = categoria == null || categoria.isBlank() || categoria.equals("all")
                ? fotos.findByEstadoOrderByCreadoEnDesc(EstadoFoto.APROBADA)
                : fotos.findByEstadoAndCategoriaOrderByCreadoEnDesc(EstadoFoto.APROBADA, categoria);
        return lista.stream().map(FotoDto::de).toList();
    }

    /** Revisa todas las fotos primero: si una no sirve, no se guarda ninguna. */
    @Transactional
    public int recibir(List<MultipartFile> archivos, String email) {
        List<MultipartFile> validos = archivos == null ? List.of()
                : archivos.stream().filter(a -> a != null && !a.isEmpty()).toList();
        if (validos.isEmpty()) {
            throw new DatosInvalidosException("fotos", "Selecciona al menos una foto.");
        }
        if (validos.size() > MAX_FOTOS) {
            throw new DatosInvalidosException("fotos", "Puedes enviar hasta " + MAX_FOTOS + " fotos a la vez.");
        }
        String correo = Textos.limpio(email);
        if (correo != null && (correo.length() > 180 || !correo.matches("[^\\s@]+@[^\\s@]+\\.[^\\s@]+"))) {
            throw new DatosInvalidosException("email", "Escribe un correo válido.");
        }

        List<String> extensiones = new ArrayList<>();
        for (MultipartFile archivo : validos) {
            String nombre = nombreVisible(archivo);
            if (archivo.getSize() > MAX_BYTES) {
                throw new DatosInvalidosException("fotos", "«" + nombre + "» supera el límite de 5 MB por foto.");
            }
            String extension = almacen.extensionReal(archivo);
            if (extension == null) {
                throw new DatosInvalidosException("fotos", "«" + nombre + "» no es un formato válido. Usa JPG, JPEG, PNG o WEBP.");
            }
            extensiones.add(extension);
        }

        List<String> guardados = new ArrayList<>();
        try {
            for (int i = 0; i < validos.size(); i++) {
                MultipartFile archivo = validos.get(i);
                String guardado = almacen.guardar(archivo, extensiones.get(i));
                guardados.add(guardado);

                FotoGaleria foto = new FotoGaleria();
                foto.setTitulo(titulo(archivo));
                foto.setArchivo(guardado);
                foto.setEmailVisitante(correo);
                fotos.save(foto);
            }
        } catch (RuntimeException ex) {
            guardados.forEach(almacen::borrar);
            throw ex;
        }

        aviso.avisar("Fotos nuevas en la Galería (" + validos.size() + ")",
                "Un visitante subió " + validos.size() + " foto(s). Quedan pendientes de revisión."
                        + (correo == null ? "" : "\nCorreo del visitante: " + correo),
                correo == null ? null : correo);
        return validos.size();
    }

    private static String nombreVisible(MultipartFile archivo) {
        String nombre = archivo.getOriginalFilename();
        return nombre == null || nombre.isBlank() ? "La foto" : nombre;
    }

    /** El título es el nombre del archivo sin extensión, como lo muestra la página. */
    private static String titulo(MultipartFile archivo) {
        String nombre = archivo.getOriginalFilename();
        if (nombre == null) {
            return "Foto compartida";
        }
        nombre = nombre.replaceAll("^.*[\\\\/]", "").replaceAll("\\.[^.]+$", "").replaceAll("[\\p{Cntrl}<>]", "").trim();
        if (nombre.isEmpty()) {
            return "Foto compartida";
        }
        return nombre.length() > 120 ? nombre.substring(0, 120) : nombre;
    }
}
