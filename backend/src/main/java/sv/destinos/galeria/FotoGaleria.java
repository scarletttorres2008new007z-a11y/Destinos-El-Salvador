package sv.destinos.galeria;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Foto de la Galería. El archivo vive en la carpeta de subidas; aquí solo se guarda su nombre.
 * Las fotos de visitantes entran como PENDIENTE y se muestran cuando la agencia las aprueba.
 */
@Entity
@Table(name = "fotos_galeria")
public class FotoGaleria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String titulo;

    @Column(nullable = false, length = 20)
    private String categoria = "all";

    @Column(nullable = false, unique = true, length = 80)
    private String archivo;

    @Column(length = 120)
    private String autor;

    @Column(length = 40)
    private String licencia;

    @Column(name = "fuente_url")
    private String fuenteUrl;

    @Column(nullable = false, length = 20)
    private String origen = "VISITANTE";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoFoto estado = EstadoFoto.PENDIENTE;

    @Column(name = "email_visitante", length = 180)
    private String emailVisitante;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public String getArchivo() { return archivo; }
    public void setArchivo(String archivo) { this.archivo = archivo; }
    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }
    public String getLicencia() { return licencia; }
    public void setLicencia(String licencia) { this.licencia = licencia; }
    public String getFuenteUrl() { return fuenteUrl; }
    public void setFuenteUrl(String fuenteUrl) { this.fuenteUrl = fuenteUrl; }
    public String getOrigen() { return origen; }
    public void setOrigen(String origen) { this.origen = origen; }
    public EstadoFoto getEstado() { return estado; }
    public void setEstado(EstadoFoto estado) { this.estado = estado; }
    public String getEmailVisitante() { return emailVisitante; }
    public void setEmailVisitante(String emailVisitante) { this.emailVisitante = emailVisitante; }
    public LocalDateTime getCreadoEn() { return creadoEn; }
}
