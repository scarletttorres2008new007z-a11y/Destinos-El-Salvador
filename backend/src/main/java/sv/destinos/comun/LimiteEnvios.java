package sv.destinos.comun;

import java.time.Clock;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Freno contra el spam: cada dirección puede hacer pocos envíos por minuto a cada formulario.
 */
@Component
public class LimiteEnvios implements HandlerInterceptor {

    private static final long MINUTO_MS = 60_000;

    private final int porMinuto;
    private final Clock reloj;
    private final Map<String, Deque<Long>> envios = new ConcurrentHashMap<>();

    public LimiteEnvios(@Value("${app.limite.por-minuto:5}") int porMinuto) {
        this.porMinuto = porMinuto;
        this.reloj = Clock.systemUTC();
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        long ahora = reloj.millis();
        String clave = request.getRemoteAddr() + " " + request.getRequestURI();
        Deque<Long> lista = envios.computeIfAbsent(clave, k -> new ArrayDeque<>());
        synchronized (lista) {
            while (!lista.isEmpty() && ahora - lista.peekFirst() > MINUTO_MS) {
                lista.pollFirst();
            }
            if (lista.size() >= porMinuto) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write("{\"mensaje\":\"Recibimos varios envíos seguidos. Espera un minuto e inténtalo de nuevo.\",\"errores\":{}}");
                return false;
            }
            lista.addLast(ahora);
        }
        if (envios.size() > 10_000) {
            envios.entrySet().removeIf(e -> e.getValue().isEmpty() || ahora - e.getValue().peekLast() > MINUTO_MS);
        }
        return true;
    }
}
