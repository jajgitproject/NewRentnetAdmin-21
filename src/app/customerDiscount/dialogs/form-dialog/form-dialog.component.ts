// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerDiscountService } from '../../customerDiscount.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerDiscount } from '../../customerDiscount.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerDiscountDropDown } from '../../customerDiscountDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { atLeastOneRequired } from './atLeastOneRequired.component';
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
  advanceTable: CustomerDiscount;
  CustomerContractMappingID:number;
 
  public CustomerDiscountList?: CustomerDiscountDropDown[] = [];

  image: any;
  fileUploadEl: any;
  CustomerName: any;
  StartDate: any;
  EndDate: any;
  saveDisabled :boolean= true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerDiscountService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Customer Discount For';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Customer Discount For';
          this.advanceTable = new CustomerDiscount({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.CustomerContractMappingID=this.data.CustomerContractMappingID;
        this.CustomerName=this.data.CustomerName;
        this.StartDate=this.data.StartDate;
        this.EndDate=this.data.EndDate;
  }
  public ngOnInit(): void
  {

    
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);
  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerDiscountID: [this.advanceTable.customerDiscountID],
      customerContractMappingID: [this.advanceTable.customerContractMappingID],
      discountPercentage: [this.advanceTable.discountPercentage],
      isAllowedOnPackageRate: [this.advanceTable.isAllowedOnPackageRate || null],
      isAllowedOnExtras: [this.advanceTable.isAllowedOnExtras || null],
      discountPercentageStartDate: [this.advanceTable.discountPercentageStartDate],
      discountPercentageEndDate: [this.advanceTable.discountPercentageEndDate],
      activationStatus:[this.advanceTable.activationStatus]
    }, { validator: atLeastOneRequired });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

keyPressNumbersDecimal(event) {
  var charCode = (event.which) ? event.which : event.keyCode;
  if (charCode != 46 && charCode > 31
    && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  }
  return true;
}

  submit() 
  {
    // emppty stuff
  }
  reset(): void 
  {
    this.advanceTableForm.reset();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({customerContractMappingID:this.CustomerContractMappingID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerDiscountCreate:CustomerDiscountView:Success');//To Send Updates
       this.saveDisabled = true;  
    
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerDiscountAll:CustomerDiscountView:Failure');//To Send Updates
       this.saveDisabled = true;  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({customerContractMappingID:this.advanceTable.customerContractMappingID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerDiscountUpdate:CustomerDiscountView:Success');//To Send Updates 
       this.saveDisabled = true; 
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerDiscountAll:CustomerDiscountView:Failure');//To Send Updates 
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
  

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({image:this.ImagePath})
  }

}


