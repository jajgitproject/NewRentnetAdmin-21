// @ts-nocheck
import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

export interface PerformanceMetric {
  id: string;
  title: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  icon: string;
  color: string;
}

@Component({
  standalone: false,
  selector: 'app-performance-metrics-grid',
  templateUrl: './performance-metrics-grid.component.html',
  styleUrls: ['./performance-metrics-grid.component.scss'],
  imports: [MatCardModule, MatIconModule, DecimalPipe, CommonModule],
})
export class PerformanceMetricsGridComponent {
  @Input() metrics: PerformanceMetric[] = [];
  @Input() columns: number = 3;

  getGridClass(): string {
    return `metrics-grid grid-cols-${this.columns}`;
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up':
        return 'trending_up';
      case 'down':
        return 'trending_down';
      case 'stable':
        return 'trending_flat';
      default:
        return 'trending_flat';
    }
  }

  getTrendClass(trend: string): string {
    switch (trend) {
      case 'up':
        return 'trend-up';
      case 'down':
        return 'trend-down';
      case 'stable':
        return 'trend-stable';
      default:
        return 'trend-stable';
    }
  }

  getProgressPercentage(metric: PerformanceMetric): number {
    return Math.min((metric.value / metric.target) * 100, 100);
  }

  getProgressColor(metric: PerformanceMetric): string {
    const percentage = this.getProgressPercentage(metric);
    if (percentage >= 90) return 'progress-success';
    if (percentage >= 70) return 'progress-warning';
    return 'progress-danger';
  }

  formatValue(value: number, unit: string): string {
    if (unit === 'percentage') {
      return `${value}%`;
    }
    if (unit === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(value);
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  }

  formatTrendValue(trendValue: number): string {
    return `${Math.abs(trendValue)}%`;
  }
}

