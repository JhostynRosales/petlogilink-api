import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe, CurrencyPipe } from '@angular/common';
import { ApiService, DashboardMetrics, OrderLog } from '../../core/services/api.service';
import { Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DatePipe, CurrencyPipe],
  template: `
    <div class="dashboard">
      <!-- Header row -->
      <div class="dashboard__header mb-6">
        <div>
          <h2 style="font-size:20px;font-weight:700;">Panel de Control</h2>
          <p class="text-muted fs-12">Métricas en tiempo real · Última sincronización: hace 2 min</p>
        </div>
        <button class="btn btn-primary" (click)="runSync()">
          <span class="material-icons">sync</span> Ejecutar Sync Manual
        </button>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid mb-6" *ngIf="metrics">
        <div class="stat-card">
          <div class="stat-card__icon" style="background:rgba(108,99,255,0.15)">
            <span class="material-icons" style="color:var(--color-accent)">shopping_cart</span>
          </div>
          <div class="stat-card__value">{{ metrics.totalOrders }}</div>
          <div class="stat-card__label">Pedidos Totales</div>
          <div class="stat-card__delta text-success">+12% esta semana</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon" style="background:rgba(255,153,0,0.15)">
            <span class="material-icons" style="color:var(--color-amazon)">storefront</span>
          </div>
          <div class="stat-card__value">{{ metrics.amazonOrders }}</div>
          <div class="stat-card__label">Pedidos Amazon</div>
          <div class="stat-card__delta text-muted">Canal principal</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon" style="background:rgba(233,30,140,0.15)">
            <span class="material-icons" style="color:var(--color-miravia)">local_mall</span>
          </div>
          <div class="stat-card__value">{{ metrics.miraviaOrders }}</div>
          <div class="stat-card__label">Pedidos Miravia</div>
          <div class="stat-card__delta text-muted">Canal secundario</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon" style="background:rgba(239,68,68,0.15)">
            <span class="material-icons" style="color:var(--color-danger)">warning</span>
          </div>
          <div class="stat-card__value">{{ metrics.lowStockProducts }}</div>
          <div class="stat-card__label">Alertas Stock Bajo</div>
          <div class="stat-card__delta text-danger">≤ 5 unidades</div>
        </div>
      </div>

      <!-- Charts row -->
      <div class="charts-grid mb-6">
        <div class="card">
          <div class="card__header">
            <div>
              <div class="card__title">Distribución por Canal</div>
              <div class="card__subtitle">Pedidos procesados por marketplace</div>
            </div>
          </div>
          <div style="max-width:220px;margin:0 auto;">
            <canvas #doughnutChart></canvas>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-dot" style="background:var(--color-amazon)"></span>
              <span>Amazon ({{ metrics?.amazonOrders }})</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background:var(--color-miravia)"></span>
              <span>Miravia ({{ metrics?.miraviaOrders }})</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__header">
            <div>
              <div class="card__title">Pedidos por Hora</div>
              <div class="card__subtitle">Actividad del día de hoy</div>
            </div>
          </div>
          <canvas #barChart style="max-height:200px;"></canvas>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="card">
        <div class="card__header">
          <div>
            <div class="card__title">Pedidos Recientes</div>
            <div class="card__subtitle">Últimas integraciones procesadas</div>
          </div>
          <span class="badge badge-success">Live</span>
        </div>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>ID Pedido</th><th>Canal</th><th>Fecha</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of recentOrders">
                <td><span class="table-sku">{{ order.orderId }}</span></td>
                <td>
                  <span class="badge" [ngClass]="order.sourceChannel === 'AMAZON' ? 'badge-amazon' : 'badge-miravia'">
                    {{ order.sourceChannel }}
                  </span>
                </td>
                <td class="text-muted fs-12">{{ order.processedAt | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>
                  <span class="badge" [ngClass]="order.status === 'PROCESSED' ? 'badge-success' : 'badge-danger'">
                    {{ order.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard__header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
    .kpi-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; }
    .charts-grid { display:grid; grid-template-columns:280px 1fr; gap:16px; }
    @media(max-width:768px){ .charts-grid{ grid-template-columns:1fr; } }
    .chart-legend { display:flex; gap:16px; justify-content:center; margin-top:12px; }
    .legend-item { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--color-text-muted); }
    .legend-dot { width:10px; height:10px; border-radius:50%; }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('doughnutChart') doughnutRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChart')      barRef!:      ElementRef<HTMLCanvasElement>;

  metrics: DashboardMetrics | null = null;
  recentOrders: OrderLog[] = [];
  private subs = new Subscription();
  private doughnutChart?: Chart;
  private barChart?: Chart;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.subs.add(this.api.getDashboardMetrics().subscribe(m => {
      this.metrics = m;
      this.updateDoughnut();
    }));
    this.subs.add(this.api.getOrderLogs().subscribe(logs => {
      this.recentOrders = [...logs].slice(0, 5);
    }));
  }

  ngAfterViewInit(): void {
    this.buildDoughnut();
    this.buildBar();
  }

  buildDoughnut(): void {
    if (!this.doughnutRef) return;
    this.doughnutChart = new Chart(this.doughnutRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Amazon', 'Miravia'],
        datasets: [{ data: [3, 2], backgroundColor: ['#ff9900', '#e91e8c'], borderWidth: 0, hoverOffset: 6 }]
      },
      options: {
        cutout: '70%', plugins: { legend: { display: false } },
        animation: { animateRotate: true }
      }
    });
  }

  buildBar(): void {
    if (!this.barRef) return;
    this.barChart = new Chart(this.barRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['08h','09h','10h','11h','12h','13h','14h','15h'],
        datasets: [
          { label: 'Amazon',  data: [2,1,0,1,1,0,0,0], backgroundColor: 'rgba(255,153,0,0.7)',    borderRadius: 4 },
          { label: 'Miravia', data: [0,0,1,0,1,0,0,0], backgroundColor: 'rgba(233,30,140,0.7)',   borderRadius: 4 }
        ]
      },
      options: {
        plugins: { legend: { labels: { color: '#9ca3c0', font: { size: 11 } } } },
        scales: {
          x: { ticks: { color: '#5a6080' }, grid: { color: 'rgba(45,51,72,0.5)' } },
          y: { ticks: { color: '#5a6080', stepSize: 1 }, grid: { color: 'rgba(45,51,72,0.5)' } }
        }
      }
    });
  }

  updateDoughnut(): void {
    if (!this.doughnutChart || !this.metrics) return;
    this.doughnutChart.data.datasets[0].data = [this.metrics.amazonOrders, this.metrics.miraviaOrders];
    this.doughnutChart.update();
  }

  runSync(): void { this.api.simulateSyncCycle(); }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.doughnutChart?.destroy();
    this.barChart?.destroy();
  }
}
