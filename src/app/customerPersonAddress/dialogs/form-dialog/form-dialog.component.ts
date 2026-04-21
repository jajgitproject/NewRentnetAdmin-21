// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerPersonAddressService } from '../../customerPersonAddress.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidationErrors, ValidatorFn, AbstractControl} from '@angular/forms';
import { CustomerPersonAddress } from '../../customerPersonAddress.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerPersonAddressDropDown } from '../../customerPersonAddressDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { Address } from '@compat/google-places-shim-objects/address';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { StatesDropDown } from 'src/app/organizationalEntity/stateDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
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
  advanceTable: CustomerPersonAddress; 
  public CityList?: CitiesDropDown[] = [];
  public StatesList?: StatesDropDown[] = [];
  public StateList?: StatesDropDown[] = [];
  public CountriesList?: StatesDropDown[] = [];
  public CountryList?: StatesDropDown[] = [];
  saveDisabled:boolean=true;

  // public CountriesList?: StatesDropDown[] = [];
  // public StatesList?: StatesDropDown[] = [];
  // public CityList?: CitiesDropDown[] = [];

  filteredCountryOptions: Observable<StatesDropDown[]>;
  searchCountryTerm: FormControl = new FormControl();
  filteredStateOptions: Observable<StatesDropDown[]>;
  searchStateTerm: FormControl = new FormControl();
  filteredCityOptions: Observable<CityDropDown[]>;
  searchCityTerm: FormControl = new FormControl();
  public CityLists?: CityDropDown[] = [];

  options: any = {
    componentRestrictions: { country: 'IN' }
  }

  image: any;
  fileUploadEl: any;
  addressString: string;
  isRowHidden=true;
  customerPersonName: any;
  stateOnCityID: number;
  countryOnStateID: number;
  geoPointCityID: any;
  geoPointStateID: any;
  geoPointID: any;
  stateNameOnCityID: string;
  countryNameOnStateID: string;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerPersonAddressService,
    private fb: FormBuilder,
    private el: ElementRef,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Saved Address for';       
          this.advanceTable = data.advanceTable;
          this.searchCityTerm.setValue(this.advanceTable.city)
          this.searchCountryTerm.setValue(this.advanceTable.country)
          this.searchStateTerm.setValue(this.advanceTable.state)
          this.InitCity();
          // this.OnCountryChangeGetStates();
          // this.OnStateChangeGetCity();
          // this.getStatesBasedOnCity();
          var value = this.advanceTable.latLong.replace(
            '(',
            ''
          );
          value = value.replace(')', '');
          var lat = value.split(' ')[2];
          var long = value.split(' ')[1];

          this.advanceTable.latitude=lat;
          this.advanceTable.longitude=long;
        } else 
        {
          this.dialogTitle = 'Saved Address for';
          this.advanceTable = new CustomerPersonAddress({});
          this.advanceTable.activationStatus=true;

        }
        this.advanceTableForm = this.createContactForm();
        this.customerPersonName=data.CustomerPersonName;
  }
  public ngOnInit(): void
  {
    this.InitCity();
  }

  

  // InitCountries(){
  //   this._generalService.getCountries().subscribe(
  //     data=>
  //     {
  //       this.CountriesList=data;
  //       this.advanceTableForm.controls['country'].setValidators([Validators.required,
  //         this.countryValidator(this.CountriesList)
  //       ]);
  //       this.advanceTableForm.controls['country'].updateValueAndValidity();
  //       this.filteredCountryOptions = this.advanceTableForm.controls['country'].valueChanges.pipe(
  //         startWith(""),
  //         map(value => this._filterCountry(value || ''))
  //       );
  //     });
  // }
  // private _filterCountry(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.CountriesList.filter(
  //     customer =>
  //     {
  //       return customer.geoPointName.toLowerCase().includes(filterValue);
  //     });
  // }
  // OnCountrySelect(selectedCountry: string)
  // {
  //   const CountryName = this.CountriesList.find(
  //     data => data.geoPointName === selectedCountry
  //   );
  //   if (selectedCountry) 
  //   {
  //     this.getCountryID(CountryName.geoPointID);
  //   }
  // }
  // getCountryID(geoPointID: any)
  // {
  //   this.geoPointID=geoPointID;
  //   this.OnCountryChangeGetStates();
  // }
  // onCountryInputChanges(event:any){
  //   if(event.keyCode===8){
  //     this.advanceTableForm.controls['state'].setValue('');
  //     this.advanceTableForm.controls['city'].setValue('');
  //    }

  // }
  
  // OnCountryChangeGetStates(){
  // this._generalService.GetStates(this.geoPointID||this.advanceTable.countryID).subscribe(
  //   data =>
  //   {
  //     this.StatesList = data;  
  //     this.advanceTableForm.controls['state'].setValidators([Validators.required,
  //       this.stateValidator(this.StatesList)
  //     ]);
  //     this.advanceTableForm.controls['state'].updateValueAndValidity();
  //     this.filteredStateOptions = this.advanceTableForm.controls['state'].valueChanges.pipe(
  //       startWith(""),
  //       map(value => this._filterState(value || ''))
  //     );              
  //   },
  //   error=>
  //   {
  
  //   }
  // );
  
  // }
  // private _filterState(value: string): any {
  // const filterValue = value.toLowerCase();
  // return this.StatesList.filter(
  //   customer =>
  //   {
  //     return customer.geoPointName.toLowerCase().includes(filterValue);
  //   });
  // }
  // OnStateSelect(selectedState: string)
  // {
  //   const StateName = this.StatesList.find(
  //     data => data.geoPointName === selectedState
  //   );
  //   if (selectedState) 
  //   {
  //     this.getStateID(StateName.geoPointID);
  //   }
  // }
  // getStateID(geoPointID: any)
  // {
  //   this.geoPointStateID=geoPointID;
  //   this.OnStateChangeGetCity();
  // }
  // onStateInputChanges(event:any){
  //  if(event.keyCode===8){
  //   this.advanceTableForm.controls['city'].setValue('');
  //  }
  // }
  
  // OnStateChangeGetCity(){
  //  this._generalService.GetCities(this.geoPointStateID|| this.advanceTable.stateID).subscribe(
  //    data =>
  //    {
  //      this.CityList = data;  
  //      this.advanceTableForm.controls['city'].setValidators([Validators.required,
  //       this.cityValidator(this.CityList)
  //     ]);
  //     this.advanceTableForm.controls['city'].updateValueAndValidity();
  //      this.filteredCityOptions = this.advanceTableForm.controls['city'].valueChanges.pipe(
  //        startWith(""),
  //        map(value => this._filterCity(value || ''))
  //      );                  
  //    },
  //    error=>
  //    {
  
  //    }
  //  );
  // }
  // private _filterCity(value: string): any {
  //  const filterValue = value.toLowerCase();
  //  return this.CityList.filter(
  //    customer =>
  //    {
  //      return customer.geoPointName.toLowerCase().includes(filterValue);
  //    });
  // }
  // OnCitySelect(selectedCity: string)
  // {
  //   const CityName = this.CityList.find(
  //     data => data.geoPointName === selectedCity
  //   );
  //   if (selectedCity) 
  //   {
  //     this.getCityID(CityName.geoPointID);
  //   }
  // }
  // getCityID(geoPointID: any)
  // {
  //  this.geoPointCityID=geoPointID;
  
  // }

  // getStatesBasedOnCity(){ 
  //   this._generalService.GetStateOnCity(this.advanceTable.cityID).subscribe(
  //     data =>
  //     {
  //       this.StateList = data;  
  //       this.StateList.forEach((ele)=>{         
  //             this.stateOnCityID=ele.geoPointID;
  //             this.stateNameOnCityID=ele.geoPointName;
  //             this.getCountryBasedOnState();
  //             this.searchStateTerm.setValue(this.stateNameOnCityID)
  //             //this.advanceTableForm.controls["stateID"].setValue(this.stateOnCityID);  
  //             // if (this.action === 'edit' || !this.advanceTable.country || !this.advanceTable.state) {
  //             this._generalService.GetCity(this.stateOnCityID).subscribe(
  //               data =>
  //               {
  //                 this.CityList = data;   
  
  //               },
  //               error=>
  //               {
            
  //               }
  //             ); 
               
  //       })                  
  //     },
  //     error=>
  //     {
  
  //     }
  //   );
  
  // }
  
  // getCountryBasedOnState(){
  //   this._generalService.GetCountryForOE(this.stateOnCityID).subscribe(
  //     data =>
  //     {
  //       this.CountryList = data;
  //       this.CountryList.forEach((ele)=>{
  //         this.InitCountries();
  //         for(var i=0;i<this.CountriesList.length;i++){
  //           if(this.CountriesList[i].geoPointID===ele.geoPointID){
  //             this.countryOnStateID=ele.geoPointID;
  //             this.countryNameOnStateID=ele.geoPointName;
           
  //           this.searchCountryTerm.setValue(this.countryNameOnStateID)
  //             this._generalService.GetStates(this.countryOnStateID).subscribe(
  //           data =>
  //           {
  //             this.StatesList = data;                 
  //           },
  //           error=>
  //           {
        
  //           }
  //         );
  //           }
  //         }
  //       }) 
  //     },    
  //     error=>
  //     {
  
  //     }
  //   );
  // }


  InitCity() {
    this._generalService.GetCitiessAll().subscribe(
      data => {
        this.CityLists = data;
        this.advanceTableForm.controls['city'].setValidators([Validators.required,
        this.cityNameValidator(this.CityLists)
        ]);
        this.advanceTableForm.controls['city'].updateValueAndValidity();
        this.filteredCityOptions = this.advanceTableForm.controls["city"].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        );
      },
      error => {

      }
    );
  }
  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3)
     {
        return [];   
      }
    return this.CityLists.filter(
      customer => {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      });
  }
  OnCitySelect(selectedCity: string)
  {
    const CityName = this.CityLists.find(
      data => data.geoPointName === selectedCity
    );
    if (selectedCity) 
    {
      this.getCityID(CityName.geoPointID);
    }
  }
  getCityID(geoPointID: any)
  {
    this.geoPointCityID = geoPointID;
    this.onCityChangeGetState();
    this.onCityChangeGetCountry();
    this.advanceTableForm.controls['country'].setValue('');
    this.advanceTableForm.controls['state'].setValue('');
  }
  onCityInputChange(event: any) {
    if (event.target.value.length === 0) {
      this.advanceTableForm.controls['country'].setValue('');
      this.advanceTableForm.controls['state'].setValue('');

    }
  }

  cityNameValidator(CityLists: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityLists.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { cityNameInvalid: true };
    };
  }
  onCityChangeGetState() {
    this._generalService.GetStateOnCity(this.geoPointCityID || this.advanceTable.cityID).subscribe(
      data => {
        this.StateList = data;
        this.advanceTableForm.controls['state'].setValidators([Validators.required,
        this.stateNameValidator(this.StateList)
        ]);
        this.advanceTableForm.controls['state'].updateValueAndValidity();
        this.advanceTableForm.patchValue({ state: this.StateList[0].geoPointName });
        this.advanceTableForm.controls["state"].disable();
        this.filteredStateOptions = this.advanceTableForm.controls["state"].valueChanges.pipe(
          startWith(""),
          map(value => this._filterState(value || ''))
        );
      }
    );
  }

  private _filterState(value: string): any {
    const filterValue = value.toLowerCase();
    return this.StateList.filter(
      customer => {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }
  OnStateSelect(selectedState: string)
  {
    const StateName = this.StateList.find(
      data => data.geoPointName === selectedState
    );
    if (selectedState) 
    {
      this.getStateID(StateName.geoPointID);
    }
  }
  getStateID(geoPointID: any) {
    this.geoPointStateID = geoPointID;

  }
  stateNameValidator(StateList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = StateList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { stateNameInvalid: true };
    };
  }

  onCityChangeGetCountry() {
    this._generalService.GetCountries(this.geoPointCityID || this.advanceTable.cityID).subscribe(
      data => {
        this.CountryList = data;
        this.advanceTableForm.controls['country'].setValidators([Validators.required,
        this.countryNameValidator(this.CountriesList)
        ]);
        this.advanceTableForm.controls['country'].updateValueAndValidity();
        this.advanceTableForm.patchValue({ country: this.CountryList[0].geoPointName });
        this.advanceTableForm.controls["country"].disable();
        this.filteredCountryOptions = this.advanceTableForm.controls["country"].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCountry(value || ''))
        );
      }
    );
  }

  private _filterCountry(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CountryList.filter(
      customer => {
        return customer.geoPointName.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }
  countryNameValidator(CountriesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CountriesList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { countryNameInvalid: true };
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
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerPersonAddressID: [this.advanceTable.customerPersonAddressID],
      customerPersonID: [this.advanceTable.customerPersonID],
      isFavourite: [this.advanceTable.isFavourite],
      cityID: [this.advanceTable.cityID],
      address: [this.advanceTable.address],
      pin: [this.advanceTable.pin],
      landMark: [this.advanceTable.landMark],
      addressStringForMap: [this.advanceTable.addressStringForMap,this.googlePickupValidator()],
      latLong: [this.advanceTable.latLong],
      addressType: [this.advanceTable.addressType],
      addressName: [this.advanceTable.addressName],
      latitude:[this.advanceTable.latitude],
      longitude:[this.advanceTable.longitude],
      stateID:[this.advanceTable.stateID],
      countryID:[this.advanceTable.countryID],
      country:[this.advanceTable.country],
      state:[this.advanceTable.state],
      city:[this.advanceTable.city],
      activationStatus: [this.advanceTable.activationStatus]
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
 onNoClick():void{
  this.dialogRef.close();
 }
 AddressChange(address: Address) {
  this.addressString = address.formatted_address;

  this.advanceTableForm.patchValue({
    latitude: address.geometry.location.lat(),
    longitude: address.geometry.location.lng()
  });

  this.advanceTableForm.get('addressStringForMap')?.updateValueAndValidity();
}


  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
onPickupTyping() {
  this.advanceTableForm.patchValue({
    latitude: null,
    longitude: null
  });
  this.advanceTableForm.get('addressStringForMap')?.updateValueAndValidity();

}


  googlePickupValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent) return null;

    const latitude = control.parent.get('latitude')?.value;
    const value = control.value;

    if (!value) return null;

    return latitude ? null : { invalidGeoSearchString: true };
  };
}

  public Post(): void
  {
    this.advanceTableForm.patchValue({latLong:this.advanceTableForm.value.latitude
      +
       ',' +
       this.advanceTableForm.value.longitude
   });
   this.advanceTableForm.patchValue({addressStringForMap:this.addressString});
   this.advanceTableForm.patchValue({customerPersonID:this.data.CustomerPersonID});
   this.advanceTableForm.patchValue({countryID:this.geoPointID});
   this.advanceTableForm.patchValue({stateID:this.geoPointStateID});
   this.advanceTableForm.patchValue({cityID:this.geoPointCityID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerPersonAddressCreate:CustomerPersonAddressView:Success');
       this.saveDisabled = true;//To Send Updates  
      if(this.data.forCPA==='CPA')
      {
        this.saveDisabled = true;
        this.showNotification(
          'snackbar-success',
          'Customer Person Address Created ...!!!',
          'bottom',
          'center'
        );
      }
    },
    error =>
    {
      if(this.data.forCPA==='CPA')
      {
        this.saveDisabled = true;
        this.showNotification(
          'snackbar-danger',
          'Operation Failed.....!!!',
          'bottom',
          'center'
        );
      }
       this._generalService.sendUpdate('CustomerPersonAddressAll:CustomerPersonAddressView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({latLong:this.advanceTableForm.value.latitude
      +
       ',' +
       this.advanceTableForm.value.longitude
   });
   this.advanceTableForm.patchValue({addressStringForMap:this.addressString || this.advanceTable.addressStringForMap});
   this.advanceTableForm.patchValue({customerPersonID:this.advanceTable.customerPersonID});
   this.advanceTableForm.patchValue({countryID:this.geoPointID || this.advanceTable.countryID});
    this.advanceTableForm.patchValue({stateID:this.geoPointStateID || this.advanceTable.stateID});
    this.advanceTableForm.patchValue({cityID:this.geoPointCityID || this.advanceTable.cityID});
   this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerPersonAddressUpdate:CustomerPersonAddressView:Success');//To Send Updates
       this.saveDisabled = true;  
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerPersonAddressAll:CustomerPersonAddressView:Failure');//To Send Updates
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

//   if (/[a-zA-Z]/.customerPersonAddress(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}


