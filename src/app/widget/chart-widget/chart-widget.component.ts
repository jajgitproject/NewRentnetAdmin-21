// @ts-nocheck
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
  ApexStroke,
  ApexLegend,
  ApexPlotOptions,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexGrid,
  ApexMarkers,
} from 'ng-apexcharts';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { AttendanceChartComponent } from '@shared/components/attendance-chart/attendance-chart.component';
import { ChartCard4Component } from '@shared/components/chart-card4/chart-card4.component';
import { IncomeInfoBoxComponent } from '@shared/components/income-info-box/income-info-box.component';
import { InfoBox1Component } from '@shared/components/info-box1/info-box1.component';
import { OrderInfoBoxComponent } from '@shared/components/order-info-box/order-info-box.component';
import { StatisticCard1Component } from '@shared/components/statistic-card1/statistic-card1.component';
import { StatisticCard2Component } from '@shared/components/statistic-card2/statistic-card2.component';
import { CompactStatCardComponent } from '@shared/components/compact-stat-card/compact-stat-card.component';

import { ChartCard6Component } from '@shared/components/chart-card6/chart-card6.component';
import { SalesStatisticsCardComponent } from '@shared/components/sales-statistics-card/sales-statistics-card.component';
import { DashboardStatisticsCardComponent } from '@shared/components/dashboard-statistics-card/dashboard-statistics-card.component';
import {
  PerformanceMetric,
  PerformanceMetricsGridComponent,
} from '@shared/components/performance-metrics-grid/performance-metrics-grid.component';
import {
  TrafficSource,
  TrafficSourcesChartComponent,
} from '@shared/components/traffic-sources-chart/traffic-sources-chart.component';
import { UserActivityChartComponent } from '@shared/components/user-activity-chart/user-activity-chart.component';
export type circleChartOptions = {
  series?: ApexNonAxisChartSeries;
  chart?: ApexChart;
  labels?: string[];
  colors?: string[];
  legend?: ApexLegend;
  plotOptions?: ApexPlotOptions;
  responsive: ApexResponsive[];
};
export type radarChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  title?: ApexTitleSubtitle;
  stroke?: ApexStroke;
  fill?: ApexFill;
  markers?: ApexMarkers;
  xaxis?: ApexXAxis;
};
export type areaChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  stroke?: ApexStroke;
  grid?: ApexGrid;
  tooltip?: ApexTooltip;
  legend?: ApexLegend;
  dataLabels?: ApexDataLabels;
};
export type pieChartOptions = {
  series?: ApexNonAxisChartSeries;
  chart?: ApexChart;
  legend?: ApexLegend;
  dataLabels?: ApexDataLabels;
  responsive?: ApexResponsive[];
  labels?: string[];
};
export type avgLecChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  stroke?: ApexStroke;
  dataLabels?: ApexDataLabels;
  markers?: ApexMarkers;
  colors?: string[];
  yaxis?: ApexYAxis;
  grid?: ApexGrid;
  tooltip?: ApexTooltip;
  legend?: ApexLegend;
  fill?: ApexFill;
  title?: ApexTitleSubtitle;
};
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
  labels: string[];
  markers: ApexMarkers;
  grid: ApexGrid;
  title: ApexTitleSubtitle;
};
@Component({
  standalone: false,
  selector: 'app-chart-widget',
  templateUrl: './chart-widget.component.html',
  styleUrls: ['./chart-widget.component.scss'],
  imports: [
    BreadcrumbComponent,
    NgApexchartsModule,
    MatCardModule,
    StatisticCard1Component,
    OrderInfoBoxComponent,
    IncomeInfoBoxComponent,
    StatisticCard2Component,
    AttendanceChartComponent,
    ChartCard4Component,
    InfoBox1Component,
    CompactStatCardComponent,
    ChartCard6Component,
    SalesStatisticsCardComponent,
    DashboardStatisticsCardComponent,
    PerformanceMetricsGridComponent,
    TrafficSourcesChartComponent,
    UserActivityChartComponent
],
})
export class ChartWidgetComponent implements OnInit {
  public radarChartOptions: Partial<radarChartOptions>;
  public circleChartOptions: Partial<circleChartOptions>;
  public areaChartOptions: Partial<areaChartOptions>;
  public pieChartOptions: Partial<pieChartOptions>;
  public avgLecChartOptions: Partial<avgLecChartOptions>;

  public smallChart1Options!: Partial<ChartOptions>;
  public smallChart2Options!: Partial<ChartOptions>;
  public smallChart3Options!: Partial<ChartOptions>;
  public smallChart4Options!: Partial<ChartOptions>;

