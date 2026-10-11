package sv.destinos.galeria;

/** Foto aprobada tal como la pinta la Galería. */
public record FotoDto(Long id, String titulo, String categoria, String url, String autor, String licencia, String fuente) {

    public static FotoDto de(FotoGaleria f) {
        return new FotoDto(f.getId(), f.getTitulo(), f.getCategoria(), AlmacenFotos.RUTA_PUBLICA + f.getArchivo(),
                f.getAutor(), f.getLicencia(), f.getFuenteUrl());
    }
}
