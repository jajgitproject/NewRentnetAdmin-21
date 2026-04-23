// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ModeOfPaymentService } from '../../modeOfPayment.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { ModeOfPayment } from '../../modeOfPayment.model';
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
  advanceTable: ModeOfPayment;
  isLoading: boolean = false;  // Controls the spinner visibility
  saveDisabled: boolean = false;
  errorMessage: string = ''; 
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: ModeOfPaymentService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Mode Of Payment';       
          this.dialogTitle ='Mode Of Payment';
          this.advanceTable = data.advanceTable;
        } else 
        {
          //this.dialogTitle = 'Create Mode Of Payment';
          this.dialogTitle = 'Mode Of Payment';
          this.advanceTable = new ModeOfPayment({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      modeOfPaymentID: [this.advanceTable.modeOfPaymentID],
      modeOfPayment: [this.advanceTable.modeOfPayment,[this.noWhitespaceValidator]],
      oldRentNetPaymentMode: [this.advanceTable.oldRentNetPaymentMode],
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

  submit() {}
  
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
    this.isLoading = true; // Show spinner
    this.saveDisabled = true; // Disable Save button
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('ModeOfPaymentCreate:ModeOfPaymentView:Success');
          this.isLoading = false; // Hide spinner
          this.saveDisabled = false; // Enable Save button after API call
        },
        error => {
          this.errorMessage = 'An error occurred while adding the data.'; // Set error message
          this._generalService.sendUpdate('ModeOfPaymentAll:ModeOfPaymentView:Failure');
          this.isLoading = false; // Hide spinner
          this.saveDisabled = false; // Enable Save button after API call
        }
      );
  }

  // Put Method (for Update)
  public Put(): void {
    this.isLoading = true; // Show spinner
    this.saveDisabled = true; // Disable Save button
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('ModeOfPaymentUpdate:ModeOfPaymentView:Success');
          this.isLoading = false; // Hide spinner
          this.saveDisabled = false; // Enable Save button after API call
        },
        error => {
          this.errorMessage = 'An error occurred while updating the data.'; // Set error message
          this._generalService.sendUpdate('ModeOfPaymentAll:ModeOfPaymentView:Failure');
          this.isLoading = false; // Hide spinner
          this.saveDisabled = false; // Enable Save button after API call
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


