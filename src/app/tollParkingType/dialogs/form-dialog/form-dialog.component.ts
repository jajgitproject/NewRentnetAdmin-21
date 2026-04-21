// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { TollParkingType } from '../../tollParkingType.model';
import { TollParkingTypeService } from '../../tollParkingType.service';

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
  advanceTable: TollParkingType;
  isLoading: boolean = false;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: TollParkingTypeService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Toll Parking Type';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Toll Parking Type';
          this.advanceTable = new TollParkingType({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      tollParkingTypeID: [this.advanceTable.tollParkingTypeID],
      tollParkingType: [this.advanceTable.tollParkingType],
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
  public Post(): void
  {
    this.isLoading = true;
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
        this.dialogRef.close();
       this._generalService.sendUpdate('TollParkingTypeCreate:TollParkingTypeView:Success');//To Send Updates  
       this.isLoading = false;
  },
    error =>
    {
       this._generalService.sendUpdate('TollParkingTypeAll:TollParkingTypeView:Failure');//To Send Updates  
       this.isLoading = false;
    }
  )
  }
  public Put(): void
  {
    this.isLoading = true;
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        this.dialogRef.close();
       this._generalService.sendUpdate('TollParkingTypeUpdate:TollParkingTypeView:Success');//To Send Updates  
       this.isLoading = false;
       
    },
    error =>
    {
     this._generalService.sendUpdate('TollParkingTypeAll:TollParkingTypeView:Failure');//To Send Updates  
     this.isLoading = false;
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


