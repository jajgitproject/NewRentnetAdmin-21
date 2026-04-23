// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import {  VendorLocalTransferRateService } from '../../vendorLocalTransferRate.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import {  VendorLocalTransferRate } from '../../vendorLocalTransferRate.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { VehicleCategoryDropDown } from 'src/app/vehicleCategory/vehicleCategoryDropDown.model';
import { PackageDropDown } from 'src/app/package/packageDropDown.model';
import { CityTierDropDown } from 'src/app/cityTier/cityTierDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { CustomerContractCarCategoryDropDown } from 'src/app/customerContractCarCategory/customerContractCarCategoryDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { VendorContractCarCategoryDropDown } from 'src/app/vendorOutStationRoundTripRate/vendorContractCarCategoryDropDown.model';
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
  advanceTable:  VendorLocalTransferRate;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  CustomerContractID!: number;
  CustomerContractName!: string;
  public VehicleCategoryList?: VendorContractCarCategoryDropDown[] = [];
  filteredCategoryOptions: Observable<VendorContractCarCategoryDropDown[]>;
  searchCategoryBy: FormControl = new FormControl();

  public PackageList?: PackageDropDown[] = [];
  filteredPackageOptions: Observable<PackageDropDown[]>;
  searchPackageBy: FormControl = new FormControl();

  public CityList?: CitiesDropDown[] = [];
  filteredTierOptions: Observable<CitiesDropDown[]>;
  searchTierBy: FormControl = new FormControl();

  image: any;
  fileUploadEl: any;
  applicableFrom: any;
  applicableTo: any;
  supplierContractName: any;
  supplierRateCardName: any;
  CustomerContractValidFrom: any;
  CustomerContractValidTo: any;
  customerContractCarCategoryID: any;
  packageID: any;
  cityID: any;
  saveDisabled: boolean = true;
  vendorContractCarCategoryID: any;
  VendorContractID: any;
  VendorContractName: any;
  ApplicableFrom: any;
  ApplicableTo: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService:  VendorLocalTransferRateService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
    this.VendorContractID= data.vendorContract_ID,
        this.VendorContractName =data.vendorContract_Name,
        this.ApplicableFrom=data.applicableFrom,
        this.ApplicableTo=data.applicableTo,
        this.supplierRateCardName=data.SupplierRateCardName;
        // Set the defaults
        this.action = data.action;
        if (this.action === 'duplicate') 
        {
          this.dialogTitle ='Vendor Contract Local Transfer Package';       
          this.advanceTable = data.advanceTable;
          this.advanceTableForm = this.createContactForm();
          this.searchCategoryBy.setValue(this.advanceTable.vendorContractCarCategory)
          this.searchTierBy.setValue(this.advanceTable.city)
          this.searchPackageBy.setValue(this.advanceTable.package)
          this.advanceTableForm?.patchValue({nightChargesBasedOn: this.advanceTable.nightChargesBasedOn || 'Garage'});        
        }
        else if (this.action === 'edit') 
        {
          this.dialogTitle ='Vendor Contract Local Transfer Package';       
          this.advanceTable = data.advanceTable;
           this.advanceTableForm = this.createContactForm();
          this.searchCategoryBy.setValue(this.advanceTable.vendorContractCarCategory)
          this.searchTierBy.setValue(this.advanceTable.city)
          this.searchPackageBy.setValue(this.advanceTable.package)
          this.advanceTableForm?.patchValue({
           nightChargesBasedOn: this.advanceTable.nightChargesBasedOn || 'Garage'
            });
        } else 
        {
          this.dialogTitle = 'Vendor Contract Local Transfer Package';
          this.advanceTable = new  VendorLocalTransferRate({});
          this.advanceTable.activationStatus=true;
           this.advanceTableForm = this.createContactForm();
        }
        this.advanceTableForm = this.createContactForm();
        // this.applicableFrom=data.ApplicableFrom;
        // this.applicableTo=data.ApplicableTo;
        // this.supplierContractName=data.SupplierContractName;
        // this.supplierRateCardName=data.SupplierRateCardName;
  }
  public ngOnInit(): void
  {
    if(this.action === 'edit')
    {
      this.advanceTableForm.controls["package"].disable();
    }
    this.InitVehicleCategory();
    this.InitPackage();
    this.InitCities();
     if(!this.advanceTableForm.controls['nightChargeable'].value) {
      this.advanceTableForm.get('nightCharge')?.disable();
      this.advanceTableForm.get('nightChargeForSupplier')?.disable();
      this.advanceTableForm.get('graceMinutesForNightCharge')?.disable();
      this.advanceTableForm.get('graceMinutesNightChargeAmount')?.disable();
      this.advanceTableForm.get('nightChargeStartTime')?.disable();
      this.advanceTableForm.get('nightChargeEndTime')?.disable();
    } else {
      // Enable fields if the value is true
      this.advanceTableForm.get('nightChargeStartTime')?.enable();
      this.advanceTableForm.get('nightChargeEndTime')?.enable();
      this.advanceTableForm.get('nightCharge')?.enable();
      this.advanceTableForm.get('nightChargeForSupplier')?.enable();
      this.advanceTableForm.get('graceMinutesForNightCharge')?.enable();
      this.advanceTableForm.get('graceMinutesNightChargeAmount')?.enable();
    }
  }

   InitVehicleCategory(){
    if (!this.data.vendorContractID) {
      console.error('vendorContractID is not set in data');
      this.VehicleCategoryList = [];
      return;
    }
    this._generalService.getVendorCarCategory(this.data.vendorContractID).subscribe(
      data=>{
        // this.VehicleCategoryList=data;
        this.VehicleCategoryList=data || [];
        this.advanceTableForm.controls['vendorContractCarCategory'].setValidators([Validators.required,
          this.vehicleCategoryValidator(this.VehicleCategoryList)
        ]);
        this.advanceTableForm.controls['vendorContractCarCategory'].updateValueAndValidity();
        this.filteredCategoryOptions = this.advanceTableForm.controls['vendorContractCarCategory'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCategory(value || ''))
        ); 

      }
    )
  }
  private _filterCategory(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this?.VehicleCategoryList.filter(
      customer => 
      {
        return customer?.vendorContractCarCategory.toLowerCase().includes(filterValue);
      });
  }
  OnVehicleCategorySelect(selectedVehicleCategory: string)
  {
    const VehicleCategoryName = this.VehicleCategoryList.find(
      data => data.vendorContractCarCategory === selectedVehicleCategory
    );
    if (selectedVehicleCategory) 
    {
      this.getTitles(VehicleCategoryName.vendorContractCarCategoryID);
    }
  }
  getTitles(vendorContractCarCategoryID: any)
  {
    this.vendorContractCarCategoryID=vendorContractCarCategoryID;
  }

   vehicleCategoryValidator(VehicleCategoryList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleCategoryList.some(group => group.vendorContractCarCategory.toLowerCase() === value);
      return match ? null : { invalidVCSelection: true };
    };
  }

  InitPackage(){
    this._generalService.GetPackageForCDC(4).subscribe(
      data=>{
        this.PackageList=data;
        this.advanceTableForm.controls['package'].setValidators([Validators.required,
          this.packageValidator(this.PackageList)
        ]);
        this.advanceTableForm.controls['package'].updateValueAndValidity();
        this.filteredPackageOptions = this.advanceTableForm.controls['package'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackage(value || ''))
        ); 
      }
    )
  }
  private _filterPackage(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.PackageList.filter(
      customer => 
      {
        return customer.package.toLowerCase().includes(filterValue);
      });
  }
  OnPackageSelect(selectedPackage: string)
  {
    const PackageName = this.PackageList.find(
      data => data.package === selectedPackage
    );
    if (selectedPackage) 
    {
      this.getPackage(PackageName.packageID);
    }
  }
  getPackage(packageID: any)
  {
    this.packageID=packageID;
  }
  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.advanceTableForm.controls['city'].setValidators([Validators.required,
          this.cityValidator(this.CityList)
        ]);
        this.advanceTableForm.controls['city'].updateValueAndValidity();
        this.filteredTierOptions = this.advanceTableForm.controls['city'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterTier(value || ''))
        ); 
      });
  }
  private _filterTier(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CityList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      });
  }
  OnCitySelect(selectedCity: string)
  {
    const CityName = this.CityList.find(
      data => data.geoPointName === selectedCity
    );
    if (selectedCity) 
    {
      this.getTierTitles(CityName.geoPointID);
    }
  }
  getTierTitles(cityID: any)
  {
    this.cityID=cityID;
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
      vendorLocalTransferRateID: [this.advanceTable.vendorLocalTransferRateID],
      vendorContractID: [this.advanceTable.vendorContractID],
      vendorContractCarCategoryID: [this.advanceTable.vendorContractCarCategoryID],
      cityID: [this.advanceTable.cityID],
      packageID: [this.advanceTable.packageID],
      billFromTo: [this.advanceTable.billFromTo],
      nightChargesBasedOn: [this.advanceTable.nightChargesBasedOn || 'Garage'],
      minimumHours: [this.advanceTable.minimumHours],
      minimumKM: [this.advanceTable.minimumKM],
      baseRate: [this.advanceTable.baseRate],
     // baseRateForSupplier: [this.advanceTable.baseRateForSupplier || 0],
      //extraKMRateForSupplier: [this.advanceTable.extraKMRateForSupplier || 0],
      //xtraHRRateForSupplier: [this.advanceTable.extraHRRateForSupplier || 0],
      //driverAllowanceForSupplier:[this.advanceTable.driverAllowanceForSupplier || 0],
      //nightChargeForSupplier:[this.advanceTable.nightChargeForSupplier || 0],
      billingOption: ['Extra KM and Extra Mintues Rates'],
      graceMinutesNightChargeAmount: [this.advanceTable.graceMinutesNightChargeAmount],
      extraKMRate:[this.advanceTable.extraKMRate],
      additionalKM:[this.advanceTable.additionalKM],
      additionalMinutes:[this.advanceTable.additionalMinutes],
      // graceKM:[this.advanceTable.graceKM],
      extraHRRate:[this.advanceTable.extraHRRate],
      kMsPerExtraHR: [this.advanceTable.kMsPerExtraHR],
      driverAllowance: [this.advanceTable.driverAllowance],
      nightChargeStartTime:[this.advanceTable.nightChargeStartTime],
      nightChargeEndTime:[this.advanceTable.nightChargeEndTime],
      nightCharge:[this.advanceTable.nightCharge],
      graceMinutesForNightCharge:[this.advanceTable.graceMinutesForNightCharge],
      fkmP2P: [this.advanceTable.fkmP2P],
      fixedP2PAmount: [this.advanceTable.fixedP2PAmount],
      // graceMinutes: [this.advanceTable.graceMinutes],   
       graceKM:[0],
      graceMinutes: [0],  
      tollChargeable: [this.advanceTable.tollChargeable],
      parkingChargeable: [this.advanceTable.parkingChargeable],
      interStateChargeable: [this.advanceTable.interStateChargeable],    
      activationStatus: [this.advanceTable.activationStatus],     
      nightChargeable:[this.advanceTable.nightChargeable],  
      package:[this.advanceTable.package],
      vendorContractCarCategory:[this.advanceTable.vendorContractCarCategory],
      city:[this.advanceTable.city], 
      ifExtraDrivenMoveToLocalPackages:[this.advanceTable.ifExtraDrivenMoveToLocalPackages]
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

numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
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
  onNoClick()
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({ vendorContractID:this.data.vendorContractID });
    this.advanceTableForm.patchValue({vendorContractCarCategoryID:this.vendorContractCarCategoryID});
    this.advanceTableForm.patchValue({cityID:this.cityID});
    this.advanceTableForm.patchValue({packageID:this.packageID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => {
        if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) 
        {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
          this.saveDisabled = true;
        }
        else
        {
        this.dialogRef.close(true);
          this._generalService.sendUpdate('VendorLocalTransferRateCreate:VendorLocalTransferRateView:Success');//To Send Updates  
          this.saveDisabled = true;
        } 
      },
      error =>
      {
        this._generalService.sendUpdate('VendorLocalTransferRateAll:VendorLocalTransferRateView:Failure');//To Send Updates
        this.saveDisabled = true;  
      }
    )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({vendorContractID:this.advanceTable.vendorContractID});
    this.advanceTableForm.patchValue({vendorContractCarCategoryID:this.vendorContractCarCategoryID || this.advanceTable.vendorContractCarCategoryID});
    this.advanceTableForm.patchValue({cityID:this.cityID || this.advanceTable.cityID});
    this.advanceTableForm.patchValue({packageID:this.packageID || this.advanceTable.packageID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => {
        if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) 
        {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
          this.saveDisabled = true;
        }
        else
        {
          this.dialogRef.close(true);
          this._generalService.sendUpdate('VendorLocalTransferRateUpdate:VendorLocalTransferRateView:Success');//To Send Updates  
          this.saveDisabled = true;
        } 
      },
      error =>
      {
        this._generalService.sendUpdate('VendorLocalTransferRateAll:VendorLocalTransferRateView:Failure');//To Send Updates 
        this.saveDisabled = true; 
      }
    )
  }

  public Duplicate(): void
  {
    this.advanceTableForm.patchValue({vendorContractID:this.advanceTable.vendorContractID});
    this.advanceTableForm.patchValue({vendorContractCarCategoryID:this.vendorContractCarCategoryID || this.advanceTable.vendorContractCarCategoryID});
    this.advanceTableForm.patchValue({cityID:this.cityID || this.advanceTable.cityID});
    this.advanceTableForm.patchValue({packageID:this.packageID || this.advanceTable.packageID});
    this.advanceTableService.duplicateInsert(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      if(response.activationStatus===false)
      {
        this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
        this.saveDisabled = true;
      }
      else 
      {
        this.dialogRef.close(true);
        this._generalService.sendUpdate('VendorLocalTransferRateUpdate:VendorLocalTransferRateView:Success');
        this.saveDisabled = true; 
      }
    },
    error =>
    {
     this._generalService.sendUpdate('VendorLocalTransferRateAll:VendorLocalTransferRateView:Failure');
     this.saveDisabled = true;
    }
  )
  }

  public confirmAdd(): void 
  {
    this.saveDisabled = false;
    if(this.action=="duplicate")
    {
      this.Duplicate();
    }
    else if(this.action=="edit")
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

  // vehicleCategoryValidator(VehicleCategoryList: any[]): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const value = control.value?.toLowerCase();
  //     const match = VehicleCategoryList.some(group => group.customerContractCarCategory.toLowerCase() === value);
  //     return match ? null : { invalidVCSelection: true };
  //   };
  // }

  cityValidator(CityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { invalidCitySelection: true };
    };
  }

  packageValidator(PackageList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = PackageList.some(group => group.package.toLowerCase() === value);
      return match ? null : { invalidPackageSelection: true };
    };
  }

  onStartTimeInput(event: any): void {
    const inputValue = event.target.value;
  
    // Attempt to parse the input as a valid time
    const parsedTime = new Date(`1970-01-01T${inputValue}`);
  
    // Check if the parsedTime is valid
    if (!isNaN(parsedTime.getTime())) {
        this.advanceTableForm.get('nightChargeStartTime').setValue(parsedTime);
    }
  }

  onEndTimeInput(event: any): void {
    const inputValue = event.target.value;
  
    // Attempt to parse the input as a valid time
    const parsedTime = new Date(`1970-01-01T${inputValue}`);
  
    // Check if the parsedTime is valid
    if (!isNaN(parsedTime.getTime())) {
        this.advanceTableForm.get('nightChargeEndTime').setValue(parsedTime);
    }
  }

  // Function to handle the change event
  onNightChargeableChange(value: boolean): void {
    if (value === false) {
      
      this.advanceTableForm.patchValue({
        nightCharge: 0,
        nightChargeForSupplier: 0,
        graceMinutesForNightCharge: 0,
        graceMinutesNightChargeAmount: 0
      });
    
      // Disable fields
      this.advanceTableForm.get('nightCharge')?.disable();
      this.advanceTableForm.get('nightChargeForSupplier')?.disable();
      this.advanceTableForm.get('graceMinutesForNightCharge')?.disable();
      this.advanceTableForm.get('graceMinutesNightChargeAmount')?.disable();
      this.advanceTableForm.get('nightChargeStartTime')?.disable();
      this.advanceTableForm.get('nightChargeEndTime')?.disable();
    } else {
      this.advanceTableForm.patchValue({
        nightCharge: 0,
        nightChargeForSupplier: 0,
        graceMinutesForNightCharge: 0,
        graceMinutesNightChargeAmount: 0
      });
      // Enable fields if the value is true
      this.advanceTableForm.get('nightChargeStartTime')?.enable();
      this.advanceTableForm.get('nightChargeEndTime')?.enable();
      this.advanceTableForm.get('nightCharge')?.enable();
      this.advanceTableForm.get('nightChargeForSupplier')?.enable();
      this.advanceTableForm.get('graceMinutesForNightCharge')?.enable();
      this.advanceTableForm.get('graceMinutesNightChargeAmount')?.enable();
    }
  }

}


