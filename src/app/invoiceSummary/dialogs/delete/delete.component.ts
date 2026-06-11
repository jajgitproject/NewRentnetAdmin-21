// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { InvoiceSummaryService } from '../../invoiceSummary.service';
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
    public advanceTableService: InvoiceSummaryService,
    public _generalService: GeneralService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    this.advanceTableService.delete(this.data.invoiceSummaryID).subscribe(
      () => {
        this._generalService.sendUpdate('InvoiceSummaryDelete:InvoiceSummaryView:Success');
      },
      () => {
        this._generalService.sendUpdate('InvoiceSummaryAll:InvoiceSummaryView:Failure');
      }
    );
  }
}
