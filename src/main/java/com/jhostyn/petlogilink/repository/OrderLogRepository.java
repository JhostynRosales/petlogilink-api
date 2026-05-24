package com.jhostyn.petlogilink.repository;

import com.jhostyn.petlogilink.model.OrderLog;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class OrderLogRepository {
    private final ConcurrentHashMap<String, OrderLog> database = new ConcurrentHashMap<>();

    public OrderLog save(OrderLog log) {
        database.put(log.getId(), log);
        return log;
    }

    public List<OrderLog> findAll() {
        return new ArrayList<>(database.values());
    }
}
