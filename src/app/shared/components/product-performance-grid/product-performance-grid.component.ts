// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  revenue: number;
  rating: number;
  trend: 'up' | 'down' | 'stable';
}

@Component({
  selector: 'app-product-performance-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  templateUrl: './product-performance-grid.component.html',
  styleUrls: ['./product-performance-grid.component.scss']
})
export class ProductPerformanceGridComponent implements OnInit {
  @Input() title: string = 'Product Performance';
  @Input() products: Product[] = [];
  @Input() pageSize: number = 5;

  displayedColumns: string[] = ['name', 'category', 'price', 'stock', 'sales', 'revenue', 'rating', 'trend'];
  sortedData: Product[] = [];
  pagedData: Product[] = [];
  
  // Pagination
  pageSizeOptions: number[] = [5, 10, 25];
  pageIndex: number = 0;
  totalProducts: number = 0;

  constructor() {}

  ngOnInit(): void {
    if (this.products.length === 0) {
      this.generateDemoData();
    }
    this.sortedData = [...this.products];
    this.totalProducts = this.products.length;
    this.updatePagedData();
  }

  private generateDemoData(): void {
    this.products = [
      {
        id: 'P001',
        name: 'Premium Laptop',
        category: 'Electronics',
        price: 1299.99,
        stock: 45,
        sales: 128,
        revenue: 166398.72,
        rating: 4.7,
        trend: 'up'
      },
      {
        id: 'P002',
        name: 'Wireless Headphones',
        category: 'Audio',
        price: 199.99,
        stock: 120,
        sales: 256,
        revenue: 51197.44,
        rating: 4.5,
        trend: 'up'
      },
      {
        id: 'P003',
        name: 'Smart Watch',
        category: 'Wearables',
        price: 249.99,
        stock: 78,
        sales: 187,
        revenue: 46748.13,
        rating: 4.2,
        trend: 'stable'
      },
      {
        id: 'P004',
        name: 'Bluetooth Speaker',
        category: 'Audio',
        price: 89.99,
        stock: 210,
        sales: 312,
        revenue: 28076.88,
        rating: 4.4,
        trend: 'up'
      },
      {
        id: 'P005',
        name: 'Gaming Console',
        category: 'Gaming',
        price: 499.99,
        stock: 32,
        sales: 98,
        revenue: 48999.02,
        rating: 4.8,
        trend: 'up'
      },
      {
        id: 'P006',
        name: 'Smartphone',
        category: 'Electronics',
        price: 899.99,
        stock: 65,
        sales: 145,
        revenue: 130498.55,
        rating: 4.6,
        trend: 'stable'
      },
      {
        id: 'P007',
        name: 'Tablet',
        category: 'Electronics',
        price: 349.99,
        stock: 54,
        sales: 87,
        revenue: 30449.13,
        rating: 4.3,
        trend: 'down'
      },
      {
        id: 'P008',
        name: 'Wireless Mouse',
        category: 'Accessories',
        price: 49.99,
        stock: 180,
        sales: 234,
        revenue: 11697.66,
        rating: 4.1,
        trend: 'stable'
      },
      {
        id: 'P009',
        name: 'External SSD',
        category: 'Storage',
        price: 129.99,
        stock: 95,
        sales: 167,
        revenue: 21708.33,
        rating: 4.5,
        trend: 'up'
      },
      {
        id: 'P010',
        name: 'Wireless Keyboard',
        category: 'Accessories',
        price: 79.99,
        stock: 110,
        sales: 143,
        revenue: 11438.57,
        rating: 4.0,
        trend: 'down'
      }
    ];
  }

  sortData(sort: Sort): void {
    const data = [...this.products];
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      this.updatePagedData();
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'category': return this.compare(a.category, b.category, isAsc);
        case 'price': return this.compare(a.price, b.price, isAsc);
        case 'stock': return this.compare(a.stock, b.stock, isAsc);
        case 'sales': return this.compare(a.sales, b.sales, isAsc);
        case 'revenue': return this.compare(a.revenue, b.revenue, isAsc);
        case 'rating': return this.compare(a.rating, b.rating, isAsc);
        case 'trend': return this.compareTrend(a.trend, b.trend, isAsc);
        default: return 0;
      }
    });
    
    this.updatePagedData();
  }

  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private compareTrend(a: string, b: string, isAsc: boolean): number {
    const trendOrder = { 'up': 3, 'stable': 2, 'down': 1 };
    return this.compare(
      trendOrder[a as keyof typeof trendOrder], 
      trendOrder[b as keyof typeof trendOrder], 
      isAsc
    );
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedData();
  }

  private updatePagedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.pagedData = this.sortedData.slice(startIndex, startIndex + this.pageSize);
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      case 'stable': return 'trending_flat';
      default: return 'help';
    }
  }

  getTrendClass(trend: string): string {
    switch (trend) {
      case 'up': return 'trend-up';
      case 'down': return 'trend-down';
      case 'stable': return 'trend-stable';
      default: return '';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  getRatingStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars: number[] = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(1); // Full star
      } else if (i === fullStars && hasHalfStar) {
        stars.push(0.5); // Half star
      } else {
        stars.push(0); // Empty star
      }
    }
    
    return stars;
  }
}
