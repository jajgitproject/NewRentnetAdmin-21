// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerQCModel } from '../../customerQC.model';
import { CustomerQCService } from '../../customerQC.service';

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
  advanceTable: CustomerQCModel;
  isLoading: boolean = false;
  CustomerID: any;
  CustomerName: any;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerQCService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
    this.CustomerID = data.CustomerID,
    this.CustomerName = data.CustomerName
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') 
    {
      this.dialogTitle ='Customer QC';       
      this.advanceTable = data.advanceTable;
    } 
    else 
    {
      this.dialogTitle = 'Customer QC';
      this.advanceTable = new CustomerQCModel({});
      this.advanceTable.activationStatus=true;
    }
    this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerQCID: [this.advanceTable.customerQCID],
      customerID: [this.CustomerID],
      startDate: [this.advanceTable.startDate],
      endDate: [this.advanceTable.endDate],
      isQCRequiredBeforeDispatch: [this.advanceTable.isQCRequiredBeforeDispatch],
      activationStatus: [this.advanceTable.activationStatus]
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
    if(this.action==='add'){
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
  }

  public Post(): void {
    this.isLoading = true; // Start loading before making the API call
  
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      response => {
        this.isLoading = false; // Stop loading on success
        this.dialogRef.close();
        this._generalService.sendUpdate('CustomerQCCreate:CustomerQCView:Success'); // Notify success
      },
      error => {
        this.isLoading = false; // Stop loading on error
        this._generalService.sendUpdate('CustomerQCAll:CustomerQCView:Failure'); // Notify failure
      }
    );
  }
  
  public Put(): void {
    this.isLoading = true; // Start loading before making the API call
  
    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
      response => {
        this.isLoading = false; // Stop loading on success
        this.dialogRef.close();
        this._generalService.sendUpdate('CustomerQCUpdate:CustomerQCView:Success'); // Notify success
      },
      error => {
        this.isLoading = false; // Stop loading on error
        this._generalService.sendUpdate('CustomerQCAll:CustomerQCView:Failure'); // Notify failure
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


