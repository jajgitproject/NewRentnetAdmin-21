// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerInvoiceTemplate } from '../../CustomerInvoiceTemplate.model';
import { CustomerInvoiceTemplateService } from '../../CustomerInvoiceTemplate.service';
import { InvoiceTemplateDropDown } from 'src/app/invoiceTemplate/invoiceTemplateDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  advanceTable: CustomerInvoiceTemplate;
  formattedAddress = '';
  geoStringAddress: any;
  filteredInvoiceTemplateOptions:Observable<InvoiceTemplateDropDown[]>;
  public InvoiceTemplateList?:InvoiceTemplateDropDown[]=[];
  invoiceTemplateID: any;
  CustomerID: any;
  CustomerName: any;
  saveDisabled:boolean=true;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerInvoiceTemplateService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
    this.CustomerID= data.CustomerID,
    this.CustomerName =data.CustomerName,
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Customer Invoice Template';       
          this.advanceTable = data.advanceTable;
          let startDate=moment(this.advanceTable.startDate).format('DD/MM/yyyy');
          let endDate=moment(this.advanceTable.endDate).format('DD/MM/yyyy');
          this.onBlurStartDateEdit(startDate);
          this.onBlurEndDateEdit(endDate);
        } else 
        {
          this.dialogTitle = 'Customer Invoice Template';
          this.advanceTable = new CustomerInvoiceTemplate({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.CustomerID= data.CustomerID;

  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerInvoiceTemplateID: [this.advanceTable.customerInvoiceTemplateID],
      invoiceTemplateID: [this.advanceTable.invoiceTemplateID],
      invoiceTemplateName: [this.advanceTable.invoiceTemplateName],
      customerID: [this.advanceTable.customerID],
      startDate: [this.advanceTable.startDate,[Validators.required, this._generalService.dateValidator()]],
      endDate: [this.advanceTable.endDate,[Validators.required, this._generalService.dateValidator()]],
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
      this.advanceTableForm.get('startDate')?.setValue(formattedDate);    
    }
    else
    {
      this.advanceTableForm.get('startDate')?.setErrors({ invalidDate: true });
    }
  }
               
  onBlurStartDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.startDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('startDate')?.setValue(formattedDate);
      }  
    } 
    else 
    {
      this.advanceTableForm.get('startDate')?.setErrors({ invalidDate: true });
    }
  }
               
  //end date
  onBlurEndDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('endDate')?.setValue(formattedDate);    
    }
    else 
    {
      this.advanceTableForm.get('endDate')?.setErrors({ invalidDate: true });
    }
  }
              
  onBlurEndDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.endDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('endDate')?.setValue(formattedDate);
      }    
    } else {
        this.advanceTableForm.get('endDate')?.setErrors({ invalidDate: true });
      }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

ngOnInit(): void {
  this.InitInvoice();
}


//----------- Validator ---------
invoiceTemplateNameValidator(InvoiceTemplateList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = InvoiceTemplateList.some(group => group.invoiceTemplateName.toLowerCase() === value);
    return match ? null : { invoiceTemplateNameInvalid: true };
  };
}

InitInvoice(){
  this._generalService.getInvoice().subscribe(
    data=>
    {
      this.InvoiceTemplateList=data;
      this.advanceTableForm.controls['invoiceTemplateName'].setValidators([Validators.required,
        this.invoiceTemplateNameValidator(this.InvoiceTemplateList)
      ]);
      this.advanceTableForm.controls['invoiceTemplateName'].updateValueAndValidity();
      this.filteredInvoiceTemplateOptions = this.advanceTableForm.controls['invoiceTemplateName'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterCT(value || ''))
      ) 
    });;
}

private _filterCT(value: string): any {
  const filterValue = value.toLowerCase();
  if (!value || value.length < 3) {
      return [];   
    }
  return this.InvoiceTemplateList.filter(
    customer => 
    {
      return customer.invoiceTemplateName.toLowerCase().includes(filterValue);
    });
}
OnInvoiceTemplateSelect(selectedInvoiceTemplate: string)
{
  const InvoiceTemplateName = this.InvoiceTemplateList.find(
    data => data.invoiceTemplateName === selectedInvoiceTemplate
  );
  if (selectedInvoiceTemplate) 
  {
    this.getInvoiceTemplateID(InvoiceTemplateName.invoiceTemplateID);
  }
}
getInvoiceTemplateID(invoiceTemplateID:any)
{
  this.invoiceTemplateID=invoiceTemplateID;
  this.advanceTableForm.patchValue({invoiceTemplateID:this.invoiceTemplateID});
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
    this.advanceTableForm.patchValue({customerID:this.data.CustomerID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
        this.dialogRef.close();
       this._generalService.sendUpdate('InvoiceTemplateCreate:InvoiceTemplateView:Success');//To Send Updates  
       this.saveDisabled = true;
    
  },
    error =>
    {
       this._generalService.sendUpdate('InvoiceTemplateAll:InvoiceTemplateView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({customerID:this.data.CustomerID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        this.dialogRef.close();
       this._generalService.sendUpdate('InvoiceTemplateUpdate:InvoiceTemplateView:Success');//To Send Updates 
       this.saveDisabled = true; 
       
    },
    error =>
    {
     this._generalService.sendUpdate('InvoiceTemplateAll:InvoiceTemplateView:Failure');//To Send Updates
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



