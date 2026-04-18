// @ts-nocheck
import { Component, Input, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface SalesPerformanceData {
  id: number;
  productName: string;
  category: string;
  sales: number;
  revenue: number;
  growth: number;
  status: string;
}

@Component({
  standalone: false,
  selector: 'app-sales-performance-table',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './sales-performance-table.component.html',
  styleUrls: ['./sales-performance-table.component.scss'],
})
export class SalesPerformanceTableComponent implements OnChanges, AfterViewInit {
  @Input() tableData: SalesPerformanceData[] = [];
  @Input() title: string = 'Sales Performance';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'productName',
    'category',
    'sales',
    'revenue',
    'growth',
    'status',
  ];
  dataSource = new MatTableDataSource<SalesPerformanceData>();

  ngOnChanges() {
    this.dataSource.data = this.tableData.length
      ? this.tableData
      : this.getDefaultData();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private getDefaultData(): SalesPerformanceData[] {
    return [
      {
        id: 1,
        productName: 'Product A',
        category: 'Electronics',
        sales: 150,
        revenue: 7500,
        growth: 12.5,
        status: 'Active',
      },
      {
        id: 2,
        productName: 'Product B',
        category: 'Clothing',
        sales: 89,
        revenue: 4450,
        growth: -3.2,
        status: 'Active',
      },
      {
        id: 3,
        productName: 'Product C',
        category: 'Home',
        sales: 234,
        revenue: 11700,
        growth: 25.8,
        status: 'Active',
      },
      {
        id: 4,
        productName: 'Product D',
        category: 'Electronics',
        sales: 67,
        revenue: 3350,
        growth: 5.1,
        status: 'Inactive',
      },
      {
        id: 5,
        productName: 'Product E',
        category: 'Sports',
        sales: 189,
        revenue: 9450,
        growth: 18.3,
        status: 'Active',
      },
      {
        id: 6,
        productName: 'Product F',
        category: 'Books',
        sales: 45,
        revenue: 2250,
        growth: -8.7,
        status: 'Active',
      },
      {
        id: 7,
        productName: 'Product G',
        category: 'Electronics',
        sales: 312,
        revenue: 15600,
        growth: 32.1,
        status: 'Active',
      },
      {
        id: 8,
        productName: 'Product H',
        category: 'Clothing',
        sales: 78,
        revenue: 3900,
        growth: 2.4,
        status: 'Inactive',
      },
    ];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getGrowthClass(growth: number): string {
    if (growth > 0) return 'growth-positive';
    if (growth < 0) return 'growth-negative';
    return 'growth-neutral';
  }

  getStatusClass(status: string): string {
    return status.toLowerCase() === 'active'
      ? 'status-active'
      : 'status-inactive';
  }
}

