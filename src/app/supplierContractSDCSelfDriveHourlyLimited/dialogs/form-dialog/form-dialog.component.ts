// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { SupplierContractSDCSelfDriveHourlyLimitedService } from '../../supplierContractSDCSelfDriveHourlyLimited.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidationErrors, ValidatorFn, AbstractControl} from '@angular/forms';
import { SupplierContractSDCSelfDriveHourlyLimited } from '../../supplierContractSDCSelfDriveHourlyLimited.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { VehicleCategoryDropDown } from 'src/app/vehicleCategory/vehicleCategoryDropDown.model';
import { PackageDropDown } from 'src/app/package/packageDropDown.model';
import { CityTierDropDown } from 'src/app/cityTier/cityTierDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  advanceTable: SupplierContractSDCSelfDriveHourlyLimited;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  isLoading: boolean = false;

  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  public PackageList?: PackageDropDown[] = [];
  public CityTierList?: CityTierDropDown[] = [];
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  searchVehicleCategory: FormControl = new FormControl();
  filteredCityTierOptions: Observable<CityTierDropDown[]>;
  searchCityTier: FormControl = new FormControl();
  filteredPackageOptions: Observable<PackageDropDown[]>;
  searchPackage: FormControl = new FormControl();

  image: any;
  fileUploadEl: any;
  applicableFrom: any;
  applicableTo: any;
  supplierContractName: any;
  supplierRateCardName: any;
  packageID: any;
  cityTierID: any;
  vehicleCategoryID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SupplierContractSDCSelfDriveHourlyLimitedService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Self Driven Car Hourly Limited KM Package';       
          this.advanceTable = data.advanceTable;
            this.searchVehicleCategory.setValue(this.advanceTable.vehicleCategory);
            this.searchCityTier.setValue(this.advanceTable.cityTier);
            this.searchPackage.setValue(this.advanceTable.package);

        } else 
        {
          this.dialogTitle = 'Self Driven Car Hourly Limited KM Package';
          this.advanceTable = new SupplierContractSDCSelfDriveHourlyLimited({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.applicableFrom=data.ApplicableFrom;
        this.applicableTo=data.ApplicableTo;
        this.supplierContractName=data.SupplierContractName;
        this.supplierRateCardName=data.SupplierRateCardName;
  }
  public ngOnInit(): void
  {
    this.InitVehicleCategory();
    this.InitPackage();
    this.InitCityTier();
  }

  // InitVehicleCategory(){
  //   this._generalService.GetVehicleCategories().subscribe(
  //     data=>{
  //       this.VehicleCategoryList=data;
  //     }
  //   )
  // }

  // InitPackage(){
  //   this._generalService.GetPackages().subscribe(
  //     data=>{
  //       this.PackageList=data;
  //     }
  //   )
  // }

  // InitCityTier(){
  //   this._generalService.GetCityTiers().subscribe(
  //     data=>{
  //       this.CityTierList=data;
  //     }
  //   )
  // }

  //----------- Vehicle Category Validation --------------
  vehicleCategoryValidator(VehicleCategoryList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleCategoryList.some(employee => employee.vehicleCategory.toLowerCase() === value);
      return match ? null : { vehicleCategoryInvalid: true };
    };
  }

 InitVehicleCategory(){
  this._generalService.GetVehicleCategories().subscribe(
    data=>
    {
      this.VehicleCategoryList=data; 
      this.advanceTableForm.controls['vehicleCategory'].setValidators([Validators.required,
        this.vehicleCategoryValidator(this.VehicleCategoryList)]);
      this.advanceTableForm.controls['vehicleCategory'].updateValueAndValidity();
      this.filteredVehicleCategoryOptions =this.advanceTableForm.controls['vehicleCategory'].valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value || ''))
      ); 
    });
}

