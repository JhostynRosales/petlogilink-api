package com.jhostyn.petlogilink.controller;

import com.jhostyn.petlogilink.dto.OrderRequestDTO;
import com.jhostyn.petlogilink.model.OrderLog;
import com.jhostyn.petlogilink.repository.OrderLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/integrations")
public class OrderIntegrationController {

    private static final Logger log = LoggerFactory.getLogger(OrderIntegrationController.class);
    private final OrderLogRepository orderLogRepository;

    public OrderIntegrationController(OrderLogRepository orderLogRepository) {
        this.orderLogRepository = orderLogRepository;
    }

    @PostMapping("/orders")
    public ResponseEntity<Map<String, String>> receiveOrder(@RequestBody OrderRequestDTO request) {
        log.info("Pedido recibido desde canal {}: ID {} por monto {}", 
                request.sourceChannel(), request.orderId(), request.totalAmount());

        // Simulando lógica de validación e inserción en ERP/Prestashop
        if (request.items() == null || request.items().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "message", "El pedido no contiene productos"
            ));
        }

        // Registrar en nuestra base de datos In-Memory
        OrderLog logEntry = new OrderLog(
                UUID.randomUUID().toString(),
                request.orderId(),
                request.sourceChannel(),
                LocalDateTime.now(),
                "PROCESSED"
        );
        orderLogRepository.save(logEntry);

        log.info("Pedido {} procesado exitosamente.", request.orderId());

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Pedido ingresado al sistema logístico con éxito",
                "internalLogId", logEntry.getId()
        ));
    }
    
    @GetMapping("/orders/logs")
    public ResponseEntity<Iterable<OrderLog>> getOrderLogs() {
        return ResponseEntity.ok(orderLogRepository.findAll());
    }
}
