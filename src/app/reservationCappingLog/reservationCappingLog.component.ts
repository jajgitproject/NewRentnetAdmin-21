// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { ReservationCappingLogModel } from './reservationCappingLog.model';
import { ReservationCappingLogService } from './reservationCappingLog.service';

@Component({
  standalone: false,
  selector: 'app-reservationCappingLog',
  templateUrl: './reservationCappingLog.component.html',
  styleUrls: ['./reservationCappingLog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ReservationCappingLogComponent implements OnInit {
  displayedColumns = [
    'reservationCappingLogID',
    'dateOfAttempt',
    'cappingType',
    'customerGroup',
    'city',
    'packageType',
    'vehicle',
    'pickUpDate',
    'userName'
  ];

  dataSource: ReservationCappingLogModel[] = [];
  PageNumber = 1;
  searchCustomerGroup = '';
  searchCity = '';
  searchPackageType = '';
  searchVehicle = '';
  searchCappingType = '';
  searchFromPickUpDate: any = '';
  searchToPickUpDate: any = '';
  searchFromAttemptDate: any = '';
  searchToAttemptDate: any = '';

  constructor(private reservationCappingLogService: ReservationCappingLogService) {}

  ngOnInit(): void {
    this.loadData();
  }

  refresh(): void {
    this.searchCustomerGroup = '';
    this.searchCity = '';
    this.searchPackageType = '';
    this.searchVehicle = '';
    this.searchCappingType = '';
    this.searchFromPickUpDate = '';
    this.searchToPickUpDate = '';
    this.searchFromAttemptDate = '';
    this.searchToAttemptDate = '';
    this.PageNumber = 1;
    this.loadData();
  }

  SearchData(): void {
    this.PageNumber = 1;
    this.loadData();
  }

  nextPage(): void {
    if (!this.dataSource?.length) {
      return;
    }
    this.PageNumber += 1;
    this.loadData();
  }

  prevPage(): void {
    if (this.PageNumber <= 1) {
      return;
    }
    this.PageNumber -= 1;
    this.loadData();
  }

  private formatDateForApi(value: any): string {
    if (!value) {
      return '';
    }
    const m = moment(value);
    return m.isValid() ? m.format('YYYY-MM-DD') : '';
  }

  loadData(): void {
    this.reservationCappingLogService
      .getTableData(
        this.searchCustomerGroup,
        this.searchCity,
        this.searchPackageType,
        this.searchVehicle,
        this.searchCappingType,
        this.formatDateForApi(this.searchFromPickUpDate),
        this.formatDateForApi(this.searchToPickUpDate),
        this.formatDateForApi(this.searchFromAttemptDate),
        this.formatDateForApi(this.searchToAttemptDate),
        this.PageNumber,
        'ReservationCappingLogID',
        'Descending'
      )
      .subscribe(
        (data) => {
          const rows = Array.isArray(data) ? data : data?.$values || data?.data || [];
          this.dataSource = (rows || []).map((row) => new ReservationCappingLogModel(row));
        },
        (_error: HttpErrorResponse) => {
          this.dataSource = [];
        }
      );
  }
}
