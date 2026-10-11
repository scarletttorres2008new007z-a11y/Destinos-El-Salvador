package sv.destinos.colaboraciones;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Lo que envía el formulario «Colabora». Mismas reglas que valida la página. */
public record ColaboracionSolicitud(
        @NotBlank(message = "Escribe tu nombre o el de tu empresa.")
        @Size(min = 2, max = 120, message = "El nombre debe tener entre 2 y 120 caracteres.")
        String nombre,

        @NotBlank(message = "Escribe tu correo.")
        @Email(message = "Escribe un correo válido.")
        @Size(max = 180)
        String email,

        @NotBlank(message = "Elige el tipo de colaboración.")
        @Pattern(regexp = "fotografia|blog|hospedaje|tours|gastronomia|influencer|transporte|otros",
                message = "Elige un tipo de colaboración de la lista.")
        String tipo,

        @Pattern(regexp = "|https?://\\S+\\.\\S+", message = "Escribe la dirección completa, empezando con http:// o https://.")
        @Size(max = 255)
        String web,

        @Size(max = 255, message = "Las redes sociales pueden tener hasta 255 caracteres.")
        String redes,

        @NotBlank(message = "Escribe tu propuesta.")
        @Size(min = 20, max = 5000, message = "La propuesta debe tener al menos 20 caracteres.")
        String propuesta) {
}
