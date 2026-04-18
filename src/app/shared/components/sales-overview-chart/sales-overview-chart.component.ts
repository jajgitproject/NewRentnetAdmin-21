// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule
} from 'ng-apexcharts';

export interface SalesData {
  period: string;
  current: number;
  previous: number;
}

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  markers: ApexMarkers;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
}

@Component({
  selector: 'app-sales-overview-chart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NgApexchartsModule
  ],
  templateUrl: './sales-overview-chart.component.html',
  styleUrls: ['./sales-overview-chart.component.scss']
})
export class SalesOverviewChartComponent implements OnInit {
  @Input() title: string = 'Sales Overview';
  @Input() data: SalesData[] = [];
  @Input() height: number = 350;
  @Input() showLegend: boolean = true;

  chartOptions: Partial<ChartOptions>;
  totalSales: number = 0;
  growthPercentage: number = 0;
  isPositiveGrowth: boolean = true;

  constructor() {
    this.chartOptions = {};
  }

  ngOnInit(): void {
    if (this.data.length === 0) {
      this.generateDemoData();
    }
    this.calculateTotals();
    this.initChart();
  }

  private generateDemoData(): void {
    this.data = [
      { period: 'Jan', current: 18500, previous: 16200 },
      { period: 'Feb', current: 22800, previous: 19500 },
      { period: 'Mar', current: 27900, previous: 22300 },
      { period: 'Apr', current: 23800, previous: 25100 },
      { period: 'May', current: 29600, previous: 26400 },
      { period: 'Jun', current: 32500, previous: 28300 },
      { period: 'Jul', current: 36700, previous: 30100 },
      { period: 'Aug', current: 34800, previous: 32800 },
      { period: 'Sep', current: 39200, previous: 35600 },
      { period: 'Oct', current: 42100, previous: 38200 },
      { period: 'Nov', current: 44800, previous: 40500 },
      { period: 'Dec', current: 48900, previous: 43700 }
    ];
  }

  private calculateTotals(): void {
    const currentTotal = this.data.reduce((sum, item) => sum + item.current, 0);
    const previousTotal = this.data.reduce((sum, item) => sum + item.previous, 0);
    
    this.totalSales = currentTotal;
    
    if (previousTotal > 0) {
      this.growthPercentage = ((currentTotal - previousTotal) / previousTotal) * 100;
      this.isPositiveGrowth = this.growthPercentage >= 0;
    }
  }

  private initChart(): void {
    this.chartOptions = {
      series: [
        {
          name: 'Current Year',
          data: this.data.map(item => item.current)
        },
        {
          name: 'Previous Year',
          data: this.data.map(item => item.previous)
        }
      ],
      chart: {
        type: 'area',
        height: this.height,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        fontFamily: 'Roboto, "Helvetica Neue", sans-serif'
      },
      colors: ['#3f51b5', '#e91e63'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: this.data.map(item => item.period),
        labels: {
          style: {
            colors: '#9e9e9e',
            fontSize: '12px'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#9e9e9e',
            fontSize: '12px'
          },
          formatter: (value) => {
            return '$' + this.formatNumber(value);
          }
        }
      },
      grid: {
        borderColor: '#e0e0e0',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 10
        }
      },
      tooltip: {
        theme: 'light',
        x: {
          format: 'dd/MM/yy HH:mm'
        },
        y: {
          formatter: (value) => {
            return '$' + this.formatNumber(value);
          }
        }
      },
      legend: {
        show: this.showLegend,
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}
