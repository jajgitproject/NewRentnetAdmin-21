// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { HttpErrorResponse } from '@angular/common/http';
import { DutySlipImageDetailsShowService } from './dutySlipImageDetailsShow.service';
import { DutySlipImageDetailsShow } from './dutySlipImageDetailsShow.model';


@Component({
  standalone: false,
  selector: 'app-dutySlipImageDetailsShow',
  templateUrl: './dutySlipImageDetailsShow.component.html',
  styleUrls: ['./dutySlipImageDetailsShow.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutySlipImageDetailsShowComponent {
  dialogTitle: string;
  dutySlipID: number;
  dataSource: DutySlipImageDetailsShow | null;
  qcDetails: any;

  constructor(
    public dialogRef: MatDialogRef<DutySlipImageDetailsShowComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:any,
    public dutySlipImageDetailsShowService: DutySlipImageDetailsShowService
  ) 
  {
    // Set the defaults
    this.dialogTitle = 'Duty Slip Image Details';
    this.dutySlipID = data.dutySlipID;
    
  }

  ngOnInit() {
    this.DutySlipImageLoadData();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

   ///----For Image
 openImageInNewTab(imageUrl: string) {
  window.open(imageUrl, '_blank');
}


  public DutySlipImageLoadData() 
  {
     this.dutySlipImageDetailsShowService.getDutySlipImageData(this.dutySlipID).subscribe
     (
      (data:DutySlipImageDetailsShow) =>   
        {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource=null }
    );
  }

}


