package sv.destinos.galeria;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FotoGaleriaRepository extends JpaRepository<FotoGaleria, Long> {

    List<FotoGaleria> findByEstadoOrderByCreadoEnDesc(EstadoFoto estado);

    List<FotoGaleria> findByEstadoAndCategoriaOrderByCreadoEnDesc(EstadoFoto estado, String categoria);
}
