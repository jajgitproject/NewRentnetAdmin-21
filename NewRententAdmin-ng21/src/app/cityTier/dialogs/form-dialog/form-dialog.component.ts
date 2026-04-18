// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CityTierService } from '../../cityTier.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CityTier } from '../../cityTier.model';
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
  saveDisabled:boolean=true;
  advanceTable: CityTier;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CityTierService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='City Tier';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'City Tier';
          this.advanceTable = new CityTier({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      cityTierID: [this.advanceTable.cityTierID],
      cityTierName: [this.advanceTable.cityTierName,[this.noWhitespaceValidator]],
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

  submit() 
  {
   
  }
  reset(){
    this.advanceTableForm.reset();
  }
  onNoClick():void {
    
      this.dialogRef.close();
    
  }
  public Post(): void
  {
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
       
          this.dialogRef.close();
         this._generalService.sendUpdate('CityTierCreate:CityTierView:Success');//To Send Updates 
         this.saveDisabled = true; 
      
    },
    error =>
    {
       this._generalService.sendUpdate('CityTierAll:CityTierView:Failure');//To Send Updates 
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
         this._generalService.sendUpdate('CityTierUpdate:CityTierView:Success');//To Send Updates
         this.saveDisabled = true;  
      
    },
    error =>
    {
     this._generalService.sendUpdate('CityTierAll:CityTierView:Failure');//To Send Updates  
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


