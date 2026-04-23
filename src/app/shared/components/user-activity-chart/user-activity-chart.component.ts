// @ts-nocheck
import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ApexGrid,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexLegend,
} from 'ng-apexcharts';

export type UserActivityChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  colors: string[];
};

export interface UserActivityData {
  date: string;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
}

@Component({
  standalone: false,
  selector: 'app-user-activity-chart',
  imports: [MatCardModule, NgApexchartsModule],
  templateUrl: './user-activity-chart.component.html',
  styleUrls: ['./user-activity-chart.component.scss'],
})
export class UserActivityChartComponent implements OnInit, OnChanges {
  @Input() chartData: UserActivityData[] = [];
  @Input() title: string = 'User Activity';
  @Input() height: number = 350;

  public chartOptions!: UserActivityChartOptions;

  ngOnInit() {
    this.initChart();
  }

  ngOnChanges() {
    this.initChart();
  }

  private initChart() {
    const data = this.chartData.length ? this.chartData : this.getDefaultData();

    this.chartOptions = {
      series: [
        {
          name: 'Active Users',
          data: data.map((item) => item.activeUsers),
        },
        {
          name: 'New Users',
          data: data.map((item) => item.newUsers),
        },
        {
          name: 'Returning Users',
          data: data.map((item) => item.returningUsers),
        },
      ],
      chart: {
        type: 'area',
        height: this.height,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: false,
            reset: true,
          },
        },
        animations: {
          enabled: true,
          speed: 800,
        },
      },
      colors: ['#4CAF50', '#2196F3', '#FF9800'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      plotOptions: {}, //
      title: {
        text: this.title,
        align: 'left',
        style: { fontSize: '16px', fontWeight: '600', color: '#333' },
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 3,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
      },
      xaxis: {
        categories: data.map((item) => item.date),
        labels: { style: { colors: '#666', fontSize: '12px' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { style: { colors: '#666', fontSize: '12px' } } },
      tooltip: { theme: 'light', x: { format: 'dd MMM yyyy' } },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '14px',
      },
    };
  }

  private getDefaultData(): UserActivityData[] {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    return dates.map((date) => ({
      date,
      activeUsers: Math.floor(Math.random() * 1000) + 500,
      newUsers: Math.floor(Math.random() * 200) + 100,
      returningUsers: Math.floor(Math.random() * 800) + 300,
    }));
  }
}

