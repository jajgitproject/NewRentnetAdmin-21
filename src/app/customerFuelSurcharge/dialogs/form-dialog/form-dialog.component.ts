// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerFuelSurchargeService } from '../../customerFuelSurcharge.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerFuelSurcharge } from '../../customerFuelSurcharge.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerFuelSurchargeDropDown } from '../../customerFuelSurchargeDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
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
  advanceTable: CustomerFuelSurcharge;
  CustomerContractMappingID:number;
 
  public CustomerFuelSurchargeList?: CustomerFuelSurchargeDropDown[] = [];

  image: any;
  fileUploadEl: any;
  CustomerName: any;
  StartDate: any;
  EndDate: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerFuelSurchargeService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Fuel Surcharge For';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Fuel Surcharge For';
          this.advanceTable = new CustomerFuelSurcharge({});
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
      customerFuelSurchargeID: [this.advanceTable.customerFuelSurchargeID],
      customerContractMappingID: [this.advanceTable.customerContractMappingID],
      fuelSurchargePercentageOnPackage: [this.advanceTable.fuelSurchargePercentageOnPackage],
      fuelSurchargePercentageOnExtraKM: [this.advanceTable.fuelSurchargePercentageOnExtraKM],
      fuelSurchargePercentageOnExtraHour: [this.advanceTable.fuelSurchargePercentageOnExtraHour],
      fuelSurchargePercentageStartDate: [this.advanceTable.fuelSurchargePercentageStartDate],
      fuelSurchargePercentageEndDate: [this.advanceTable.fuelSurchargePercentageEndDate],
      activationStatus: [this.advanceTable.activationStatus]
    });
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
       this._generalService.sendUpdate('CustomerFuelSurchargeCreate:CustomerFuelSurchargeView:Success');//To Send Updates  
    
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerFuelSurchargeAll:CustomerFuelSurchargeView:Failure');//To Send Updates  
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
       this._generalService.sendUpdate('CustomerFuelSurchargeUpdate:CustomerFuelSurchargeView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerFuelSurchargeAll:CustomerFuelSurchargeView:Failure');//To Send Updates  
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


