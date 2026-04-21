// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CancelAttotmentService } from '../../cancelAttotment.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CancelAttotment } from '../../cancelAttotment.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogCAComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CancelAttotment;
  AllotmentID: any;
  AllotmentStatus: any;
  constructor(
    private snackBar: MatSnackBar,
  public dialogRef: MatDialogRef<FormDialogCAComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CancelAttotmentService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Cancel Allotment';       
          this.advanceTable = data.advanceTable;
          //this.ImagePath=this.advanceTable.cancelAttotmentSign;
        } else 
        {
          this.dialogTitle = 'Cancel Allotment';
          this.advanceTable = new CancelAttotment({});
          //this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.AllotmentID=data.allotmentID;
        this.AllotmentStatus=data.allotmentStatus
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
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      allotmentID: [this.advanceTable.allotmentID],
      dateOfCancellation: [this.advanceTable.dateOfCancellation],
      timeOfCancellation: [this.advanceTable.timeOfCancellation],
      cancellationByEmployeeID: [this.advanceTable.cancellationByEmployeeID],
      cancellationRemark: [this.advanceTable.cancellationRemark],
      allotmentStatus: [this.advanceTable.allotmentStatus],

    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
    // emppty stuff
  }
  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
      this.ImagePath="";
    } else {
      this.dialogRef.close();
    }
  }
  public Post(): void
  {
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CancelAttotmentCreate:CancelAttotmentView:Success');//To Send Updates  
    
  },
    error =>
    {
       this._generalService.sendUpdate('CancelAttotmentAll:CancelAttotmentView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({allotmentID: this.AllotmentID});
    this.advanceTableForm.patchValue({allotmentStatus:this.AllotmentStatus});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('CancelAttotmentUpdate:CancelAttotmentView:Success');//To Send Updates 
      this.showNotification(
        'snackbar-success',
        'CancelAttotment Updated...!!!',
        'bottom',
        'center'
      );
      
    },
    error =>
    {
     this._generalService.sendUpdate('CancelAttotmentAll:CancelAttotmentView:Failure');//To Send Updates  
    }
  )
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  public confirmAdd(): void 
  {
    this.Put();
  }
   /////////////////for Image Upload////////////////////////////
   public response: { dbPath: '' };
   public ImagePath: string = "";
   public uploadFinished = (event) => 
   {
     this.response = event;
     this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
     this.advanceTableForm.patchValue({cancelAttotmentSign:this.ImagePath})
   }
 /////////////////for Image Upload ends////////////////////////////
 
}


