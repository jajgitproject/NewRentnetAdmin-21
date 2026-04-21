// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import {
  ControlPanelDetails,
  StopsModel
} from '../controlPanelDesign/controlPanelDesign.model';
@Component({
  standalone: false,
  selector: 'app-StopDetailsInfo',
  templateUrl: './StopDetailsInfo.component.html',
  styleUrls: ['./StopDetailsInfo.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class StopDetailsInfoComponent {
  public stopDetailsInfo: ControlPanelDetails;
  dialogTitle: string;

  constructor(
    public dialogRef: MatDialogRef<StopDetailsInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { advanceTable: ControlPanelDetails},
    public _generalService: GeneralService
  ) {
    // Set the defaults
    this.dialogTitle = 'Stop Details';
    this.stopDetailsInfo = new ControlPanelDetails({});
    this.stopDetailsInfo = this.data.advanceTable;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


