package sv.destinos.reservas;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import sv.destinos.comun.Telefono;

/** Lo que envía el formulario de reserva. Mismas reglas que valida la página. */
public record ReservaSolicitud(
        @NotBlank(message = "Elige un paquete.")
        String paquete,

        @NotBlank(message = "Escribe tu nombre.")
        @Size(min = 2, max = 120, message = "El nombre debe tener entre 2 y 120 caracteres.")
        String nombre,

        @NotBlank(message = "Escribe tu correo.")
        @Email(message = "Escribe un correo válido.")
        @Size(max = 180)
        String email,

        @NotBlank(message = "Escribe tu teléfono.")
        @Telefono
        @Size(max = 30)
        String telefono,

        @NotNull(message = "Elige la fecha de inicio.")
        @FutureOrPresent(message = "La fecha de inicio no puede ser anterior a hoy.")
        LocalDate fechaInicio,

        @NotNull(message = "Elige la fecha de fin.")
        LocalDate fechaFin,

        @NotBlank(message = "Indica cuántas personas viajan.")
        @Pattern(regexp = "[1-5]|6\\+", message = "Elige el número de personas de la lista.")
        String personas,

        @Pattern(regexp = "|economico|estandar|superior|lujo|boutique", message = "Elige un hospedaje de la lista.")
        String hospedaje,

        @Size(max = 2000, message = "Los comentarios pueden tener hasta 2000 caracteres.")
        String comentarios) {
}
