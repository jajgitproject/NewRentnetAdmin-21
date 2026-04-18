// @ts-nocheck
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgScrollbar } from 'ngx-scrollbar';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  type: 'user' | 'system' | 'security' | 'project' | 'notification';
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
  icon?: string;
  priority: 'low' | 'medium' | 'high';
  metadata?: {
    [key: string]: unknown;
  };
}

@Component({
  standalone: false,
  selector: 'app-activity-feed',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatDividerModule,
    NgScrollbar,
    MatTooltipModule,
  ],
  templateUrl: './activity-feed.component.html',
  styleUrls: ['./activity-feed.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ActivityFeedComponent {
  @Input() title: string = 'Recent Activity';
  @Input() activities: ActivityItem[] = [];
  @Input() showHeader: boolean = true;
  @Input() showViewAll: boolean = true;
  @Input() maxActivities: number = 10;
  @Input() emptyMessage: string = 'No recent activities';

  get limitedActivities(): ActivityItem[] {
    return this.activities.slice(0, this.maxActivities);
  }

  getActivityIcon(activity: ActivityItem): string {
    if (activity.icon) return activity.icon;

    switch (activity.type) {
      case 'user':
        return 'person_outline';
      case 'system':
        return 'settings';
      case 'security':
        return 'security';
      case 'project':
        return 'work_outline';
      case 'notification':
        return 'notifications';
      default:
        return 'info';
    }
  }

  getActivityClass(activity: ActivityItem): string {
    return `activity-${activity.type}`;
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    if (seconds > 30) return `${seconds}s ago`;
    return 'Just now';
  }

  onViewAllClick(): void {
    // Emit event or navigate to full activity log
    console.log('View all activities clicked');
  }

  onActivityClick(activity: ActivityItem): void {
    // Handle activity item click - could open details modal
    console.log('Activity clicked:', activity);
  }

  trackByActivityId(_index: number, activity: ActivityItem): string {
    return activity.id;
  }

  getMetadataKeys(metadata: { [key: string]: unknown }): string[] {
    return Object.keys(metadata);
  }
}


