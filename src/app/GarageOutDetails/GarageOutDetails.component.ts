// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelDetails } from '../controlPanelDesign/controlPanelDesign.model';
import { GarageOutDetails } from './GarageOutDetails.model';
import { DutySlipQualityCheckedByExecutiveService } from '../dutySlipQualityCheckedByExecutive/dutySlipQualityCheckedByExecutive.service';
import { DutySlipQualityCheckedByExecutive } from '../dutySlipQualityCheckedByExecutive/dutySlipQualityCheckedByExecutive.model';
import { HttpErrorResponse } from '@angular/common/http';
import { DispatchByExecutiveService } from '../dispatchByExecutive/dispatchByExecutive.service';
import { DispatchByExecutive } from '../dispatchByExecutive/dispatchByExecutive.model';
@Component({
  standalone: false,
  selector: 'app-GarageOutDetails',
  templateUrl: './GarageOutDetails.component.html',
  styleUrls: ['./GarageOutDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class GarageOutDetailsComponent {
  GarageOutDetails: any;
  dialogTitle: string;
  allotmentID: number;
  dataSourceForDutySlip: any[] | null;
  qcDetails:any;
  ReservationID: number;

  constructor(
    public dialogRef: MatDialogRef<GarageOutDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public _generalService: GeneralService,
    public dispatchByExecutiveService: DispatchByExecutiveService,
      // public FeedBackDetailsInfo: ControlPanelDetails,
      public dialog: MatDialog,
     
  ) {
    // Set the defaults
    this.dialogTitle = 'Garage Out Details';
    // this.GarageOutDetails = this.data;
    this.qcDetails = this.data?.dataSource;
    // this.qcDetails = this.GarageOutDetails?.dataSource
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
 
}