private _filter(value: string): any {
  const filterValue = value.toLowerCase();
  return this.VehicleCategoryList.filter(
    customer => 
    {
      return customer.vehicleCategory.toLowerCase().includes(filterValue);
    }
  );
}
onVehicleCategorySelected(selectedVehicleCategory: string) {
  const selectedValue = this.VehicleCategoryList.find(
    data => data.vehicleCategory === selectedVehicleCategory
  );

  if (selectedValue) {
    this.getTitles(selectedValue.vehicleCategoryID);
  }
}

getTitles(vehicleCategoryID: any) {
  //debugger;
  this.vehicleCategoryID=vehicleCategoryID;
  console.log(vehicleCategoryID)
}

//----------- City Tier Validation --------------
cityTierValidator(CityTierList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = CityTierList.some(employee => employee.cityTierName.toLowerCase() === value);
    return match ? null : { cityTierInvalid: true };
  };
}

InitCityTier(){
  this._generalService.GetCityTiers().subscribe(
    data=>
    {
      this.CityTierList=data;
      this.advanceTableForm.controls['cityTier'].setValidators([Validators.required,
        this.cityTierValidator(this.CityTierList)]);
      this.advanceTableForm.controls['cityTier'].updateValueAndValidity();
      this.filteredCityTierOptions = this.advanceTableForm.controls['cityTier'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterCityTier(value || ''))
      ); 
    });
}

private _filterCityTier(value: string): any {
  const filterValue = value.toLowerCase();
  return this.CityTierList.filter(
    customer => 
    {
      return customer.cityTierName.toLowerCase().includes(filterValue);
    }
  );
}

onCityTierSelected(selectedCityTier: string) {
  const selectedValue = this.CityTierList.find(
    data => data.cityTierName === selectedCityTier
  );

  if (selectedValue) {
    this.getcityTierID(selectedValue.cityTierID);
  }
}

getcityTierID(cityTierID: any) {
  //debugger;
  this.cityTierID=cityTierID;
  //console.log(cityTierID)
}

//----------- Package Validation --------------
packageValidator(PackageList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = PackageList.some(employee => employee.package.toLowerCase() === value);
    return match ? null : { packageInvalid: true };
  };
}

InitPackage(){
  this._generalService.GetPackages().subscribe(
    data=>
    {
      this.PackageList=data;
      this.advanceTableForm.controls['package'].setValidators([Validators.required,
        this.packageValidator(this.PackageList)]);
      this.advanceTableForm.controls['package'].updateValueAndValidity();
      this.filteredPackageOptions = this.advanceTableForm.controls['package'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterPackage(value || ''))
      ); 
    });
}

private _filterPackage(value: string): any {
  const filterValue = value.toLowerCase();
  // Only show results if 3 or more characters are typed
  if (filterValue.length < 3) {
    return [];
  }
  return this.PackageList.filter(
    customer => 
    {
      return customer.package.toLowerCase().includes(filterValue);
    }
  );
}

onPackageSelected(selectedPackage: string) {
  const selectedValue = this.PackageList.find(
    data => data.package === selectedPackage
  );

  if (selectedValue) {
    this.getpackageID(selectedValue.packageID);
  }
}

