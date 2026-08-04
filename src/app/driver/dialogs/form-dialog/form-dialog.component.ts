// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { DriverService } from '../../driver.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Driver } from '../../driver.model';
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
import {
  filterSuppliersByDisplay,
  formatSupplierDisplay,
  supplierMatchesDisplay,
} from 'src/app/supplier/supplier-display.util';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntityMessage/organizationalEntityDropDown.model';
import { DriverGradeDropDown } from 'src/app/driverGrade/driverGradeDropDown.model';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { HttpErrorResponse } from '@angular/common/http';
import { DriverModel } from 'src/app/CarAndDriverAllotment/CarAndDriverAllotment.model';
import { CountryCodeDropDown } from 'src/app/general/countryCodeDropDown.model';
import {  ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';
import Swal from 'sweetalert2';
import { DriverDuplicateMobileModel } from '../../driver.model';

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
  isHidden: boolean = true;
  advanceTableForm: FormGroup;
  advanceTable: Driver;
  image: any;
  fileUploadEl: any;
  searchLACity : FormControl = new FormControl();
  searchPACity : FormControl = new FormControl();
  searchSupplier : FormControl = new FormControl();
  searchHub : FormControl = new FormControl();
  searchLocation : FormControl = new FormControl();
saveDisabled:boolean = true;
 public formGroup: FormGroup;
  public CityList?: CitiesDropDown[] = [];
  filteredOptions: Observable<CitiesDropDown[]>;
  public QualificationList?: QualificationDropDown[] = [];
  filteredQualificationOptions: Observable<QualificationDropDown[]>;
  public CitiesList?: AllCitiesDropDown[] = [];
  filteredCityOptions: Observable<AllCitiesDropDown[]>;
   public SupplierForOwnerList?: SupplierDropDown[] = [];
    filteredSupplierForOwnerOptions: Observable<SupplierDropDown[]>;

  public SupplierList?: SupplierDropDown[] = [];
  filteredSupplierOptions: Observable<SupplierDropDown[]>;

  public HubList?: OrganizationalEntityDropDown[] = [];
  filteredHubOptions: Observable<OrganizationalEntityDropDown[]>;

  public LocationList?: OrganizationalEntityDropDown[] = [];
  filteredLocationOptions: Observable<OrganizationalEntityDropDown[]>;
  filteredCountryCodesOptions: Observable<CountryCodeDropDown[]>;
  public CountryCodeList?: CountryCodeDropDown[] = [];
  filteredCountryCodeOptions: Observable<CountryCodeDropDown[]>;
  public CountryCodesList?: CountryCodeDropDown[] = [];
  public SupplierForOwnershipList?: SupplierDropDown[]=[];
  public StateLists?: StateDropDown[] = [];
  filteredStateOptions: Observable<StateDropDown[]>;
  searchStateTerm : FormControl = new FormControl();
  searchQualification : FormControl = new FormControl();
  options: any = {
    componentRestrictions: { country: 'IN' }
  }
  public DriverGradeList?: DriverGradeDropDown[] = [];
  filteredGradeOptions: Observable<DriverGradeDropDown[]>;
  filteredCompanyOptions: Observable<OrganizationalEntityDropDown[]>;
   public CompanyList?: OrganizationalEntityDropDown[] = [];
  searchGradeTerm:FormControl = new FormControl();

  //public QualificationList?: QualificationDropDown[] = [];
  localAddressString: string;
  localAddressGeoPointID: any;
  permanentGeoPointID: any;
  supplierID: any;
  hubID: any;
  locationID: any;
  driverGradeID: any;
  geoPointRTOID: any;
  highestQualificationID: any;
  owned:boolean=false;
  supplier:boolean=true;

  referenceID: number;
  type: string="Driver";
  pass: any;
  public showPassword: boolean;
  public showConfirmPassword: boolean;
  companyID: any;
 
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DriverService,
    private fb: FormBuilder,
    private el: ElementRef,

    public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Driver';       
          this.advanceTable = data.advanceTable;
          this.referenceID=this.advanceTable.driverID;
          this.loadPassword();
          this.ImagePath=this.advanceTable.driverImage;
          this.searchLACity.setValue(this.advanceTable.localAddressCity);
          this.searchPACity.setValue(this.advanceTable.permanentAddressCity);
          this.searchSupplier.setValue(this.advanceTable.supplier);
          this.searchHub.setValue(this.advanceTable.hub);
          this.searchHub.setValue(this.advanceTable.companyName);
          this.searchLocation.setValue(this.advanceTable.location);
          this.searchGradeTerm.setValue(this.advanceTable.driverGradeName);
          this.searchQualification.setValue(this.advanceTable.highestQualification);
          this.searchStateTerm.setValue(this.advanceTable.rtoState);
          let dob=moment(this.advanceTable.dob).format('DD/MM/yyyy');
          let dateOfJoining=moment(this.advanceTable.dateOfJoining).format('DD/MM/yyyy');
          let dateOfLeaving=moment(this.advanceTable.dateOfLeaving).format('DD/MM/yyyy');
          let drivingSinceDate=moment(this.advanceTable.drivingSinceDate).format('DD/MM/yyyy');
         
          this.onBlurUpdateDateEdit(dob);
          this.onBlurUpdateEndDateEdit(dateOfJoining);
          this.onBlurUpdatedateOfLeavingEdit(dateOfLeaving);
          this.onBlurUpdatedrivingSinceDateEdit(drivingSinceDate);
          if (this.advanceTable.driverBackGroundVerificationCheckIssueDate) {
            const bgvIssueDate = moment(this.advanceTable.driverBackGroundVerificationCheckIssueDate).format('DD/MM/yyyy');
            this.onBlurBackGroundVerificationIssueDateEdit(bgvIssueDate);
          }
          if (this.advanceTable.driverFitnessCertificateIssueDate) {
            const fitnessIssueDate = moment(this.advanceTable.driverFitnessCertificateIssueDate).format('DD/MM/yyyy');
            this.onBlurFitnessCertificateIssueDateEdit(fitnessIssueDate);
          }
          if (this.advanceTable.mobile1) {
            const mobileParts = this.advanceTable.mobile1.split('-');
            const countryCodes = '+'+''+mobileParts[0];
            this.advanceTable.countryCodes=countryCodes;
            const mobile1 = mobileParts[1];
            this.advanceTable.mobile1=mobile1;
        }
        if (this.advanceTable.mobile2) {
          const mobileParts = this.advanceTable.mobile2.split('-');
          const countryCode = '+'+''+mobileParts[0];
          this.advanceTable.countryCode=countryCode;
          const mobile2 = mobileParts[1];
          this.advanceTable.mobile2=mobile2;
      }
           if(this.advanceTable.ownedSupplier==='Owned')
          {
            this.owned=true;
            this.supplier=false;
            this.InitSupplierForOwner();
          }
          if(this.advanceTable.ownedSupplier==='Supplier')
          {
            this.owned=false;
            this.supplier=true;
            this.InitSupplier();
          }
          
          if(this.advanceTable.localAddressLatLong!==null)
          {
            var value = this.advanceTable.localAddressLatLong.replace(
              '(',
              ''
            );
            value = value.replace(')', '');
            var lat = value.split(' ')[2];
            var long = value.split(' ')[1];
  
            this.advanceTable.latitude=lat;
            this.advanceTable.longitude=long;
               
          }
          
          this.advanceTableForm = this.createContactForm();
          //this.advanceTableForm.controls["driverGrade"].setValue(this.advanceTable.driverGradeName);
          
        } 
        else 
        {
          this.dialogTitle = 'Driver';
          this.advanceTable = new Driver({});
          this.advanceTable.activationStatus=true;
          this.advanceTable.isAppLoginAllowed=true;
          this.advanceTable.driverOfficialIdentityNumber='N/A';
          this.advanceTable.aadharAuthenticationToken='N/A';
          this.advanceTableForm = this.createContactForm();
        }
  }
  public ngOnInit(): void
  {
    this.advanceTableForm?.controls["password"].disable();
    this.advanceTableForm?.controls["confirmPassword"].disable();

    //this.initDriverGrade();
    this.InitQualification();
    this.InitLocalCity();
    this.InitPermanentCity();
    this.InitState();
    //this.InitSupplier();
    this.InitHub();
    this.InitLocation();
    this.InitCountryISDCodes();
    this.InitCountryISDCode();
    this.InitCompany();

    this.setupConditionalDateValidators();

    if (this.action === 'edit') {
      // Show field errors immediately for incomplete/invalid DB records
      setTimeout(() => this.showAllValidationErrors(), 0);
    }
  }

  setupConditionalDateValidators(): void {
    this.onBackGroundVerificationChange(
      this.advanceTableForm?.get('driverBackGroundVerificationCheck')?.value
    );
    this.onFitnessCertificateChange(
      this.advanceTableForm?.get('driverFitnessCertificate')?.value
    );
  }

  onBackGroundVerificationChange(value: boolean): void {
    const dateControl = this.advanceTableForm?.get('driverBackGroundVerificationCheckIssueDate');
    if (!dateControl) {
      return;
    }
    if (value === true) {
      dateControl.setValidators([Validators.required]);
    } else {
      dateControl.clearValidators();
      dateControl.setValue(null);
    }
    dateControl.updateValueAndValidity({ emitEvent: false });
  }

  onFitnessCertificateChange(value: boolean): void {
    const dateControl = this.advanceTableForm?.get('driverFitnessCertificateIssueDate');
    if (!dateControl) {
      return;
    }
    if (value === true) {
      dateControl.setValidators([Validators.required]);
    } else {
      dateControl.clearValidators();
      dateControl.setValue(null);
    }
    dateControl.updateValueAndValidity({ emitEvent: false });
  }
 
  companyNameValidator(CompanyList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CompanyList.some(group => group.organizationalEntityName.toLowerCase() === value);
      return match ? null : { companyNameInvalid: true };
    };
  }

  InitCompany(){
    this._generalService.GetCompany().subscribe(
      data=>{
        this.CompanyList=data;
        this.applyControlValidators('companyName', [Validators.required,
          this.companyNameValidator(this.CompanyList)
        ]);
        this.filteredCompanyOptions = this.advanceTableForm.controls['companyName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCompany(value || ''))
        ); 
      }
    )
  }

  private _filterCompany(value: string): any {
  // if (!value || value.length < 3) {
  //   return [];   
  // }
  const filterValue = value.toLowerCase();
  return this.CompanyList.filter(customer =>
    customer.organizationalEntityName.toLowerCase().includes(filterValue)
  );
}

  // private _filterCompany(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.CompanyList.filter(
  //     customer => 
  //     {
  //       return customer.organizationalEntityName.toLowerCase().includes(filterValue);
  //     });
  // }
  OnCompanySelect(selectedCompany: string)
  {
    const CompanyName = this.CompanyList.find(
      data => data.organizationalEntityName === selectedCompany
    );
    if (selectedCompany) 
    {
      this.getCompanyID(CompanyName.organizationalEntityID);
    }
  }
  getCompanyID(companyID: any)
  {
    this.companyID=companyID;
  }

  InitCountryISDCode(){
    this._generalService.GetCountryCodes().subscribe
    (
      data=>{
        this.CountryCodesList=data;
        this.applyControlValidators('countryCode', [Validators.required,
          this.countryTypeValidator(this.CountryCodesList)
        ]);

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
      customer => 
      {
        return  customer.icon.toLowerCase().indexOf(filterValue)===0 || customer.countryISOCode.toLowerCase().indexOf(filterValue)===0 || customer.countryISDCode.toLowerCase().indexOf(filterValue)===0;
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
  InitCountryISDCodes(){
    this._generalService.GetCountryCodes().subscribe
    (
      data=>{
        this.CountryCodeList=data;
        this.applyControlValidators('countryCodes', [Validators.required,
          this.countryTypesValidator(this.CountryCodeList)
        ]);
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
      customer => 
      {
        return  customer.icon.toLowerCase().indexOf(filterValue)===0 || customer.countryISOCode.toLowerCase().indexOf(filterValue)===0 || customer.countryISDCode.toLowerCase().indexOf(filterValue)===0;
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

  InitLocalCity(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.applyControlValidators('localAddressCity', [Validators.required,
          this.cityTypeValidator(this.CityList)
        ]);
        const control = this.advanceTableForm.get('localAddressCity');
        if (control) {
          this.filteredOptions = control.valueChanges.pipe(
            startWith(""),
            map(value => this._filter(value || ''))
          );
        }
      });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CityList?.filter(
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
      this.getTitle(CityName.geoPointID);
    }
  }
  getTitle(geoPointId: any) 
  {
    this.localAddressGeoPointID=geoPointId;
  }

  cityTypeValidator(CityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { localAddressCityTypeInvalid: true };
    };
  }

  InitPermanentCity(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CitiesList=data;
        this.applyControlValidators('permanentAddressCity', [Validators.required,
          this.permanentTypeValidator(this.CitiesList)
        ]);
        const control = this.advanceTableForm.get('permanentAddressCity');
        if (control) {
          this.filteredCityOptions = control.valueChanges.pipe(
            startWith(""),
            map(value => this._filtering(value || ''))
          );
        }
      });
  }

  private _filtering(value: string): any {
    const filteringValue = value.toLowerCase();
    return this.CitiesList.filter(
      city => 
      {
        return city.geoPointName.toLowerCase().includes(filteringValue);
      });
  }
  OnPermanentAddressCitySelect(selectedPermanentAddressCity: string)
  {
    const PermanentAddressCityName = this.CitiesList.find(
      data => data.geoPointName === selectedPermanentAddressCity
    );
    if (selectedPermanentAddressCity) 
    {
      this.getTitles(PermanentAddressCityName.geoPointID);
    }
  }
  getTitles(geoPointId: any)
  {
    this.permanentGeoPointID=geoPointId;
  }

  permanentTypeValidator(CitiesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CitiesList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { permanentTypeInvalid: true };
    };
  }

  InitSupplier(){
    this._generalService.SupplierForExternal().subscribe(
      data=>
      {
        this.SupplierList=data;
        this.applyControlValidators('supplier', [Validators.required,
          this.supplieTypeValidator(this.SupplierList)
        ]);
        this.syncSupplierDisplayFromId(this.SupplierList, this.advanceTable?.supplierID);
        this.filteredSupplierOptions =this.advanceTableForm.controls['supplier'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterSupplier(value || ''))
        ); 
      });
  }

  formatSupplierDisplay = formatSupplierDisplay;

  private syncSupplierDisplayFromId(list: SupplierDropDown[], supplierId: number): void {
    const match = list?.find((item) => item.supplierID === supplierId);
    if (match) {
      this.advanceTableForm.patchValue({ supplier: formatSupplierDisplay(match) });
    }
  }

  private _filterSupplier(value: string): any {
  const filterValue = value.toLowerCase();

  return filterSuppliersByDisplay(this.SupplierList, filterValue);
}

  
  OnSupplierSelect(selectedSupplier: string)
  {
    const SupplierName = this.SupplierList.find(
      data => supplierMatchesDisplay(data, selectedSupplier)
    );
    if (SupplierName) 
    {
      this.getSupplierID(SupplierName.supplierID);
    }
  }
  getSupplierID(supplierID: any)
  {
    this.supplierID=supplierID;
    this.advanceTableForm.patchValue({supplierID:this.supplierID || this.advanceTable.supplierID});
  }

  supplieTypeValidator(SupplierList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = SupplierList.some(group => supplierMatchesDisplay(group, control.value));
      return match ? null : { supplierTypeInvalid: true };
    };
  }
  InitSupplierForOwnership()
  {
    this._generalService.SupplierForOwnershipOfOE().subscribe(
      data=>
      {
        this.SupplierForOwnershipList=data;
        
        this.advanceTableForm.patchValue({supplier:formatSupplierDisplay(this.SupplierForOwnershipList[0])});
        this.advanceTableForm.patchValue({supplierID:this.SupplierForOwnershipList[0].supplierID});
      
      });
  }

  onOwnershipChange() {
    if (this.advanceTableForm.value.ownedSupplier === 'Owned') {
      this.owned = true;
      this.supplier = false;
      this.InitSupplierForOwner();
    }
    if (this.advanceTableForm.value.ownedSupplier === 'Supplier') {
      this.owned = false;
      this.supplier = true;
      this.InitSupplier();

    }
  }

  
  supplierNameValidatorForOwner(SupplierForOwnerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = SupplierForOwnerList.some(group => supplierMatchesDisplay(group, control.value));
      return match ? null : { supplierForOwnerInvalid: true };
    };
  }

  InitSupplierForOwner()
  {
    this._generalService.SupplierForInternal().subscribe(
      data=>
      {
        this.SupplierForOwnerList=data;
        this.applyControlValidators('supplier', [Validators.required,
          this.supplierNameValidatorForOwner(this.SupplierForOwnerList)]);
        this.syncSupplierDisplayFromId(this.SupplierForOwnerList, this.advanceTable?.supplierID);
        this.filteredSupplierForOwnerOptions = this.advanceTableForm.controls['supplier'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchSupplierForOwner(value || ''))
        ); 
      });
  }
  private _filtersearchSupplierForOwner(value: string): any {
  const filterValue = value.toLowerCase();

  return filterSuppliersByDisplay(this.SupplierForOwnerList, filterValue);
}


  OnSupplierForOwnerSelect(selectedSupplier: string)
  {
    const SupplierName = this.SupplierForOwnerList.find(
      data => supplierMatchesDisplay(data, selectedSupplier)
    );
    if (SupplierName) 
    {
      this.getsupplierIDForOwner(SupplierName.supplierID);
    }
  }

  getsupplierID(supplierID: any)
  {
    this.supplierID=supplierID;
    this.advanceTableForm.patchValue({supplierID:this.supplierID || this.advanceTable.supplierID});
  }
 
  getsupplierIDForOwner(supplierID: any)
  {
    this.supplierID=supplierID;
    this.advanceTableForm.patchValue({supplierID:this.supplierID || this.advanceTable.supplierID});
  }

  InitHub(){
    this._generalService.GetHub().subscribe(
      data=>
      { 
        this.HubList=data;
        this.applyControlValidators('hub', [
          this.hubTypeValidator(this.HubList)
        ]);
        const control = this.advanceTableForm.get('hub');
        if (control) {
          this.filteredHubOptions = control.valueChanges.pipe(
            startWith(""),
            map(value => this._filterHub(value || ''))
          );
        }
      });
  }

  private _filterHub?(value: string): any {
    const filterValue = value?.toLowerCase();
    return this.HubList?.filter(
      customer => 
      {
        return customer.organizationalEntityName.toLowerCase().includes(filterValue);
      });
  }
  OnHubSelect(selectedHub: string)
  {
    const HubName = this.HubList.find(
      data => data.organizationalEntityName === selectedHub
    );
    if (selectedHub) 
    {
      this.getHubID(HubName.organizationalEntityID);
    }
  }
  getHubID(organizationalEntityID: any)
  {
    this.hubID=organizationalEntityID;
    this.advanceTableForm.patchValue({hubID:this.hubID});
  }
