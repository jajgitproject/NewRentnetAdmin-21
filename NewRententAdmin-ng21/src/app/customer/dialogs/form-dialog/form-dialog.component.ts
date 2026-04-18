// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerService } from '../../customer.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Customer } from '../../customer.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerDropDown } from '../../customerDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { VehicleCategoryDropDown } from 'src/app/vehicleCategory/vehicleCategoryDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntity/organizationalEntityDropDown.model';
import { SupplierDropDown } from 'src/app/supplier/supplierDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { ColorDropDown } from 'src/app/color/colorDropDown.model';
import { FuelTypeDropDown } from 'src/app/fuelType/fuelTypeDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { CustomerGroupDropDown } from 'src/app/customerGroup/customerGroupDropDown.model';
import { CustomerTypeDropDown } from 'src/app/customerType/customerTypeDropDown.model';
import { CustomerCategoryDropDown } from 'src/app/customerCategory/customerCategoryDropDown.model';
import { CountryDropDown } from 'src/app/general/countryDropDown.model';
import { StatesDropDown } from 'src/app/organizationalEntity/stateDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CountryCodeDropDown } from 'src/app/general/countryCodeDropDown.model';
import { BusinessTypeDropDown } from '../../businessTypeDropDown.model';

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
  advanceTable: Customer;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
  searchTerm:  FormControl = new FormControl();
  filteredOptions: Observable<CustomerGroupDropDown[]>;
  public customerGroupList?: CustomerGroupDropDown[] = [];
  
  searchTypeTerm:  FormControl = new FormControl();
  filteredTypeOptions: Observable<CustomerTypeDropDown[]>;
  public CustomerTypeList?: CustomerTypeDropDown[] = [];

  public CountriesList?: StatesDropDown[] = [];
  searchCountryTerm:  FormControl = new FormControl();
  filteredCountryOptions: Observable<StatesDropDown[]>;

  public CustomerList?: CustomerDropDown[] = [];
  public CountryCodeList?: CountryCodeDropDown[] = [];
  searchCustomerTerm:  FormControl = new FormControl();
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  searchcorporateCompany:FormControl = new FormControl();
  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
  searchLocationTerm:  FormControl = new FormControl();
  filteredLocationOptions: Observable<OrganizationalEntityDropDown[]>;
  public SupplierList?: SupplierDropDown[] = [];
  public CityList?: CitiesDropDown[] = [];
  public customerCategoryList?: CustomerCategoryDropDown[] = [];
  searchCategoryTerm:  FormControl = new FormControl();
  filteredCategoryOptions: Observable<CustomerCategoryDropDown[]>;
  public FuelTypeList?: FuelTypeDropDown[] = [];
 public StatesList?: StatesDropDown[] = [];
 public StatesLists?: StatesDropDown[] = [];

   filteredCompanyOptions: Observable<OrganizationalEntityDropDown[]>;
   public CompanyList?: OrganizationalEntityDropDown[] = [];
   filteredCountryCodeOptions: Observable<CountryCodeDropDown[]>;
   
  filteredBusinessTypeOptions: Observable<BusinessTypeDropDown[]>;
   public BusinessTypeList?: BusinessTypeDropDown[] = [];
  image: any;
  fileUploadEl: any;
  customerGroupID: any;
  customerTypeID: any;
  geoPointID: any;
  organizationalEntityID: any;
  customerCategoryID: any;
  customerID: any;
  CustomerID: any[];
  companyID: any;
  saveDisabled:boolean= true;
  businessTypeID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          console.log(data);
          this.dialogTitle ='Customer';       
          this.advanceTable = data.advanceTable;
          this.advanceTableForm = this.createContactForm();
          this.searchTerm.setValue(this.advanceTable.customerGroup);
          this.searchTypeTerm.setValue(this.advanceTable.customerType);
          this.searchCountryTerm.setValue(this.advanceTable.geoPointName);
          this.searchLocationTerm.setValue(this.advanceTable.organizationalEntityName);
          this.searchCategoryTerm.setValue(this.advanceTable.customerCategory);
          this.advanceTableForm.patchValue({customerCategoryID: this.advanceTable.customerCategoryID});
          this.searchCustomerTerm.setValue(this.advanceTable.customerName);
          //this.searchcorporateCompany.setValue(this.advanceTable.customerName);

          this.advanceTableForm.controls['maximumAgeOfCarToBeSent'].setValue(this.advanceTable.maximumAgeOfCarToBeSent);
        } else 
        {
          this.dialogTitle = 'Customer';
          this.advanceTable = new Customer({});
          this.advanceTable.activationStatus=true;
          this.advanceTableForm = this.createContactForm();
        }

        if (this.advanceTable.contactNo) {
          const mobileParts = this.advanceTable.contactNo.split('-');
          const countryCode = '+'+''+mobileParts[0];
          this.advanceTable.countryCode=countryCode;
          const contactNo = mobileParts[1];
          this.advanceTable.contactNo=contactNo;
      }
        
  }
  public ngOnInit(): void
  {
    this.initCustomerGroup();
    this.initCustomerType();
    this.InitCompany();
    this.initCustomerfor();
    this.InitBusinesstype();
    this.initCustomerCategory();
    this.initServiceLocation();
    this.InitCountries();
    this.InitCountryISDCode();
    this.onLatLonRequiredChange();
  }


  onCustomerChange(): void 
  {
    this.checkDuplicateCustomer();
  }

