import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { ApiService, SyncLogEntry, OrderLog } from '../../core/services/api.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DatePipe],
  template: `
    <div class="logs-page">
      <!-- Header -->
      <div class="logs-header mb-6">
        <div>
          <h2 style="font-size:20px;font-weight:700;">Logs en Tiempo Real</h2>
          <p class="text-muted fs-12">Eventos generados por la tarea &#64;Scheduled · StockSyncService</p>
        </div>
        <div class="flex gap-3" style="align-items:center">
          <div class="flex gap-2" style="align-items:center">
            <div class="pulse-dot" *ngIf="isLive"></div>
            <span class="badge" [ngClass]="isLive ? 'badge-success' : 'badge-warning'">
              {{ isLive ? 'LIVE' : 'PAUSADO' }}
            </span>
          </div>
          <button class="btn btn-secondary btn-sm" (click)="toggleLive()">
            <span class="material-icons">{{ isLive ? 'pause' : 'play_arrow' }}</span>
            {{ isLive ? 'Pausar' : 'Reanudar' }}
          </button>
          <button class="btn btn-secondary btn-sm" (click)="clearLogs()">
            <span class="material-icons">delete_sweep</span> Limpiar
          </button>
          <button class="btn btn-primary btn-sm" (click)="triggerSync()">
            <span class="material-icons">sync</span> Simular Cron
          </button>
        </div>
      </div>

      <div class="logs-layout">
        <!-- Main sync log terminal -->
        <div class="card terminal-card">
          <div class="card__header">
            <div>
              <div class="card__title">
                <span class="material-icons" style="font-size:16px;color:var(--color-success)">terminal</span>
                StockSyncService · Output
              </div>
              <div class="card__subtitle">Última actualización: {{ lastUpdate | date:'HH:mm:ss' }}</div>
            </div>
            <span class="badge badge-info">{{ syncLogs.length }} eventos</span>
          </div>
          <div class="terminal-body" #terminalBody>
            <div class="log-entry" *ngFor="let entry of syncLogs; let i = index" [class.new-entry]="i === 0">
              <span class="log-entry__time">{{ entry.time }}</span>
              <span class="log-entry__level" [ngClass]="'log-entry__level--' + entry.level">{{ entry.level }}</span>
              <span class="log-entry__msg">{{ entry.message }}</span>
            </div>
            <div *ngIf="syncLogs.length === 0" class="empty-terminal">
              <span class="material-icons">terminal</span>
              <span>Esperando eventos del scheduler...</span>
            </div>
          </div>
        </div>

        <!-- Order integration feed -->
        <div class="card">
          <div class="card__header">
            <div>
              <div class="card__title">
                <span class="material-icons" style="font-size:16px;color:var(--color-info)">webhook</span>
                Webhook de Pedidos
              </div>
              <div class="card__subtitle">Integraciones multicanal</div>
            </div>
          </div>
          <div class="order-feed">
            <div class="order-feed__item" *ngFor="let order of orderLogs">
              <div class="order-feed__icon" [style.background]="order.sourceChannel === 'AMAZON' ? 'rgba(255,153,0,0.15)' : 'rgba(233,30,140,0.15)'">
                <span class="material-icons" [style.color]="order.sourceChannel === 'AMAZON' ? 'var(--color-amazon)' : 'var(--color-miravia)'">
                  {{ order.sourceChannel === 'AMAZON' ? 'storefront' : 'local_mall' }}
                </span>
              </div>
              <div class="order-feed__info">
                <div style="font-weight:600;font-size:13px;">{{ order.orderId }}</div>
                <div class="text-muted fs-12">{{ order.processedAt | date:'dd/MM HH:mm' }}</div>
              </div>
              <span class="badge" [ngClass]="order.status === 'PROCESSED' ? 'badge-success' : 'badge-danger'">
                {{ order.status }}
              </span>
            </div>
          </div>

          <!-- Simulate new order button -->
          <div style="padding:12px;border-top:1px solid var(--color-border)">
            <button class="btn btn-secondary btn-sm" style="width:100%;justify-content:center" (click)="simulateOrder()">
              <span class="material-icons">add</span> Simular pedido entrante
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .logs-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
    .logs-layout { display:grid; grid-template-columns:1fr 300px; gap:16px; }
    @media(max-width:900px){ .logs-layout{ grid-template-columns:1fr; } }

    .terminal-card { background: #0d1117 !important; border-color: #21262d !important; }
    .terminal-body {
      min-height:400px; max-height:500px; overflow-y:auto;
      font-family:'Courier New', monospace;
    }
    .new-entry { background: rgba(108,99,255,0.06); animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }

    .empty-terminal {
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      min-height:200px; gap:12px; color:var(--color-text-muted); opacity:0.4;
      .material-icons { font-size:36px; }
    }

    .order-feed { display:flex; flex-direction:column; }
    .order-feed__item {
      display:flex; align-items:center; gap:12px;
      padding:12px 14px; border-bottom:1px solid rgba(45,51,72,0.4);
      transition:background 0.15s;
      &:hover { background:var(--color-bg-card-hover); }
    }
    .order-feed__icon {
      width:36px; height:36px; border-radius:10px;
      display:flex; align-items:center; justify-content:center; flex-shrink:0;
      .material-icons { font-size:18px; }
    }
    .order-feed__info { flex:1; }
  `]
})
export class LogsComponent implements OnInit, OnDestroy {
  syncLogs: SyncLogEntry[] = [];
  orderLogs: OrderLog[] = [];
  isLive  = true;
  lastUpdate = new Date();
  private sub = new Subscription();
  private autoSyncSub?: Subscription;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.sub.add(this.api.getSyncLogs().subscribe(logs => {
      if (this.isLive) { this.syncLogs = logs; this.lastUpdate = new Date(); }
    }));
    this.sub.add(this.api.getOrderLogs().subscribe(logs => {
      this.orderLogs = logs;
    }));
    // Simulate auto-sync every 30 seconds
    this.autoSyncSub = interval(30000).subscribe(() => {
      if (this.isLive) this.api.simulateSyncCycle();
    });
  }

  toggleLive(): void { this.isLive = !this.isLive; }
  clearLogs(): void { this.syncLogs = []; }
  triggerSync(): void { this.api.simulateSyncCycle(); }

  simulateOrder(): void {
    const channels: ('AMAZON' | 'MIRAVIA')[] = ['AMAZON', 'MIRAVIA'];
    const ch = channels[Math.floor(Math.random() * 2)];
    const id = ch === 'AMAZON' ? `AMZ-${Math.floor(Math.random()*9000+1000)}` : `MRV-${Math.floor(Math.random()*9000+1000)}`;
    this.api.addOrderLog({
      id: 'log-' + Date.now(),
      orderId: id,
      sourceChannel: ch,
      processedAt: new Date().toISOString(),
      status: 'PROCESSED'
    });
    const now = new Date();
    this.api.addSyncLog({
      time: now.toTimeString().slice(0,8),
      level: 'OK',
      message: `Webhook recibido: ${id} desde ${ch} → procesado correctamente`
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.autoSyncSub?.unsubscribe();
  }
}
