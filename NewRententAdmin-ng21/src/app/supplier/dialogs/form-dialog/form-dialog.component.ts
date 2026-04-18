// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { SupplierService } from '../../supplier.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidationErrors, AbstractControl, ValidatorFn} from '@angular/forms';
import { Supplier } from '../../supplier.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { SupplierDropDown } from '../../supplierDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { StatesDropDown } from 'src/app/organizationalEntity/stateDropDown.model';
import { SupplierStatusComponent } from '../supplier-status/supplier-status.component';
import { VerificationstatusComponent } from '../verification-status/verification-status.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import moment from 'moment';
import { SupplierTypeDropDownModel } from 'src/app/supplierType/supplierType.model';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntity/organizationalEntityDropDown.model';
@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: Supplier;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  isLoading: boolean = false;
  public CityLists?: CitiesDropDown[] = [];
  public StatesList?: StatesDropDown[] = [];
  public StateList?: StatesDropDown[] = [];
  public CountriesList?: StatesDropDown[] = [];
  public CountryList?: StatesDropDown[] = [];
  filteredCountryOptions: Observable<StatesDropDown[]>;
  searchCountryTerm: FormControl = new FormControl();
  filteredStateOptions: Observable<StatesDropDown[]>;
  searchStateTerm: FormControl = new FormControl();
  filteredCityOptions: Observable<CitiesDropDown[]>;
  searchCityTerm: FormControl = new FormControl();

  public SupplierTypeList?: SupplierTypeDropDownModel[] = [];
  filteredSupplierTypeOptions: Observable<SupplierTypeDropDownModel[]>;
  supplierTypeID:number;

  public CompanyList?: OrganizationalEntityDropDown[] = [];
  filteredCompanyOptions: Observable<OrganizationalEntityDropDown[]>;

  image: any;
  fileUploadEl: any;
  stateOnCityID: any;
  countryOnStateID: number;
  geoPointID: any;
  stateID: any;
  countryID: any;
  addressCityID: any;
  geoPointStateID: any;
  geoPointCityID: any;
  stateNameOnCityID: string;
  countryNameOnStateID: string;
  registrationDate: string;
  IfCreatedFromCompanyReferenceCompanyID: number;
  companyID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  public supplierStatusDialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SupplierService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Supplier';       
          this.dialogTitle ='Supplier';
          this.advanceTable = data.advanceTable;
          console.log(this.advanceTable)
          this.OnCountryChangeGetStates();
          this.OnStateChangeGetCity();
          this.getStatesBasedOnCity();
          console.log(this.advanceTable)
          // this.searchCountryTerm.setValue(this.advanceTable.country)
          this.advanceTable.supplierCode='N/A';
          // this.searchStateTerm.setValue(this.advanceTable.stateName)
          // this.searchCityTerm.setValue(this.advanceTable.city)
          this.registrationDate = moment(this.advanceTable.supplierRegistrationDate).format('DD/MM/yyyy');
          this.advanceTable.supplierRegistrationDate = this.registrationDate
        } else 
        {
          //this.dialogTitle = 'Create Supplier';
          this.dialogTitle = 'Supplier';
          this.advanceTable = new Supplier({});
          this.advanceTable.supplierStatus='N/A';
          this.advanceTable.verificationStatus='N/A';
          // this.advanceTable.supplierRegistrationDate='N/A';
          this.advanceTable.supplierCode='N/A';
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.InitCountries();
    this.InitSupplierType();
    //this.InitCompany();
  }

  OnInternalExternalChange()
  {
    debugger;
    if(this.advanceTableForm.value.internalExternal==="Internal")
    {
      this.InitCompany();
    }
    else{
      this.advanceTableForm.controls["ifCreatedFromCompanyReferenceCompany"].setValue('');
      this.advanceTableForm.controls["ifCreatedFromCompanyReferenceCompanyID"].setValue(0);
      //this.advanceTableForm.patchValue({ifCreatedFromCompanyReferenceCompanyID:0})
    }
  }

  countryValidator(CountriesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CountriesList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { countryInvalid: true };
    };
  }

  companyValidator(CompanyList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CompanyList.some(group => group.organizationalEntityName.toLowerCase() === value);
      return match ? null : { companyInvalid: true };
    };
  }

  cityValidator(CityLists: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityLists.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { cityInvalid: true };
    };
  }
  stateValidator(StateList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = StateList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { stateInvalid: true };
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
  
  openSupplierStatus(){
    // this.dialogRef.close();
    this.supplierStatusDialog.open(SupplierStatusComponent, 
    {
      data: 
        {
          supplier_ID:this.advanceTable.supplierID
        }
    });

  }
  openVerificationStatus(){
    // this.dialogRef.close();
    this.supplierStatusDialog.open(VerificationstatusComponent, 
    {
      data: 
        {
          supplier_ID:this.advanceTable.supplierID
        }
    });

  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      supplierID: [this.advanceTable.supplierID],
      supplierName: [this.advanceTable.supplierName],
      addressCityID: [this.advanceTable.addressCityID],
      address: [this.advanceTable.address],
      //pin: [this.advanceTable.pin],
      phone: [this.advanceTable.phone],
      //fax: [this.advanceTable.fax],
      email: [this.advanceTable.email],
      supplierCreatedByEmployeeID: [this.advanceTable.supplierCreatedByEmployeeID],
      ifCreatedFromCompanyReferenceCompanyID: [this.advanceTable.ifCreatedFromCompanyReferenceCompanyID],
      ifCreatedFromCompanyReferenceCompany: [this.advanceTable.ifCreatedFromCompanyReferenceCompany],
      supplierCreationRemark: [this.advanceTable.supplierCreationRemark],
      supplierStatus:[this.advanceTable.supplierStatus],
      verificationStatus:[this.advanceTable.verificationStatus],
      supplierRegistrationDate:[this.advanceTable.supplierRegistrationDate],
      stateID:[this.advanceTable.stateID],
      countryID:[this.advanceTable.countryID],
      country: [this.advanceTable.country],
      stateName: [this.advanceTable.stateName],
      city: [this.advanceTable.city],
      supplierCode:[this.advanceTable.supplierCode],
      supplierTypeID:[this.advanceTable.supplierTypeID],
      supplierType:[this.advanceTable.supplierType],
      internalExternal:[this.advanceTable.internalExternal],
      supplierOfficialIdentityNumber:[this.advanceTable.supplierOfficialIdentityNumber]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

showDetails(){
  this.dialogRef.close();
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
  public Post(): void {
    this.isLoading = true; // Start loading
    this.advanceTableForm.patchValue({
      supplierTypeID: this.supplierTypeID,
      countryID: this.geoPointID,
      stateID: this.geoPointStateID,
      addressCityID: this.geoPointCityID
    });

    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      response => {
        this.isLoading = false; // Stop loading
        this.dialogRef.close();
        this._generalService.sendUpdate('SupplierCreate:SupplierView:Success');
      },
      error => {
        this.isLoading = false; // Stop loading
        this._generalService.sendUpdate('SupplierAll:SupplierView:Failure');
      }
    );
  }

  public Put(): void {
    this.isLoading = true; // Start loading
    this.advanceTableForm.patchValue({
      supplierTypeID: this.supplierTypeID || this.advanceTable.supplierTypeID,
      countryID: this.geoPointID || this.advanceTable.countryID,
      stateID: this.geoPointStateID || this.advanceTable.stateID,
      addressCityID: this.geoPointCityID || this.advanceTable.addressCityID
    });

    this.advanceTableForm.controls['supplierRegistrationDate'].setValue(
      new Date(this.advanceTableForm.controls['supplierRegistrationDate'].value)
    );

    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
      response => {
        if(!response.success)
       {
        this.isLoading = false;
        this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
       }
       else 
       {
        this.dialogRef.close();
        this.isLoading = false;
       this._generalService.sendUpdate('SupplierUpdate:SupplierView:Success');//To Send Updates 
       } 
      },
      error => {
        this.isLoading = false; // Stop loading
        this._generalService.sendUpdate('SupplierAll:SupplierView:Failure');
      }
    );
  
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

  //  InitCountries(){
  // //   this._generalService.getCountries().subscribe(
  // //     data=>
  // //     {
  // //       this.CountriesList=data;
  // //     });
  // // }

  //---------- Supplier Type ----------
  InitSupplierType()
  {
    this._generalService.GetSupplierType().subscribe(
      data=>
      {
        this.SupplierTypeList=data;
        console.log(this.SupplierTypeList)
        this.advanceTableForm.controls['supplierType'].setValidators([Validators.required,
          this.supplierTypeValidator(this.SupplierTypeList)]);
        this.advanceTableForm.controls['supplierType'].updateValueAndValidity();
        this.filteredSupplierTypeOptions = this.advanceTableForm.controls['supplierType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterSupplierType(value || ''))
        );
      });
  }
  private _filterSupplierType(value: string): any {
    const filterValue = value.toLowerCase();
    // if (filterValue.length < 3) {
    //   return [];
    // }
    return this.SupplierTypeList.filter(
      data =>
      {
        return data.supplierType.toLowerCase().includes(filterValue);
      }
    );
  }

  onSupplierType(selectedSupplierType: string) {
    const selectedSupplier = this.SupplierTypeList.find(
      supplierType => supplierType.supplierType === selectedSupplierType
    );
  
    if (selectedSupplierType) {
      this.getSupplierTypeID(selectedSupplier.supplierTypeID);
    }
  }
  getSupplierTypeID(supplierTypeID: any) 
  {
    this.supplierTypeID=supplierTypeID;
  }
  supplierTypeValidator(SupplierTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = SupplierTypeList.some(group => group.supplierType.toLowerCase() === value);
      return match ? null : { supplierTypeInvalid: true };
    };
  }

  InitCountries(){
    this._generalService.getCountries().subscribe(
      data=>
      {
        this.CountriesList=data;
        this.advanceTableForm.controls['country'].setValidators([Validators.required,
          this.countryValidator(this.CountriesList)
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
    if (filterValue.length < 3) {
      return [];
    }
    return this.CountriesList.filter(
      customer =>
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }

  onCountrySelected(selectedCountryName: string) {
    const selectedCountry = this.CountriesList.find(
      country => country.geoPointName === selectedCountryName
    );
  
    if (selectedCountry) {
      this.getCountryID(selectedCountry.geoPointID);
    }
  }

  getCountryID(geoPointID: any) {
    this.geoPointID=geoPointID;
    this.OnCountryChangeGetStates();
      this.advanceTableForm.controls['stateName'].setValue('');
      this.advanceTableForm.controls['city'].setValue('');
  }
  
  onCountryInputChange(event: any) {
    if(event.keyCode===8){
      this.advanceTableForm.controls['stateName'].setValue('');
      this.advanceTableForm.controls['city'].setValue('');
    }
  }

 OnCountryChangeGetStates(){
  this._generalService.GetStates(this.geoPointID||this.advanceTable.countryID).subscribe(
    data =>
    {
      this.StateList = data;  
      this.advanceTableForm.controls['stateName'].setValidators([Validators.required,
        this.stateValidator(this.StateList)
      ]);
      this.advanceTableForm.controls['stateName'].updateValueAndValidity();
      this.filteredStateOptions = this.advanceTableForm.controls['stateName'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterState(value || ''))
      );
                 
    },
    error=>
    {

    }
  );

}
private _filterState(value: string): any {
  const filterValue = value.toLowerCase();
  if (filterValue.length < 3) {
    return [];
  }
  return this.StateList.filter(
    customer =>
    {
      //return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
      return customer.geoPointName.toLowerCase().includes(filterValue);
    }
  );
}

onStateSelected(selectedStateName: string) {
  const selectedState = this.StateList.find(
    state => state.geoPointName === selectedStateName
  );

  if (selectedState) {
    this.getStateID(selectedState.geoPointID);
  }
}

getStateID(geoPointID: any) {

  this.geoPointStateID=geoPointID;
  this.OnStateChangeGetCity();
  this.advanceTableForm.controls['city'].setValue('');
  }

  onStateInputChange(event: any) {
   
    if(event.keyCode===8){
      this.advanceTableForm.controls['city'].setValue('');
     }
  }

OnStateChangeGetCity(){
 
   this._generalService.GetCities(this.geoPointStateID||this.advanceTable.stateID).subscribe(
     data =>
     {
       this.CityLists = data;
       this.advanceTableForm.controls['city'].setValidators([Validators.required,
        this.cityValidator(this.CityLists)
      ]);
      this.advanceTableForm.controls['city'].updateValueAndValidity();  
       this.filteredCityOptions = this.advanceTableForm.controls['city'].valueChanges.pipe(
         startWith(""),
         map(value => this._filterCity(value || ''))
       );                  
     },
     error=>
     {

     }
   );
 }
 private _filterCity(value: string): any {
   const filterValue = value.toLowerCase();
   if (filterValue.length < 3) {
     return [];
   }
   return this.CityLists.filter(
     customer =>
     {
       return customer.geoPointName.toLowerCase().includes(filterValue);
     }
   );
 }

 onCitySelected(selectedCityName: string) {
  const selectedCity = this.CityLists.find(
    city => city.geoPointName === selectedCityName
  );
  if (selectedCity) {
    this.getCityID(selectedCity.geoPointID);
  }
}

 getCityID(geoPointID: any) {
   this.geoPointCityID=geoPointID;

 }

 InitCompany(){
  this._generalService.GetCompany().subscribe(
    data=>
    {
      this.CompanyList=data;
      // this.advanceTableForm.controls['ifCreatedFromCompanyReferenceCompany'].setValidators([Validators.required,
      //   this.companyValidator(this.CompanyList)
      // ]);
      this.advanceTableForm.controls['ifCreatedFromCompanyReferenceCompany'].updateValueAndValidity();
      this.filteredCompanyOptions = this.advanceTableForm.controls['ifCreatedFromCompanyReferenceCompany'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterCompany(value || ''))
      );
    });
}
private _filterCompany(value: string): any {
  const filterValue = value.toLowerCase();
  if (filterValue.length < 3) {
    return [];
  }
  return this.CompanyList.filter(
    customer =>
    {
      return customer.organizationalEntityName.toLowerCase().includes(filterValue);
    }
  );
}

onCompanySelected(selectedCompanyName: string) {
  debugger
  const selectedCompany = this.CompanyList.find(
    company => company.organizationalEntityName === selectedCompanyName
  );

  if (selectedCompany) {
    this.getCompanyID(selectedCompany.organizationalEntityID);
  }
}

getCompanyID(organizationalEntityID: any) {
  debugger;
  this.companyID=organizationalEntityID;
  this.advanceTableForm.patchValue({ifCreatedFromCompanyReferenceCompanyID:this.companyID});
}
  // OnCountryChangeGetStates(){ 
   
  //   this._generalService.GetStates(this.advanceTableForm.get("countryID").value).subscribe(
  //     data =>
  //     {
  //       this.StatesList = data;                    
  //     },
  //     error=>
  //     {
  
  //     }
  //   );
  
  // }
  
  // OnStateChangeGetCity(){ 
     
  //   this._generalService.GetCity(this.advanceTableForm.get('stateID').value).subscribe(
  //     data =>
  //     {
  //       this.CityList = data;                     
  //     },
  //     error=>
  //     {
  
  //     }
  //   );
  // }
  
  getStatesBasedOnCity(){ 
  
    this._generalService.GetStateOnCity(this.advanceTable.addressCityID).subscribe(
      data =>
      {
        this.StateList = data;  
        this.StateList.forEach((ele)=>{ 
              this.stateOnCityID=ele.geoPointID;
              this.stateNameOnCityID=ele.geoPointName;
              this.getCountryBasedOnState();
              //this.advanceTableForm.controls["stateID"].setValue(this.stateOnCityID); 
              this.searchStateTerm.setValue(this.stateNameOnCityID) 
              this._generalService.GetCity(this.stateOnCityID).subscribe(
                data =>
                {
                  this.CityLists = data;   
  
                },
                error=>
                {
            
                }
              );   
        })                  
      },
      error=>
      {
  
      }
    );
  
  }
  
  getCountryBasedOnState(){
    this._generalService.GetCountryForOE(this.stateOnCityID).subscribe(
      data =>
      {
 
        this.CountryList = data;
        this.CountryList.forEach((ele)=>{
          this.searchCountryTerm.setValue(ele.geoPointName);
          this.InitCountries();
      
          for(var i=0;i<this.CountriesList.length;i++){
            if(this.CountriesList[i].geoPointID===ele.geoPointID){
              this.countryOnStateID=ele.geoPointID;
              this.countryNameOnStateID=ele.geoPointName;
              this.geoPointID = ele.geoPointID;
              //this.advanceTableForm.controls["countryID"].setValue(this.countryOnStateID);
              //this.searchCountryTerm.setValue(this.countryNameOnStateID)
              this.searchCountryTerm.setValue(ele.geoPointName);
              this._generalService.GetStates(this.countryOnStateID).subscribe(
            data =>
            {
              this.StatesList = data; 
                             
            },
            error=>
            {
        
            }
          );
            }
          }
        }) 
      },    
      error=>
      {
  
      }
    );
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

//   if (/[a-zA-Z]/.supplier(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}



