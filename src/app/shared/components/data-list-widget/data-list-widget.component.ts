// @ts-nocheck
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgScrollbar } from 'ngx-scrollbar';

export interface DataListItem {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
  subtitle?: string;
  action?: () => void;
  actionIcon?: string;
  actionLabel?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

@Component({
  standalone: false,
  selector: 'app-data-list-widget',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    NgScrollbar,
  ],
  templateUrl: './data-list-widget.component.html',
  styleUrls: ['./data-list-widget.component.scss'],
})
export class DataListWidgetComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() items: DataListItem[] = [];
  @Input() showDividers: boolean = true;
  @Input() showIcons: boolean = true;
  @Input() showActions: boolean = true;
  @Input() emptyMessage: string = 'No data available';

  onItemAction(item: DataListItem): void {
    if (item.action) {
      item.action();
    }
  }

  getTrendIcon(direction: 'up' | 'down' | 'neutral'): string {
    switch (direction) {
      case 'up':
        return 'trending_up';
      case 'down':
        return 'trending_down';
      default:
        return 'trending_flat';
    }
  }

  getTrendClass(direction: 'up' | 'down' | 'neutral'): string {
    switch (direction) {
      case 'up':
        return 'trend-up';
      case 'down':
        return 'trend-down';
      default:
        return 'trend-neutral';
    }
  }
}


