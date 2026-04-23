// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarAndDriverAllotmentService } from '../CarAndDriverAllotment.service';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogNotificationComponent 
{
  saveDisabled:boolean=true;
  advanceTableForm = this.fb.group({
    bidID: [''],
    reservationID: [''],
    bidSentTo: [''],
    driverIDList:[''],
    bidOpenRemark: ['']
  })
  dialogTitle:string;
  reservationID: any;
  newItems=[];
  constructor(
    private snackBar: MatSnackBar,
  public dialogRef: MatDialogRef<FormDialogNotificationComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public _carAndDriverAllotmentService:CarAndDriverAllotmentService,
    private fb: FormBuilder)
  {      
    this.dialogTitle="Bid Notification";
    this.reservationID=data.reservationID;
    this.newItems=data.newItems;
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);
  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  
  PostBidNotification()
  {
    this.saveDisabled = false;
    this.advanceTableForm.patchValue({reservationID:this.reservationID});
    this.advanceTableForm.patchValue({driverIDList:this.newItems});
    this._carAndDriverAllotmentService.addBidNotification(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
        
        this.showNotification(
          'snackbar-success',
          'Bid Created...',
          'bottom',
          'center'
        );   
        this.saveDisabled = true;
        this.dialogRef.close();   
      },
      error =>
      {
        this.newItems=[];
        this.showNotification(
          'snackbar-danger',
          'Operation Failed...',
          'bottom',
          'center'
        ); 
        this.saveDisabled = true;
      }
    );
  }


  submit() 
  {
    // emppty stuff
  }
  onNoClick() {
    this.advanceTableForm.reset();
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
 
}


