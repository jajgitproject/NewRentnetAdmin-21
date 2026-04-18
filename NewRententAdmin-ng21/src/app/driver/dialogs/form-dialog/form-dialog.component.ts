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
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { AllCitiesDropDown } from 'src/app/customerPersonDrivingLicense/allCitiesDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, } from '@angular/forms';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { SupplierDropDown } from 'src/app/supplier/supplierDropDown.model';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntityMessage/organizationalEntityDropDown.model';
import { DriverGradeDropDown } from 'src/app/driverGrade/driverGradeDropDown.model';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { HttpErrorResponse } from '@angular/common/http';
import { DriverModel } from 'src/app/CarAndDriverAllotment/CarAndDriverAllotment.model';
import { CountryCodeDropDown } from 'src/app/general/countryCodeDropDown.model';
import {  ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';

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
          console.log(this.advanceTable);
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
        this.advanceTableForm.controls['companyName'].setValidators([Validators.required,
          this.companyNameValidator(this.CompanyList)
        ]);
        this.advanceTableForm.controls['companyName'].updateValueAndValidity();
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
        this.advanceTableForm.controls['localAddressCity'].setValidators([Validators.required,
          this.cityTypeValidator(this.CityList)
        ]);
        this.advanceTableForm.controls['localAddressCity'].updateValueAndValidity();

        this.filteredOptions = this.advanceTableForm.controls['localAddressCity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
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
        this.advanceTableForm.controls['permanentAddressCity'].setValidators([Validators.required,
          this.permanentTypeValidator(this.CitiesList)
        ]);
        this.advanceTableForm.controls['permanentAddressCity'].updateValueAndValidity();
        this.filteredCityOptions =this.advanceTableForm.controls['permanentAddressCity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtering(value || ''))
        ); 
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
        this.advanceTableForm.controls['supplier'].setValidators([Validators.required,
          this.supplieTypeValidator(this.SupplierList)
        ]);
        this.advanceTableForm.controls['supplier'].updateValueAndValidity();
        this.filteredSupplierOptions =this.advanceTableForm.controls['supplier'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterSupplier(value || ''))
        ); 
      });
  }

  private _filterSupplier(value: string): any {
  // if (!value || value.length < 3) {
  //   return [];
  // }
  const filterValue = value.toLowerCase();

  return this.SupplierList.filter(customer =>
    customer.supplierName.toLowerCase().includes(filterValue)
  );
}

  
  OnSupplierSelect(selectedSupplier: string)
  {
    const SupplierName = this.SupplierList.find(
      data => data.supplierName === selectedSupplier
    );
    if (selectedSupplier) 
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
      const match = SupplierList.some(group => group.supplierName?.toLowerCase() === value);
      return match ? null : { supplierTypeInvalid: true };
    };
  }
  InitSupplierForOwnership()
  {
    this._generalService.SupplierForOwnershipOfOE().subscribe(
      data=>
      {
        this.SupplierForOwnershipList=data;
        
        this.advanceTableForm.patchValue({supplier:this.SupplierForOwnershipList[0].supplierName});
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
      const match = SupplierForOwnerList.some(group => group.supplierName.toLowerCase() === value);
      return match ? null : { supplierForOwnerInvalid: true };
    };
  }

  InitSupplierForOwner()
  {
    this._generalService.SupplierForInternal().subscribe(
      data=>
      {
        this.SupplierForOwnerList=data;
        this.advanceTableForm.controls['supplier'].setValidators([Validators.required,
          this.supplierNameValidatorForOwner(this.SupplierForOwnerList)]);
        this.advanceTableForm.controls['supplier'].updateValueAndValidity();
        this.filteredSupplierForOwnerOptions = this.advanceTableForm.controls['supplier'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchSupplierForOwner(value || ''))
        ); 
      });
  }
  private _filtersearchSupplierForOwner(value: string): any {
  // if (!value || value.length < 3) {
  //   return [];
  // }
  const filterValue = value.toLowerCase();

  return this.SupplierForOwnerList.filter(data =>
    data.supplierName.toLowerCase().includes(filterValue)
  );
}


  OnSupplierForOwnerSelect(selectedSupplier: string)
  {
    const SupplierName = this.SupplierForOwnerList.find(
      data => data.supplierName === selectedSupplier
    );
    if (selectedSupplier) 
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
        this.advanceTableForm.controls['hub'].setValidators([
          this.hubTypeValidator(this.HubList)
        ]);
        this.advanceTableForm.controls['hub'].updateValueAndValidity();
        this.filteredHubOptions = this.advanceTableForm.controls['hub'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterHub(value || ''))
        ); 
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
//     console.log('Selected Hub ID:', this.hubID);
//     this.advanceTableForm.patchValue({ hubID: this.hubID });
//     console.log('Patched Form Value:', this.advanceTableForm.value);
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
        this.advanceTableForm.controls['location'].setValidators([Validators.required,
          this.locationTypeValidator(this.LocationList)
        ]);
        this.advanceTableForm.controls['location'].updateValueAndValidity();
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
        this.advanceTableForm.controls['rtoState'].setValidators([Validators.required,
          this.stateTypeValidator(this.StateLists)
        ]);
        this.advanceTableForm.controls['rtoState'].updateValueAndValidity();
        this.filteredStateOptions = this.advanceTableForm.controls['rtoState'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterState(value || ''))
        ); 
       
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
    this.localAddressString=address.formatted_address
    this.advanceTableForm.patchValue({latitude:address.geometry.location.lat()});
    this.advanceTableForm.patchValue({longitude:address.geometry.location.lng()}); 
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
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      driverID: [this.advanceTable?.driverID],
      driverName: [this.advanceTable?.driverName],
      //driverGradeID: [this.advanceTable?.driverGradeID],
      //driverGrade:[this.advanceTable?.driverGrade],
      driverFatherName: [this.advanceTable?.driverFatherName],
      driverOfficialIdentityNumber: [this.advanceTable?.driverOfficialIdentityNumber],
      //aadharAuthenticationToken: [this.advanceTable?.aadharAuthenticationToken],
      dob:[this.advanceTable?.dob],
      //idMark: [this.advanceTable?.idMark],
      // password: [''],
      // confirmPassword: [''],
      countryCodes:['+91'],
      countryCode:['+91'],
      password: ['eco'],
      confirmPassword: ['eco'],
      //highestQualificationID: [this.advanceTable?.highestQualificationID],
      //highestQualification: [this.advanceTable?.highestQualification],
      bloodGroup: [this.advanceTable?.bloodGroup],
      driverStatus: [this.advanceTable?.driverStatus],
      dateOfJoining: [this.advanceTable?.dateOfJoining],
      //driverEmail: [this.advanceTable?.driverEmail],
      dateOfLeaving: [this.advanceTable?.dateOfLeaving],
      localAddressAddressString: [this.advanceTable?.localAddressAddressString,[this.googlePickupValidator()]],
      localAddressLatLong: [this.advanceTable?.localAddressLatLong],
      //localAddressCityID: [this.advanceTable?.localAddressCityID],
      //localAddressCity: [this.advanceTable?.localAddressCity],
      localAddress: [this.advanceTable?.localAddress],
      localPincode: [this.advanceTable?.localPincode],
      companyID: [this.advanceTable?.companyID],
      //permanentAddressCityID: [this.advanceTable?.permanentAddressCityID],
      //permanentAddressCity: [this.advanceTable?.permanentAddressCity],
      permanentAddress: [this.advanceTable?.permanentAddress],
      permanentAddressPincode: [this.advanceTable?.permanentAddressPincode],
      mobile1: [this.advanceTable?.mobile1],
      mobile2: [this.advanceTable?.mobile2],
      //hubID: [this.advanceTable?.hubID],
      //hub: [this.advanceTable?.hub],
      locationID: [this.advanceTable?.locationID],
      location: [this.advanceTable?.location],
      ownedSupplier: [this.advanceTable?.ownedSupplier],
      driverGradeName: [this.advanceTable?.driverGradeName],
      supplierID: [this.advanceTable?.supplierID],
      supplier: [this.advanceTable?.supplier],
      englishSpeakingSkills: [this.advanceTable?.englishSpeakingSkills],
      //referenceOf: [this.advanceTable?.referenceOf],
      //rtoStateID: [this.advanceTable?.rtoStateID],
      //rtoState: [this.advanceTable?.rtoState],
      policeVerification: [this.advanceTable?.policeVerification],
      driverImage: [this.advanceTable?.driverImage],
      medicalInsurance: [this.advanceTable?.medicalInsurance],
      //drivingSinceDate: [this.advanceTable?.drivingSinceDate],
      activationStatus: [this.advanceTable?.activationStatus],
      latitude: [this.advanceTable?.latitude],
      longitude: [this.advanceTable?.longitude],
      companyName:[this.advanceTable?.companyName],
    
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
    debugger
    
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
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
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
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
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
  debugger;
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

  //-------- Check Duplicate Email & Mobile -----------------
checkDuplicateMobile() {
  const mobile1 = '91-' + this.advanceTableForm.get('mobile1').value;

  if (mobile1) {
    this._generalService.DuplicateMobileForDriver(mobile1).subscribe(response => {
      if (response.isDuplicate) 
      {
        this.advanceTableForm.get('mobile1').setErrors({ duplicate: true });
      }
      else 
      {
        if (this.advanceTableForm.get('mobile1').hasError('duplicate')) 
        {
          this.advanceTableForm.get('mobile1').setErrors(null);
        }
      }
    });
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



