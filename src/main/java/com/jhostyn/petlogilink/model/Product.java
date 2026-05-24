package com.jhostyn.petlogilink.model;

import java.math.BigDecimal;

public class Product {
    private String sku;
    private String ean;
    private String name;
    private String seoDescription;
    private String metaKeywords;
    private Integer stockQuantity;
    private BigDecimal retailPrice;
    private String manufacturer;

    public Product() {}

    public Product(String sku, String ean, String name, Integer stockQuantity, BigDecimal retailPrice, String manufacturer) {
        this.sku = sku;
        this.ean = ean;
        this.name = name;
        this.stockQuantity = stockQuantity;
        this.retailPrice = retailPrice;
        this.manufacturer = manufacturer;
    }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getEan() { return ean; }
    public void setEan(String ean) { this.ean = ean; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSeoDescription() { return seoDescription; }
    public void setSeoDescription(String seoDescription) { this.seoDescription = seoDescription; }

    public String getMetaKeywords() { return metaKeywords; }
    public void setMetaKeywords(String metaKeywords) { this.metaKeywords = metaKeywords; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public BigDecimal getRetailPrice() { return retailPrice; }
    public void setRetailPrice(BigDecimal retailPrice) { this.retailPrice = retailPrice; }

    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }
}
