// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CustomerCategorySoldOutConfigService } from '../../customerCategorySoldOutConfig.service';
import { GeneralService } from '../../../general/general.service';

@Component({
  standalone: false,
  selector: 'app-soldout-delete',
  templateUrl: './delete.component.html'
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: CustomerCategorySoldOutConfigService,
    public _generalService: GeneralService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    this.advanceTableService.delete(this.data.customerCategorySoldOutConfigID).subscribe(
      () => {
        this._generalService.sendUpdate('CustomerCategorySoldOutConfigDelete:View:Success');
      },
      () => {
        this._generalService.sendUpdate('CustomerCategorySoldOutConfigDelete:View:Failure');
      }
    );
  }
}
