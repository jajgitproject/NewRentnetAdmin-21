// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelDetails } from '../controlPanelDesign/controlPanelDesign.model';
@Component({
  standalone: false,
  selector: 'app-SpecialInstructionInfo',
  templateUrl: './SpecialInstructionInfo.component.html',
  styleUrls: ['./SpecialInstructionInfo.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SpecialInstructionInfoComponent {
  public specialInstructionInfo: ControlPanelDetails;
  dialogTitle: string;

  constructor(
    public dialogRef: MatDialogRef<SpecialInstructionInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { advanceTable: ControlPanelDetails },
    public _generalService: GeneralService
  ) {
    // Set the defaults
    this.dialogTitle = 'Special Instructions';
    this.specialInstructionInfo = new ControlPanelDetails({});
    this.specialInstructionInfo = this.data.advanceTable;
  }

   ///----For Image
 openImageInNewTab(imageUrl: string) {
  window.open(imageUrl, '_blank');
}

  onNoClick(): void {
    this.dialogRef.close();
  }
}


