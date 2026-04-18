// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { SupplierTypeService } from '../../supplierType.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { SupplierTypeModel } from '../../supplierType.model';
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
  advanceTable: SupplierTypeModel;
  isLoading: boolean = false;  // For tracking if a request is in progress
  errorMessage: string = ''; 
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SupplierTypeService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Supplier Type';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Supplier Type';
          this.advanceTable = new SupplierTypeModel({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      supplierTypeID: [this.advanceTable.supplierTypeID],
      supplierType: [this.advanceTable.supplierType],
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
    //console.log(this.advanceTableForm.value);
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
    if (this.advanceTableForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;  // Prevent submission if form is invalid
    }

    this.isLoading = true; // Set loading state
    this.errorMessage = ''; // Reset previous error

    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierTypeCreate:SupplierTypeView:Success');
          this.isLoading = false;  // Stop loading spinner
        },
        error => {
          this.errorMessage = 'Failed to save Supplier Type. Please try again later.';  // Show user-friendly error
          this._generalService.sendUpdate('SupplierTypeAll:SupplierTypeView:Failure');
          this.isLoading = false;  // Stop loading spinner
        }
      );
  }

  // Put method for updating an existing Supplier Type
  public Put(): void {
    if (this.advanceTableForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;  // Prevent submission if form is invalid
    }

    this.isLoading = true; // Set loading state
    this.errorMessage = ''; // Reset previous error

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierTypeUpdate:SupplierTypeView:Success');
          this.isLoading = false;  // Stop loading spinner
        },
        error => {
          this.errorMessage = 'Failed to update Supplier Type. Please try again later.';  // Show user-friendly error
          this._generalService.sendUpdate('SupplierTypeAll:SupplierTypeView:Failure');
          this.isLoading = false;  // Stop loading spinner
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