getpackageID(packageID: any) {
  //debugger;
  this.packageID=packageID;
  //console.log(packageID)
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
    //console.log(this.advanceTable)
    return this.fb.group(
    {
      supplierContractSDCSelfDriveHourlyLimitedID: [this.advanceTable.supplierContractSDCSelfDriveHourlyLimitedID],
      supplierContractID: [this.advanceTable.supplierContractID],
      vehicleCategoryID: [this.advanceTable.vehicleCategoryID],
      vehicleCategory: [this.advanceTable.vehicleCategory],
      cityTierID: [this.advanceTable.cityTierID],
      cityTier: [this.advanceTable.cityTier],
      packageID: [this.advanceTable.packageID],
      package: [this.advanceTable.package],
      deliveryChargeable: [this.advanceTable.deliveryChargeable],
      deliveryCharges: [this.advanceTable.deliveryCharges],
      pickupChargeable: [this.advanceTable.pickupChargeable],
      pickupCharges: [this.advanceTable.pickupCharges],
      minimumHours: [this.advanceTable.minimumHours],
      minimumKMs: [this.advanceTable.minimumKMs],
      graceKMs:[this.advanceTable.graceKMs],
      baseRate: [this.advanceTable.baseRate],    
      extraKMRate:[this.advanceTable.extraKMRate],
      extraHRRate:[this.advanceTable.extraHRRate],
      securityDepositAmount: [this.advanceTable.securityDepositAmount],
      nightChargesStartTime:[this.advanceTable.nightChargesStartTime],
      nightChargesEndTime:[this.advanceTable.nightChargesEndTime],   
      graceMinutesForNightCharge:[this.advanceTable.graceMinutesForNightCharge],
      graceMinutesNightCharge:[this.advanceTable.graceMinutesNightCharge],    
      deliveryChargesAtNight: [this.advanceTable.deliveryChargesAtNight],
      pickupChargesAtNight: [this.advanceTable.pickupChargesAtNight],
      billFromTo: [this.advanceTable.billFromTo],   
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  onStartTimeInput(event: any): void {
    const inputValue = event.target.value;
  
    // Attempt to parse the input as a valid time
    const parsedTime = new Date(`1970-01-01T${inputValue}`);
  
    // Check if the parsedTime is valid
    if (!isNaN(parsedTime.getTime())) {
        this.advanceTableForm.get('nightChargesStartTime').setValue(parsedTime);
    }
  }

  onEndTimeInput(event: any): void {
    const inputValue = event.target.value;
  
    // Attempt to parse the input as a valid time
    const parsedTime = new Date(`1970-01-01T${inputValue}`);
  
    // Check if the parsedTime is valid
    if (!isNaN(parsedTime.getTime())) {
        this.advanceTableForm.get('nightChargesEndTime').setValue(parsedTime);
    }
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
  onNoClick():void{
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.isLoading = true;

    this.advanceTableForm.patchValue({supplierContractID:this.data.SupplierContractID});
    this.advanceTableForm.patchValue({vehicleCategoryID:this.vehicleCategoryID});
    this.advanceTableForm.patchValue({cityTierID:this.cityTierID});
    this.advanceTableForm.patchValue({packageID:this.packageID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.isLoading = false;
        this.dialogRef.close();
       this._generalService.sendUpdate('SupplierContractSDCSelfDriveHourlyLimitedCreate:SupplierContractSDCSelfDriveHourlyLimitedView:Success');//To Send Updates  
    
    },
    error =>
    {
      this.isLoading = false;
       this._generalService.sendUpdate('SupplierContractSDCSelfDriveHourlyLimitedAll:SupplierContractSDCSelfDriveHourlyLimitedView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.isLoading = true;
    this.advanceTableForm.patchValue({supplierContractID:this.advanceTable.supplierContractID});  
 this.advanceTableForm.patchValue({vehicleCategoryID:this.vehicleCategoryID || this.advanceTable.vehicleCategoryID});
 this.advanceTableForm.patchValue({cityTierID:this.cityTierID || this.advanceTable.cityTierID});
 this.advanceTableForm.patchValue({packageID:this.packageID || this.advanceTable.packageID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.isLoading = false;
        this.dialogRef.close();
       this._generalService.sendUpdate('SupplierContractSDCSelfDriveHourlyLimitedUpdate:SupplierContractSDCSelfDriveHourlyLimitedView:Success');//To Send Updates  
       
    },
    error =>
    {
      this.isLoading = false;
     this._generalService.sendUpdate('SupplierContractSDCSelfDriveHourlyLimitedAll:SupplierContractSDCSelfDriveHourlyLimitedView:Failure');//To Send Updates  
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


