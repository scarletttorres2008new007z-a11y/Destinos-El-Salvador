package sv.destinos.config;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import sv.destinos.comun.LimiteEnvios;
import sv.destinos.galeria.AlmacenFotos;

/**
 * Sirve las páginas del sitio tal como están en la raíz del repositorio, las fotos subidas,
 * y configura CORS y el freno anti-spam de la API.
 */
@Configuration
public class SitioWebConfig implements WebMvcConfigurer {

    /** Solo se entregan archivos de la página; nunca código del backend, configuración ni la carpeta .git. */
    private static final Set<String> EXTENSIONES_PUBLICAS = Set.of(
            "html", "css", "js", "jpg", "jpeg", "png", "webp", "gif", "svg", "ico",
            "mp4", "webm", "woff", "woff2", "ttf", "glb", "gltf");

    private final String carpetaSitio;
    private final AlmacenFotos almacen;
    private final LimiteEnvios limite;
    private final String[] origenes;

    public SitioWebConfig(@Value("${app.sitio.carpeta}") String carpetaSitio,
                          @Value("${app.cors.origenes:}") String[] origenes,
                          AlmacenFotos almacen, LimiteEnvios limite) {
        this.carpetaSitio = comoCarpeta(Path.of(carpetaSitio));
        this.origenes = origenes;
        this.almacen = almacen;
        this.limite = limite;
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addRedirectViewController("/", "/inicio%20el%20salvador.html");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(AlmacenFotos.RUTA_PUBLICA + "**")
                .addResourceLocations(comoCarpeta(almacen.getCarpeta()));

        registry.addResourceHandler("/**")
                .addResourceLocations(carpetaSitio)
                .setCachePeriod(0)
                .resourceChain(false)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String ruta, Resource ubicacion) throws IOException {
                        return esPublica(ruta) ? super.getResource(ruta, ubicacion) : null;
                    }
                });
    }

    /** URI de carpeta con «/» final, aunque la carpeta todavía no exista (la de fotos se crea con la primera subida). */
    private static String comoCarpeta(Path carpeta) {
        String uri = carpeta.toAbsolutePath().normalize().toUri().toString();
        return uri.endsWith("/") ? uri : uri + "/";
    }

    static boolean esPublica(String ruta) {
        String r = ruta.toLowerCase(Locale.ROOT);
        if (r.startsWith("backend/") || r.startsWith("uploads/")) {
            return false;
        }
        for (String parte : r.split("/")) {
            if (parte.startsWith(".")) {
                return false;
            }
        }
        int punto = r.lastIndexOf('.');
        return punto > 0 && EXTENSIONES_PUBLICAS.contains(r.substring(punto + 1));
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if (origenes.length > 0) {
            registry.addMapping("/api/**").allowedOrigins(origenes).allowedMethods("GET", "POST");
        }
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(limite).addPathPatterns("/api/**");
    }
}
