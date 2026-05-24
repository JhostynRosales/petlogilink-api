package com.jhostyn.petlogilink.dto;

import java.math.BigDecimal;

public record ProductDTO(
        String sku,
        String ean,
        String name,
        Integer stockQuantity,
        BigDecimal wholesalePrice,
        String manufacturer
) {}