//   getHubID(hubId: any) {
//     this.hubID = hubId;
//     this.advanceTableForm.patchValue({ hubID: this.hubID });
// }

  hubTypeValidator(HubList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = HubList.some(group => group.organizationalEntityName.toLowerCase() === value);
      return match ? null : { hubInvalid: true };
    };
  }

  InitLocation(){
    this._generalService.GetLocation().subscribe(
      data=>
      {
        this.LocationList=data;
        this.applyControlValidators('location', [Validators.required,
          this.locationTypeValidator(this.LocationList)
        ]);
        this.filteredLocationOptions = this.advanceTableForm.controls['location'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterLocation(value || ''))
        ); 
      });
  }

  private _filterLocation(value: string): any {
  // if (!value || value.length < 3) {
  //   return [];   
  // }
  const filterValue = value.toLowerCase();
  return this.LocationList?.filter(customer =>
    customer.organizationalEntityName.toLowerCase().startsWith(filterValue)
  );
}

  // private _filterLocation(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.LocationList?.filter(
  //     customer => 
  //     {
  //       return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
  //     });
  // }
  OnLocationSelect(selectedLocation: string)
  {
    const LocationName = this.LocationList.find(
      data => data.organizationalEntityName === selectedLocation
    );
    if (selectedLocation) 
    {
      this.getLocationID(LocationName.organizationalEntityID);
    }
  }
  getLocationID(locationId: any)
  {
    this.locationID=locationId;
  }
  locationTypeValidator(LocationList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = LocationList.some(group => group.organizationalEntityName?.toLowerCase() === value);
      return match ? null : { locationTypeInvalid: true };
    };
  }

  initDriverGrade() {
    
    this._generalService.getDriverGrade().subscribe(
      data =>
      {
        this.DriverGradeList = data;
        this.advanceTableForm.controls['driverGrade'].setValidators([Validators.required,
          this.driverGradeTypeValidator(this.DriverGradeList)
        ]);
        this.advanceTableForm.controls['driverGrade'].updateValueAndValidity();

       this.filteredGradeOptions = this.advanceTableForm.controls['driverGrade'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterGrade(value || ''))
        );
      },
      error =>
      {
       
      }
    );
  }
  private _filterGrade(value: string): any {
    const filterValue = value.toLowerCase();
    return this.DriverGradeList?.filter(
      customer => 
      {
        return customer.driverGradeName.toLowerCase().indexOf(filterValue)===0;
      }
    );
    
  };
  getdriverGradeID(driverGradeID: any) {
    this.driverGradeID=driverGradeID;
  }

 driverGradeTypeValidator(DriverGradeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = DriverGradeList.some(group => group.driverGradeName?.toLowerCase() === value);
      return match ? null : { driverGradeTypeInvalid: true };
    };
  }
  InitQualification(){
    this._generalService.GetQualification().subscribe(
      data=>{
        this.QualificationList=data;
      }
    );
  }

  InitState(){
    this._generalService.getStateForInterstateTax().subscribe(
      data=>{
        this.StateLists=data;
        this.applyControlValidators('rtoState', [Validators.required,
          this.stateTypeValidator(this.StateLists)
        ]);
        const control = this.advanceTableForm.get('rtoState');
        if (control) {
          this.filteredStateOptions = control.valueChanges.pipe(
            startWith(""),
            map(value => this._filterState(value || ''))
          );
        }
      }
     
    );
  }
  private _filterState(value: string): any {
    const filterValue = value.toLowerCase();
    return this.StateLists?.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
      });
  }
  OnRTOStateSelect(selectedRTOState: string)
  {
    const RTOStateName = this.StateLists.find(
      data => data.geoPointName === selectedRTOState
    );
    if (selectedRTOState) 
    {
      this.getStateID(RTOStateName.geoPointID);
    }
  }
  getStateID(geoPointID: any) 
  {
    this.geoPointRTOID=geoPointID;
  }

  stateTypeValidator(StateLists: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = StateLists.some(group => group.geoPointName?.toLowerCase() === value);
      return match ? null : { stateTypeInvalid: true };
    };
  }

  AddressChange(address: Address) {
    const a = address as any;
    this.localAddressString = a?.formatted_address;
    const loc = a?.geometry?.location;
    if (!loc) {
      this.advanceTableForm.get('localAddressAddressString')?.updateValueAndValidity();
      return;
    }
    const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
    const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
    this.advanceTableForm.patchValue({ latitude: lat, longitude: lng });
    this.advanceTableForm.get('localAddressAddressString')?.updateValueAndValidity();
  }

   onPickupTyping() {
    this.advanceTableForm.patchValue({
      latitude: null,
      longitude: null
    });
  
    this.advanceTableForm.get('localAddressAddressString')?.updateValueAndValidity();
  }
  
  
  googlePickupValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
  
      if (!control.parent) return null;
  
      const latitude = control.parent.get('latitude')?.value;
      const value = control.value;
  
      // Agar empty hai to required handle karega
      if (!value) return null;
  
      // Agar latitude nahi hai → dropdown select nahi hua
      if (!latitude) {
        return { invalidGeoSearchString: true };
      }
  
      return null;
    };
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

  markAsTouched(controlName: string) {
    this.advanceTableForm.controls[controlName].markAsTouched();
  }

  /** Force Material to display mat-error on every invalid control. */
  showAllValidationErrors(): void {
    if (!this.advanceTableForm) {
      return;
    }
    this.advanceTableForm.markAllAsTouched();
    Object.keys(this.advanceTableForm.controls).forEach((key) => {
      const control = this.advanceTableForm.get(key);
      if (!control) {
        return;
      }
      control.markAsTouched({ onlySelf: true });
      control.markAsDirty({ onlySelf: true });
      control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });
    this.advanceTableForm.updateValueAndValidity({ emitEvent: false });
  }

  private scrollToFirstInvalidControl(): void {
    setTimeout(() => {
      const invalidControl = this.el.nativeElement.querySelector(
        '.mat-form-field.ng-invalid, .mat-mdc-form-field.ng-invalid, .ng-invalid[formcontrolname]'
      );
      if (invalidControl) {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
  }

  /** Safe apply validators then re-show errors in edit mode. */
  private applyControlValidators(controlName: string, validators: any[]): void {
    const control = this.advanceTableForm?.get(controlName);
    if (!control) {
      return;
    }
    control.setValidators(validators);
    control.updateValueAndValidity({ emitEvent: false });
    if (this.action === 'edit') {
      control.markAsTouched({ onlySelf: true });
      control.markAsDirty({ onlySelf: true });
    }
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      driverID: [this.advanceTable?.driverID],
      driverName: [this.toUpperValue(this.advanceTable?.driverName), [Validators.required]],
      //driverGradeID: [this.advanceTable?.driverGradeID],
      //driverGrade:[this.advanceTable?.driverGrade],
      driverFatherName: [this.toUpperValue(this.advanceTable?.driverFatherName), [Validators.required]],
      driverOfficialIdentityNumber: [this.advanceTable?.driverOfficialIdentityNumber],
      //aadharAuthenticationToken: [this.advanceTable?.aadharAuthenticationToken],
      dob:[this.advanceTable?.dob, [Validators.required]],
      //idMark: [this.advanceTable?.idMark],
      // password: [''],
      // confirmPassword: [''],
      countryCodes:[this.advanceTable?.countryCodes || '+91', [Validators.required]],
      countryCode:[this.advanceTable?.countryCode || '+91', [Validators.required]],
      password: ['eco'],
      confirmPassword: ['eco'],
      //highestQualificationID: [this.advanceTable?.highestQualificationID],
      //highestQualification: [this.advanceTable?.highestQualification],
      bloodGroup: [this.advanceTable?.bloodGroup, [Validators.required]],
      driverStatus: [this.advanceTable?.driverStatus, [Validators.required]],
      dateOfJoining: [this.advanceTable?.dateOfJoining, [Validators.required]],
      driverEmail: [this.advanceTable?.driverEmail],
      driverRemark: [this.advanceTable?.driverRemark],
      driverBackGroundVerificationCheck: [this.advanceTable?.driverBackGroundVerificationCheck, [Validators.required]],
      driverBackGroundVerificationCheckIssueDate: [this.advanceTable?.driverBackGroundVerificationCheckIssueDate],
      driverFitnessCertificate: [this.advanceTable?.driverFitnessCertificate, [Validators.required]],
      driverFitnessCertificateIssueDate: [this.advanceTable?.driverFitnessCertificateIssueDate],
      dateOfLeaving: [this.advanceTable?.dateOfLeaving],
      localAddressAddressString: [this.advanceTable?.localAddressAddressString,[Validators.required, this.googlePickupValidator()]],
      localAddressLatLong: [this.advanceTable?.localAddressLatLong],
      //localAddressCityID: [this.advanceTable?.localAddressCityID],
      //localAddressCity: [this.advanceTable?.localAddressCity],
      localAddress: [this.advanceTable?.localAddress, [Validators.required]],
      localPincode: [this.advanceTable?.localPincode, [Validators.required]],
      companyID: [this.advanceTable?.companyID],
      //permanentAddressCityID: [this.advanceTable?.permanentAddressCityID],
      //permanentAddressCity: [this.advanceTable?.permanentAddressCity],
      permanentAddress: [this.advanceTable?.permanentAddress, [Validators.required]],
      permanentAddressPincode: [this.advanceTable?.permanentAddressPincode, [Validators.required]],
      mobile1: [this.advanceTable?.mobile1, [Validators.required]],
      mobile2: [this.advanceTable?.mobile2],
      //hubID: [this.advanceTable?.hubID],
      //hub: [this.advanceTable?.hub],
      locationID: [this.advanceTable?.locationID],
      location: [this.advanceTable?.location, [Validators.required]],
      ownedSupplier: [this.advanceTable?.ownedSupplier, [Validators.required]],
      driverGradeName: [this.advanceTable?.driverGradeName],
      supplierID: [this.advanceTable?.supplierID],
      supplier: [this.advanceTable?.supplier],
      englishSpeakingSkills: [this.advanceTable?.englishSpeakingSkills, [Validators.required]],
      //referenceOf: [this.advanceTable?.referenceOf],
      //rtoStateID: [this.advanceTable?.rtoStateID],
      //rtoState: [this.advanceTable?.rtoState],
      policeVerification: [this.advanceTable?.policeVerification, [Validators.required]],
      driverImage: [this.advanceTable?.driverImage],
      medicalInsurance: [this.advanceTable?.medicalInsurance, [Validators.required]],
      //drivingSinceDate: [this.advanceTable?.drivingSinceDate],
      activationStatus: [this.advanceTable?.activationStatus ?? true],
      latitude: [this.advanceTable?.latitude],
      longitude: [this.advanceTable?.longitude],
      companyName:[this.advanceTable?.companyName, [Validators.required]],
      isAdhoc: [this.advanceTable?.isAdhoc, [Validators.required]],
      isAppLoginAllowed: [this.advanceTable?.isAppLoginAllowed, [Validators.required]],
      oldRentnetCode: [
        (this.advanceTable.oldRentnetCode && this.advanceTable.oldRentnetCode !== 0)
          ? this.advanceTable.oldRentnetCode : null,
        [Validators.pattern(/^[0-9]+$/)]
      ]
    
    },
    {
      validator: ConfirmPasswordValidator("password", "confirmPassword")
    }
    );
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

public loadPassword() 
{  
  this.advanceTableService.getPassword(this.referenceID, this.type).subscribe(
    (data: any) => {
      var pass = data.password;
      this.advanceTableForm?.patchValue({ password: pass });
      this.advanceTableForm?.patchValue({ confirmPassword: pass });
    },
    (error: HttpErrorResponse) => {
      // Handle error, for example:
      console.error('Failed to load password:', error.message);
    });
}
  
  submit() 
  {
    // emppty stuff
  }
  reset(): void 
  {
    this.advanceTableForm.reset();
    this.ImagePath=undefined;
  }
  onNoClick(){
    this.dialogRef.close();
    //this.ImagePath="";
  }
  public Post(): void
  {
    //this.advanceTableForm.patchValue({supplierID:this.supplierID});
    const phone1 = this.advanceTableForm.get('countryCodes').value;
    const phone2 = this.advanceTableForm.get('mobile1').value;
    const countryCodes = phone1.split('+')[1];
    const mobile1 =countryCodes+'-'+phone2
    
    const phone3 = this.advanceTableForm.get('countryCode').value;
    const phone4 = this.advanceTableForm.get('mobile2').value;
    const countryCode = phone3.split('+')[1];
    // const mobile2 =countryCode+'-'+phone4

    const mobile2 = phone4 ? `${countryCode}-${phone4}` : null;

    this.advanceTableForm.patchValue({mobile2:mobile2});
    this.advanceTableForm.patchValue({locationID:this.locationID});
    this.advanceTableForm.patchValue({mobile1:mobile1});
    this.advanceTableForm.patchValue({driverGradeID:this.driverGradeID});
    this.advanceTableForm.patchValue({rtoStateID:this.geoPointRTOID});
    this.advanceTableForm.patchValue({localAddressCityID:this.localAddressGeoPointID});
    this.advanceTableForm.patchValue({companyID:this.companyID});  
  //   this.advanceTableForm.patchValue({ 
  //     hubID: this.hubID || this.advanceTableForm.value.hubID 
  // });  
    this.advanceTableForm.patchValue({permanentAddressCityID:this.permanentGeoPointID});
    //this.advanceTableForm.patchValue({highestQualificationID:this.highestQualificationID});
    this.advanceTableForm.patchValue({localAddressAddressString:this.localAddressString});
    this.advanceTableForm.patchValue({localAddressLatLong:this.advanceTableForm.value.latitude
      +
       ',' +
       this.advanceTableForm.value.longitude
   });
    this.advanceTableForm.patchValue({ oldRentnetCode: this.getOldRentnetCode() });
    this.forceUppercase('driverName');
    this.forceUppercase('driverFatherName');
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        if (response?.activationStatus === 'Duplicate OldRentnetCode') {
          this._generalService.sendUpdate('DataNotFound:OldRentnetCodeDuplicacyError:Failure');
          this.saveDisabled = true;
          return;
        }
        if (this.handleDuplicateMobileResponse(response)) {
          return;
        }
        this.dialogRef.close();
       this._generalService.sendUpdate('DriverCreate:DriverView:Success');//To Send Updates 
       this.saveDisabled = true; 
    
    },
    error =>
    {
       this._generalService.sendUpdate('DriverAll:DriverView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    
    // this.advanceTableForm.patchValue({driverID:this.driverID || this.advanceTable.driverID});
    
    const phone3 = this.advanceTableForm.get('countryCodes').value;
    const phone4 = this.advanceTableForm.get('mobile1').value;
    const countryCodes = phone3.split('+')[1];
    const mobile1 =countryCodes+'-'+phone4

    const phone1 = this.advanceTableForm.get('countryCode').value;
    const phone2 = this.advanceTableForm.get('mobile2').value;
    const countryCode = phone1.split('+')[1];
    // const mobile2 =countryCode+'-'+phone2
     const mobile2 = phone2 ? `${countryCode}-${phone2}` : null;
    this.advanceTableForm.patchValue({mobile2:mobile2});
    this.advanceTableForm.patchValue({mobile1:mobile1});
    this.advanceTableForm.patchValue({localAddressCityID:this.localAddressGeoPointID || this.advanceTable?.localAddressCityID});
    this.advanceTableForm.patchValue({permanentAddressCityID:this.permanentGeoPointID || this.advanceTable?.permanentAddressCityID});
    this.advanceTableForm.patchValue({companyID:this.companyID || this.advanceTable?.companyID});  
    this.advanceTableForm.patchValue({hubID:this.hubID || this.advanceTable?.hubID});
    this.advanceTableForm.patchValue({locationID:this.locationID || this.advanceTable?.locationID});
    this.advanceTableForm.patchValue({driverGradeID:this.driverGradeID || this.advanceTable?.driverGradeID});
    this.advanceTableForm.patchValue({rtoStateID:this.geoPointRTOID || this.advanceTable?.rtoStateID});
    this.advanceTableForm.patchValue({localAddressAddressString:this.localAddressString || this.advanceTable?.localAddressAddressString});
   //this.advanceTableForm.patchValue({highestQualificationID:this.highestQualificationID || this.advanceTable.highestQualificationID});
    this.advanceTableForm.patchValue({localAddressLatLong:this.advanceTableForm?.value.latitude
      +
       ',' +
       this.advanceTableForm.value.longitude
   });
    this.advanceTableForm.patchValue({ oldRentnetCode: this.getOldRentnetCode() });
    this.forceUppercase('driverName');
    this.forceUppercase('driverFatherName');
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        if (response?.activationStatus === 'Duplicate OldRentnetCode') {
          this._generalService.sendUpdate('DataNotFound:OldRentnetCodeDuplicacyError:Failure');
          this.saveDisabled = true;
          return;
        }
        if (this.handleDuplicateMobileResponse(response)) {
          return;
        }
        this.dialogRef.close();
       this._generalService.sendUpdate('DriverUpdate:DriverView:Success');//To Send Updates  
       this.saveDisabled = true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('DriverAll:DriverView:Failure');//To Send Updates 
     this.saveDisabled = true; 
    }
  )
  }
  public confirmAdd(): void 
  {
    this.showAllValidationErrors();
    if (!this.advanceTableForm.valid) {
      this.scrollToFirstInvalidControl();
      this.saveDisabled = true;
      return;
    }

    this.saveDisabled = false;
    const driverStatus = this.advanceTableForm.get('driverStatus')?.value;
    if (driverStatus && String(driverStatus).toLowerCase() === 'active') {
      const mobiles = this.buildMobileValues();
      if (mobiles.mobile1 && mobiles.mobile2
        && String(mobiles.mobile1).toLowerCase() === String(mobiles.mobile2).toLowerCase()) {
        this.showDuplicateMobilePopup([], 'Mobile1 and Mobile2 cannot be the same.');
        this.advanceTableForm.get('mobile1')?.setErrors({ duplicate: true });
        this.saveDisabled = true;
        return;
      }
      const excludeDriverId = this.action === 'edit'
        ? (this.advanceTable?.driverID || -1)
        : -1;
      this._generalService.DuplicateMobileForDriver(mobiles.mobile1, mobiles.mobile2, excludeDriverId)
        .subscribe(
          response => {
            if (response?.isDuplicate) {
              this.showDuplicateMobilePopup(response.duplicates || []);
              this.advanceTableForm.get('mobile1')?.setErrors({ duplicate: true });
              if (mobiles.mobile2) {
                this.advanceTableForm.get('mobile2')?.setErrors({ duplicate: true });
              }
              this.saveDisabled = true;
              return;
            }
            this.proceedSave();
          },
          () => {
            this.proceedSave();
          }
        );
      return;
    }
    this.proceedSave();
  }

  private proceedSave(): void {
    if (this.action == 'edit') {
      this.Put();
    } else {
      this.Post();
    }
  }

  private buildMobileValues(): { mobile1: string; mobile2: string } {
    const phone1 = this.advanceTableForm.get('countryCodes')?.value || '';
    const phone2 = this.advanceTableForm.get('mobile1')?.value || '';
    const countryCodes = String(phone1).includes('+')
      ? String(phone1).split('+')[1]
      : String(phone1).replace(/^\+/, '');
    const mobile1 = phone2 ? `${countryCodes}-${phone2}` : null;

    const phone3 = this.advanceTableForm.get('countryCode')?.value || '';
    const phone4 = this.advanceTableForm.get('mobile2')?.value || '';
    const countryCode = String(phone3).includes('+')
      ? String(phone3).split('+')[1]
      : String(phone3).replace(/^\+/, '');
    const mobile2 = phone4 ? `${countryCode}-${phone4}` : null;

    return { mobile1, mobile2 };
  }

  private handleDuplicateMobileResponse(response: any): boolean {
    const status = response?.activationStatus || '';
    if (!String(status).startsWith('Duplicate:')) {
      return false;
    }
    if (String(status).includes('Mobile1 and Mobile2')) {
      this.showDuplicateMobilePopup([], status.replace(/^Duplicate:\s*/, ''));
    } else {
      this.showDuplicateMobilePopup(response?.duplicates || []);
    }
    this.advanceTableForm.get('mobile1')?.setErrors({ duplicate: true });
    this.saveDisabled = true;
    return true;
  }

  private showDuplicateMobilePopup(
    duplicates: DriverDuplicateMobileModel[],
    customMessage: string = null
  ): void {
    const esc = (value: any) => String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    const rows = (duplicates || []).map((d) => `
      <tr>
        <td style="border:1px solid #ccc;padding:6px;text-align:left;">${esc(d.driverName) || 'N/A'}</td>
        <td style="border:1px solid #ccc;padding:6px;text-align:left;">${esc(d.mobile1) || 'N/A'}</td>
        <td style="border:1px solid #ccc;padding:6px;text-align:left;">${esc(d.mobile2) || 'N/A'}</td>
        <td style="border:1px solid #ccc;padding:6px;text-align:left;">${esc(d.driverOfficialIdentityNumber) || 'N/A'}</td>
      </tr>
    `).join('');

    const tableHtml = rows
      ? `
        <p style="margin-bottom:10px;">The mobile number is already used by the following Active driver(s):</p>
        <div style="max-height:300px;overflow:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead>
              <tr>
                <th style="border:1px solid #ccc;padding:6px;text-align:left;">Driver Name</th>
                <th style="border:1px solid #ccc;padding:6px;text-align:left;">Mobile 1</th>
                <th style="border:1px solid #ccc;padding:6px;text-align:left;">Mobile 2</th>
                <th style="border:1px solid #ccc;padding:6px;text-align:left;">Official Identity No.</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `
      : `<p>${esc(customMessage) || 'Duplicate mobile number found for an Active driver.'}</p>`;

    Swal.fire({
      title: 'Duplicate Mobile Number',
      html: tableHtml,
      icon: 'error',
      confirmButtonText: 'OK',
      width: rows ? 720 : undefined
    });
  }

  getOldRentnetCode(): number | null {
    const value = this.advanceTableForm.get('oldRentnetCode')?.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    return Number(value);
  }

  toUpperValue(value: string | null | undefined): string {
    return value ? String(value).toUpperCase() : '';
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

  shouldShowActivationStatus(): boolean {
    // Create mode: always hidden (defaults to Active).
    // Edit mode: show only when current status is Deleted so it can be reactivated.
    if (this.action !== 'edit') {
      return false;
    }
    const status = this.advanceTableForm?.get('activationStatus')?.value;
    return status === false;
  }

  keyPressNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  // onBlurUpdateDate(value: string): void {
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
  
 //start date
 onBlurUpdateDate(value: string): void {
     value= this._generalService.resetDateiflessthan12(value);
   
   const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
   if (validDate) {
     const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
       this.advanceTableForm?.get('dob')?.setValue(formattedDate);    
   } else {
     this.advanceTableForm?.get('dob')?.setErrors({ invalidDate: true });
   }
 }
 
 onBlurUpdateDateEdit(value: string): void {  
   const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
   if (validDate) {
     const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
     if(this.action==='edit')
     {
       this.advanceTable.dob=formattedDate
     }
     else{
       this.advanceTableForm?.get('dob')?.setValue(formattedDate);
     }
     
   } else {
     this.advanceTableForm?.get('dob')?.setErrors({ invalidDate: true });
   }
 }
 
 //end date
 onBlurUpdateEndDate(value: string): void {
   value= this._generalService.resetDateiflessthan12(value);
 
 const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
 if (validDate) {
   const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
     this.advanceTableForm?.get('dateOfJoining')?.setValue(formattedDate);    
 } else {
   this.advanceTableForm?.get('dateOfJoining')?.setErrors({ invalidDate: true });
 }
 }
 
 onBlurUpdateEndDateEdit(value: string): void {  
 const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
 if (validDate) {
   const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
   if(this.action==='edit')
   {
     this.advanceTable.dateOfJoining=formattedDate
   }
   else{
     this.advanceTableForm?.get('dateOfJoining')?.setValue(formattedDate);
   }
   
 } else {
   this.advanceTableForm?.get('dateOfJoining')?.setErrors({ invalidDate: true });
 }
 }

 //start date
 onBlurdateOfLeaving(value: string): void {
  
  value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('dateOfLeaving')?.setValue(formattedDate);    
} else {
  if(value===""){
  this.advanceTableForm.controls['dateOfLeaving'].setValue('');
  }
  else{
    this.advanceTableForm?.get('dateOfLeaving')?.setErrors({ invalidDate: true });
  }
  
}
}

onBlurUpdatedateOfLeavingEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  if(this.action==='edit')
  {
    this.advanceTable.dateOfLeaving=formattedDate
  }
  else{
    this.advanceTableForm?.get('dateOfLeaving')?.setValue(formattedDate);
  }
  
} else {
  this.advanceTableForm?.get('dateOfLeaving')?.setErrors({ invalidDate: true });
}
}

