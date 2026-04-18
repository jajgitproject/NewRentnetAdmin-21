// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { PaymentNetworkService } from '../../paymentNetwork.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { PaymentNetwork } from '../../paymentNetwork.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: PaymentNetwork;
  isLoading: boolean = false;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: PaymentNetworkService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Payment Network';       
          this.dialogTitle ='Payment Network';
          this.advanceTable = data.advanceTable;
        } else 
        {
          //this.dialogTitle = 'Create Payment Network';
          this.dialogTitle = 'Payment Network';
          this.advanceTable = new PaymentNetwork({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
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
      paymentNetworkID: [this.advanceTable.paymentNetworkID],
      paymentNetwork: [this.advanceTable.paymentNetwork,[this.noWhitespaceValidator]],
      activationStatus: [this.advanceTable.activationStatus]
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
  onNoClick(): void 
  {
    if(this.action==='add')
    {
      this.advanceTableForm.reset();
    }
    else if(this.action==='edit')
    {
      this.dialogRef.close();
    }
  }
  public Post(): void {
    this.isLoading = true; // Set loading state to true before making the API call

    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false; // Set loading state to false when the request is successful
          this.dialogRef.close();
          this._generalService.sendUpdate('PaymentNetworkCreate:PaymentNetworkView:Success');
        },
        error => {
          this.isLoading = false; // Set loading state to false in case of error
          this._generalService.sendUpdate('PaymentNetworkAll:PaymentNetworkView:Failure');
        }
      );
  }

  public Put(): void {
    this.isLoading = true; // Set loading state to true before making the API call

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false; // Set loading state to false when the request is successful
          this.dialogRef.close();
          this._generalService.sendUpdate('PaymentNetworkUpdate:PaymentNetworkView:Success');
        },
        error => {
          this.isLoading = false; // Set loading state to false in case of error
          this._generalService.sendUpdate('PaymentNetworkAll:PaymentNetworkView:Failure');
        }
      );
  }
  public confirmAdd(): void 
  {
       if(this.action=="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }
}