//-------- Check Duplicate Customer Name -----------------
checkDuplicateCustomer()
{
  const customerName = this.advanceTableForm.get('customerName').value;
  if (customerName) 
  {
    this.advanceTableService.DuplicateCustomer(customerName).subscribe(response => {
      if (response.isDuplicate) 
      {
        this.advanceTableForm.get('customerName').setErrors({ duplicate: true });
      }
      else 
      {
        if (this.advanceTableForm.get('customerName').hasError('duplicate')) 
        {
          this.advanceTableForm.get('customerName').setErrors(null);
        }
      }
    });
  }
}

  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
    }
  }

  //---------- Customer Group ----------
  customerGroupValidator(customerGroupList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = customerGroupList.some(group => group.customerGroup.toLowerCase() === value);
      return match ? null : { customerGroupInvalid: true };
    };
  }

  initCustomerGroup(){
    this._generalService.getCustomerGroup().subscribe(
      data=>{
        this.customerGroupList=data;
        this.advanceTableForm.controls['customerGroup'].setValidators([Validators.required,
          this.customerGroupValidator(this.customerGroupList)]);
        this.advanceTableForm.controls['customerGroup'].updateValueAndValidity();
        this.filteredOptions = this.advanceTableForm.controls['customerGroup'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      }
    )
  }
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.customerGroupList.filter(
      customer => 
      {
        return customer.customerGroup.toLowerCase().includes(filterValue);
      }
    );
  };
  OnCustomerGroupSelect(selectedCustomerGroup: string)
  {
    const selectedCountry = this.customerGroupList.find(
      customerGroup => customerGroup.customerGroup === selectedCustomerGroup
    );
    if (selectedCustomerGroup) 
    {
      this.getGroupID(selectedCountry.customerGroupID);
    }
  }
  getGroupID(customerGroupID: any) {
    this.customerGroupID=customerGroupID;
  }
  
  //---------- Customer Type ----------
  customerTypeValidator(CustomerTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CustomerTypeList.some(group => group.customerType.toLowerCase() === value);
      return match ? null : { customerTypeInvalid: true };
    };
  }

  initCustomerType(){
    this._generalService.getCustomerType().subscribe(
      data=>{
        this.CustomerTypeList=data;
        this.advanceTableForm.controls['customerType'].setValidators([Validators.required,
          this.customerTypeValidator(this.CustomerTypeList)
        ]);
        this.advanceTableForm.controls['customerType'].updateValueAndValidity();
        this.filteredTypeOptions = this.advanceTableForm.controls['customerType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterType(value || ''))
        );
      }
    )
  }
  private _filterType(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CustomerTypeList.filter(
      customer => 
      {
        return customer.customerType.toLowerCase().includes(filterValue);
      }
    );
  };
  OnCustomerTypeSelect(selectedCustomerType: string)
  {
    const selectedCountry = this.CustomerTypeList.find(
      customerType => customerType.customerType === selectedCustomerType
    );
    if (selectedCustomerType) 
    {
      this.getTypeID(selectedCountry.customerTypeID);
    }
  }
  getTypeID(customerTypeID: any) {
    this.customerTypeID=customerTypeID;
    if(this.advanceTableForm.value.customerType==='Individual')
    {
      this.GetCustomerIDForTarrif();
    }
  }

  //---------- Country ISD Code ----------
  InitCountryISDCode(){
    this._generalService.GetCountryCodes().subscribe
    (
      data=>{
        this.CountryCodeList=data;
        this.filteredCountryCodeOptions = this.advanceTableForm.controls['countryCode'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCountryCode(value || ''))
        ); 
      }
    );
  }
  private _filterCountryCode(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CountryCodeList.filter(
      customer => 
      {
        return  customer.icon.toLowerCase().indexOf(filterValue)===0 || customer.countryISOCode.toLowerCase().indexOf(filterValue)===0 || customer.countryISDCode.toLowerCase().indexOf(filterValue)===0;
 
      }
    );
  }

  onCountryCode(event: any): void {      
    this.advanceTableForm.patchValue({ countryCode: event.option.value });
   
  }

 CountryCodeValidator(CountryCodeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CountryCodeList.some(group => group.countryCode.toLowerCase() === value);
      return match ? null : { countryCodeInvalid: true };
    };
  }

 //--------- Company Validator --------
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
          this.companyNameValidator(this.CompanyList)]);
        this.advanceTableForm.controls['companyName'].updateValueAndValidity();
        this.filteredCompanyOptions = this.advanceTableForm.controls['companyName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCompany(value || ''))
        ); 
      }
    )
  }
  private _filterCompany(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CompanyList.filter(
      customer => 
      {
        return customer.organizationalEntityName.toLowerCase().includes(filterValue);
      }
    );
  }
  OnCompanySelect(selectedCompany: string)
  {
    const selectedCompanyName = this.CompanyList.find(
      company => company.organizationalEntityName === selectedCompany
    );
    if (selectedCompany) 
    {
      this.getCompanyID(selectedCompanyName.organizationalEntityID);
    }
  }
  getCompanyID(companyID: any) 
  {
    this.companyID=companyID;
  }

    //---------- Customer ----------
  initCustomerfor(){
    this._generalService.getCustomer().subscribe(
      data=>{
        this.CustomerList=data;
        this.advanceTableForm.controls['corporateCompanyName'].setValidators([Validators.required,
          this.corporateCompanValidator(this.CustomerList)]);
        this.filteredCustomerOptions = this.advanceTableForm.controls['corporateCompanyName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomer(value || ''))
        );
      })
  }
  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CustomerList.filter(
      customer => 
      {
        return customer.customerName.toLowerCase().includes(filterValue);
      });
  };
  OnTariffSelect(selectedTariff: string)
  {
    const selectedCustomer = this.CustomerList.find(
      customer => customer.customerName === selectedTariff
    );
    if (selectedTariff) 
    {
      this.getCustomerID(selectedCustomer.customerID);
    }
  }
  getCustomerID(customerID: any) 
  {     
    this.customerID=customerID;
    this.advanceTableForm.patchValue({corporateCompanyID:this.customerID});
  }

  corporateCompanValidator(CustomerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CustomerList.some(group => group.customerName.toLowerCase() === value);
      return match ? null : { corporateCompanyInvalid: true };
    };
  }

  //---------- Service Location ----------
  serviceLocationValidator(OrganizationalEntitiesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = OrganizationalEntitiesList.some(group => group.organizationalEntityName.toLowerCase() === value);
      return match ? null : { serviceLocationInvalid: true };
    };
  }

  initServiceLocation(){
    this._generalService.GetLocation().subscribe(
      data=>{
        this.OrganizationalEntitiesList=data;
        this.advanceTableForm.controls['serviceLocation'].setValidators([Validators.required,
          this.serviceLocationValidator(this.OrganizationalEntitiesList)
        ]);
        this.advanceTableForm.controls['serviceLocation'].updateValueAndValidity();
        this.filteredLocationOptions = this.advanceTableForm.controls['serviceLocation'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterLocation(value || ''))
        );
      })
  }
  private _filterLocation(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.OrganizationalEntitiesList.filter(
      customer => 
      {
        return customer.organizationalEntityName.toLowerCase().includes(filterValue);
      });
  };
  OnServiceLocationSelect(selectedServiceLocation: string)
  {
    const ServiceLocationName = this.OrganizationalEntitiesList.find(
      serviceLocation => serviceLocation.organizationalEntityName === selectedServiceLocation
    );
    if (selectedServiceLocation) 
    {
      this.getLocationID(ServiceLocationName.organizationalEntityID);
    }
  }
  getLocationID(organizationalEntityID: any) 
  {
    this.organizationalEntityID=organizationalEntityID;
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // InitLocationHub(){
  //   this._generalService.GetLocationHub().subscribe(
  //     data=>{
  //       this.OrganizationalEntitiesList=data;
  //     }
  //   )
  // }

  initCustomerCategory(){
    this._generalService.getCustomerCategory().subscribe(
      data=>{
        this.customerCategoryList=data;
        this.advanceTableForm.controls['customerCategory'].setValidators([Validators.required,
          this.customerCategoryValidator(this.customerCategoryList)
        ]);
        this.advanceTableForm.controls['customerCategory'].updateValueAndValidity();
        this.filteredCategoryOptions =  this.advanceTableForm.controls['customerCategory'].valueChanges.pipe(
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
    return this.customerCategoryList.filter(
      customer => 
      {
        return customer.customerCategory.toLowerCase().includes(filterValue);
      }
    );
    
  };

OnCustomerCategorySelect(selectedCustomerCategory: string)
{
  const category = this.customerCategoryList.find(
    x => x.customerCategory === selectedCustomerCategory
  );

  if (category) {
    this.customerCategoryID = category.customerCategoryID;
  }
}
  getCategoryID(customerCategoryID: any) {
     
    this.customerCategoryID=customerCategoryID;
      this.advanceTableForm.patchValue({customerCategoryID:this.customerCategoryID});
  }

 customerCategoryValidator(customerCategoryList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = customerCategoryList.some(group => group.customerCategory.toLowerCase() === value);
      return match ? null : { categoryInvalid: true };
    };
  }


  countryNameValidator(CountriesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CountriesList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { countryNameInvalid: true };
    };
  }
InitBusinesstype(){
  this._generalService.getBusniessType().subscribe(
    data=>
    {
      this.BusinessTypeList=data;
      console.log(this.BusinessTypeList);
      this.advanceTableForm.controls['businessType'].setValidators([
        this.businessTypeValidator(this.BusinessTypeList)
      ]);
      //this.advanceTableForm.controls['businessType'].updateValueAndValidity();
      this.filteredBusinessTypeOptions = this.advanceTableForm.controls['businessType'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterBusinesstype(value || ''))
      );
    });
}
private _filterBusinesstype(value: string): any {
  const filterValue = value.toLowerCase();
  // if (!value || value.length < 3) {
  //     return [];   
  //   }
  return this.BusinessTypeList.filter(
    customer =>
    {
      return customer.businessTypeName.toLowerCase().includes(filterValue);
    });
}
OnBusinessTypeSelect(selectedBusinessType: string)
{
  const BusinessTypeName = this.BusinessTypeList.find(
    data => data.businessTypeName === selectedBusinessType
  );
  if (selectedBusinessType) 
  {
    this.getBusinessTypeID(BusinessTypeName.businessTypeID);
  }
}
getBusinessTypeID(businessTypeID: any)
{
  this.businessTypeID=businessTypeID;
  this.advanceTableForm.patchValue({businessTypeID:this.businessTypeID});
  
}

  businessTypeValidator(BusinessTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null; // non-mandatory value
      }
      const normalized = value.toLowerCase();
      const match = BusinessTypeList.some(group => group.businessTypeName.toLowerCase() === normalized);
      return match ? null : { businessTypeNameInvalid: true };
    };
  }


  //---------- Country ----------
  InitCountries(){
    this._generalService.getCountries().subscribe(
      data=>
      {
        this.CountriesList=data;
        this.advanceTableForm.controls['country'].setValidators([Validators.required,
          this.countryNameValidator(this.CountriesList)
        ]);
        this.advanceTableForm.controls['country'].updateValueAndValidity();
        this.filteredCountryOptions = this.advanceTableForm.controls['country'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCountry(value || ''))
        );
      });
  }
  
  private _filterCountry(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CountriesList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }); 
  };
  OnCountrySelect(selectedCountry: string)
  {
    const selectedCountryName = this.CountriesList.find(
      country => country.geoPointName === selectedCountry
    );
    if (selectedCountry) 
    {
      this.getCountryID(selectedCountryName.geoPointID);
    }
  }
  getCountryID(geoPointID: any) 
  {   
    this.geoPointID=geoPointID;
  }

  OnCountryChangeGetStates(){ 
   
    this._generalService.GetStates(this.advanceTableForm.get("countryID").value).subscribe(
      data =>
      {
        this.StatesList = data;                    
      },
      error=>
      {
  
      }
    );
  
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
      newCustomer:[this.advanceTable.newCustomer],
      customerID: [this.advanceTable.customerID],
      customerGroupID: [this.advanceTable.customerGroupID],
      customerGroup: [this.advanceTable.customerGroup],
      customerName: [this.advanceTable.customerName],
      customerCategoryID: [this.advanceTable.customerCategoryID],
      customerTypeID: [this.advanceTable.customerTypeID],
      customerCategory :[this.advanceTable.customerCategory],
      customerType: [this.advanceTable.customerType],
      serviceLocation:[this.advanceTable.organizationalEntityName],
      corporateCompanyName: [this.advanceTable.corporateCompanyName],
      corporateCompanyID: [this.advanceTable.corporateCompanyID],
      companyName: [this.advanceTable.companyName],
      companyID: [this.advanceTable.companyID],
      countryForISDCodeID: [this.advanceTable.countryForISDCodeID],
      treatAsNewCustomerTillDate: [this.advanceTable.treatAsNewCustomerTillDate],
      customerCreationDate: [this.advanceTable.customerCreationDate],
      contactNo: [this.advanceTable.contactNo],
      email: [this.advanceTable.email],
      country: [this.advanceTable.geoPointName],
      customerPriority:[this.advanceTable.customerPriority],
      customerSector:[this.advanceTable.customerSector],
      customerCreatedByID: [this.advanceTable.customerCreatedByID],
      tallyCustomerID:[this.advanceTable.tallyCustomerID],
      serviceLocationID: [this.advanceTable.serviceLocationID],
      maximumAgeOfCarToBeSent: [],
      maximumAgeOfCarToBeSentRemark: [this.advanceTable.maximumAgeOfCarToBeSentRemark],
      customerCodeForAPIIntegration: [this.advanceTable.customerCodeForAPIIntegration],
      latLonRequired: [this.advanceTable.latLonRequired],
      locationCollectionInterval: [this.advanceTable.locationCollectionInterval],
      locationUploadInterval: [this.advanceTable.locationUploadInterval],
      countryCode:['+91'],
      activationStatus: [this.advanceTable.activationStatus],
      contactPerson:[this.advanceTable.contactPerson],
      locationOutIntervalInMinutes:[this.advanceTable.locationOutIntervalInMinutes],
      dutySlipType: [this.advanceTable.dutySlipType || 'GeneralDutySlipWithoutMap'],
      printRunningDetailOnDutySlip: [this.advanceTable.printRunningDetailOnDutySlip ?? false],
      showRateOnDutySlip: [this.advanceTable.showRateOnDutySlip ?? false],
      showOTPOnDutySlip: [this.advanceTable.showOTPOnDutySlip ?? false],
      panNo: [this.advanceTable.panNo],
      gstCustomerType: [this.advanceTable.gstCustomerType],
      segment: [this.advanceTable.segment],
      businessType: [this.advanceTable.businessType],
      businessTypeID: [this.advanceTable.businessTypeID],
      businessServices: [this.advanceTable.businessServices],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

onLatLonRequiredChange() {
  this.advanceTableForm.get('latLonRequired').valueChanges.subscribe((value) => {
    if (value) {
      this.advanceTableForm.get('locationCollectionInterval').setValidators(Validators.required);
      this.advanceTableForm.get('locationUploadInterval').setValidators(Validators.required);
    } else {
      this.advanceTableForm.get('locationCollectionInterval').clearValidators();
      this.advanceTableForm.get('locationUploadInterval').clearValidators();
    }
    this.advanceTableForm.get('locationCollectionInterval').updateValueAndValidity();
    this.advanceTableForm.get('locationUploadInterval').updateValueAndValidity();
  });
}
  submit() 
  {
    // emppty stuff
  }
  reset(): void 
  {
    this.advanceTableForm.reset();
  }

  // GetStateBasedOnCity(){
  //    
  //   this._generalService.GetStateAgainstCity(this.advanceTableForm.value.registrationCityID).subscribe(
  //     data=>{
  //       this.StatesLists=data;
  //       this.advanceTableForm.patchValue({registrationStateID:this.StateList[0].geoPointID})
  //     }
  //   );
  // }

  public Post(): void
  { 
    debugger
    this.advanceTableForm.patchValue({customerGroupID:this.customerGroupID});
    this.advanceTableForm.patchValue({customerTypeID:this.customerTypeID});
    this.advanceTableForm.patchValue({countryForISDCodeID:this.geoPointID});
    this.advanceTableForm.patchValue({serviceLocationID:this.organizationalEntityID});
    this.advanceTableForm.patchValue({customerCategoryID:this.customerCategoryID});  
    this.advanceTableForm.patchValue({companyID:this.companyID});  
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerCreate:CustomerView:Success');//To Send Updates 
       this.saveDisabled = true; 
    
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerAll:CustomerView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  {
    if(this.advanceTableForm.value.customerGroup==="")
    {
      this.advanceTableForm.patchValue({customerGroupID:0});
    }
    else{
      this.advanceTableForm.patchValue({customerGroupID:this.customerGroupID || this.advanceTable.customerGroupID});
    }
    
    this.advanceTableForm.patchValue({customerTypeID:this.customerTypeID || this.advanceTable.customerTypeID});
    this.advanceTableForm.patchValue({countryForISDCodeID:this.geoPointID || this.advanceTable.countryForISDCodeID});
    this.advanceTableForm.patchValue({serviceLocationID:this.organizationalEntityID || this.advanceTable.serviceLocationID});
    //this.advanceTableForm.patchValue({customerCategoryID:this.customerCategoryID || this.advanceTable.customerCategoryID});
    this.advanceTableForm.patchValue({companyID:this.companyID || this.advanceTable.companyID});  
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerUpdate:CustomerView:Success');//To Send Updates 
       this.saveDisabled = true; 
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerAll:CustomerView:Failure');//To Send Updates
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

  GetCustomerIDForTarrif()
  {
    this._generalService.GetCustomerID().subscribe(
      data=>
      {
        this.CustomerID=data;
        this.advanceTableForm.patchValue({corporateCompanyID:this.CustomerID});
      }
    );
  }

}

