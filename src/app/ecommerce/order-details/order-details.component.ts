// @ts-nocheck
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EcommerceService } from '../core/ecommerce.service';
import { Order } from '../core/ecommerce.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, BreadcrumbComponent],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  private ecommerceService = inject(EcommerceService);
  public order: Order | undefined;

  ngOnInit(): void {
    // For demo purposes, we'll fetch the first mock order
    this.order = this.ecommerceService.getOrderById('ORD-7721');
  }
}

