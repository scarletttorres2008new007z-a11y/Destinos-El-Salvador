package sv.destinos.contacto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import sv.destinos.comun.Telefono;

/** Lo que envía el formulario «Contáctanos». Mismas reglas que valida la página. */
public record ContactoSolicitud(
        @NotBlank(message = "Escribe tu nombre.")
        @Size(min = 2, max = 120, message = "El nombre debe tener entre 2 y 120 caracteres.")
        String nombre,

        @NotBlank(message = "Escribe tu correo.")
        @Email(message = "Escribe un correo válido.")
        @Size(max = 180)
        String email,

        @Telefono
        @Size(max = 30)
        String telefono,

        @Pattern(regexp = "|[A-Z]{2}|OTHER", message = "Elige un país de la lista.")
        String pais,

        @NotBlank(message = "Elige tu interés principal.")
        @Pattern(regexp = "surf|volcanismo|historia|cultura|gastronomia|naturaleza|aventura|relax|todo",
                message = "Elige un interés de la lista.")
        String interes,

        @Pattern(regexp = "|economico|moderado|premium|lujo", message = "Elige un presupuesto de la lista.")
        String presupuesto,

        @FutureOrPresent(message = "La fecha del viaje no puede ser anterior a hoy.")
        LocalDate fechaViaje,

        @Pattern(regexp = "|1-3|4-7|8-14|15\\+", message = "Elige una duración de la lista.")
        String duracion,

        @NotBlank(message = "Escribe tu mensaje.")
        @Size(min = 10, max = 5000, message = "El mensaje debe tener al menos 10 caracteres.")
        String mensaje) {
}
