// @ts-nocheck

import { Component, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexLegend,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexDataLabels,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

export interface SalesData {
  category: string;
  value: number;
  color: string;
  icon: string;
}

@Component({
  standalone: false,
  selector: 'app-sales-statistics-card',
  templateUrl: './sales-statistics-card.component.html',
  styleUrls: ['./sales-statistics-card.component.scss'],
  imports: [
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    NgApexchartsModule
],
})
export class SalesStatisticsCardComponent implements OnInit, OnChanges {
  @ViewChild('chart') chart!: ChartComponent;

  @Input() title: string = 'NFT Sales Statistics';
  @Input() selectedPeriod: string = 'Last Month';
  @Input() periods: string[] = [
    'Last Week',
    'Last Month',
    'Last Quarter',
    'Last Year',
  ];

  @Input() salesData: SalesData[] = [
    { category: 'Music', value: 10399, color: '#4CAF50', icon: 'music_note' },
    { category: 'Domain', value: 9672, color: '#2196F3', icon: 'domain' },
    {
      category: 'Digital Art',
      value: 12605,
      color: '#E91E63',
      icon: 'palette',
    },
  ];

  public chartOptions!: Partial<DonutChartOptions>;
  public totalSales: number = 0;

  constructor() {
    this.calculateTotalSales();
    this.initializeChart();
  }

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(): void {
    this.calculateTotalSales();
    this.updateChart();
  }

  private calculateTotalSales(): void {
    this.totalSales = this.salesData.reduce((sum, item) => sum + item.value, 0);
  }

  private initializeChart(): void {
    this.chartOptions = {
      series: this.salesData.map((item) => item.value),
      chart: {
        type: 'donut',
        height: 250,
        animations: {
          enabled: true,
          speed: 800,
        },
      },
      labels: this.salesData.map((item) => item.category),
      colors: this.salesData.map((item) => item.color),
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '16px',
                fontWeight: 600,
                color: '#333',
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: '24px',
                fontWeight: 700,
                color: '#333',
                offsetY: 10,
                formatter: function (val: string | number) {
                  return parseInt(val.toString(), 10).toLocaleString();
                },
              },
              total: {
                show: true,
                showAlways: false,
                label: 'Total Sales',
                fontSize: '14px',
                fontWeight: 400,
                color: '#666',
                formatter: function (w) {
                  const total = w.globals.seriesTotals.reduce(
                    (a: number, b: number) => a + b,
                    0
                  );
                  return total.toLocaleString();
                },
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 6,
        colors: ['#fff'],
      },
      legend: {
        show: false,
      },
      tooltip: {
        enabled: true,
        theme: 'light',
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val) {
            return val.toLocaleString() + ' sales';
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 250,
            },
            plotOptions: {
              pie: {
                donut: {
                  size: '70%',
                },
              },
            },
          },
        },
      ],
    };
  }

  private updateChart(): void {
    this.chartOptions = {
      ...this.chartOptions,
      series: this.salesData.map((item) => item.value),
      labels: this.salesData.map((item) => item.category),
      colors: this.salesData.map((item) => item.color),
    };
  }

  onPeriodChange(period: string): void {
    this.selectedPeriod = period;
    // Emit event or call parent method to update data
    // this.periodChanged.emit(period);
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }
}