//end date
onBlurdrivingSinceDate(value: string): void {
value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  this.advanceTableForm?.get('drivingSinceDate')?.setValue(formattedDate);    
} else {
this.advanceTableForm?.get('drivingSinceDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdatedrivingSinceDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
if(this.action==='edit')
{
  this.advanceTable.drivingSinceDate=formattedDate
}
else{
  this.advanceTableForm?.get('drivingSinceDate')?.setValue(formattedDate);
}

} else {
this.advanceTableForm?.get('drivingSinceDate')?.setErrors({ invalidDate: true });
}
}

onBlurBackGroundVerificationIssueDate(value: string): void {
  if (!value) {
    if (this.advanceTableForm?.get('driverBackGroundVerificationCheck')?.value === true) {
      this.advanceTableForm?.get('driverBackGroundVerificationCheckIssueDate')?.setErrors({ required: true });
    } else {
      this.advanceTableForm?.get('driverBackGroundVerificationCheckIssueDate')?.setValue(null);
    }
    return;
  }
  value = this._generalService.resetDateiflessthan12(value);
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm?.get('driverBackGroundVerificationCheckIssueDate')?.setValue(formattedDate);
  } else {
    this.advanceTableForm?.get('driverBackGroundVerificationCheckIssueDate')?.setErrors({ invalidDate: true });
  }
}

