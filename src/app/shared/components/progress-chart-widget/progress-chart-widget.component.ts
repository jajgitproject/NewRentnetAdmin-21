// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexDataLabels,
  ApexStroke,
  ApexFill,
  ApexLegend,
} from 'ng-apexcharts';

export type ProgressChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  fill: ApexFill;
  legend: ApexLegend;
  colors: string[];
};

@Component({
  standalone: false,
  selector: 'app-progress-chart-widget',
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    NgApexchartsModule,
  ],
  templateUrl: './progress-chart-widget.component.html',
  styleUrls: ['./progress-chart-widget.component.scss'],
})
export class ProgressChartWidgetComponent implements OnInit {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() progressItems: Array<{
    label: string;
    value: number;
    color: string;
    target?: number;
  }> = [];
  @Input() chartType: 'radial' | 'linear' = 'radial';
  @Input() showChart: boolean = true;

  public chartOptions!: Partial<ProgressChartOptions>;

  ngOnInit() {
    if (this.showChart && this.chartType === 'radial') {
      this.initRadialChart();
    }
  }

  private initRadialChart() {
    this.chartOptions = {
      series: this.progressItems.map((item) => item.value),
      chart: {
        height: 260,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
        },
      },
      colors: this.progressItems.map((item) => item.color),
      legend: {
        show: true,
        floating: true,
        fontSize: '12px',
        position: 'left',
        offsetX: 0,
        offsetY: 15,
        labels: {
          useSeriesColors: true,
        },
        markers: {
          strokeWidth: 0,
        },
        formatter: (seriesName, opts) => {
          return (
            seriesName + ': ' + opts.w.globals.series[opts.seriesIndex] + '%'
          );
        },
        itemMargin: {
          vertical: 3,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        lineCap: 'round',
      },
    };
  }

  getProgressColor(value: number): string {
    if (value >= 80) return 'primary';
    if (value >= 60) return 'accent';
    if (value >= 40) return 'warn';
    return 'warn';
  }

  getStatusIcon(value: number): string {
    if (value >= 80) return 'check_circle';
    if (value >= 60) return 'schedule';
    return 'warning';
  }

  getStatusClass(value: number): string {
    if (value >= 80) return 'status-success';
    if (value >= 60) return 'status-warning';
    return 'status-danger';
  }

  getCompletedCount(): number {
    return this.progressItems.filter((item) => item.value >= 100).length;
  }

  getInProgressCount(): number {
    return this.progressItems.filter(
      (item) => item.value < 100 && item.value > 0
    ).length;
  }

  getAverageProgress(): number {
    if (this.progressItems.length === 0) return 0;
    const total = this.progressItems.reduce((sum, item) => sum + item.value, 0);
    return Math.round(total / this.progressItems.length);
  }
}


