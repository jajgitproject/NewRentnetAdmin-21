// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CancelAllotmentService } from '../../cancelAllotment.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CancelAllotment } from '../../cancelAllotment.model';
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
  saveDisabled:boolean=true;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CancelAllotment;
  AllotmentID: any;
  AllotmentStatus: any;
   status: string = '';
  buttonDisabled: boolean = false;
    normalizedStatus: string = '';
  constructor(
    private snackBar: MatSnackBar,
  public dialogRef: MatDialogRef<FormDialogCAComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CancelAllotmentService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
         // status gating
    // this.status = data?.status;
    // this.buttonDisabled = this.status ? this.status.toLowerCase() !== 'changes allow' : false;
    // console.log(data);
      this.status = data?.status || '';

    // ✅ normalize (important)
    this.normalizedStatus = this.status.toLowerCase().trim();

    // ✅ button logic
    this.buttonDisabled = this.normalizedStatus !== 'changes allow';

    console.log('STATUS:', this.status);
    console.log('NORMALIZED:', this.normalizedStatus);
    console.log('BUTTON DISABLED:', this.buttonDisabled);

        if (this.action === 'edit') 
        {
          this.dialogTitle ='Cancel Allotment';       
          this.advanceTable = data.advanceTable;
          //this.ImagePath=this.advanceTable.cancelAllotmentSign;
        } else 
        {
          this.dialogTitle = 'Cancel Allotment';
          this.advanceTable = new CancelAllotment({});
          //this.advanceTable.activationStatus=true;
        }
        
        this.advanceTableForm = this.createContactForm();
        this.AllotmentID=data.allotmentID;
        this.AllotmentStatus=data.allotmentStatus
        console.log(this.AllotmentID);
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
       this._generalService.sendUpdate('CancelAllotmentCreate:CancelAllotmentView:Success');//To Send Updates  
    
  },
    error =>
    {
       this._generalService.sendUpdate('CancelAllotmentAll:CancelAllotmentView:Failure');//To Send Updates  
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
      
      this._generalService.sendUpdate('CancelAllotmentUpdate:CancelAllotmentView:Success');//To Send Updates 
      this.showNotification(
        'snackbar-success',
        'CancelAllotment Updated...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true;
      this.dialogRef.close({isClose:false});
    },
    error =>
    {
     this._generalService.sendUpdate('CancelAllotmentAll:CancelAllotmentView:Failure');//To Send Updates  
     this.saveDisabled = true;
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
    this.saveDisabled = false;
    this.Put();
  }
   /////////////////for Image Upload////////////////////////////
   public response: { dbPath: '' };
   public ImagePath: string = "";
   public uploadFinished = (event) => 
   {
     this.response = event;
     this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
     this.advanceTableForm.patchValue({cancelAllotmentSign:this.ImagePath})
   }
 /////////////////for Image Upload ends////////////////////////////
 
}


