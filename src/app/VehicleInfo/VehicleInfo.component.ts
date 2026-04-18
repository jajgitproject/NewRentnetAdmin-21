// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelDetails } from '../controlPanelDesign/controlPanelDesign.model';
@Component({
  standalone: false,
  selector: 'app-VehicleInfo',
  templateUrl: './VehicleInfo.component.html',
  styleUrls: ['./VehicleInfo.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VehicleInfoComponent {
  public vehicleInfo: ControlPanelDetails;
  dialogTitle: string;

  constructor(
    public dialogRef: MatDialogRef<VehicleInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { advanceTable: ControlPanelDetails },
    public _generalService: GeneralService
  ) {
    // Set the defaults
    this.dialogTitle = 'Vehicle Info';
    this.vehicleInfo = new ControlPanelDetails({});
    this.vehicleInfo = this.data.advanceTable;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}


