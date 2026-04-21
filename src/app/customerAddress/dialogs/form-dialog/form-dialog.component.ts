// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerAddressService } from '../../customerAddress.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerAddress } from '../../customerAddress.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerAddressDropDown } from '../../customerAddressDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { StatesDropDown } from 'src/app/organizationalEntity/stateDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { Address } from '@compat/google-places-shim-objects/address';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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
  advanceTable: CustomerAddress;
  CustomerID:number;
  stateOnCityID: number;
  countryOnStateID:number;
  isLandmarkHidden = true;
  options: any = {
    componentRestrictions: { country: 'IN' }
  }
  saveDisabled:boolean = true;
  public CountriesList?: StatesDropDown[] = [];
  public StatesList?: StatesDropDown[] = [];
  public CityList?: CitiesDropDown[] = [];

  filteredCountryOptions: Observable<StatesDropDown[]>;
  searchCountryTerm: FormControl = new FormControl();
  filteredStateOptions: Observable<StatesDropDown[]>;
  searchStateTerm: FormControl = new FormControl();
  filteredCityOptions: Observable<CitiesDropDown[]>;
  searchCityTerm: FormControl = new FormControl();

  public StateList?: StatesDropDown[] = [];
  public CountryList?: StatesDropDown[] = [];

  image: any;
  fileUploadEl: any;
  geoStringAddress: string;
  CustomerName: any;
  geoPointID: any;
  geoPointStateID: any;
  geoPointCityID: any;
  stateNameOnCityID: string;
  countryNameOnStateID: string;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerAddressService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Address For';       
          this.advanceTable = data.advanceTable;
          this.OnCountryChangeGetStates();
          this.OnStateChangeGetCity();
          this.getStatesBasedOnCity();
          this.searchCountryTerm.setValue(this.advanceTable.country)
          this.searchStateTerm.setValue(this.advanceTable.state)
          this.searchCityTerm.setValue(this.advanceTable.city)
          var value = this.advanceTable.geoLocation.replace(
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
          this.dialogTitle = 'Address For';
          this.advanceTable = new CustomerAddress({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.CustomerID=this.data.CustomerID;
        this.CustomerName=this.data.CustomerName;
  }
  public ngOnInit(): void
  {
    this.InitCountries();
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

  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
    }
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerAddressID: [this.advanceTable.customerAddressID],
      customerID: [this.advanceTable.customerID],
      isItBaseAddress: [this.advanceTable.isItBaseAddress],
      cityID: [this.advanceTable.cityID],
      pin: [this.advanceTable.pin],
      completeAddress: [this.advanceTable.completeAddress],
      landMark: [this.advanceTable.landMark],
      addressStringForMap: [this.advanceTable.addressStringForMap],
      geoLocation: [this.advanceTable.geoLocation],
      latitude: [this.advanceTable.latitude],
      longitude: [this.advanceTable.longitude],
      countryID: [this.advanceTable.countryID],
      country: [this.advanceTable.country],
      stateID: [this.advanceTable.stateID],
      state: [this.advanceTable.state],
      city: [this.advanceTable.city],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

AddressChange(address: Address) {
  this.geoStringAddress=address.formatted_address
  this.advanceTableForm.patchValue({latitude:address.geometry.location.lat()});
  this.advanceTableForm.patchValue({longitude:address.geometry.location.lng()}); 
}

// InitCountries(){
//   this._generalService.getCountries().subscribe(
//     data=>
//     {
//       this.CountriesList=data;
//     });
// }

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

countryNameValidator(CountriesList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = CountriesList.some(group => group.geoPointName.toLowerCase() === value);
    return match ? null : { countryNameInvalid: true };
  };
}

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
  //     return [];   
  //   }
  return this.CountriesList.filter(
    customer =>
    {
      return customer.geoPointName.toLowerCase().includes(filterValue);
    });
}
OnCountrySelect(selectedCountry: string)
{
  const CountryName = this.CountriesList.find(
    data => data.geoPointName === selectedCountry
  );
  if (selectedCountry) 
  {
    this.getCountryID(CountryName.geoPointID);
  }
}
getCountryID(geoPointID: any)
{
  this.geoPointID=geoPointID;
  this.OnCountryChangeGetStates();
  this.advanceTableForm.controls['state'].setValue('');
  this.advanceTableForm.controls['city'].setValue('');
}

onCountryInputChange(event: any) {
  if(event.keyCode===8){
    this.advanceTableForm.controls['state'].setValue('');
    this.advanceTableForm.controls['city'].setValue('');
   }

}

stateNameValidator(StatesList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = StatesList.some(group => group.geoPointName.toLowerCase() === value);
    return match ? null : { stateNameInvalid: true };
  };
}

