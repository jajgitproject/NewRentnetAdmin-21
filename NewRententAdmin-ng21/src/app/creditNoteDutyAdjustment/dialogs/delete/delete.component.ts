// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { CreditNoteDutyAdjustmentService } from '../../creditNoteDutyAdjustment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    public creditNoteDutyAdjustmentService: CreditNoteDutyAdjustmentService,
    public _generalService: GeneralService,
    private snackBar: MatSnackBar,
  )
  {
    
  }
  onNoClick(): void
  {
    this.dialogRef.close();
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  confirmDelete()
  {
    this.creditNoteDutyAdjustmentService.delete(this.data.invoiceCreditNoteDutySlipAdjustmentID)  
    .subscribe(
    data => 
    {
      this.showNotification(
        'snackbar-success',
        'Duty Adjustment Deleted...!!!',
        'bottom',
        'center'
        );  
    },
    error =>
      {
        this.showNotification(
          'snackbar-danger',
          'Operation Failed...!!!',
          'bottom',
          'center'
        );
    })
  }
}


