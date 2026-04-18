// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { DriverRemarkDetails } from './DriverRemarkDetails.model';
import { DriverRemarkService } from '../driverRemark/driverRemark.service';
@Component({
  standalone: false,
  selector: 'app-DriverRemarkDetails',
  templateUrl: './DriverRemarkDetails.component.html',
  styleUrls: ['./DriverRemarkDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DriverRemarkDetailsComponent {
  DriverRemarkDetails: any;
  dialogTitle: string;
  dataSource: any[] | null;
  constructor(
    public dialogRef: MatDialogRef<DriverRemarkDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:any,
    public _generalService: GeneralService,
    public driverRemarkService: DriverRemarkService
  ) {
    // Set the defaults
    this.dialogTitle = 'Driver Remark Details';
    this.DriverRemarkDetails = this.data;
    console.log(this.DriverRemarkDetails);
  this.DriverRemarkDetails = this.data?.dataSource;
  console.log(this.data);
  console.log(this.DriverRemarkDetails)
  
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}



