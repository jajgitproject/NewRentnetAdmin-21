// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { SupplierContractCDCLongTermRentalService } from '../../supplierContractCDCLongTermRental.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { SupplierContractCDCLongTermRental } from '../../supplierContractCDCLongTermRental.model';
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

export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: SupplierContractCDCLongTermRental;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  isLoading: boolean = false;
  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  filteredCityTierOptions: Observable<CityTierDropDown[]>;
  filteredPackageOptions: Observable<PackageDropDown[]>;
  searchVehicleCategory: FormControl = new FormControl();

  searchCityTier: FormControl = new FormControl();

  searchPackage: FormControl = new FormControl();
  public PackageList?: PackageDropDown[] = [];
  public CityTierList?: CityTierDropDown[] = [];

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
    public advanceTableService: SupplierContractCDCLongTermRentalService,
    private fb: FormBuilder,
    private el: ElementRef,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Chauffeur Driven Car Long Term Rental Package';
      this.advanceTable = data.advanceTable;
      this.searchVehicleCategory.setValue(this.advanceTable.vehicleCategory);
      this.searchCityTier.setValue(this.advanceTable.cityTier);
      this.searchPackage.setValue(this.advanceTable.package);
    } else {
      this.dialogTitle = 'Chauffeur Driven Car Long Term Rental Package';
      this.advanceTable = new SupplierContractCDCLongTermRental({});
      this.advanceTable.activationStatus = true;
    }
    this.advanceTableForm = this.createContactForm();
    this.applicableFrom = data.ApplicableFrom;
    this.applicableTo = data.ApplicableTo;
    this.supplierContractName = data.SupplierContractName;
    this.supplierRateCardName = data.SupplierRateCardName;
  }
  public ngOnInit(): void {
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

  //----------- Vehicle Category Validation --------------
  vehicleCategoryValidator(VehicleCategoryList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleCategoryList.some(employee => employee.vehicleCategory.toLowerCase() === value);
      return match ? null : { vehicleCategoryInvalid: true };
    };
  }

  InitVehicleCategory() {
    this._generalService.GetVehicleCategories().subscribe(
      data => {
        this.VehicleCategoryList = data;
        this.advanceTableForm.controls['vehicleCategory'].setValidators([Validators.required,
        this.vehicleCategoryValidator(this.VehicleCategoryList)]);
        this.advanceTableForm.controls['vehicleCategory'].updateValueAndValidity();
        this.filteredVehicleCategoryOptions = this.advanceTableForm.controls['vehicleCategory'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.VehicleCategoryList.filter(
      customer => {
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
    this.vehicleCategoryID = vehicleCategoryID;
  }

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

  //----------- City Tier Validation --------------
  cityTierValidator(CityTierList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityTierList.some(employee => employee.cityTierName.toLowerCase() === value);
      return match ? null : { cityTierInvalid: true };
    };
  }

  InitCityTier() {
    this._generalService.GetCityTiers().subscribe(
      data => {
        this.CityTierList = data;
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
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.CityTierList.filter(
      customer => {
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
    this.cityTierID = cityTierID;
  }

  //----------- Package Validation --------------
  packageValidator(PackageList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = PackageList.some(employee => employee.package.toLowerCase() === value);
      return match ? null : { packageInvalid: true };
    };
  }

  InitPackage() {
    this._generalService.GetPackages().subscribe(
      data => {
        this.PackageList = data;
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
      customer => {
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
    this.packageID = packageID;
  }

  formControl = new FormControl('',
    [
      Validators.required
      // Validators.email,
    ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  createContactForm(): FormGroup {
    console.log(this.advanceTable)
    return this.fb.group(
      {
        supplierContractCDCLongTermRentalID: [this.advanceTable.supplierContractCDCLongTermRentalID],
        supplierContractID: [this.advanceTable.supplierContractID],
        vehicleCategoryID: [this.advanceTable.vehicleCategoryID],
        cityTierID: [this.advanceTable.cityTierID],
        packageID: [this.advanceTable.packageID],
        cityTier: [this.advanceTable.cityTier],
        package: [this.advanceTable.package],
        vehicleCategory: [this.advanceTable.vehicleCategory],
        billFromTo: [this.advanceTable.billFromTo],
        dailyKMs: [this.advanceTable.dailyKMs],
        dailyGraceMinutes: [this.advanceTable.dailyGraceMinutes],
        dailyGraceKms: [this.advanceTable.dailyGraceKms],
        dailyBaseRate: [this.advanceTable.dailyBaseRate],
        totalDays: [this.advanceTable.totalDays],
        totalDaysHours: [this.advanceTable.totalDaysHours],
        totalDaysGraceKms: [this.advanceTable.totalDaysGraceKms],
        totalDaysBaseRate: [this.advanceTable.totalDaysBaseRate],
        fkmP2P: [this.advanceTable.fkmP2P],
        fixedP2PAmount: [this.advanceTable.fixedP2PAmount],
        tollChargeable: [this.advanceTable.tollChargeable],
        parkingChargeable: [this.advanceTable.parkingChargeable],
        interStateTaxChargeable: [this.advanceTable.interStateTaxChargeable],
        driverAllowance: [this.advanceTable.driverAllowance],
        activationStatus: [this.advanceTable.activationStatus],
        extraKMRate: [this.advanceTable.extraKMRate],
        extraHRRate: [this.advanceTable.extraHRRate],
        nightChargeable: [this.advanceTable.nightChargeable],
        nightChargesStartTime: [this.advanceTable.nightChargesStartTime],
        nightChargesEndTime: [this.advanceTable.nightChargesEndTime],
        nightCharge: [this.advanceTable.nightCharge],
        graceMinutesForNightCharge: [this.advanceTable.graceMinutesForNightCharge],
        graceMinutesNightCharge: [this.advanceTable.graceMinutesNightCharge],
        totalDaysKMs: [this.advanceTable.totalDaysKMs],
        totalDaysGraceMinutes: [this.advanceTable.totalDaysGraceMinutes],
        dailyHours: [this.advanceTable.dailyHours],
        billingCriteria: [this.advanceTable.billingCriteria],
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

  submit() {
    // emppty stuff
  }
  reset(): void {
    this.advanceTableForm.reset();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public Post(): void {
    this.isLoading = true;
    this.advanceTableForm.patchValue({ supplierContractID: this.data.SupplierContractID });
    this.advanceTableForm.patchValue({ vehicleCategoryID: this.vehicleCategoryID });
    this.advanceTableForm.patchValue({ cityTierID: this.cityTierID });
    this.advanceTableForm.patchValue({ packageID: this.packageID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false;
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierContractCDCLongTermRentalCreate:SupplierContractCDCLongTermRentalView:Success');//To Send Updates  

        },
        error => {
          this.isLoading = false;
          this._generalService.sendUpdate('SupplierContractCDCLongTermRentalAll:SupplierContractCDCLongTermRentalView:Failure');//To Send Updates  
        }
      )
  }
  public Put(): void {
    this.isLoading = true;
    this.advanceTableForm.patchValue({ supplierContractID: this.advanceTable.supplierContractID });
    this.advanceTableForm.patchValue({ vehicleCategoryID: this.vehicleCategoryID || this.advanceTable.vehicleCategoryID });
    this.advanceTableForm.patchValue({ cityTierID: this.cityTierID || this.advanceTable.cityTierID });
    this.advanceTableForm.patchValue({ packageID: this.packageID || this.advanceTable.packageID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false;
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierContractCDCLongTermRentalUpdate:SupplierContractCDCLongTermRentalView:Success');//To Send Updates  

        },
        error => {
          this.isLoading = false;
          this._generalService.sendUpdate('SupplierContractCDCLongTermRentalAll:SupplierContractCDCLongTermRentalView:Failure');//To Send Updates  
        }
      )
  }
  public confirmAdd(): void {
    if (this.action == "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";

  public uploadFinished = (event) => {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({ image: this.ImagePath })
  }

}


