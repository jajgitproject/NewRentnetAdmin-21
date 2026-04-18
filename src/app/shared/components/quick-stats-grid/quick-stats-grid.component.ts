// @ts-nocheck
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

export interface QuickStat {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: number;
  prefix?: string;
  suffix?: string;
  subtitle?: string;
}

@Component({
  standalone: false,
  selector: 'app-quick-stats-grid',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './quick-stats-grid.component.html',
  styleUrls: ['./quick-stats-grid.component.scss'],
})
export class QuickStatsGridComponent {
  @Input() stats: QuickStat[] = [];
  @Input() columns: number = 2;
  @Input() compact: boolean = true;
  @Input() showTrends: boolean = true;
  @Input() cardBackground: string = '';

  get gridColumns(): string {
    return `repeat(${this.columns}, 1fr)`;
  }

  getTrendClass(trend: number | undefined): string {
    if (!trend) return '';
    if (trend > 0) return 'trend-positive';
    if (trend < 0) return 'trend-negative';
    return 'trend-neutral';
  }

  getTrendIcon(trend: number | undefined): string {
    if (!trend) return '';
    if (trend > 0) return 'arrow_upward';
    if (trend < 0) return 'arrow_downward';
    return 'remove';
  }

  getStatColorClass(color: string): string {
    return `stat-${color}`;
  }
}


