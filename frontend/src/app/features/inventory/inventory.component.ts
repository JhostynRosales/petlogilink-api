import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgFor, NgClass, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Product } from '../../core/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, CurrencyPipe, FormsModule],
  template: `
    <div class="inventory">
      <!-- Header -->
      <div class="inventory__header mb-6">
        <div>
          <h2 style="font-size:20px;font-weight:700;">Gestión de Inventario</h2>
          <p class="text-muted fs-12">{{ filteredProducts.length }} de {{ products.length }} productos · Sincronizado cada 5 min</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-4">
        <div class="filters-row">
          <div class="input-wrapper" style="flex:1;min-width:200px;">
            <span class="material-icons input-icon">search</span>
            <input class="input input-with-icon" type="text" placeholder="Buscar por SKU, EAN o nombre..."
              [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()">
          </div>
          <select class="input" style="max-width:180px" [(ngModel)]="stockFilter" (ngModelChange)="applyFilters()">
            <option value="">Todos los estados</option>
            <option value="ok">Stock OK (>5)</option>
            <option value="low">Stock Bajo (≤5)</option>
            <option value="out">Sin Stock (0)</option>
          </select>
          <button class="btn btn-secondary btn-sm" (click)="clearFilters()">
            <span class="material-icons">clear</span> Limpiar
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="card">
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>SKU / EAN</th>
                <th>Nombre del Producto</th>
                <th>Fabricante</th>
                <th>Stock</th>
                <th>Precio Venta</th>
                <th>Estado SEO</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of filteredProducts">
                <td>
                  <div class="table-sku">{{ product.sku }}</div>
                  <div style="font-size:11px;color:var(--color-text-muted)">{{ product.ean }}</div>
                </td>
                <td>
                  <div style="font-weight:500;font-size:13px;">{{ product.name }}</div>
                  <div class="text-muted fs-12" style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                    {{ product.seoDescription }}
                  </div>
                </td>
                <td class="text-muted fs-12">{{ product.manufacturer }}</td>
                <td>
                  <div class="stock-cell">
                    <span class="badge"
                      [ngClass]="product.stockQuantity === 0 ? 'badge-danger' : product.stockQuantity <= 5 ? 'badge-warning' : 'badge-success'">
                      {{ product.stockQuantity }} uds
                    </span>
                  </div>
                </td>
                <td>
                  <span *ngIf="editingSku !== product.sku" class="price-display">
                    {{ product.retailPrice | currency:'EUR':'symbol':'1.2-2':'es' }}
                  </span>
                  <input *ngIf="editingSku === product.sku" class="input price-input"
                    type="number" step="0.01" [(ngModel)]="editPrice"
                    (keyup.enter)="savePrice(product.sku)" (keyup.escape)="cancelEdit()">
                </td>
                <td>
                  <span class="badge badge-info" *ngIf="product.metaKeywords">
                    <span class="material-icons" style="font-size:10px;">check</span> SEO
                  </span>
                </td>
                <td>
                  <div class="flex gap-2">
                    <button *ngIf="editingSku !== product.sku"
                      class="btn btn-secondary btn-sm" title="Editar precio"
                      (click)="startEdit(product)">
                      <span class="material-icons" style="font-size:14px;">edit</span>
                    </button>
                    <button *ngIf="editingSku === product.sku"
                      class="btn btn-success btn-sm" (click)="savePrice(product.sku)">
                      <span class="material-icons" style="font-size:14px;">check</span>
                    </button>
                    <button *ngIf="editingSku === product.sku"
                      class="btn btn-secondary btn-sm" (click)="cancelEdit()">
                      <span class="material-icons" style="font-size:14px;">close</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredProducts.length === 0">
                <td colspan="7" style="text-align:center;padding:40px;color:var(--color-text-muted)">
                  <span class="material-icons" style="font-size:36px;display:block;margin-bottom:8px;opacity:0.3">inventory_2</span>
                  No se encontraron productos con los filtros aplicados.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer / Pagination info -->
        <div class="table-footer">
          <span class="text-muted fs-12">Mostrando {{ filteredProducts.length }} producto(s)</span>
          <div class="flex gap-2">
            <span class="badge badge-danger">{{ outOfStock }} sin stock</span>
            <span class="badge badge-warning">{{ lowStockCount }} stock bajo</span>
            <span class="badge badge-success">{{ okStockCount }} stock OK</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inventory__header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
    .filters-row { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
    .input-wrapper { position:relative; display:flex; align-items:center; }
    .input-icon { position:absolute; left:12px; font-size:18px !important; color:var(--color-text-muted); pointer-events:none; }
    .input-with-icon { padding-left:40px !important; }
    .price-display { font-weight:600; color:var(--color-text-primary); }
    .price-input { max-width:100px; padding:4px 8px !important; font-size:13px; }
    .table-footer { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-top:1px solid var(--color-border); }
    .stock-cell { display:flex; align-items:center; }
  `]
})
export class InventoryComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm  = '';
  stockFilter = '';
  editingSku  = '';
  editPrice   = 0;
  private sub = new Subscription();

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.sub.add(this.api.getProducts().subscribe(p => {
      this.products = p;
      this.applyFilters();
    }));
  }

  applyFilters(): void {
    let result = [...this.products];
    if (this.searchTerm) {
      const q = this.searchTerm.toLowerCase();
      result = result.filter(p =>
        p.sku.toLowerCase().includes(q) ||
        p.ean.includes(q) ||
        p.name.toLowerCase().includes(q)
      );
    }
    if (this.stockFilter === 'ok')  result = result.filter(p => p.stockQuantity > 5);
    if (this.stockFilter === 'low') result = result.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5);
    if (this.stockFilter === 'out') result = result.filter(p => p.stockQuantity === 0);
    this.filteredProducts = result;
  }

  clearFilters(): void { this.searchTerm = ''; this.stockFilter = ''; this.applyFilters(); }

  startEdit(product: Product): void { this.editingSku = product.sku; this.editPrice = product.retailPrice; }
  cancelEdit(): void { this.editingSku = ''; }

  savePrice(sku: string): void {
    if (this.editPrice > 0) this.api.updateProductPrice(sku, this.editPrice).subscribe();
    this.editingSku = '';
  }

  get outOfStock(): number  { return this.products.filter(p => p.stockQuantity === 0).length; }
  get lowStockCount(): number { return this.products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5).length; }
  get okStockCount(): number  { return this.products.filter(p => p.stockQuantity > 5).length; }

  ngOnDestroy(): void { this.sub.unsubscribe(); }
}
