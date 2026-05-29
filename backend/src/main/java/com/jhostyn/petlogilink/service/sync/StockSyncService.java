package com.jhostyn.petlogilink.service.sync;

import com.jhostyn.petlogilink.model.Product;
import com.jhostyn.petlogilink.repository.ProductRepository;
import com.jhostyn.petlogilink.service.ai.AISeoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class StockSyncService {

    private static final Logger log = LoggerFactory.getLogger(StockSyncService.class);
    private final ProductRepository productRepository;
    private final AISeoService aiSeoService;

    public StockSyncService(ProductRepository productRepository, AISeoService aiSeoService) {
        this.productRepository = productRepository;
        this.aiSeoService = aiSeoService;
    }

    /**
     * Tarea cron que se ejecuta cada 5 minutos.
     * Simula la lógica extraída de sync_supplier_stock.php
     */
    @Scheduled(cron = "${petlogilink.sync.cron-expression}")
    public void synchronizeSupplierStock() {
        log.info("Iniciando sincronización de stock desde proveedor (Simulado) ...");

        // Simulando parseo de un CSV (Data Fake)
        List<Product> mockCsvData = List.of(
                new Product("SKU-1001", "8431001001", "Comida seca para Perro Adulto", 50, new BigDecimal("10.00"), "SupplierA"),
                new Product("SKU-1002", "8431001002", "Juguete rascador para Gato", 12, new BigDecimal("15.50"), "SupplierA"),
                new Product("SKU-1003", "8431001003", "Correa reflectante", 5, new BigDecimal("8.00"), "SupplierA")
        );

        int updated = 0;
        for (Product p : mockCsvData) {
            // Aplicar 15% de margen sobre el wholesale_price (simulado como retail_price inicial)
            BigDecimal finalPrice = p.getRetailPrice().multiply(new BigDecimal("1.15"));
            p.setRetailPrice(finalPrice);

            // Enriquecer SEO con IA (simulado)
            aiSeoService.enrichProductSeo(p);

            // Guardar o actualizar en base de datos
            productRepository.save(p);
            updated++;
            
            log.debug("Procesado producto SKU: {} | Precio Venta: {} | SEO: {}", 
                      p.getSku(), p.getRetailPrice(), p.getSeoDescription());
        }

        log.info("Sincronización finalizada. Productos actualizados: {}", updated);
    }
}
