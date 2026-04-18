// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MessageTypeService } from '../../messageType.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MessageType } from '../../messageType.model';
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
  advanceTable: MessageType;
  isLoading: boolean = false;  // To control the spinner visibility
  saveDisabled: boolean = false;  // To disable the save button during API call
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: MessageTypeService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Message Type';       
          this.dialogTitle ='Message Type';
          this.advanceTable = data.advanceTable;
        } else 
        {
          //this.dialogTitle = 'Create Message Type';
          this.dialogTitle = 'Message Type';
          this.advanceTable = new MessageType({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      messageTypeID: [this.advanceTable.messageTypeID],
      messageType: [this.advanceTable.messageType,[this.noWhitespaceValidator]],
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

  submit() {}
  
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
  public Post(): void {
    this.isLoading = true; // Show spinner
    this.saveDisabled = true; // Disable the save button
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('MessageTypeCreate:MessageTypeView:Success');
          this.isLoading = false; // Hide spinner
          this.saveDisabled = false; // Enable button after API call
        },
        error => {
          this._generalService.sendUpdate('MessageTypeAll:MessageTypeView:Failure');
          this.isLoading = false; // Hide spinner
          this.saveDisabled = false; // Enable button after API call
        }
      );
  }

  // Put Method (for Update)
  public Put(): void {
    this.isLoading = true; // Show spinner
    this.saveDisabled = true; // Disable the save button
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('MessageTypeUpdate:MessageTypeView:Success');
          this.isLoading = false; // Hide spinner
          this.saveDisabled = false; // Enable button after API call
        },
        error => {
          this._generalService.sendUpdate('MessageTypeAll:MessageTypeView:Failure');
          this.isLoading = false; // Hide spinner
          this.saveDisabled = false; // Enable button after API call
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


