package sv.destinos.comun;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

/**
 * Teléfono con la misma regla del formulario: dígitos, espacios, guiones o paréntesis,
 * un + opcional al inicio y al menos 8 dígitos. Vacío se acepta; usa @NotBlank si es obligatorio.
 */
@Target({ElementType.FIELD, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TelefonoValidator.class)
public @interface Telefono {

    String message() default "Escribe un teléfono válido, con al menos 8 dígitos.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
