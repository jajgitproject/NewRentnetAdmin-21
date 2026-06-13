// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BillingHistoryModel, NewBillingHistoryModel } from './billingHistory.model';
import { BillingHistoryService } from './billingHistory.service';
import { PageEvent } from '@angular/material/paginator';
import {
  Component,
  Inject,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
@Component({
  standalone: false,
  selector: 'app-billingHistory',
  templateUrl: './billingHistory.component.html',
  styleUrls: ['./billingHistory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BillingHistoryComponent
  implements AfterViewInit {

  dataSource: BillingHistoryModel[] = [];
  totalRecord = 0;
  recordsPerPage = 5;
  isLoading = false;
  PageNumber = 0;
  DutySlipID: any;

  constructor(
    public dialogRef: MatDialogRef<BillingHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _generalService: GeneralService,
    public billingHistoryService: BillingHistoryService,
    private cdr: ChangeDetectorRef
  ) {
    this.DutySlipID = data.dutySlipID;
  }

  ngAfterViewInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.billingHistoryService
      .GetBillingHistoryData(
        this.DutySlipID,
        this.PageNumber
      )
      .subscribe({
        next: (response: NewBillingHistoryModel) => {

          this.dataSource =
            response?.billingHistoryDetails || [];

          this.totalRecord =
            response?.totalRecords || 0;

          this.isLoading = false;

          this.cdr.detectChanges();
        },
        error: () => {
          this.dataSource = [];
          this.totalRecord = 0;
          this.isLoading = false;

          this.cdr.detectChanges();
        }
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.PageNumber = pageData.pageIndex;
    this.loadData();
  }

  onNoClick() {
    this.dialogRef.close();
  }
}


