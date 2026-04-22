// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancelAllotmentService } from '../../cancelAllotment.service';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-softToHard-dialog',
  templateUrl: './softToHard-Dialog.component.html',
  styleUrls: ['./softToHard-Dialog.component.sass'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ]
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


