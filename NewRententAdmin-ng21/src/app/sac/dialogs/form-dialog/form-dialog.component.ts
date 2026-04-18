// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { SACModel } from '../../sac.model';
import { SACService } from '../../sac.service';

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
  advanceTable: SACModel;
  isLoading: boolean = false;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SACService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='SAC';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'SAC';
          this.advanceTable = new SACModel({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      sacid: [this.advanceTable.sacid],
      sacNumber: [this.advanceTable.sacNumber],
      activationStatus: [this.advanceTable.activationStatus],
      isDefault: [this.advanceTable.isDefault],
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
        this._generalService.sendUpdate('SACCreate:SACView:Success'); // Notify success
      },
      error => {
        this.isLoading = false; // Stop loading on error
        this._generalService.sendUpdate('SACAll:SACView:Failure'); // Notify failure
      }
    );
  }
  
  public Put(): void {
    this.isLoading = true; // Start loading before making the API call
  
    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
      response => {
        this.isLoading = false; // Stop loading on success
        this.dialogRef.close();
        this._generalService.sendUpdate('SACUpdate:SACView:Success'); // Notify success
      },
      error => {
        this.isLoading = false; // Stop loading on error
        this._generalService.sendUpdate('SACAll:SACView:Failure'); // Notify failure
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


