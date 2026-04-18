// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbar } from 'ngx-scrollbar';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  performance: number;
  tasks: {
    completed: number;
    total: number;
  };
  revenue: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
}

@Component({
  selector: 'app-team-performance-table',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    NgScrollbar,
  ],
  templateUrl: './team-performance-table.component.html',
  styleUrls: ['./team-performance-table.component.scss'],
})
export class TeamPerformanceTableComponent implements OnInit {
  @Input() title: string = 'Team Performance';
  @Input() data: TeamMember[] = [];

  displayedColumns: string[] = [
    'name',
    'role',
    'performance',
    'tasks',
    'revenue',
    'status',
  ];
  sortedData: TeamMember[] = [];

  constructor() {}

  ngOnInit(): void {
    if (this.data.length === 0) {
      this.generateDemoData();
    }
    this.sortedData = [...this.data];
  }

  private generateDemoData(): void {
    this.data = [
      {
        id: 'TM001',
        name: 'John Smith',
        role: 'Senior Developer',
        performance: 92,
        tasks: { completed: 45, total: 50 },
        revenue: 28500,
        status: 'excellent',
      },
      {
        id: 'TM002',
        name: 'Emily Johnson',
        role: 'UX Designer',
        performance: 88,
        tasks: { completed: 32, total: 38 },
        revenue: 22800,
        status: 'good',
      },
    ];
  }

  sortData(sort: Sort): void {
    const data = [...this.data];
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'role':
          return this.compare(a.role, b.role, isAsc);
        case 'performance':
          return this.compare(a.performance, b.performance, isAsc);
        case 'tasks':
          return this.compare(
            a.tasks.completed / a.tasks.total,
            b.tasks.completed / b.tasks.total,
            isAsc
          );
        case 'revenue':
          return this.compare(a.revenue, b.revenue, isAsc);
        case 'status':
          return this.compareStatus(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(
    a: number | string,
    b: number | string,
    isAsc: boolean
  ): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private compareStatus(a: string, b: string, isAsc: boolean): number {
    const statusOrder = { excellent: 4, good: 3, average: 2, poor: 1 };
    return this.compare(
      statusOrder[a as keyof typeof statusOrder],
      statusOrder[b as keyof typeof statusOrder],
      isAsc
    );
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'excellent':
        return 'excellent';
      case 'good':
        return 'good';
      case 'average':
        return 'average';
      case 'poor':
        return 'poor';
      default:
        return '';
    }
  }

  getTaskCompletionPercentage(completed: number, total: number): number {
    return (completed / total) * 100;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
}

