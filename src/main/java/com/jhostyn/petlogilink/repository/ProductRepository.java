package com.jhostyn.petlogilink.repository;

import com.jhostyn.petlogilink.model.Product;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class ProductRepository {
    private final ConcurrentHashMap<String, Product> database = new ConcurrentHashMap<>();

    public Product save(Product product) {
        database.put(product.getSku(), product);
        return product;
    }

    public Optional<Product> findBySku(String sku) {
        return Optional.ofNullable(database.get(sku));
    }

    public List<Product> findAll() {
        return new ArrayList<>(database.values());
    }

    public void deleteAll() {
        database.clear();
    }
}
