// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { SettledRatesService } from '../../settledRates.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { SettledRates } from '../../settledRates.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';

@Component({
  standalone: false,
  selector: 'app-settled-rates-dialog',
  templateUrl: './settled-rates-dialog.component.html',
  styleUrls: ['./settled-rates-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class SettledRatesDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: SettledRates;
  constructor(
  public dialogRef: MatDialogRef<SettledRatesDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SettledRatesService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Settled Rates';       
          this.dialogTitle ='Settled Rates';
          this.advanceTable = data.advanceTable;
        } else 
        {
          //this.dialogTitle = 'Create Settled Rates';
          this.dialogTitle = 'Settled Rates';
          this.advanceTable = new SettledRates({});
          this.advanceTable.activationStatus="Active";
        }
        this.advanceTableForm = this.createContactForm();
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      settledRatesID: [this.advanceTable.settledRatesID],
      settledRates: [this.advanceTable.settledRates,[this.noWhitespaceValidator]],
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
    // emppty stuff
  }
  onNoClick(): void 
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    { 
     
       if(response.activationStatus.indexOf("Duplicate") !== -1)
       {
        this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
       }
       else 
       {
        this.dialogRef.close();
       this._generalService.sendUpdate('SettledRatesCreate:SettledRatesView:Success');//To Send Updates  
    }
  },
    error =>
    {
       this._generalService.sendUpdate('SettledRatesAll:SettledRatesView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
       if(response.activationStatus.indexOf("Duplicate") !== -1)
       {
        this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
       }
       else 
       {
        this.dialogRef.close();
       this._generalService.sendUpdate('SettledRatesUpdate:SettledRatesView:Success');//To Send Updates   
       }
    },
    error =>
    {
     this._generalService.sendUpdate('SettledRatesAll:SettledRatesView:Failure');//To Send Updates  
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


