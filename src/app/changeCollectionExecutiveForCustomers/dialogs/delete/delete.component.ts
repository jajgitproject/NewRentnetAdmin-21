// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ChangeCollectionExecutiveForCustomersService } from '../../changeCollectionExecutiveForCustomers.service';
import { GeneralService } from '../../../general/general.service';

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
    public advanceTableService: ChangeCollectionExecutiveForCustomersService,
    public _generalService: GeneralService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    this.advanceTableService.delete(this.data.collectionExecutiveUpdateID).subscribe(
      () => {
        this._generalService.sendUpdate('ChangeCollectionExecutiveForCustomersDelete:ChangeCollectionExecutiveForCustomersView:Success');
      },
      () => {
        this._generalService.sendUpdate('ChangeCollectionExecutiveForCustomersAll:ChangeCollectionExecutiveForCustomersView:Failure');
      }
    );
  }
}
