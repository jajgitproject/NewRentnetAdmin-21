// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { PaymentCycleService } from '../../paymentCycle.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { PaymentCycle } from '../../paymentCycle.model';
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
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: PaymentCycle;
  isLoading: boolean = false;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: PaymentCycleService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Payment Cycle';
          this.dialogTitle ='Payment Cycle';
          this.advanceTable = data.advanceTable;
        } else 
        {
          //this.dialogTitle = 'Create Payment Cycle';
          this.dialogTitle = 'Payment Cycle';
          this.advanceTable = new PaymentCycle({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      paymentCycleID: [this.advanceTable.paymentCycleID],
      numberOfDays: [this.advanceTable.numberOfDays],
      paymentCycle: [this.advanceTable.paymentCycle,[this.noWhitespaceValidator]],
      activationStatus: [this.advanceTable.activationStatus],
      updatedBy: [this.advanceTable.updatedBy],
      updateDateTime: [this.advanceTable.updateDateTime]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
    //console.log(this.advanceTableForm.value);
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
          this._generalService.sendUpdate('PaymentCycleCreate:PaymentCycleView:Success');
        },
        error => {
          this.isLoading = false; // Set loading state to false in case of error
          this._generalService.sendUpdate('PaymentCycleAll:PaymentCycleView:Failure');
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
          this._generalService.sendUpdate('PaymentCycleUpdate:PaymentCycleView:Success');
        },
        error => {
          this.isLoading = false; // Set loading state to false in case of error
          this._generalService.sendUpdate('PaymentCycleAll:PaymentCycleView:Failure');
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


