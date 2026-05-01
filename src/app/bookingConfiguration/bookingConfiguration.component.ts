// @ts-nocheck
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
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
  contractID: any;
  action: string;
  customerTravelRequestNumber: string;


  advanceTableForm = this.fb.group({
    packageTypeID: [''],
    packageType:[''],
    packageID:[''],
    package:[''],
    vehicleID:[''],
    vehicle:[''],
    vehicleCategoryID:[''],
    // requestType:[''],
    pickupCityID:[''],
    pickupCity:[''],
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
    transferedLocationID:[''],
    transferedLocation:[''],
    dropOffDateTime:[''],
    dropOffDateTimeString:[''],
    dropOffDate:[''],
    dropOffDateString:[''],
    dropOffTime:[''],
    dropOffTimeString:[''],
    dropOffCityID:[''],
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
    salesExecutiveID:[''],
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
          this.dataSource = data;
          this.PackageType = this.dataSource.packageType;
          this.advanceTableForm.patchValue({packageTypeID:this.dataSource.packageTypeID});
          this.advanceTableForm.patchValue({packageType:this.dataSource.packageType});
          this.advanceTableForm.patchValue({packageID:this.dataSource.packageID});
          this.advanceTableForm.patchValue({package:this.dataSource.package});
          this.advanceTableForm.patchValue({pickupCityID:this.dataSource.pickupCityID});
          this.advanceTableForm.patchValue({pickupCity:this.dataSource.pickupCity});
          this.advanceTableForm.patchValue({pickupPriorityOrder:this.dataSource.pickupPriorityOrder});
          this.advanceTableForm.patchValue({vehicleID:this.dataSource.vehicleID});
          this.advanceTableForm.patchValue({vehicle:this.dataSource.vehicle});
          this.advanceTableForm.patchValue({pickupAddress:this.dataSource.pickupAddress});
          this.advanceTableForm.patchValue({pickupAddressDetails:this.dataSource.pickupAddressDetails});
          this.advanceTableForm.patchValue({serviceLocationID:this.dataSource.serviceLocationID});
          this.advanceTableForm.patchValue({serviceLocation:this.dataSource.serviceLocation});

          this.advanceTableForm.patchValue({dropOffDate:this.dataSource.dropOffDate});
          this.advanceTableForm.patchValue({dropOffTime:this.dataSource.dropOffTime});
          this.advanceTableForm.patchValue({dropOffCityID:this.dataSource.dropOffCityID});
          this.advanceTableForm.patchValue({dropOffCity:this.dataSource.dropOffCity});
          this.advanceTableForm.patchValue({dropOffAddress:this.dataSource.dropOffAddress});
          this.advanceTableForm.patchValue({dropOffAddressDetails:this.dataSource.dropOffAddressDetails});
          this.advanceTableForm.patchValue({dropOffPriorityOrder:this.dataSource.dropOffPriorityOrder});

          this.advanceTableForm.patchValue({emailLink:this.dataSource.emailLink});
          this.advanceTableForm.patchValue({modeOfPaymentID:this.dataSource.modeOfPaymentID});
          this.advanceTableForm.patchValue({modeOfPayment:this.dataSource.modeOfPayment});
          this.advanceTableForm.patchValue({reservationStatus:this.dataSource.requestStatus}); 
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
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
          const pickupDateTime = this.mergeDateAndTime(
          this.customerDetails.pickupDate,
          this.customerDetails.pickupTime
        );
        const dropOffDateTime = this.mergeDateAndTime(
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
          this.advanceTableForm.patchValue({pickupTimeString:this._generalService.getTimeFroms(this.advanceTableForm.value.pickupTime)});
          this.advanceTableForm.patchValue({dropOffDateString:this._generalService.getDateFrom(this.advanceTableForm.value.dropOffDate)});
          this.advanceTableForm.patchValue({dropOffTimeString:this._generalService.getTimeFroms(this.advanceTableForm.value.dropOffTime)});
          this.onPickupDateChange();
          this.getSalesManager(this.customerDetails.customerID);
          this.getCustomerKam(this.customerDetails.customerID);
          this.GetPassengerDetails();
        },
        (error: HttpErrorResponse) => { this.customerDetails = null; }
      );
  }

 private mergeDateAndTime(pickupDate: any, pickupTime: any): Date {
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
          this.advanceTableForm.patchValue({vehicleID:this.b2cDetails.vehicleID});
          this.advanceTableForm.patchValue({vehicle:this.b2cDetails.vehicle});
          this.advanceTableForm.patchValue({pickupCityID:this.b2cDetails.cityID});
          this.advanceTableForm.patchValue({pickupCity:this.b2cDetails.city});
          this.advanceTableForm.patchValue({dropOffCityID:this.b2cDetails.cityID});
          this.advanceTableForm.patchValue({dropOffCity:this.b2cDetails.city});
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
      this.salesManagerList=data;
      this.advanceTableForm.patchValue({salesExecutive:this.salesManagerList[0].firstName + ' ' + this.salesManagerList[0].lastName + '-' + this.salesManagerList[0].mobile + '-' + this.salesManagerList[0].email});
      this.advanceTableForm.patchValue({salesExecutiveID:this.salesManagerList[0]?.salesExecutiveID});
      this.advanceTableForm.controls['salesExecutive'].setValidators([this.salesExecutiveValidator(this.salesManagerList)]);
      this.advanceTableForm.controls['salesExecutive'].updateValueAndValidity();
      this.filteredEmployeeOptions = this.advanceTableForm.controls['salesExecutive'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterCustomerSE(value || ''))
      )
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
      this.customerKamList=data;  
      this.advanceTableForm.patchValue({kam:this.customerKamList[0].firstName + ' ' + this.customerKamList[0].lastName + '-' + this.customerKamList[0].mobile + '-' + this.customerKamList[0].email});
      this.advanceTableForm.patchValue({kamID:this.customerKamList[0]?.kamID});
      this.advanceTableForm.controls['kam'].setValidators([this.customerKAMValidator(this.customerKamList)]);
      this.advanceTableForm.controls['kam'].updateValueAndValidity();
      this.filteredEmployeesOptions = this.advanceTableForm.controls['kam'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterCustomerKAM(value || ''))
      ) 
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

  public GetStopDetails() 
  {
    this.bookingConfigurationService.getStopDetails(this.BookingID).subscribe(
        data => {
          this.stopDetailsList = data;
          // this.advanceTableForm.patchValue({pickupCityID:this.stopDetailsList[0].integrationRequestStopID});
          // this.advanceTableForm.patchValue({pickupCity:this.stopDetailsList[0].integrationRequestStopCity.split("#")[1]});
           this.advanceTableForm.patchValue({pickupAddress:this.stopDetailsList[0].integrationRequestStopAddress});
           this.advanceTableForm.patchValue({pickupAddressLatitude:this.stopDetailsList[0].integrationRequestStopLatitude});
           this.advanceTableForm.patchValue({pickupAddressLongitude:this.stopDetailsList[0].integrationRequestStopLongitude});
          // this.advanceTableForm.patchValue({pickupDate:this.stopDetailsList[0].integrationRequestStopDate});
          // this.advanceTableForm.patchValue({pickupTime:this.stopDetailsList[0].integrationRequestStopTime});
           this.advanceTableForm.patchValue({pickupStopOrderPriority:this.stopDetailsList[0].priorityOrder});

          // this.advanceTableForm.patchValue({dropOffCityID:this.stopDetailsList[1].integrationRequestStopID});
          // this.advanceTableForm.patchValue({dropOffCity:this.stopDetailsList[1].integrationRequestStopCity.split("#")[1]});
           this.advanceTableForm.patchValue({dropOffAddress:this.stopDetailsList[1].integrationRequestStopAddress});
           this.advanceTableForm.patchValue({dropOffAddressLatitude:this.stopDetailsList[1].integrationRequestStopLatitude});
           this.advanceTableForm.patchValue({dropOffAddressLongitude:this.stopDetailsList[1].integrationRequestStopLongitude});
          // this.advanceTableForm.patchValue({dropOffDate:this.stopDetailsList[1].integrationRequestStopDate});
          // this.advanceTableForm.patchValue({dropOffTime:this.stopDetailsList[1].integrationRequestStopTime});
           this.advanceTableForm.patchValue({dropOffStopOrderPriority:this.stopDetailsList[1].priorityOrder});
          
        },
        (error: HttpErrorResponse) => { this.stopDetailsList = null; }
      );
  }

  public GetPassengerDetails() 
  {
    
    this.bookingConfigurationService.getPassengerDetails(this.BookingID).subscribe(
        data => {
          
          this.passengerDetailsList = data;
          console.log(this.passengerDetailsList);
          if(this.passengerDetailsList[0].passengerID == 0)
          {
            this.advanceTableForm.patchValue({primaryPassengerID:this.bookerID});
          }
          else{
            this.advanceTableForm.patchValue({primaryPassengerID:this.passengerDetailsList[0].passengerID});
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

  public confirmAdd(): void 
  {
    this.saveDisabled = false;
    if(this.action=="edit")
    {
      //this.Put();
    }
    else
    {
      this.Post();
    }
  }

  public Post(): void
  {
    
    this.advanceTableForm.patchValue({reservationExecutiveID:this._generalService.getUserID()});
    this.advanceTableForm.patchValue({bookingID:this.BookingID});
    this.advanceTableForm.patchValue({customerTravelRequestNumber:this.customerTravelRequestNumber});
    //this.advanceTableForm.patchValue({pickupDate:this.customerDetails.pickupDate});
    // this.advanceTableForm.patchValue({salesExecutiveID:this.salesManagerList[0]?.salesExecutiveID});
    // this.advanceTableForm.patchValue({kamID:this.customerKamList[0]?.kamID});
    if(!this.advanceTableForm.value.dropOffCityID)
    {
      this.advanceTableForm.patchValue({dropOffCityID:0});
      this.advanceTableForm.patchValue({dropOffCity:null});
      this.advanceTableForm.patchValue({dropOffAddressDetails:null});
      this.advanceTableForm.patchValue({dropOffAddress:null});
      this.advanceTableForm.patchValue({dropOffAddressLatitude:null});
      this.advanceTableForm.patchValue({dropOffAddressLongitude:null});
      this.advanceTableForm.patchValue({dropOffStopOrderPriority:0});
    }
    this.advanceTableForm.patchValue({pickupDate:this.extractDate(this.advanceTableForm.value.pickupDateTime)});
    this.advanceTableForm.patchValue({pickupTime:this.extractTime(this.advanceTableForm.value.pickupDateTime)});
    this.advanceTableForm.patchValue({dropOffDate:this.extractDate(this.advanceTableForm.value.dropOffDateTime)});
    this.advanceTableForm.patchValue({dropOffTime:this.extractTime(this.advanceTableForm.value.dropOffDateTime)});
    this.advanceTableForm.patchValue({pickupDateString:this._generalService.getDateFrom(this.advanceTableForm.value.pickupDate)});
    this.advanceTableForm.patchValue({pickupTimeString:this._generalService.getTimeFroms(this.advanceTableForm.value.pickupTime)});
    this.advanceTableForm.patchValue({dropOffDateString:this._generalService.getDateFrom(this.advanceTableForm.value.dropOffDate)});
    this.advanceTableForm.patchValue({dropOffTimeString:this._generalService.getTimeFroms(this.advanceTableForm.value.dropOffTime)});
    this.bookingConfigurationService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      //this.dialogRef.close();
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
          this.navigateToControlPanel();
        } ;
        });
      //this._generalService.sendUpdate('ReservationGroupCreate:ReservationGroupView:Success');//To Send Updates
      this.saveDisabled = true; 
    },
    error =>
    {
        Swal.fire({
            title: '',
            text: error,
            icon: 'warning',
          });
      
      //this._generalService.sendUpdate('ReservationGroupAll:ReservationGroupView:Failure');//To Send Updates
      this.saveDisabled = true; 
    }
    )
  }
  
   navigateToControlPanel() 
    {
  
      this.router.navigate(['/controlPanelDesign']);
      //const url= this.router.serializeUrl(this.router.createUrlTree(['/controlPanelDesign']));
      //window.open(this._generalService.FormURL+ url);
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
      this.getVehicleID(selectedCar.vehicleID,selectedCar.vehicleCategoryID);
    }
  }

  getVehicleID(vehicleID: any,vehicleCategoryID:any) {
    this.vehicleID=vehicleID;
    this.vehicleCategoryID=vehicleCategoryID;
    this.advanceTableForm.patchValue({vehicleID:this.vehicleID});
    this.advanceTableForm.patchValue({vehicleCategoryID:this.vehicleCategoryID});
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
}




