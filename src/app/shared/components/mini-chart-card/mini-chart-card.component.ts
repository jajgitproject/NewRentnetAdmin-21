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
  ApexYAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexGrid,
  ApexFill
} from 'ng-apexcharts';

export type MiniChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  fill: ApexFill;
  colors: string[];
};

@Component({
  standalone: false,
  selector: 'app-mini-chart-card',
  imports: [CommonModule, MatCardModule, MatIconModule, NgApexchartsModule],
  templateUrl: './mini-chart-card.component.html',
  styleUrls: ['./mini-chart-card.component.scss']
})
export class MiniChartCardComponent implements OnInit {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() subtitle: string = '';
  @Input() icon: string = '';
  @Input() iconColor: string = 'primary';
  @Input() chartType: 'line' | 'area' | 'bar' = 'line';
  @Input() chartData: number[] = [];
  @Input() chartLabels: string[] = [];
  @Input() chartColor: string = '#3f51b5';
  @Input() changeValue: number = 0;
  @Input() changeLabel: string = '';
  @Input() showChange: boolean = true;

  public chartOptions!: Partial<MiniChartOptions>;

  ngOnInit() {
    this.initChart();
  }

  private initChart() {
    this.chartOptions = {
      series: [{
        name: this.title || 'Data',
        data: this.chartData
      }],
      chart: {
        height: 80,
        type: this.chartType,
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
        type: this.chartType === 'area' ? 'gradient' : 'solid',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 90, 100]
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
      yaxis: {
        show: false
      },
      tooltip: {
        theme: 'dark',
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        marker: {
          show: false
        }
      }
    };
  }

  get changeClass(): string {
    if (this.changeValue > 0) return 'change-positive';
    if (this.changeValue < 0) return 'change-negative';
    return 'change-neutral';
  }

  get changeIcon(): string {
    if (this.changeValue > 0) return 'arrow_upward';
    if (this.changeValue < 0) return 'arrow_downward';
    return 'remove';
  }

  get iconColorClass(): string {
    return `icon-${this.iconColor}`;
  }
}

