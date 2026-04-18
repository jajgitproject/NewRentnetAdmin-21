// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { SalutationService } from '../../salutation.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Salutation } from '../../salutation.model';
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
  advanceTable: Salutation;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SalutationService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Salutation';       
          this.dialogTitle ='Salutation';
          this.advanceTable = data.advanceTable;
        } else 
        {
          //this.dialogTitle = 'Create Salutation';
          this.dialogTitle = 'Salutation';
          this.advanceTable = new Salutation({});
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
      salutationID: [this.advanceTable.salutationID],
      salutation: [this.advanceTable.salutation,[this.noWhitespaceValidator]],
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
   this.advanceTableForm.reset();
  }
  public Post(): void
  {
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
        //debugger;
  
      
          this.dialogRef.close();
         this._generalService.sendUpdate('SalutationCreate:SalutationView:Success');//To Send Updates  
      
    },
    error =>
    {
       this._generalService.sendUpdate('SalutationAll:SalutationView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
        //debugger;
  
      
          this.dialogRef.close();
         this._generalService.sendUpdate('SalutationCreate:SalutationView:Success');//To Send Updates  
      
    },
    error =>
    {
     this._generalService.sendUpdate('SalutationAll:SalutationView:Failure');//To Send Updates  
    }
  )
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


