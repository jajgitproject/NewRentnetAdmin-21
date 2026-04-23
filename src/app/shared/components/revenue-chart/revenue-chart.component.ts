// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTooltip,
  ApexPlotOptions,
  ApexDataLabels,
  ApexYAxis,
  ApexXAxis,
  ApexLegend,
  ApexResponsive,
  ApexFill,
  ApexStroke,
  ApexGrid,
  ApexTitleSubtitle,
  ApexStates,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type RevenueChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions?: ApexPlotOptions;
  tooltip?: ApexTooltip;
  yaxis?: ApexYAxis;
  xaxis?: ApexXAxis;
  dataLabels?: ApexDataLabels;
  responsive?: ApexResponsive[];
  colors?: string[];
  legend?: ApexLegend;
  fill?: ApexFill;
  stroke?: ApexStroke;
  grid?: ApexGrid;
  title?: ApexTitleSubtitle;
  states?: ApexStates;
};
@Component({
  standalone: false,
  selector: 'app-revenue-chart',
  imports: [MatCardModule, NgApexchartsModule],
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.scss'],
})
export class RevenueChartComponent implements OnInit {
  @Input() chartData: ApexAxisChartSeries = [];
  @Input() title: string = 'Revenue Overview';
  @Input() height: number = 350;

  public chartOptions!: RevenueChartOptions;

  ngOnInit() {
    this.initChart();
  }

  private initChart() {
    this.chartOptions = {
      series: this.chartData.length
        ? this.chartData
        : [
            {
              name: 'Revenue',
              data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
            },
          ],
      chart: {
        height: this.height,
        type: 'line',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#3f51b5', '#ff8732ff'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      title: {
        text: this.title,
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: '600',
          color: '#333',
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
        ],
      },
      yaxis: {
        title: {
          text: 'Revenue ($)',
        },
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val) {
            return '$' + val + 'k';
          },
        },
      },
    };
  }
}


