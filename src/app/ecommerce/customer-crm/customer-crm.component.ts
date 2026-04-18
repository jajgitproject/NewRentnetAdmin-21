// @ts-nocheck
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { EcommerceService } from '../core/ecommerce.service';
import { Customer } from '../core/ecommerce.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-customer-crm',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    BreadcrumbComponent,
  ],
  templateUrl: './customer-crm.component.html',
  styleUrls: ['./customer-crm.component.scss'],
})
export class CustomerCRMComponent implements OnInit {
  private ecommerceService = inject(EcommerceService);
  public customers: Customer[] = [];

  ngOnInit(): void {
    this.ecommerceService.customers$.subscribe((data) => {
      this.customers = data;
    });
  }
}

