package sv.destinos.reservas;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sv.destinos.comun.AvisoCorreo;
import sv.destinos.comun.DatosInvalidosException;
import sv.destinos.comun.NoEncontradoException;
import sv.destinos.comun.Textos;
import sv.destinos.paquetes.Paquete;
import sv.destinos.paquetes.PaqueteRepository;

@Service
public class ReservaService {

    private final ReservaRepository reservas;
    private final PaqueteRepository paquetes;
    private final AvisoCorreo aviso;

    public ReservaService(ReservaRepository reservas, PaqueteRepository paquetes, AvisoCorreo aviso) {
        this.reservas = reservas;
        this.paquetes = paquetes;
        this.aviso = aviso;
    }

    @Transactional
    public Reserva crear(ReservaSolicitud s) {
        Paquete paquete = paquetes.findByCodigoAndActivoTrue(s.paquete().trim())
                .orElseThrow(() -> new DatosInvalidosException("paquete", "Elige un paquete de la lista."));
        if (s.fechaFin().isBefore(s.fechaInicio())) {
            throw new DatosInvalidosException("fechaFin", "La fecha de fin debe ser igual o posterior a la de inicio.");
        }

        Reserva r = new Reserva();
        r.setPaquete(paquete);
        r.setNombre(s.nombre().trim());
        r.setEmail(s.email().trim());
        r.setTelefono(s.telefono().trim());
        r.setFechaInicio(s.fechaInicio());
        r.setFechaFin(s.fechaFin());
        r.setPersonas(s.personas());
        r.setHospedaje(Textos.limpio(s.hospedaje()));
        r.setComentarios(Textos.limpio(s.comentarios()));
        r.setPrecioUsd(paquete.getPrecioUsd());
        reservas.saveAndFlush(r);

        // Código fácil de dictar por teléfono: DES-2026-0001
        r.setCodigo(String.format("DES-%d-%04d", s.fechaInicio().getYear(), r.getId()));

        aviso.avisar("Nueva reserva " + r.getCodigo() + " - " + r.getNombre(), String.join("\n",
                "Código: " + r.getCodigo(),
                "Paquete: " + paquete.getNombre() + " (" + (paquete.getPrecioUsd() == null ? "Cotizar" : "$" + paquete.getPrecioUsd()) + ")",
                "Nombre: " + r.getNombre(),
                "Correo: " + r.getEmail(),
                "Teléfono: " + r.getTelefono(),
                "Fecha de inicio: " + r.getFechaInicio(),
                "Fecha de fin: " + r.getFechaFin(),
                "Viajeros: " + r.getPersonas(),
                "Hospedaje: " + Textos.oGuion(r.getHospedaje()),
                "",
                "Comentarios: " + Textos.oGuion(r.getComentarios())), r.getEmail());
        return r;
    }

    @Transactional(readOnly = true)
    public ReservaConsulta consultar(String codigo, String email) {
        return reservas.findByCodigoIgnoreCaseAndEmailIgnoreCase(codigo.trim(), email == null ? "" : email.trim())
                .map(ReservaConsulta::de)
                .orElseThrow(() -> new NoEncontradoException("No encontramos una reserva con ese código y correo."));
    }
}
