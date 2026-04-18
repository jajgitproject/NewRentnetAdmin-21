// @ts-nocheck
import { Route } from '@angular/router';

export const ECOMMERCE_ROUTES: Route[] = [
  {
    path: 'product-catalog',
    loadComponent: () =>
      import('./product-catalog/product-catalog.component').then(
        (m) => m.ProductCatalogComponent
      ),
  },
  {
    path: 'order-details',
    loadComponent: () =>
      import('./order-details/order-details.component').then(
        (m) => m.OrderDetailsComponent
      ),
  },
  {
    path: 'customer-crm',
    loadComponent: () =>
      import('./customer-crm/customer-crm.component').then(
        (m) => m.CustomerCRMComponent
      ),
  },
  {
    path: 'invoices',
    loadComponent: () =>
      import('./invoices/invoices.component').then((m) => m.InvoicesComponent),
  },
];

