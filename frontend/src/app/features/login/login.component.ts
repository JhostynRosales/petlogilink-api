import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, FormsModule],
  template: `
    <div class="login-page">
      <!-- Background animated blobs -->
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>

      <div class="login-card">
        <div class="login-card__logo">
          <span class="material-icons">hub</span>
        </div>
        <h1 class="login-card__title">PetLogiLink</h1>
        <p class="login-card__subtitle">Sistema de Automatización Logística</p>

        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label for="username">Usuario</label>
            <div class="input-wrapper">
              <span class="material-icons input-icon">person</span>
              <input
                id="username" class="input input-with-icon"
                type="text" placeholder="admin"
                [(ngModel)]="username" name="username" required>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="input-wrapper">
              <span class="material-icons input-icon">lock</span>
              <input
                id="password" class="input input-with-icon"
                [type]="showPass ? 'text' : 'password'" placeholder="••••••••"
                [(ngModel)]="password" name="password" required>
              <button type="button" class="pass-toggle" (click)="showPass = !showPass">
                <span class="material-icons">{{ showPass ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <div class="login-hint">
            <span class="material-icons" style="font-size:14px;color:var(--color-warning)">info</span>
            Demo: <strong>admin</strong> / <strong>admin123</strong>
          </div>

          <div *ngIf="errorMsg" class="login-error">
            <span class="material-icons">error</span> {{ errorMsg }}
          </div>

          <button type="submit" class="btn btn-primary btn-login" [disabled]="loading">
            <div *ngIf="loading" class="spinner"></div>
            <span *ngIf="!loading" class="material-icons">login</span>
            {{ loading ? 'Autenticando...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <p class="login-footer">
          <span class="material-icons" style="font-size:12px">code</span>
          Java Spring Boot + Angular 18 &nbsp;·&nbsp; Portfolio Project
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      background: var(--color-bg-primary);
      display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden;
    }

    .blob {
      position: absolute; border-radius: 50%;
      filter: blur(80px); opacity: 0.12; animation: float 8s ease-in-out infinite;
    }
    .blob-1 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, #6c63ff, transparent);
      top: -100px; left: -100px;
    }
    .blob-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, #4ecdc4, transparent);
      bottom: -80px; right: -80px; animation-delay: -4s;
    }
    @keyframes float {
      0%, 100% { transform: translate(0,0) scale(1); }
      50%       { transform: translate(30px,20px) scale(1.05); }
    }

    .login-card {
      position: relative; z-index: 10;
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 40px 36px;
      width: 100%; max-width: 400px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4), var(--shadow-glow);
      display: flex; flex-direction: column; align-items: center; gap: 6px;
    }

    .login-card__logo {
      width: 56px; height: 56px; border-radius: 16px;
      background: linear-gradient(135deg, #6c63ff, #4ecdc4);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 4px;
      box-shadow: 0 8px 24px rgba(108,99,255,0.4);
      .material-icons { font-size: 28px; color: #fff; }
    }

    .login-card__title {
      font-size: 24px; font-weight: 700; color: var(--color-text-primary);
    }
    .login-card__subtitle {
      font-size: 13px; color: var(--color-text-muted); margin-bottom: 20px;
    }

    .login-form {
      width: 100%; display: flex; flex-direction: column; gap: 16px;
    }

    .input-wrapper { position: relative; display: flex; align-items: center; }
    .input-icon {
      position: absolute; left: 12px; font-size: 18px !important;
      color: var(--color-text-muted); pointer-events: none;
    }
    .input-with-icon { padding-left: 40px !important; }
    .pass-toggle {
      position: absolute; right: 10px; background: none; border: none;
      color: var(--color-text-muted); cursor: pointer; padding: 4px;
      transition: color 0.2s; display: flex; align-items: center;
      &:hover { color: var(--color-accent); }
      .material-icons { font-size: 18px; }
    }

    .login-hint {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; color: var(--color-text-muted);
      background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2);
      border-radius: var(--radius-sm); padding: 8px 12px;
    }

    .login-error {
      display: flex; align-items: center; gap: 6px;
      font-size: 13px; color: var(--color-danger);
      background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
      border-radius: var(--radius-sm); padding: 10px 14px;
      .material-icons { font-size: 16px; }
    }

    .btn-login {
      width: 100%; justify-content: center; padding: 12px;
      font-size: 14px; margin-top: 4px;
      &:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
    }

    .login-footer {
      display: flex; align-items: center; gap: 4px;
      font-size: 11px; color: var(--color-text-muted); margin-top: 8px;
    }
  `]
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  loading  = false;
  errorMsg = '';
  showPass = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) this.router.navigate(['/app/dashboard']);
  }

  onLogin(): void {
    if (!this.username || !this.password) { this.errorMsg = 'Introduce usuario y contraseña.'; return; }
    this.loading = true; this.errorMsg = '';
    this.auth.login(this.username, this.password).subscribe(user => {
      this.loading = false;
      if (user) this.router.navigate(['/app/dashboard']);
      else this.errorMsg = 'Credenciales incorrectas. Prueba admin / admin123.';
    });
  }
}
