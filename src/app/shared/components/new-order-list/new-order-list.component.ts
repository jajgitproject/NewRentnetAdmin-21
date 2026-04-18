// @ts-nocheck
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

interface Customer {
  image: string;
}

interface Order {
  product: string;
  customers: Customer[];
  extraCustomers?: number;
  total: string;
}

@Component({
  standalone: false,
  selector: 'app-new-order-list',
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './new-order-list.component.html',
  styleUrl: './new-order-list.component.scss',
})
export class NewOrderListComponent {
  displayedColumns: string[] = ['product', 'customers', 'total'];

  // Sample data for orders
  ordersDatasource: Order[] = [
    {
      product: 'iPhone X',
      customers: [{ image: 'assets/images/user/user1.jpg' }],
      extraCustomers: 2,
      total: '$8999',
    },
    {
      product: 'Pixel 2',
      customers: [{ image: 'assets/images/user/user3.jpg' }],
      extraCustomers: 4,
      total: '$5550',
    },
    {
      product: 'OnePlus',
      customers: [{ image: 'assets/images/user/user2.jpg' }],
      extraCustomers: 1,
      total: '$9000',
    },
    {
      product: 'Galaxy',
      customers: [{ image: 'assets/images/user/user6.jpg' }],
      extraCustomers: 5,
      total: '$7500',
    },
    {
      product: 'Moto Z2',
      customers: [{ image: 'assets/images/user/user7.jpg' }],
      extraCustomers: 2,
      total: '$8500',
    },
    {
      product: 'iPhone X',
      customers: [{ image: 'assets/images/user/user8.jpg' }],
      extraCustomers: 3,
      total: '$8999',
    },
    {
      product: 'Pixel 2',
      customers: [{ image: 'assets/images/user/user9.jpg' }],
      extraCustomers: 4,
      total: '$5550',
    },
    {
      product: 'OnePlus',
      customers: [{ image: 'assets/images/user/user3.jpg' }],
      extraCustomers: 2,
      total: '$9000',
    },
    {
      product: 'Galaxy',
      customers: [{ image: 'assets/images/user/user5.jpg' }],
      extraCustomers: 1,
      total: '$7500',
    },
  ];
}


