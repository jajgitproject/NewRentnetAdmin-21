// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { NextDayInstructionDetails } from './NextDayInstructionDetails.model';
import { DriverRemarkService } from '../driverRemark/driverRemark.service';
import { NextDayInstructionService } from '../nextDayInstruction/nextDayInstruction.service';
@Component({
  standalone: false,
  selector: 'app-NextDayInstructionDetails',
  templateUrl: './NextDayInstructionDetails.component.html',
  styleUrls: ['./NextDayInstructionDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class NextDayInstructionDetailsComponent {
  NextDayInstructionDetails: any;
  dialogTitle: string;
  dataSource: any[] | null;
  constructor(
    public dialogRef: MatDialogRef<NextDayInstructionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:any,
    public _generalService: GeneralService,
    public nextDayInstructionService: NextDayInstructionService
  ) {
    // Set the defaults
    this.dialogTitle = 'Next Day Instruction Details';
    this.NextDayInstructionDetails = this.data;
  this.NextDayInstructionDetails = this.data?.dataSource;
  
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}



