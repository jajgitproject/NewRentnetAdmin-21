// @ts-nocheck
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EcommerceService } from '../core/ecommerce.service';
import { Invoice } from '../core/ecommerce.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    BreadcrumbComponent,
  ],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit {
  private ecommerceService = inject(EcommerceService);
  public invoices: Invoice[] = [];
  public selectedInvoice: Invoice | null = null;

  ngOnInit(): void {
    this.ecommerceService.invoices$.subscribe((data) => {
      this.invoices = data;
    });
  }

  printInvoice(): void {
    window.print();
  }
}

