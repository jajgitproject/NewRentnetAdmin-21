// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { SupplierContractCDCOutStationRoundTripService } from '../../supplierContractCDCOutStationRoundTrip.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { SupplierContractCDCOutStationRoundTrip } from '../../supplierContractCDCOutStationRoundTrip.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerDropDown } from '../../customerDropDown.model';
import { VehicleCategoryDropDown } from 'src/app/vehicleCategory/vehicleCategoryDropDown.model';
import { CityTierDropDown } from 'src/app/cityTier/cityTierDropDown.model';
import { PackageDropDown } from 'src/app/package/packageDropDown.model';
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
  advanceTable: SupplierContractCDCOutStationRoundTrip;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  isLoading: boolean = false;

   public CustomerList?: CustomerDropDown[] = [];
   public VehicleList?: VehicleCategoryDropDown[] = [];
   public CityTierList?: CityTierDropDown[] = [];
   public PackageList?: PackageDropDown[] = [];
   filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  SearchVehicleCategory: FormControl = new FormControl();
  filteredCityTierOptions: Observable<CityTierDropDown[]>;
  SearchCityTier: FormControl = new FormControl();
  filteredPackageOptions: Observable<PackageDropDown[]>;
  SearchPackage: FormControl = new FormControl();

  image: any;
  fileUploadEl: any;
  applicableFrom: any;
  applicableTo: any;
  supplierContractName: any;
  supplierRateCardName: any;
  vehicleCategoryID: any;
  cityTierID: any;
  packageID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SupplierContractCDCOutStationRoundTripService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Chauffeur Driven Car Outstation Round Trip Package';       
          this.advanceTable = data.advanceTable;
          // this.SearchVehicleCategory.setValue(this.advanceTable.vehicleCategory);
          // this.SearchCityTier.setValue(this.advanceTable.cityTierName);
          //  this.SearchPackage.setValue(this.advanceTable.package);

        } else 
        {
          this.dialogTitle = 'Chauffeur Driven Car Outstation Round Trip Package';
          this.advanceTable = new SupplierContractCDCOutStationRoundTrip({});
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
    //this.InitCustomer();
    this.InitVehicleCategory();
    this.InitCityTier();
    this.InitPackage();
  }

  // InitCustomer(){
  //   this._generalService.GetCustomers().subscribe(
  //     data=>{
  //       this.CustomerList=data;
  //     }
  //   )
  // }

  // initVehicle(){
  //   this._generalService.GetVehicleCategories().subscribe(
  //     data=>{
  //       this.VehicleList=data;
  //     }
  //   )
  // }

  // initCityTier(){
  //   this._generalService.getCityTier().subscribe(
  //     data=>{
  //       this.CityTierList=data;
  //     }
  //   )
  //   console.log(this.CityTierList);
  // }

  // initPackage(){
  //   this._generalService.getPackage().subscribe(
  //     data=>{
  //       this.PackageList=data;
  //     }
  //   )
  //   console.log(this.PackageList);
  // }

  //----------- Vehicle Category Validation --------------
  vehicleCategoryValidator(VehicleList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleList.some(employee => employee.vehicleCategory.toLowerCase() === value);
      return match ? null : { vehicleCategoryInvalid: true };
    };
  }
  
  InitVehicleCategory(){
    this._generalService.GetVehicleCategories().subscribe(
      data=>
      {
        this.VehicleList=data;
        this.advanceTableForm.controls['vehicleCategory'].setValidators([Validators.required,
          this.vehicleCategoryValidator(this.VehicleList)]);
        this.advanceTableForm.controls['vehicleCategory'].updateValueAndValidity();
        this.filteredVehicleCategoryOptions = this.advanceTableForm.controls['vehicleCategory'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.VehicleList.filter(
      customer => 
      {
        return customer.vehicleCategory.toLowerCase().includes(filterValue);
      }
    );
  }

  onVehicleCategorySelected(selectedVehicleCategory: string) {
    const selectedValue = this.VehicleList.find(
      data => data.vehicleCategory === selectedVehicleCategory
    );
  
    if (selectedValue) {
      this.getTitles(selectedValue.vehicleCategoryID);
    }
  }

  getTitles(vehicleCategoryID: any) 
  {
    this.vehicleCategoryID=vehicleCategoryID;
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
        this.advanceTableForm.controls['cityTierName'].setValidators([Validators.required,
          this.cityTierValidator(this.CityTierList)]);
        this.advanceTableForm.controls['cityTierName'].updateValueAndValidity();
        this.filteredCityTierOptions = this.advanceTableForm.controls['cityTierName'].valueChanges.pipe(
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

  getcityTierID(cityTierID: any) 
  {
    this.cityTierID=cityTierID;
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
      supplierContractCDCOutStationRoundTripID: [this.advanceTable.supplierContractCDCOutStationRoundTripID],
       supplierContractID: [this.advanceTable.supplierContractID],
      vehicleCategoryID: [this.advanceTable.vehicleCategoryID],
      cityTierID: [this.advanceTable.cityTierID],
      packageID: [this.advanceTable.packageID],
      vehicleCategory: [this.advanceTable.vehicleCategory],
      cityTierName: [this.advanceTable.cityTierName],
      package: [this.advanceTable.package],
      billFromTo: [this.advanceTable.billFromTo],
      minimumKMsPerDay: [this.advanceTable.minimumKMsPerDay],
      ratePerDay: [this.advanceTable.ratePerDay],
      graceMinutes: [this.advanceTable.graceMinutes],
      extraKMRate: [this.advanceTable.extraKMRate],
      nextDayCharging: [this.advanceTable.nextDayCharging],
      graceMinutesForNextDay: [this.advanceTable.graceMinutesForNextDay],
      graceMinutesForNextDayCharges: [this.advanceTable.graceMinutesForNextDayCharges],
      tollChargeable: [this.advanceTable.tollChargeable],
      parkingChargeable: [this.advanceTable.parkingChargeable],
      interStateTaxChargeable: [this.advanceTable.interStateTaxChargeable],
      nightChargeable: [this.advanceTable.nightChargeable],
      nightChargeStartTime: [this.advanceTable.nightChargeStartTime],
      nightChargeEndTime: [this.advanceTable.nightChargeEndTime],
      nightCharge: [this.advanceTable.nightCharge],
      graceMinutesForNightCharge: [this.advanceTable.graceMinutesForNightCharge],
      graceMinutesNightCharge: [this.advanceTable.graceMinutesNightCharge],
      driverAllowance: [this.advanceTable.driverAllowance],
      activationStatus: [this.advanceTable.activationStatus]
    });
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
    const parsedTime = new Date(`1970-01-01T${inputValue}`);  
    // Check if the parsedTime is valid
    if (!isNaN(parsedTime.getTime())) {
        this.advanceTableForm.get('nightChargeEndTime').setValue(parsedTime);
    }
  }

  public noWhitespaceValidator(control: FormControl) {
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
       this._generalService.sendUpdate('SupplierContractCDCOutStationRoundTripCreate:SupplierContractCDCOutStationRoundTripView:Success');//To Send Updates  
    
    },
    error =>
    {
      this.isLoading = false;
       this._generalService.sendUpdate('SupplierContractCDCOutStationRoundTripAll:SupplierContractCDCOutStationRoundTripView:Failure');//To Send Updates  
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
       this._generalService.sendUpdate('SupplierContractCDCOutStationRoundTripUpdate:SupplierContractCDCOutStationRoundTripView:Success');//To Send Updates  
       
    },
    error =>
    {
      this.isLoading = false;
     this._generalService.sendUpdate('SupplierContractCDCOutStationRoundTripAll:SupplierContractCDCOutStationRoundTripView:Failure');//To Send Updates  
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
  
  keyPressNumbersDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
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

  // public fileChanged(event?: UIEvent): void {
  //   const files: FileList = this.fileUploadEl.nativeElement.files;
  //   console.log(`files: `, files);

  //   const file = files[0];
  //   const reader = new FileReader();
  //   const loaded = (el) => {
  //     const contents = el.target.result;
  //     console.log('onloaded', contents);
  //     this.contents = contents;
  //   }
  //   reader.onload = loaded;
  //   reader.readAsText(file, 'UTF-8');
  //   this.name = file.name;
  // }

  // onSelectFile(event) {
  //   const files = event.target.files;
  //   if (files) {
  //     for (const file of files) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         if (file.type.indexOf('image') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'img',
  //           });
  //         } else if (file.type.indexOf('video') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'video',
  //           });
  //         } else if (file.type.indexOf('pdf') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'pdf',
  //           });
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }

/////////////////for Image Upload ends////////////////////////////

// Only Numbers with Decimals
// keyPressNumbersDecimal(event) {
//   var charCode = (event.which) ? event.which : event.keyCode;
//   if (charCode != 46 && charCode > 31
//     && (charCode < 48 || charCode > 57)) {
//     event.preventDefault();
//     return false;
//   }
//   return true;
// }

// Only AlphaNumeric
// keyPressAlphaNumeric(event) {

//   var inp = String.fromCharCode(event.keyCode);

//   if (/[a-zA-Z]/.supplierContractCDCOutStationRoundTrip(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}


