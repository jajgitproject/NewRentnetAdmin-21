// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CancelInvoice } from '../../cancelInvoice.model';
import { CancelInvoiceService } from '../../cancelInvoice.service';


@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogCIComponent 
{
  saveDisabled:boolean=true;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CancelInvoice;
  invoiceID: any;
  invoiceNumberWithPrefix: any;
  ReservationID: any;
  constructor(
    private snackBar: MatSnackBar,
  public dialogRef: MatDialogRef<FormDialogCIComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CancelInvoiceService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Cancel Invoice';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Cancel Invoice';
          this.advanceTable = new CancelInvoice({});
        }
        this.advanceTableForm = this.createContactForm();
        this.invoiceID=data.invoiceID;
        this.invoiceNumberWithPrefix=data.invoiceNumberWithPrefix;
        this.ReservationID=data.reservationID;
         console.log('data:', data);
        // console.log('ReservationID:', this.ReservationID);
  }
  formControl = new FormControl('', 
  [
    Validators.required
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
      invoiceID: [this.advanceTable.invoiceID],
      invoiceNumberWithPrefix: [this.advanceTable.invoiceNumberWithPrefix],
      cancelationByID: [this.advanceTable.cancelationByID],
      invoiceCancelationReason: [this.advanceTable.invoiceCancelationReason],
      invoiceCancelationRemark: [this.advanceTable.invoiceCancelationRemark],
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
       this._generalService.sendUpdate('ReservationAllotmentCreate:ReservationAllotmentView:Success');//To Send Updates  
    
  },
    error =>
    {
       this._generalService.sendUpdate('ReservationAllotmentAll:ReservationAllotmentView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({invoiceID: this.invoiceID});
    this.advanceTableForm.patchValue({invoiceNumberWithPrefix: this.invoiceNumberWithPrefix});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      
      this._generalService.sendUpdate('CancelReservationAndAllotmentUpdate:CancelReservationAndAllotmentView:Success');//To Send Updates 
      this.showNotification(
        'snackbar-success',
        'Cancel Invoice...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true;
      this.dialogRef.close(true);
    },
    error =>
    {
     this._generalService.sendUpdate('CancelReservationAndAllotmentAll:CancelReservationAndAllotmentView:Failure');//To Send Updates  
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
     this.advanceTableForm.patchValue({reservationAllotmentSign:this.ImagePath})
   }
 /////////////////for Image Upload ends////////////////////////////
 
}