  breadscrums = [
    {
      title: 'Chart Widget',
      items: ['Widget'],
      active: 'Chart Widget',
    },
  ];

  constructor() {
    //radar Chart
    this.radarChartOptions = {
      series: [
        {
          name: 'Blue',
          data: [80, 50, 30, 40, 100, 20],
        },
        {
          name: 'Green',
          data: [20, 30, 40, 80, 20, 80],
        },
        {
          name: 'Orange',
          data: [44, 76, 78, 13, 43, 10],
        },
      ],
      chart: {
        height: 240,
        type: 'radar',
        toolbar: {
          show: false,
        },
        dropShadow: {
          enabled: true,
          blur: 1,
          left: 1,
          top: 1,
        },
      },
      stroke: {
        width: 0,
      },
      fill: {
        opacity: 0.4,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        categories: ['2011', '2012', '2013', '2014', '2015', '2016'],
      },
    };

    // pie chart

    this.circleChartOptions = {
      series: [76, 67, 61, 90],
      chart: {
        height: 275,
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
            image: undefined,
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
      colors: ['#FF4560', '#775DD0', '#00E396', '#FEB019'],
      labels: ['Vimeo', 'Messenger', 'Facebook', 'LinkedIn'],
      legend: {
        show: true,
        floating: true,
        fontSize: '12px',
        position: 'left',
        offsetX: 10,
        offsetY: 10,
        labels: {
          useSeriesColors: true,
        },
        itemMargin: {
          horizontal: 3,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false,
            },
          },
        },
      ],
    };

    // area chart

