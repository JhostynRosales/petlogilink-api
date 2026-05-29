package com.jhostyn.petlogilink.dto;

import java.math.BigDecimal;
import java.util.List;

public record OrderRequestDTO(
        String orderId,
        String sourceChannel, // e.g., "MIRAVIA", "AMAZON"
        String customerName,
        String shippingAddress,
        List<OrderItemDTO> items,
        BigDecimal totalAmount
) {
    public record OrderItemDTO(
            String sku,
            Integer quantity,
            BigDecimal unitPrice
    ) {}
}
