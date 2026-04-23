// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelDetails } from '../controlPanelDesign/controlPanelDesign.model';
@Component({
  standalone: false,
  selector: 'app-VehicleCategoryInfo',
  templateUrl: './VehicleCategoryInfo.component.html',
  styleUrls: ['./VehicleCategoryInfo.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VehicleCategoryInfoComponent {
  public vehicleCategoryInfo: ControlPanelDetails;
  dialogTitle: string;
  constructor(
    public dialogRef: MatDialogRef<VehicleCategoryInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { advanceTable: ControlPanelDetails },
    public _generalService: GeneralService
  ) {
    // Set the defaults
    this.dialogTitle = 'Vehicle Category Info';
    this.vehicleCategoryInfo = new ControlPanelDetails({});
    this.vehicleCategoryInfo = this.data.advanceTable;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


