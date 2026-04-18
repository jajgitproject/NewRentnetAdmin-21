// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { LocationGroupService } from '../../locationGroup.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { LocationGroup } from '../../locationGroup.model';
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
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: LocationGroup;
  public saveDisabled = false; 
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: LocationGroupService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Location Group';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Location Group';
          this.advanceTable = new LocationGroup({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      locationGroupID: [this.advanceTable.locationGroupID],
      locationGroup: [this.advanceTable.locationGroup,[this.noWhitespaceValidator]],
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
 
  public Post(): void {
      this.saveDisabled = true; // Disable button, show spinner
      this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
          response => {
              this.dialogRef.close();
              this.saveDisabled = false; // Enable button after success
              this._generalService.sendUpdate('LocationGroupCreate:LocationGroupView:Success');
          },
          error => {
              this.saveDisabled = false; // Enable button after error
              this._generalService.sendUpdate('LocationGroupAll:LocationGroupView:Failure');
          }
      );
  }
  
  public Put(): void {
      this.saveDisabled = true; // Disable button, show spinner
      this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
          response => {
              this.dialogRef.close();
              this.saveDisabled = false; // Enable button after success
              this._generalService.sendUpdate('LocationGroupUpdate:LocationGroupView:Success');
          },
          error => {
              this.saveDisabled = false; // Enable button after error
              this._generalService.sendUpdate('LocationGroupAll:LocationGroupView:Failure');
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


