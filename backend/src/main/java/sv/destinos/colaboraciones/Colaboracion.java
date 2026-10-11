package sv.destinos.colaboraciones;

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
import sv.destinos.comun.EstadoSolicitud;

/** Propuesta del formulario «Colabora». */
@Entity
@Table(name = "colaboraciones")
public class Colaboracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, length = 180)
    private String email;

    @Column(nullable = false, length = 30)
    private String tipo;

    private String web;

    private String redes;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String propuesta;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoSolicitud estado = EstadoSolicitud.NUEVA;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getWeb() { return web; }
    public void setWeb(String web) { this.web = web; }
    public String getRedes() { return redes; }
    public void setRedes(String redes) { this.redes = redes; }
    public String getPropuesta() { return propuesta; }
    public void setPropuesta(String propuesta) { this.propuesta = propuesta; }
    public EstadoSolicitud getEstado() { return estado; }
    public void setEstado(EstadoSolicitud estado) { this.estado = estado; }
    public LocalDateTime getCreadoEn() { return creadoEn; }
}
