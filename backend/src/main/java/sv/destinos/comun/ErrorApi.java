package sv.destinos.comun;

import java.util.Map;

/**
 * Respuesta de error de la API: un mensaje general y, si aplica, el error de cada campo.
 */
public record ErrorApi(String mensaje, Map<String, String> errores) {

    public static ErrorApi de(String mensaje) {
        return new ErrorApi(mensaje, Map.of());
    }
}
