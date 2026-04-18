// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelDetails, PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
@Component({
  standalone: false,
  selector: 'app-PassengerInfo',
  templateUrl: './PassengerInfo.component.html',
  styleUrls: ['./PassengerInfo.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class PassengerInfoComponent {
  public passengerInfo: ControlPanelDetails;
  dialogTitle: string;

  constructor(
    public dialogRef: MatDialogRef<PassengerInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      advanceTable: ControlPanelDetails;
    },
    public _generalService: GeneralService
  ) {
    // Set the defaults
    this.dialogTitle = 'Passenger Info';
    this.passengerInfo = new ControlPanelDetails({});
    this.passengerInfo = this.data.advanceTable;
    console.log(this.passengerInfo)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


