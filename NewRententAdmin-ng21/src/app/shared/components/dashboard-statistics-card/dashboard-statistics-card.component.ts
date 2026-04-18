// @ts-nocheck
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: false,
  selector: 'app-dashboard-statistics-card',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-statistics-card.component.html',
  styleUrls: ['./dashboard-statistics-card.component.scss'],
})
export class DashboardStatisticsCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() subtitle: string = '';
  @Input() icon: string = '';
  @Input() iconColor: string = 'primary';
  @Input() backgroundColor: string = '#f8f9fa';
  @Input() trendValue: number = 0;
  @Input() trendLabel: string = '';
  @Input() showTrend: boolean = true;
  @Input() prefix: string = '';
  @Input() suffix: string = '';

  get trendClass(): string {
    if (this.trendValue > 0) return 'trend-up';
    if (this.trendValue < 0) return 'trend-down';
    return 'trend-neutral';
  }

  get trendIcon(): string {
    if (this.trendValue > 0) return 'trending_up';
    if (this.trendValue < 0) return 'trending_down';
    return 'trending_flat';
  }
}

