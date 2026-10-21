// @ts-nocheck
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { CustomerGroupReservationCappingService } from '../../customerGroupReservationCapping.service';
import { GeneralService } from '../../../general/general.service';

export interface BulkDeleteDialogData {
  ids: number[];
}

@Component({
  standalone: false,
  selector: 'app-bulk-delete-dialog',
  templateUrl: './bulk-delete-dialog.component.html',
  styleUrls: ['./bulk-delete-dialog.component.sass']
})
export class BulkDeleteDialogComponent {
  deleting = false;

  constructor(
    public dialogRef: MatDialogRef<BulkDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BulkDeleteDialogData,
    private cappingService: CustomerGroupReservationCappingService,
    private generalService: GeneralService
  ) {}

  get count(): number {
    return this.data?.ids?.length ?? 0;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    const ids = (this.data?.ids ?? []).filter((id) => Number(id) > 0);
    if (!ids.length || this.deleting) {
      return;
    }
    this.deleting = true;
    forkJoin(ids.map((id) => this.cappingService.delete(id))).subscribe({
      next: () => {
        this.deleting = false;
        this.dialogRef.close(true);
        this.generalService.sendUpdate('CustomerGroupReservationCappingDelete:CustomerGroupReservationCappingView:Success');
      },
      error: () => {
        this.deleting = false;
        this.generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
      }
    });
  }
}
