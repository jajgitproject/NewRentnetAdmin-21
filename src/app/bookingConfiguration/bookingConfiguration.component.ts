//@ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BookingConfigurationService } from './bookingConfiguration.service';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { B2cDataDetails, BookingConfigurationCustomerDetails, BookingConfigurationPassengerDetails, BookingConfigurationStopDetails, BookingPackageVehcileDetails, Reservation } from './bookingConfiguration.model';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
import { PackageDropDown } from '../package/packageDropDown.model';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { VehicleVehicleCategoryDropDown } from '../vehicle/vehicleVehicleCategoryDropDown.model';
import { GoogleAddressDropDown } from '../reservation/googleAddressDropDown.model';
import { ReservationService } from '../reservation/reservation.service';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { ReservationGroup } from '../reservationGroup/reservationGroup.model';
import { EmployeeDropDown } from '../employee/employeeDropDown.model';
import { ReservationSourceDropDown } from '../reservation/reservationSourceDropDown.model';
import { ModeOfPaymentDropDown } from '../modeOfPayment/modeOfPaymentDropDown.model';
import Swal from 'sweetalert2';
import { ReservationStopDetails } from '../reservationStopDetails/reservationStopDetails.model';

@Component({
  standalone: false,
  selector: 'app-bookingConfiguration',
  templateUrl: './bookingConfiguration.component.html',
  styleUrls: ['./bookingConfiguration.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BookingConfigurationComponent implements OnInit {
  displayedColumns = [
    'SR',
    'TRN',
    'Customer',
    'RequestDate',
    'PickupDate',
    'RequestStatus',
    'ReservationID',
    'ConfirmationDate',
    'pickupTime',
    'CheckedByEco'
  ];

  customerDetails: BookingConfigurationCustomerDetails | null;
  b2cDetails: B2cDataDetails | null;
  stopDetailsList: BookingConfigurationStopDetails[] | null;
  passengerDetailsList: BookingConfigurationPassengerDetails[] | null;
  integrationCustomFields: { fieldName: string; fieldValue: string }[] = [];
  packageVehcileDetailsList: BookingPackageVehcileDetails | null;

  public PackageTypeList?:PackageTypeDropDown[]=[];
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;

  public PackageList?:PackageDropDown[]=[];
  filteredPackageOptions: Observable<PackageDropDown[]>;

  public CityList?: CitiesDropDown[] = [];
  filteredCityOptions: Observable<CitiesDropDown[]>;

  public VehicleList?:VehicleVehicleCategoryDropDown[]=[];
  filteredVehicleOptions: Observable<VehicleVehicleCategoryDropDown[]>;

  public GoogleAddressList?: GoogleAddressDropDown[] = [];
  filteredGoogleAddressOptions: Observable<GoogleAddressDropDown[]>;

  public ServiceLocationList?:OrganizationalEntityDropDown[]=[];
  filteredServiceLocationOptions: Observable<OrganizationalEntityDropDown[]>;

  public DropOffCityList?: CitiesDropDown[] = [];
  filteredDropOffCityOptions: Observable<CitiesDropDown[]>;

  public DropOffGoogleAddressList?: GoogleAddressDropDown[] = [];
  filteredDropOffGoogleAddressOptions: Observable<GoogleAddressDropDown[]>;

  public PaymentModeList?:ModeOfPaymentDropDown[]=[];
  filteredPaymentModeOptions: Observable<ModeOfPaymentDropDown[]>;

  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  dialogRef: MatDialogRef<any>;
  SearchFromDate: string = '';
  SearchToDate: string = '';
  SearchTRN:string ='';
  SearchEcoBookingNo: string = '';
  SearchStatus:string ='';

  public CustomerList?:CustomerDropDown[]=[];
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  customerName : FormControl=new FormControl();
  BookingID: any;
  returnUrl = '/bookingRequest';
  contractID: any;
  action: string;
  customerTravelRequestNumber: string;
  enrouteStopDetails: ReservationStopDetails[] = [];

  advanceTableForm = this.fb.group({
    packageTypeID: [''],
    packageType:[''],
    packageID:[''],
    package:[''],
    vehicleID:[''],
    vehicle:[''],
    vehicleCategoryID:[''],
    vehicleCategory:[''],
    carType:[''],
    ticketNumber:['', [Validators.required, Validators.pattern(/^[0-9]{12,15}$/)]],
    specialInstructions:[''],
    internalRemarks:[''],
    requestType:['', Validators.required],
    pickupCityID:['', Validators.required],
    pickupCity:['', Validators.required],
    pickupDateTime:[''],
    pickupDateTimeString:[''],
    pickupDate:[''],
    pickupDateString:[''],
    pickupTime:[''],
    pickupTimeString:[''],
    pickupAddress:[''],
    //pickupAddressLatLong:[''],
    pickupStopOrderPriority:[''],
    pickupAddressLatitude:[''],
    pickupAddressLongitude:[''],
     googleAddresses:[''],
    pickupAddressDetails:[''],
    serviceLocationID:[''],
    serviceLocation:[''],
    transferedLocationID:[0],
    transferedLocation:[''],
    dropOffDateTime:[''],
    dropOffDateTimeString:[''],
    dropOffDate:[''],
    dropOffDateString:[''],
    dropOffTime:[''],
    dropOffTimeString:[''],
    dropOffCityID:[0],
    dropOffCity:[''],
    dropOffAddress:[''],
    dropOffAddressLatitude:[''],
    dropOffAddressLongitude:[''],
    //dropOffAddressLatLong:[''],
    dropOffStopOrderPriority:[2],
    dropOffAddressDetails:[''],
     googleAdressesDropOff:[''],
    customerGroupID:[''],
    customerID:['' ],
    primaryBookerID:[''],
    salesExecutive:[''],
    salesExecutiveID:[''],
    kam:[''],
    kamID:[''],
    reservationExecutiveID:[''],
    customerTypeID:[''],
    emailLink: [''],
    reservationSourceID: [''],
    reservationSource: [''],
    reservationStatus: ['Approved'],
    primaryPassengerID:[''],
    reservationSourceDetail:[''],
    ecoCompanyID:[11],
    modeOfPaymentID:[''],
    modeOfPayment:[''],
    bookingID:[''],
    customerTravelRequestNumber:['']
})


googlePlacesForm = this.fb.group({
  geoPointID: [''],
  geoLocation: [''],
  latitude:[''],
  longitude:[''],
  geoSearchString: [''],
  geoPointName: [''],
  googlePlacesID:[''],
  activationStatus:['']
})

  options = {
    componentRestrictions: {
      country: ['IN']
    }
  }

  ifBlock=true;
  dropOffifBlock=true;
  packageTypeID: any;
  packageType: any;
  packageID: any;
  pickupCityID: any;
  vehicleID: any;
  vehicleCategoryID: any;
  pickupAddress: any;
  serviceLocationID: any;
  dropOffCityID: any;
  dropOffAddress: any;

  salesManagerList?:ReservationGroup[]=[];
  filteredEmployeeOptions: Observable<EmployeeDropDown[]>;

  customerKamList?:ReservationGroup[]=[];
  filteredEmployeesOptions : Observable<EmployeeDropDown[]>;

  public ReservationSourceList?:ReservationSourceDropDown[]=[];
  filteredReservationSourceOptions: Observable<ReservationSourceDropDown[]>;
  reservationSourceID: any;
  paymentModeID: any;
  dataSource:Reservation | null;
  PackageType: string;
  saveDisabled:boolean=true;
  saving = false;
  isCustomerFolded = false;
  isPassengerFolded = false;
  isStopFolded = false;
  bookerID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public bookingConfigurationService: BookingConfigurationService,
    private snackBar: MatSnackBar,
    public reservationService: ReservationService,
    public router:Router,
    public route:ActivatedRoute,
    public _generalService: GeneralService
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      this.BookingID = paramsData.BookingID;
      this.returnUrl = this.resolveReturnUrl(paramsData.returnUrl);
    });
    this.advanceTableForm.patchValue({reservationSourceID:22});
    this.advanceTableForm.patchValue({reservationSource:'Integration'});
    this.advanceTableForm.patchValue({modeOfPaymentID:0});
    this.GetCustomerDetails();
    this.GetStopDetails();
    
    this.InitGoogleAddress();
    this.InitServiceLocation();
    this.InitDropOffGoogleAddress();
    this.SubscribeUpdateService();
    this.GetPackageVehcileDetails();
    this.InitPaymentMode();
    this.loadData();
  }

  toggleCustomerFold() {
  this.isCustomerFolded = !this.isCustomerFolded;
}

 togglePassengerFold() {
  this.isPassengerFolded = !this.isPassengerFolded;
}

  
toggleStopFold() {
  this.isStopFolded = !this.isStopFolded;
}

  public loadData() 
  {
    this.bookingConfigurationService.GetReservationByID(this.BookingID).subscribe(
      data => {
          if (!data) {
            this.dataSource = null;
            return;
          }
          this.dataSource = data;
          if(this.dataSource?.reservationID !==0)
          {
            this.saveDisabled = false;
          }
          this.PackageType = this.dataSource.packageType;
          this.advanceTableForm.patchValue({packageTypeID:this.dataSource.packageTypeID});
          this.advanceTableForm.patchValue({packageType:this.dataSource.packageType});
          this.advanceTableForm.patchValue({packageID:this.dataSource.packageID});
          this.advanceTableForm.patchValue({package:this.dataSource.package});
          this.advanceTableForm.patchValue({pickupPriorityOrder:this.dataSource.pickupPriorityOrder});
          this.advanceTableForm.patchValue({vehicleID:this.dataSource.vehicleID});
          this.advanceTableForm.patchValue({vehicle:this.dataSource.vehicle});
          this.advanceTableForm.patchValue({pickupAddress:this.dataSource.pickupAddress});
          this.advanceTableForm.patchValue({
            pickupAddressDetails: this.dataSource.pickupAddressDetails
              ? `${this.dataSource.pickupAddressDetails} ${this.dataSource.pickupAddress}`
              : this.dataSource.pickupAddress
          });
          this.advanceTableForm.patchValue({serviceLocationID:this.dataSource.serviceLocationID});
          this.advanceTableForm.patchValue({serviceLocation:this.dataSource.serviceLocation});

          this.advanceTableForm.patchValue({dropOffDate:this.dataSource.dropOffDate});
          this.advanceTableForm.patchValue({dropOffTime:this.dataSource.dropOffTime});
          this.advanceTableForm.patchValue({dropOffAddress:this.dataSource.dropOffAddress});
          this.advanceTableForm.patchValue({
            dropOffAddressDetails: this.dataSource.dropOffAddressDetails
              ? `${this.dataSource.dropOffAddressDetails} ${this.dataSource.dropOffAddress}`
              : this.dataSource.dropOffAddress
          });
          this.advanceTableForm.patchValue({dropOffPriorityOrder:this.dataSource.dropOffPriorityOrder});

          this.advanceTableForm.patchValue({emailLink:this.dataSource.emailLink});
          this.advanceTableForm.patchValue({modeOfPaymentID:this.dataSource.modeOfPaymentID});
          this.advanceTableForm.patchValue({modeOfPayment:this.dataSource.modeOfPayment});
          this.advanceTableForm.patchValue({reservationStatus:this.dataSource.requestStatus || 'Approved'});
        },
        (error: HttpErrorResponse) => {
          if (error.status === 204 || error.status === 400) {
            this.dataSource = null;
            return;
          }
          this.dataSource = null;
        }
    );
  }

  refresh() {
    //this.loadData();
  }

  public SearchData() {
   // this.loadData();

  }
 
  public Filter() {
    this.PageNumber = 0;
    //this.loadData();
  }



  onBackPress(event) 
  {
    if (event.keyCode === 8) 
    {
      //this.loadData();
    }
  }

  public GetCustomerDetails() 
  {
    this.bookingConfigurationService.getCustomerDetails(this.BookingID).subscribe(
        data => {
          this.customerDetails = data;
          console.log(this.customerDetails);  
          if(this.customerDetails.customerID === 15)
          {
            this.GetB2CData();
          }
          const pickupTime24 = this.customerDetails.pickupTimeString || this.formatTime24(this.customerDetails.pickupTime);
          const dropOffTime24 = this.customerDetails.dropOffTimeString || this.formatTime24(this.customerDetails.dropOffTime);
          const pickupDateTime = this.mergeDateAndTimeFromStrings(
            this.customerDetails.pickupDate,
            pickupTime24
          ) ?? this.mergeDateAndTime(
            this.customerDetails.pickupDate,
            this.customerDetails.pickupTime
          );
          const dropOffDateTime = this.mergeDateAndTimeFromStrings(
            this.customerDetails.dropOffDate,
            dropOffTime24
          ) ?? this.mergeDateAndTime(
            this.customerDetails.dropOffDate,
            this.customerDetails.dropOffTime
          );
          this.advanceTableForm.patchValue({customerID:this.customerDetails.customerID});
          this.bookerID = this.customerDetails.primaryBookerID;
          this.advanceTableForm.patchValue({primaryBookerID:this.customerDetails.primaryBookerID});
          this.advanceTableForm.patchValue({pickupDateTime:pickupDateTime});
          this.advanceTableForm.patchValue({pickupDate:this.extractDate(pickupDateTime)});
          this.advanceTableForm.patchValue({pickupTime:this.extractTime(pickupDateTime)});
          this.advanceTableForm.patchValue({dropOffDateTime:dropOffDateTime});
          this.advanceTableForm.patchValue({dropOffDate:this.extractDate(dropOffDateTime)});
          this.advanceTableForm.patchValue({dropOffTime:this.extractTime(dropOffDateTime)});
          this.advanceTableForm.patchValue({customerGroupID:this.customerDetails.customerGroupID});
          this.advanceTableForm.patchValue({customerTypeID:this.customerDetails.customerTypeID});
          this.advanceTableForm.patchValue({pickupDateString:this._generalService.getDateFrom(this.advanceTableForm.value.pickupDate)});
          this.advanceTableForm.patchValue({pickupTimeString:pickupTime24 || this.formatTime24FromDateTime(pickupDateTime)});
          this.advanceTableForm.patchValue({dropOffDateString:this._generalService.getDateFrom(this.advanceTableForm.value.dropOffDate)});
          this.advanceTableForm.patchValue({dropOffTimeString:dropOffTime24 || this.formatTime24FromDateTime(dropOffDateTime)});
          this.onPickupDateChange();
          this.getSalesManager(this.customerDetails.customerID);
          this.getCustomerKam(this.customerDetails.customerID);
          this.GetPassengerDetails();
          this.GetIntegrationCustomerSpecificFields();
          this.refreshReservationStops();
        },
        (error: HttpErrorResponse) => { this.customerDetails = null; }
      );
  }

  public GetIntegrationCustomerSpecificFields() {
    this.bookingConfigurationService.getIntegrationCustomerSpecificFields(this.BookingID).subscribe(
      data => { this.integrationCustomFields = data || []; },
      () => { this.integrationCustomFields = []; }
    );
  }

  getIntegrationFieldValue(fieldName: string): string {
    if (!fieldName || !this.integrationCustomFields?.length) {
      return '';
    }
    const match = this.integrationCustomFields.find(
      field => (field.fieldName || '').toLowerCase() === fieldName.toLowerCase()
    );
    return match?.fieldValue || '';
  }

 private parseTimeToMoment(value: any): moment.Moment | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (value instanceof Date) {
    const parsed = moment(value);
    return parsed.isValid() ? parsed : null;
  }

  const candidates = [
    moment.ISO_8601,
    'YYYY-MM-DDTHH:mm:ss',
    'YYYY-MM-DDTHH:mm:ss.SSSZ',
    'HH:mm',
    'HH:mm:ss',
    'h:mm A',
    'hh:mm A',
  ];
  const strict = moment(value, candidates as any, true);
  if (strict.isValid()) {
    return strict;
  }

  const loose = moment(value);
  return loose.isValid() ? loose : null;
 }

 private formatTime24(value: any): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const twelveHour = moment(trimmed, ['h:mm A', 'hh:mm A', 'h:mm a', 'hh:mm a'], true);
    if (twelveHour.isValid()) {
      return twelveHour.format('HH:mm');
    }

    const direct = moment(trimmed, ['HH:mm', 'HH:mm:ss'], true);
    if (direct.isValid()) {
      return direct.format('HH:mm');
    }
  }

  const parsed = this.parseTimeToMoment(value);
  return parsed && parsed.isValid() ? parsed.format('HH:mm') : null;
 }

 /** Invariant date string for API (MMM DD yyyy) — avoids locale-dependent Date.toString(). */
 private formatBookingDateString(value: any): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = moment(
    value,
    ['DD/MM/YYYY', 'D/M/YYYY', 'DD-MM-YYYY', 'D-M-YYYY', 'MMM DD yyyy', moment.ISO_8601],
    true
  );
  if (parsed.isValid()) {
    return parsed.format('MMM DD yyyy');
  }

  const fallback = moment(value);
  return fallback.isValid() ? fallback.format('MMM DD yyyy') : null;
 }

 /** Wall-clock HH:mm from picker Date — uses moment for consistent 24h formatting. */
 private formatTime24FromDateTime(dateTime: any): string | null {
  if (dateTime === null || dateTime === undefined || dateTime === '') {
    return null;
  }

  if (typeof dateTime === 'string') {
    return this.formatTime24(dateTime);
  }

  const asMoment = moment.isMoment(dateTime) ? dateTime : moment(dateTime);
  if (asMoment.isValid()) {
    return asMoment.format('HH:mm');
  }

  return this.formatTime24(dateTime);
 }

 private mergeDateAndTimeFromStrings(pickupDate: any, pickupTime24: string | null): Date | null {
  if (!pickupDate || !pickupTime24) {
    return null;
  }

  const dateMoment = moment(pickupDate);
  const timeMoment = moment(pickupTime24, ['HH:mm', 'HH:mm:ss'], true);
  if (!dateMoment.isValid() || !timeMoment.isValid()) {
    return null;
  }

  return moment({
    year: dateMoment.year(),
    month: dateMoment.month(),
    date: dateMoment.date(),
    hour: timeMoment.hour(),
    minute: timeMoment.minute(),
    second: 0,
    millisecond: 0,
  }).toDate();
 }

 private mergeDateAndTime(pickupDate: any, pickupTime: any): Date {
  const time24 = this.formatTime24(pickupTime);
  const merged = this.mergeDateAndTimeFromStrings(pickupDate, time24);
  if (merged) {
    return merged;
  }

  const dateObj = new Date(pickupDate);
  const timeObj = new Date(pickupTime);

  if (isNaN(dateObj.getTime()) || isNaN(timeObj.getTime())) {
    throw new Error('Invalid pickupDate or pickupTime');
  }

  dateObj.setHours(
    timeObj.getHours(),
    timeObj.getMinutes(),
    timeObj.getSeconds(),
    timeObj.getMilliseconds()
  );

  return dateObj;
}

