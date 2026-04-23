// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

@Component({
  selector: 'app-budget-overview-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule
  ],
  templateUrl: './budget-overview-widget.component.html',
  styleUrls: ['./budget-overview-widget.component.scss']
})
export class BudgetOverviewWidgetComponent implements OnInit {
  @Input() title: string = 'Budget Overview';
  @Input() totalBudget: number = 0;
  @Input() totalSpent: number = 0;
  @Input() categories: BudgetCategory[] = [];
  @Input() period: string = 'Monthly';

  remainingBudget: number = 0;
  spentPercentage: number = 0;

  constructor() {}

  ngOnInit(): void {
    if (this.categories.length === 0) {
      this.generateDemoData();
    }
    this.calculateBudgetMetrics();
  }

  private generateDemoData(): void {
    this.totalBudget = 50000;
    this.totalSpent = 32500;
    
    this.categories = [
      { name: 'Marketing', allocated: 15000, spent: 12800, color: '#4CAF50' },
      { name: 'Development', allocated: 20000, spent: 13500, color: '#2196F3' },
      { name: 'Operations', allocated: 10000, spent: 4200, color: '#FF9800' },
      { name: 'Research', allocated: 5000, spent: 2000, color: '#9C27B0' }
    ];
  }

  private calculateBudgetMetrics(): void {
    this.remainingBudget = this.totalBudget - this.totalSpent;
    this.spentPercentage = (this.totalSpent / this.totalBudget) * 100;
  }

  getCategoryPercentage(allocated: number, spent: number): number {
    return (spent / allocated) * 100;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  getStatusClass(allocated: number, spent: number): string {
    const percentage = (spent / allocated) * 100;
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    return 'success';
  }
}
