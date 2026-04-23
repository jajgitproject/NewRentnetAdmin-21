// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { SupplierContractSDCSelfDriveLimitedService } from '../../supplierContractSDCSelfDriveLimited.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { SupplierContractSDCSelfDriveLimited } from '../../supplierContractSDCSelfDriveLimited.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
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

export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: SupplierContractSDCSelfDriveLimited;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  isLoading: boolean = false;

  public VehicleList?: VehicleCategoryDropDown[] = [];
  public CityTierList?: CityTierDropDown[] = [];
  public PackageList?: PackageDropDown[] = [];
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
  cityTierID: any;
  packageID: any;
  vehicleCategoryID: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: SupplierContractSDCSelfDriveLimitedService,
    private fb: FormBuilder,
    private el: ElementRef,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Self Driven Car Limited KM Package';
      this.advanceTable = data.advanceTable;
      this.searchVehicleCategory.setValue(this.advanceTable.vehicleCategory);
      this.searchCityTier.setValue(this.advanceTable.cityTierName);
      this.searchPackage.setValue(this.advanceTable.package);

    } else {
      this.dialogTitle = 'Self Driven Car Limited KM Package';
      this.advanceTable = new SupplierContractSDCSelfDriveLimited({});
      this.advanceTable.activationStatus = true;
    }
    this.advanceTableForm = this.createContactForm();
    this.applicableFrom = data.ApplicableFrom;
    this.applicableTo = data.ApplicableTo;
    this.supplierContractName = data.SupplierContractName;
    this.supplierRateCardName = data.SupplierRateCardName;
  }
  public ngOnInit(): void {
    this.initVehicle();
    this.InitCityTier();
    this.InitPackage();
  }

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

  // }

  // initPackage(){
  //   this._generalService.getPackage().subscribe(
  //     data=>{
  //       this.PackageList=data;
  //     }
  //   )
  // }


  //----------- Vehicle Category Validation --------------
  vehicleCategoryValidator(VehicleList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleList.some(employee => employee.vehicleCategory.toLowerCase() === value);
      return match ? null : { vehicleCategoryInvalid: true };
    };
  }


  initVehicle() {
    this._generalService.GetVehicleCategories().subscribe(
      data => {
        this.VehicleList = data;
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
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.VehicleList.filter(
      customer => {
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

  getTitles(vehicleCategoryID: any) {
    //debugger;
    this.vehicleCategoryID = vehicleCategoryID;
  }

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
    //debugger;
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
    //debugger;
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
    return this.fb.group(
      {
        supplierContractSDCSelfDriveLimitedID: [this.advanceTable.supplierContractSDCSelfDriveLimitedID],
        supplierContractID: [this.advanceTable.supplierContractID],
        vehicleCategoryID: [this.advanceTable.vehicleCategoryID],
        cityTierID: [this.advanceTable.cityTierID],
        packageID: [this.advanceTable.packageID],
        vehicleCategory: [this.advanceTable.vehicleCategory],
        cityTierName: [this.advanceTable.cityTierName],
        package: [this.advanceTable.package],
        billFromTo: [this.advanceTable.billFromTo],
        graceKMs: [this.advanceTable.graceKMs],
        freeKMPerday: [this.advanceTable.freeKMPerday],
        extraKMRate: [this.advanceTable.extraKMRate],
        nextDayCriteria: [this.advanceTable.nextDayCriteria],
        deliveryChargeable: [this.advanceTable.deliveryChargeable],
        deliveryCharges: [this.advanceTable.deliveryCharges],
        pickupChargeable: [this.advanceTable.pickupChargeable],
        baseRate: [this.advanceTable.baseRate],
        pickupCharges: [this.advanceTable.pickupCharges],
        minimumDays: [this.advanceTable.minimumDays],
        extraHRRate: [this.advanceTable.extraHRRate],
        extraPerdayRate: [this.advanceTable.extraPerdayRate],
        securityDepositAmount: [this.advanceTable.securityDepositAmount],
        graceMinutesForNightCharge: [this.advanceTable.graceMinutesForNightCharge],
        graceMinutesNightCharge: [this.advanceTable.graceMinutesNightCharge],
        deliveryChargesAtNight: [this.advanceTable.deliveryChargesAtNight],
        pickupChargesAtNight: [this.advanceTable.pickupChargesAtNight],
        nightChargeStartTime: [this.advanceTable.nightChargeStartTime],
        nightChargeEndTime: [this.advanceTable.nightChargeEndTime],
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

    // Attempt to parse the input as a valid time
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
          this._generalService.sendUpdate('SupplierContractSDCSelfDriveLimitedCreate:SupplierContractSDCSelfDriveLimitedView:Success');//To Send Updates  

        },
        error => {
          this.isLoading = false;
          this._generalService.sendUpdate('SupplierContractSDCSelfDriveLimitedAll:SupplierContractSDCSelfDriveLimitedView:Failure');//To Send Updates  
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
          this._generalService.sendUpdate('SupplierContractSDCSelfDriveLimitedUpdate:SupplierContractSDCSelfDriveLimitedView:Success');//To Send Updates  

        },
        error => {
          this.isLoading = false;
          this._generalService.sendUpdate('SupplierContractSDCSelfDriveLimitedAll:SupplierContractSDCSelfDriveLimitedView:Failure');//To Send Updates  
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

  keyPressNumbersDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";

  public uploadFinished = (event) => {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({ image: this.ImagePath })
  }

  // public fileChanged(event?: UIEvent): void {
  //   const files: FileList = this.fileUploadEl.nativeElement.files;

  //   const file = files[0];
  //   const reader = new FileReader();
  //   const loaded = (el) => {
  //     const contents = el.target.result;
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

  //   if (/[a-zA-Z]/.supplierContractSDCSelfDriveLimited(inp)) {
  //     return true;
  //   } else {
  //     event.preventDefault();
  //     return false;
  //   }
  // }

}


