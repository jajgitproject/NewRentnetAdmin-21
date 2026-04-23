// @ts-nocheck
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgScrollbar } from 'ngx-scrollbar';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
  avatar?: string;
  icon?: string;
}

@Component({
  standalone: false,
  selector: 'app-notification-panel',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatDividerModule,
    MatTooltipModule,
    NgScrollbar,
  ],
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss'],
})
export class NotificationPanelComponent {
  @Input() title: string = 'Notifications';
  @Input() notifications: NotificationItem[] = [];
  @Input() maxHeight: string = '400px';
  @Input() showMarkAllRead: boolean = true;
  @Input() showClearAll: boolean = true;
  @Input() emptyMessage: string = 'No notifications';

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  markAsRead(notification: NotificationItem): void {
    notification.read = true;
  }

  markAllAsRead(): void {
    this.notifications.forEach((n) => (n.read = true));
  }

  clearAll(): void {
    this.notifications.length = 0;
  }

  removeNotification(notificationId: string): void {
    const index = this.notifications.findIndex((n) => n.id === notificationId);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  onNotificationClick(notification: NotificationItem): void {
    if (!notification.read) {
      this.markAsRead(notification);
    }
  }

  onActionClick(notification: NotificationItem, event: Event): void {
    event.stopPropagation();
    if (notification.action) {
      notification.action.handler();
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning_amber';
      case 'error':
        return 'error_outline';
      default:
        return 'info';
    }
  }

  getNotificationClass(type: string): string {
    return `notification-${type}`;
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }
}