onBlurBackGroundVerificationIssueDateEdit(value: string): void {
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    if (this.action === 'edit') {
      this.advanceTable.driverBackGroundVerificationCheckIssueDate = formattedDate;
    } else {
      this.advanceTableForm?.get('driverBackGroundVerificationCheckIssueDate')?.setValue(formattedDate);
    }
  } else {
    this.advanceTableForm?.get('driverBackGroundVerificationCheckIssueDate')?.setErrors({ invalidDate: true });
  }
}

onBlurFitnessCertificateIssueDate(value: string): void {
  if (!value) {
    if (this.advanceTableForm?.get('driverFitnessCertificate')?.value === true) {
      this.advanceTableForm?.get('driverFitnessCertificateIssueDate')?.setErrors({ required: true });
    } else {
      this.advanceTableForm?.get('driverFitnessCertificateIssueDate')?.setValue(null);
    }
    return;
  }
  value = this._generalService.resetDateiflessthan12(value);
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm?.get('driverFitnessCertificateIssueDate')?.setValue(formattedDate);
  } else {
    this.advanceTableForm?.get('driverFitnessCertificateIssueDate')?.setErrors({ invalidDate: true });
  }
}

onBlurFitnessCertificateIssueDateEdit(value: string): void {
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    if (this.action === 'edit') {
      this.advanceTable.driverFitnessCertificateIssueDate = formattedDate;
    } else {
      this.advanceTableForm?.get('driverFitnessCertificateIssueDate')?.setValue(formattedDate);
    }
  } else {
    this.advanceTableForm?.get('driverFitnessCertificateIssueDate')?.setErrors({ invalidDate: true });
  }
}

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({driverImage:this.ImagePath})
  }

    onMobileChange(): void {
    this.checkDuplicateMobile();
  }

  onMobile2Change(): void {
    this.checkDuplicateMobile();
  }

  //-------- Check Duplicate Email & Mobile -----------------
