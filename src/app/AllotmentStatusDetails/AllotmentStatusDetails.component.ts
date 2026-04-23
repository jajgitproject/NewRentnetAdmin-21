// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { AllotmentStatusDetails } from './AllotmentStatusDetails.model';
@Component({
  standalone: false,
  selector: 'app-AllotmentStatusDetails',
  templateUrl: './AllotmentStatusDetails.component.html',
  styleUrls: ['./AllotmentStatusDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class AllotmentStatusDetailsComponent {
  AllotmentStatusDetails: any;
  dialogTitle: string;
  allotmentNotDone:boolean=false;

  constructor(
    public dialogRef: MatDialogRef<AllotmentStatusDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      advanceTable: AllotmentStatusDetails;
    },
    public _generalService: GeneralService
  ) {
    // Set the defaults
    this.AllotmentStatusDetails = this.data;
    if(!this.AllotmentStatusDetails?.row?.allotmentID)
    {
      this.dialogTitle = ' Allotment Status Details';
      this.allotmentNotDone = true;
    }
    else{
      this.dialogTitle = ' Allotment Status Details';
      this.allotmentNotDone = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


