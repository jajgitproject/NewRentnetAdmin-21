// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { VendorLocalTransferRateService } from '../../vendorLocalTransferRate.service';
import { GeneralService } from '../../../general/general.service';
@Component({
  standalone: false,
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteDialogComponent
{
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: VendorLocalTransferRateService,
    public _generalService: GeneralService
  )
  {
    
  }
  onNoClick(): void
  {
    this.dialogRef.close();
  }
  confirmDelete()
{
  this.advanceTableService
    .delete(this.data.vendorLocalTransferRateID)
    .subscribe(
      () => {
        this._generalService.sendUpdate(
          'VendorLocalTransferRateDelete:VendorLocalTransferRateView:Success'
        );
        this.dialogRef.close(true); // ✅ IMPORTANT
      },
      () => {
        this._generalService.sendUpdate(
          'VendorLocalTransferRateAll:VendorLocalTransferRateView:Failure'
        );
        this.dialogRef.close(false);
      }
    );
}

}


