package sv.destinos;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Files;
import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import sv.destinos.galeria.AlmacenFotos;
import sv.destinos.galeria.EstadoFoto;
import sv.destinos.galeria.FotoGaleria;
import sv.destinos.galeria.FotoGaleriaRepository;
import sv.destinos.reservas.ReservaRepository;

@SpringBootTest
@AutoConfigureMockMvc
class ApiTest {

    private static final byte[] PNG = {(byte) 0x89, 'P', 'N', 'G', '\r', '\n', 0x1A, '\n', 0, 0, 0, 13};

    @Autowired
    MockMvc mvc;

    @Autowired
    ReservaRepository reservas;

    @Autowired
    FotoGaleriaRepository fotos;

    @Autowired
    AlmacenFotos almacen;

    private static String manana() {
        return LocalDate.now().plusDays(1).toString();
    }

    @Test
    void listaLosCuatroPaquetes() throws Exception {
        mvc.perform(get("/api/paquetes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].codigo").value("aventura"))
                .andExpect(jsonPath("$[0].precioUsd").value(299.0))
                .andExpect(jsonPath("$[3].precioUsd").doesNotExist());
    }

    @Test
    void guardaUnaReservaYDevuelveSuCodigo() throws Exception {
        String json = """
                {"paquete":"cultura","nombre":"Ana Martínez","email":"ana@ejemplo.com","telefono":"+503 7000-0000",
                 "fechaInicio":"%s","fechaFin":"%s","personas":"2","hospedaje":"boutique","comentarios":"Vegetariana"}
                """.formatted(manana(), manana());
        String respuesta = mvc.perform(post("/api/reservas").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.codigo").value(org.hamcrest.Matchers.startsWith("DES-")))
                .andExpect(jsonPath("$.estado").value("PENDIENTE"))
                .andReturn().getResponse().getContentAsString();
        String codigo = respuesta.replaceAll(".*\"codigo\":\"([^\"]+)\".*", "$1");

        mvc.perform(get("/api/reservas/" + codigo).param("email", "ANA@ejemplo.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paquete").value("Cultura & Historia"));
        mvc.perform(get("/api/reservas/" + codigo).param("email", "otra@ejemplo.com"))
                .andExpect(status().isNotFound());
        assertThat(reservas.count()).isPositive();
    }

    @Test
    void rechazaReservaConDatosMalos() throws Exception {
        String json = """
                {"paquete":"inexistente","nombre":"A","email":"no-es-correo","telefono":"123",
                 "fechaInicio":"2020-01-01","fechaFin":"2020-01-01","personas":"9"}
                """;
        mvc.perform(post("/api/reservas").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.nombre").exists())
                .andExpect(jsonPath("$.errores.email").exists())
                .andExpect(jsonPath("$.errores.telefono").exists())
                .andExpect(jsonPath("$.errores.fechaInicio").exists())
                .andExpect(jsonPath("$.errores.personas").exists());
    }

    @Test
    void rechazaFechaDeFinAntesDelInicio() throws Exception {
        String json = """
                {"paquete":"surf","nombre":"David","email":"d@ejemplo.com","telefono":"70000000",
                 "fechaInicio":"%s","fechaFin":"%s","personas":"6+"}
                """.formatted(LocalDate.now().plusDays(5), LocalDate.now().plusDays(2));
        mvc.perform(post("/api/reservas").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.fechaFin").exists());
    }

    @Test
    void guardaContacto() throws Exception {
        String json = """
                {"nombre":"Carla","email":"carla@ejemplo.com","telefono":"","pais":"AR","interes":"surf",
                 "presupuesto":"","fechaViaje":"","duracion":"4-7","mensaje":"Quiero surfear una semana."}
                """;
        mvc.perform(post("/api/contacto").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.mensaje").exists());
    }

    @Test
    void rechazaContactoSinMensaje() throws Exception {
        mvc.perform(post("/api/contacto").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Carla\",\"email\":\"carla@ejemplo.com\",\"interes\":\"surf\",\"mensaje\":\"corto\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.mensaje").exists());
    }

    @Test
    void guardaColaboracionYValidaLaWeb() throws Exception {
        String bien = """
                {"nombre":"Foto SV","email":"foto@ejemplo.com","tipo":"fotografia","web":"https://fotosv.com",
                 "redes":"@fotosv","propuesta":"Podemos hacer fotos de todos los destinos."}
                """;
        mvc.perform(post("/api/colaboraciones").contentType(MediaType.APPLICATION_JSON).content(bien))
                .andExpect(status().isCreated());
        mvc.perform(post("/api/colaboraciones").contentType(MediaType.APPLICATION_JSON)
                        .content(bien.replace("https://fotosv.com", "fotosv")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.web").exists());
    }

    @Test
    void recibeFotosPendientesYSoloMuestraAprobadas() throws Exception {
        long antes = fotos.count();
        mvc.perform(multipart("/api/galeria/fotos")
                        .file(new MockMultipartFile("fotos", "Mi volcán.png", "image/png", PNG))
                        .file(new MockMultipartFile("fotos", "playa.png", "image/png", PNG)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.recibidas").value(2));
        assertThat(fotos.count()).isEqualTo(antes + 2);
        FotoGaleria foto = fotos.findAll().stream().filter(f -> f.getTitulo().equals("Mi volcán")).findFirst().orElseThrow();
        assertThat(foto.getEstado()).isEqualTo(EstadoFoto.PENDIENTE);
        assertThat(Files.exists(almacen.getCarpeta().resolve(foto.getArchivo()))).isTrue();

        mvc.perform(get("/api/galeria/fotos")).andExpect(jsonPath("$[?(@.titulo == 'Mi volcán')]").isEmpty());
        foto.setEstado(EstadoFoto.APROBADA);
        fotos.save(foto);
        mvc.perform(get("/api/galeria/fotos"))
                .andExpect(jsonPath("$[?(@.titulo == 'Mi volcán')].url").value(org.hamcrest.Matchers.hasItem(
                        AlmacenFotos.RUTA_PUBLICA + foto.getArchivo())));
        mvc.perform(get(AlmacenFotos.RUTA_PUBLICA + foto.getArchivo())).andExpect(status().isOk());
    }

    @Test
    void rechazaArchivosQueNoSonImagenes() throws Exception {
        long antes = fotos.count();
        mvc.perform(multipart("/api/galeria/fotos")
                        .file(new MockMultipartFile("fotos", "bien.png", "image/png", PNG))
                        .file(new MockMultipartFile("fotos", "virus.jpg", "image/jpeg", "<script>".getBytes())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.fotos").value(org.hamcrest.Matchers.containsString("virus.jpg")));
        assertThat(fotos.count()).isEqualTo(antes);
    }

    @Test
    void sirveLasPaginasPeroNoElCodigo() throws Exception {
        mvc.perform(get("/")).andExpect(status().is3xxRedirection())
                .andExpect(header().string("Location", "/inicio%20el%20salvador.html"));
        mvc.perform(get("/inicio el salvador.html")).andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("<html")));
        mvc.perform(get("/css/base.css")).andExpect(status().isOk());
        mvc.perform(get("/backend/pom.xml")).andExpect(status().isNotFound());
        mvc.perform(get("/backend/src/main/resources/application.properties")).andExpect(status().isNotFound());
        mvc.perform(get("/.git/config")).andExpect(status().isNotFound());
        mvc.perform(get("/CREDITOS.md")).andExpect(status().isNotFound());
    }
}
