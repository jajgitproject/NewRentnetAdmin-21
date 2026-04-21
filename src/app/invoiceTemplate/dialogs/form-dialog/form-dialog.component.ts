// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { InvoiceTemplateService } from '../../invoiceTemplate.service';
import { InvoiceTemplate } from '../../invoiceTemplate.model';

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
  saveDisabled:boolean = true;
  advanceTableForm: FormGroup;
  advanceTable: InvoiceTemplate;
  formattedAddress = '';
  options = {
    componentRestrictions: {
      country: ['IN']
    }
  }
  geoStringAddress: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: InvoiceTemplateService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Invoice Template';       
          this.advanceTable = data.advanceTable;
          // this.ImagePath1=this.advanceTable.address;
         
          
        } else 
        {
          this.dialogTitle = 'Invoice Template';
          this.advanceTable = new InvoiceTemplate({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      invoiceTemplateID: [this.advanceTable.invoiceTemplateID],
      invoiceTemplateName: [this.advanceTable.invoiceTemplateName],
      templateType: [this.advanceTable.templateType],
      address: [this.advanceTable.address],
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
  
  public Post(): void {
      this.saveDisabled = false; // Show spinner, disable button
      this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
          response => {
              this.saveDisabled = true; // Re-enable button
              this.dialogRef.close();
              this._generalService.sendUpdate('InvoiceTemplateCreate:InvoiceTemplateView:Success');
          },
          error => {
              this.saveDisabled = true; // Ensure button is re-enabled even on failure
              this._generalService.sendUpdate('InvoiceTemplateAll:InvoiceTemplateView:Failure');
          }
      );
  }
  
  public Put(): void {
      this.saveDisabled = false; // Show spinner, disable button
      this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
          response => {
              this.saveDisabled = true; // Re-enable button
              this.dialogRef.close();
              this._generalService.sendUpdate('InvoiceTemplateUpdate:InvoiceTemplateView:Success');
          },
          error => {
              this.saveDisabled = true; // Ensure button is re-enabled even on failure
              this._generalService.sendUpdate('InvoiceTemplateAll:InvoiceTemplateView:Failure');
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
///////////////-------------Image 

public response: { dbPath: '' };
  public ImagePath1: string = "";

  public FlagIcon = (event) => 
    {
      this.response = event;
      this.ImagePath1 = this._generalService.getImageURL() + this.response.dbPath;
      this.advanceTableForm.patchValue({address:this.ImagePath1})
    }
}


