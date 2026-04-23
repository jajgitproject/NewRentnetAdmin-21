// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CDCOutStationLumpsumRateService } from '../../cdcOutStationLumpsumRate.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { CDCOutStationLumpsumRate } from '../../cdcOutStationLumpsumRate.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { PackageDropDown } from 'src/app/package/packageDropDown.model';
import { CustomerContractCarCategoryDropDown } from 'src/app/customerContractCDCLocalRate/customerContractCarCategoryDropDown.model';
import { CustomerContractCityTiersDropDown } from 'src/app/customerContractCDCLocalRate/customerContractCityTiersDropDown.model';
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
  advanceTable: CDCOutStationLumpsumRate;
 
  public VehicleCategoryList?: CustomerContractCarCategoryDropDown[] = [];
  public PackageList?: PackageDropDown[] = [];
  public CityTierList?: CustomerContractCityTiersDropDown[] = [];
  filteredCategoryOptions: Observable<CustomerContractCarCategoryDropDown[]>;
  searchVehicleCategory: FormControl = new FormControl();
  filteredTierOptions: Observable<CustomerContractCityTiersDropDown[]>;
  searchCityTier: FormControl = new FormControl();
  filteredPackageOptions: Observable<PackageDropDown[]>;
  searchPackage: FormControl = new FormControl();

  image: any;
  fileUploadEl: any;
  applicableFrom: any;
  applicableTo: any;
  customerContractName: any;
  packageID: any;
  cityTierID: any;
  vehicleCategoryID: any;
  customerContractCityTiersID: any;
  customerContractCarCategoryID: any;
  saveDisabled: boolean = true;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CDCOutStationLumpsumRateService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Chauffeur Driven Car Outstation Lumpsum Package';       
          this.advanceTable = data.advanceTable;
            this.advanceTableForm = this.createContactForm();
        this.searchVehicleCategory.setValue(this.advanceTable.vehicleCategory);
        this.searchCityTier.setValue(this.advanceTable.cityTier);
        this.searchPackage.setValue(this.advanceTable.package);
        this.advanceTableForm?.patchValue({
           nightChargesBasedOn: this.advanceTable.nightChargesBasedOn || 'Garage'
            });
        } else 
        {
          this.dialogTitle = 'Chauffeur Driven Car Outstation Lumpsum Package';
          this.advanceTable = new CDCOutStationLumpsumRate({});
          this.advanceTable.activationStatus=true;
           this.advanceTableForm = this.createContactForm();
        }
       
        this.applicableFrom=data.ApplicableFrom;
        this.applicableTo=data.ApplicableTo;
        this.customerContractName=data.CustomerContractName;
  }
  public ngOnInit(): void
  {
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

  // InitVehicleCategory(){
  //   this._generalService.GetCarCategories().subscribe(
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
  //   this._generalService.GetCCCityTiers().subscribe(
  //     data=>{
  //       this.CityTierList=data;
  //     }
  //   )
  // }

  InitVehicleCategory(){
    this._generalService.GetCarCategory(this.data.CustomerContractID).subscribe(
      data=>
      {
        this.VehicleCategoryList=data;
        this.advanceTableForm.controls['vehicleCategory'].setValidators([Validators.required,
          this.vehicleCategoryValidator(this.VehicleCategoryList)
        ]);
        this.advanceTableForm.controls['vehicleCategory'].updateValueAndValidity();
        this.filteredCategoryOptions = this.advanceTableForm.controls['vehicleCategory'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.VehicleCategoryList.filter(
      customer => 
      {
        return customer.customerContractCarCategory.toLowerCase().includes(filterValue);
      });
  }
  OnVehicleCategorySelect(selectedVehicleCategory: string)
  {
    const VehicleCategoryName = this.VehicleCategoryList.find(
      data => data.customerContractCarCategory === selectedVehicleCategory
    );
    if (selectedVehicleCategory) 
    {
      this.getTitles(VehicleCategoryName.customerContractCarCategoryID);
    }
  }
  getTitles(customerContractCarCategoryID: any)
  {
    this.customerContractCarCategoryID=customerContractCarCategoryID;
  }

 InitCityTier(){
    this._generalService.GetCCCityTiersForCD(this.data.CustomerContractID).subscribe(
      data=>
      {
        this.CityTierList=data;
        this.advanceTableForm.controls['cityTier'].setValidators([Validators.required,
          this.cityTierValidator(this.CityTierList)
        ]);
        this.advanceTableForm.controls['cityTier'].updateValueAndValidity();
        this.filteredTierOptions = this.advanceTableForm.controls['cityTier'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCityTier(value || ''))
        ); 
      });
  }
  
  private _filterCityTier(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CityTierList.filter(
      customer => 
      {
        return customer.customerContractCityTier.toLowerCase().includes(filterValue);
      });
  }
  OnCityTierSelect(selectedCityTier: string)
  {
    const CityTierName = this.CityTierList.find(
      data => data.customerContractCityTier === selectedCityTier
    );
    if (selectedCityTier) 
    {
      this.getcityTierID(CityTierName.customerContractCityTiersID);
    }
  }
  getcityTierID(customerContractCityTiersID: any)
  {
    this.customerContractCityTiersID=customerContractCityTiersID;
  }
  InitPackage()
  {
    this._generalService.GetPackageForCDC(6).subscribe(
      data=>
      {
        this.PackageList=data;
        this.advanceTableForm.controls['package'].setValidators([Validators.required,
          this.packageValidator(this.PackageList)
        ]);
        this.advanceTableForm.controls['package'].updateValueAndValidity();
        this.filteredPackageOptions = this.advanceTableForm.controls['package'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackage(value || ''))
        ); 
      });
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
      this.getpackageID(PackageName.packageID);
    }
  }
  getpackageID(packageID: any)
  {
    this.packageID=packageID;
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
      cdcOutStationLumpsumRateID: [this.advanceTable.cdcOutStationLumpsumRateID],
      customerContractID: [this.advanceTable.customerContractID],
      customerContractCarCategoryID: [this.advanceTable.customerContractCarCategoryID],
      customerContractCityTiersID: [this.advanceTable.customerContractCityTiersID],
      packageID: [this.advanceTable.packageID],
      billFromTo: [this.advanceTable.billFromTo],
     nightChargesBasedOn: [this.advanceTable.nightChargesBasedOn || 'Garage'],
      minimumKms: [this.advanceTable.minimumKms],
      minimumHours: [this.advanceTable.minimumHours],    
      minimumDays: [this.advanceTable.minimumDays],
      packageRate: [this.advanceTable.packageRate],
      packageRateForSupplier: [this.advanceTable.packageRateForSupplier],
      extraKmsRate:[this.advanceTable.extraKmsRate],
      extraKmsRateForSupplier:[this.advanceTable.extraKmsRateForSupplier],
      driverAllowance: [this.advanceTable.driverAllowance],
      driverAllowanceForSupplier: [this.advanceTable.driverAllowanceForSupplier],
      kMsPerExtraHR: [this.advanceTable.kMsPerExtraHR],
      nightChargeable:[this.advanceTable.nightChargeable],
      nightCharge:[this.advanceTable.nightCharge],
      nightChargeForSupplier:[this.advanceTable.nightChargeForSupplier],      
      nightChargesStartTime:[this.advanceTable.nightChargesStartTime],
      nightChargesEndTime:[this.advanceTable.nightChargesEndTime],     
      graceMinutesForNightCharge:[this.advanceTable.graceMinutesForNightCharge || 0],
      graceMinutesNightChargeAmount:[this.advanceTable.graceMinutesNightChargeAmount || 0],
      additionalKM: [this.advanceTable.additionalKM],
      additionalMinutes: [this.advanceTable.additionalMinutes],   
      tollChargeable: [this.advanceTable.tollChargeable],
      parkingChargeable: [this.advanceTable.parkingChargeable],
      vehicleCategory: [this.advanceTable.vehicleCategory],
      cityTier: [this.advanceTable.cityTier],
      package: [this.advanceTable.package],
      interStateChargeable: [this.advanceTable.interStateChargeable],    
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
    this.advanceTableForm.patchValue({customerContractID:this.data.CustomerContractID});
    this.advanceTableForm.patchValue({customerContractCarCategoryID:this.customerContractCarCategoryID});
    this.advanceTableForm.patchValue({customerContractCityTiersID:this.customerContractCityTiersID});
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
          this._generalService.sendUpdate('CDCOutStationLumpsumRateCreate:CDCOutStationLumpsumRateView:Success');//To Send Updates  
          this.saveDisabled = true;
        } 
      },
      error =>
      {
        this._generalService.sendUpdate('CDCOutStationLumpsumRateAll:CDCOutStationLumpsumRateView:Failure');//To Send Updates  
        this.saveDisabled = true;
      }
    )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({customerContractID:this.advanceTable.customerContractID});
    this.advanceTableForm.patchValue({customerContractCarCategoryID:this.customerContractCarCategoryID || this.advanceTable.customerContractCarCategoryID});
    this.advanceTableForm.patchValue({customerContractCityTiersID:this.customerContractCityTiersID || this.advanceTable.customerContractCityTiersID});
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
          this._generalService.sendUpdate('CDCOutStationLumpsumRateUpdate:CDCOutStationLumpsumRateView:Success');//To Send Updates  
          this.saveDisabled = true;
        } 
      },
      error =>
      {
        this._generalService.sendUpdate('CDCOutStationLumpsumRateAll:CDCOutStationLumpsumRateView:Failure');//To Send Updates  
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


  vehicleCategoryValidator(VehicleCategoryList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleCategoryList.some(group => group.customerContractCarCategory.toLowerCase() === value);
      return match ? null : { invalidVCSelection: true };
    };
  }

  cityTierValidator(CityTierList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityTierList.some(group => group.customerContractCityTier.toLowerCase() === value);
      return match ? null : { invalidCTSelection: true };
    };
  }

  packageValidator(PackageList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = PackageList.some(group => group.package.toLowerCase() === value);
      return match ? null : { invalidPackageSelection: true };
    };
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
        // graceMinutesForNightCharge: 0,
        // graceMinutesNightChargeAmount: 0
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


