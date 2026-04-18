// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { NgScrollbar } from 'ngx-scrollbar';

export interface Ticket {
  id: string;
  title: string;
  customer: string;
  avatar?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-support-tickets-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    NgScrollbar,
  ],
  templateUrl: './support-tickets-widget.component.html',
  styleUrls: ['./support-tickets-widget.component.scss'],
})
export class SupportTicketsWidgetComponent implements OnInit {
  @Input() title: string = 'Support Tickets';
  @Input() tickets: Ticket[] = [];
  @Input() maxTickets: number = 5;

  ticketStats = {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  };

  displayedTickets: Ticket[] = [];

  constructor() {}

  ngOnInit(): void {
    if (this.tickets.length === 0) {
      this.generateDemoData();
    }
    this.calculateStats();
    this.displayedTickets = this.tickets.slice(0, this.maxTickets);
  }

  private generateDemoData(): void {
    this.tickets = [
      {
        id: 'T1001',
        title: 'Cannot access dashboard after update',
        customer: 'John Smith',
        priority: 'high',
        status: 'open',
        category: 'Technical',
        createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        updatedAt: new Date(Date.now() - 3600000 * 1), // 1 hour ago
      },
      {
        id: 'T1002',
        title: 'Payment processing error',
        customer: 'Emily Johnson',
        priority: 'high',
        status: 'in_progress',
        category: 'Billing',
        createdAt: new Date(Date.now() - 3600000 * 5), // 5 hours ago
        updatedAt: new Date(Date.now() - 3600000 * 3), // 3 hours ago
      },
      {
        id: 'T1003',
        title: 'Feature request: Dark mode',
        customer: 'Michael Brown',
        priority: 'low',
        status: 'open',
        category: 'Feature Request',
        createdAt: new Date(Date.now() - 3600000 * 24), // 1 day ago
        updatedAt: new Date(Date.now() - 3600000 * 24), // 1 day ago
      },
      {
        id: 'T1004',
        title: 'Data export not working',
        customer: 'Sarah Wilson',
        priority: 'medium',
        status: 'in_progress',
        category: 'Technical',
        createdAt: new Date(Date.now() - 3600000 * 12), // 12 hours ago
        updatedAt: new Date(Date.now() - 3600000 * 6), // 6 hours ago
      },
      {
        id: 'T1005',
        title: 'Account verification issue',
        customer: 'David Lee',
        priority: 'medium',
        status: 'resolved',
        category: 'Account',
        createdAt: new Date(Date.now() - 3600000 * 48), // 2 days ago
        updatedAt: new Date(Date.now() - 3600000 * 4), // 4 hours ago
      },
      {
        id: 'T1006',
        title: 'Mobile app crashes on startup',
        customer: 'Jessica Taylor',
        priority: 'high',
        status: 'open',
        category: 'Technical',
        createdAt: new Date(Date.now() - 3600000 * 8), // 8 hours ago
        updatedAt: new Date(Date.now() - 3600000 * 7), // 7 hours ago
      },
      {
        id: 'T1007',
        title: 'Subscription cancellation request',
        customer: 'Robert Miller',
        priority: 'low',
        status: 'closed',
        category: 'Billing',
        createdAt: new Date(Date.now() - 3600000 * 72), // 3 days ago
        updatedAt: new Date(Date.now() - 3600000 * 48), // 2 days ago
      },
    ];
  }

  private calculateStats(): void {
    this.ticketStats.total = this.tickets.length;
    this.ticketStats.open = this.tickets.filter(
      (t) => t.status === 'open'
    ).length;
    this.ticketStats.inProgress = this.tickets.filter(
      (t) => t.status === 'in_progress'
    ).length;
    this.ticketStats.resolved = this.tickets.filter(
      (t) => t.status === 'resolved'
    ).length;
    this.ticketStats.closed = this.tickets.filter(
      (t) => t.status === 'closed'
    ).length;
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'high-priority';
      case 'medium':
        return 'medium-priority';
      case 'low':
        return 'low-priority';
      default:
        return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'open':
        return 'status-open';
      case 'in_progress':
        return 'status-in-progress';
      case 'resolved':
        return 'status-resolved';
      case 'closed':
        return 'status-closed';
      default:
        return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'open':
        return 'lock_open';
      case 'in_progress':
        return 'hourglass_top';
      case 'resolved':
        return 'check_circle';
      case 'closed':
        return 'cancel';
      default:
        return 'help';
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    }

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}

