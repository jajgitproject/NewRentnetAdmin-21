// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexLegend,
  ApexPlotOptions,
  ApexResponsive,
  ApexFill
} from 'ng-apexcharts';
import { FormDialogComponent } from '../password/dialogs/form-dialog/form-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PasswordService } from '../password/password.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  fill: ApexFill;
};

@Component({
  standalone: false,
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public lineChartOptions: Partial<ChartOptions>;
  public barChartOptions: Partial<ChartOptions>;
  constructor(
    public route: Router,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public passwordService: PasswordService,
  ) {}

  ngOnInit() {
    this.chart1();
    this.chart2();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if(currentUser.employee.PasswordType === 'Default') {
       this.password();
    }
  }

  private chart1() {
    this.lineChartOptions = {
      series: [
        {
          name: 'High - 2013',
          data: [15, 13, 22, 23, 17, 32, 27]
        },
        {
          name: 'Low - 2013',
          data: [12, 18, 14, 18, 23, 13, 21]
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        foreColor: '#9aa0ac',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: ['#F45B5B', '#5F98CF'],
      stroke: {
        curve: 'smooth'
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      markers: {
        size: 3
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        title: {
          text: 'Month'
        }
      },
      yaxis: {
        // opposite: true,
        title: {
          text: 'Temperature'
        },
        min: 5,
        max: 40
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true
        },
        x: {
          show: true
        }
      }
    };
  }
  private chart2() {
    this.barChartOptions = {
      series: [
        {
          name: 'Product 1',
          data: [44, 55, 41, 67, 22, 43]
        },
        {
          name: 'Product 2',
          data: [13, 23, 20, 8, 13, 27]
        },
        {
          name: 'Product 3',
          data: [11, 17, 15, 15, 21, 14]
        },
        {
          name: 'Product 4',
          data: [21, 7, 25, 13, 22, 8]
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
        foreColor: '#9aa0ac',
        stacked: true,
        toolbar: {
          show: false
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%'
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        type: 'category',
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },
      legend: {
        show: false
      },
      fill: {
        opacity: 0.8,
        colors: ['#01B8AA', '#374649', '#FD625E', '#F2C80F']
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true
        },
        x: {
          show: true
        }
      }
    };
  }

  password() {
    // console.log(item);
    const dialogRef =  this.dialog.open(FormDialogComponent, {
      width: '500px',
      disableClose: true, // disable background click
      data: {
        // row: item
      }
    });
    dialogRef.afterOpened().subscribe(() => {
      document.body.classList.add('blur-background');
    });

    dialogRef.afterClosed().subscribe(() => {
      document.body.classList.remove('blur-background');
    });
  }
}