    this.areaChartOptions = {
      chart: {
        height: 240,
        type: 'area',
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      series: [
        {
          name: 'series1',
          data: [31, 40, 28, 51, 42],
        },
        {
          name: 'series2',
          data: [11, 32, 45, 32, 34],
        },
      ],
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      xaxis: {
        type: 'datetime',
        categories: ['1990', '1991', '1992', '1993', '1994'],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };

    // pie chart

    this.pieChartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: 'donut',
        width: 250,
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      labels: ['India', 'USA', 'Shrilanka', 'Australia', 'Japan'],
      responsive: [
        {
          breakpoint: 480,
          options: {},
        },
      ],
    };

    //avgLecChartOptions

    this.avgLecChartOptions = {
      series: [
        {
          name: 'Avg. Patient',
          data: [65, 72, 62, 73, 66, 74, 63, 67],
        },
      ],
      chart: {
        height: 340,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'July', 'Aug'],
        title: {
          text: 'Weekday',
        },
      },
      yaxis: {
        title: {
          text: 'Avg. Lecture',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#35fdd8'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
        },
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      markers: {
        size: 4,
        colors: ['#FFA41B'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
  @ViewChild('chart', { static: true }) chart!: ChartComponent;

  ngOnInit() {
    this.smallChart1();
    this.smallChart2();
    this.smallChart3();
    this.smallChart4();
  }
  private smallChart1() {
    this.smallChart1Options = {
      series: [
        {
          name: 'Appointments',
          data: [
            50, 61, 80, 50, 72, 52, 60, 41, 30, 45, 70, 40, 93, 63, 50, 62,
          ],
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#6F42C1'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          '16-07-2018',
          '17-07-2018',
          '18-07-2018',
          '19-07-2018',
          '20-07-2018',
          '21-07-2018',
          '22-07-2018',
          '23-07-2018',
          '24-07-2018',
          '25-07-2018',
          '26-07-2018',
          '27-07-2018',
          '28-07-2018',
          '29-07-2018',
          '30-07-2018',
          '31-07-2018',
        ],
      },
      legend: {
        show: false,
      },

      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  private smallChart2() {
    this.smallChart2Options = {
      series: [
        {
          name: 'Operations',
          data: [5, 6, 8, 5, 7, 5, 6, 4, 3, 4, 7, 4, 9, 6, 5, 6],
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#FD7E14'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          '16-07-2018',
          '17-07-2018',
          '18-07-2018',
          '19-07-2018',
          '20-07-2018',
          '21-07-2018',
          '22-07-2018',
          '23-07-2018',
          '24-07-2018',
          '25-07-2018',
          '26-07-2018',
          '27-07-2018',
          '28-07-2018',
          '29-07-2018',
          '30-07-2018',
          '31-07-2018',
        ],
      },
      legend: {
        show: false,
      },

      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  private smallChart3() {
    this.smallChart3Options = {
      series: [
        {
          name: 'New Patients',
          data: [
            50, 61, 80, 50, 72, 52, 60, 41, 30, 45, 70, 40, 93, 63, 50, 62,
          ],
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#4CAF50'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          '16-07-2018',
          '17-07-2018',
          '18-07-2018',
          '19-07-2018',
          '20-07-2018',
          '21-07-2018',
          '22-07-2018',
          '23-07-2018',
          '24-07-2018',
          '25-07-2018',
          '26-07-2018',
          '27-07-2018',
          '28-07-2018',
          '29-07-2018',
          '30-07-2018',
          '31-07-2018',
        ],
      },
      legend: {
        show: false,
      },

      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  private smallChart4() {
    this.smallChart4Options = {
      series: [
        {
          name: 'Earning',
          data: [
            150, 161, 180, 150, 172, 152, 160, 141, 130, 145, 170, 140, 193,
            163, 150, 162,
          ],
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#2196F3'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          '16-07-2018',
          '17-07-2018',
          '18-07-2018',
          '19-07-2018',
          '20-07-2018',
          '21-07-2018',
          '22-07-2018',
          '23-07-2018',
          '24-07-2018',
          '25-07-2018',
          '26-07-2018',
          '27-07-2018',
          '28-07-2018',
          '29-07-2018',
          '30-07-2018',
          '31-07-2018',
        ],
      },
      legend: {
        show: false,
      },

      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  // New widget data
  compactStats = [
    {
      title: 'Active Users',
      value: '2,547',
      icon: 'people',
      iconColor: 'primary',
      iconBackground: '#e3f2fd',
      trend: 8.2,
      trendLabel: 'vs yesterday',
    },
    {
      title: 'Page Views',
      value: '18,926',
      icon: 'visibility',
      iconColor: 'success',
      iconBackground: '#e8f5e9',
      trend: 15.3,
      trendLabel: 'vs yesterday',
    },
    {
      title: 'Bounce Rate',
      value: '24.8',
      suffix: '%',
      icon: 'exit_to_app',
      iconColor: 'warning',
      iconBackground: '#fff3e0',
      trend: -3.1,
      trendLabel: 'vs yesterday',
    },
    {
      title: 'Avg. Session',
      value: '3:42',
      icon: 'schedule',
      iconColor: 'info',
      iconBackground: '#e1f5fe',
      trend: 12.7,
      trendLabel: 'vs yesterday',
    },
  ];

  customPeriods = ['Last 7 Days', 'Last Month', 'Last 3 Months', 'Last Year'];

  customSalesData = [
    {
      category: 'Electronics',
      value: 15420,
      color: '#FF6B35',
      icon: 'devices',
    },
    { category: 'Clothing', value: 12350, color: '#4ECDC4', icon: 'checkroom' },
    { category: 'Books', value: 8790, color: '#45B7D1', icon: 'menu_book' },
  ];
  performanceMetrics: PerformanceMetric[] = [
    {
      title: 'Total Sales',
      value: 1500,
      target: 2000,
      unit: '',
      trend: 'up',
      trendValue: 10,
      icon: 'shopping_cart',
      color: 'blue',
      id: '1',
    },
    {
      title: 'New Customers',
      value: 300,
      target: 500,
      unit: '',
      trend: 'down',
      trendValue: -5,
      icon: 'person_add',
      color: 'green',
      id: '2',
    },
    {
      title: 'Conversion Rate',
      value: 4.5,
      target: 5.0,
      unit: '%',
      trend: 'up',
      trendValue: 0.5,
      icon: 'trending_up',
      color: 'orange',
      id: '3',
    },
  ];

  trafficData: TrafficSource[] = [
    { name: 'Organic Search', value: 6000, color: '#3f51b5' },
    { name: 'Direct', value: 3000, color: '#f44336' },
    { name: 'Social Media', value: 2000, color: '#4caf50' },
    { name: 'Referral', value: 1500, color: '#ff9800' },
  ];

  userActivityData = [
    {
      date: '2025-09-20',
      activeUsers: 750,
      newUsers: 120,
      returningUsers: 450,
    },
    {
      date: '2025-09-21',
      activeUsers: 820,
      newUsers: 150,
      returningUsers: 500,
    },
    {
      date: '2025-09-22',
      activeUsers: 900,
      newUsers: 180,
      returningUsers: 550,
    },
    {
      date: '2025-09-23',
      activeUsers: 670,
      newUsers: 100,
      returningUsers: 430,
    },
    {
      date: '2025-09-24',
      activeUsers: 720,
      newUsers: 130,
      returningUsers: 480,
    },
    {
      date: '2025-09-25',
      activeUsers: 800,
      newUsers: 160,
      returningUsers: 520,
    },
    {
      date: '2025-09-26',
      activeUsers: 950,
      newUsers: 200,
      returningUsers: 600,
    },
  ];
}


