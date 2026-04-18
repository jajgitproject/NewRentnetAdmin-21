// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { DutySlipQualityCheckedByExecutiveDetails } from './DutySlipQualityCheckedByExecutiveDetails.model';
import { DutySlipQualityCheckedByExecutive } from '../dutySlipQualityCheckedByExecutive/dutySlipQualityCheckedByExecutive.model';
@Component({
  standalone: false,
  selector: 'app-DutySlipQualityCheckedByExecutiveDetails',
  templateUrl: './DutySlipQualityCheckedByExecutiveDetails.component.html',
  styleUrls: ['./DutySlipQualityCheckedByExecutiveDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutySlipQualityCheckedByExecutiveDetailsComponent {
  dataSource: DutySlipQualityCheckedByExecutive[] | null;
   DutySlipQualityCheckDetails: any;
  qcDetails:any;
  dialogTitle: string;

  constructor(
    public dialogRef: MatDialogRef<DutySlipQualityCheckedByExecutiveDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public _generalService: GeneralService
  ) {
    // Set the defaults
    this.dialogTitle = 'Verify Quality Check Details';
    this.DutySlipQualityCheckDetails = this.data;
    console.log(this.data);
    this.qcDetails = this.data?.dataSource?.[0]
    console.log(this.qcDetails)
  }
  //----For Image
 openImageInNewTab(imageUrl: string) {
  window.open(imageUrl, '_blank');
}
  onNoClick(): void {
    this.dialogRef.close();
  }
}


