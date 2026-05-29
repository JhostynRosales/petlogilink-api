package com.jhostyn.petlogilink.model;

import java.time.LocalDateTime;

public class OrderLog {
    private String id;
    private String orderId;
    private String sourceChannel;
    private LocalDateTime processedAt;
    private String status;

    public OrderLog() {}

    public OrderLog(String id, String orderId, String sourceChannel, LocalDateTime processedAt, String status) {
        this.id = id;
        this.orderId = orderId;
        this.sourceChannel = sourceChannel;
        this.processedAt = processedAt;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getSourceChannel() { return sourceChannel; }
    public void setSourceChannel(String sourceChannel) { this.sourceChannel = sourceChannel; }

    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
