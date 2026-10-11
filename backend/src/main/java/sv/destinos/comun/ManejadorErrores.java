package sv.destinos.comun;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

/**
 * Convierte los errores en respuestas JSON que el frontend puede mostrar campo por campo.
 */
@RestControllerAdvice
public class ManejadorErrores {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorApi camposInvalidos(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new LinkedHashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errores.putIfAbsent(error.getField(), error.getDefaultMessage());
        }
        return new ErrorApi("Revisa los datos marcados.", errores);
    }

    @ExceptionHandler(DatosInvalidosException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorApi datosInvalidos(DatosInvalidosException ex) {
        return new ErrorApi("Revisa los datos marcados.", ex.getErrores());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorApi jsonIlegible(HttpMessageNotReadableException ex) {
        return ErrorApi.de("Los datos enviados no tienen el formato esperado.");
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorApi archivoGrande(MaxUploadSizeExceededException ex) {
        return ErrorApi.de("Cada foto puede pesar hasta 5 MB.");
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorApi sinArchivos(MissingServletRequestPartException ex) {
        return ErrorApi.de("Selecciona al menos una foto.");
    }

    @ExceptionHandler(NoEncontradoException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorApi noEncontrado(NoEncontradoException ex) {
        return ErrorApi.de(ex.getMessage());
    }
}
