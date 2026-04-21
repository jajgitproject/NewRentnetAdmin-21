// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CancelAllotmentService } from '../../cancelAllotment.service';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-softToHard-dialog',
  templateUrl: './softToHard-Dialog.component.html',
  styleUrls: ['./softToHard-Dialog.component.sass']
})
export class SoftToHardDialogComponent
{
  allotmentID: any;
  allotmentTypeData:any;
  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SoftToHardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: CancelAllotmentService,
    public _generalService: GeneralService
  )
  {
    this.allotmentTypeData = data.advanceTable,
    this.allotmentID = data.allotmentID;
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

  confirmConverting()
  {
    this.advanceTableService.updateAllotmentType(this.allotmentTypeData)  
    .subscribe(
    data => 
    {
       this.showNotification(
        'snackbar-success',
        'Updated...!!!',
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
    }
    )
  }
}


