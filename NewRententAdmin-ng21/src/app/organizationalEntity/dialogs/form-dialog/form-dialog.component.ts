// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject } from '@angular/core';
import { OrganizationalEntityService } from '../../organizationalEntity.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { OrganizationalEntity } from '../../organizationalEntity.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { OrganizationalEntityDropDown } from '../../organizationalEntityDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { CitiesDropDown } from '../../citiesDropDown.model';
import { StatesDropDown } from '../../stateDropDown.model';
import { SupplierDropDown } from '../../supplierDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CountryDropDown } from '../../countryDropDown.model';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';
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
  advanceTable: OrganizationalEntity;
  options: any = {
    componentRestrictions: { country: 'IN' }
  }
  activationStatus: string = '';
  isLoading: boolean = false;
  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  // public CityList?: CitiesDropDown[] = [];
  public StatesList?: StatesDropDown[] = [];
  // public StateList?: StatesDropDown[] = [];
  // public CountriesList?: StatesDropDown[] = [];
  // public CountryList?: StatesDropDown[] = [];
  public SupplierList?: SupplierDropDown[] = [];
  public SupplierForOwnershipList?: SupplierDropDown[] = [];
  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  searchOrganizationalEntity: FormControl = new FormControl();
  filteredSupplierOptions: Observable<SupplierDropDown[]>;
  filteredSupplierForOwnerOptions:Observable<SupplierDropDown[]>;
  searchSupplier: FormControl = new FormControl();
  public CityLists?: CityDropDown[] = [];
  searchCityTerm: FormControl = new FormControl();
  filteredCityOptions: Observable<CityDropDown[]>;

  public StateList?: CountryDropDown[] = [];
  searchStateTerm: FormControl = new FormControl();
  filteredStateOptions: Observable<CountryDropDown[]>;

  public CountryList?: CountryDropDown[] = [];

  searchCountryTerm: FormControl = new FormControl();
  filteredCountryOptions: Observable<CountryDropDown[]>;
  public CountriesList?: CountryDropDown[] = [];

  image: any;
  fileUploadEl: any;
  geoStringAddress: string;
  stateOnCityID: number;
  countryOnStateID: number;
  organizationalEntityID: any;
  geoPointID: any;
  geoPointStateID: any;
  geoPointCityID: any;
  stateNameOnCityID: string;
  countryNameOnStateID: string;
  organizationalEntitySupplierID: any;
  owned: boolean = false;
  supplier: boolean = true;
  isDeleted: boolean = false;
  minEndDate: Date = new Date();
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: OrganizationalEntityService,
    private fb: FormBuilder,
    private el: ElementRef,
    public _generalService: GeneralService,
    private cdr: ChangeDetectorRef) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      //this.dialogTitle ='Edit Organizational Entity';       
      this.dialogTitle = 'Organizational Entity';
      this.advanceTable = data.advanceTable;
      this.advanceTableForm = this.createContactForm();
      this.onCityChangeGetState();
      this.onCityChangeGetCountry();
      this.ImagePath = this.advanceTable.organizationalEntityLogo;
      //this.getStatesBasedOnCity();
      var value = this.advanceTable.organizationalEntityGeoLocation.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];

      this.advanceTable.latitude = lat;
      this.advanceTable.longitude = long;
      this.advanceTableForm.controls['latitude'].setValue(lat);
      this.advanceTableForm.controls['longitude'].setValue(long);
      if (this.advanceTableForm?.get('activationStatus').value === false) {
        this.setEndDateValidators();
      }
      this.searchOrganizationalEntity.setValue(this.advanceTable.parent);
      if (this.advanceTable.organizationalEntityOwnership === 'Owned') {
        this.owned = true;
        this.supplier = false;
      }
      if (this.advanceTable.organizationalEntityOwnership === 'Supplier') {
        this.owned = false;
        this.supplier = true;
      }
      console.log(this.advanceTable);
      this.advanceTableForm.controls['organizationalEntityEndDate'].setValue(this.advanceTable.organizationalEntityEndDate);
      this.advanceTableForm.controls['activationStatus'].setValue(this.advanceTable.activationStatus);

      let organizationalEntityStartDate=moment(this.advanceTable.organizationalEntityStartDate).format('DD/MM/yyyy');
                          let organizationalEntityEndDate=moment(this.advanceTable.organizationalEntityEndDate).format('DD/MM/yyyy');
                          this.onBlurUpdateDateEdit(organizationalEntityStartDate);
                          this.onBlurUpdateEndDateEdit(organizationalEntityEndDate);
    } else {
      //this.dialogTitle = 'Create Organizational Entity';
      this.dialogTitle = 'Organizational Entity';
      this.advanceTable = new OrganizationalEntity({});
      this.advanceTableForm = this.createContactForm();
      this.advanceTable.activationStatus = true;
    }

    this.onChanges();
  }
  public ngOnInit() {

    this.InitCity();
    this.InitOrganizationalEntity();
    

  }

  futureDateValidator(control) {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);  // Ensure we are only comparing dates, not times
    if (selectedDate < currentDate) {
      return { futureDate: true };
    }
    return null;
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

  onActivationStatusChange(event: any) {
    if (event.value === false) {
      this.setEndDateValidators();
      this.isDeleted = true;
    } else {
      this.clearEndDateValidators();
      this.isDeleted = false;
    }
  }

  setEndDateValidators() {
    const endDateControl = this.advanceTableForm?.get('organizationalEntityEndDate');
    endDateControl.setValidators([Validators.required, this.minDateValidator(this.minEndDate)]);
    endDateControl.updateValueAndValidity();
  }

  clearEndDateValidators() {
    const endDateControl = this.advanceTableForm?.get('organizationalEntityEndDate');
    endDateControl.clearValidators();
    endDateControl.updateValueAndValidity();
  }

  minDateValidator(minDate: Date) {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlDate = new Date(control.value);
      if (controlDate < minDate) {
        return { 'min': { value: control.value } };
      }
      return null;
    };
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        organizationalEntityID: [this.advanceTable.organizationalEntityID],
        organizationalEntityName: [this.advanceTable.organizationalEntityName],
        organizationalEntityType: [this.advanceTable.organizationalEntityType],
        organizationalEntityParentID: [this.advanceTable.organizationalEntityParentID],
        organizationalEntityCityID: [this.advanceTable.organizationalEntityCityID],
        organizationalEntityAddress: [this.advanceTable.organizationalEntityAddress],
        organizationalEntityPincode: [this.advanceTable.organizationalEntityPincode],
        organizationalEntityPhone1: [this.advanceTable.organizationalEntityPhone1],
        organizationalEntityPhone2: [this.advanceTable.organizationalEntityPhone2],
        organizationalEntityFax: [this.advanceTable.organizationalEntityFax],
        organizationalEntityEmail1: [this.advanceTable.organizationalEntityEmail1],
        organizationalEntityEmail2: [this.advanceTable.organizationalEntityEmail2],
        organizationalEntityWebsite: [this.advanceTable.organizationalEntityWebsite],
        organizationalEntityPAN: [this.advanceTable.organizationalEntityPAN],
        organizationalEntityRegistrationNo: [this.advanceTable.organizationalEntityRegistrationNo],
        organizationalEntityLogo: [this.advanceTable.organizationalEntityLogo],
        organizationalEntityStartDate: [this.advanceTable.organizationalEntityStartDate],
        activationStatus: [true],
        organizationalEntityEndDate: [''],

        organizationalEntityCINNo: [this.advanceTable.organizationalEntityCINNo],
        organizationalEntityPrefix: [this.advanceTable.organizationalEntityPrefix],
        organizationalEntityGSTN: [this.advanceTable.organizationalEntityGSTN],
        organizationalEntityOwnership: [this.advanceTable.organizationalEntityOwnership],
        organizationalEntityAddressString: [this.advanceTable.organizationalEntityAddressString],
        organizationalEntityGeoLocation: [this.advanceTable.organizationalEntityGeoLocation],
        operationalStatus: [this.advanceTable.operationalStatus],
        // activationStatus: [],
        latitude: [this.advanceTable.latitude],
        longitude: [this.advanceTable.longitude],
        stateID: [this.advanceTable.stateID],
        countryID: [this.advanceTable.countryID],
        state: [this.advanceTable.state],
        country: [this.advanceTable.country],
        city: [this.advanceTable.city],
        organizationalEntitySupplierID: [this.advanceTable.organizationalEntitySupplierID],
        organizationalEntitySupplier: [this.advanceTable.organizationalEntitySupplier],
        searchOrganizationalEntity: [this.advanceTable.parent],
        organizationalEntityBranchType:[this.advanceTable.organizationalEntityBranchType],
        oldRentNetService_Location:[this.advanceTable.oldRentNetService_Location]
      });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  AddressChange(address: Address) {
    this.geoStringAddress = address.formatted_address
    this.advanceTableForm.patchValue({ latitude: address.geometry.location.lat() });
    this.advanceTableForm.patchValue({ longitude: address.geometry.location.lng() });
  }

  submit() {
    // emppty stuff
  }
  reset() {
    this.advanceTableForm.reset();
  }
  onNoClick() {
    this.dialogRef.close();
    this.ImagePath = "";
  }
  public Post(): void {
    this.isLoading = true;  // Start the loading spinner
    this.advanceTableForm.patchValue({
      countryID: this.geoPointID,
      organizationalEntityParentID: this.organizationalEntityID,
      stateID: this.geoPointStateID,
      organizationalEntityCityID: this.geoPointCityID,
      organizationalEntityAddressString: this.geoStringAddress
    });

    if (!this.advanceTableForm.controls['organizationalEntityEndDate'].value) {
      this.advanceTableForm.patchValue({ organizationalEntityEndDate: null });
    }

    const entityType = this.advanceTableForm.value.organizationalEntityType;

    if (entityType === 'Location' || entityType === 'Hub') {
      this.advanceTableForm.patchValue({
        organizationalEntityGeoLocation: `${this.advanceTableForm.value.latitude},${this.advanceTableForm.value.longitude}`
      });
    }

    if (entityType === 'Company' || entityType === 'Branch') {
      this.advanceTableForm.patchValue({
        latitude: 0,
        longitude: 0,
        organizationalEntityGeoLocation: '0,0'
      });
    }

    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false;  // Stop the spinner
          this.dialogRef.close();
          this._generalService.sendUpdate('OrganizationalEntityCreate:OrganizationalEntityView:Success');
        },
        error => {
          this.isLoading = false;  // Stop the spinner
          this._generalService.sendUpdate('OrganizationalEntityAll:OrganizationalEntityView:Failure');
        }
      );
  }

  public Put(): void {
    this.isLoading = true;  // Start the loading spinner

    // Patch the form with the necessary values
    this.advanceTableForm.patchValue({
      countryID: this.geoPointID || this.advanceTable.countryID,
      organizationalEntityParentID: this.organizationalEntityID || this.advanceTable.organizationalEntityParentID,
      stateID: this.geoPointStateID || this.advanceTable.stateID,
      organizationalEntityCityID: this.geoPointCityID || this.advanceTable.organizationalEntityCityID
    });

    if (!this.advanceTableForm.controls['organizationalEntityEndDate'].value) {
      this.advanceTableForm.patchValue({ organizationalEntityEndDate: null });
    }

    const entityType = this.advanceTableForm.value.organizationalEntityType;

    if (entityType === 'Location' || entityType === 'Hub') {
      this.advanceTableForm.patchValue({
        organizationalEntityGeoLocation: `${this.advanceTableForm.value.latitude},${this.advanceTableForm.value.longitude}`
      });
    }

    if (entityType === 'Company' || entityType === 'Branch') {
      this.advanceTableForm.patchValue({
        latitude: 0,
        longitude: 0,
        organizationalEntityGeoLocation: '0,0'
      });
    }

    this.advanceTableForm.patchValue({ organizationalEntityAddressString: this.geoStringAddress || this.advanceTable.organizationalEntityAddressString });

    // Call the update method of the service
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false;  // Stop the spinner
          this.dialogRef.close();
          this._generalService.sendUpdate('OrganizationalEntityUpdate:OrganizationalEntityView:Success');  // To send updates
        },
        error => {
          this.isLoading = false;  // Stop the spinner in case of error
          this._generalService.sendUpdate('OrganizationalEntityAll:OrganizationalEntityView:Failure');  // To send failure updates
        }
      );
  }
  public confirmAdd(): void {
    if (this.action == "edit") {
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
    this.advanceTableForm.patchValue({ organizationalEntityLogo: this.ImagePath })
  }

  // InitOrganizationalEntity(){
  //   this._generalService.GetOrganizationalEntity().subscribe(
  //     data=>
  //     {
  //       this.OrganizationalEntityList=data;
  //     });
  // }

  onTypeChange(value: string): void {
    this.InitOrganizationalEntity();
    if(value==="Location")
    {
      this.advanceTableForm.patchValue({organizationalEntityOwnership:"Owned"});
      this.onOwnershipChange();
    }
  }

  // InitOrganizationalEntity() {
  //   this._generalService.GetOrganizationalEntity().subscribe(
  //     data => {
  //       this.OrganizationalEntityList = data;
  //       // if(this.advanceTableForm.value.organizationalEntityType  === 'Company')
  //       //   {
  //       //     this.advanceTableForm.controls['searchOrganizationalEntity'].setValidators([
  //       //       this.parentValidators(this.OrganizationalEntityList)]);
  //       //     this.advanceTableForm.controls['searchOrganizationalEntity'].updateValueAndValidity();
  //       //   }
  //       //   else
  //       //   {
  //       //     this.advanceTableForm.controls['searchOrganizationalEntity'].setValidators([Validators.required,
  //       //       this.parentValidator(this.OrganizationalEntityList)]);
  //       //     this.advanceTableForm.controls['searchOrganizationalEntity'].updateValueAndValidity();
  //       //   }
  //       this.filteredOrganizationalEntityOptions = this.advanceTableForm.controls["searchOrganizationalEntity"].valueChanges.pipe(
  //         startWith(""),
  //         map(value => this._filter(value || ''))
  //       );
  //     });
  // }

  InitOrganizationalEntity() 
  {
    if(this.advanceTableForm.value.organizationalEntityType  === 'Company')
    {
      this.advanceTableService.GetOrganizationalEntity('').subscribe(
      data => {
        this.OrganizationalEntityList = data;
        this.filteredOrganizationalEntityOptions = this.advanceTableForm.controls["searchOrganizationalEntity"].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      });
    }
    else if(this.advanceTableForm.value.organizationalEntityType  === 'Branch')
    {
      this.advanceTableService.GetOrganizationalEntity('Company').subscribe(
      data => {
        this.OrganizationalEntityList = data;
        this.filteredOrganizationalEntityOptions = this.advanceTableForm.controls["searchOrganizationalEntity"].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      });
    }
    else if(this.advanceTableForm.value.organizationalEntityType  === 'Location')
    {
      this.advanceTableService.GetOrganizationalEntity('Branch').subscribe(
      data => {
        this.OrganizationalEntityList = data;
        this.filteredOrganizationalEntityOptions = this.advanceTableForm.controls["searchOrganizationalEntity"].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      });
    }
    else if(this.advanceTableForm.value.organizationalEntityType  === 'Hub')
    {
      this.advanceTableService.GetOrganizationalEntityForHub('Branch','Location').subscribe(
      data => {
        this.OrganizationalEntityList = data;
        this.filteredOrganizationalEntityOptions = this.advanceTableForm.controls["searchOrganizationalEntity"].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      });
    }        
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.OrganizationalEntityList.filter(
      customer => {
        return customer.organizationalEntityName.toLowerCase().includes(filterValue);
      });
  }
  OnParentSelect(selectedParent: string)
  {
    const ParentName = this.OrganizationalEntityList.find(
      data => data.organizationalEntityName === selectedParent
    );
    if (selectedParent) 
    {
      this.getTitles(ParentName.organizationalEntityID);
    }
  }
  getTitles(organizationalEntityID: any)
  {
    this.organizationalEntityID = organizationalEntityID;
  }

  //----------- Parent Validation --------------
  parentValidator(OrganizationalEntityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = OrganizationalEntityList.some(employee => employee.organizationalEntityName.toLowerCase() === value);
      return match ? null : { organizationalEntityInvalid: true };
    };
  }

  //----------- Parents Validation --------------
  parentValidators(OrganizationalEntityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const value = control.value?.toLowerCase();
      const match = OrganizationalEntityList.some(employee => employee.organizationalEntityName.toLowerCase() === value);
      return match ? null : { organizationalEntityInvalid: true };
    };
  }

  // InitSupplierForOwnership() {
  //   this._generalService.SupplierForOwnershipOfOE().subscribe(
  //     data => {
  //       this.SupplierForOwnershipList = data;
  //       this.advanceTableForm.patchValue({ organizationalEntitySupplier: this.SupplierForOwnershipList[0].supplierName });
  //       this.advanceTableForm.patchValue({ organizationalEntitySupplierID: this.SupplierForOwnershipList[0].supplierID });
  //     });
  // }

  InitSupplierForOwnership() {
    this._generalService.SupplierForOwnershipOfOE().subscribe(
    data => {
      this.SupplierForOwnershipList = data;
      console.log(this.SupplierForOwnershipList)
      this.filteredSupplierForOwnerOptions = this.advanceTableForm.controls["organizationalEntitySupplier"].valueChanges.pipe(
        startWith(""),
        map(value => this._filterForOwnerSupplier(value || ''))
      );
    });
  }
  private _filterForOwnerSupplier(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.SupplierForOwnershipList.filter(
      data => {
        return data.supplierName.toLowerCase().includes(filterValue);
      }
    );
  }
  OnSupplierForOwnerSelect(selectedSupplier: string)
  {
    const SupplierName = this.SupplierForOwnershipList.find(
      data => data.supplierName === selectedSupplier
    );
    if (selectedSupplier) 
    {
      this.getSupplierForOwnerID(SupplierName.supplierID);
    }
  }
  getSupplierForOwnerID(organizationalEntitySupplierID: any) 
  {
    this.organizationalEntitySupplierID = organizationalEntitySupplierID;
    this.advanceTableForm.patchValue({ organizationalEntitySupplierID: this.organizationalEntitySupplierID || this.advanceTable.organizationalEntitySupplierID });
  }


  onOwnershipChange() {
    if (this.advanceTableForm.value.organizationalEntityOwnership === 'Owned') {
      this.owned = true;
      this.supplier = false;
      this.InitSupplierForOwnership();
    }
    if (this.advanceTableForm.value.organizationalEntityOwnership === 'Supplier') {
      this.owned = false;
      this.supplier = true;
      this.advanceTableForm.controls["organizationalEntitySupplier"].setValue("");
      this.InitSupplier();

    }
  }

  InitSupplier() {
    this._generalService.getSupplierOfOE().subscribe(
      data => {
        this.SupplierList = data;
        this.filteredSupplierOptions = this.advanceTableForm.controls["organizationalEntitySupplier"].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchSupplier(value || ''))
        );
      });
  }

  private _filtersearchSupplier(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.SupplierList.filter(
      customer => {
        return customer.supplierName.toLowerCase().includes(filterValue);
      }
    );
  }
  OnSupplierSelect(selectedSupplier: string)
  {
    const SupplierName = this.SupplierList.find(
      data => data.supplierName === selectedSupplier
    );
    if (selectedSupplier) 
    {
      this.getsupplierID(SupplierName.supplierID);
    }
  }
  getsupplierID(organizationalEntitySupplierID: any) {
    this.organizationalEntitySupplierID = organizationalEntitySupplierID;
    this.advanceTableForm.patchValue({ organizationalEntitySupplierID: this.organizationalEntitySupplierID || this.advanceTable.organizationalEntitySupplierID });
  }

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
    if (filterValue.length < 3) {
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
    this._generalService.GetStateOnCity(this.geoPointCityID || this.advanceTable.organizationalEntityCityID).subscribe(
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
    if (filterValue.length < 3) {
      return [];
    }
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
    this._generalService.GetCountries(this.geoPointCityID || this.advanceTable.organizationalEntityCityID).subscribe(
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
    if (filterValue.length < 3) {
      return [];
    }
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
  //             //this.advanceTableForm.controls["countryID"].setValue(this.countryOnStateID);
  //             this.searchCountryTerm.setValue(this.countryNameOnStateID)
  //             this._generalService.GetStates(this.countryOnStateID).subscribe(
  //           data =>
  //           {
  //             this.StateList = data;                   
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

  // getStatesBasedOnCity(){ 
  //   this._generalService.GetStateOnCity(this.advanceTable.organizationalEntityCityID).subscribe(
  //     data =>
  //     {
  //       this.StateList = data;  
  //       this.StateList.forEach((ele)=>{         
  //             this.stateOnCityID=ele.geoPointID;
  //             this.stateNameOnCityID=ele.geoPointName;
  //             this.getCountryBasedOnState();
  //             //this.advanceTableForm.controls["stateID"].setValue(this.stateOnCityID);  
  //             this.searchStateTerm.setValue(this.stateNameOnCityID) 
  //             this._generalService.GetCities(this.stateOnCityID).subscribe(
  //               data =>
  //               {
  //                 this.CityLists = data;                     
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

  onChanges(): void {
    this.advanceTableForm.get('organizationalEntityType').valueChanges.subscribe(val => {
      const websiteControl = this.advanceTableForm.get('organizationalEntityWebsite');
      const panControl = this.advanceTableForm.get('organizationalEntityPAN');

      if (val !== 'Branch' && val !== 'Location' && val !== 'Hub') {
        websiteControl.setValidators([Validators.required, Validators.maxLength(100)]);
        panControl.setValidators([Validators.required]);
      } else {
        websiteControl.clearValidators();
        panControl.clearValidators();
      }

      websiteControl.updateValueAndValidity();
      panControl.updateValueAndValidity();
    });
  }

//start date
onBlurUpdateDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('organizationalEntityStartDate')?.setValue(formattedDate);    
} else {
  this.advanceTableForm.get('organizationalEntityStartDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  if(this.action==='edit')
  {
    this.advanceTable.organizationalEntityStartDate=formattedDate
  }
  else{
    this.advanceTableForm.get('organizationalEntityStartDate')?.setValue(formattedDate);
  }
  
} else {
  this.advanceTableForm.get('organizationalEntityStartDate')?.setErrors({ invalidDate: true });
}
}

//end date
onBlurUpdateEndDate(value: string): void {
value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  this.advanceTableForm.get('organizationalEntityEndDate')?.setValue(formattedDate);    
} else {
// this.advanceTableForm.get('organizationalEntityEndDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateEndDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
if(this.action==='edit')
{
  this.advanceTable.organizationalEntityEndDate=formattedDate
}
else{
  this.advanceTableForm.get('organizationalEntityEndDate')?.setValue(formattedDate);
}

} else {
// this.advanceTableForm.get('organizationalEntityEndDate')?.setErrors({ invalidDate: true });
}
}
}



