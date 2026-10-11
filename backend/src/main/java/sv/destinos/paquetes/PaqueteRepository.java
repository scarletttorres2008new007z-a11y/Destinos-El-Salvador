package sv.destinos.paquetes;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PaqueteRepository extends JpaRepository<Paquete, Long> {

    List<Paquete> findByActivoTrueOrderByOrdenAsc();

    Optional<Paquete> findByCodigoAndActivoTrue(String codigo);
}
