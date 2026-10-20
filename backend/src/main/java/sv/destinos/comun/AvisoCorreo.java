package sv.destinos.comun;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Envía a la agencia un aviso por Gmail cada vez que llega una solicitud.
 * Reemplaza al script «envia gmail es.js». Si Gmail no está configurado, solo lo anota en el registro.
 */
@Service
public class AvisoCorreo {

    private static final Logger LOG = LoggerFactory.getLogger(AvisoCorreo.class);

    private final ObjectProvider<JavaMailSender> correo;
    private final String remitente;
    private final String agencia;

    public AvisoCorreo(ObjectProvider<JavaMailSender> correo,
                       @Value("${spring.mail.username:}") String remitente,
                       @Value("${app.correo.agencia}") String agencia) {
        this.correo = correo;
        this.remitente = remitente;
        this.agencia = agencia;
    }

    @Async
    public void avisar(String asunto, String cuerpo, String responderA) {
        JavaMailSender enviador = correo.getIfAvailable();
        if (remitente == null || remitente.isBlank() || enviador == null) {
            LOG.info("Gmail sin configurar; aviso no enviado: {}", asunto);
            return;
        }
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom(remitente);
            mensaje.setTo(agencia);
            mensaje.setReplyTo(responderA);
            mensaje.setSubject(asunto);
            mensaje.setText(cuerpo);
            enviador.send(mensaje);
        } catch (Exception ex) {
            // La solicitud ya quedó guardada; un fallo de correo no debe perderla
            LOG.warn("No se pudo enviar el aviso «{}»: {}", asunto, ex.getMessage());
        }
    }
}
