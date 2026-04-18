// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexGrid,
  ApexStroke,
  ApexFill,
  ApexTooltip
} from 'ng-apexcharts';

export type TrendChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  colors: string[];
};

@Component({
  standalone: false,
  selector: 'app-trend-card',
  imports: [CommonModule, MatCardModule, MatIconModule, NgApexchartsModule],
  templateUrl: './trend-card.component.html',
  styleUrls: ['./trend-card.component.scss']
})
export class TrendCardComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentValue: string | number = '';
  @Input() previousValue: string | number = '';
  @Input() period: string = 'vs last month';
  @Input() icon: string = '';
  @Input() iconColor: string = 'primary';
  @Input() chartData: number[] = [];
  @Input() chartLabels: string[] = [];
  @Input() chartColor: string = '#3f51b5';
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() compact: boolean = false;

  public chartOptions!: Partial<TrendChartOptions>;

  ngOnInit() {
    this.initChart();
  }

  private initChart() {
    this.chartOptions = {
      series: [{
        name: this.title,
        data: this.chartData
      }],
      chart: {
        height: this.compact ? 60 : 80,
        type: 'line',
        sparkline: {
          enabled: true
        },
        toolbar: {
          show: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.2,
          opacityTo: 0.05,
          stops: [0, 100]
        }
      },
      colors: [this.chartColor],
      dataLabels: {
        enabled: false
      },
      grid: {
        show: false
      },
      xaxis: {
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      tooltip: {
        theme: 'dark',
        fixed: {
          enabled: false
        },
        x: {
          show: false
        }
      }
    };
  }

  get percentageChange(): number {
    const current = Number(this.currentValue);
    const previous = Number(this.previousValue);
    
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  get changeClass(): string {
    const change = this.percentageChange;
    if (change > 0) return 'change-positive';
    if (change < 0) return 'change-negative';
    return 'change-neutral';
  }

  get changeIcon(): string {
    const change = this.percentageChange;
    if (change > 0) return 'trending_up';
    if (change < 0) return 'trending_down';
    return 'trending_flat';
  }

  get iconColorClass(): string {
    return `icon-${this.iconColor}`;
  }
}

