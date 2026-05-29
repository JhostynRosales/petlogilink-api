package com.jhostyn.petlogilink.service.ai;

import com.jhostyn.petlogilink.model.Product;

public interface AISeoService {
    /**
     * Generates SEO optimized descriptions and meta keywords based on product properties.
     * @param product The product to optimize
     * @return The enriched Product object
     */
    Product enrichProductSeo(Product product);
}
