package sv.destinos.comun;

import java.util.Map;

/**
 * Error de validación que no se puede expresar con anotaciones (por ejemplo, comparar dos fechas).
 */
public class DatosInvalidosException extends RuntimeException {

    private final Map<String, String> errores;

    public DatosInvalidosException(String campo, String mensaje) {
        super(mensaje);
        this.errores = Map.of(campo, mensaje);
    }

    public Map<String, String> getErrores() {
        return errores;
    }
}
