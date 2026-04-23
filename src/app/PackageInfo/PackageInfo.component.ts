// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelDetails } from '../controlPanelDesign/controlPanelDesign.model';
@Component({
  standalone: false,
  selector: 'app-PackageInfo',
  templateUrl: './PackageInfo.component.html',
  styleUrls: ['./PackageInfo.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class PackageInfoComponent {
  public packageInfo: ControlPanelDetails;
  dialogTitle: string;
  constructor(
    public dialogRef: MatDialogRef<PackageInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { advanceTable: ControlPanelDetails },
    public _generalService: GeneralService
  ) {
    // Set the defaults
    this.dialogTitle = 'Package Info';
    this.packageInfo = new ControlPanelDetails({});
    this.packageInfo = this.data.advanceTable;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}


