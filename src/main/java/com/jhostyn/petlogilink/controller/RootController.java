package com.jhostyn.petlogilink.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> welcome() {
        return ResponseEntity.ok(Map.of(
                "application", "PetLogiLink-API",
                "status", "UP",
                "version", "1.0.0",
                "timestamp", LocalDateTime.now(),
                "message", "Bienvenido a la API de automatización logística. El sistema está funcionando correctamente.",
                "endpoints", Map.of(
                        "POST /api/v1/integrations/orders", "Ingresar un nuevo pedido (Webhook simulado)",
                        "GET /api/v1/integrations/orders/logs", "Consultar logs de pedidos procesados"
                )
        ));
    }
}
