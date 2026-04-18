// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbar } from 'ngx-scrollbar';

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  status: 'active' | 'paused' | 'completed';
}

@Component({
  selector: 'app-campaign-performance-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    NgScrollbar,
  ],
  templateUrl: './campaign-performance-card.component.html',
  styleUrls: ['./campaign-performance-card.component.scss'],
})
export class CampaignPerformanceCardComponent implements OnInit {
  @Input() title: string = 'Campaign Performance';
  @Input() campaigns: Campaign[] = [];

  constructor() {}

  ngOnInit(): void {
    if (this.campaigns.length === 0) {
      this.generateDemoData();
    }
  }

  private generateDemoData(): void {
    this.campaigns = [
      {
        id: 'C001',
        name: 'Summer Sale',
        platform: 'Google Ads',
        budget: 5000,
        spent: 3200,
        impressions: 125000,
        clicks: 4200,
        conversions: 320,
        status: 'active',
      },
      {
        id: 'C002',
        name: 'Product Launch',
        platform: 'Facebook',
        budget: 8000,
        spent: 6500,
        impressions: 210000,
        clicks: 8500,
        conversions: 520,
        status: 'active',
      },
      {
        id: 'C003',
        name: 'Brand Awareness',
        platform: 'Instagram',
        budget: 3000,
        spent: 3000,
        impressions: 95000,
        clicks: 3200,
        conversions: 180,
        status: 'completed',
      },
      {
        id: 'C004',
        name: 'Holiday Special',
        platform: 'Twitter',
        budget: 2500,
        spent: 1200,
        impressions: 45000,
        clicks: 1800,
        conversions: 90,
        status: 'paused',
      },
    ];
  }

  getSpentPercentage(budget: number, spent: number): number {
    return (spent / budget) * 100;
  }

  getClickThroughRate(impressions: number, clicks: number): number {
    return (clicks / impressions) * 100;
  }

  getConversionRate(clicks: number, conversions: number): number {
    return (conversions / clicks) * 100;
  }

  getCostPerClick(spent: number, clicks: number): number {
    return spent / clicks;
  }

  getCostPerConversion(spent: number, conversions: number): number {
    return spent / conversions;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  formatPercentage(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'active';
      case 'paused':
        return 'paused';
      case 'completed':
        return 'completed';
      default:
        return '';
    }
  }

  getPlatformIcon(platform: string): string {
    switch (platform) {
      case 'Google Ads':
        return 'adb';
      case 'Facebook':
        return 'facebook';
      case 'Instagram':
        return 'photo_camera';
      case 'Twitter':
        return 'clear';
      default:
        return 'public';
    }
  }
}
