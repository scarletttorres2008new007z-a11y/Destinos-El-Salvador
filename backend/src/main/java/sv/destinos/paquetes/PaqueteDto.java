package sv.destinos.paquetes;

import java.math.BigDecimal;

/** Datos de un paquete tal como los usa la página de Contacto. Sin precio = «Cotizar». */
public record PaqueteDto(String codigo, String nombre, String etiqueta, Integer dias, Integer noches,
                         BigDecimal precioUsd, String descripcion, String imagenUrl, String creditoFoto) {

    public static PaqueteDto de(Paquete p) {
        return new PaqueteDto(p.getCodigo(), p.getNombre(), p.getEtiqueta(), p.getDias(), p.getNoches(),
                p.getPrecioUsd(), p.getDescripcion(), p.getImagenUrl(), p.getCreditoFoto());
    }
}
