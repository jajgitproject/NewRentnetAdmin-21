// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CDCOutStationOneWayTripRateService } from '../../cdcOutStationOneWayTripRate.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { CDCOutStationOneWayTripRate } from '../../cdcOutStationOneWayTripRate.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { VehicleCategoryDropDown } from 'src/app/vehicleCategory/vehicleCategoryDropDown.model';
import { PackageDropDown } from 'src/app/package/packageDropDown.model';
import { CityTierDropDown } from 'src/app/cityTier/cityTierDropDown.model';
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
  advanceTable: CDCOutStationOneWayTripRate;
  public VehicleCategoryList?: CustomerContractCarCategoryDropDown[] = [];
  filteredCategoryOptions: Observable<CustomerContractCarCategoryDropDown[]>;
  searchCategoryBy: FormControl = new FormControl();

  public PackageList?: PackageDropDown[] = [];
  filteredTierOptions: Observable<CustomerContractCityTiersDropDown[]>;
  searchTierBy: FormControl = new FormControl();

  public CityTierList?: CustomerContractCityTiersDropDown[] = [];
  filteredPackageOptions: Observable<CustomerContractCityTiersDropDown[]>;
  searchPackageBy: FormControl = new FormControl();

  image: any;
  fileUploadEl: any;
  applicableFrom: any;
  applicableTo: any;
  customerContractName: any;
  customerContractCityTiersID: any;
  packageID: any;
  customerContractCarCategoryID: any;
  saveDisabled: boolean = true;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CDCOutStationOneWayTripRateService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'duplicate') 
        {
          this.dialogTitle ='Chauffeur Driven Car Outstation One Way Trip Rate Package';       
          this.advanceTable = data.advanceTable;
          this.advanceTableForm = this.createContactForm();
          this.searchCategoryBy.setValue(this.advanceTable.customerContractCarCategory)
          this.searchTierBy.setValue(this.advanceTable.customerContractCityTier)
          this.searchPackageBy.setValue(this.advanceTable.package)
          this.advanceTableForm?.patchValue({nightChargesBasedOn: this.advanceTable.nightChargesBasedOn || 'Garage'});        
        }
        else if (this.action === 'edit') 
        {
          this.dialogTitle ='Chauffeur Driven Car Outstation One Way Trip Rate Package';       
          this.advanceTable = data.advanceTable;
           this.advanceTableForm = this.createContactForm();
          this.searchCategoryBy.setValue(this.advanceTable.customerContractCarCategory)
      this.searchTierBy.setValue(this.advanceTable.customerContractCityTier)
      this.searchPackageBy.setValue(this.advanceTable.package)
       this.advanceTableForm?.patchValue({
           nightChargesBasedOn: this.advanceTable.nightChargesBasedOn || 'Garage'
            });
        } else 
        {
          this.dialogTitle = 'Chauffeur Driven Car Outstation One Way Trip Rate Package';
          this.advanceTable = new CDCOutStationOneWayTripRate({});
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

  InitVehicleCategory(){
    this._generalService.GetCarCategory(this.data.CustomerContractID).subscribe(
      data=>{
        this.VehicleCategoryList=data;
        this.advanceTableForm.controls['vehicleCategory'].setValidators([Validators.required,
          this.vehicleCategoryValidator(this.VehicleCategoryList)
        ]);
        this.advanceTableForm.controls['vehicleCategory'].updateValueAndValidity();
        this.filteredCategoryOptions = this.advanceTableForm.controls['vehicleCategory'].valueChanges.pipe(
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
  InitPackage(){
    this._generalService.GetPackageForCDC(7).subscribe(
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
  InitCityTier(){
    this._generalService.GetCCCityTiersForCD(this.data.CustomerContractID).subscribe(
      data=>{
        this.CityTierList=data;
        this.advanceTableForm.controls['cityTier'].setValidators([Validators.required,
          this.cityTierValidator(this.CityTierList)
        ]);
        this.advanceTableForm.controls['cityTier'].updateValueAndValidity();
        this.filteredTierOptions = this.advanceTableForm.controls['cityTier'].valueChanges.pipe(
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
      this.getTierTitles(CityTierName.customerContractCityTiersID);
    }
  }
  getTierTitles(customerContractCityTiersID: any)
  {

    this.customerContractCityTiersID=customerContractCityTiersID;
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
      cdcOutStationOneWayTripRateID: [this.advanceTable.cdcOutStationOneWayTripRateID],
      customerContractID: [this.advanceTable.customerContractID],
      customerContractCarCategoryID: [this.advanceTable.customerContractCarCategoryID],
      customerContractCityTiersID: [this.advanceTable.customerContractCityTiersID],
      packageID: [this.advanceTable.packageID],
      billFromTo: [this.advanceTable.billFromTo],
       nightChargesBasedOn: [this.advanceTable.nightChargesBasedOn || 'Garage'],
      minimumKms: [this.advanceTable.minimumKms],
      packageRate: [this.advanceTable.packageRate],
      packageRateForSupplier: [this.advanceTable.packageRateForSupplier || 0],
      extraKmsRate: [this.advanceTable.extraKmsRate],
      extraKmsRateForSupplier:[this.advanceTable.extraKmsRateForSupplier || 0],
      
      driverAllowance: [this.advanceTable.driverAllowance],
      driverAllowanceForSupplier: [this.advanceTable.driverAllowanceForSupplier || 0],
      nightChargeable:[this.advanceTable.nightChargeable],
      nightCharge:[this.advanceTable.nightCharge],
      nightChargeForSupplier:[this.advanceTable.nightChargeForSupplier || 0],      
      nightChargesStartTime:[this.advanceTable.nightChargesStartTime],
      nightChargesEndTime:[this.advanceTable.nightChargesEndTime],     
      graceMinutesForNightCharge:[this.advanceTable.graceMinutesForNightCharge],
      graceMinutesNightChargeAmount:[this.advanceTable.graceMinutesNightChargeAmount],
    
      additionalKM: [this.advanceTable.additionalKM],
      additionalMinutes: [this.advanceTable.additionalMinutes],
    
      tollChargeable: [this.advanceTable.tollChargeable],
      parkingChargeable: [this.advanceTable.parkingChargeable],
      interStateChargeable: [this.advanceTable.interStateChargeable],   
      vehicleCategory: [this.advanceTable.vehicleCategory], 
      cityTier: [this.advanceTable.cityTier], 
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
          this._generalService.sendUpdate('CDCOutStationOneWayTripRateCreate:CDCOutStationOneWayTripRateView:Success');//To Send Updates  
          this.saveDisabled = true;
        } 
      },
      error =>
      {
        this._generalService.sendUpdate('CDCOutStationOneWayTripRateAll:CDCOutStationOneWayTripRateView:Failure');//To Send Updates
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
          this._generalService.sendUpdate('CDCOutStationOneWayTripRateUpdate:CDCOutStationOneWayTripRateView:Success');//To Send Updates  
          this.saveDisabled = true;
        } 
      },
      error =>
      {
        this._generalService.sendUpdate('CDCOutStationOneWayTripRateAll:CDCOutStationOneWayTripRateView:Failure');//To Send Updates  
        this.saveDisabled = true;
      }
    )
  }

  public Duplicate(): void
  {
    this.advanceTableForm.patchValue({customerContractID:this.advanceTable.customerContractID});
    this.advanceTableForm.patchValue({customerContractCarCategoryID:this.customerContractCarCategoryID || this.advanceTable.customerContractCarCategoryID});
    this.advanceTableForm.patchValue({customerContractCityTiersID:this.customerContractCityTiersID || this.advanceTable.customerContractCityTiersID});
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
        this._generalService.sendUpdate('CDCOutStationOneWayTripRateUpdate:CDCOutStationOneWayTripRateView:Success');//To Send Updates 
        this.saveDisabled = true; 
      }
    },
    error =>
    {
     this._generalService.sendUpdate('CDCOutStationOneWayTripRateAll:CDCOutStationOneWayTripRateView:Failure');//To Send Updates  
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
        nightCharge: '',
        nightChargeForSupplier: 0,
        graceMinutesForNightCharge: '',
        graceMinutesNightChargeAmount: ''
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


