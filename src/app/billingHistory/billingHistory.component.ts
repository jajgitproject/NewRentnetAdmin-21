// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BillingHistoryModel, NewBillingHistoryModel } from './billingHistory.model';
import { BillingHistoryService } from './billingHistory.service';
import { PageEvent } from '@angular/material/paginator';
@Component({
  standalone: false,
  selector: 'app-billingHistory',
  templateUrl: './billingHistory.component.html',
  styleUrls: ['./billingHistory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BillingHistoryComponent {
  dataSource: BillingHistoryModel[];
   DutySlipQualityCheckDetails: any;
  qcDetails:any;
  dialogTitle: string;
  ReservationID: any;
  DutySlipID: any;
  totalData = 0;
  recordsPerPage = 5;
  isLoading = true;
  totalRecord: number;
  currentPage = 1;
  PageNumber: number = 0;

  constructor(
    public dialogRef: MatDialogRef<BillingHistoryComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public _generalService: GeneralService,
    public billingHistoryService: BillingHistoryService,
  ) {
    this.DutySlipID = data.dutySlipID;
  }

  ngOnInit() 
  {
    this.loadData();
  }

  public loadData() 
   {
    
      this.billingHistoryService.GetBillingHistoryData(this.DutySlipID, this.PageNumber).subscribe
    (
      (data : NewBillingHistoryModel) =>   
      {
        this.dataSource = data.billingHistoryDetails;
        this.totalRecord = data.totalRecords;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  onChangedPage(pageData: PageEvent) {
    
      this.isLoading = true;
      this.PageNumber = pageData.pageIndex;
      this.loadData();
    }

  onNoClick(): void 
  {
    this.dialogRef.close();
  }
}


