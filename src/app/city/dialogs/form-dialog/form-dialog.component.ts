// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CityService } from '../../city.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { City } from '../../city.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CityGroupDropDown } from 'src/app/general/cityGroupDropDown.model';
import { CountryDropDown } from 'src/app/general/countryDropDown.model';
import { CityTierDropDown } from 'src/app/cityTier/cityTierDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
// import { CountryDropDown } from 'src/app/country/countryDropDown.model';

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
  advanceTable: City;
  public CountryList?: CountryDropDown[] = [];

  public CountriesList?: CountryDropDown[] = [];
  searchCountryTerm:  FormControl = new FormControl();
  filteredCountryOptions: Observable<CountryDropDown[]>;
  public StateList?: CountryDropDown[] = [];
  searchStateTerm:  FormControl = new FormControl();
  filteredStateOptions: Observable<CountryDropDown[]>;
  public CityGroupList?: CityGroupDropDown[] = [];
  filteredOptions: Observable<CityGroupDropDown[]>;
  searchTerm:  FormControl = new FormControl();

  public CityList?: any[] = [];

  public CityTierList?: CityTierDropDown[] = [];
  searchTierTerm:  FormControl = new FormControl();
  filteredTierOptions: Observable<CityTierDropDown[]>;

  userAddress: string = ''
  userLatitude: string = ''
  userLongitude: string = ''
  formattedAddress = '';
  options = {
    componentRestrictions: {
      country: ['IN']
    }
  }
  geoStringAddress: any;
  geoStateId: number;
  geoCountryId: number;
  existingCountryID: number;
  cityGroupID: any;
  geoPointID: any;
  geoPointStateID: any;
  cityTierID: any;
  stateNameOnCityID: string;
  countryNameOnStateID: string;
  saveDisabled:boolean = true;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: CityService,
    private fb: FormBuilder,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'City';
      this.advanceTable = data.advanceTable;
    
      //this.advanceTableForm.patchValue({cityGroup:this.advanceTable.cityGroup});
      //this.advanceTableForm.controls["cityGroup"].setValue(this.advanceTable.cityGroup);
      //this.advanceTableForm.patchValue({state:this.advanceTable.state});

      this.searchStateTerm.setValue(this.advanceTable.state);
      this.searchTerm.setValue(this.advanceTable.cityGroup);
      this.searchTierTerm.setValue(this.advanceTable.cityTierName)
      this._generalService.GetCountries(this.advanceTable.geoPointID).subscribe(
        data => {
          this.CountriesList = data;
          this.CountriesList.forEach((ele) => {
            this._generalService.getCountries().subscribe(
              data => {
                this.CountryList = data;
               
                for (var i = 0; i < this.CountryList.length; i++) {
                  this.existingCountryID = this.CountryList[i].geoPointID;
                  this.countryNameOnStateID=ele.geoPointName;
                  this.advanceTableForm.patchValue({country:this.countryNameOnStateID});
                 
                 // this.searchCountryTerm.setValue(this.countryNameOnStateID)
                  // if (this.existingCountryID === ele.geoPointID) {
                    
                  //   //this.advanceTableForm.controls["countryID"].setValue(ele.geoPointID);
                  // }
                }
                
              },
              error => {

              }
            );

          });
        },
        error => {

        }
      );

      this.ImagePath = this.advanceTable.bannerImage;
      this.ImagePath1 = this.advanceTable.icon;
      var value = this.advanceTable.geoLocation.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];

      this.advanceTable.latitude = lat;
      this.advanceTable.longitude = long;
    } else {
      this.dialogTitle = 'City';
      this.advanceTable = new City({});
      this.advanceTable.activationStatus = true;
    }
    this.advanceTableForm = this.createContactForm();
   
    this.advanceTableForm.patchValue({cityGroup:this.advanceTable.cityGroup});
    this.advanceTableForm.patchValue({state:this.advanceTable.state});
  
  }
  public ngOnInit(): void {
    this.advanceTableForm.patchValue({cityGroupID:0});
    this.InitCityGroup();
    this.InitCountries();
    this.InitCityTier();
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        geoPointID: [this.advanceTable.geoPointID],
        geoPointParentID: [this.advanceTable.geoPointParentID,],
        geoLocation: [this.advanceTable.geoLocation],
        geoSearchString: [this.advanceTable.geoSearchString,[this.googlePickupValidator()]],
        geoPointName: [this.advanceTable.geoPointName],
        longitude: [this.advanceTable.longitude],
        state: [this.advanceTable.state],
        cityGroup: [this.advanceTable.cityGroup],
        latitude: [this.advanceTable.latitude],
        cityGroupID: [this.advanceTable.cityGroupID],
        country: [this.advanceTable.country],
        cityTierID: [this.advanceTable.cityTierID],
        cityTierName: [this.advanceTable.cityTierName],
        oldRentNetGeoPointName: [this.advanceTable.oldRentNetGeoPointName],
        citySTDCode: [this.advanceTable.citySTDCode],
        bannerImage: [this.advanceTable.bannerImage],
        apiIntegrationCode: [this.advanceTable.apiIntegrationCode,],
        bannerImageAltTag: [this.advanceTable.bannerImageAltTag],
        icon: [this.advanceTable.icon],
        iconAltTag: [this.advanceTable.iconAltTag],
        countryID: [this.advanceTable.countryID],
        activationStatus: [this.advanceTable.activationStatus],
        googlePlacesID:[this.advanceTable.googlePlacesID]
      });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() {
   
  }
  onNoClick(): void {
    
    if(this.action==='add'){
      this.advanceTableForm.reset();
      this.ImagePath="";
      this.ImagePath1="";

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
  }
  public Post(): void {
    this.advanceTableForm.patchValue({
      geoLocation: this.advanceTableForm.value.latitude
        +
        ',' +
        this.advanceTableForm.value.longitude
    });
    this.advanceTableForm.patchValue({ geoSearchString: this.geoStringAddress });
    
    this.advanceTableForm.patchValue({cityGroupID:this.cityGroupID});
    this.advanceTableForm.patchValue({geoPointParentID:this.geoPointStateID});

    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) 
          {
            this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
            this.saveDisabled = true;
          }
          else
          {
            this.dialogRef.close();
            this._generalService.sendUpdate('CityCreate:CityView:Success');//To Send Updates  
            this.saveDisabled = true;
          } 
        },
        error => {
          this._generalService.sendUpdate('CityAll:CityView:Failure');//To Send Updates 
          this.saveDisabled = true; 
        }
      )
  }
  public Put(): void {
  
    this.advanceTableForm.patchValue({
      geoLocation: this.advanceTableForm.value.latitude
        +
        ',' +
        this.advanceTableForm.value.longitude
    });
    this.advanceTableForm.patchValue({geoSearchString: this.geoStringAddress || this.advanceTable.geoSearchString });
    //this.advanceTableForm.patchValue({geoPointID:this.geoPointID});
    if(this.advanceTableForm.value.cityGroup==="")
    {
      this.advanceTableForm.patchValue({cityGroupID:0});
    }
    else{
      this.advanceTableForm.patchValue({cityGroupID:this.cityGroupID || this.advanceTable.cityGroupID});
    }
    this.advanceTableForm.patchValue({geoPointParentID:this.geoPointStateID || this.advanceTable.geoPointParentID });
    this.advanceTableForm.patchValue({cityTierID:this.cityTierID || this.advanceTable.cityTierID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) 
          {
            this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
            this.saveDisabled = true;
          } 
          else
          {
            this.dialogRef.close();
            this._generalService.sendUpdate('CityUpdate:CityView:Success');//To Send Updates  
            this.saveDisabled = true;
          }
        },
        error => {
          this._generalService.sendUpdate('CityAll:CityView:Failure');//To Send Updates  
          this.saveDisabled = true;
        }
      )
  }
  public confirmAdd(): void {
    this.saveDisabled = false;
    if (this.action == "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }

  InitStates() {
    this._generalService.GetStates(this.geoPointID).subscribe(
      data => {
        ;
        this.StateList = data;
        this.advanceTableForm.controls['state'].setValidators([Validators.required,
          this.stateNameValidator(this.StateList)
        ]);
        this.advanceTableForm.controls['state'].updateValueAndValidity();
      
        this.filteredStateOptions = this.advanceTableForm.controls['state'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterState(value || ''))
        );
      },
      error => {

      }
    );
  }
 private _filterState(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.StateList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }
  onStateSelected(selectedStateName: string) {
    const selectedState = this.StateList.find(
      data => data.geoPointName === selectedStateName
    );
  
    if (selectedState) {
      this.getStateID(selectedState.geoPointID);
    }
  }

  getStateID(geoPointID: any) {
    this.geoPointStateID=geoPointID;
  }

  stateNameValidator(StatesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = StatesList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { stateNameInvalid: true };
    };
  }

  InitCountries() {
    this._generalService.getCountries().subscribe(
      data => {
        this.CountryList = data;
        this.advanceTableForm.controls['country'].setValidators([Validators.required,
          this.countryNameValidator(this.CountryList)
        ]);
        this.advanceTableForm.controls['country'].updateValueAndValidity();
        for (var i = 0; i < this.CountryList.length; i++) {
          this.existingCountryID = this.CountryList[i].geoPointID;
        }
        this.filteredCountryOptions = this.advanceTableForm.controls['country'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCountry(value || ''))
        );
      },
      error => {

      }
    );
  }
  private _filterCountry(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CountryList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }
  onCountrySelected(selectedCountryName: string) {
    const selectedCountry = this.CountryList.find(
      data => data.geoPointName === selectedCountryName
    );
  
    if (selectedCountry) {
      this.getCountryID(selectedCountry.geoPointID);
    }
  }
  getCountryID(geoPointID: any) {
    this.geoPointID=geoPointID;
   
    this.InitStates();
    //this.OnCountryChangeGetStates();
    this.advanceTableForm.controls['state'].setValue('');
    this.advanceTableForm.controls['geoSearchString'].setValue('');
  }

  onCountryInputChanges(event:any){
    if(event.keyCode===8){
      this.advanceTableForm.controls['state'].setValue('');
      this.advanceTableForm.controls['geoSearchString'].setValue('');
     }

  }

  countryNameValidator(CountryList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CountryList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { countryNameInvalid: true };
    };
  }
  // InitCites() {

  //   this._generalService.GetCityAll().subscribe(
  //     data =>
  //     {
  //       this.CityList = data;
  //     }   
  //   );
  // }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  public uploadFinished = (event) => {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({ bannerImage: this.ImagePath })
  };

  public responses: { dbPath: '' };
  public ImagePath1: string = "";
  public uploadICon = (event) => {
    this.responses = event;
    this.ImagePath1 = this._generalService.getImageURL() + this.responses.dbPath;
    this.advanceTableForm.patchValue({ icon: this.ImagePath1 })
  }

 public handleAddressChange(address: any) {

  this.formattedAddress = address.formatted_address;
  this.geoStringAddress = address.formatted_address;

  this.advanceTableForm.patchValue({
    latitude: address.geometry.location.lat(),
    longitude: address.geometry.location.lng(),
    googlePlacesID: address.place_id
  });

  // Sirf revalidate karo
  this.advanceTableForm.get('geoSearchString')?.updateValueAndValidity();
}



