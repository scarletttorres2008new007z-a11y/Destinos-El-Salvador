package sv.destinos.comun;

/** Utilidades pequeñas para limpiar lo que llega de los formularios. */
public final class Textos {

    private Textos() {
    }

    /** Quita espacios sobrantes y convierte el texto vacío en null. */
    public static String limpio(String valor) {
        if (valor == null) {
            return null;
        }
        String texto = valor.trim();
        return texto.isEmpty() ? null : texto;
    }

    /** Para el cuerpo de los correos: muestra un guion cuando no hay dato. */
    public static String oGuion(Object valor) {
        return valor == null || valor.toString().isBlank() ? "-" : valor.toString();
    }
}