private extractDate(dateTime: Date): Date {
  return new Date(
    dateTime.getFullYear(),
    dateTime.getMonth(),
    dateTime.getDate()
  );
}

private extractTime(dateTime: Date): Date {
  return new Date(
    1970,
    0,
    1,
    dateTime.getHours(),
    dateTime.getMinutes(),
    dateTime.getSeconds(),
    dateTime.getMilliseconds()
  );
}




  public GetB2CData() 
  {
    this.bookingConfigurationService.getB2CDetails(this.BookingID).subscribe(
        data => {
          this.b2cDetails = data;
          this.advanceTableForm.patchValue({packageTypeID:this.b2cDetails.packageTypeID});
          this.advanceTableForm.patchValue({packageType:this.b2cDetails.packageType});
          this.advanceTableForm.patchValue({packageID:this.b2cDetails.packageID});
          this.advanceTableForm.patchValue({package:this.b2cDetails.package});
          this.advanceTableForm.patchValue({vehicleCategoryID:this.b2cDetails.vehicleCategoryID});
          this.advanceTableForm.patchValue({vehicleCategory:this.b2cDetails.vehicleCategory});
          this.advanceTableForm.patchValue({carType:this.b2cDetails.vehicleCategory});
          this.advanceTableForm.patchValue({vehicleID:this.b2cDetails.vehicleID});
          this.advanceTableForm.patchValue({vehicle:this.b2cDetails.vehicle});
          this.advanceTableForm.patchValue({pickupAddress:this.b2cDetails.pickupAddress});
          this.advanceTableForm.patchValue({dropOffAddress:this.b2cDetails.dropOffAddress});
        },
        (error: HttpErrorResponse) => { this.customerDetails = null; }
      );
  }

  //---------- Sales Manager ----------
  getSalesManager(customerID:any)
  {
    this._generalService.GetSalesManager(customerID).subscribe(
    data=>
    {
      this.salesManagerList = data || [];
      if (!this.salesManagerList.length) return;

      const salesExecutive = this.salesManagerList[0].firstName + ' ' + this.salesManagerList[0].lastName + '-' + this.salesManagerList[0].mobile + '-' + this.salesManagerList[0].email;
      this.advanceTableForm.patchValue({salesExecutive});
      this.advanceTableForm.patchValue({salesExecutiveID:this.salesManagerList[0]?.salesExecutiveID});
      const salesExecutiveControl = this.advanceTableForm.controls['salesExecutive'];
      if (salesExecutiveControl) {
        salesExecutiveControl.setValidators([this.salesExecutiveValidator(this.salesManagerList)]);
        salesExecutiveControl.updateValueAndValidity();
        this.filteredEmployeeOptions = salesExecutiveControl.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomerSE(value || ''))
        );
      }
    })
  }
  private _filterCustomerSE(value: string): any {
    const filterValue = value.toLowerCase();
    return this.salesManagerList?.filter(
      customer => 
      {
        return customer.firstName.toLowerCase().includes(filterValue) || customer.mobile.toLowerCase().includes(filterValue) || customer.email.toLowerCase().includes(filterValue);
      }
    );
  }
  salesExecutiveValidator(EmployeeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = EmployeeList.some(option => (option.firstName + ' ' + option.lastName + '-' + option.mobile + '-' + option.email).toLowerCase() === value);
      return match ? null : { salesExecutiveInvalid: true };
    };
  }

  //---------- KAM ----------
  getCustomerKam(customerID:any)
  {
    this._generalService.GetCustomerKam(customerID).subscribe(
    data=>
    {
      this.customerKamList = data || [];
      if (!this.customerKamList.length) return;

      const kam = this.customerKamList[0].firstName + ' ' + this.customerKamList[0].lastName + '-' + this.customerKamList[0].mobile + '-' + this.customerKamList[0].email;
      this.advanceTableForm.patchValue({kam});
      this.advanceTableForm.patchValue({kamID:this.customerKamList[0]?.kamID});
      const kamControl = this.advanceTableForm.controls['kam'];
      if (kamControl) {
        kamControl.setValidators([this.customerKAMValidator(this.customerKamList)]);
        kamControl.updateValueAndValidity();
        this.filteredEmployeesOptions = kamControl.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomerKAM(value || ''))
        );
      }
    })
  }
  private _filterCustomerKAM(value: string): any {
    const filterValue = value.toLowerCase();
    return this.customerKamList?.filter(
      customer => 
      {
        return customer.firstName.toLowerCase().includes(filterValue) || customer.mobile.toLowerCase().includes(filterValue) || customer.email.toLowerCase().includes(filterValue);
      }
    );
  }
  customerKAMValidator(EmployeesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = EmployeesList.some(option => (option.firstName + ' ' + option.lastName + '-' +option.mobile + '-' + option.email).toLowerCase() === value);
      return match ? null : { kamInvalid: true };
    };
  }

  public GetStopDetails() {
    debugger
  this.bookingConfigurationService.getStopDetails(this.BookingID).subscribe(
    data => {
      debugger;
      this.stopDetailsList = data;
      console.log(this.stopDetailsList);

      const enrouteStops = this.stopDetailsList.filter(x => this.isIntegrationEnrouteStop(x));
      this.refreshReservationStops(enrouteStops);

      const pickupStop = this.stopDetailsList.find(
        x => x.integrationRequestStopType?.toLowerCase() === 'pickup'
      );

      const dropOffStop = this.stopDetailsList.find(
        x => x.integrationRequestStopType?.toLowerCase() === 'dropoff'
      );

      // Pickup Binding
      if (pickupStop) {
        const address = this.getStopAddress(pickupStop);
        const landmark = this.getStopLandmark(pickupStop);
        const formattedDetails = landmark ? (address ? `${landmark} (${address})` : landmark) : `${landmark} (${address})`;
  this.advanceTableForm.patchValue({
    pickupAddress: address,
    pickupAddressLatitude: pickupStop.integrationRequestStopLatitude,
    pickupAddressLongitude: pickupStop.integrationRequestStopLongitude,
    pickupAddressDetails: formattedDetails,
    pickupStopOrderPriority: pickupStop.priorityOrder
  });
}

      // DropOff Binding
      if (dropOffStop) {
        const address = this.getStopAddress(dropOffStop);
        const landmark = this.getStopLandmark(dropOffStop);
        const formattedDetails = landmark ? (address ? `${landmark} (${address})` : landmark) : `${landmark} (${address})`;
  this.advanceTableForm.patchValue({
    dropOffAddress: address,
    dropOffAddressLatitude: dropOffStop.integrationRequestStopLatitude,
    dropOffAddressLongitude: dropOffStop.integrationRequestStopLongitude,
    dropOffAddressDetails: formattedDetails,
    dropOffStopOrderPriority: dropOffStop.priorityOrder
  });
}
    },
    (error: HttpErrorResponse) => {
      this.stopDetailsList = null;
    }
  );
}

  public GetPassengerDetails() 
  {
    
    this.bookingConfigurationService.getPassengerDetails(this.BookingID).subscribe(
        data => {
          
          this.passengerDetailsList = data;
          console.log(this.passengerDetailsList);
          if (this.passengerDetailsList?.length && this.passengerDetailsList[0].passengerID > 0) {
            this.advanceTableForm.patchValue({ primaryPassengerID: this.passengerDetailsList[0].passengerID });
          } else {
            this.advanceTableForm.patchValue({ primaryPassengerID: 0 });
          }
        },
        (error: HttpErrorResponse) => { this.passengerDetailsList = null; }
      );
  }

  public GetPackageVehcileDetails() 
  {
    this.bookingConfigurationService.getPackageVehcileDetails(this.BookingID).subscribe(
    data => {
      this.packageVehcileDetailsList = data;
      this.customerTravelRequestNumber=this.packageVehcileDetailsList.customerTravelRequestNumber;
      // this.advanceTableForm.patchValue({packageTypeID:this.packageVehcileDetailsList.packageTypeID});
      // this.advanceTableForm.patchValue({packageType:this.packageVehcileDetailsList.packageType.split("#")[1]});
      // this.advanceTableForm.patchValue({packageID:this.packageVehcileDetailsList.packageID});
      // this.advanceTableForm.patchValue({package:this.packageVehcileDetailsList.package});
      // this.advanceTableForm.patchValue({vehicleCategoryID:this.packageVehcileDetailsList.vehicleCategoryID});
      // this.advanceTableForm.patchValue({vehicleCategory:this.packageVehcileDetailsList.vehicleCategory.split("#")[1]});
      // this.advanceTableForm.patchValue({vehicleID:this.packageVehcileDetailsList.vehicleID});
      // this.advanceTableForm.patchValue({vehicle:this.packageVehcileDetailsList.vehicle});
      this.advanceTableForm.patchValue({reservationSourceDetail:this.customerTravelRequestNumber});
      },
    (error: HttpErrorResponse) => { this.passengerDetailsList = null; }
    );
  }


  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: BookingConfigurationCustomerDetails) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  submit() 
  {
    // emppty stuff
  }
  // NextCall() {
  //   if (this.dataSource.length > 0) {

  //     this.PageNumber++;
  //     //alert(this.PageNumber + 'mohit')
  //     //this.loadData();
  //   }
  //   //alert([this.PageNumber])
  // }
  // PreviousCall() {

  //   if (this.PageNumber > 0) {
  //     this.PageNumber--;
  //     //this.loadData();
  //   }
  // }

  onTicketNumberInput(event: any): void {
    const input = event.target.value.replace(/[^0-9]/g, '');
    this.advanceTableForm.get('ticketNumber')?.setValue(input, { emitEvent: false });
  }

  public confirmAdd(): void 
  {
    if (this.saving) {
      return;
    }
    if (this.advanceTableForm.invalid) {
      this.advanceTableForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    if(this.action=="edit")
    {
      //this.Put();
      this.saving = false;
    }
    else
    {
      this.Post();
    }
  }

  private normalizeOptionalInt(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
  }

  public Post(): void
  {
    const ctrn =
      this.customerTravelRequestNumber ||
      this.customerDetails?.customerTravelRequestNumber ||
      this.advanceTableForm.value.customerTravelRequestNumber ||
      '';

    this.advanceTableForm.patchValue({reservationExecutiveID:this._generalService.getUserID()});
    this.advanceTableForm.patchValue({bookingID:this.BookingID});
    this.advanceTableForm.patchValue({customerTravelRequestNumber: ctrn});

    if (!this.advanceTableForm.value.reservationStatus) {
      this.advanceTableForm.patchValue({reservationStatus: 'Approved'});
    }
    if (!this.advanceTableForm.value.reservationSourceDetail) {
      this.advanceTableForm.patchValue({reservationSourceDetail: ctrn});
    }

    this.advanceTableForm.patchValue({pickupDate:this.extractDate(this.advanceTableForm.value.pickupDateTime)});
    this.advanceTableForm.patchValue({pickupTime:this.extractTime(this.advanceTableForm.value.pickupDateTime)});
    this.advanceTableForm.patchValue({dropOffDate:this.extractDate(this.advanceTableForm.value.dropOffDateTime)});
    this.advanceTableForm.patchValue({dropOffTime:this.extractTime(this.advanceTableForm.value.dropOffDateTime)});
    this.advanceTableForm.patchValue({pickupDateString:this.formatBookingDateString(this.advanceTableForm.value.pickupDate)});
    this.advanceTableForm.patchValue({pickupTimeString:this.formatTime24FromDateTime(this.advanceTableForm.value.pickupDateTime)});
    this.advanceTableForm.patchValue({dropOffDateString:this.formatBookingDateString(this.advanceTableForm.value.dropOffDate)});
    this.advanceTableForm.patchValue({dropOffTimeString:this.formatTime24FromDateTime(this.advanceTableForm.value.dropOffDateTime)});
    this.advanceTableForm.patchValue({
      dropOffCityID: this.normalizeOptionalInt(this.advanceTableForm.value.dropOffCityID),
    });
    const payload: any = this.advanceTableForm.getRawValue();
    payload.reservationStops = this.reservationStops;
    payload.pickupTime = null;
    payload.dropOffTime = null;
    this.bookingConfigurationService.add(payload)  
    .subscribe(
    response => 
    {
      Swal.fire({
        title: '',
        text: 'Reservation - '+ response.data.reservationID +' Added.',
        icon: 'warning',
        showDenyButton: true,
        denyButtonColor: '#6c757d',
        denyButtonText: 'Control Panel'
      }).then((result) => {
        if (result.isDenied) 
        {
          this.navigateToControlPanel(response.data.reservationID);
        } ;
        });
      this.saving = false;
      this.saveDisabled = true; 
    },
    error =>
    {
        const message =
          typeof error === 'string'
            ? error
            : error?.error?.message || error?.message || 'Failed to save reservation.';
        Swal.fire({
            title: 'Save failed',
            text: message,
            icon: 'error',
          });
      this.saving = false;
      this.saveDisabled = true; 
    }
    )
  }
  
   navigateToControlPanel(reservationID?: number) {
      const queryParams = reservationID
        ? { reservationID: encodeURIComponent(this._generalService.encrypt(String(reservationID))) }
        : undefined;
      this.router.navigate(['/controlPanelDesign'], { queryParams });
      Swal.close();
    }

  /////////////////To Recieve Updates Start////////////////////////////
  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe
      (
        message => {
          //message contains the data sent from service
          this.messageReceived = message.text;
          this.MessageArray = this.messageReceived.split(":");
          if (this.MessageArray.length == 3) {
            if (this.MessageArray[0] == "ReservationGroupCreate") {
              if (this.MessageArray[1] == "ReservationGroupView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Created...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "UnlockEmployeeUpdate") {
              if (this.MessageArray[1] == "UnlockEmployeeView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Updated...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "UnlockEmployee") {
              if (this.MessageArray[1] == "UnlockEmployeeView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Account successfully...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "ReservationGroupAll") {
              if (this.MessageArray[1] == "ReservationGroupView") {
                if (this.MessageArray[2] == "Failure") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-danger',
                    'Operation Failed.....!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DataNotFound") {
              if (this.MessageArray[1] == "DuplicacyError") {
                if (this.MessageArray[2] == "Failure") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-danger',
                    'Duplicate Value Found.....!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
          }
        }
      );
  }

  onPickupDateChange() 
  {
    
    this._generalService.GetContractIDBasedOnDate(this.customerDetails.customerID, this.customerDetails.pickupDate.toString()).subscribe(
    data => {
      if (data) 
      {
        
        this.contractID = data;
        this.InitPackageType();
      } 
    }); 
  }

  InitPackageType(){
    this._generalService.getPackageTypeByContractID(this.contractID).subscribe(
      data=>
      {
        this.PackageTypeList=data;
        this.filteredPackageTypeOptions = this.advanceTableForm.controls['packageType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackageType(value || ''))
        ); 
      });
  }

  private _filterPackageType(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PackageTypeList?.filter(
      customer => 
      {
        return customer.packageType.toLowerCase().includes(filterValue);
      }
    );
  }
  
  onDTSelected(selectedDTName: string) {
    const selectedDT = this.PackageTypeList.find(
      data => data.packageType === selectedDTName
    );
  
    if (selectedDT) {
      this.getPackageTypeID(selectedDT.packageTypeID,selectedDT.packageType);
    }
  }
  
  getPackageTypeID(packageTypeID: any,packageType:any) {
   
    this.packageTypeID=packageTypeID;
    this.packageType=packageType;
    this.advanceTableForm.patchValue({packageTypeID:this.packageTypeID});
    this.advanceTableForm.patchValue({packageType:this.packageType});
    this.InitPackage();
  }

  onPackageTypeChanges(event:any)
  {
    if(event.keyCode===8)
    {
      // this.advanceTableForm.controls['packageID'].setValue('');
      // this.advanceTableForm.controls['package'].setValue('');
    }
  }


   //------------ Package -----------------
   InitPackage()
   {   
     this._generalService.GetPackagesForReservation(this.advanceTableForm.value.packageTypeID,this.advanceTableForm.value.packageType,this.contractID).subscribe(
       data=>
       {
         this.PackageList=data;
         this.filteredPackageOptions = this.advanceTableForm.controls['package'].valueChanges.pipe(
           startWith(""),
           map(value => this._filterPackage(value || ''))
         ); 
       });
   }
 
   private _filterPackage(value: string): any {
     const filterValue = value.toLowerCase();
     return this.PackageList?.filter(
       customer => 
       {
         return customer.package.toLowerCase().includes(filterValue);
       }
     );
   }
 
   onPackageSelected(selectedPackageName: string) {
     const selectedPackage = this.PackageList.find(
       data => data.package === selectedPackageName
     );
   
     if (selectedPackage) {
       this.getPackageID(selectedPackage.packageID);
     }
   }
   
   getPackageID(packageID: any) {
     this.packageID=packageID;
     this.advanceTableForm.patchValue({packageID:this.packageID});
     this.InitCity(this.packageType);
     this.InitVehicle(this.packageType);
     this.InitDropOffCity(this.packageType);
    
    //  this.getETRDropOffTime();
   }

   onPackageChanges(event:any)
  {
    if(event.keyCode===8)
    {
      // this.advanceTableForm.controls['pickupCityID'].setValue('');
      // this.advanceTableForm.controls['pickupCity'].setValue('');
      // this.advanceTableForm.controls['vehicle'].setValue('');
      // this.advanceTableForm.controls['vehicleID'].setValue('');
    }
  }


   //------------Pickup City -----------------
   InitCity(PackageType:string)
   {
     if(PackageType === "Local Rate")
       {
         this._generalService.GetPickupAndDropOffCities(this.contractID,this.packageID ||this.advanceTableForm.value.packageID).subscribe(
           data=>
           {
             this.CityList=data;
             this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
               startWith(""),
               map(value => this._filterCity(value || ''))
             ); 
           });
       }
     else if(PackageType === "Local Lumpsum Rate")
     {
       this._generalService.GetPickupAndDropOffCitiesForLocalLumpsum(this.contractID,this.packageID ||this.advanceTableForm.value.packageID).subscribe(
         data=>
         {
           this.CityList=data;
           this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
             startWith(""),
             map(value => this._filterCity(value || ''))
           ); 
         });
     }
 
     else if(PackageType === "Local On Demand Rate")
     {
       this._generalService.GetPickupAndDropOffCitiesForLocalOnDemand(this.contractID,this.packageID ||this.advanceTableForm.value.packageID).subscribe(
       data=>
       {
         this.CityList=data;
         this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
         startWith(""),
         map(value => this._filterCity(value || ''))
         ); 
       });
     }
 
     else if(PackageType === "Local Transfer Rate")
     {
       this._generalService.GetPickupAndDropOffCitiesForLocalTransfer(this.contractID,this.packageID ||this.advanceTableForm.value.packageID).subscribe(
       data=>
       {
         this.CityList=data;
         this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
         startWith(""),
         map(value => this._filterCity(value || ''))
         ); 
       });
     }
 
     else if(PackageType === "Long Term Rental Rate")
     {
       this._generalService.GetPickupAndDropOffCitiesForLongTermRental(this.contractID,this.packageID ||this.advanceTableForm.value.packageID).subscribe(
       data=>
       {
         this.CityList=data;
         this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
         startWith(""),
         map(value => this._filterCity(value || ''))
         ); 
       });
     }
 
     else if(PackageType === "Outstation Lumpsum Rate")
     {
       this._generalService.GetPickupAndDropOffCitiesForOutStationLumpsum(this.contractID,this.packageID ||this.advanceTableForm.value.packageID).subscribe(
       data=>
       {
         this.CityList=data;
         this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
         startWith(""),
         map(value => this._filterCity(value || ''))
         ); 
       });
     }
 
     else if(PackageType === "Outstation OneWay Trip Rate")
     {
       this._generalService.GetPickupAndDropOffCitiesForOutStationOneWayTrip(this.contractID,this.packageID ||this.advanceTableForm.value.packageID).subscribe(
       data=>
       {
         this.CityList=data;
         this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
         startWith(""),
         map(value => this._filterCity(value || ''))
         ); 
       });
     }
 
     else if(PackageType === "Outstation Round Trip Rate")
     {
       this._generalService.GetPickupAndDropOffCitiesForOutStationRoundTrip(this.contractID,this.packageID ||this.advanceTableForm.value.packageID).subscribe(
       data=>
       {
         this.CityList=data;
         this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
         startWith(""),
         map(value => this._filterCity(value || ''))
         ); 
       });
     }
 }
 
   private _filterCity(value: string): any {
     const filterValue = value.toLowerCase();
     return this.CityList?.filter(
       customer => 
       {
         return customer.geoPointName.toLowerCase().includes(filterValue);
       }
     );
   }
   
   onCitySelected(selectedCityName: string) {
     const selectedCity = this.CityList.find(
       data => data.geoPointName === selectedCityName
     );
   
     if (selectedCity) {
       this.getCityID(selectedCity.geoPointID);
     }
   }
 
   getCityID(cityID: any) {
     this.pickupCityID=cityID;
     this.advanceTableForm.patchValue({pickupCityID:this.pickupCityID});
   }

   onPickupCityKeyUp(event) {
    if (event.keyCode === 8) {
      // this.advanceTableForm.controls['pickupCityID'].setValue('');
      // this.advanceTableForm.controls['pickupCity'].setValue('');
      // this.advanceTableForm.controls['vehicleID'].setValue('');
      // this.advanceTableForm.controls['vehicle'].setValue('');
      // this.advanceTableForm.controls['serviceLocationID'].setValue('');
      // this.advanceTableForm.controls['serviceLocation'].setValue('');
    }
  }


  InitVehicle(PackageType)
  {
    if(PackageType === 'Local Rate')
      {
        this._generalService.GetVehicleBasedOnContractID(this.contractID,this.packageID || this.advanceTableForm.value.packageID).subscribe(
        data=>
        {
          this.VehicleList=data;
          this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicle(value || ''))
          ); 
        });
      }

    else if(PackageType === 'Local Lumpsum Rate')
    {
      this._generalService.GetVehicleBasedOnContractIDForLocalLumpsum(this.contractID,this.packageID || this.advanceTableForm.value.packageID).subscribe(
      data=>
      {
        this.VehicleList=data;
        this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterVehicle(value || ''))
        ); 
      });
    }

    else if(PackageType === 'Local On Demand Rate')
    {
      this._generalService.GetVehicleBasedOnContractIDForLocalOnDemand(this.contractID,this.packageID || this.advanceTableForm.value.packageID).subscribe(
      data=>
      {
        this.VehicleList=data;
        this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterVehicle(value || ''))
        ); 
      });
    }

    else if(PackageType === 'Local Transfer Rate')
    {
      this._generalService.GetVehicleBasedOnContractIDForLocalTransfer(this.contractID,this.packageID || this.advanceTableForm.value.packageID).subscribe(
      data=>
      {
        this.VehicleList=data;
        this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterVehicle(value || ''))
        ); 
      });
    }

    else if(PackageType === 'Long Term Rental Rate')
    {
      this._generalService.GetVehicleBasedOnContractIDForLongTermRental(this.contractID,this.packageID || this.advanceTableForm.value.packageID).subscribe(
      data=>
      {
        this.VehicleList=data;
        this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterVehicle(value || ''))
        ); 
      });
    }

    else if(PackageType === 'Outstation Lumpsum Rate')
    {
      this._generalService.GetVehicleBasedOnContractIDForOutStationLumpsum(this.contractID,this.packageID || this.advanceTableForm.value.packageID).subscribe(
      data=>
      {
        this.VehicleList=data;
        this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterVehicle(value || ''))
        ); 
      });
    }

  else if(PackageType === 'Outstation OneWay Trip Rate')
  {
    this._generalService.GetVehicleBasedOnContractIDForOutStationOneWayTrip(this.contractID,this.packageID || this.advanceTableForm.value.packageID).subscribe(
    data=>
    {
      this.VehicleList=data;
      this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
      startWith(""),
      map(value => this._filterVehicle(value || ''))
      ); 
    });
  }

  else if(PackageType === 'Outstation Round Trip Rate')
  {
    this._generalService.GetVehicleBasedOnContractIDForOutStationRoundTrip(this.contractID,this.packageID || this.advanceTableForm.value.packageID).subscribe(
    data=>
    {
      this.VehicleList=data;
      this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
      startWith(""),
      map(value => this._filterVehicle(value || ''))
      ); 
    });
  }
}

  private _filterVehicle(value: string): any {
    const filterValue = value.toLowerCase();
    return this.VehicleList?.filter(
      customer => 
      {
        return customer.vehicle.toLowerCase().includes(filterValue);
      }
    );
  }
  
  onCarSelected(selectedCarName: string) {
    const selectedCar = this.VehicleList.find(
      data => data.vehicle === selectedCarName
    );
  
    if (selectedCar) {
      this.getVehicleID(selectedCar.vehicleID, selectedCar.vehicleCategoryID, selectedCar.vehicleCategory);
    }
  }

  getVehicleID(vehicleID: any,vehicleCategoryID:any, vehicleCategory?: string) {
    this.vehicleID=vehicleID;
    this.vehicleCategoryID=vehicleCategoryID;
    this.advanceTableForm.patchValue({vehicleID:this.vehicleID});
    this.advanceTableForm.patchValue({vehicleCategoryID:this.vehicleCategoryID});
    if (vehicleCategory) {
      this.advanceTableForm.patchValue({carType: vehicleCategory});
      this.advanceTableForm.patchValue({vehicleCategory: vehicleCategory});
    }
  }


  InitGoogleAddress(){
    this._generalService.getGoogleAddress().subscribe(
      data=>
      {
        this.GoogleAddressList=data;
        this.filteredGoogleAddressOptions = this.advanceTableForm.controls['pickupAddress'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterGA(value || ''))
        ); 
      });
      
  }

  private _filterGA(value: string): any {
    const filterValue = value.toLowerCase();
    if(filterValue.length===0)
    {
      return []
    }
    return this.GoogleAddressList.filter(
      customer => 
      {
        return customer.geoSearchString.toLowerCase().includes(filterValue);
      }
    );
  }

  onPGLSelected(selectedPGLName: string) {
    const selectedPGL = this.GoogleAddressList.find(
      data => data.geoSearchString === selectedPGLName
    );
  
    if (selectedPGL) {
      this.OnPickupGeoLocationClick(selectedPGL);
    }
  }

  OnPickupGeoLocationClick(option:any)
  {
    let pickupGeoLocation=option.geoLocation;
    var value = pickupGeoLocation.replace(
      '(',
      ''
    );
    value = value.replace(')', '');
    var lat = value.split(' ')[2];
    var long = value.split(' ')[1];
    this.advanceTableForm.patchValue({pickupAddressLatLong:lat
      +
       ',' +
       long
   });

   this.advanceTableForm.patchValue({pickupAddressLatitude:lat});
   this.advanceTableForm.patchValue({pickupAddressLongitude:long});    
  }

  valueSwitch(){  
       
    if(this.advanceTableForm.value.googleAddresses===true)
    {
      this.ifBlock=false;
      this.advanceTableForm.controls["pickupAddress"].setValue('');
    }
    if(this.advanceTableForm.value.googleAddresses===false)
    {
      this.ifBlock=true;
      this.advanceTableForm.controls["pickupAddress"].setValue('');
    }
  }

  public handleAddressChange(address: any) {   
    this.pickupAddress = address.formatted_address;
    this.advanceTableForm.patchValue({ pickupAddress: this.pickupAddress });
    this.advanceTableForm.patchValue({pickupAddressLatLong:address.geometry.location.lat()
      +
       ',' +
       address.geometry.location.lng()
   });

    if (address.address_components.length > 1) {
      var pickupState = address.address_components.filter(
        (f) =>
          JSON.stringify(f.types) ===
          JSON.stringify(['administrative_area_level_1', 'political'])
      )[0].long_name;
    }

    if (address.address_components.length > 2) {
      var pickupCity = address.address_components.filter(
        (f) =>
          JSON.stringify(f.types) === JSON.stringify(['locality', 'political'])
      )[0].short_name;
    }
     
    this.googlePlacesForm.patchValue({geoPointID:-1});
    this.googlePlacesForm.patchValue({latitude:address.geometry.location.lat()});
    this.googlePlacesForm.patchValue({longitude:address.geometry.location.lng()}); 
    this.googlePlacesForm.patchValue({geoSearchString:this.pickupAddress});
    this.googlePlacesForm.patchValue({geoPointName:'Google Address'});
    this.googlePlacesForm.patchValue({googlePlacesID:address.place_id});
    this.googlePlacesForm.patchValue({activationStatus:true});
    this.PostGoogleAddress();
    
  }

  public PostGoogleAddress(): void
  {
    this.googlePlacesForm.patchValue({geoLocation:this.googlePlacesForm.value.latitude
      +
      ',' +
      this.googlePlacesForm.value.longitude});
    this.reservationService.addGoogleAddress(this.googlePlacesForm.value)  
    .subscribe(
      response => 
      {
        
      },
      error =>
      {
      
      }
    )
  }



  //------------ Service Location -----------------
  InitServiceLocation(){ 
    this._generalService.GetLocation().subscribe(
      data=>
      {
        this.ServiceLocationList=data;
        this.filteredServiceLocationOptions = this.advanceTableForm.controls['serviceLocation'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterServiceLocation(value || ''))
        ); 
      });
  }

  private _filterServiceLocation(value: string): any {
    const filterValue = value.toLowerCase();
    return this.ServiceLocationList?.filter(
      customer => 
      {
        return customer.organizationalEntityName.toLowerCase().includes(filterValue);
      }
    );
  }
  

  onSLSelected(selectedSLName: string) {
    const selectedSL = this.ServiceLocationList.find(
      data => data.organizationalEntityName === selectedSLName
    );
  
    if (selectedSL) {
      this.getServiceLocationID(selectedSL.organizationalEntityID);
    }
  }

  getServiceLocationID(serviceLocationID: any) {
    this.serviceLocationID=serviceLocationID;
    this.advanceTableForm.patchValue({serviceLocationID:this.serviceLocationID});
    this.advanceTableForm.patchValue({transferedLocationID:this.serviceLocationID});
  }
  

  //--------------------------------Drop Off Details----------------------------------------

  //------------DropOff City -----------------
  InitDropOffCity(PackageType:string)
  {
   if(PackageType === 'Local Rate')
     {
       this._generalService.GetPickupAndDropOffCities(this.contractID,this.packageID ||this.advanceTableForm.value.packageID).subscribe(
         data=>
         {
           this.DropOffCityList=data;
        this.filteredDropOffCityOptions = this.advanceTableForm.controls['dropOffCity'].valueChanges.pipe(
         startWith(""),
         map(value => this._filterDropOffCity(value || ''))
       ); 
     });
     }
   else if(PackageType === 'Local Lumpsum Rate')
   {
     this._generalService.GetPickupAndDropOffCitiesForLocalLumpsum(this.contractID,this.packageID ||this.advanceTableForm.value.packageID).subscribe(
       data=>
       {
         this.DropOffCityList=data;
       this.filteredDropOffCityOptions = this.advanceTableForm.controls['dropOffCity'].valueChanges.pipe(
         startWith(""),
         map(value => this._filterDropOffCity(value || ''))
       ); 
     });
   }

   else if(PackageType === 'Local On Demand Rate')
   {
     this._generalService.GetPickupAndDropOffCitiesForLocalOnDemand(this.contractID,this.packageID ||this.advanceTableForm.value.packageID).subscribe(
     data=>
     {
       this.DropOffCityList=data;
       this.filteredDropOffCityOptions = this.advanceTableForm.controls['dropOffCity'].valueChanges.pipe(
         startWith(""),
         map(value => this._filterDropOffCity(value || ''))
       ); 
     });
   }

   else if(PackageType === 'Local Transfer Rate')
   {
     this._generalService.GetPickupAndDropOffCitiesForLocalTransfer(this.contractID,this.packageID ||this.advanceTableForm.value.packageID).subscribe(
     data=>
     {
       this.DropOffCityList=data;
       this.filteredDropOffCityOptions = this.advanceTableForm.controls['dropOffCity'].valueChanges.pipe(
         startWith(""),
         map(value => this._filterDropOffCity(value || ''))
       ); 
     });
   }

   else if(PackageType === 'Long Term Rental Rate')
   {
     this._generalService.GetPickupAndDropOffCitiesForLongTermRental(this.contractID,this.packageID ||this.advanceTableForm.value.packageID).subscribe(
     data=>
     {
       this.DropOffCityList=data;
       this.filteredDropOffCityOptions = this.advanceTableForm.controls['dropOffCity'].valueChanges.pipe(
         startWith(""),
         map(value => this._filterDropOffCity(value || ''))
       ); 
     });
   }

   else if(PackageType === 'Outstation Lumpsum Rate')
   {
     this._generalService.GetPickupAndDropOffCitiesForOutStationLumpsum(this.contractID,this.packageID ||this.advanceTableForm.value.packageID).subscribe(
     data=>
     {
       this.DropOffCityList=data;
       this.filteredDropOffCityOptions = this.advanceTableForm.controls['dropOffCity'].valueChanges.pipe(
         startWith(""),
         map(value => this._filterDropOffCity(value || ''))
       ); 
     });
   }

   else if(PackageType === 'Outstation OneWay Trip Rate')
   {
     this._generalService.GetPickupAndDropOffCitiesForOutStationOneWayTrip(this.contractID,this.packageID ||this.advanceTableForm.value.packageID).subscribe(
     data=>
     {
       this.DropOffCityList=data;
       this.filteredDropOffCityOptions = this.advanceTableForm.controls['dropOffCity'].valueChanges.pipe(
         startWith(""),
         map(value => this._filterDropOffCity(value || ''))
       ); 
     });
   }

   else if(PackageType === 'Outstation Round Trip Rate')
   {
     this._generalService.GetPickupAndDropOffCitiesForOutStationRoundTrip(this.contractID,this.packageID ||this.advanceTableForm.value.packageID).subscribe(
     data=>
     {
       this.DropOffCityList=data;
       this.filteredDropOffCityOptions = this.advanceTableForm.controls['dropOffCity'].valueChanges.pipe(
         startWith(""),
         map(value => this._filterDropOffCity(value || ''))
       ); 
     });
   }
 }

 private _filterDropOffCity(value: string): any {
   const filterValue = value.toLowerCase();
   return this.DropOffCityList?.filter(
     customer => 
     {
       return customer.geoPointName.toLowerCase().includes(filterValue);
     }
   );
 }

 onDropCitySelected(selectedDropCityName: string) {
   const selectedDropCity = this.DropOffCityList.find(
     data => data.geoPointName === selectedDropCityName
   );
 
   if (selectedDropCity) {
     this.getDropOffCityID(selectedDropCity.geoPointID);
   }
 }
 
 getDropOffCityID(dropOffCityID: any) {
   this.dropOffCityID=dropOffCityID;
   this.advanceTableForm.patchValue({dropOffCityID:this.dropOffCityID});
 }



 InitDropOffGoogleAddress(){
  this._generalService.getGoogleAddress().subscribe(
    data=>
    {
      this.DropOffGoogleAddressList=data;
      this.filteredDropOffGoogleAddressOptions = this.advanceTableForm.controls['dropOffAddress'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterDropoffGA(value || ''))
      ); 
    });
}

