// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { HttpErrorResponse } from '@angular/common/http';
import { DropOffDetailShow } from './dropOffDetailShow.model';
import { DropOffDetailShowService } from './dropOffDetailShow.service';

@Component({
  standalone: false,
  selector: 'app-dropOffDetailShow',
  templateUrl: './dropOffDetailShow.component.html',
  styleUrls: ['./dropOffDetailShow.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DropOffDetailShowComponent {
  dialogTitle: string;
  dutySlipID: number;
  dataSource: DropOffDetailShow | null;

  constructor(
    public dialogRef: MatDialogRef<DropOffDetailShowComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:any,
    public dropOffDetailShowService: DropOffDetailShowService
  ) 
  {
    // Set the defaults
    this.dialogTitle = 'Drop Off Details';
    this.dutySlipID = data.dutySlipID;
  }

  ngOnInit() {
    this.DropOffLoadData();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public DropOffLoadData() 
  {
     this.dropOffDetailShowService.getDropOffData(this.dutySlipID).subscribe
     (
      (data:DropOffDetailShow) =>   
        {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource=null }
    );
  }

}


