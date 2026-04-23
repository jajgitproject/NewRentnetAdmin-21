// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStates,
  ApexTheme,
  ApexTooltip,
  NgApexchartsModule,
} from 'ng-apexcharts';

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

export interface PieChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  theme: ApexTheme;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  states: ApexStates;
}

@Component({
  selector: 'app-traffic-sources-chart',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NgApexchartsModule
],
  templateUrl: './traffic-sources-chart.component.html',
  styleUrls: ['./traffic-sources-chart.component.scss'],
})
export class TrafficSourcesChartComponent implements OnInit {
  @Input() title: string = 'Traffic Sources';
  @Input() data: TrafficSource[] = [];
  @Input() height: number = 350;
  @Input() donut: boolean = true;

  chartOptions: Partial<PieChartOptions>;
  totalTraffic: number = 0;

  constructor() {
    this.chartOptions = {};
  }

  ngOnInit(): void {
    if (this.data.length === 0) {
      this.generateDemoData();
    }
    this.calculateTotal();
    this.initChart();
  }

  private generateDemoData(): void {
    this.data = [
      { name: 'Organic Search', value: 5840, color: '#3f51b5' },
      { name: 'Direct', value: 2483, color: '#f44336' },
      { name: 'Social Media', value: 1932, color: '#4caf50' },
      { name: 'Referral', value: 1423, color: '#ff9800' },
      { name: 'Email', value: 1025, color: '#9c27b0' },
      { name: 'Other', value: 702, color: '#607d8b' },
    ];
  }

  private calculateTotal(): void {
    this.totalTraffic = this.data.reduce((sum, item) => sum + item.value, 0);
  }

  private initChart(): void {
    this.chartOptions = {
      series: this.data.map((item) => item.value),
      chart: {
        type: 'donut',
        height: this.height,
        fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
        toolbar: {
          show: false,
        },
      },
      labels: this.data.map((item) => item.name),
      colors: this.data.map((item) => item.color),
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: this.donut ? '65%' : '0%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '22px',
                fontWeight: 600,
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: '16px',
                fontWeight: 400,
                formatter: (val) => {
                  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
              },
              total: {
                show: true,
                label: 'Total',
                fontSize: '16px',
                fontWeight: 600,
                formatter: () => {
                  return this.totalTraffic
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
              },
            },
          },
        },
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '14px',
        itemMargin: {
          horizontal: 8,
          vertical: 8,
        },
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val) => {
            return (
              val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' visits'
            );
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  getPercentage(value: number): string {
    return ((value / this.totalTraffic) * 100).toFixed(1) + '%';
  }
}
