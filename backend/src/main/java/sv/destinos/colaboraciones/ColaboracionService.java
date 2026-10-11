package sv.destinos.colaboraciones;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sv.destinos.comun.AvisoCorreo;
import sv.destinos.comun.Textos;

@Service
public class ColaboracionService {

    private final ColaboracionRepository colaboraciones;
    private final AvisoCorreo aviso;

    public ColaboracionService(ColaboracionRepository colaboraciones, AvisoCorreo aviso) {
        this.colaboraciones = colaboraciones;
        this.aviso = aviso;
    }

    @Transactional
    public Colaboracion crear(ColaboracionSolicitud s) {
        Colaboracion c = new Colaboracion();
        c.setNombre(s.nombre().trim());
        c.setEmail(s.email().trim());
        c.setTipo(s.tipo());
        c.setWeb(Textos.limpio(s.web()));
        c.setRedes(Textos.limpio(s.redes()));
        c.setPropuesta(s.propuesta().trim());
        colaboraciones.save(c);

        aviso.avisar("Propuesta de colaboración - " + c.getNombre(), String.join("\n",
                "Nombre o empresa: " + c.getNombre(),
                "Correo: " + c.getEmail(),
                "Tipo de colaboración: " + c.getTipo(),
                "Sitio web o portafolio: " + Textos.oGuion(c.getWeb()),
                "Redes sociales: " + Textos.oGuion(c.getRedes()),
                "",
                c.getPropuesta()), c.getEmail());
        return c;
    }
}