checkDuplicateMobile() {
  const driverStatus = this.advanceTableForm.get('driverStatus')?.value;
  if (driverStatus && String(driverStatus).toLowerCase() !== 'active') {
    this.clearMobileDuplicateErrors();
    return;
  }

  const mobiles = this.buildMobileValues();
  if (!mobiles.mobile1 && !mobiles.mobile2) {
    return;
  }

  if (mobiles.mobile1 && mobiles.mobile2
    && String(mobiles.mobile1).toLowerCase() === String(mobiles.mobile2).toLowerCase()) {
    this.advanceTableForm.get('mobile1')?.setErrors({ duplicate: true });
    this.advanceTableForm.get('mobile2')?.setErrors({ duplicate: true });
    return;
  }

  const excludeDriverId = this.action === 'edit'
    ? (this.advanceTable?.driverID || -1)
    : -1;

  this._generalService.DuplicateMobileForDriver(mobiles.mobile1, mobiles.mobile2, excludeDriverId)
    .subscribe(response => {
      if (response?.isDuplicate) {
        this.advanceTableForm.get('mobile1')?.setErrors({ duplicate: true });
        if (mobiles.mobile2) {
          this.advanceTableForm.get('mobile2')?.setErrors({ duplicate: true });
        }
      } else {
        this.clearMobileDuplicateErrors();
      }
    });
}

  private clearMobileDuplicateErrors(): void {
    const mobile1Control = this.advanceTableForm.get('mobile1');
    if (mobile1Control?.hasError('duplicate')) {
      const errors = { ...(mobile1Control.errors || {}) };
      delete errors['duplicate'];
      mobile1Control.setErrors(Object.keys(errors).length ? errors : null);
    }
    const mobile2Control = this.advanceTableForm.get('mobile2');
    if (mobile2Control?.hasError('duplicate')) {
      const errors = { ...(mobile2Control.errors || {}) };
      delete errors['duplicate'];
      mobile2Control.setErrors(Object.keys(errors).length ? errors : null);
    }
  }

