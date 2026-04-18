// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UomService } from '../../uom.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Uom } from '../../uom.model';
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
  advanceTable: Uom;
  isLoading: boolean = false;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: UomService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit UOM';       
          this.dialogTitle ='UOM';
          this.advanceTable = data.advanceTable;
        } else 
        {
          //this.dialogTitle = 'Create UOM';
          this.dialogTitle = 'UOM';
          this.advanceTable = new Uom({});
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
      uomid: [this.advanceTable.uomid],
      uom: [this.advanceTable.uom,[this.noWhitespaceValidator]],
      uomCode: [this.advanceTable.uomCode,[this.noWhitespaceValidator]],
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
    // emppty stuff
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
    this.isLoading = true;  // Show loading state
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('UomCreate:UomView:Success');
          this.isLoading = false;  // Hide loading state
        },
        error => {
          this._generalService.sendUpdate('UomAll:UomView:Failure');
          this.isLoading = false;  // Hide loading state
        }
      );
  }

  // Method for updating an existing UOM (PUT)
  public Put(): void {
    this.isLoading = true;  // Show loading state
  
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('UomUpdate:UomView:Success');
          this.isLoading = false;  // Hide loading state
        },
        error => {
          
          this._generalService.sendUpdate('UomAll:UomView:Failure');
          this.isLoading = false;  // Hide loading state
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


