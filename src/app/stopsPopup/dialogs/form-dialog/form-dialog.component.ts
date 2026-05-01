// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { StopsPopupService } from '../../stopsPopup.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { StopsPopup } from '../../stopsPopup.model';
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

export class FormDialogStopsPopupComponent 
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: StopsPopup;
  constructor(
  public dialogRef: MatDialogRef<FormDialogStopsPopupComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: StopsPopupService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Stops Popup';       
          this.dialogTitle ='Stops Popup';
          this.advanceTable = data.advanceTable;
        } else 
        {
          //this.dialogTitle = 'Create Stops Popup';
          this.dialogTitle = 'Stops Popup';
          this.advanceTable = new StopsPopup({});
          this.advanceTable.activationStatus="Active";
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      stopsPopupID: [this.advanceTable.stopsPopupID],
      stopsPopup: [this.advanceTable.stopsPopup,[this.noWhitespaceValidator]],
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
       this._generalService.sendUpdate('StopsPopupCreate:StopsPopupView:Success');//To Send Updates 
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
      this._generalService.sendUpdate('StopsPopupAll:StopsPopupView:Failure');//To Send Updates  
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
       this._generalService.sendUpdate('StopsPopupUpdate:StopsPopupView:Success');//To Send Updates  
       } 
    },
    error =>
    {
     this._generalService.sendUpdate('StopsPopupAll:StopsPopupView:Failure');//To Send Updates  
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


