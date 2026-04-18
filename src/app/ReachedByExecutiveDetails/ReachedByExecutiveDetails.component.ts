// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { ReachedByExecutiveDetails } from './ReachedByExecutiveDetails.model';
import { DutySlipQualityCheckedByExecutive } from '../dutySlipQualityCheckedByExecutive/dutySlipQualityCheckedByExecutive.model';
@Component({
  standalone: false,
  selector: 'app-ReachedByExecutiveDetails',
  templateUrl: './ReachedByExecutiveDetails.component.html',
  styleUrls: ['./ReachedByExecutiveDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ReachedByExecutiveDetailsComponent {
  dataSource: ReachedByExecutiveDetails[] | null;
   DutySlipQualityCheckDetails: any;
  reachedDetails:any;
  dialogTitle: string;
  ReachedByExecutiveDetails: any;

  constructor(
    public dialogRef: MatDialogRef<ReachedByExecutiveDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public _generalService: GeneralService
  ) {
    // Set the defaults
    this.dialogTitle = 'Reached By Executive Details';
    this.ReachedByExecutiveDetails = this.data;
    console.log(this.data);
    this.reachedDetails = this.data?.dataSource
    console.log(this.reachedDetails)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


