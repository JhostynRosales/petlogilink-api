import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Product {
  sku: string;
  ean: string;
  name: string;
  manufacturer: string;
  stockQuantity: number;
  retailPrice: number;
  seoDescription: string;
  metaKeywords: string;
}

export interface OrderLog {
  id: string;
  orderId: string;
  sourceChannel: 'AMAZON' | 'MIRAVIA';
  processedAt: string;
  status: 'PROCESSED' | 'ERROR' | 'PENDING';
}

export interface SyncLogEntry {
  time: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'OK';
  message: string;
}

export interface DashboardMetrics {
  totalOrders: number;
  amazonOrders: number;
  miraviaOrders: number;
  lowStockProducts: number;
  stockSynced: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {

  private products$ = new BehaviorSubject<Product[]>([
    { sku: 'SKU-1001', ean: '8431001001', name: 'Comida seca para Perro Adulto Premium', manufacturer: 'SupplierA', stockQuantity: 50, retailPrice: 11.50, seoDescription: 'Descubre el mejor alimento para tu perro. Calidad premium.', metaKeywords: 'perros, comida seca, premium' },
    { sku: 'SKU-1002', ean: '8431001002', name: 'Juguete rascador interactivo para Gato', manufacturer: 'SupplierA', stockQuantity: 12, retailPrice: 17.82, seoDescription: 'El juguete ideal para el cuidado de tu gato.', metaKeywords: 'gatos, juguetes, rascador' },
    { sku: 'SKU-1003', ean: '8431001003', name: 'Correa reflectante ajustable para perro', manufacturer: 'SupplierA', stockQuantity: 5, retailPrice: 9.20, seoDescription: 'Correa de alta visibilidad para paseos nocturnos.', metaKeywords: 'perros, correa, reflectante' },
    { sku: 'SKU-1004', ean: '8431001004', name: 'Champú hipoalergénico para mascotas', manufacturer: 'SupplierA', stockQuantity: 3, retailPrice: 14.95, seoDescription: 'Champú suave sin parabenos para pieles sensibles.', metaKeywords: 'champú, mascotas, hipoalergénico' },
    { sku: 'SKU-1005', ean: '8431001005', name: 'Pienso natural para Gato Adulto Esterilizado', manufacturer: 'SupplierA', stockQuantity: 38, retailPrice: 22.10, seoDescription: 'Pienso equilibrado para gatos esterilizados.', metaKeywords: 'gatos, pienso, esterilizado' },
    { sku: 'SKU-1006', ean: '8431001006', name: 'Transportín plegable ligero para mascotas', manufacturer: 'SupplierA', stockQuantity: 0, retailPrice: 34.50, seoDescription: 'Transportín certificado para viajes seguros.', metaKeywords: 'transportín, viaje, mascotas' },
  ]);

  private orderLogs$ = new BehaviorSubject<OrderLog[]>([
    { id: 'log-001', orderId: 'AMZ-9901', sourceChannel: 'AMAZON',  processedAt: '2026-05-29T08:12:00', status: 'PROCESSED' },
    { id: 'log-002', orderId: 'MRV-2201', sourceChannel: 'MIRAVIA', processedAt: '2026-05-29T08:45:00', status: 'PROCESSED' },
    { id: 'log-003', orderId: 'AMZ-9902', sourceChannel: 'AMAZON',  processedAt: '2026-05-29T09:10:00', status: 'PROCESSED' },
    { id: 'log-004', orderId: 'MRV-2202', sourceChannel: 'MIRAVIA', processedAt: '2026-05-29T10:01:00', status: 'ERROR'     },
    { id: 'log-005', orderId: 'AMZ-9903', sourceChannel: 'AMAZON',  processedAt: '2026-05-29T11:33:00', status: 'PROCESSED' },
  ]);

  private syncLogs$ = new BehaviorSubject<SyncLogEntry[]>([
    { time: '08:00:00', level: 'INFO', message: 'StockSyncService: Iniciando sincronización de proveedor...' },
    { time: '08:00:01', level: 'OK',   message: 'Procesado SKU-1001 | Precio: 11.50€ | Stock: 50 uds' },
    { time: '08:00:01', level: 'OK',   message: 'Procesado SKU-1002 | Precio: 17.82€ | Stock: 12 uds' },
    { time: '08:00:01', level: 'WARN', message: 'Stock bajo detectado: SKU-1003 (5 uds)' },
    { time: '08:00:02', level: 'WARN', message: 'Stock bajo detectado: SKU-1004 (3 uds)' },
    { time: '08:00:02', level: 'ERROR', message: 'SKU-1006: Stock a 0 — producto marcado como agotado' },
    { time: '08:00:02', level: 'INFO', message: 'Sincronización completada. Productos actualizados: 6' },
  ]);

  getProducts(): Observable<Product[]> { return this.products$.asObservable(); }
  getOrderLogs(): Observable<OrderLog[]> { return this.orderLogs$.asObservable(); }
  getSyncLogs(): Observable<SyncLogEntry[]> { return this.syncLogs$.asObservable(); }

  getDashboardMetrics(): Observable<DashboardMetrics> {
    return this.orderLogs$.pipe(
      map(logs => ({
        totalOrders:       logs.length,
        amazonOrders:      logs.filter(l => l.sourceChannel === 'AMAZON').length,
        miraviaOrders:     logs.filter(l => l.sourceChannel === 'MIRAVIA').length,
        lowStockProducts:  this.products$.value.filter(p => p.stockQuantity <= 5).length,
        stockSynced:       this.products$.value.length,
      }))
    );
  }

  updateProductPrice(sku: string, newPrice: number): Observable<boolean> {
    const products = this.products$.value.map(p =>
      p.sku === sku ? { ...p, retailPrice: newPrice } : p
    );
    this.products$.next(products);
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    this.addSyncLog({ time, level: 'OK', message: `Precio actualizado manualmente: ${sku} → ${newPrice.toFixed(2)}€` });
    return of(true).pipe();
  }

  addOrderLog(log: OrderLog): void {
    this.orderLogs$.next([log, ...this.orderLogs$.value]);
  }

  addSyncLog(entry: SyncLogEntry): void {
    this.syncLogs$.next([entry, ...this.syncLogs$.value]);
  }

  simulateSyncCycle(): void {
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    this.addSyncLog({ time, level: 'INFO', message: 'StockSyncService @Scheduled: Iniciando ciclo de sincronización...' });
    setTimeout(() => {
      this.addSyncLog({ time, level: 'OK', message: 'Feed del proveedor descargado correctamente (6 productos)' });
    }, 800);
    setTimeout(() => {
      this.addSyncLog({ time, level: 'OK', message: 'Márgenes aplicados (15%). Stock sincronizado con éxito.' });
    }, 1600);
    setTimeout(() => {
      this.addSyncLog({ time, level: 'INFO', message: `Ciclo completado en ${(Math.random() * 0.8 + 0.4).toFixed(2)}s` });
    }, 2400);
  }
}
