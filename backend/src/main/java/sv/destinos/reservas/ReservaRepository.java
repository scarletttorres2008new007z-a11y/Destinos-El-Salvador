package sv.destinos.reservas;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    @EntityGraph(attributePaths = "paquete")
    Optional<Reserva> findByCodigoIgnoreCaseAndEmailIgnoreCase(String codigo, String email);
}
