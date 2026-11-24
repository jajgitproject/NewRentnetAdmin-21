// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DebitService } from '../../debit.service';
import { GeneralService } from '../../../general/general.service';

@Component({
  standalone: false,
  selector: 'app-debit-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public debitService: DebitService,
    public _generalService: GeneralService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    const debitId = this.data?.debitID ?? this.data?.DebitID;
    if (!debitId) {
      this._generalService.sendUpdate('DebitAll:DebitView:Failure');
      return;
    }
    this.debitService.delete(debitId).subscribe(
      () => {
        this._generalService.sendUpdate('DebitDelete:DebitView:Success');
        this.dialogRef.close();
      },
      (err) => {
        const msg =
          typeof err?.error === 'string'
            ? err.error
            : err?.error?.message || err?.message || 'Delete failed.';
        this._generalService.sendUpdate('DebitAll:DebitView:Failure');
        console.error(msg);
      }
    );
  }
}