// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { LifeCycleStatus } from './lifeCycleStatus.model';
import { LifeCycleStatusService } from './lifeCycleStatus.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-lifeCycleStatus',
  templateUrl: './lifeCycleStatus.component.html',
  styleUrls: ['./lifeCycleStatus.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class LifeCycleStatusComponent {
  dialogTitle: string;
  // reservationID: number;
  dataSource: LifeCycleStatus | null;
  reservationID: number;
  lifeCycleStatusdataSource: any[] = [];
  //pickUpDetailData:any;
  noDataFound: boolean = false; // Flag to track if no data is found
  constructor(
    public dialogRef: MatDialogRef<LifeCycleStatusComponent>,
    @Inject(MAT_DIALOG_DATA)
    // private dialog: MatDialog,
    public data:any,
    //public advanceTable:LifeCycleStatus,
    public lifeCycleStatusService: LifeCycleStatusService
    
  ) 
  {
    // Set the defaults
    this.dialogTitle = 'Life Cycle Status';
    this.reservationID = data.reservationID;
  }

  ngOnInit() {
    this.lifeCycleStatusLoadData();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public lifeCycleStatusLoadData() {
    this.lifeCycleStatusService.getlifeCycleStatus(this.reservationID).subscribe(
      data => {
        if (data && data.length > 0) {
          this.lifeCycleStatusdataSource = data;
          this.noDataFound = false;  // Data exists, set to false
        } else {
          this.lifeCycleStatusdataSource = [];
          this.noDataFound = true;  // No data found, set flag to true
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching life cycle status:', error);
        this.lifeCycleStatusdataSource = [];
        this.noDataFound = true;  // Error in fetching, set flag to true
      }
    );
  }
}


