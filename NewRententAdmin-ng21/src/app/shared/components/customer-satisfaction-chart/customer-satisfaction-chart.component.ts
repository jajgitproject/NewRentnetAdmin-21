// @ts-nocheck
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  ApexTooltip,
  ChartComponent,
} from 'ng-apexcharts';
import { MatCardModule } from '@angular/material/card';

import { MatIconModule } from '@angular/material/icon';

export interface CustomerSatisfactionData {
  category: string;
  satisfied: number;
  neutral: number;
  dissatisfied: number;
  total: number;
}

export type CustomerSatisfactionChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  labels: string[];
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-customer-satisfaction-chart',
  standalone: true,
  imports: [MatCardModule, ChartComponent, MatIconModule],
  templateUrl: './customer-satisfaction-chart.component.html',
  styleUrls: ['./customer-satisfaction-chart.component.scss'],
})
export class CustomerSatisfactionChartComponent implements OnInit, OnChanges {
  @Input() data: CustomerSatisfactionData[] = [];
  @Input() title: string = 'Customer Satisfaction';
  @Input() height: number = 350;
  @Input() showCategories: boolean = true;

  public chartOptions!: CustomerSatisfactionChartOptions;

  ngOnInit() {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['showCategories']) {
      this.initChart();
    }
  }

  private initChart() {
    const defaultData: CustomerSatisfactionData[] = [
      {
        category: 'Product Quality',
        satisfied: 75,
        neutral: 15,
        dissatisfied: 10,
        total: 100,
      },
      {
        category: 'Customer Service',
        satisfied: 65,
        neutral: 20,
        dissatisfied: 15,
        total: 100,
      },
      {
        category: 'Delivery Speed',
        satisfied: 80,
        neutral: 12,
        dissatisfied: 8,
        total: 100,
      },
      {
        category: 'Price Value',
        satisfied: 60,
        neutral: 25,
        dissatisfied: 15,
        total: 100,
      },
    ];

    const chartData = this.data.length > 0 ? this.data : defaultData;

    const categories = chartData.map((item) => item.category);
    const satisfiedData = chartData.map((item) => item.satisfied);
    const neutralData = chartData.map((item) => item.neutral);
    const dissatisfiedData = chartData.map((item) => item.dissatisfied);

    this.chartOptions = {
      series: [
        {
          name: 'Satisfied',
          data: satisfiedData,
        },
        {
          name: 'Neutral',
          data: neutralData,
        },
        {
          name: 'Dissatisfied',
          data: dissatisfiedData,
        },
      ],
      chart: {
        type: 'bar',
        height: this.height,
        stacked: true,
        stackType: '100%',
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#4CAF50', '#FFC107', '#F44336'],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
          borderRadiusApplication: 'end',
          columnWidth: '60%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
        offsetY: 0,
      },
      labels: categories,
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + '%';
          },
        },
      },
    };
  }

  getOverallSatisfaction(): number {
    if (this.data.length === 0) return 0;

    const totalSatisfied = this.data.reduce(
      (sum, item) => sum + item.satisfied,
      0
    );
    const totalResponses = this.data.reduce((sum, item) => sum + item.total, 0);

    return Math.round((totalSatisfied / totalResponses) * 100);
  }

  getSatisfactionLevel(): string {
    const satisfaction = this.getOverallSatisfaction();

    if (satisfaction >= 80) return 'Excellent';
    if (satisfaction >= 60) return 'Good';
    if (satisfaction >= 40) return 'Average';
    return 'Poor';
  }

  getSatisfactionColor(): string {
    const satisfaction = this.getOverallSatisfaction();

    if (satisfaction >= 80) return '#4CAF50';
    if (satisfaction >= 60) return '#FFC107';
    if (satisfaction >= 40) return '#FF9800';
    return '#F44336';
  }
}