OnCountryChangeGetStates(){
  this._generalService.GetStates(this.geoPointID||this.advanceTable.countryID).subscribe(
    data =>
    {
      this.StatesList = data;
      this.advanceTableForm.controls['state'].setValidators([Validators.required,
        this.stateNameValidator(this.StatesList)
      ]);
      this.advanceTableForm.controls['state'].updateValueAndValidity();
      this.filteredStateOptions = this.advanceTableForm.controls['state'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterState(value || ''))
      );              
    },
    error=>{}
  );
}
private _filterState(value: string): any {
const filterValue = value.toLowerCase();
// if (!value || value.length < 3) {
//       return [];   
//     }
return this.StatesList?.filter(
  customer =>
  {
    return customer.geoPointName.toLowerCase().includes(filterValue);
  });
}
OnStateSelect(selectedState: string)
{
  const StateName = this.StatesList.find(
    data => data.geoPointName === selectedState
  );
  if (selectedState) 
  {
    this.getStateID(StateName.geoPointID);
  }
}
getStateID(geoPointID: any) 
{
this.geoPointStateID=geoPointID;
this.OnStateChangeGetCity();
this.advanceTableForm.controls['city'].setValue('');
}

onStateInputChange(event: any) {
  if(event.keyCode===8){
    this.advanceTableForm.controls['city'].setValue('');
   }
}

cityNameValidator(CityList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = CityList.some(group => group.geoPointName.toLowerCase() === value);
    return match ? null : { cityNameInvalid: true };
  };
}

OnStateChangeGetCity(){
 this._generalService.GetCities(this.geoPointStateID|| this.advanceTable.stateID).subscribe(
   data =>
   {
     this.CityList = data; 
     this.advanceTableForm.controls['city'].setValidators([Validators.required,
      this.cityNameValidator(this.CityList)
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
//  if (!value || value.length < 3) {
//       return [];   
//     }
 return this.CityList.filter(
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
    this.getCityID(CityName.geoPointID);
  }
}
getCityID(geoPointID: any) 
{
 this.geoPointCityID=geoPointID;
}

getStatesBasedOnCity(){ 
 
  this._generalService.GetStateOnCity(this.advanceTable.cityID).subscribe(
    data =>
    {
      this.StateList = data;  
      this.StateList.forEach((ele)=>{     
           
            this.stateOnCityID=ele.geoPointID;
            this.stateNameOnCityID=ele.geoPointName;
            this.getCountryBasedOnState();
            // this.searchStateTerm.setValue(this.stateNameOnCityID)
            this.advanceTableForm.patchValue({state:this.stateNameOnCityID});
            //this.advanceTableForm.controls["stateID"].setValue(this.stateOnCityID);  
            this._generalService.GetCity(this.stateOnCityID).subscribe(
              data =>
              {
                this.CityList = data;   

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
        this.InitCountries();
        for(var i=0;i<this.CountriesList.length;i++){
          if(this.CountriesList[i].geoPointID===ele.geoPointID){
            this.countryOnStateID=ele.geoPointID;
            this.countryNameOnStateID=ele.geoPointName;
            this.geoPointID = ele.geoPointID;
            // this.searchCountryTerm.setValue(this.countryNameOnStateID)
            this.advanceTableForm.patchValue({country:this.countryNameOnStateID});
         
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

  submit() 
  {
    // emppty stuff
  }
  reset(): void 
  {
    this.advanceTableForm.reset();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({customerID:this.CustomerID});
    this.advanceTableForm.patchValue({countryID:this.geoPointID});
    this.advanceTableForm.patchValue({stateID:this.geoPointStateID});
    this.advanceTableForm.patchValue({cityID:this.geoPointCityID});
    this.advanceTableForm.patchValue({geoLocation:this.advanceTableForm.value.latitude
      +
       ',' +
       this.advanceTableForm.value.longitude
   });
   this.advanceTableForm.patchValue({addressStringForMap:this.geoStringAddress});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerAddressCreate:CustomerAddressView:Success');//To Send Updates 
       this.saveDisabled = true; 
    
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerAddressAll:CustomerAddressView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({customerID:this.advanceTable.customerID});
    this.advanceTableForm.patchValue({countryID:this.geoPointID || this.advanceTable.countryID});
    this.advanceTableForm.patchValue({stateID:this.geoPointStateID || this.advanceTable.stateID});
    this.advanceTableForm.patchValue({cityID:this.geoPointCityID || this.advanceTable.cityID});
    this.advanceTableForm.patchValue({geoLocation:this.advanceTableForm.value.latitude
      +
       ',' +
       this.advanceTableForm.value.longitude
   });
   this.advanceTableForm.patchValue({addressStringForMap:this.geoStringAddress || this.advanceTable.addressStringForMap});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerAddressUpdate:CustomerAddressView:Success');//To Send Updates  
       this.saveDisabled = true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerAddressAll:CustomerAddressView:Failure');//To Send Updates
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

//   if (/[a-zA-Z]/.customerAddress(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}

