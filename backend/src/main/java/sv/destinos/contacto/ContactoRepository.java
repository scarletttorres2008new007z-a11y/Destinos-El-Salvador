package sv.destinos.contacto;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactoRepository extends JpaRepository<SolicitudContacto, Long> {
}
