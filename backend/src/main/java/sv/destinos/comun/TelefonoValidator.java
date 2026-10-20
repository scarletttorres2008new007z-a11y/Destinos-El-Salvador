package sv.destinos.comun;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class TelefonoValidator implements ConstraintValidator<Telefono, String> {

    @Override
    public boolean isValid(String valor, ConstraintValidatorContext contexto) {
        if (valor == null || valor.isBlank()) {
            return true;
        }
        String texto = valor.trim();
        return texto.matches("\\+?[0-9\\s\\-()]+") && texto.replaceAll("\\D", "").length() >= 8;
    }
}
