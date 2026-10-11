package sv.destinos.contacto;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sv.destinos.comun.AvisoCorreo;
import sv.destinos.comun.Textos;

@Service
public class ContactoService {

    private final ContactoRepository solicitudes;
    private final AvisoCorreo aviso;

    public ContactoService(ContactoRepository solicitudes, AvisoCorreo aviso) {
        this.solicitudes = solicitudes;
        this.aviso = aviso;
    }

    @Transactional
    public SolicitudContacto crear(ContactoSolicitud s) {
        SolicitudContacto c = new SolicitudContacto();
        c.setNombre(s.nombre().trim());
        c.setEmail(s.email().trim());
        c.setTelefono(Textos.limpio(s.telefono()));
        c.setPais(Textos.limpio(s.pais()));
        c.setInteres(s.interes());
        c.setPresupuesto(Textos.limpio(s.presupuesto()));
        c.setFechaViaje(s.fechaViaje());
        c.setDuracion(Textos.limpio(s.duracion()));
        c.setMensaje(s.mensaje().trim());
        solicitudes.save(c);

        aviso.avisar("Solicitud de viaje - " + c.getNombre(), String.join("\n",
                "Nombre: " + c.getNombre(),
                "Correo: " + c.getEmail(),
                "Teléfono: " + Textos.oGuion(c.getTelefono()),
                "País: " + Textos.oGuion(c.getPais()),
                "Interés: " + c.getInteres(),
                "Presupuesto: " + Textos.oGuion(c.getPresupuesto()),
                "Fecha tentativa: " + Textos.oGuion(c.getFechaViaje()),
                "Duración: " + Textos.oGuion(c.getDuracion()),
                "",
                c.getMensaje()), c.getEmail());
        return c;
    }
}
