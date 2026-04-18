// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { PickUpDetailShow } from './pickUpDetailShow.model';
import { PickUpDetailShowService } from './pickUpDetailShow.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-pickUpDetailShow',
  templateUrl: './pickUpDetailShow.component.html',
  styleUrls: ['./pickUpDetailShow.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class PickUpDetailShowComponent {
  dialogTitle: string;
  dutySlipID: number;
  dataSource: PickUpDetailShow | null;
  //pickUpDetailData:any;

  constructor(
    public dialogRef: MatDialogRef<PickUpDetailShowComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:any,
    //public advanceTable:PickUpDetailShow,
    public pickUpDetailShowService: PickUpDetailShowService
  ) 
  {
    // Set the defaults
    this.dialogTitle = 'Pick Up Details';
    this.dutySlipID = data.dutySlipID;
  }

  ngOnInit() {
    this.PickUpLoadData();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public PickUpLoadData() 
  {
     this.pickUpDetailShowService.getPickUpData(this.dutySlipID).subscribe
     (
      (data:PickUpDetailShow) =>   
        {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource=null }
    );
  }

}


