package sv.destinos.paquetes;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Paquete turístico que se muestra y se reserva en la página de Contacto. */
@Entity
@Table(name = "paquetes")
public class Paquete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String codigo;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, length = 60)
    private String etiqueta;

    private Integer dias;

    private Integer noches;

    @Column(name = "precio_usd", precision = 10, scale = 2)
    private BigDecimal precioUsd;

    @Column(nullable = false, length = 500)
    private String descripcion;

    @Column(name = "imagen_url", nullable = false)
    private String imagenUrl;

    @Column(name = "credito_foto")
    private String creditoFoto;

    @Column(nullable = false)
    private int orden;

    @Column(nullable = false)
    private boolean activo = true;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    public Long getId() { return id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEtiqueta() { return etiqueta; }
    public void setEtiqueta(String etiqueta) { this.etiqueta = etiqueta; }
    public Integer getDias() { return dias; }
    public void setDias(Integer dias) { this.dias = dias; }
    public Integer getNoches() { return noches; }
    public void setNoches(Integer noches) { this.noches = noches; }
    public BigDecimal getPrecioUsd() { return precioUsd; }
    public void setPrecioUsd(BigDecimal precioUsd) { this.precioUsd = precioUsd; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
    public String getCreditoFoto() { return creditoFoto; }
    public void setCreditoFoto(String creditoFoto) { this.creditoFoto = creditoFoto; }
    public int getOrden() { return orden; }
    public void setOrden(int orden) { this.orden = orden; }
    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
    public LocalDateTime getCreadoEn() { return creadoEn; }
}
