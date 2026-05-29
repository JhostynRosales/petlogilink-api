import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  template: `
    <div class="layout">
      <!-- SIDEBAR -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar__brand">
          <div class="sidebar__logo">
            <span class="material-icons">hub</span>
          </div>
          <span class="sidebar__name" *ngIf="!sidebarCollapsed">PetLogiLink</span>
        </div>

        <nav class="sidebar__nav">
          <a class="sidebar__link" routerLink="/app/dashboard" routerLinkActive="active">
            <span class="material-icons">dashboard</span>
            <span *ngIf="!sidebarCollapsed">Dashboard</span>
          </a>
          <a class="sidebar__link" routerLink="/app/inventory" routerLinkActive="active">
            <span class="material-icons">inventory_2</span>
            <span *ngIf="!sidebarCollapsed">Inventario</span>
          </a>
          <a class="sidebar__link" routerLink="/app/logs" routerLinkActive="active">
            <span class="material-icons">terminal</span>
            <span *ngIf="!sidebarCollapsed">Logs en Tiempo Real</span>
          </a>
        </nav>

        <div class="sidebar__footer" *ngIf="!sidebarCollapsed">
          <div class="sidebar__user">
            <div class="sidebar__avatar">{{ userInitial }}</div>
            <div>
              <div class="sidebar__username">{{ username }}</div>
              <div class="sidebar__role">Warehouse Manager</div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" (click)="logout()">
            <span class="material-icons">logout</span>
          </button>
        </div>
      </aside>

      <!-- MAIN AREA -->
      <div class="main-area">
        <!-- TOPBAR -->
        <header class="topbar">
          <div class="topbar__left">
            <button class="btn btn-icon btn-secondary" (click)="sidebarCollapsed = !sidebarCollapsed">
              <span class="material-icons">menu</span>
            </button>
            <div class="topbar__title" *ngIf="currentRoute">
              {{ routeLabel }}
            </div>
          </div>
          <div class="topbar__right">
            <div class="flex gap-2" style="align-items:center">
              <div class="pulse-dot"></div>
              <span class="fs-12 text-muted">API Conectada</span>
            </div>
          </div>
        </header>

        <!-- PAGE CONTENT -->
        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout { display: flex; height: 100vh; overflow: hidden; }

    .sidebar {
      width: 240px; min-width: 240px; background: var(--color-bg-secondary);
      border-right: 1px solid var(--color-border);
      display: flex; flex-direction: column;
      transition: all 0.25s ease; overflow: hidden;
      &.collapsed { width: 60px; min-width: 60px; }
    }

    .sidebar__brand {
      display: flex; align-items: center; gap: 10px;
      padding: 20px 16px; border-bottom: 1px solid var(--color-border);
    }
    .sidebar__logo {
      width: 36px; height: 36px; min-width: 36px;
      background: linear-gradient(135deg, #6c63ff, #4ecdc4);
      border-radius: 10px; display: flex; align-items: center; justify-content: center;
      .material-icons { font-size: 20px; color: #fff; }
    }
    .sidebar__name { font-weight: 700; font-size: 16px; color: var(--color-text-primary); white-space: nowrap; }

    .sidebar__nav { flex: 1; padding: 12px 8px; display: flex; flex-direction: column; gap: 4px; }
    .sidebar__link {
      display: flex; align-items: center; gap: 12px; padding: 10px 12px;
      border-radius: var(--radius-sm); color: var(--color-text-muted);
      text-decoration: none; font-size: 13px; font-weight: 500;
      transition: var(--transition); white-space: nowrap;
      &:hover { background: var(--color-bg-card); color: var(--color-text-primary); }
      &.active { background: var(--color-accent-glow); color: var(--color-accent);
        border: 1px solid rgba(108,99,255,0.3); }
      .material-icons { font-size: 20px; min-width: 20px; }
    }

    .sidebar__footer {
      padding: 12px; border-top: 1px solid var(--color-border);
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
    }
    .sidebar__user { display: flex; align-items: center; gap: 10px; overflow: hidden; }
    .sidebar__avatar {
      width: 32px; height: 32px; min-width: 32px; border-radius: 50%;
      background: linear-gradient(135deg, #6c63ff, #4ecdc4);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px; color: #fff;
    }
    .sidebar__username { font-size: 13px; font-weight: 600; color: var(--color-text-primary); white-space: nowrap; }
    .sidebar__role { font-size: 11px; color: var(--color-text-muted); white-space: nowrap; }

    .main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

    .topbar {
      height: 56px; min-height: 56px; background: var(--color-bg-secondary);
      border-bottom: 1px solid var(--color-border);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 20px; gap: 16px;
    }
    .topbar__left { display: flex; align-items: center; gap: 16px; }
    .topbar__right { display: flex; align-items: center; gap: 16px; }
    .topbar__title { font-size: 15px; font-weight: 600; color: var(--color-text-primary); }

    .content { flex: 1; overflow-y: auto; padding: 24px; background: var(--color-bg-primary); }
  `]
})
export class LayoutComponent {
  sidebarCollapsed = false;

  constructor(private auth: AuthService, private router: Router) {}

  get username(): string { return this.auth.getUser()?.username ?? 'admin'; }
  get userInitial(): string { return this.username.charAt(0).toUpperCase(); }
  get currentRoute(): string { return this.router.url; }
  get routeLabel(): string {
    if (this.currentRoute.includes('dashboard')) return 'Dashboard de Métricas';
    if (this.currentRoute.includes('inventory')) return 'Gestión de Inventario';
    if (this.currentRoute.includes('logs')) return 'Logs en Tiempo Real';
    return '';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
