package com.jhostyn.petlogilink.service.ai;

import com.jhostyn.petlogilink.model.Product;
import org.springframework.stereotype.Service;

@Service
public class AISeoServiceMock implements AISeoService {

    @Override
    public Product enrichProductSeo(Product product) {
        String name = product.getName().toLowerCase();
        
        // Simular IA basada en reglas para SEO de productos de mascotas
        if (name.contains("perro") || name.contains("canino")) {
            product.setSeoDescription("Descubre el mejor " + product.getName() + " para tu perro. " +
                    "Calidad premium garantizada por " + product.getManufacturer() + ". Envío rápido a toda España.");
            product.setMetaKeywords("perros, accesorios caninos, " + product.getManufacturer().toLowerCase() + ", mascotas");
        } else if (name.contains("gato") || name.contains("felino")) {
            product.setSeoDescription("El " + product.getName() + " ideal para el cuidado de tu gato. " +
                    "Desarrollado por expertos de " + product.getManufacturer() + ".");
            product.setMetaKeywords("gatos, felinos, cuidado gatos, " + product.getManufacturer().toLowerCase());
        } else {
            product.setSeoDescription("Encuentra " + product.getName() + " al mejor precio. " +
                    "Alta calidad y resistencia para tu mascota.");
            product.setMetaKeywords("mascotas, " + product.getName().toLowerCase() + ", " + product.getManufacturer().toLowerCase());
        }

        return product;
    }
}
