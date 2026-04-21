// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
// import { CustomerShortService } from '../../customershort.service';
import { CustomerShortService } from '../../customerShort.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerShort } from '../../customerShort.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { CustomerDropDown } from '../../customerDropDown.model';
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
import { CustomerDropDown } from 'src/app/customer/customerDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { CustomerDropDown } from '../../customerDropDown.model';
@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogCustomerShortComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerShort;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  searchTerm:  FormControl = new FormControl();
  filteredOptions: Observable<CustomerGroupDropDown[]>;
  public customerGroupList?: CustomerGroupDropDown[] = [];
  public CustomerIndividualList?: CustomerGroupDropDown[] = [];
  
  searchTypeTerm:  FormControl = new FormControl();
  filteredTypeOptions: Observable<CustomerTypeDropDown[]>;
  public CustomerTypeList?: CustomerTypeDropDown[] = [];

  public CountriesList?: StatesDropDown[] = [];
  searchCountryTerm:  FormControl = new FormControl();
  filteredCountryOptions: Observable<StatesDropDown[]>;

  public CustomerList?: CustomerDropDown[] = [];
  searchCustomerTerm:  FormControl = new FormControl();
  filteredCustomerOptions: Observable<CustomerDropDown[]>;

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

  image: any;
  fileUploadEl: any;
  customerGroupID: any;
  customerTypeID: any;
  geoPointID: any;
  organizationalEntityID: any;
  customerCategoryID: any;
  customerID: any;
  serviceLocationID: any;
  countryForISDCodeID: any;
  CustomerGroupID: any;
  CustomerGroup: any;
  individual:boolean=false;
  corporate:boolean=true;

  constructor(
  public dialogRef: MatDialogRef<FormDialogCustomerShortComponent>, 
  private snackBar: MatSnackBar,
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerShortService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
    this.CustomerGroupID= data.customerGroupID,
        this.CustomerGroup =data.customerGroup,
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Customer';       
          this.advanceTable = data.advanceTable;
          this.searchTerm.setValue(this.advanceTable.customerGroup);
          this.searchTypeTerm.setValue(this.advanceTable.customerType);
          this.searchCountryTerm.setValue(this.advanceTable.geoPointName);
          this.searchLocationTerm.setValue(this.advanceTable.organizationalEntityName);
          this.searchCategoryTerm.setValue(this.advanceTable.customerCategory);
          this.searchCustomerTerm.setValue(this.advanceTable.customerName);
        } else 
        {
          this.dialogTitle = 'Customer';
          this.advanceTable = new CustomerShort({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.advanceTableForm.patchValue({ customerID: data.advanceTable?.customerID });
       // this.advanceTableForm.patchValue({ customerGroupID: data.advanceTable?.customerGroupID });
        this.advanceTableForm.patchValue({customerTypeID:data.advanceTable?.customerTypeID});
        this.advanceTableForm.patchValue({countryForISDCodeID:data.advanceTable?.countryForISDCodeID});
        this.advanceTableForm.patchValue({serviceLocationID:data.advanceTable?.serviceLocationID});
        this.advanceTableForm.patchValue({customerCategoryID: data.advanceTable?.customerCategoryID});
        this.advanceTableForm.patchValue({corporateCompanyID:data.advanceTable?.corporateCompanyID});
  }
  public ngOnInit(): void
  {
    this.initCustomerType();
   
    this.initCompany();
    //this.initCustomerfor();
    // this.InitLocationHub();
    //this.initCustomerCategory();
    this.initServiceLocation();
    this.InitCountries();
  }
  onCustomerTypeChanges(event:any){
    if(event.keyCode===8){
      this.advanceTableForm.controls['customerGroup'].setValue('');
     }

  }

  initCustomerGroup(){
    this._generalService.GetCustomerForCorporate(this.customerTypeID).subscribe(
      data=>{
        this.customerGroupList=data;``
        this.filteredCustomerOptions = this.advanceTableForm.controls['customerGroup'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      }
    )
  }
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.customerGroupList.filter(
      customer => 
      {
        return customer.customerGroup.toLowerCase().indexOf(filterValue)===0;
      }
    );
    
  };
  getCustomerTierID(customerGroupID: any) {
    this.customerGroupID = customerGroupID;
    this.advanceTableForm.patchValue({customerGroupID:this.customerGroupID});
  }

  InitCustomerGroupForIndividual()
  {
    this._generalService.GetCustomerForIndividual().subscribe(
      data=>
      {
        this.customerGroupList=data;
        
        this.advanceTableForm.patchValue({customerGroup:this.customerGroupList[0].customerGroup});
        this.advanceTableForm.patchValue({customerGroupID:this.customerGroupList[0].customerGroupID});
      
      });
  }


  onCustomerTypeChange()
  {
    debugger;
    if(this.advanceTableForm.value.customerType==='Corporate Individual')
    {
      this.corporate=true;
      this.individual=false;
      this.advanceTableForm.controls["customerGroup"].setValue("");
     
    }
    if(this.advanceTableForm.value.customerType==='Individual')
    {
      this.corporate=false;
      this.individual=true;
      this.InitCustomerGroupForIndividual();
    }
  }

  // initCustomerGroup(){
  //   this._generalService.getCustomerGroup().subscribe(
  //     data=>{
  //       this.customerGroupList=data;
  //     }
  //   )
  // }

  initCustomerType(){
    this._generalService.getCustomerTypeForReservation().subscribe(
      data=>{
        this.CustomerTypeList=data;
        this.filteredTypeOptions = this.advanceTableForm.controls['customerType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterType(value || ''))
        );
      }
    )
  }
  private _filterType(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CustomerTypeList.filter(
      customer => 
      {
        return customer.customerType.toLowerCase().indexOf(filterValue)===0;
      }
    );
    
  };
  getTypeID(customerTypeID: any) {
    debugger
    this.customerTypeID=customerTypeID;
    this.initCustomerGroup();
  }

  // initCustomerType(){
  //   this._generalService.getCustomerType().subscribe(
  //     data=>{
  //       this.CustomerTypeList=data;
  //     }
  //   )
  // }

  // initServiceLocation(){
  //   this._generalService.GetOrganizationalBranch().subscribe(
  //     data=>{
  //       this.OrganizationalEntitiesList=data;
  //     }
  //   )
  // }

  initCompany(){
    this._generalService.GetCompany().subscribe(
      data=>{
        this.OrganizationalEntityList=data;
      }
    )
  }

  // initCustomerfor(){
  //   this._generalService.getCustomer().subscribe(
  //     data=>{
  //       this.CustomerList=data;
  //       this.filteredCustomerOptions = this.advanceTableForm.controls['corporateCompany'].valueChanges.pipe(
  //         startWith(""),
  //         map(value => this._filterCustomer(value || ''))
  //       );
  //       //console.log(this.CustomerList)
  //     }
  //   )
    
  // }

  // private _filterCustomer(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.CustomerList.filter(
  //     customer => 
  //     {
  //       return customer.customerName.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
    
  // };
  // getCustomerID(customerID: any) {
  //   debugger
  //   this.customerID=customerID;
  // }

  initServiceLocation(){
    this._generalService.GetOrganizationalBranch().subscribe(
      data=>{
        this.OrganizationalEntitiesList=data;
        this.filteredLocationOptions = this.advanceTableForm.controls['serviceLocation'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterLocation(value || ''))
        );
      }
    )
  }

  private _filterLocation(value: string): any {
    const filterValue = value.toLowerCase();
    return this.OrganizationalEntitiesList.filter(
      customer => 
      {
        return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
      }
    );
    
  };
  getLocationID(organizationalEntityID: any) {
    debugger
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

  // initCustomerCategory(){
  //   this._generalService.getCustomerCategory().subscribe(
  //     data=>{
  //       this.customerCategoryList=data;
  //       this.filteredCategoryOptions =  this.advanceTableForm.controls['customerCategory'].valueChanges.pipe(
  //         startWith(""),
  //         map(value => this._filterCategory(value || ''))
  //       );
  //     }
  //   )
  //   //console.log(this.customerCategoryList)
  // }
  // private _filterCategory(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.customerCategoryList.filter(
  //     customer => 
  //     {
  //       return customer.customerCategory.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
    
  // };
  // getCategoryID(customerCategoryID: any) {
  //   debugger;
  //   this.customerCategoryID=customerCategoryID;
  // }

  // InitCountries(){
  //   this._generalService.getCountries().subscribe(
  //     data=>{
  //       this.CountriesList=data;
  //     }
  //   )
  // }

  InitCountries(){
    this._generalService.getCountries().subscribe(
      data=>
      {
        this.CountriesList=data;
        this.filteredCountryOptions = this.advanceTableForm.controls['country'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCountry(value || ''))
        );
      });
  }
  
  private _filterCountry(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CountriesList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
    
  };
  getCountryID(geoPointID: any) { 
    this.geoPointID=geoPointID;;
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
      customerID: [this.advanceTable.customerID],
      customerGroupID: [this.advanceTable.customerGroupID],
      customerGroup: [this.advanceTable.customerGroup],
      customerName: [this.advanceTable.customerName],
      customerCategoryID: [this.advanceTable.customerCategoryID],
      customerTypeID: [this.advanceTable.customerTypeID],
      customerCategory :[this.advanceTable.customerTypeID],
      customerType: [this.advanceTable.customerType],
      serviceLocation:[this.advanceTable.customerType],
      corporateCompany: [this.advanceTable.customerType],
      corporateCompanyID: [this.advanceTable.corporateCompanyID],
      countryForISDCodeID: [this.advanceTable.countryForISDCodeID],
      contactNo: [this.advanceTable.contactNo],
      email: [this.advanceTable.email],
      country: [this.advanceTable.country],
      customerCreatedByID: [this.advanceTable.customerCreatedByID],
      serviceLocationID: [this.advanceTable.serviceLocationID],
      customerCodeForAPIIntegration: [this.advanceTable.customerCodeForAPIIntegration],
      activationStatus: [this.advanceTable.activationStatus],
    });
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

  // GetStateBasedOnCity(){
  //   debugger;
  //   this._generalService.GetStateAgainstCity(this.advanceTableForm.value.registrationCityID).subscribe(
  //     data=>{
  //       this.StatesLists=data;
  //       this.advanceTableForm.patchValue({registrationStateID:this.StateList[0].geoPointID})
  //     }
  //   );
  // }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public Post(): void
  { 
    
    this.advanceTableForm.patchValue({customerTypeID:this.customerTypeID});
    this.advanceTableForm.patchValue({countryForISDCodeID:this.geoPointID});
    this.advanceTableForm.patchValue({serviceLocationID:this.organizationalEntityID});
    this.advanceTableForm.patchValue({customerCategoryID:this.customerCategoryID});
    this.advanceTableForm.patchValue({corporateCompanyID:this.customerID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
          this.dialogRef.close();
          this.showNotification(
            'snackbar-success',
            'Customer Short Successfully...!!!',
            'bottom',
            'center'
          );
         this._generalService.sendUpdate('CustomerShortUpdate:CustomerPersonUpdate:Success');//To Send Updates  
         
      },
      error =>
      {
       this._generalService.sendUpdate('CustomerShortUpdate:CustomerPersonUpdate:Failure');//To Send Updates 
       this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      ); 
      }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({customerGroupID:this.customerGroupID || this.advanceTable.customerGroupID});
    this.advanceTableForm.patchValue({customerTypeID:this.customerTypeID || this.advanceTable.customerTypeID});
    this.advanceTableForm.patchValue({countryForISDCodeID:this.geoPointID || this.advanceTable.countryForISDCodeID});
    this.advanceTableForm.patchValue({serviceLocationID:this.organizationalEntityID || this.advanceTable.serviceLocationID});
    this.advanceTableForm.patchValue({customerCategoryID:this.customerCategoryID || this.advanceTable.customerCategoryID});
    this.advanceTableForm.patchValue({corporateCompanyID:this.customerID || this.advanceTable.corporateCompanyID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerUpdate:CustomerView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerAll:CustomerView:Failure');//To Send Updates  
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

}


