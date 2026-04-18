// @ts-nocheck
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: false,
  selector: 'app-compact-stat-card',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './compact-stat-card.component.html',
  styleUrls: ['./compact-stat-card.component.scss']
})
export class CompactStatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = '';
  @Input() iconColor: string = 'primary';
  @Input() iconBackground: string = '#f8f9fa';
  @Input() trend: number = 0;
  @Input() trendLabel: string = '';
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() compact: boolean = true;

  get trendClass(): string {
    if (this.trend > 0) return 'trend-positive';
    if (this.trend < 0) return 'trend-negative';
    return 'trend-neutral';
  }

  get trendIcon(): string {
    if (this.trend > 0) return 'arrow_upward';
    if (this.trend < 0) return 'arrow_downward';
    return 'remove';
  }

  get iconColorClass(): string {
    return `icon-${this.iconColor}`;
  }
}