private _filterDropoffGA(value: string): any {
  const filterValue = value.toLowerCase();
  if(filterValue.length===0)
  {
    return []
  }
  return this.DropOffGoogleAddressList.filter(
    customer => 
    {
      return customer.geoSearchString.toLowerCase().includes(filterValue);
    }
  );
}

onDropGLSelected(selectedDGLName: string) {
  const selectedDGL = this.DropOffGoogleAddressList.find(
    data => data.geoSearchString === selectedDGLName
  );

  if (selectedDGL) {
    this.OnDropOffGeoLocationClick(selectedDGL);
  }
}

OnDropOffGeoLocationClick(option:any)
  {
    let dropOffGeoLocation=option.geoLocation;
    var value = dropOffGeoLocation.replace(
      '(',
      ''
    );
    value = value.replace(')', '');
    var lat = value.split(' ')[2];
    var long = value.split(' ')[1];
    this.advanceTableForm.patchValue({dropOffAddressLatitude : lat});
    this.advanceTableForm.patchValue({dropOffAddressLongitude : long});
    this.advanceTableForm.patchValue({dropOffAddressLatLong:this.advanceTableForm.value.dropOffAddressLatitude
      +
       ',' +
       this.advanceTableForm.value.dropOffAddressLongitude
   });
    
  }

  public handleAddressChangeDropOff(address: any) {
    //this.formattedAddress = address.formatted_address;
    this.dropOffAddress = address.formatted_address;
    this.advanceTableForm.patchValue({ dropOffAddress: this.dropOffAddress });
    this.advanceTableForm.patchValue({dropOffAddressLatLong:address.geometry.location.lat()
      +
       ',' +
       address.geometry.location.lng()
   });

    if (address.address_components.length > 1) {
      var dropoffState = address.address_components.filter(
        (f) =>
          JSON.stringify(f.types) ===
          JSON.stringify(['administrative_area_level_1', 'political'])
      )[0].long_name;
    }

    if (address.address_components.length > 2) {
      var dropOffCity = address.address_components.filter(
        (f) =>
          JSON.stringify(f.types) === JSON.stringify(['locality', 'political'])
      )[0].short_name;
    }
    this.googlePlacesForm.patchValue({geoPointID:-1});
    this.googlePlacesForm.patchValue({latitude:address.geometry.location.lat()});
    this.googlePlacesForm.patchValue({longitude:address.geometry.location.lng()}); 
    this.googlePlacesForm.patchValue({geoSearchString:this.pickupAddress});
    this.googlePlacesForm.patchValue({geoPointName:'Google Address'});
    this.googlePlacesForm.patchValue({googlePlacesID:address.place_id});
    this.googlePlacesForm.patchValue({activationStatus:true});
    this.PostGoogleAddress();
    // this.advanceTableForm.controls["dropOffCity"].disable();
    // this.getCityIDByNameForDropOff(this.dropOffCity);
    // this.advanceTableForm.patchValue({dropOffCity:this.dropOffCity});
    
  }

  dropOffControlSwitch(){
    if(this.advanceTableForm.value.googleAdressesDropOff===true)
    {
      this.dropOffifBlock=false;
      this.advanceTableForm.controls["dropOffAddress"].setValue('');
    }
    if(this.advanceTableForm.value.googleAdressesDropOff===false)
    {
      this.dropOffifBlock=true;
      this.advanceTableForm.controls["dropOffAddress"].setValue('');
    }
  }

  //------------ ReservationSource -----------------
  InitReservationSource(){
    this._generalService.GetReservationSource().subscribe(
      data=>
      {
        this.ReservationSourceList=data;
        this.filteredReservationSourceOptions = this.advanceTableForm.controls['reservationSource'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterReservationSource(value || ''))
        ); 
      });
  }

  private _filterReservationSource(value: string): any {
    const filterValue = value.toLowerCase();
    return this.ReservationSourceList?.filter(
      data => 
      {
        return data.reservationSource.toLowerCase().includes(filterValue);
      }
    );
  }
  
  onRSSelected(selectedRSName: string) 
  {
    const selectedRS = this.ReservationSourceList.find(
      data => data.reservationSource === selectedRSName
    );
    if (selectedRS) 
    {
      this.getReservationSourceID(selectedRS.reservationSourceID);
    }
  }

  getReservationSourceID(reservationSourceID: any) 
  {
    this.reservationSourceID=reservationSourceID;
    this.advanceTableForm.patchValue({reservationSourceID:this.reservationSourceID});
  }

  //---------- Mode Of Payment ----------
  InitPaymentMode(){
    this._generalService.GetModeOfPayment().subscribe(
      data=>
      {
        this.PaymentModeList=data;
        this.filteredPaymentModeOptions = this.advanceTableForm.controls['modeOfPayment'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPaymentMode(value || ''))
        ); 
      });
  }
  
  private _filterPaymentMode(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PaymentModeList?.filter(
      customer => 
      {
        return customer.modeOfPayment.toLowerCase().includes(filterValue);
      }
    );
  }
  
  onPMSelected(selectedPMName: string) {
    const selectedPM = this.PaymentModeList.find(
      data => data.modeOfPayment === selectedPMName
    );
  
    if (selectedPM) {
      this.getPaymentModeID(selectedPM.modeOfPaymentID);
    }
  }

  getPaymentModeID(paymentModeID: any) {
    this.paymentModeID=paymentModeID;
    this.advanceTableForm.patchValue({modeOfPaymentID:this.paymentModeID});
  }
   confirmRejected()
  {
    this.bookingConfigurationService.delete(this.BookingID,this.customerTravelRequestNumber)  
    .subscribe(
     response => 
      { 
        this.showNotification(
          'snackbar-success',
          'Reservation Rejected...!!!',
          'bottom',
          'center'
        );
       },
      error =>
      {
        this.showNotification(
          'snackbar-danger',
          'Operation Failed...!!!',
          'bottom',
          'center'
        );
      }
    )
  }

  getStopLabel(type: string): string {
    if (type === 'Pickup') return 'Pickup';
    if (type === 'DropOff') return 'DropOff';
    if (type === 'Enroute') return 'Pickup';
    return 'Stop';
  }

  get enrouteStops(): BookingConfigurationStopDetails[] {
    if (!this.stopDetailsList?.length) {
      return [];
    }
    return this.stopDetailsList.filter(stop => this.isIntegrationEnrouteStop(stop));
  }

  private isIntegrationEnrouteStop(stop: BookingConfigurationStopDetails): boolean {
    const type = stop?.integrationRequestStopType?.trim().toLowerCase();
    if (!type) {
      return false;
    }
    if (type === 'start' || type === 'pickup') {
      return false;
    }
    if (type === 'end' || type === 'dropoff') {
      return false;
    }
    return true;
  }

  getStopAddress(stop: BookingConfigurationStopDetails | null | undefined): string {
    if (!stop) {
      return '';
    }
    return stop.integrationRequestStopGeoLocation
      || stop.integrationRequestStopAddress
      || '';
  }

  getStopLandmark(stop: BookingConfigurationStopDetails | null | undefined): string {
    if (!stop) {
      return '';
    }
    if (stop.integrationRequestStopGeoLocation) {
      return stop.integrationRequestStopAddress || stop.landmark || '';
    }
    return stop.landmark || '';
  }

  getPassengerPickupStop(passenger: BookingConfigurationPassengerDetails): BookingConfigurationStopDetails | null {
    return this.resolvePassengerStop(
      passenger?.integrationRequestPickupStopID,
      'pickup'
    );
  }

  getPassengerDropoffStop(passenger: BookingConfigurationPassengerDetails): BookingConfigurationStopDetails | null {
    return this.resolvePassengerStop(
      passenger?.integrationRequestDropoffStopID,
      'dropoff'
    );
  }

  private resolvePassengerStop(
    stopId: number | null | undefined,
    fallbackType: 'pickup' | 'dropoff'
  ): BookingConfigurationStopDetails | null {
    if (!this.stopDetailsList?.length) {
      return null;
    }
    if (stopId) {
      const linkedStop = this.stopDetailsList.find(s => s.integrationRequestStopID === stopId);
      if (linkedStop) {
        return linkedStop;
      }
    }
    return this.stopDetailsList.find(
      stop => stop.integrationRequestStopType?.toLowerCase() === fallbackType
    ) || null;
  }

  getPassengerPickupAddress(passenger: BookingConfigurationPassengerDetails): string {
    return this.getStopAddress(this.getPassengerPickupStop(passenger))
      || passenger?.pickupAddress
      || '';
  }

  getPassengerDropoffAddress(passenger: BookingConfigurationPassengerDetails): string {
    return this.getStopAddress(this.getPassengerDropoffStop(passenger))
      || passenger?.dropoffAddress
      || '';
  }

  getPassengerPickupLandmark(passenger: BookingConfigurationPassengerDetails): string {
    return this.getStopLandmark(this.getPassengerPickupStop(passenger));
  }

  getPassengerDropoffLandmark(passenger: BookingConfigurationPassengerDetails): string {
    return this.getStopLandmark(this.getPassengerDropoffStop(passenger));
  }

  get pickupCityName(): string {
    const pickupStop = this.stopDetailsList?.find(
      stop => stop.integrationRequestStopType?.toLowerCase() === 'pickup'
    );
    if (pickupStop?.integrationRequestStopCity) {
      return pickupStop.integrationRequestStopCity;
    }
    return this.advanceTableForm?.value?.pickupCity || '--';
  }

  get requestedCarType(): string {
    return this.b2cDetails?.vehicleCategory || this.customerDetails?.vehicle || '--';
  }

  get passengerCount(): number {
    return this.passengerDetailsList?.length ?? 0;
  }

  get receivedOnDisplay(): string {
    if (!this.customerDetails?.requestDate) {
      return '--';
    }

    const parts: string[] = [moment(this.customerDetails.requestDate).format('DD/MM/YYYY')];
    if (this.customerDetails.requestTime) {
      parts.push(moment(this.customerDetails.requestTime).format('HH:mm'));
    }
    return parts.join(' ');
  }

  displayOrDash(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '--';
    }
    return String(value);
  }

  hasDisplayValue(value: string | number | null | undefined): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    const text = String(value).trim();
    return text !== '' && text !== '--';
  }

  get hasAnyAdditionalInfo(): boolean {
    return [
      this.customerDetails?.entityCode,
      this.customerDetails?.entityName,
      this.customerDetails?.gstin,
      this.customerDetails?.location,
      this.getIntegrationFieldValue('FlightDetails') || this.customerDetails?.specialRequest,
      this.getIntegrationFieldValue('travelRequestNo'),
      this.getIntegrationFieldValue('Comments') || this.customerDetails?.specialRequest,
      this.getIntegrationFieldValue('legNo'),
      this.getIntegrationFieldValue('companyCode'),
      this.getIntegrationFieldValue('travellerType'),
      this.getIntegrationFieldValue('locationToBeBilled'),
      this.getIntegrationFieldValue('companyGSTN'),
      this.getIntegrationFieldValue('billingAddress'),
      this.getIntegrationFieldValue('businessArea'),
      this.getIntegrationFieldValue('ProjectCode'),
      this.getIntegrationFieldValue('TaskCode'),
    ].some(value => this.hasDisplayValue(value));
  }

  getPassengerDisplayName(passenger: BookingConfigurationPassengerDetails, index: number): string {
    const name = passenger?.integrationRequestPassenger?.trim();
    return name || `Passenger ${index + 1}`;
  }

  getPassengerPickupDateTime(passenger: BookingConfigurationPassengerDetails): string {
    const requestParts: string[] = [];
    if (this.customerDetails?.pickupDate) {
      requestParts.push(moment(this.customerDetails.pickupDate).format('DD/MM/YYYY'));
    }
    const requestTime24 = this.customerDetails?.pickupTimeString
      || this.formatTime24(this.customerDetails?.pickupTime);
    if (requestTime24) {
      requestParts.push(requestTime24);
    }
    if (requestParts.length) {
      return requestParts.join(', ');
    }

    return this.formatStopDateTime(this.getPassengerPickupStop(passenger));
  }

  getPassengerDropoffDateTime(passenger: BookingConfigurationPassengerDetails): string {
    const requestParts: string[] = [];
    if (this.customerDetails?.dropOffDate) {
      requestParts.push(moment(this.customerDetails.dropOffDate).format('DD/MM/YYYY'));
    }
    const requestTime24 = this.customerDetails?.dropOffTimeString
      || this.formatTime24(this.customerDetails?.dropOffTime);
    if (requestTime24) {
      requestParts.push(requestTime24);
    }
    if (requestParts.length) {
      return requestParts.join(', ');
    }

    return this.formatStopDateTime(this.getPassengerDropoffStop(passenger));
  }

  formatStopDateTime(stop: BookingConfigurationStopDetails | null | undefined): string {
    if (!stop) {
      return '--';
    }
    const parts: string[] = [];
    if (stop.integrationRequestStopDate) {
      parts.push(moment(stop.integrationRequestStopDate).format('DD/MM/YYYY'));
    }

    const stopTime24 = stop.integrationRequestStopTimeString
      || this.formatTime24(stop.integrationRequestStopTime);
    if (stopTime24) {
      parts.push(stopTime24);
    }

    return parts.length ? parts.join(', ') : '--';
  }

  formatEnrouteStopNo(index: number): number {
    return index + 1;
  }

  private isCognizantBooking(): boolean {
    const customerName = (this.customerDetails?.customerName || '').toLowerCase();
    const customerCode = (this.customerDetails?.customerCodeForAPIIntegration || '').toLowerCase();
    return customerName.includes('cognizant') || customerCode === 'cvx-cvxindia';
  }

  private refreshReservationStops(enrouteStops?: BookingConfigurationStopDetails[]): void {
    const stops = enrouteStops
      ?? this.stopDetailsList?.filter(stop => this.isIntegrationEnrouteStop(stop))
      ?? [];

    this.reservationStops = this.isCognizantBooking()
      ? []
      : stops.map(stop => ({
          reservationStopID: stop.integrationRequestStopID,
          reservationStopType: stop.integrationRequestStopType,
          reservationStopAddress: this.getStopAddress(stop),
          reservationStopAddressDetails: this.getStopLandmark(stop),
          reservationStopCity: stop.integrationRequestStopCity,
          reservationStopDateString: stop.integrationRequestStopDate,
          reservationStopTimeDateString: stop.integrationRequestStopTime,
          reservationStopOrderPriority: stop.priorityOrder,
          activationStatus: true
        }));
  }

  private combineAddressWithDetails(address: string, details: string): string {
    const trimmedAddress = (address || '').trim();
    const trimmedDetails = (details || '').trim();
    if (!trimmedAddress) {
      return trimmedDetails;
    }
    if (!trimmedDetails) {
      return trimmedAddress;
    }
    return `${trimmedAddress} ${trimmedDetails}`;
  }

  onBack(): void {
    this.router.navigateByUrl(this.returnUrl);
  }

  private resolveReturnUrl(returnUrl?: string): string {
    const defaultUrl = '/bookingRequest';
    if (!returnUrl || typeof returnUrl !== 'string') {
      return defaultUrl;
    }

    const trimmed = returnUrl.trim();
    if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('://')) {
      return defaultUrl;
    }

    return trimmed;
  }
}




