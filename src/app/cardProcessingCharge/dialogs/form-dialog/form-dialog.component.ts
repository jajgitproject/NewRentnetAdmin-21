// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CardProcessingChargeService } from '../../cardProcessingCharge.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CardProcessingCharge } from '../../cardProcessingCharge.model';
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
  advanceTable: CardProcessingCharge;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CardProcessingChargeService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Card Processing Charge';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Card Processing Charge';
          this.advanceTable = new CardProcessingCharge({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      cardProcessingChargeID: [this.advanceTable.cardProcessingChargeID],
      cardProcessingCharge: [this.advanceTable.cardProcessingCharge,[this.noWhitespaceValidator]],
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
  public Post(): void
  {
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
       
          this.dialogRef.close();
         this._generalService.sendUpdate('CardProcessingChargeCreate:CardProcessingChargeView:Success');//To Send Updates  
      
    },
    error =>
    {
       this._generalService.sendUpdate('CardProcessingChargeAll:CardProcessingChargeView:Failure');//To Send Updates  
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
         this._generalService.sendUpdate('CardProcessingChargeUpdate:CardProcessingChargeView:Success');//To Send Updates  
      
    },
    error =>
    {
     this._generalService.sendUpdate('CardProcessingChargeAll:CardProcessingChargeView:Failure');//To Send Updates  
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


