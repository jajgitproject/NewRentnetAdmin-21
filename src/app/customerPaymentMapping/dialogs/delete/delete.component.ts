// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { CustomerPaymentMappingService } from '../../customerPaymentMapping.service';

@Component({
  standalone: false,
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: CustomerPaymentMappingService,
    public _generalService: GeneralService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    this.advanceTableService.delete(this.data.customerPaymentMappingID).subscribe(
      () => {
        this._generalService.sendUpdate('CustomerPaymentMappingDelete:CustomerPaymentMappingView:Success');
      },
      () => {
        this._generalService.sendUpdate('CustomerPaymentMappingAll:CustomerPaymentMappingView:Failure');
      }
    );
  }
}
