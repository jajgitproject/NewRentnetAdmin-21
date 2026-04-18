// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerCreditChargesModel } from '../../customerCreditCharges.model';
import { CustomerCreditChargesService } from '../../customerCreditCharges.service';
import moment from 'moment';

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
  advanceTable: CustomerCreditChargesModel;
  CustomerID: any;
  CustomerName: any;
  saveDisabled:boolean = true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerCreditChargesService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
    this.CustomerID= data.CustomerID,
    this.CustomerName =data.CustomerName,
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Customer Credit Charges';       
          this.advanceTable = data.advanceTable;
          let startDate=moment(this.advanceTable.customerCreditCardChargesStartDate).format('DD/MM/yyyy');
          let endDate=moment(this.advanceTable.customerCreditCardChargesEndDate).format('DD/MM/yyyy');
          this.onBlurStartDateEdit(startDate);
          this.onBlurEndDateEdit(endDate);
        } else 
        {
          this.dialogTitle = 'Customer Credit Charges';
          this.advanceTable = new CustomerCreditChargesModel({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerCreditCardChargesID: [this.advanceTable.customerCreditCardChargesID],
      customerCreditCardChargesPercentage: [this.advanceTable.customerCreditCardChargesPercentage],
      igstPercentage:[this.advanceTable.igstPercentage],
      cgstPercentage:[this.advanceTable.cgstPercentage],
      sgstPercentage:[this.advanceTable.sgstPercentage],
      cessPercentage:[this.advanceTable.cessPercentage],
      customerCreditCardChargesStartDate:[this.advanceTable.customerCreditCardChargesStartDate,[Validators.required, this._generalService.dateValidator()]],
      customerCreditCardChargesEndDate:[this.advanceTable.customerCreditCardChargesEndDate,[Validators.required, this._generalService.dateValidator()]],
      customerID:[this.CustomerID],
      activationStatus: [this.advanceTable.activationStatus],
    });
  }

  //start date
  onBlurStartDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('customerCreditCardChargesStartDate')?.setValue(formattedDate);    
    }
    else
    {
      this.advanceTableForm.get('customerCreditCardChargesStartDate')?.setErrors({ invalidDate: true });
    }
  }
               
  onBlurStartDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.customerCreditCardChargesStartDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('customerCreditCardChargesStartDate')?.setValue(formattedDate);
      }  
    } 
    else 
    {
      this.advanceTableForm.get('customerCreditCardChargesStartDate')?.setErrors({ invalidDate: true });
    }
  }
               
  //end date
  onBlurEndDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('customerCreditCardChargesEndDate')?.setValue(formattedDate);    
    }
    else 
    {
      this.advanceTableForm.get('customerCreditCardChargesEndDate')?.setErrors({ invalidDate: true });
    }
  }
              
  onBlurEndDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.customerCreditCardChargesEndDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('customerCreditCardChargesEndDate')?.setValue(formattedDate);
      }    
    } else {
        this.advanceTableForm.get('customerCreditCardChargesEndDate')?.setErrors({ invalidDate: true });
      }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() {}

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
      this._generalService.sendUpdate('CustomerCreditChargesCreate:CustomerCreditChargesView:Success');//To Send Updates 
      this.saveDisabled = true; 
    },
    error =>
    {
      this._generalService.sendUpdate('CustomerCreditChargesAll:CustomerCreditChargesView:Failure');//To Send Updates 
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
      this._generalService.sendUpdate('CustomerCreditChargesUpdate:CustomerCreditChargesView:Success');//To Send Updates  
      this.saveDisabled = true;
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerCreditChargesAll:CustomerCreditChargesView:Failure');//To Send Updates  
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



