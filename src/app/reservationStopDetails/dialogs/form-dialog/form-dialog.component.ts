// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
//import { ReservationStopDetailsService } from '../../reservationStopDetails.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ReservationStopDetails } from '../../reservationStopDetails.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { SalutationDropDown } from 'src/app/salutation/salutationDropDown.model';
import { CustomerDesignationDropDown } from 'src/app/customerDesignation/customerDesignationDropDown.model';
import { CustomerDepartmentDropDown } from 'src/app/customerDepartment/customerDepartmentDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationStopDetailsService } from '../../reservationStopDetails.service';
import { CustomerGroupDropDown } from 'src/app/customerGroup/customerGroupDropDown.model';
import { CustomerDropDown } from 'src/app/customer/customerDropDown.model';
import { GeoPointTypeDropDown } from 'src/app/geoPointType/geoPointTypeDropDown.model';
import { StatesDropDown } from 'src/app/organizationalEntity/stateDropDown.model';
import { CountryDropDown } from 'src/app/general/countryDropDown.model';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
import { GoogleAddressDropDown } from 'src/app/reservation/googleAddressDropDown.model';
import { ReservationService } from 'src/app/reservation/reservation.service';
import moment from 'moment';
import { StopDetailsService } from 'src/app/stopDetails/stopDetails.service';
@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogReservationStopDetailsComponent {
  saveDisabled:boolean=true;
  buttonDisabled:boolean=false;
  status: any;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: ReservationStopDetails;
  isGoogleAutoComplete = false;
  filteredPSTOptions: Observable<GeoPointTypeDropDown[]>;
  public PickupSpotTypeList?: GeoPointTypeDropDown[] = [];
  public PickupSpotList?: StatesDropDown[] = [];
  searchPickupST: FormControl = new FormControl();
  filteredPSOptions: Observable<GeoPointTypeDropDown[]>;
  searchPickupSpot: FormControl = new FormControl();
  public CityList?: CityDropDown[] = [];
  searchCityTerm: FormControl = new FormControl();
  filteredCityOptions: Observable<CityDropDown[]>;

  public StateList?: CountryDropDown[] = [];
  searchStateTerm: FormControl = new FormControl();
  filteredStateOptions: Observable<CountryDropDown[]>;

  public CountryList?: CountryDropDown[] = [];
  countryOnStateID: number;
  stateOnCityID: number;

  searchTerm: FormControl = new FormControl();
  filteredCountryOptions: Observable<CountryDropDown[]>;
  public CountriesList?: CountryDropDown[] = [];

  filteredGoogleAddressOptions: Observable<GoogleAddressDropDown[]>;
  public GoogleAddressList?: GoogleAddressDropDown[] = [];

  image: any;
  fileUploadEl: any;
  customerGroupName: any;
  salutationID: any;
  customerDesignationID: any;
  customerDepartmentID: any;
  customerGroupID: any;
  customerID: any;
  customerGroup: any;
  pickupSpotTypeID: any;
  pickupSpotID: any;
  reservationStopSpotTypeID: any;
  reservationStopSpotID: any;
  geoPointID: any;
  geoPointStateID: any;
  geoPointCityID: any;
  priorityValues: number[] = [];

  public countryID: any;
  public stateID: any;
  public cityID: number;

  formattedAddress = '';
  options = {
    componentRestrictions: {
      country: ['IN']
    }
  };
  getTitle: any;
  reservationID: any;

  googlePlacesForm = this.fb.group({
    geoPointID: [''],
    geoLocation: [''],
    latitude: [''],
    longitude: [''],
    geoSearchString: [''],
    geoPointName: [''],
    googlePlacesID: [''],
    activationStatus: ['']
  })
  existingPriorities: any;

  isTNCSelected:boolean = false;
  checked: any;
  reservationStopDate: any;

  constructor(
    public dialogRef: MatDialogRef<FormDialogReservationStopDetailsComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: ReservationStopDetailsService,
    private fb: FormBuilder,
    private stopDetailsService: StopDetailsService,
    private el: ElementRef,
    private _generalService: GeneralService,) {
    // Set the defaults
    this.action = data.action;
    this.priorityValues = Array.from({ length: 100 }, (_, i) => i + 1);
    if (this.action === 'edit') {
      this.dialogTitle = data.dialogTitle !== undefined ? data.dialogTitle : 'Add More Stops';
      this.advanceTable = data.advanceTable;
      this.searchPickupSpot.setValue(this.advanceTable.geoPointName);
      this.searchPickupST.setValue(this.advanceTable.reservationStopSpotType);
       let startDate=moment(this.advanceTable.reservationStopDate).format('DD/MM/yyyy');
        this.onBlurUpdateDateEdit(startDate);
      this.advanceTableForm = this.createContactForm();
      if(data.advanceTable.isTimeNotConfirmed === true)
      {
        this.advanceTableForm.get('reservationStopTime').disable();
      }
      else
      {
        this.advanceTableForm.get('reservationStopTime').enable();
      }
    
      if(this.dialogTitle === "Dropoff Details")
      {
        this.advanceTableForm.get('reservationStopDate').disable();
        this.advanceTableForm.get('reservationStopTime').disable();
        this.advanceTableForm.get('city').disable();
        this.advanceTableForm.get('reservationStopOrderPriority').enable();
        this.advanceTableForm.get('reservationStopAddress').disable();
        this.advanceTableForm.get('reservationStopAddressDetails').disable();
      }
    } 
    else 
    {
      this.dialogTitle = 'Add More Stops';
      this.reservationStopDate = data.advanceTable[0].pickupDate;
      this.advanceTable = new ReservationStopDetails({});
      this.advanceTable.activationStatus = true;
      this.advanceTableForm = this.createContactForm();
    }

    if (data?.advanceTable?.reservationID !== undefined) {
      this.reservationID = data.advanceTable.reservationID;
    } else {
      this.reservationID = data?.reservationID;
    }
    
    // Extract status safely
    if(typeof data.status === 'string') {
      this.status = data.status;
    } else if(data.status && typeof data.status === 'object' && data.status.status) {
      this.status = data.status.status;
    } else {
      this.status = '';
    }
    
    // if(this.status != 'Changes allow') {
    //   this.buttonDisabled = true;
    // }
        if(this.status === 'Changes allow'){
    this.buttonDisabled = false;  // Save button enable
} else {
    this.buttonDisabled = true;   // Save button disable
}

  }
  public ngOnInit(): void {
    this.InitPickupSpotType();
    this.InItCity();
    this.InitGoogleAddress();
    this.fetchExistingPriorities();
    if(this.action === 'edit')
    {
      var value = this.advanceTable.reservationStopAddressLatLong.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];

      this.advanceTableForm.patchValue({reservationStopAddressLatLong:lat
        +
         ',' +
         long
     });
    }
   
  }

  onNoClick(): void 
  {
    if(this.action==='add'){
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
  }

  fetchExistingPriorities() {
    this.stopDetailsService.getReservationStopDetails(this.reservationID).subscribe((res: any) => {
      this.existingPriorities = res.map((item: any) => item.reservationStopOrderPriority);
    });
  }

  onPriorityChange(event: any) { 
    const selectedPriority = event.value;
    if (this.existingPriorities.includes(selectedPriority)) {
      this.advanceTableForm.controls['reservationStopOrderPriority'].setErrors({ existingPriority: true });
    } else {
      this.advanceTableForm.controls['reservationStopOrderPriority'].setErrors(null);
    }
  }
  
  InitPickupSpotType() {
    this._generalService.GetGeoPointTypes().subscribe(
      data => {
        this.PickupSpotTypeList = data;
        this.filteredPSTOptions = this.advanceTableForm.controls['reservationStopSpotType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPST(value || ''))
        );
      });
  }

  private _filterPST(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PickupSpotTypeList.filter(
      customer => {
        return customer.geoPointType.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  onStopSpotTypeSelected(selectedStateName: string) {
    const selectedState = this.PickupSpotTypeList.find(
      data => data.geoPointType === selectedStateName
    );
  
    if (selectedState) {
      this.getPSTID(selectedState.geoPointTypeID);
    }
  }

  getPSTID(reservationStopSpotTypeID: any) {
    this.reservationStopSpotTypeID = reservationStopSpotTypeID;
    this.advanceTableForm.patchValue({ reservationStopSpotTypeID: this.reservationStopSpotTypeID });
    this.InitPickupSpot();
  }

  InitPickupSpot() {
    this._generalService.GetGeoPointName(this.reservationStopSpotTypeID).subscribe(
      data => {
        this.PickupSpotList = data;
        this.filteredPSOptions = this.advanceTableForm.controls['reservationStopSpot'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPSpot(value || ''))
        );
      });
  }

  private _filterPSpot(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PickupSpotList.filter(
      customer => {
        return customer.geoPointName.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  onStopSpotSelected(selectedStateName: string) {
    const selectedState = this.PickupSpotList.find(
      data => data.geoPointName === selectedStateName
    );
  
    if (selectedState) {
      this.getPSpotID(selectedState.geoPointID);
    }
  }

  getPSpotID(reservationStopSpotID: any) {
    this.reservationStopSpotID = reservationStopSpotID;
    this.advanceTableForm.patchValue({ reservationStopSpotID: this.reservationStopSpotID });
  }

  InitCountries() {
    this._generalService.getCountries().subscribe(
      data => {
        this.CountriesList = data;
        this.filteredCountryOptions = this.advanceTableForm.controls['country'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCountry(value || ''))
        );
      });
  }
  private _filterCountry(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CountriesList.filter(
      customer => {
        return customer.geoPointName.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }
  getCountryID(geoPointID: any) {
    this.geoPointID = geoPointID;
    this.OnCountryChangeGetStates();
    this.advanceTableForm.controls['state'].setValue('');
    this.advanceTableForm.controls['city'].setValue('');
  }

  onCountryInputChange(event: any) {
    if (event.target.value.length === 0) {
      this.advanceTableForm.controls['state'].setValue('');
      this.advanceTableForm.controls['city'].setValue('');
    }
  }

  OnCountryChangeGetStates() {
    this._generalService.GetStates(this.geoPointID).subscribe(
      data => {
        this.StateList = data;
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
    return this.StateList.filter(
      customer => {
        return customer.geoPointName.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }
  getStateID(geoPointID: any) {
    debugger;
    this.geoPointStateID = geoPointID;
    this.InItCity();
    this.advanceTableForm.controls['city'].setValue('');
  }

  onStateInputChange(event: any) {
    if (event.target.value.length === 0) {
      this.advanceTableForm.controls['city'].setValue('');
      this.OnCountryChangeGetStates();
    }
  }

  InItCity() {
    this._generalService.GetCitys().subscribe(
      data => {
        this.CityList = data;
        this.advanceTableForm.controls['city'].setValidators([this.CityValidator(this.CityList)]);
        this.advanceTableForm.controls['city'].updateValueAndValidity();;
        this.filteredCityOptions = this.advanceTableForm.controls['city'].valueChanges.pipe(
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
    return this.CityList.filter(
      customer => {
        return customer.geoPointName.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  CityValidator(CityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityList.some(data => (data.geoPointName).toLowerCase() === value);
        return match ? null : { cityInvalid: true };
      };
    }

  onCitySelected(selectedStateName: string) {
    const selectedState = this.CityList.find(
      data => data.geoPointName === selectedStateName
    );
  
    if (selectedState) {
      this.getCityID(selectedState.geoPointID);
    }
  }

  getCityID(geoPointID: any) {
    this.geoPointCityID = geoPointID;
    //this.InitGoogleAddress();
    this.advanceTableForm.patchValue({ reservationStopCityID: this.geoPointCityID });
  }

  getCountryBasedOnState() {
    this._generalService.GetCountryForOE(this.stateOnCityID).subscribe(
      data => {
        this.CountryList = data;
        this.CountryList.forEach((ele) => {
          this.InitCountries();
          for (var i = 0; i < this.CountriesList.length; i++) {
            if (this.CountriesList[i].geoPointID === ele.geoPointID) {
              this.countryOnStateID = ele.geoPointID;
              this.geoPointID = ele.geoPointID;
              this.advanceTableForm.controls["countryID"].setValue(this.countryOnStateID);
              debugger;
              this._generalService.GetStates(this.countryOnStateID).subscribe(
                data => {
                  debugger;
                  this.StateList = data;
                },
                error => {

                }
              );
            }
          }
        })
      },
      error => {

      }
    );
  }

  getStatesBasedOnCity() {
    this._generalService.GetStateOnCity(this.advanceTable.reservationStopCityID).subscribe(
      data => {
        this.StateList = data;
        this.StateList.forEach((ele) => {
          this.stateOnCityID = ele.geoPointID;
          this.getCountryBasedOnState();
          this.advanceTableForm.controls["stateID"].setValue(this.stateOnCityID);
          this._generalService.GetCities(this.stateOnCityID).subscribe(
            data => {
              this.CityList = data;
            },
            error => {

            }
          );
        })
      },
      error => {

      }
    );

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
        reservationStopID: [this.advanceTable?.reservationStopID],
        reservationID: [this.advanceTable.reservationID],
        reservationStopSpotType: [this.advanceTable.reservationStopSpotType],
        reservationStopSpotTypeID: [this.advanceTable.reservationStopSpotTypeID],
        reservationStopSpot: [this.advanceTable.reservationStopSpot],
        reservationStopSpotID: [this.advanceTable.reservationStopSpotID],
        reservationStopCityID: [this.advanceTable.reservationStopCityID],
        reservationStopAddress: [this.advanceTable.reservationStopAddress],
        reservationStopAddressLatLong: [this.advanceTable.reservationStopAddressLatLong],
        reservationStopAddressDetails: [this.advanceTable.reservationStopAddressDetails],
        reservationStopDate: [this.advanceTable.reservationStopDate || this.reservationStopDate],
        reservationStopTime: [this.advanceTable.reservationStopTime],
        country: [this.advanceTable.reservationStopCountry],
        state: [this.advanceTable.reservationStopState],
        city: [this.advanceTable.reservationStopCity],
        activationStatus: [this.advanceTable.activationStatus],
        reservationStopOrderPriority:[this.advanceTable.reservationStopOrderPriority],
        isTimeNotConfirmed:[this.advanceTable.isTimeNotConfirmed]
      });
  }

  onTNCChange(checked: any)
  {
    const reservationStopTimeControl = this.advanceTableForm.get('reservationStopTime');
    if (checked === true) 
    {
      this.isTNCSelected = true;
      this.advanceTableForm.get('reservationStopTime').setValue(null);
      reservationStopTimeControl?.disable();
    }
    else
    {
      reservationStopTimeControl?.enable();
      this.isTNCSelected = false;      
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

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  public Post(): void {
    debugger
    this.advanceTableForm.patchValue({isTimeNotConfirmed:this.isTNCSelected});
    let requestPayload = this.advanceTableForm.getRawValue();
    //requestPayload.reservationStopSpotID=this.reservationStopSpotID;
    requestPayload.reservationID = this.reservationID;
    this.advanceTableService.add(requestPayload)
    .subscribe(
      response => 
      { 
        this.showNotification(
          'snackbar-success',
          'Reservation Stop Details Created...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled=true;
        this.dialogRef.close();
    },
      error =>
      {
        this.showNotification(
          'snackbar-danger',
          'Operation Failed...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled=true;
      }
    )
  }
  public Put(): void {
    let requestPayload = this.advanceTableForm.getRawValue();
    requestPayload.reservationID = this.reservationID;
    this.advanceTableForm.patchValue({isTimeNotConfirmed:this.isTNCSelected});
    //requestPayload.reservationStopSpotID = this.data.advanceTable.reservationStopSpotID;
    requestPayload.reservationStopType = this.data.advanceTable.reservationStopType;
    this.advanceTableService.update(requestPayload)
    .subscribe(
      response => 
      { 
        this.showNotification(
          'snackbar-success',
          'Reservation Stop Details Update...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled=true;
        this.dialogRef.close();
    },
      error =>
      {
        this.showNotification(
          'snackbar-danger',
          'Operation Failed...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled=true;
      }
    )
  }
  public confirmAdd(): void {
    this.saveDisabled=false;
    if (this.action === "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";

  public uploadFinished = (event) => {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({ image: this.ImagePath })
  }

  onStopAddressKeyUp(event) {
    if (event.keyCode === 8) 
    {
      this.advanceTableForm.controls["reservationStopSpotType"].setValue('');
      this.advanceTableForm.controls["reservationStopSpot"].setValue('');
    }
    
  }

  reservationStopSpotTypeKeyUp(event)
  {
    if (event.keyCode === 8) 
      {
        this.advanceTableForm.controls["reservationStopSpotType"].setValue('');
        this.advanceTableForm.controls["reservationStopSpotTypeID"].setValue(0);
        this.advanceTableForm.controls["reservationStopSpot"].setValue('');
        this.advanceTableForm.controls["reservationStopSpotID"].setValue(0);
      }
  }

  showError(controlName: string): boolean {
    const control = this.advanceTableForm.get(controlName);
    return control?.hasError('required') && (control.touched || control.dirty);
  }

  googleCheckBox(event: any) {
    if (event.checked) {
      this.isGoogleAutoComplete = true;
      this.advanceTableForm.controls["reservationStopAddress"].setValue('');
      this.advanceTableForm.controls["reservationStopSpotType"].setValue('');
      this.advanceTableForm.controls["reservationStopSpot"].setValue('');
      this.InItCity();
    } else {
      this.isGoogleAutoComplete = false;
      this.advanceTableForm.controls["reservationStopAddress"].setValue('');
      this.advanceTableForm.controls["reservationStopSpotType"].setValue('');
      this.advanceTableForm.controls["reservationStopSpot"].setValue('');
    }
    
  }

  onGoogleStopAddressTyping() 
  {
    const control = this.advanceTableForm.get('reservationStopAddress');
    if (!control?.value || control.value.trim() === '')
    {
      control?.setErrors(null);
      return;
    }
    control?.setErrors({ invalidreservationStopAddress: true });
  }

  public handleAddressChange(address: any) {
    if (this.isGoogleAutoComplete) {
      // this.advanceTableForm.controls["city"].setValue('');
      // this.advanceTableForm.controls["state"].setValue('');
      // this.advanceTableForm.controls["country"].setValue('');
      // this.advanceTableForm.controls["city"].disable();
      // this.advanceTableForm.controls["state"].disable();
      // this.advanceTableForm.controls["country"].disable();
    } else {
      this.advanceTableForm.controls["city"].setValue('');
      this.advanceTableForm.controls["state"].setValue('');
      this.advanceTableForm.controls["country"].setValue('');
      this.advanceTableForm.controls["city"].enable();
      this.advanceTableForm.controls["state"].enable();
      this.advanceTableForm.controls["country"].enable();
    }
    this.formattedAddress = address.formatted_address;
    this.advanceTableForm.patchValue({ reservationStopAddress: this.formattedAddress });
    this.advanceTableForm.patchValue({ reservationStopAddressLatLong:address.geometry.location.lat()
      +
       ',' +
       address.geometry.location.lng()
   });
    var country = address.address_components.filter(
      (f) =>
        JSON.stringify(f.types) === JSON.stringify(['country', 'political'])
    )[0].long_name;
    this.advanceTableForm.controls["country"].setValue(country);

    if (address.address_components.length > 1) {
      var state = address.address_components.filter(
        (f) =>
          JSON.stringify(f.types) ===
          JSON.stringify(['administrative_area_level_1', 'political'])
      )[0].long_name;
      this.advanceTableForm.controls["state"].setValue(state);
    }

    if (address.address_components.length > 2) {
      var city = address.address_components.filter(
        (f) =>
          JSON.stringify(f.types) === JSON.stringify(['locality', 'political'])
      )[0].long_name;
      // debugger;
      // this.getCityIDByName(city);
      // this.advanceTableForm.controls["city"].setValue(city);

    }
    this.advanceTable.country = country;
    this.searchTerm.setValue(this.advanceTable.country);
    this.searchTerm.disable();

    this.advanceTable.state = state;
    if (this.advanceTable.state != undefined) {
      this.searchStateTerm.disable();
      this.searchStateTerm.setValue(this.advanceTable.state);
    } else {
      this.searchStateTerm.setValue('');
      this.searchStateTerm.enable();
      //this.getTitle(this.advanceTable.countryID);
    }

    this.advanceTable.city = city;
    if (this.advanceTable.city != undefined) {
      this.searchCityTerm.disable();
      this.getCityIDByName(this.advanceTable.city);
      this.advanceTable.geoPointID = this.cityID;
      this.searchCityTerm.setValue(this.advanceTable.city);
    } else {
      this.searchCityTerm.setValue('');
      this.searchCityTerm.enable();
      //this.getStateID(this.advanceTable.stateID);
    }

    this.googlePlacesForm.patchValue({ geoPointID: -1 });
    this.googlePlacesForm.patchValue({ latitude: address.geometry.location.lat() });
    this.googlePlacesForm.patchValue({ longitude: address.geometry.location.lng() });
    this.googlePlacesForm.patchValue({ geoSearchString: this.formattedAddress });
    this.googlePlacesForm.patchValue({ geoPointName: 'Google Address' });
    this.googlePlacesForm.patchValue({ googlePlacesID: address.place_id });
    this.googlePlacesForm.patchValue({ activationStatus: true });
    this.PostGoogleAddress();
  }

  public PostGoogleAddress(): void {
    this.googlePlacesForm.patchValue({
      geoLocation: this.googlePlacesForm.value.latitude
        +
        ',' +
        this.googlePlacesForm.value.longitude
    });
    this.advanceTableService.addGoogleAddress(this.googlePlacesForm.value)
      .subscribe(
        response => {

        },
        error => {

        }
      )
  }

  getCityIDByName(name: string) {
    // this._generalService.GetCityID(name).subscribe((res: any) => {
    // }, (error: HttpErrorResponse) => {
    // });
    debugger;
    const data = this._generalService.GetsCityID(name);

    this.cityID = parseInt(data.geoPointID);
    // this.advanceTableForm.patchValue({reservationStopCityID:this.cityID});
    this.advanceTableForm.controls["reservationStopCityID"].setValue(this.cityID)
  }

  InitGoogleAddress() {
    this._generalService.getGoogleAddress().subscribe(
      data => {
        this.GoogleAddressList = data;
        this.advanceTableForm.controls['reservationStopAddress'].setValidators([this.StopLocationValidator(this.GoogleAddressList)]);
        this.advanceTableForm.controls['reservationStopAddress'].updateValueAndValidity();
        this.filteredGoogleAddressOptions = this.advanceTableForm.controls['reservationStopAddress'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterGA(value || ''))
        );
      });

  }

  private _filterGA(value: string): any {
    const filterValue = value.toLowerCase();
    return this.GoogleAddressList.filter(
      customer => {
        return customer.geoSearchString.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  StopLocationValidator(GoogleAddressList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = GoogleAddressList.some(data => (data.geoSearchString).toLowerCase() === value);
        return match ? null : { reservationStopAddressInvalid: true };
      };
    }

  onGASelected(selectedStateName: string) {
    const selectedState = this.GoogleAddressList.find(
      data => data.geoSearchString === selectedStateName
    );
  
    if (selectedState) {
      this.OnGeoLocationClick(selectedState);
    }
  }

  OnGeoLocationClick(option:any)
  {
    let pickupGeoLocation=option.geoLocation;
    var value = pickupGeoLocation.replace(
      '(',
      ''
    );
    value = value.replace(')', '');
    var lat = value.split(' ')[2];
    var long = value.split(' ')[1];
    this.advanceTableForm.patchValue({reservationStopAddressLatLong:lat
      +
       ',' +
       long
   });
    
  }
  bindSpotTypeandSpot(option: any) {
    this.advanceTableForm.patchValue({ reservationStopSpotTypeID: option.spotTypeID });
    this.advanceTableForm.patchValue({ reservationStopSpotType: option.spotType });
    this.advanceTableForm.patchValue({ reservationStopSpotID: option.geoPointID });
    this.advanceTableForm.patchValue({ reservationStopSpot: option.spot });
  }

  onTimeInput(event: any): void {
    const inputValue = event.target.value;
    const parsedTime = new Date(`1970-01-01T${inputValue}`);
    if (!isNaN(parsedTime.getTime())) {
        this.advanceTableForm.get('reservationStopTime').setValue(parsedTime);
    }
}

onBlurUpdateDate(value: string): void {
    value= this._generalService.resetDateiflessthan12(value);
  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('reservationStopDate')?.setValue(formattedDate);    
  } else {
    this.advanceTableForm.get('reservationStopDate')?.setErrors({ invalidDate: true });
  }
}

onBlurUpdateDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    if(this.action==='edit')
    {
      this.advanceTable.reservationStopDate=formattedDate
    }
    else{
      this.advanceTableForm.get('reservationStopDate')?.setValue(formattedDate);
    }
    
  } else {
    this.advanceTableForm.get('reservationStopDate')?.setErrors({ invalidDate: true });
  }
}
}



