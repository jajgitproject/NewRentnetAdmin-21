// @ts-nocheck

import { Component, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexPlotOptions,
  ApexFill,
  ApexGrid,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
};

@Component({
  standalone: false,
  selector: 'app-chart-card6',
  templateUrl: './chart-card6.component.html',
  styleUrls: ['./chart-card6.component.scss'],
  imports: [
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    NgApexchartsModule
],
})
export class ChartCard6Component implements OnInit, OnChanges {
  @ViewChild('chart') chart!: ChartComponent;

  @Input() title: string = 'Collections Views';
  @Input() totalViews: string = '12,562';
  @Input() subtitle: string = 'views';
  @Input() dateRange: string = 'Oct - 09 Nov 2023';
  @Input() chartData: number[] = [45, 85, 75, 70, 50, 60, 90];
  @Input() chartLabels: string[] = [
    'Oct1',
    'Oct11',
    'Oct21',
    'Oct31',
    'Oct1',
    'Oct11',
    'Oct21',
  ];

  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Views',
          data: this.chartData,
        },
      ],
      chart: {
        height: 120,
        type: 'bar',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '60%',
          borderRadius: 4,
          distributed: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 0,
      },
      fill: {
        opacity: 1,
        colors: ['#4CAF50'],
      },
      colors: ['#4CAF50'],
      grid: {
        show: false,
      },
      xaxis: {
        categories: this.chartLabels,
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        theme: 'light',
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val) {
            return val + ' views';
          },
        },
      },
    };
  }

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(): void {
    this.updateChart();
  }

  private updateChart(): void {
    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          name: 'Views',
          data: this.chartData,
        },
      ],
      xaxis: {
        ...this.chartOptions.xaxis,
        categories: this.chartLabels,
      },
    };
  }
}


