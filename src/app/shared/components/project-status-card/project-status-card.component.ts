// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { NgScrollbar } from 'ngx-scrollbar';

export interface Project {
  id: string;
  name: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed';
  dueDate: Date;
  assignee: string;
}

@Component({
  selector: 'app-project-status-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatMenuModule,
    NgScrollbar,
  ],
  templateUrl: './project-status-card.component.html',
  styleUrls: ['./project-status-card.component.scss'],
})
export class ProjectStatusCardComponent implements OnInit {
  @Input() title: string = 'Project Status';
  @Input() projects: Project[] = [];
  @Input() maxProjects: number = 5;

  displayedProjects: Project[] = [];

  constructor() {}

  ngOnInit(): void {
    if (this.projects.length === 0) {
      this.generateDemoData();
    }
    this.displayedProjects = this.projects.slice(0, this.maxProjects);
  }

  private generateDemoData(): void {
    this.projects = [
      {
        id: 'PRJ-001',
        name: 'Website Redesign',
        progress: 75,
        status: 'on-track',
        dueDate: new Date(2023, 11, 15),
        assignee: 'John Smith',
      },
      {
        id: 'PRJ-002',
        name: 'Mobile App Development',
        progress: 45,
        status: 'at-risk',
        dueDate: new Date(2023, 10, 30),
        assignee: 'Emily Johnson',
      },
      {
        id: 'PRJ-003',
        name: 'CRM Integration',
        progress: 90,
        status: 'on-track',
        dueDate: new Date(2023, 9, 22),
        assignee: 'Michael Brown',
      },
      {
        id: 'PRJ-004',
        name: 'Data Migration',
        progress: 30,
        status: 'delayed',
        dueDate: new Date(2023, 11, 5),
        assignee: 'Sarah Wilson',
      },
      {
        id: 'PRJ-005',
        name: 'Security Audit',
        progress: 60,
        status: 'on-track',
        dueDate: new Date(2023, 10, 10),
        assignee: 'David Lee',
      },
    ];
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'on-track':
        return 'check_circle';
      case 'at-risk':
        return 'warning';
      case 'delayed':
        return 'error';
      default:
        return 'help';
    }
  }

  getStatusClass(status: string): string {
    return status;
  }

  getProgressColor(progress: number, status: string): string {
    if (status === 'delayed') return 'warn';
    if (status === 'at-risk') return 'accent';
    return 'primary';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  getDaysRemaining(dueDate: Date): number {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysRemainingText(dueDate: Date): string {
    const days = this.getDaysRemaining(dueDate);
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Due today';
    return `${days} days left`;
  }
}
