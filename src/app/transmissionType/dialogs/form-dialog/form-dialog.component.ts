// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { TransmissionTypeService } from '../../transmissionType.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { TransmissionType } from '../../transmissionType.model';
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
  advanceTable: TransmissionType;
  isLoading: boolean = false;  // To track loading state
  errorMessage: string = '';
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: TransmissionTypeService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Transmission Type';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Transmission Type';
          this.advanceTable = new TransmissionType({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      transmissionTypeID: [this.advanceTable.transmissionTypeID],
      transmissionType: [this.advanceTable.transmissionType],
      activationStatus: [this.advanceTable.activationStatus],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
  }
  onNoClick(): void 
  {
    if(this.action==='add'){
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
  }
  public Post(): void {

    this.isLoading = true; // Set loading state to true
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('TransmissionTypeCreate:TransmissionTypeView:Success');
          this.isLoading = false; // Set loading state to false
        },
        error => {
          this.errorMessage = 'Failed to save Transmission Type. Please try again later.';
          this._generalService.sendUpdate('TransmissionTypeAll:TransmissionTypeView:Failure');
          this.isLoading = false; // Set loading state to false
        }
      );
  }

  // Method for updating an existing Transmission Type (PUT)
  public Put(): void {

    this.isLoading = true; // Set loading state to true

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('TransmissionTypeUpdate:TransmissionTypeView:Success');
          this.isLoading = false; // Set loading state to false
        },
        error => {
          this.errorMessage = 'Failed to update Transmission Type. Please try again later.';
          this._generalService.sendUpdate('TransmissionTypeAll:TransmissionTypeView:Failure');
          this.isLoading = false; // Set loading state to false
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


