// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { BookerInfo } from './BookerInfo.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelDetails } from '../controlPanelDesign/controlPanelDesign.model';
@Component({
  standalone: false,
  selector: 'app-BookerInfo',
  templateUrl: './BookerInfo.component.html',
  styleUrls: ['./BookerInfo.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BookerInfoComponent {
  public bookerInfo: ControlPanelDetails;
  dialogTitle: string;

  constructor(
    public dialogRef: MatDialogRef<BookerInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { advanceTable: ControlPanelDetails },
    public _generalService: GeneralService
  ) {
    // Set the defaults
    this.dialogTitle = 'Booker Info';
    this.bookerInfo = new ControlPanelDetails({});
    this.bookerInfo = this.data.advanceTable;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


