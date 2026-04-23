// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { VendorContractCityTiersService } from '../../vendorContractCityTiers.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { VendorContractCityTiersModel } from '../../vendorContractCityTiers.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { SupplierRateCardDropDown } from 'src/app/supplierRateCard/supplierRateCardDropDown.model';
import { VendorContractCarCategoryService } from 'src/app/vendorContractCarCategory/vendorContractCarCategory.service';
import { VendorCategoryDropDownModel } from 'src/app/vendorContractCarCategory/vendorContractCarCategory.model';
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
  advanceTable: any;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
  public vendorCategoryList?: VendorCategoryDropDownModel[] = [];

  image: any;
  fileUploadEl: any;
  VendorContractID!: number;
  VendorContractName!: string;
  saveDisabled:boolean = true;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>,  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: VendorContractCityTiersService,
  private fb: FormBuilder,
  private el: ElementRef,
  public _generalService:GeneralService,
  public vendorContractCarCategoryService: VendorContractCarCategoryService
  )
  {
    this.VendorContractID= data.vendorContractID,
    this.VendorContractName =data.vendorContractName,
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') 
    {
      this.dialogTitle ='City Tier for Vendor Contract';       
      this.advanceTable = data.advanceTable;
    } 
    else 
    {
      this.dialogTitle = 'City Tier for Vendor Contract';
      this.advanceTable = new VendorContractCityTiersModel({});
      this.advanceTable.activationStatus=true;
    }
    this.advanceTableForm = this.createContactForm();
  }
  
  public ngOnInit(): void
  {
    this.InitVendorCategory();
    
  }


  InitVendorCategory()
  {
    this.vendorContractCarCategoryService.getVendorCategory().subscribe(
      data=>{
        this.vendorCategoryList=data;
      }
    )    
  }


  onNoClick(action: string) 
  {
    if(action === 'add') 
      {
      this.advanceTableForm.reset();
    } 
    else 
    {
      this.dialogRef.close();
    }
  }


  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() 
  {
    return this.formControl.hasError('required') ? 'Required field'
      : this.formControl.hasError('email')? 'Not a valid email'
      : '';
  }

  
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      vendorContractCityTiersID: [this.advanceTable.vendorContractCityTiersID],
      vendorContractID: [this.advanceTable.vendorContractID],
      vendorContractCityTier: [this.advanceTable.vendorContractCityTier],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  public noWhitespaceValidator(control: FormControl) 
  {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
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
    this.advanceTableForm.patchValue({ vendorContractID:this.data.vendorContractID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('VendorContractCityTiersCreate:VendorContractCityTiersView:Success');//To Send Updates  
      this.saveDisabled = true;
    },
    error =>
    {
      this._generalService.sendUpdate('VendorContractCityTiersAll:VendorContractCityTiersView:Failure');//To Send Updates  
      this.saveDisabled = true;
    })
  }


  public Put(): void
  {
    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('VendorContractCityTiersUpdate:VendorContractCityTiersView:Success');//To Send Updates  
      this.saveDisabled = true;
    },
    error =>
    {
     this._generalService.sendUpdate('VendorContractCityTiersAll:VendorContractCityTiersView:Failure');//To Send Updates  
     this.saveDisabled = true;
    })
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


