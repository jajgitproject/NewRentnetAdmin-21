// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { Address } from '@compat/google-places-shim-objects/address';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { AllCitiesDropDown } from 'src/app/customerPersonDrivingLicense/allCitiesDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, } from '@angular/forms';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { SupplierDropDown } from 'src/app/supplier/supplierDropDown.model';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntityMessage/organizationalEntityDropDown.model';
import { DriverGradeDropDown } from 'src/app/driverGrade/driverGradeDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CountryCodeDropDown } from 'src/app/general/countryCodeDropDown.model';
import { ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';
import { AdhocCarAndDriver } from '../../adhocCarAndDriver.model';
import { AdhocCarAndDriverService } from '../../adhocCarAndDriver.service';
import { DriverDropDown } from 'src/app/customerPersonDriverRestriction/driverDropDown.model';
import { VehicleCategoryDropDown } from 'src/app/general/vehicleCategoryDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { RegistrationDropDown } from 'src/app/interstateTaxEntry/registrationDropDown.model';
import { DatePipe } from '@angular/common';
import { SupplierTypeDropDownModel } from 'src/app/supplierType/supplierType.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckbox } from '@angular/material/checkbox';
import Swal from 'sweetalert2';

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
  isHidden: boolean = true;
  advanceTableForm: FormGroup;
  advanceTable: AdhocCarAndDriver;
  image: any;
  fileUploadEl: any;
  searchLACity: FormControl = new FormControl();
  searchPACity: FormControl = new FormControl();
  searchSupplier: FormControl = new FormControl();
  searchHub: FormControl = new FormControl();
  searchLocation: FormControl = new FormControl();
  // isVendorExisting: boolean = false;
  // isDriverExisting:boolean = false;
  // isCarExisting:boolean = false;
  allExisting: boolean = false;
  copydetails: boolean = false;
  public formGroup: FormGroup;
  public SupplierList?: SupplierDropDown[] = [];
  filteredSupplierOptions: Observable<SupplierDropDown[]>;

  public DriverList?: DriverDropDown[] = [];
  filteredDriverOptions: Observable<DriverDropDown[]>;

  filteredCountryCodesOptions: Observable<CountryCodeDropDown[]>;
  public CountryCodeList?: CountryCodeDropDown[] = [];
  filteredCountryCodeOptions: Observable<CountryCodeDropDown[]>;
  public CountryCodesList?: CountryCodeDropDown[] = [];
  public SupplierForOwnershipList?: SupplierDropDown[] = [];
  public StateLists?: StateDropDown[] = [];
  filteredStateOptions: Observable<StateDropDown[]>;
  searchStateTerm: FormControl = new FormControl();
  searchQualification: FormControl = new FormControl();
  options: any = {
    componentRestrictions: { country: 'IN' }
  }

  filteredCompanyOptions: Observable<OrganizationalEntityDropDown[]>;
  public CompanyList?: OrganizationalEntityDropDown[] = [];
  //public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  VehicleCategoryList: any;
  public VehicleList?: VehicleDropDown[] = [];
  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  public RegistrationNumberList?: VehicleDropDown[] = [];
  filteredRegistrationNumberOptions: Observable<VehicleDropDown[]>;
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  public SupplierTypeList?: SupplierTypeDropDownModel[] = [];
  filteredSupplierTypeOptions: Observable<SupplierTypeDropDownModel[]>;
  supplierType: string;
  localAddressString: string;
  localAddressGeoPointID: any;
  permanentGeoPointID: any;
  supplierID: any;
  hubID: any;
  locationID: any;
  driverGradeID: any;
  geoPointRTOID: any;
  highestQualificationID: any;
  owned: boolean = false;
  supplier: boolean = true;
  referenceID: number;
  type: string = "Driver";
  pass: any;
  public showPassword: boolean;
  public showConfirmPassword: boolean;
  companyID: any;
  driverID: any;
  inventoryID:any;
  vehicle: any;
  vehicleCategoryID: number;
  vehicleID: any;
  registrationNumber: any;
  reservationID: any;
  RegistrationNo: any;
  ownedSupplier: boolean = false;
  public LocationNameList?: OrganizationalEntityDropDown[] = [];
  filteredLocationNameOptions: Observable<OrganizationalEntityDropDown[]>;
  LocationID: any;
  @ViewChild('copyCheckBox') copyCheckBox!: MatCheckbox;
  supplierName: string;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: AdhocCarAndDriverService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private el: ElementRef,

    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    //console.log(this.data)
    this.advanceTable = data;
    if (this.action === 'edit') {
      this.dialogTitle = 'Adhoc Car And Driver';
      this.advanceTable = data.advanceTable;
      this.referenceID = this.advanceTable.driverID;
      this.searchSupplier.setValue(this.advanceTable.supplierName);
      this.searchStateTerm.setValue(this.advanceTable.rtoState);
      //     if (this.advanceTable.driverPhone) {
      //       const mobileParts = this.advanceTable.driverPhone.split('-');
      //       const countryCodes = '+'+''+mobileParts[0];
      //       this.advanceTable.countryCodes=countryCodes;
      //       const driverPhone = mobileParts[1];
      //       this.advanceTable.driverPhone=driverPhone;
      //   }
      //   if (this.advanceTable.supplierPhone) {
      //     const mobileParts = this.advanceTable.supplierPhone.split('-');
      //     const countryCode = '+'+''+mobileParts[0];
      //     this.advanceTable.countryCode=countryCode;
      //     const supplierPhone = mobileParts[1];
      //     this.advanceTable.supplierPhone=supplierPhone;
      // }


      this.advanceTableForm = this.createContactForm();

    }
    else {
      this.dialogTitle = 'Adhoc Car And Driver';
      this.advanceTable = new AdhocCarAndDriver({});
      this.advanceTable.activationStatus = true;
      this.advanceTable.isVendorExisting = 'Existing';
      this.advanceTable.driverOfficialIdentityNumber = 'N/A';
      this.advanceTable.aadharAuthenticationToken = 'N/A';
      this.locationID = data.reservationInfo.transferedLocationID;
      this.reservationID = data.reservationInfo.reservationID;
      this.advanceTableForm = this.createContactForm();
      this.advanceTableForm.valueChanges.subscribe(values => {
      });

    }
  }
  public ngOnInit(): void {
    // this.InitLocation();
    this.InitState();
    this.InitSupplier();
    // this.InitDriver();
    // this.initVehicleCategories();
    this.initVehicle();
    // this.initRegistrationNumber();
    this.InitCompany();
    //this.InitSupplierType();
    this.InitCountryISDCodes();
    this.InitCountryISDCode();
    this.advanceTableForm = this.createContactForm();

    this.advanceTableForm.valueChanges.subscribe(values => {
    });
  }


  InitCompany() {
    this._generalService.GetCompany().subscribe(
      data => {
        this.CompanyList = data;
        this.filteredCompanyOptions = this.advanceTableForm.controls['companyName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCompany(value || ''))
        );
      }
    )
  }
  private _filterCompany(value: string): any {
    const filterValue = value.toLowerCase();
    // if(filterValue.length === 0) {
    //   return [];
    // }
    return this.CompanyList.filter(
      customer => {
        return customer.organizationalEntityName.toLowerCase().includes(filterValue);
      });
  }
  OnCompanySelect(selectedCompany: string) {
    const CompanyName = this.CompanyList.find(
      data => data.organizationalEntityName === selectedCompany
    );
    if (selectedCompany) {
      this.getCompanyID(CompanyName.organizationalEntityID);
    }
  }
  getCompanyID(companyID: any) {
    this.companyID = companyID;
    this.advanceTableForm.patchValue({ companyID: this.companyID });
  }

  InitCountryISDCode() {
    this._generalService.GetCountryCodes().subscribe
      (
        data => {
          this.CountryCodesList = data;
          this.advanceTableForm.controls['countryCode'].setValidators([Validators.required,
          this.countryTypeValidator(this.CountryCodesList)
          ]);
          this.advanceTableForm.controls['countryCode'].updateValueAndValidity();

          this.filteredCountryCodeOptions = this.advanceTableForm.controls['countryCode'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterCountryCode(value || ''))
          );
        }
      );
  }
  private _filterCountryCode(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CountryCodesList.filter(
      customer => {
        return customer.icon.toLowerCase().indexOf(filterValue) === 0 || customer.countryISOCode.toLowerCase().indexOf(filterValue) === 0 || customer.countryISDCode.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  onCountryCode(event: any): void {
    this.advanceTableForm.patchValue({ countryCodes: event.option.value });

  }

  onCountryCodes(event: any): void {
    this.advanceTableForm.patchValue({ countryCode: event.option.value });

  }

  countryTypeValidator(CountryCodesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CountryCodesList.some(group => group.countryISDCode?.toLowerCase() === value);
      return match ? null : { countryTypeInvalid: true };
    };
  }
  InitCountryISDCodes() {
    this._generalService.GetCountryCodes().subscribe
      (
        data => {
          this.CountryCodeList = data;
          this.advanceTableForm.controls['countryCodes'].setValidators([Validators.required,
          this.countryTypesValidator(this.CountryCodeList)
          ]);
          this.advanceTableForm.controls['countryCodes'].updateValueAndValidity();
          this.filteredCountryCodesOptions = this.advanceTableForm.controls['countryCodes'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterCountryCodes(value || ''))
          );
        }
      );
  }
  private _filterCountryCodes(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CountryCodeList.filter(
      customer => {
        return customer.icon.toLowerCase().indexOf(filterValue) === 0 || customer.countryISOCode.toLowerCase().indexOf(filterValue) === 0 || customer.countryISDCode.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  countryTypesValidator(CountryCodeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CountryCodeList.some(group => group.countryISDCode?.toLowerCase() === value);
      return match ? null : { countryTypesInvalid: true };
    };
  }

  //=============================Supplier========================

  InitSupplier() {
    this._generalService.GetAllSuppliers().subscribe(
      data => {
        this.SupplierList = data;
        this.advanceTableForm.controls['supplierName'].setValidators([
          Validators.required,
          this.supplierTypeValidator(this.SupplierList)
        ]);
        this.advanceTableForm.controls['supplierID'].setValidators([
          Validators.required,
          Validators.min(1)
        ]);
        this.advanceTableForm.controls['supplierName'].updateValueAndValidity();
        this.advanceTableForm.controls['supplierID'].updateValueAndValidity();
        this.filteredSupplierOptions = this.advanceTableForm.controls['supplierName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterSupplier(value || ''))
        );
        this.advanceTableForm.controls['supplierName'].valueChanges.subscribe(value => {
          const matchedSupplier = this.SupplierList.find(
            supplier => supplier.supplierName?.toLowerCase() === value?.toLowerCase()
          );
          if (!matchedSupplier) {
            this.supplierID = null;
            this.advanceTableForm.patchValue({ supplierID: null }, { emitEvent: false });
            this.advanceTableForm.controls['supplierID'].updateValueAndValidity({ emitEvent: false });
          }
        });
      });
  }

  supplierTypeValidator(SupplierList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const match = (SupplierList || []).some(
        supplier => supplier.supplierName?.toLowerCase() === value?.toLowerCase()
      );
      return match ? null : { supplierNameInvalid: true };
    };
  }

  private _filterSupplier(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length === 0) {
      return [];
    }
    return this.SupplierList.filter(
      customer => {
        return customer.supplierName.toLowerCase().includes(filterValue);
      });
  }
  OnSupplierSelect(selectedSupplier: string) {
    const SupplierName = this.SupplierList.find(
      data => data.supplierName?.toLowerCase() === selectedSupplier?.toLowerCase()
    );
    if (selectedSupplier && SupplierName) {
      this.getSupplierID(SupplierName.supplierID);
    }
    this.forceUppercase('supplierName');
  }
  getSupplierID(supplierID: any) {
    this.supplierID = supplierID;
    this.InitDriver();
    // this.initVehicleCategories();
    this.initRegistrationNumber();
    this.GetVendorDetails();
    this.advanceTableForm.patchValue({ supplierID: this.supplierID || this.advanceTable.supplierID });
  }


  //=================================Driver==========================

  // InitDriver(){
  //     this._generalService.GetDriver().subscribe(
  //       data=>
  //       {
  //         this.DriverList=data;
  //         // this.advanceTableForm.controls['driverName'].setValidators([Validators.required,
  //         //   this.driverTypeValidator(this.DriverList)
  //         // ]);
  //         // this.advanceTableForm.controls['driverName'].updateValueAndValidity();
  //         this.filteredDriverOptions =this.advanceTableForm.controls['driverName'].valueChanges.pipe(
  //           startWith(""),
  //           map(value => this._filterDriver(value || ''))
  //         ); 
  //       });
  //   }
  InitDriver() {
    if (!this.supplierID) {
      this.DriverList = [];
      this.updateDriverValidators();
      return;
    }
    this._generalService.GetDriverDropDown(this.supplierID).subscribe(
      data => {
        this.DriverList = data;
        this.updateDriverValidators();
        this.filteredDriverOptions = this.advanceTableForm.controls['driverName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDriver(value || ''))
        );
        this.advanceTableForm.controls['driverName'].valueChanges.subscribe(value => {
          const matchedDriver = (this.DriverList || []).find(
            driver => driver.driverName?.toLowerCase() === value?.toLowerCase()
          );
          if (!matchedDriver) {
            this.driverID = null;
            this.advanceTableForm.patchValue({ driverID: null }, { emitEvent: false });
            this.advanceTableForm.controls['driverID'].updateValueAndValidity({ emitEvent: false });
          }
        });
      });
  }

  driverTypeValidator(DriverList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      if (!value) {
        return null;
      }
      const match = (DriverList || []).some(
        driver => driver.driverName?.toLowerCase() === value?.toLowerCase()
      );
      return match ? null : { driverTypeInvalid: true };
    };
  }

  updateDriverValidators(): void {
    const isExisting = this.advanceTableForm.value?.isDriverExisting === 'Existing';
    const isNew = this.advanceTableForm.value?.isDriverExisting === 'New';

    if (isExisting) {
      this.advanceTableForm.controls['driverName'].setValidators([
        Validators.required,
        this.driverTypeValidator(this.DriverList || [])
      ]);
      this.advanceTableForm.controls['driverID'].setValidators([
        Validators.required,
        Validators.min(1)
      ]);
    } else if (isNew) {
      this.advanceTableForm.controls['driverName'].setValidators([Validators.required]);
      this.advanceTableForm.controls['driverID'].clearValidators();
    } else {
      this.advanceTableForm.controls['driverName'].clearValidators();
      this.advanceTableForm.controls['driverID'].clearValidators();
    }

    this.advanceTableForm.controls['driverName'].updateValueAndValidity({ emitEvent: false });
    this.advanceTableForm.controls['driverID'].updateValueAndValidity({ emitEvent: false });
  }

  private _filterDriver(value: string): any {
    const filterValue = value.toLowerCase();
    // if(filterValue.length === 0) {
    //   return [];
    // }
    return this.DriverList.filter(
      customer => {
        return customer.driverName.toLowerCase().includes(filterValue);
      });
  }
  OnDriverSelect(selectedSupplier: string) {
    const DriverName = this.DriverList.find(
      data => data.driverName?.toLowerCase() === selectedSupplier?.toLowerCase()
    );
    if (selectedSupplier && DriverName) {
      this.getDriverID(DriverName.driverID,);
    }
    this.forceUppercase('driverName');
  }
  getDriverID(driverID: any) {
    this.driverID = driverID;
    this.GetDriverDetails();
    this.advanceTableForm.patchValue({ driverID: this.driverID || this.advanceTable.driverID });
  }

  //---------- Supplier Type ----------
  // InitSupplierType()
  // {
  //   this._generalService.GetSupplierType().subscribe(
  //     data=>
  //     {
  //       this.SupplierTypeList=data;
  //       this.filteredSupplierTypeOptions = this.advanceTableForm.controls['supplierType'].valueChanges.pipe(
  //         startWith(""),
  //         map(value => this._filterSupplierType(value || ''))
  //       );
  //     });
  // }
  // private _filterSupplierType(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   if(filterValue.length === 0) {
  //     return [];
  //   }
  //   return this.SupplierTypeList.filter(
  //     data =>
  //     {
  //       return data.supplierType.toLowerCase().includes(filterValue);
  //     }
  //   );
  // }

  // onSupplierType(selectedSupplierType: string) {
  //   const selectedSupplier = this.SupplierTypeList.find(
  //     supplierType => supplierType.supplierType === selectedSupplierType
  //   );

  //   if (selectedSupplierType) {
  //     this.getSupplierTypeID(selectedSupplier.supplierTypeID);
  //   }
  // }
  // getSupplierTypeID(supplierTypeID: any) 
  // {
  //   this.supplierTypeID=supplierTypeID;
  //   this.advanceTableForm.patchValue({ supplierTypeID:this.supplierTypeID});
  // }

  //==========================VehicleCategories==========================

  initVehicleCategories(vehicleID: number) {
    this._generalService.GetVehicleCategoryByVehicleID(vehicleID).subscribe(
      data => {
        this.VehicleCategoryList = data;
        this.advanceTableForm.patchValue({ vehicleCategoryID: this.VehicleCategoryList.vehicleCategoryID });
        this.advanceTableForm.patchValue({ vehicleCategory: this.VehicleCategoryList.vehicleCategory });

        // this.filteredVehicleCategoryOptions = this.advanceTableForm.controls['vehicleCategory'].valueChanges.pipe(
        //   startWith(""),
        //   map(value => this._filterVehicleCategories(value || ''))
        // ); 
      });
  }


  private _filterVehicleCategories(value: string): any {
    const filterValue = value.toLowerCase();
    // if(filterValue.length === 0) {
    //   return [];
    // }
    return this.VehicleCategoryList.filter(
      customer => {
        return customer.vehicleCategory.toLowerCase().includes(filterValue);
      });
  }
  OnVehicleCategorySelect(selectedVehicleCategory: string) {
    const VehicleCategoryName = this.VehicleCategoryList.find(
      data => data.vehicleCategory === selectedVehicleCategory
    );
    if (selectedVehicleCategory) {
      this.getTitles(VehicleCategoryName.vehicleCategoryID);
    }
  }
  getTitles(vehicleCategoryID: any) {
    this.vehicleCategoryID = vehicleCategoryID;
    this.advanceTableForm.patchValue({ vehicleCategoryID: this.vehicleCategoryID });
    // this.initVehicle();
    this.advanceTableForm.controls['vehicle'].setValue('');
  }


  onvechileInputChanges(event: any) {
    if (event.keyCode === 8) {
      this.advanceTableForm.controls['vehicleCategory'].setValue('');
    }

  }

  //==================================Vehicle =======================

  initVehicle() {
    this._generalService.GetVehicle().subscribe(
      data => {
        this.VehicleList = data;
        this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
          startWith(''),
          map(value => this._filterVehicle(value || ''))
        );
      }
    );
  }

  private _filterVehicle(value: string): any {
    const filterValue = value.toLowerCase();
    // if(filterValue.length === 0) {
    //   return [];
    // }
    return this.VehicleList.filter(
      customer => {
        return customer.vehicle.toLowerCase().includes(filterValue);
      });
  }
  OnVehicleSelect(selectedVehicle: string) {
    const VehicleName = this.VehicleList.find(
      data => data.vehicle === selectedVehicle
    );
    if (selectedVehicle) {
      this.getvehicleID(VehicleName.vehicleID);
    }
  }
  getvehicleID(vehicleID: any) {
    this.vehicleID = vehicleID;
    this.advanceTableForm.patchValue({ vehicleID: this.vehicleID });
    this.initVehicleCategories(vehicleID);
  }

  //---------RegistrationNumber-----------------

  // initRegistrationNumber() {
  //   this._generalService.GetRegistrationNumber().subscribe(
  //     data => {
  //       this.RegistrationNumberList = data;
  //       // this.advanceTableForm.controls['registrationNumber'].setValidators([Validators.required,
  //       //   this.RegistrationNumberValidator(this.RegistrationNumberList)]);
  //       // this.advanceTableForm.controls['registrationNumber'].updateValueAndValidity();
  //       this.filteredRegistrationNumberOptions = this.advanceTableForm.controls['registrationNumber'].valueChanges.pipe(
  //         startWith(''),
  //         map(value => this._filterRegistrationNumber(value || ''))
  //       );
  //     }
  //   );
  // }

  // duplicateRegistrationNoCheck() {
  //   const regNo = this.advanceTableForm.value.registrationNumber;

  //   if (!regNo) return;

  //   this._generalService.GetRegistrationNumberDuplicate(regNo)
  //     .subscribe(res => {
  //       console.log(res);
  //       if (res) {
  //         this.advanceTableForm.get('registrationNumber')
  //           .setErrors({ duplicate: true });
  //       } else {

  //         this.advanceTableForm.get('registrationNumber')
  //           .setErrors(null);
  //       }

  //     });
  // }
 duplicateRegistrationNoCheck() {
  const regNo = this.advanceTableForm.value.registrationNumber;
    if (!regNo) return;

   this.advanceTableService.GetCarOwnedAndSupplier(regNo).subscribe(
    data => {
      this.ownedSupplier = data?.ownedSupplier;
      console.log(this.ownedSupplier);

      // If owned car -> show popup
      if (this.ownedSupplier === true) {
        Swal.fire({
          title: 'This is owned car',
          text: 'This is owned car',
          icon: 'warning',
          confirmButtonText: 'OK'
        }).then((result) => {

          // When popup closes / OK clicked
          if (result.isConfirmed) {
            this.advanceTableForm
              .get('registrationNumber')
              ?.setValue('');
          }
        });

        return; // stop further execution
      }


  this.advanceTableService.GetSupplierByRegNo(regNo).subscribe(
    data => {
      this.supplierName = data?.supplierName;

      this._generalService.GetRegistrationNumberDuplicate(regNo)
        .subscribe(res => {

          if (!res) {
            this.advanceTableForm.get('registrationNumber')?.setErrors(null);
            return;
          }

          const selectedSupplier = this.advanceTableForm.value.supplierName;

          if (this.supplierName) {
            Swal.fire({
              title: 'Registration number already exists',
              html: `
                <p>
                  The registration number you have selected already exist and attached to another supplier
                  <b>(${this.supplierName})</b>.
                </p>
                <p>
                  Do you want to change the ownership to selected supplier
                  <b>(${selectedSupplier})</b>?
                </p>
              `,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
            }).then(result => {

              if (result.isConfirmed) {

                this.advanceTableService.getInventoryIdByregNo(regNo)
                  .subscribe(inventoryRes => {

                     this.inventoryID = inventoryRes?.inventoryID;
                    //console.log('Inventory ID:', this.inventoryID);
                    this.advanceTableForm.patchValue({ inventoryID: this.inventoryID });
                    this.registrationNumber=regNo;
                     this.GetInventoryDetails();
                     this.GetVehicleCategories();
                  });

              } else {
                this.advanceTableForm.get('registrationNumber')?.setValue('');
              }

            });
          }

        });
    },
    (error: HttpErrorResponse) => {
      this.supplierName = null;
    }
  );
  },
    (error: HttpErrorResponse) => {
      this.ownedSupplier = false;
    }
  );
}


 duplicateDriverNoCheck() {
  const driverPhone = this.advanceTableForm.value.driverPhone;
  if (!driverPhone) return;

  this.advanceTableService.GetSupplierByDriverMobile(driverPhone).subscribe(
    data => {
      this.supplierName = data?.supplierName;

      this._generalService.GetDriverNumberDuplicate(driverPhone)
        .subscribe(res => {

          if (!res) {
            this.advanceTableForm.get('driverPhone')?.setErrors(null);
            return;
          }

          const selectedSupplier = this.advanceTableForm.value.supplierName;

          if (this.supplierName) {
            Swal.fire({
              title: 'Driver already exists',
              html: `
                <p>
                  The driver you have selected already exist and attached to another supplier
                  <b>(${this.supplierName})</b>.
                </p>
                <p>
                  Do you want to change the ownership to selected supplier
                  <b>(${selectedSupplier})</b>?
                </p>
              `,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
            }).then(result => {

              if (result.isConfirmed) {

                this.advanceTableService.getDriverIdByPhone(driverPhone)
                  .subscribe(driverRes => {

                     this.driverID = driverRes?.driverID;
                    //console.log('Driver ID:', this.driverID);
                    this.GetDriverDetails();
                    this.advanceTableForm.patchValue({ driverID: this.driverID });
                  });

              } else {
                this.advanceTableForm.get('driverPhone')?.setValue('');
              }

            });
          }

        });
    },
    (error: HttpErrorResponse) => {
      this.supplierName = null;
    }
  );
}
  initRegistrationNumber() {
    if (!this.supplierID) {
      this.RegistrationNumberList = [];
      this.updateInventoryValidators();
      return;
    }
    this._generalService.GetRegistrationNumberDropDown(this.supplierID).subscribe(
      data => {
        this.RegistrationNumberList = data;
        this.updateInventoryValidators();
        this.filteredRegistrationNumberOptions = this.advanceTableForm.controls['registrationNumber'].valueChanges.pipe(
          startWith(''),
          map(value => this._filterRegistrationNumber(value || ''))
        );
        this.advanceTableForm.controls['registrationNumber'].valueChanges.subscribe(value => {
          const matchedRegistration = (this.RegistrationNumberList || []).find(
            item => item.vehicle?.toLowerCase() === value?.toLowerCase()
          );
          if (!matchedRegistration) {
            this.inventoryID = null;
            this.registrationNumber = null;
            this.advanceTableForm.patchValue({ inventoryID: null }, { emitEvent: false });
            this.advanceTableForm.controls['inventoryID'].updateValueAndValidity({ emitEvent: false });
          }
        });
      }
    );
  }

  registrationNumberTypeValidator(RegistrationNumberList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      if (!value) {
        return null;
      }
      const match = (RegistrationNumberList || []).some(
        item => item.vehicle?.toLowerCase() === value?.toLowerCase()
      );
      return match ? null : { registrationTypeInvalid: true };
    };
  }

  updateInventoryValidators(): void {
    const isExisting = this.advanceTableForm.value?.isCarExisting === 'Existing';
    const isNew = this.advanceTableForm.value?.isCarExisting === 'New';

    if (isExisting) {
      this.advanceTableForm.controls['registrationNumber'].setValidators([
        Validators.required,
        this.registrationNumberTypeValidator(this.RegistrationNumberList || [])
      ]);
      this.advanceTableForm.controls['inventoryID'].setValidators([
        Validators.required,
        Validators.min(1)
      ]);
    } else if (isNew) {
      this.advanceTableForm.controls['registrationNumber'].setValidators([Validators.required]);
      this.advanceTableForm.controls['inventoryID'].clearValidators();
    } else {
      this.advanceTableForm.controls['registrationNumber'].clearValidators();
      this.advanceTableForm.controls['inventoryID'].clearValidators();
    }

    this.advanceTableForm.controls['registrationNumber'].updateValueAndValidity({ emitEvent: false });
    this.advanceTableForm.controls['inventoryID'].updateValueAndValidity({ emitEvent: false });
  }

  private _filterRegistrationNumber(value: string): any {
    const filterValue = value.toLowerCase().trim();
    // if(filterValue.length === 0) {
    //   return [];
    // }
    return this.RegistrationNumberList.filter(
      customer => {
        return customer.vehicle.toLowerCase().includes(filterValue);
      });
  }


  OnRegistrationNumberSelect(selectedRegNo: string) {
    const RegNo = this.RegistrationNumberList.find(
      data => data.vehicle?.toLowerCase() === selectedRegNo?.toLowerCase()
    );
    if (selectedRegNo && RegNo) {
      this.getRegistrationNumberID(RegNo.vehicle);
    }
    this.forceUppercase('registrationNumber');
  }
  getRegistrationNumberID(vehicle: any) {
    this.registrationNumber = vehicle;
    this.GetInventoryDetails();
    this.GetVehicleCategories();
    this.advanceTableForm.patchValue({ registrationNumber: this.registrationNumber });
    this.forceUppercase('registrationNumber');
  }


  GetVehicleCategories() {
    this._generalService.GetVehicleCategoryBasedOnRegistrationNumber(this.registrationNumber).subscribe(
      (data: any) => {
        this.advanceTable = data;
        this.advanceTableForm.patchValue({ vehicle: this.advanceTable?.vehicle });
        this.advanceTableForm.patchValue({ vehicleID: this.advanceTable?.vehicleID });
        this.advanceTableForm.patchValue({ vehicleCategory: this.advanceTable?.vehicleCategory });
        this.advanceTableForm.patchValue({ vehicleCategoryID: this.advanceTable?.vehicleCategoryID });
        this.advanceTableForm.patchValue({ locationName: this.data.reservationInfo.transferedLocation });
        this.advanceTableForm.patchValue({ locationID: this.locationID });
        this.VehicleCategoryList = {
        vehicleCategory: this.advanceTable?.vehicleCategory,
        vehicleCategoryID: this.advanceTable?.vehicleCategoryID
      };
      },
      (error: HttpErrorResponse) => { this.advanceTable = null; });
  }




  //=========================FOR State==========================
  InitState() {
    this._generalService.getStateForInterstateTax().subscribe(
      data => {
        this.StateLists = data;
        this.filteredStateOptions = this.advanceTableForm.controls['rtoState'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterState(value || ''))
        );

      }

    );
  }
  private _filterState(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length === 0) {
      return [];
    }
    return this.StateLists?.filter(
      customer => {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      });
  }
  OnRTOStateSelect(selectedRTOState: string) {
    const RTOStateName = this.StateLists.find(
      data => data.geoPointName === selectedRTOState
    );
    if (selectedRTOState) {
      this.getStateID(RTOStateName.geoPointID);
    }
  }
  getStateID(geoPointID: any) {
    this.geoPointRTOID = geoPointID;
    this.advanceTableForm.patchValue({ rtoStateID: this.geoPointRTOID });
  }


  formControl = new FormControl('',
    [
      Validators.required
    ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  markAsTouched(controlName: string) {
    this.advanceTableForm.controls[controlName].markAsTouched();
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        driverID: [this.advanceTable?.driverID],
        driverName: [this.advanceTable?.driverName],
        driverFatherName: [this.advanceTable?.driverFatherName],
        driverOfficialIdentityNumber: [this.advanceTable?.driverOfficialIdentityNumber],
        aadharAuthenticationToken: [this.advanceTable?.aadharAuthenticationToken],
        countryCodes: ['+91'],
        countryCode: ['+91'],
        driverEmail: [this.advanceTable?.driverEmail],
        supplierEmail: [this.advanceTable?.supplierEmail],
        companyID: [this.advanceTable?.companyID],
        driverPhone: [this.advanceTable?.driverPhone],
        supplierPhone: [this.advanceTable?.supplierPhone],
        ownedSupplier: [this.advanceTable?.ownedSupplier],
        supplierID: [this.advanceTable?.supplierID, [Validators.required, Validators.min(1)]],
        supplierName: [this.advanceTable?.supplierName, Validators.required],
        rtoStateID: [this.advanceTable?.rtoStateID],
        rtoState: [this.advanceTable?.rtoState],
        activationStatus: [this.advanceTable?.activationStatus],
        registrationNumber: [this.advanceTable?.registrationNumber],
        vehicleCategory: [this.advanceTable?.vehicleCategory],
        vehicle: [this.advanceTable?.vehicle],
        supplierTypeID: [this.advanceTable?.supplierTypeID],
        vehicleCategoryID: [this.advanceTable?.vehicleCategoryID],
        vehicleID: [this.advanceTable?.vehicleID],
        inventoryID: [this.advanceTable?.inventoryID],
        locationID: [this.advanceTable?.locationID],
        locationName: [this.advanceTable?.locationName],
        dateOfJoining: [this.advanceTable?.dateOfJoining],
        drivingSinceDate: [this.advanceTable?.drivingSinceDate],
        companyName: [this.advanceTable?.companyName],
        isVendorExisting: [this.advanceTable?.isVendorExisting || 'Existing'],
        isDriverExisting: [this.advanceTable?.isDriverExisting],
        isCarExisting: [this.advanceTable?.isCarExisting]

      },
    );
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
    this.ImagePath = undefined;
  }
  onNoClick() {
    this.dialogRef.close();
  }



  //==========================InventoryDetails==========================
  public GetInventoryDetails() {
    this.advanceTableService.GetInventoryDetails(this.registrationNumber).subscribe
      (
        (data: any) => {
          this.advanceTable = data;
          this.inventoryID = this.advanceTable.inventoryID;
          this.advanceTableForm.patchValue({ inventoryID: this.inventoryID });
        },
        (error: HttpErrorResponse) => { this.advanceTable = null; }
      );
  }

  //---------------------VendorDetails---------------------
  public GetVendorDetails() {
    this.advanceTableService.GetVendorDetails(this.supplierID).subscribe
      (
        (data: any) => {
          this.advanceTable = data;
          // console.log(this.advanceTable)
          if (this.advanceTable.supplierEmail === "NULL") {
            this.advanceTableForm.patchValue({ supplierEmail: '' });
          }
          else {
            this.advanceTableForm.patchValue({ supplierEmail: this.advanceTable.supplierEmail });
          }

          this.advanceTableForm.patchValue({ supplierPhone: this.advanceTable.supplierPhone });

          this.advanceTableForm.patchValue({ supplierTypeID: this.advanceTable.supplierTypeID });
        },
        (error: HttpErrorResponse) => { this.advanceTable = null; }
      );
  }

  //------------------ DriverDetails---------------------
  public GetDriverDetails() {
    this.advanceTableService.GetDriverDetails(this.driverID).subscribe
      (
        (data: any) => {
          this.advanceTable = data;
          this.advanceTableForm.patchValue({ rtoStateID: this.advanceTable.rtoStateID });
          this.advanceTableForm.patchValue({ companyID: this.advanceTable.companyID });
          this.advanceTableForm.patchValue({ driverName: this.advanceTable.driverName });
          this.advanceTableForm.patchValue({ companyName: this.advanceTable.companyName });
          this.advanceTableForm.patchValue({ driverEmail: this.advanceTable.driverEmail });
          if (this.advanceTable.driverPhone) {
            const mobileParts = this.advanceTable.driverPhone.split('-');
            const countryCodes = '+' + '' + mobileParts[0];
            this.advanceTable.countryCodes = countryCodes;
            const driverMobile = mobileParts[1];
            this.advanceTable.driverPhone = driverMobile;
            this.advanceTableForm.patchValue({ driverPhone: driverMobile });
          }


          const dateOfJoining = this.datePipe.transform(this.advanceTable?.dateOfJoining, 'yyyy-MM-dd');
          this.advanceTableForm.patchValue({ dateOfJoining: dateOfJoining });
          this.advanceTableForm.patchValue({ driverFatherName: this.advanceTable.driverFatherName });
          this.advanceTableForm.patchValue({ driverOfficialIdentityNumber: this.advanceTable.driverOfficialIdentityNumber });
          const drivingSinceDate = this.datePipe.transform(this.advanceTable?.drivingSinceDate, 'yyyy-MM-dd');
          this.advanceTableForm.patchValue({ drivingSinceDate: drivingSinceDate });
          this.advanceTableForm.patchValue({ ownedSupplier: this.advanceTable.ownedSupplier });
          this.advanceTableForm.patchValue({ rtoState: this.advanceTable.rtoState });
          this.forceUppercase('driverName');
          this.forceUppercase('driverFatherName');
        },
        (error: HttpErrorResponse) => { this.advanceTable = null; }
      );
  }
  //-----------------SupplierTypeForNew-------------
  public GetSupplierTypeDetails() {
    this.advanceTableService.GetSupplierTypeDetails(this.supplierType).subscribe
      (
        (data: any) => {
          this.advanceTable = data;
          this.advanceTableForm.patchValue({ supplierTypeID: this.advanceTable.supplierTypeID });
        },
        (error: HttpErrorResponse) => { this.advanceTable = null; }
      );
  }


  //------------------post---------------------
  public Post(): void {
    if (!this.isValidSupplierSelected()) {
      return;
    }
    if (!this.isValidExistingDriverSelected()) {
      return;
    }
    if (!this.isValidExistingRegistrationSelected()) {
      return;
    }
    this.forceUppercase('supplierName');
    this.forceUppercase('driverName');
    this.forceUppercase('driverFatherName');
    this.forceUppercase('registrationNumber');
    this.advanceTableForm.patchValue({ supplierID: this.supplierID });
    const phone1 = this.advanceTableForm.get('countryCodes').value;
    const phone2 = this.advanceTableForm.get('driverPhone').value;
    const countryCodes = phone1.split('+')[1];
    const mobile1 = countryCodes + '-' + phone2

    // const phone3 = this.advanceTableForm.get('countryCode').value;
    const phone4 = this.advanceTableForm.get('supplierPhone').value;
    // const countryCode = phone3.split('+')[1];
    // const mobile2 =countryCode+'-'+phone4

    // const mobile2 = phone4 ? `${countryCode}-${phone4}` : null;

    if (this.advanceTableForm.value?.isDriverExisting === 'New') {
      this.advanceTableForm.patchValue({ ownedSupplier: "Supplier", driverID: null });
    } else if (this.advanceTableForm.value?.isDriverExisting === 'Existing') {
      this.advanceTableForm.patchValue({ driverID: this.driverID });
    }
    if (this.advanceTableForm.value?.isCarExisting === 'New') {
      this.advanceTableForm.patchValue({ inventoryID: null });
    }
    this.advanceTableForm.patchValue({ supplierPhone: phone4 });
    this.advanceTableForm.patchValue({ reservationID: this.reservationID });
    //this.advanceTableForm.patchValue({locationID:this.LocationID});
    this.advanceTableForm.patchValue({ driverPhone: mobile1 });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
           const mobile = this.advanceTableForm?.get('driverPhone').value.split('-')[1];
          this.advanceTableForm?.patchValue({ driverPhone: mobile });
          this.dialogRef.close({ response });
          this.showNotification(
            'snackbar-success',
            'Adhoc Car And Driver Created...!!!',
            'bottom',
            'center'
          );
          //this._generalService.sendUpdate('AdhocCarAndDriverCreate:AdhocCarAndDriverView:Success');//To Send Updates  

        },
        error => {
          const mobile = this.advanceTableForm?.get('driverPhone').value.split('-')[1];
          this.advanceTableForm?.patchValue({ driverPhone: mobile });
          const errorMessage = error?.error || 'Operation Failed...!!!';
          this.showNotification(
            'snackbar-danger',
            errorMessage,
            'bottom',
            'center'
          );
          //this._generalService.sendUpdate('AdhocCarAndDriverAll:AdhocCarAndDriverView:Failure');//To Send Updates  
        }
      )
  }

  private isValidSupplierSelected(): boolean {
    const supplierId = this.advanceTableForm.get('supplierID')?.value;
    const supplierName = this.advanceTableForm.get('supplierName')?.value;
    const matchedSupplier = (this.SupplierList || []).find(
      supplier => supplier.supplierID === supplierId
        && supplier.supplierName?.toLowerCase() === supplierName?.toLowerCase()
    );

    if (!supplierId || supplierId <= 0 || !matchedSupplier) {
      this.advanceTableForm.controls['supplierName'].markAsTouched();
      this.advanceTableForm.controls['supplierID'].markAsTouched();
      this.advanceTableForm.controls['supplierName'].setErrors({ supplierNameInvalid: true });
      this.advanceTableForm.controls['supplierID'].setErrors({ required: true });
      this.showNotification(
        'snackbar-danger',
        'Please select a valid Supplier from the Supplier Master.',
        'bottom',
        'center'
      );
      return false;
    }

    return true;
  }

  private isValidExistingDriverSelected(): boolean {
    if (this.advanceTableForm.value?.isDriverExisting !== 'Existing') {
      return true;
    }

    const driverId = this.advanceTableForm.get('driverID')?.value;
    const driverName = this.advanceTableForm.get('driverName')?.value?.trim();

    if (!driverName) {
      this.advanceTableForm.controls['driverName'].markAsTouched();
      this.advanceTableForm.controls['driverName'].setErrors({ required: true });
      this.showNotification(
        'snackbar-danger',
        'Please select a driver name.',
        'bottom',
        'center'
      );
      return false;
    }

    const matchedDriver = (this.DriverList || []).find(
      driver => driver.driverID === driverId
        && driver.driverName?.toLowerCase() === driverName?.toLowerCase()
    );

    if (!driverId || driverId <= 0 || !matchedDriver) {
      this.advanceTableForm.controls['driverName'].markAsTouched();
      this.advanceTableForm.controls['driverID'].markAsTouched();
      this.advanceTableForm.controls['driverName'].setErrors({ driverTypeInvalid: true });
      this.advanceTableForm.controls['driverID'].setErrors({ required: true });
      this.showNotification(
        'snackbar-danger',
        'Please select a existing driver.',
        'bottom',
        'center'
      );
      return false;
    }

    return true;
  }

  private isValidExistingRegistrationSelected(): boolean {
    if (this.advanceTableForm.value?.isCarExisting !== 'Existing') {
      return true;
    }

    const registrationNo = this.advanceTableForm.get('registrationNumber')?.value?.trim();
    const inventoryId = this.advanceTableForm.get('inventoryID')?.value;

    if (!registrationNo) {
      this.advanceTableForm.controls['registrationNumber'].markAsTouched();
      this.advanceTableForm.controls['registrationNumber'].setErrors({ required: true });
      this.showNotification(
        'snackbar-danger',
        'Please select registration no.',
        'bottom',
        'center'
      );
      return false;
    }

    const matchedRegistration = (this.RegistrationNumberList || []).find(
      item => item.vehicle?.toLowerCase() === registrationNo?.toLowerCase()
    );

    if (!inventoryId || inventoryId <= 0 || !matchedRegistration) {
      this.advanceTableForm.controls['registrationNumber'].markAsTouched();
      this.advanceTableForm.controls['inventoryID'].markAsTouched();
      this.advanceTableForm.controls['registrationNumber'].setErrors({ registrationTypeInvalid: true });
      this.advanceTableForm.controls['inventoryID'].setErrors({ required: true });
      this.showNotification(
        'snackbar-danger',
        'Please select existing registration no.',
        'bottom',
        'center'
      );
      return false;
    }

    return true;
  }

  public confirmAdd(): void {
    if (!this.isValidSupplierSelected()) {
      return;
    }
    if (!this.isValidExistingDriverSelected()) {
      return;
    }
    if (!this.isValidExistingRegistrationSelected()) {
      return;
    }
    if (this.action == "edit") {
      // this.Put();
    }
    else {
      this.Post();
    }

  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 6000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  //   const parsedDate = this._generalService.parseCustomDate(value);
  //   if (parsedDate) {
  //     this.advanceTableForm.get('dob')?.setValue(parsedDate);
  //     this.advanceTableForm.get('dob')?.setErrors(null);
  //   } else {
  //     this.advanceTableForm.get('dob')?.setErrors({ invalidDate: true });
  //   }
  // }

  // onBlurUpdateDateOfJoining(value: string): void {
  //   const parsedDate = this._generalService.parseCustomDate(value);
  //   if (parsedDate) {
  //     this.advanceTableForm.get('dateOfJoining')?.setValue(parsedDate);
  //     this.advanceTableForm.get('dateOfJoining')?.setErrors(null);
  //   } else {
  //     this.advanceTableForm.get('dateOfJoining')?.setErrors({ invalidDate: true });
  //   }
  // } 


  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";

  //------------------Checked Box Conditions Start ------------------------
  // getExisting(event:any)
  // {
  //   if (event.checked) {
  //   this.isVendorExisting = true;
  //   this.checkAllExisting();
  //   }
  //   else{
  //     this.isVendorExisting = false;
  //     this.advanceTableForm.controls['supplierName'].setValue('');
  //     this.advanceTableForm.controls['supplierEmail'].setValue('');
  //     this.advanceTableForm.controls['supplierPhone'].setValue('');
  //   this.checkAllExisting();
  //   }
  // }
  // getDriverExisting(event:any)
  // {
  //   if (event.checked) {
  //     this.isDriverExisting = true;
  //     this.checkAllExisting();
  //   } else {
  //     this.isDriverExisting=false;
  //     this.advanceTableForm.controls['driverName'].setValue('');
  //     this.advanceTableForm.controls['driverEmail'].setValue('');
  //     this.advanceTableForm.controls['driverPhone'].setValue('');
  //     this.advanceTableForm.controls['driverFatherName'].setValue('');
  //     this.advanceTableForm.controls['driverOfficialIdentityNumber'].setValue('');
  //     this.advanceTableForm.controls['rtoState'].setValue('');
  //     this.checkAllExisting();
  //   }

  // }
  // getCarExisting(event:any){
  //   if (event.checked) {
  //   this.isCarExisting = true;
  //   this.checkAllExisting();
  //   }
  //   else{
  //     this.isCarExisting = false;
  //     this.advanceTableForm.controls['registrationNumber'].setValue('');
  //     this.advanceTableForm.controls['vehicleCategory'].setValue('');
  //     this.advanceTableForm.controls['vehicle'].setValue('');
  //   this.checkAllExisting();
  //   }
  // }
  // checkAllExisting() {
  //   this.allExisting = this.isVendorExisting && this.isDriverExisting && this.isCarExisting;
  // }

  //-----------------------END -------------------------------------------------


  //------------------DropDown Conditions Start-----------------

  getExisting(event: any) {
    if (event === 'Existing') {
      this.advanceTableForm.controls['supplierName'].setValue('');
      this.advanceTableForm.controls['supplierEmail'].setValue('');
      this.advanceTableForm.controls['supplierPhone'].setValue('');
    }
    else {
      if (this.advanceTableForm.value?.isVendorExisting === 'New') {

        this.supplierType = "On Call";
        this.GetSupplierTypeDetails();
      }
      this.advanceTableForm.controls['supplierName'].setValue('');
      this.advanceTableForm.controls['supplierEmail'].setValue('');
      this.advanceTableForm.controls['supplierPhone'].setValue('');
    }
    this.checkAllExisting();  // Always update the flag
  }

  getDriverExisting(event: any) {
    this.copydetails = true;
    if (this.copyCheckBox) {
      this.copyCheckBox.checked = false;
    }
    this.driverID = null;
    this.advanceTableForm.controls['driverName'].setValue('');
    this.advanceTableForm.controls['driverEmail'].setValue('');
    this.advanceTableForm.controls['driverPhone'].setValue('');
    this.advanceTableForm.controls['driverFatherName'].setValue('');
    this.advanceTableForm.controls['driverOfficialIdentityNumber'].setValue('');
    this.advanceTableForm.controls['rtoState'].setValue('');
    this.advanceTableForm.patchValue({ driverID: null, companyID: null, companyName: '', rtoStateID: null });

    if (event === 'Existing') {
      if (this.supplierID) {
        this.InitDriver();
      } else {
        this.DriverList = [];
        this.updateDriverValidators();
      }
    } else {
      this.updateDriverValidators();
    }
    this.checkAllExisting();

  }

  getCarExisting(event: any) {
    this.inventoryID = null;
    this.registrationNumber = null;
    this.advanceTableForm.controls['registrationNumber'].setValue('');
    this.advanceTableForm.controls['vehicleCategory'].setValue('');
    this.advanceTableForm.controls['vehicle'].setValue('');
    this.advanceTableForm.patchValue({ inventoryID: null });

    if (event === 'Existing') {
      this.advanceTableForm.controls['locationName'].setValue('');
      if (this.supplierID) {
        this.initRegistrationNumber();
      } else {
        this.RegistrationNumberList = [];
        this.updateInventoryValidators();
      }
    }
    else {
      this.advanceTableForm.controls['locationName'].setValue(this.data.reservationInfo.transferedLocation);
      this.InitLocation();
      //this.LocationID = this.data.reservationInfo.transferedLocationID;
      this.advanceTableForm.patchValue({ locationID: this.data.reservationInfo.transferedLocationID });
      this.updateInventoryValidators();
    }
    this.checkAllExisting();
  }

  checkAllExisting() {
    const isVendorExisting = this.advanceTableForm.value.isVendorExisting === 'Existing';
    const isDriverExisting = this.advanceTableForm.value.isDriverExisting === 'Existing';
    const isCarExisting = this.advanceTableForm.value.isCarExisting === 'Existing';

    this.allExisting = isVendorExisting && isDriverExisting && isCarExisting;
  }
  //--------------------End-------------------------------------

  //---------- Location ---------
  InitLocation() {
    this._generalService.GetLocationHub().subscribe(
      data => {
        this.LocationNameList = data;
        this.filteredLocationNameOptions = this.advanceTableForm.controls['locationName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterLocation(value || ''))
        );
      });
  }
  private _filterLocation(value: any): any {
    const filterValue = typeof value === 'string'
      ? value.toLowerCase()
      : value?.organizationalEntityName?.toLowerCase() || '';

    return this.LocationNameList.filter(data =>
      data.organizationalEntityName.toLowerCase().includes(filterValue)
    );
  }
  OnLocationSelect(selectedLocation: string) {
    const selectedLocationName = this.LocationNameList.find(
      data => data.organizationalEntityName === selectedLocation);
    if (selectedLocation) {
      this.getLocationID(selectedLocationName.organizationalEntityID);
    }
  }
  getLocationID(locationID: any) {
    this.LocationID = locationID;
    this.advanceTableForm.patchValue({ locationID: this.LocationID });
  }
  copyVendorToDriver(event: any) {
    if (event.checked) {
      this.advanceTableForm.patchValue({
        driverEmail: this.advanceTableForm.get('supplierEmail')?.value,
        driverPhone: this.advanceTableForm.get('supplierPhone')?.value
      });
    } else {
      // Optionally clear vendor fields when unchecked
      this.advanceTableForm.patchValue({
        driverEmail: '',
        driverPhone: ''
      });
    }
  }
  preventSpace(event: KeyboardEvent) {
  if (event.key === ' ') {
    event.preventDefault();
  }
}

removeSpaces() {
  const control = this.advanceTableForm.get('registrationNumber');

  const value = control?.value || '';

  control?.setValue(value.replace(/\s/g, '').toUpperCase(), {
    emitEvent: false
  });
}
sanitizeDriverName() {
  const control = this.advanceTableForm.get('driverName');
  let value = control?.value || '';
  value = value.replace(/[^a-zA-Z ]/g, '');
  value = value.replace(/\s+/g, ' ').trimStart();
  value = value.toUpperCase();

  control?.setValue(value, { emitEvent: false });
}

forceUppercase(controlName: string) {
  const control = this.advanceTableForm?.get(controlName);
  if (!control) {
    return;
  }
  const current = control.value;
  if (current == null || current === '') {
    return;
  }
  const upper = String(current).toUpperCase();
  if (current !== upper) {
    control.setValue(upper, { emitEvent: false });
  }
}

}



