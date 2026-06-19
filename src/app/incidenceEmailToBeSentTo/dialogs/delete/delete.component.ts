// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { IncidenceEmailToBeSentToService } from '../../incidenceEmailToBeSentTo.service';
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
    public advanceTableService: IncidenceEmailToBeSentToService,
    public _generalService: GeneralService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    this.advanceTableService.delete(this.data.incidenceEmailToBeSentToID).subscribe(
      () => {
        this._generalService.sendUpdate('IncidenceEmailToBeSentToDelete:IncidenceEmailToBeSentToView:Success');
      },
      () => {
        this._generalService.sendUpdate('IncidenceEmailToBeSentToAll:IncidenceEmailToBeSentToView:Failure');
      }
    );
  }
}
