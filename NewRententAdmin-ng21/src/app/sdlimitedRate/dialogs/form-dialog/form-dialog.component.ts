// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { SDLimitedRateService } from '../../sdlimitedRate.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { SDLimitedRate } from '../../sdlimitedRate.model';
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
import { CustomerContractCityTiers } from 'src/app/customerContractCityTiers/customerContractCityTiers.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomerContractCityTiersDropDown } from 'src/app/customerContractCDCLocalRate/customerContractCityTiersDropDown.model';

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
  advanceTable: SDLimitedRate;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  CustomerContractID!: number;
  CustomerContractName!: string;
  //public VehicleCategoryList?: CustomerContractCarCategoryDropDown[] = [];
  //public PackageList?: PackageDropDown[] = [];
 // public CityTierList?: CustomerContractCityTiers[] = [];

  public VehicleCategoryList?: CustomerContractCarCategoryDropDown[] = [];
  filteredCategoryOptions: Observable<CustomerContractCarCategoryDropDown[]>;
  searchCategoryBy: FormControl = new FormControl();

  public PackageList?: PackageDropDown[] = [];
  
  filteredPackageOptions: Observable<PackageDropDown[]>;
  searchPackageBy: FormControl = new FormControl();

  filteredTierOptions: Observable<CustomerContractCityTiersDropDown[]>;
  searchTierBy: FormControl = new FormControl();

  public CityTierList?: CustomerContractCityTiersDropDown[] = [];
  image: any;
  fileUploadEl: any;
  applicableFrom: any;
  applicableTo: any;
  supplierContractName: any;
  supplierRateCardName: any;
  CustomerContractValidFrom: any;
  CustomerContractValidTo: any;

  customerContractCityTiersID: any;
  customerContractCarCategoryID: any;
  packageID: any;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SDLimitedRateService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
    this.CustomerContractID= data.customerContractID,
        this.CustomerContractName =data.customerContractName,
        this.CustomerContractValidFrom=data.customerContractValidFrom,
        this.CustomerContractValidTo=data.customerContractValidTo,
        this.supplierRateCardName=data.SupplierRateCardName;
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Self Driven Car Limited Package'	;       
          this.advanceTable = data.advanceTable;

          this.searchCategoryBy.setValue(this.advanceTable.customerContractCarCategory)
          this.searchTierBy.setValue(this.advanceTable.customerContractCityTier)
          this.searchPackageBy.setValue(this.advanceTable.package)

        } else 
        {
          this.dialogTitle = 'Self Driven Car Limited Package	';
          this.advanceTable = new SDLimitedRate({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        // this.applicableFrom=data.ApplicableFrom;
        // this.applicableTo=data.ApplicableTo;
        // this.supplierContractName=data.SupplierContractName;
        // this.supplierRateCardName=data.SupplierRateCardName;
  }
  public ngOnInit(): void
  {
    this.InitVehicleCategory();
    this.InitPackage();
    this.InitCityTier();
  }

  InitVehicleCategory(){
    this._generalService.GetCarCategory(this.data.customerContractID).subscribe(
      data=>{
        this.VehicleCategoryList=data;
        this.advanceTableForm.controls['customerContractCarCategory'].setValidators([Validators.required,
          this.vehicleCategoryValidator(this.VehicleCategoryList)
        ]);
        this.advanceTableForm.controls['customerContractCarCategory'].updateValueAndValidity();
        this.filteredCategoryOptions = this.advanceTableForm.controls['customerContractCarCategory'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCategory(value || ''))
        ); 

      }
    )
  }
  private _filterCategory(value: string): any {

    const filterValue = value.toLowerCase();
    return this.VehicleCategoryList.filter(
      customer => 
      {
        return customer.customerContractCarCategory.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  getTitles(customerContractCarCategoryID: any) {
    this.customerContractCarCategoryID=customerContractCarCategoryID;
  }
  
  getPackage(packageID: any) {
    this.packageID=packageID;
  }
  InitCityTier(){
    this._generalService.GetCCCityTiersForCD(this.data.customerContractID).subscribe(
      data=>{
        this.CityTierList = data;
        this.advanceTableForm.controls['customerContractCityTier'].setValidators([Validators.required,
          this.cityTierValidator(this.CityTierList)
        ]);
        this.advanceTableForm.controls['customerContractCityTier'].updateValueAndValidity();
        this.filteredTierOptions = this.advanceTableForm.controls['customerContractCityTier'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterTier(value || ''))
        );  
      }
    );
  }
  
  getcityTierID(customerContractCityTiersID: any) {
    this.customerContractCityTiersID=customerContractCityTiersID;
  }

  InitPackage(){
    this._generalService.GetPackages().subscribe(
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
    return this.PackageList.filter(
      customer => 
      {
        return customer.package.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  getpackageID(packageID: any) {
    this.packageID=packageID;
  }
  private _filterTier(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CityTierList.filter(
      customer => 
      {
        return customer.customerContractCityTier.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  getTierTitles(customerContractCityTiersID: any) {
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
      sdLimitedRateID: [this.advanceTable.sdLimitedRateID],
      customerContractID: [this.advanceTable.customerContractID],
      customerContractCarCategoryID: [this.advanceTable.customerContractCarCategoryID],
      customerContractCityTiersID: [this.advanceTable.customerContractCityTiersID],
      packageID: [this.advanceTable.packageID],
      billFromTo: [this.advanceTable.billFromTo],
      minimumDays: [this.advanceTable.minimumDays],
      freeKMPerday: [this.advanceTable.freeKMPerday],
      packageRate: [this.advanceTable.packageRate],
      extraPerdayRate: [this.advanceTable.extraPerdayRate],
      extraHourRate: [this.advanceTable.extraHourRate],
      extraKMRate: [this.advanceTable.extraKMRate],
      deliveryCharges:[this.advanceTable.deliveryCharges],
      deliveryChargesAtNight:[this.advanceTable.deliveryChargesAtNight],
      pickupCharges: [this.advanceTable.pickupCharges],
      pickupChargesAtNight: [this.advanceTable.pickupChargesAtNight],
      nextDayCharging:[this.advanceTable.nextDayCharging],
      graceKMs:[this.advanceTable.graceKMs],
      graceHours:[this.advanceTable.graceHours],
      securityDepositAmount:[this.advanceTable.securityDepositAmount],
      package:[this.advanceTable.package],
      customerContractCarCategory:[this.advanceTable.customerContractCarCategory],
      customerContractCityTier:[this.advanceTable.customerContractCityTier],
      nightChargeStartTime:[this.advanceTable.nightChargeStartTime],
      nightChargeEndTime:[this.advanceTable.nightChargeEndTime],  
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
    this.advanceTableForm.patchValue({ customerContractID:this.data.customerContractID });
    this.advanceTableForm.patchValue({customerContractCarCategoryID:this.customerContractCarCategoryID});
    this.advanceTableForm.patchValue({customerContractCityTiersID:this.customerContractCityTiersID});
    this.advanceTableForm.patchValue({packageID:this.packageID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('SDLimitedRateCreate:SDLimitedRateView:Success');//To Send Updates  
    
    },
    error =>
    {
       this._generalService.sendUpdate('SDLimitedRateAll:SDLimitedRateView:Failure');//To Send Updates  
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
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('SDLimitedRateUpdate:SDLimitedRateView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('SDLimitedRateAll:SDLimitedRateView:Failure');//To Send Updates  
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
}


