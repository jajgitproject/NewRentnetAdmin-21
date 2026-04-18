// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AddPassengersService } from '../../addPassengers.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { AddPassengers } from '../../addPassengers.model';
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

export class FormDialogAddPassengersComponent 
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: AddPassengers;
  constructor(
  public dialogRef: MatDialogRef<FormDialogAddPassengersComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: AddPassengersService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
  
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Add Passenger';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Add Passenger';
          this.advanceTable = new AddPassengers({});
          this.advanceTable.discountOn="Base Fare/Full Bill";
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      addPassengersID: [this.advanceTable.addPassengersID],
      addPassengers: [this.advanceTable.addPassengers,[this.noWhitespaceValidator]],
      discountOn: [this.advanceTable.discountOn],
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
    console.log(this.advanceTableForm.value);
  }
  onNoClick(): void 
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    debugger;
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
       this._generalService.sendUpdate('AddPassengersCreate:AddPassengersView:Success');//To Send Updates 
       } 
      if(response.contains('Failure'))
      {
        
      }
    },
    error =>
    { 
      debugger
      this.showError = error;
      alert(error);
      this._generalService.sendUpdate('AddPassengersAll:AddPassengersView:Failure');//To Send Updates  
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
       this._generalService.sendUpdate('AddPassengersUpdate:AddPassengersView:Success');//To Send Updates  
       } 
    },
    error =>
    {
     this._generalService.sendUpdate('AddPassengersAll:AddPassengersView:Failure');//To Send Updates  
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


