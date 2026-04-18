// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { VendorLongTermRentalRateService } from '../../vendorLongTermRentalRate.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { VendorLongTermRentalRateModel } from '../../vendorLongTermRentalRate.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { VehicleCategoryDropDown } from 'src/app/vehicleCategory/vehicleCategoryDropDown.model';
import { PackageDropDown } from 'src/app/package/packageDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { VendorContractLocalRateService } from 'src/app/vendorContractLocalRate/vendorContractLocalRate.service';
import { VendorContractCarCategoryDropDownModel } from 'src/app/vendorContractCarCategory/vendorContractCarCategory.model';
import { CustomerContractCityTiersDropDown } from 'src/app/customerContractCDCLocalRate/customerContractCityTiersDropDown.model';
import { VendorContractCityTiersDropDownModel } from 'src/app/vendorContractLocalRate/vendorContractLocalRate.model';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: VendorLongTermRentalRateModel;

  public VehicleCategoryList?: VendorContractCarCategoryDropDownModel[] = [];
  filteredCategoryOptions: Observable<VendorContractCarCategoryDropDownModel[]>;
  searchCategoryBy: FormControl = new FormControl();
  
  public PackageList?: PackageDropDown[] = [];
  filteredPackageOptions: Observable<CustomerContractCityTiersDropDown[]>;
  searchPackageBy: FormControl = new FormControl();
  
  filteredTierOptions: Observable<VendorContractCityTiersDropDownModel[]>;
  public CityTierList?: VendorContractCityTiersDropDownModel[] = [];
  searchTierBy: FormControl = new FormControl();

  image: any;
  fileUploadEl: any;
  applicableFrom: any;
  applicableTo: any;
  vendorContractName: any;
  vendorContractCityTiersID: any;
  packageID: any;
  vendorContractCarCategoryID: any;
  saveDisabled: boolean = true;
  VendorContractID: any;
  VendorContractName: any;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    public vendorContractLocalRateService: VendorContractLocalRateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: VendorLongTermRentalRateService,
    private fb: FormBuilder,
    private el: ElementRef,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'duplicate') {
      this.dialogTitle = 'Chauffeur Driven Car Long  Term Rental Package';
      this.advanceTable = data.advanceTable;
      this.advanceTableForm = this.createContactForm();
      this.searchCategoryBy.setValue(this.advanceTable.vendorContractCarCategory)
      this.searchTierBy.setValue(this.advanceTable.vendorContractCityTier)
      this.searchPackageBy.setValue(this.advanceTable.package)
      this.advanceTableForm?.patchValue({nightChargesBasedOn: this.advanceTable.nightChargesBasedOn || 'Garage'});        
    }
    else if (this.action === 'edit') {
      this.dialogTitle = 'Chauffeur Driven Car Long  Term Rental Package';
      this.advanceTable = data.advanceTable;
       this.advanceTableForm = this.createContactForm();
      this.searchCategoryBy.setValue(this.advanceTable.vendorContractCarCategory)
      this.searchTierBy.setValue(this.advanceTable.vendorContractCityTier)
      this.searchPackageBy.setValue(this.advanceTable.package)
      this.advanceTableForm?.patchValue({
           nightChargesBasedOn: this.advanceTable.nightChargesBasedOn || 'Garage'
            });
    } else {
      this.dialogTitle = 'Chauffeur Driven Car Long  Term Rental Package';
      this.advanceTable = new VendorLongTermRentalRateModel({});
      this.advanceTable.activationStatus = true;
       this.advanceTableForm = this.createContactForm();
    }
    //this.advanceTableForm = this.createContactForm();
    this.applicableFrom = data.ApplicableFrom;
    this.applicableTo = data.ApplicableTo;
    this.VendorContractName = data.VendorContractName;
    this.VendorContractID=data.VendorContractID;
  }
  public ngOnInit(): void {
    if(this.action === 'edit')
    {
      this.advanceTableForm.controls["package"].disable();
    }
    this.InitVehicleCategory();
    this.InitPackage();
    this.InitCityTier();
       if(!this.advanceTableForm.controls['nightChargeable'].value) {
      this.advanceTableForm.get('nightCharge')?.disable();
      this.advanceTableForm.get('nightChargeForSupplier')?.disable();
      this.advanceTableForm.get('graceMinutesForNightCharge')?.disable();
      this.advanceTableForm.get('graceMinutesNightChargeAmount')?.disable();
      this.advanceTableForm.get('nightChargesStartTime')?.disable();
      this.advanceTableForm.get('nightChargesEndTime')?.disable();
    } else {
      // Enable fields if the value is true
      this.advanceTableForm.get('nightChargesStartTime')?.enable();
      this.advanceTableForm.get('nightChargesEndTime')?.enable();
      this.advanceTableForm.get('nightCharge')?.enable();
      this.advanceTableForm.get('nightChargeForSupplier')?.enable();
      this.advanceTableForm.get('graceMinutesForNightCharge')?.enable();
      this.advanceTableForm.get('graceMinutesNightChargeAmount')?.enable();
    }
  }

  //---------- Vehicle Category ----------
  vehicleCategoryValidator(VehicleCategoryList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleCategoryList.some(group => group.vendorContractCarCategory.toLowerCase() === value);
      return match ? null : { invalidVCSelection: true };
    };
  }

  InitVehicleCategory()
  {
    this.vendorContractLocalRateService.GetCarCategory(this.VendorContractID).subscribe(
      data=>{
        this.VehicleCategoryList=data;
        this.advanceTableForm.controls['vendorContractCarCategory'].setValidators([Validators.required,this.vehicleCategoryValidator(this.VehicleCategoryList)]);
        this.advanceTableForm.controls['vendorContractCarCategory'].updateValueAndValidity();
        this.filteredCategoryOptions = this.advanceTableForm.controls['vendorContractCarCategory'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicleCategory(value || ''))
        ); 
      }
    )
  }
  private _filterVehicleCategory(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.VehicleCategoryList?.filter(
      data => 
      {
        return data.vendorContractCarCategory.toLowerCase().includes(filterValue);
      });
  }
  OnVehicleCategorySelect(selectedVehicleCategory: string)
  {
    const VehicleCategoryName = this.VehicleCategoryList.find(
      data => data.vendorContractCarCategory === selectedVehicleCategory
    );
    if (selectedVehicleCategory) 
    {
      this.getVehicleCategoryID(VehicleCategoryName.vendorContractCarCategoryID);
    }
  }
  getVehicleCategoryID(vendorContractCarCategoryID: any)
  {
    this.vendorContractCarCategoryID=vendorContractCarCategoryID;
  }


  //---------- Package ----------
  packageValidator(PackageList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = PackageList.some(group => group.package.toLowerCase() === value);
      return match ? null : { invalidPackageSelection: true };
    };
  }

  InitPackage()
  {
    this._generalService.GetPackageForCDC(1).subscribe(
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
    return this.PackageList?.filter(
      data => 
      {
        return data.package.toLowerCase().includes(filterValue);
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

  //---------- City Tier ----------
  cityTierValidator(CityTierList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityTierList.some(group => group.vendorContractCityTier.toLowerCase() === value);
      return match ? null : { invalidCTSelection: true };
    };
  }

  InitCityTier()
  {
    this.vendorContractLocalRateService.GetCityTiersForCV(this.VendorContractID).subscribe(
      data=>{
        this.CityTierList=data;
        console.log(this.CityTierList)
        this.advanceTableForm.controls['vendorContractCityTier'].setValidators([Validators.required,this.cityTierValidator(this.CityTierList)]);
        this.advanceTableForm.controls['vendorContractCityTier'].updateValueAndValidity();
        this.filteredTierOptions = this.advanceTableForm.controls['vendorContractCityTier'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterTier(value || ''))
        ); 
      }
    )
  }
  private _filterTier(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CityTierList?.filter(
      data => 
      {
        return data.vendorContractCityTier.toLowerCase().includes(filterValue);
      });
  }
  OnCityTierSelect(selectedCityTier: string)
  {
    const CityTierName = this.CityTierList.find(
      data => data.vendorContractCityTier === selectedCityTier
    );
    if (selectedCityTier) 
    {
      this.getTierTitles(CityTierName.vendorContractCityTiersID);
    }
  }  
  getTierTitles(vendorContractCityTiersID: any)
  {
    this.vendorContractCityTiersID=vendorContractCityTiersID;
    console.log(this.vendorContractCityTiersID)
  }


  formControl = new FormControl('',
    [
      Validators.required
      // Validators.email,
    ]);

  getErrorMessage() 
  {
    return this.formControl.hasError('required') ? 'Required field'
      : this.formControl.hasError('email') ? 'Not a valid email'
      : '';
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        vendorLongTermRentalRateID: [this.advanceTable.vendorLongTermRentalRateID],
        vendorContractID: [this.advanceTable.vendorContractID],
        vendorContractCarCategoryID: [this.advanceTable.vendorContractCarCategoryID],        
        vendorContractCarCategory: [this.advanceTable.vendorContractCarCategory],
        vendorContractCityTier: [this.advanceTable.vendorContractCityTier],
        vendorContractCityTiersID: [this.advanceTable.vendorContractCityTiersID],
        packageID: [this.advanceTable.packageID],
        billFromTo: [this.advanceTable.billFromTo],
        nightChargesBasedOn: [this.advanceTable.nightChargesBasedOn || 'Garage'],
        dailyHours: [this.advanceTable.dailyHours],
        dailyKM: [this.advanceTable.dailyKM],
        monthlyHours: [this.advanceTable.monthlyHours],
        monthlyKMs: [this.advanceTable.monthlyKMs],
        totalDays: [this.advanceTable.totalDays],
        billingCriteria: ['Extra KM and Extra Mintues Rates'],
        totalDaysBaseRate: [this.advanceTable.totalDaysBaseRate],
        dailyBaseRate: [this.advanceTable.dailyBaseRate],
        extraKMRate: [this.advanceTable.extraKMRate],
        extraHRRate: [this.advanceTable.extraHRRate],
        driverAllowance: [this.advanceTable.driverAllowance],
        nightChargeable: [this.advanceTable.nightChargeable],
        nightCharge: [this.advanceTable.nightCharge],
        nightChargesStartTime: [this.advanceTable.nightChargesStartTime],
        nightChargesEndTime: [this.advanceTable.nightChargesEndTime],
        graceMinutesForNightCharge: [this.advanceTable.graceMinutesForNightCharge],
        graceMinutesNightChargeAmount: [this.advanceTable.graceMinutesNightChargeAmount],
        fkmP2P: [this.advanceTable.fkmP2P],
        fixedP2PAmount: [this.advanceTable.fixedP2PAmount],
        additionalKM: [this.advanceTable.additionalKM],
        additionalMinutes: [this.advanceTable.additionalMinutes],
        graceMinutes: [this.advanceTable.graceMinutes],
        graceKM: [this.advanceTable.graceKM],
        tollChargeable: [this.advanceTable.tollChargeable],
        parkingChargeable: [this.advanceTable.parkingChargeable],
        interStateChargeable: [this.advanceTable.interStateChargeable],
        package: [this.advanceTable.package],
        activationStatus: [this.advanceTable.activationStatus],
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

  submit() {
    // emppty stuff
  }
  reset(): void {
    this.advanceTableForm.reset();
  }
  onNoClick()
  {
    this.dialogRef.close();
  }
  public Post(): void {
    debugger
    this.advanceTableForm.patchValue({vendorContractID: this.data.VendorContractID});
    this.advanceTableForm.patchValue({vendorContractCarCategoryID:this.vendorContractCarCategoryID});
    this.advanceTableForm.patchValue({vendorContractCityTiersID:this.vendorContractCityTiersID});
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
            this.dialogRef.close();
            this._generalService.sendUpdate('VendorLongTermRentalRateCreate:VendorLongTermRentalRateView:Success');//To Send Updates  
            this.saveDisabled = true;
          } 
        },
        error => {
          this._generalService.sendUpdate('VendorLongTermRentalRateAll:VendorLongTermRentalRateView:Failure');//To Send Updates  
          this.saveDisabled = true;
        }
      )
  }
  public Put(): void {
    this.advanceTableForm.patchValue({vendorContractID: this.advanceTable.vendorContractID});
    this.advanceTableForm.patchValue({vendorContractCarCategoryID:this.vendorContractCarCategoryID || this.advanceTable.vendorContractCarCategoryID});
    this.advanceTableForm.patchValue({vendorContractCityTiersID:this.vendorContractCityTiersID || this.advanceTable.vendorContractCityTiersID});
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
            this.dialogRef.close();
            this._generalService.sendUpdate('VendorLongTermRentalRateUpdate:VendorLongTermRentalRateView:Success');//To Send Updates  
            this.saveDisabled = true;
          } 
        },
        error => {
          this._generalService.sendUpdate('VendorLongTermRentalRateAll:VendorLongTermRentalRateView:Failure');//To Send Updates  
          this.saveDisabled = true;
        }
      )
  }

  public Duplicate(): void {
    this.advanceTableForm.patchValue({vendorContractID:this.advanceTable.vendorContractID});
    this.advanceTableForm.patchValue({vendorContractCarCategoryID:this.vendorContractCarCategoryID || this.advanceTable.vendorContractCarCategoryID});
    this.advanceTableForm.patchValue({vendorContractCityTiersID:this.vendorContractCityTiersID || this.advanceTable.vendorContractCityTiersID});
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
        this.dialogRef.close();
        this._generalService.sendUpdate('VendorLongTermRentalRateUpdate:VendorLongTermRentalRateView:Success');
        this.saveDisabled = true; 
      }
    },
    error =>
    {
     this._generalService.sendUpdate('VendorLongTermRentalRateAll:VendorLongTermRentalRateView:Failure');
     this.saveDisabled = true;
    }
  )
  }

  public confirmAdd(): void {
    this.saveDisabled = false;
    if(this.action=="duplicate")
    {
      this.Duplicate();
    }
    else if (this.action == "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }


  onTimeInput(event: any): void {
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
      this.advanceTableForm.get('nightChargesStartTime')?.disable();
      this.advanceTableForm.get('nightChargesEndTime')?.disable();
    } else {
      this.advanceTableForm.patchValue({
        nightCharge: 0,
        nightChargeForSupplier: 0,
        graceMinutesForNightCharge: 0,
        graceMinutesNightChargeAmount: 0
      });
      // Enable fields if the value is true
      this.advanceTableForm.get('nightChargesStartTime')?.enable();
      this.advanceTableForm.get('nightChargesEndTime')?.enable();
      this.advanceTableForm.get('nightCharge')?.enable();
      this.advanceTableForm.get('nightChargeForSupplier')?.enable();
      this.advanceTableForm.get('graceMinutesForNightCharge')?.enable();
      this.advanceTableForm.get('graceMinutesNightChargeAmount')?.enable();
    }
  }
}


