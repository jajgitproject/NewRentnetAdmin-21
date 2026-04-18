// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AcrisCodeService } from '../../acrisCode.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { AcrisCode } from '../../acrisCode.model';
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
  advanceTable: AcrisCode;
  saveDisabled:boolean=true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: AcrisCodeService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='ACRISS Code';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'ACRISS Code';
          this.advanceTable = new AcrisCode({});
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
      acrisCodeDetailsID: [this.advanceTable.acrisCodeDetailsID],
      acrisCodeType: [this.advanceTable.acrisCodeType],
      acrisCode: [this.advanceTable.acrisCode],
      acrisCodeValue: [this.advanceTable.acrisCodeValue],
      activationStatus: [this.advanceTable.activationStatus],
    });
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
  public Post(): void
  {
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {  
  
          this.dialogRef.close();
         this._generalService.sendUpdate('AcrisCodeCreate:AcrisCodeView:Success');//To Send Updates 
         this.saveDisabled = true; 
      
    },
    error =>
    {
       this._generalService.sendUpdate('AcrisCodeAll:AcrisCodeView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
      
          this.dialogRef.close();
         this._generalService.sendUpdate('AcrisCodeUpdate:AcrisCodeView:Success');//To Send Updates 
         this.saveDisabled = true; 
      
    },
    error =>
    {
     this._generalService.sendUpdate('AcrisCodeAll:AcrisCodeView:Failure');//To Send Updates
     this.saveDisabled = true;  
    }
  )
  }
  public confirmAdd(): void 
  {
    this.saveDisabled = false;
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


