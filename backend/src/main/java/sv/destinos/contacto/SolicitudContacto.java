package sv.destinos.contacto;

import java.time.LocalDate;
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

/** Solicitud del formulario «Contáctanos». */
@Entity
@Table(name = "solicitudes_contacto")
public class SolicitudContacto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, length = 180)
    private String email;

    @Column(length = 30)
    private String telefono;

    @Column(length = 10)
    private String pais;

    @Column(nullable = false, length = 30)
    private String interes;

    @Column(length = 30)
    private String presupuesto;

    @Column(name = "fecha_viaje")
    private LocalDate fechaViaje;

    @Column(length = 10)
    private String duracion;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensaje;

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
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getPais() { return pais; }
    public void setPais(String pais) { this.pais = pais; }
    public String getInteres() { return interes; }
    public void setInteres(String interes) { this.interes = interes; }
    public String getPresupuesto() { return presupuesto; }
    public void setPresupuesto(String presupuesto) { this.presupuesto = presupuesto; }
    public LocalDate getFechaViaje() { return fechaViaje; }
    public void setFechaViaje(LocalDate fechaViaje) { this.fechaViaje = fechaViaje; }
    public String getDuracion() { return duracion; }
    public void setDuracion(String duracion) { this.duracion = duracion; }
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    public EstadoSolicitud getEstado() { return estado; }
    public void setEstado(EstadoSolicitud estado) { this.estado = estado; }
    public LocalDateTime getCreadoEn() { return creadoEn; }
}
