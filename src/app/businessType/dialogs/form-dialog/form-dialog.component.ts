// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { BusinessTypeService } from '../../businessType.service';
import { BusinessTypeModel } from '../../businessType.model';

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
  advanceTable: BusinessTypeModel;
  saveDisabled:boolean=true;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: BusinessTypeService,
  private fb: FormBuilder,
  public _generalService:GeneralService)
  {
    this.action = data.action;
    if (this.action === 'edit') 
    {
      this.dialogTitle ='Business Type';       
      this.advanceTable = data.advanceTable;
    } 
    else 
    {
      this.dialogTitle = 'Business Type';
      this.advanceTable = new BusinessTypeModel({});
      this.advanceTable.activationStatus=true;
    }
    this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      businessTypeID: [this.advanceTable.businessTypeID],
      businessTypeName: [this.advanceTable.businessTypeName],
      activationStatus: [this.advanceTable.activationStatus],
    });
  }

  submit(){}

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

  public Post(): void
  {   
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('BusinessTypeCreate:BusinessTypeView:Success');//To Send Updates 
      this.saveDisabled = true; 
    },
    error =>
    {
      this._generalService.sendUpdate('BusinessTypeAll:BusinessTypeView:Failure');//To Send Updates 
      this.saveDisabled = true; 
    })
  }

  public Put(): void
  {   
    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('BusinessTypeUpdate:BusinessTypeView:Success');//To Send Updates  
      this.saveDisabled = true;   
    },
    error =>
    {
      this._generalService.sendUpdate('BusinessTypeAll:BusinessTypeView:Failure');//To Send Updates 
      this.saveDisabled = true; 
    })
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