// onMobileChange(): void {
//   this.checkDuplicateMobile();
// }

// checkDuplicateMobile(): void {
//   const control = this.advanceTableForm.get('mobile1');
//   const mobile1 = control?.value;

//   if (mobile1) {
//     this._generalService.DuplicateMobileForDriver(mobile1).subscribe(response => {
//       if (response?.isDuplicate) {
//         control?.setErrors({ ...control.errors, duplicate: true }); // merge errors
//       } else {
//         // remove only 'duplicate' error without clearing other errors
//         const currentErrors = control?.errors;
//         if (currentErrors) {
//           delete currentErrors['duplicate'];
//           if (Object.keys(currentErrors).length === 0) {
//             control?.setErrors(null);
//           } else {
//             control?.setErrors(currentErrors);
//           }
//         }
//       }
//     });
//   }
// }

  //---------- Copy Local Address && Pin to Permanent Address && Pin
  copyAddress(isChecked: boolean) 
  {
    if (isChecked) 
    {
      this.advanceTableForm.patchValue({
        permanentAddress: this.advanceTableForm.value.localAddress,
        permanentAddressPincode: this.advanceTableForm.value.localPincode
      });
    } 
    else
    {
      this.advanceTableForm.patchValue({
        permanentAddress: '',
        permanentAddressPincode: ''
      });
    }
  }
  
}



