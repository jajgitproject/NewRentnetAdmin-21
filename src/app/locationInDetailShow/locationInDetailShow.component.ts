// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationInDetailShow } from './locationInDetailShow.model';
import { LocationInDetailShowService } from './locationInDetailShow.service';

@Component({
  standalone: false,
  selector: 'app-locationInDetailShow',
  templateUrl: './locationInDetailShow.component.html',
  styleUrls: ['./locationInDetailShow.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class LocationInDetailShowComponent {
  dialogTitle: string;
  dutySlipID: number;
  dataSource: LocationInDetailShow | null;

  constructor(
    public dialogRef: MatDialogRef<LocationInDetailShowComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:any,
    public locationInDetailShowService: LocationInDetailShowService
  ) 
  {
    // Set the defaults
    this.dialogTitle = 'Garage In Details';
    this.dutySlipID = data.dutySlipID;
  }

  ngOnInit() {
    this.LocationInLoadData();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public LocationInLoadData() 
  {
     this.locationInDetailShowService.getLocationInData(this.dutySlipID).subscribe
     (
      (data:LocationInDetailShow) =>   
        {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource=null }
    );
  }

}


