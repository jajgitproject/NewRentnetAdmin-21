// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DutySlipQualityCheckService } from '../../dutySlipQualityCheck.service';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  standalone: false,
  selector: 'app-deleteDA',
  templateUrl: './deleteDA.component.html',
  styleUrls: ['./deleteDA.component.sass']
})
export class DeleteDADialogComponent
{
  constructor(
    public dialogRef: MatDialogRef<DeleteDADialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public advanceTableService: DutySlipQualityCheckService,
    public _generalService: GeneralService
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
    this.advanceTableService.deleteAmenitie(this.data.dutyAmenitieID)  
    .subscribe(
    data => 
    {
        this.showNotification(
          'snackbar-success',
          'Duty Amenitie Deleted...!!!',
          'bottom',
          'center'
        );
    },
    error =>
    {
        this.showNotification(
                'snackbar-danger',
                'Operation Failed.....!!!',
                'bottom',
                'center'
              );    
    }
    )
  }
}