onPickupTyping() {
  this.advanceTableForm.patchValue({
    latitude: null,
    longitude: null
  });

  this.advanceTableForm.get('geoSearchString')?.updateValueAndValidity();
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




  InitCityGroup() {

    this._generalService.GetCitiesAll().subscribe(
      data => {
        this.CityGroupList = data;
        this.advanceTableForm.controls['cityGroup'].setValidators([this.cityGroupValidator(this.CityGroupList)
        ]);
        this.advanceTableForm.controls['cityGroup'].updateValueAndValidity();

        this.filteredOptions = this.advanceTableForm.controls['cityGroup'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      }
    );
  }
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CityGroupList.filter(
      customer => 
      {
        return customer.cityGroup.toLowerCase().includes(filterValue);
      }
    );
  }
  onCityGroupSelected(selectedCityGroupName: string) {
    const selectedCityGroup = this.CityGroupList.find(
      data => data.cityGroup === selectedCityGroupName
    );  
    if (selectedCityGroup) {
      this.getGroupID(selectedCityGroup.cityGroupID);
    }
  }

  getGroupID(cityGroupID: any) {
    this.cityGroupID=cityGroupID;
    //this.advanceTableForm.patchValue({cityGroupID:this.cityGroupID});
  }

  cityGroupValidator(CityGroupList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = CityGroupList.some(group => group.cityGroup.toLowerCase() === value);
      return match ? null : { cityGroupInvalid: true };
    };
  }

  InitCityTier() {
    this._generalService.GetCityTiers().subscribe(
      data => {
        this.CityTierList = data;
        this.advanceTableForm.controls['cityTierName'].setValidators([Validators.required,
          this.cityTierTypeValidator(this.CityTierList)
        ]);
        this.advanceTableForm.controls['cityTierName'].updateValueAndValidity();

        this.filteredTierOptions = this.advanceTableForm.controls['cityTierName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterTier(value || ''))
        );
      }
    )
  }
  private _filterTier(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.CityTierList.filter(
      customer => 
      {
        return customer.cityTierName.toLowerCase().includes(filterValue);
      }
    );
  };

  onCityTierSelected(selectedCityTierName: string) {
    const selectedCityTier = this.CityTierList.find(
      data => data.cityTierName === selectedCityTierName
    );  
    if (selectedCityTier) {
      this.getTierID(selectedCityTier.cityTierID);
    }
  }

  getTierID(cityTierID: any) {
    this.cityTierID=cityTierID;
    this.advanceTableForm.patchValue({cityTierID:this.cityTierID});
  }

  cityTierTypeValidator(CityTierList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityTierList.some(group => group.cityTierName.toLowerCase() === value);
      return match ? null : { cityTierNameInvalid: true };
    };
  }
}

