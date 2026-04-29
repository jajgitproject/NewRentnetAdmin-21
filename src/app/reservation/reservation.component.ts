// @ts-nocheck
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ReservationService } from './reservation.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModelForReservation, Reservation, ReservationStatusLog } from './reservation.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FormDialogAddPassengersComponent } from '../addPassengers/dialogs/form-dialog/form-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerTypeDropDown } from '../customerType/customerTypeDropDown.model';
import { CustomerCustomerGroupDropDown } from '../customer/customerCustomerGroupDropDown.model';
import { CustomerPersonDropDown } from '../customerPerson/customerPersonDropDown.model';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
import { PackageDropDown } from '../package/packageDropDown.model';
import { GeoPointTypeDropDown } from '../geoPointType/geoPointTypeDropDown.model';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';
import { VehicleVehicleCategoryDropDown } from '../vehicle/vehicleVehicleCategoryDropDown.model';
import { OrganizationalEntityDropDown, TransferedLocationDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { ReservationSourceDropDown } from './reservationSourceDropDown.model';
import Swal from 'sweetalert2';
import { FormDialogCustomerShortComponent } from '../customerShort/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponentCustomerPerson } from '../customerPerson/dialogs/form-dialog/form-dialog.component';

import { FormDialogComponent } from '../viewKAM/dialogs/form-dialog/form-dialog.component';
import { ViewKAM } from '../viewKAM/viewKAM.model';
import { GoogleAddressDropDown } from './googleAddressDropDown.model';
import { SavedAddressComponent } from './dialogs/saved-address/saved-address.component';
import moment from 'moment';
import { ReservationCustomerDetails } from '../general/reservationCustomerDetailsDropDown.model';
import { CustomerReservationFields } from './customerReservationField.model';
import { ModeOfPaymentDropDown } from '../supplierContract/modeOfPaymentDropDown.model';
import { ReservationGroup } from '../reservationGroupDetails/reservationGroupDetails.model';
import { FormDialogRPComponent } from '../passengerDetails/dialogs/form-dialog/form-dialog.component';
import { PassengerDetailsService } from '../passengerDetails/passengerDetails.service';
import { PassengerDetails } from '../passengerDetails/passengerDetails.model';
import { FormDialogReservationStopDetailsComponent } from '../reservationStopDetails/dialogs/form-dialog/form-dialog.component';
import { StopDetailsShowComponent } from '../stopDetailsShow/stopDetailsShow.component';
import { CityBasedSpotsComponent } from '../CityBasedSpots/CityBasedSpots.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ReservationGroupService } from '../reservationGroup/reservationGroup.service';
import { CustomerConfigurationInvoicing } from '../customerConfigurationInvoicing/customerConfigurationInvoicing.model';
import { CustomerSpecificDetails, CustomerSpecificDetailsData } from '../customerSpecificDetails/customerSpecificDetails.model';
import { NewFormService } from '../newForm/newForm.service';
import { SpecialInstructionDialogComponent } from '../specialInstruction/dialogs/special-instruction-dialog/special-instruction-dialog.component';
import { InternalNoteDialogComponent } from '../internalNoteDetails/dialogs/internal-note-dialog/internal-note-dialog.component';
import { FormDialogSRDComponent } from '../settledRateDetails/dialogs/form-dialog/form-dialog.component';
import { SettledRateDetails } from '../settledRateDetails/settledRateDetails.model';
import { SettledRateDetailsService } from '../settledRateDetails/settledRateDetails.service';
import { SpecialInstructionDetailsService } from '../specialInstructionDetails/specialInstructionDetails.service';
import { SpecialInstructionDetails } from '../specialInstructionDetails/specialInstructionDetails.model';
import { InternalNoteDetailsService } from '../internalNoteDetails/internalNoteDetails.service';
import { InternalNoteDetails } from '../internalNoteDetails/internalNoteDetails.model';
import { EmailInfoComponent } from '../EmailInfo/EmailInfo.component';

@Component({
  standalone: false,
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ReservationComponent implements OnInit {
  @Input() ReservationID:any;
  @Input() action:any;
  @Input() fromForm:any;
  @Input() status:any;
  advanceTableFormEdit: FormGroup;
  advanceTable:Reservation;
  dataForReservationList:ModelForReservation | null;
  advanceTableRSL:ReservationStatusLog;
  advanceTableRG:ReservationGroup
  reservationDataSource:Reservation[] | null;
  customerDetailData:any;
  public GoogleAddressList?: GoogleAddressDropDown[] = [];
  public DropOffGoogleAddressList?: GoogleAddressDropDown[] = [];
  public CustomerTypeList?: CustomerTypeDropDown[] = [];
  public CustomerCustomerGroupList?: CustomerCustomerGroupDropDown[] = [];
  public BookerList?: CustomerPersonDropDown[] = [];
  public PassengerList?: CustomerPersonDropDown[] = [];
  public CityList?: CitiesDropDown[] = [];
  public VehicleList?:VehicleVehicleCategoryDropDown[]=[];
  public PackageTypeList?:PackageTypeDropDown[]=[];
  public PackageList?:PackageDropDown[]=[];
  public PickupSpotTypeList?:GeoPointTypeDropDown[]=[];
  public PickupSpotList?:StatesDropDown[]=[];
  public ServiceLocationList?:OrganizationalEntityDropDown[]=[];
  public ServiceLocationData?:TransferedLocationDropDown;
  public DropOffSpotTypeList?:GeoPointTypeDropDown[]=[];
  public DropOffSpotList?:StatesDropDown[]=[];
  public ReservationSourceList?:ReservationSourceDropDown[]=[];
  public DropOffCityList?: CitiesDropDown[] = [];
  public CustomerPassengerAndBookerList?: ReservationCustomerDetails[] = [];
  advanceTablePassenger: PassengerDetails | null;
  @Output() newDataAddedEvent = new EventEmitter<boolean>();
@Input() newDataAddedEvents = new EventEmitter<boolean>();
  filteredCustomerTypeOptions: Observable<CustomerTypeDropDown[]>;
  searchCustomerType: FormControl = new FormControl();

  filteredCustomerCustomerGroupOptions: Observable<CustomerCustomerGroupDropDown[]>;
  searchCustomerCustomerGroup: FormControl = new FormControl();

  filteredBookerOptions: Observable<CustomerPersonDropDown[]>;
  searchBooker: FormControl = new FormControl();

  // Seed with an already-emitting observable so the async pipe never
  // transitions from null -> [] inside the first change-detection pass
  // (that transition triggers NG0100 on the passenger *ngFor).
  filteredPassengerOptions: Observable<CustomerPersonDropDown[]> = of([]);
  searchPassenger: FormControl = new FormControl();
showHideSpecialInst:boolean = false;
  showHideInternalNote:boolean = false;
   showHidesettledRates:boolean = false;
  buttonDisabled: boolean = false;
  filteredCityOptions: Observable<CitiesDropDown[]>;
  searchCity: FormControl = new FormControl();

  filteredDropOffCityOptions: Observable<CitiesDropDown[]>;
  searchDropOffCity: FormControl = new FormControl();

  filteredVehicleOptions: Observable<VehicleVehicleCategoryDropDown[]>;
  searchVehicle: FormControl = new FormControl();

  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;
  searchPackageType: FormControl = new FormControl();

  filteredPackageOptions: Observable<PackageDropDown[]>;
  searchPackage: FormControl = new FormControl();

  filteredPSTOptions: Observable<GeoPointTypeDropDown[]>;
  searchPickupST: FormControl = new FormControl();

  filteredPSOptions: Observable<GeoPointTypeDropDown[]>;
  searchPickupSpot: FormControl = new FormControl();

  filteredServiceLocationOptions: Observable<OrganizationalEntityDropDown[]>;
  searchServiceLocation: FormControl = new FormControl();

  filteredDSTOptions: Observable<GeoPointTypeDropDown[]>;
  searchDropOffST: FormControl = new FormControl();

  filteredDSOptions: Observable<GeoPointTypeDropDown[]>;
  searchDropOffSpot: FormControl = new FormControl();

  filteredReservationSourceOptions: Observable<ReservationSourceDropDown[]>;
  searchReservationSource: FormControl = new FormControl();

  filteredGoogleAddressOptions: Observable<GoogleAddressDropDown[]>;
  isGSTMandatoryWithReservation:boolean | null;
  public ConfigurationInvoicingList?:CustomerConfigurationInvoicing[]=[];
   filteredConfigurationInvoicingOptions: Observable<CustomerConfigurationInvoicing[]>;
   customerConfigurationInvoicingID: any;
    isLoadingdata: boolean = false;

  filteredDropOffGoogleAddressOptions: Observable<GoogleAddressDropDown[]>;
advanceTableIN: InternalNoteDetails | null;
  formattedAddress = '';
  options = {
    componentRestrictions: {
      country: ['IN']
    }
  }
  isTNCSelected:boolean = false;
  ifBlock=true;
  ifBlockService=true;
  dropOffifBlock=true;
  customerTypeID: any;
  customerID: any;
  customerGroupID: any;
  passengerID: any;
  bookerID: any;
  cityID: any;
  vehicleID: any;
  packageTypeID: any;
  packageID: any;
  viewKAMService: any;
  dataSource: ViewKAM[] | null;
  SearchViewKAMName: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  indeterminate = false;
  priorityValues: number[] = [];
  labelPosition: 'before' | 'before' = 'before';
  advanceTableForm = this.fb.group({
      reservationID: [''],
      reservationGroupID:[''],
      customerTypeID: [''],
      customerType: [''],
      customerID: [''],
      customer: [''],
      customerCustomerGroup:[''],
      customerGroupID: [''],
      primaryBookerID: [''],
      booker: [''],
      primaryPassengerID: [''],
      passenger: [''],
      vehicleCategoryID: [''],
      vehicleID: [''],
      vehicle: [''],
      packageTypeID: [''],
      packageType: [''],
      packageID: [''],
      package: [''],
      pickupDate: [''],
      pickupTime: [''],
      pickupCityID: [''],
      pickupCity: [''],
      pickupSpotTypeID: [''],
      pickupSpotType: [''],
      pickupSpotID: [''],
      pickupSpot: [''],
      pickupAddress: ['',[]],
      pickupAddressDetails: [''],
      pickupPriorityOrder:[1],
      locationOutDate: [''],
      locationOutTime: [''],
      serviceLocationID: [''],
      serviceLocation: [''],
      serviceLocationBasedOnCity:[''],
     // transferedLocationID:[''],
      dropOffDate: [''],
      dropOffTime: [''],
      etrDate: [''],
      etrTime: [''],
      dropOffPriorityOrder:[2],
      dropOffCityID: [''],
      dropOffCity: [''],
      dropOffSpotTypeID: [''],
      dropOffSpotType: [''],
      dropOffSpotID: [''],
      dropOffSpot: [''],
      dropOffAddress: ['',[]],
      dropOffAddressDetails: [''],
      ticketNumber: ['',[Validators.required,Validators.pattern(/^[0-9]{12}$/)]],
      attachment: [''],
      emailLink: [''],
      reservationSourceID: [''],
      reservationSource: ['Email'],
      reservationSourceDetail: ['Email'],
      referenceNumber: [''],
      reservationStatus: ['Confirmed'],
      ecoCompanyID:[''],
      reservationStatusDetails: [''],
      reservationStatusText: [''],
      googleAddresses:[''],
      googleAdressesDropOff:[''],
      projectCode: [''],
      customerReservationFieldID:[''],
      fieldName:[''],
      modeOfPayment:[''],
      modeOfPaymentID:[''],
      pickupAddressLatitude:[''],
      pickupAddressLongitude:[''],
      pickupAddressLatLong:[''],
      dropOffAddressLatitude:[''],
      dropOffAddressLongitude:[''],
      dropOffAddressLatLong:[''],
      gSTForBilling:[''],
      customerConfigurationInvoicingID:[],
      isTimeNotConfirmed:[''],
      tripTo:[''],
      tripType:['']
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

  pickupSpotTypeID: any;
  pickupSpotID: any;
  vehicleCategoryID: any;
  serviceLocationID: any;
  dropOffSpotTypeID: any;
  dropOffSpotID: any;
  reservationSourceID: any;
  dropOffCityID: any;
  reservationNo: any;
  customerGroup: any;
  pickupAddress: any;
  pickupCity: any;
  dropOffAddress: any;
  dropOffCity: any;
  dropOffcityID: number;
  googleAddressID: any;
  pickupGACity: any;
  dropOffGACity: any;
  contractID: any;
  passengerName: any;
  dropOffTime:any;
  arr1: any[]=[];
  arr2: any[]=[];
  arr: any[]=[];
  public CustomerExtraFieldList?:CustomerReservationFields[]=[];
  public PaymentModeList?:ModeOfPaymentDropDown[]=[];
  filteredPaymentModeOptions: Observable<ModeOfPaymentDropDown[]>;
  paymentModeID: any;
  reservationID: any;
  reservationGroupID: any;
  customer: any;
  customerType: any;
  primaryBookerID: any;
  primaryBooker: any;
  gender: any;
  importance: any;
  phone: any;
  customerDepartment: any;
  customerDesignation: any;
  customerForBooker: any;
  ecoCompanyID: any[];
  validators: any;
  noReservationMessage: boolean = false;
  hideLocationOutDateTime: boolean = false;
  packageType: string;
  hideSpotTypeANDPickupSpot:boolean = false;
  CustomerGroupID: any;
  eventsSubject: Subject<boolean> = new Subject<boolean>();
  pickupSpotType: any;
  dropOffSpotType: any;
  selectedCity: string;
  transferedLocation: any;
  transferedLocationID: any;

  FromToDate: string;
  ReasonMessageShow : boolean = false;
  Reason: any;
  customerName: any;
  ReservationAlertShow : boolean = false;
  ReservationAlert: any;
  CustomerAlertMessageShow : boolean = false;
  CustomerAlertMessage: any;
  selectedPassengerData: any;
 
  CapMessageShow:boolean = false;
  CapMessage:string = "";
  pickupDate: any;
  bookingCount: any;
  cap: any;
  dataSourceCSF:CustomerSpecificDetails[];
  dynamicForm: FormGroup;
  primaryPassengerID: string;
  
  advanceTableSRD: SettledRateDetails | null;
   advanceTableSI: SpecialInstructionDetails | null;
  ReservationStatus: string;
  locationOutIntervalInMinutes: number;

  constructor(
    public httpClient: HttpClient,
    private dialog: MatDialog,
    public newFormService: NewFormService,
    public route:ActivatedRoute,
    public reservationService: ReservationService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public router:Router,
    public dialogRef: MatDialogRef<ReservationComponent>, 
    public passengerDetailsService: PassengerDetailsService,
    public rervationGroupService: ReservationGroupService,
    public _generalService: GeneralService,
     private specialInstructionDetailsService: SpecialInstructionDetailsService,
       public internalNoteDetailsService: InternalNoteDetailsService,
  public settleRateService: SettledRateDetailsService,) 
    {      
      this.priorityValues = Array.from({ length: 100 }, (_, i) => i + 1);    
    }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() { 
    
    // Enhanced status checking - allow changes for new duplicated bookings
    if(this.status && this.status !== 'Changes allow' && !this.isEditingAllowed()) {
      this.buttonDisabled = true;
    } else {
      this.buttonDisabled = false;
    }
  
    if(this.fromForm !=='newForm')
    {
      this.route.queryParams.subscribe(paramsData =>{
        // this.ReservationID   = paramsData.reservationID;    
        // this.CustomerGroupID = paramsData.customerGroupID;
        // this.reservationGroupID = paramsData.reservationGroupID;
        const encryptedReservationID = paramsData.reservationID;
        const encryptedCustomerGroupID = paramsData.customerGroupID;
        const encryptedReservationGroupID = paramsData.reservationGroupID;
        const encryptedAction = paramsData.action; 
        const encryptedCustomerID = paramsData.customerID;
        const encryptedCustomerName = paramsData.customerName;
        const encryptedcustomerTypeID = paramsData.customerTypeID;
        const encryptedcustomerType = paramsData.customerType;
        const encryptedcustomerGroupID = paramsData.customerGroupID;
        const encryptedcustomerGroup = paramsData.customerGroup;
        const encryptedPrimaryPassengerID = paramsData.primaryPassengerID;
        const encryptedPassengerName = paramsData.PassengerName;
        
        this.customerID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerID));
        this.customerName = this._generalService.decrypt(decodeURIComponent(encryptedCustomerName));

        this.customerTypeID = this._generalService.decrypt(decodeURIComponent(encryptedcustomerTypeID));
        this.customerType = this._generalService.decrypt(decodeURIComponent(encryptedcustomerType));
        this.advanceTableForm.patchValue({customerTypeID:this.customerTypeID});
        this.advanceTableForm.patchValue({customerType:this.customerType});

        this.customerGroupID = this._generalService.decrypt(decodeURIComponent(encryptedcustomerGroupID));
        this.customerGroup = this._generalService.decrypt(decodeURIComponent(encryptedcustomerGroup));

        this.advanceTableForm.patchValue({customerGroupID:this.customerGroupID});
        this.advanceTableForm.patchValue({customerCustomerGroup:this.customerName + '-' + this.customerGroup});

      if (encryptedReservationID) {
        this.ReservationID = this._generalService.decrypt(decodeURIComponent(encryptedReservationID));
      }

      if (encryptedCustomerGroupID) {
        this.CustomerGroupID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerGroupID));
      }

      if (encryptedReservationGroupID) {
        this.reservationGroupID = this._generalService.decrypt(decodeURIComponent(encryptedReservationGroupID));
      }

      if (encryptedPrimaryPassengerID) {
        this.primaryPassengerID = this._generalService.decrypt(decodeURIComponent(encryptedPrimaryPassengerID));
      }

      if (encryptedAction) {
        this.action = this._generalService.decrypt(decodeURIComponent(encryptedAction));
      }
            });
          }   
          this.advanceTableForm.controls["customerType"].disable(); 
        this.advanceTableForm.controls["customerCustomerGroup"].disable();
        this.getReservationGSTData();
        this.getStopReservationReason(this.customerID);
        this.getReservationAlertForCustomer(this.customerID);
        this.getAlerMessagetForCustomer(this.customerID);  
        // this.InitReservationInvoiceGSTDetails( this.customerID);
        this.InitResrvationGSTForCityID(this.customerID,this.cityID);
        this.GetIsGSTMandatoryWithResrvation(this.customerGroupID);
        const passengerID = this.advanceTable?.primaryPassengerID;
        this.GetIntervalMin();
        //this.GetReservationCapping(this.customerGroupID,this.customerID,this.pickupDate,this.cityID,this.packageTypeID,this.vehicleCategoryID);

    if(this.action==='edit')
      {
        this.loadData();
        this.GetIsGSTMandatoryWithResrvation(this.customerGroupID);
        // this.InitReservationInvoiceGSTDetails(this.customerID);
        this.getReservationGSTData();
        // this.InitCustomerType();
        this.InitCustomerAndPassenger();
        this.InitCustomerAndBooker();
        // this.InitPaymentMode();
        // this.InitDropOffGoogleAddress();
        // this.InitGoogleAddress();
        // this.InitPackageType();
        // this.InitServiceLocation();
        this.InitPickupSpotType();
        this.InitDropOffSpotType();
        // //this.InitCity();
        // this.InitReservationSource();
        
        // Load additional details for edit mode
        this.internalNoteLoadData();
        this.settledRateLoadData();
        this.getInstrucationDetails();
        this.GetIntervalMin();
        // this.ViewKAM();
        // this.getReservationStatusLog();
        
        //this.passengerloadData();
        //this.savedAddress();

      }
      else{
     
  this.route.queryParams.subscribe(paramsData =>{
    //  const encryptedCustomerID = paramsData.customerID;
    //  this.customerID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerID));
    //   const encryptedCustomerName = paramsData.customerName;
      
    //   if (encryptedCustomerID && encryptedCustomerName) {
        
    //       this.customerID= this._generalService.decrypt(decodeURIComponent(encryptedCustomerID));
    //       this.customer = this._generalService.decrypt(decodeURIComponent(encryptedCustomerName));
    //     }
    const encryptedReservationGroupID = paramsData.reservationGroupID;
    this.reservationGroupID = this._generalService.decrypt(decodeURIComponent(encryptedReservationGroupID));

    const encryptedReservationID = paramsData.reservationID;
    this.reservationID = this._generalService.decrypt(decodeURIComponent(encryptedReservationID));

    const encryptedTransferedLocationID = paramsData.transferedLocationID;
    this.transferedLocationID = this._generalService.decrypt(decodeURIComponent(encryptedTransferedLocationID));

    const encryptedTransferedLocation = paramsData.transferedLocation;
    this.transferedLocation = this._generalService.decrypt(decodeURIComponent(encryptedTransferedLocation));
    //this.reservationID=paramsData.reservationID;
    //this.reservationGroupID=paramsData.reservationGroupID;
    //this.transferedLocationID = paramsData.transferedLocationID;
    //this.transferedLocation = paramsData.transferedLocation;
    // this.customerID=paramsData.customerID;
    // this.customer=paramsData.customerName;
    // this.customerGroupID=paramsData.customerGroupID;
    // this.customerGroup=paramsData.customerGroup;
    // this.customerTypeID=paramsData.customerTypeID;
    // this.customerType=paramsData.customerType;
    // this.primaryBookerID=paramsData.primaryBookerID;
    // this.primaryBooker=paramsData.primaryBooker;
    // this.gender=paramsData.gender;
    // this.importance=paramsData.importance;
    // this.phone=paramsData.phone;
    // this.customerDepartment=paramsData.customerDepartment;
    // this.customerDesignation=paramsData.customerDesignation;
    // this.customerForBooker=paramsData.customerForBooker;
  });
  this.advanceTableForm.patchValue({reservationSourceID:20});
  this.advanceTableForm.patchValue({reservationSource:'Email'});
  this.getDataForReservation();
  
  this.advanceTableForm.patchValue({serviceLocationID:this.transferedLocationID});
  this.advanceTableForm.patchValue({transferedLocationID:this.transferedLocationID});
  this.advanceTableForm.patchValue({serviceLocation:this.transferedLocation});
  this.advanceTableForm.patchValue({reservationID:this.reservationID});
  this.advanceTableForm.patchValue({reservationGroupID:this.reservationGroupID});
  // this.advanceTableForm.patchValue({customerTypeID:this.customerTypeID});
  // this.advanceTableForm.patchValue({customerType:this.customerType});
  // this.advanceTableForm.patchValue({customerID:this.customerID});
  // this.advanceTableForm.patchValue({customerGroupID:this.customerGroupID});
  // this.advanceTableForm.patchValue({customerCustomerGroup:this.customer+'-'+this.customerGroup});
  // this.advanceTableForm.patchValue({primaryBookerID:this.primaryBookerID});
  // this.advanceTableForm.patchValue({booker:this.primaryBooker+'-'+this.gender+'-'+this.importance+'-'+this.phone+'-'+this.customerDepartment+'-'+this.customerDesignation+'-'+this.customerForBooker});
    this.InitCustomerType();
    this.InitCustomerCustomerGroup();
    // this.InitGoogleAddress();
    this.InitDropOffGoogleAddress();
    // this.InitPackageType();
    this.InitPickupSpotType();
    //this.GetServiceLocation();
    this.InitServiceLocationBasedOnCity();
    this.InitDropOffSpotType();
    this.InitPickupSpot();
    this.InitDropOffSpot();
    // this.InitReservationSource();
    // this.InitPaymentMode();
    //this.InitCity();
    this.SubscribeUpdateService();
    this.internalNoteLoadData();
    this.settledRateLoadData();
    this.getInstrucationDetails();
    this.InitProjectCode();
    //this.getFieldValues();
    //this.passengerloadData();
    //this.GetReservationCapping();
    this.GetIsGSTMandatoryWithResrvation(this.customerGroupID);
    // this.InitReservationInvoiceGSTDetails(this.customerID);
    this.GetIntervalMin();
  }
  
}

onTNCChange(checked: any)
{
  //const isChecked = event.target.checked;
  const pickupControl = this.advanceTableForm.get('pickupTime');
  if (checked === true) 
  {
    this.isTNCSelected = true;
    this.advanceTableForm.get('pickupTime').setValue(null);
    this.advanceTableForm.get('dropOffTime').setValue(null);
    pickupControl?.disable();
  }
  else
  {
    pickupControl?.enable();
    this.isTNCSelected = false;
  }
}

  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);

  // InitPaymentMode(){
  //   this._generalService.GetModeOfPayment().subscribe(
  //     data=>
  //     {
  //       this.PaymentModeList=data;
  //       this.advanceTableForm.controls['modeOfPayment'].setValidators([Validators.required,this.MOPValidator(this.PaymentModeList)]);
  //       this.advanceTableForm.controls['modeOfPayment'].updateValueAndValidity();
  //       this.filteredPaymentModeOptions = this.advanceTableForm.controls['modeOfPayment'].valueChanges.pipe(
  //         startWith(""),
  //         map(value => this._filterPaymentMode(value || ''))
  //       ); 
  //     });
  // }

  onKeyupPaymentMode() 
  {
    var Prefix = this.advanceTableForm.get("modeOfPayment").value;
      if(Prefix.length < 3)
      { 
        this.PaymentModeList = [];
        return;
      }
    this._generalService.GetModeOfPayment(Prefix).subscribe(
      
      data => {
        this.PaymentModeList = data;
        const control = this.advanceTableForm.controls['modeOfPayment'];
        control.setValidators([Validators.required,this.MOPValidator(this.PaymentModeList)]);
        control.updateValueAndValidity();
        // Autocomplete filtering
        this.filteredPaymentModeOptions = control.valueChanges.pipe(
          startWith(""),
          map(value => this._filterPaymentMode(value || ''))
        );

        // 👉 IMPORTANT: Reset ID when user types or clears input
        control.valueChanges.subscribe(value => {
          const match = this.PaymentModeList.find(
            pm => pm.modeOfPayment.toLowerCase() === value?.toLowerCase()
          );

          if (!match) 
          {
            this.advanceTableForm.patchValue({ modeOfPaymentID: null },{ emitEvent: false });
          }
        });
      });
    }

  
  private _filterPaymentMode(value: string): any {
    const filterValue = value.toLowerCase();
    //  if (!value || value.length < 3)
    //  {
    //     return [];   
    //  }
      return this.PaymentModeList?.filter(
      customer => 
      {
        return customer.modeOfPayment.toLowerCase().includes(filterValue);
      }
    );
  }

  MOPValidator(PaymentModeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      if (!value || value.trim() === '') {
      return { modeOfPaymentInvalid: true };
    }
      const match = PaymentModeList.some(group => group.modeOfPayment.toLowerCase() === value);
      return match ? null : { modeOfPaymentInvalid: true };
    };
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

  CustomerSpecificFieldsloadData()
    {
      this.newFormService.GetCustomerSpecificFields(this.ReservationID).subscribe(
        (data:CustomerSpecificDetailsData)=>
        {
          this.dataSourceCSF = data.reservationDetailsList;
          const fieldValues = this.dataSourceCSF[0]?.customerSpecificFieldList || [];
          fieldValues.forEach((item) => {
            if (this.advanceTableForm.contains(item.fieldName)) {
              this.advanceTableForm.get(item.fieldName)?.setValue(item.fieldValue);
            }       
      });
        }
      );
    }

  InitProjectCode() {
    // `this.advanceTable` is undefined in new-reservation mode. Guard every
    // access so ngOnInit doesn't throw and abort the rest of the init chain
    // (which previously left contractID / customerID / customerGroupID unset
    // and produced a cascade of 400s to `.../undefined` URLs).
    const customerID = this.advanceTableForm.value.customerID
      || (this.advanceTable && this.advanceTable.customerID);

    if (!customerID) {
      // No customer selected yet; skip the lookup. It will be triggered later
      // when the user picks a customer (see getCustomerID / customer handlers).
      return;
    }

    this._generalService
      .GetCustomerRentNetFieldsBasedOnCustomerID(customerID)
      .subscribe((data) => {
        // Defer mutation to the next macrotask so the *ngIf/*ngFor over
        // CustomerExtraFieldList (line ~1207 in the template) is not
        // updated inside the same check / verify-check pass that first
        // read it, which is what produces NG0100 in dev mode.
        setTimeout(() => {
          this.CustomerExtraFieldList = data || [];
          this.arr1 = [];
          this.arr2 = [];

          this.CustomerExtraFieldList.forEach((ele) => {
            this.arr1.push(ele.customerReservationFieldID);
            this.arr2.push(ele.fieldName);

            const isMandatory = ele.isMandatory ? [Validators.required] : [];
            this.advanceTableForm.addControl(ele.fieldName, new FormControl('', isMandatory));
          });

          if(this.action === 'edit')
          {
            this.CustomerSpecificFieldsloadData();
          }

          this.advanceTableForm.patchValue({
            customerReservationFieldID: this.arr1,
            fieldName: this.arr2,
          });
        }, 0);
      });
  }
  
  // InitProjectCode()
  // {
  //   this._generalService.GetCustomerRentNetFieldsBasedOnCustomerID(this.advanceTableForm.value.customerID).subscribe(
  //     data=>
  //     {
  //       this.CustomerExtraFieldList=data;
  //       this.CustomerExtraFieldList?.forEach((ele)=>
  //       {
  //         //this.validators = ele.isMandatory ? [Validators.required] : [];
  //         this.arr1.push(ele.customerReservationFieldID);
  //         this.arr2.push(ele.fieldName);
  //         this.advanceTableForm.patchValue({customerReservationFieldID:this.arr1});
  //         this.advanceTableForm.patchValue({fieldName:this.arr2});
  //       });
  //     }
  //   )
  // }
  
//   getFieldValues()
// {
//   this.arr.push(this.advanceTableForm.value.projectCode);
// }

getFieldValues() {
  this.arr = [];
  this.CustomerExtraFieldList.forEach((field) => {
    const fieldValue = this.advanceTableForm.get(field.fieldName)?.value;
    if (Array.isArray(fieldValue)) {
      const transformedArray = fieldValue.map((item: any) => item.fieldValue);
      this.arr.push(...transformedArray);
    } else if (fieldValue !== null && fieldValue !== undefined) {
      this.arr.push(fieldValue);
    }
  });
}

  InitCustomerAndPassenger()
  {
    this._generalService.GetCustomerAndPassenger(this.ReservationID).subscribe(
      data=>
      {
        this.CustomerPassengerAndBookerList=data;
        this.advanceTableForm.patchValue({customerGroupID:this.CustomerPassengerAndBookerList[0].customerGroupID});
        this.advanceTableForm.patchValue({primaryPassengerID:this.CustomerPassengerAndBookerList[0].primaryPassengerID});
        //this.advanceTableForm.patchValue({passenger:this.CustomerPassengerAndBookerList[0].customerPersonName+' - '+this.CustomerPassengerAndBookerList[0].gender+' - '+this.CustomerPassengerAndBookerList[0].importance+' - '+this.CustomerPassengerAndBookerList[0].primaryMobile+' - '+this.CustomerPassengerAndBookerList[0].customerDepartment+' - '+this.CustomerPassengerAndBookerList[0].customerDesignation+' - '+this.CustomerPassengerAndBookerList[0].customerName});
        this.advanceTableForm.patchValue({passenger:this.CustomerPassengerAndBookerList[0].passengerInfo});
      }
    )
  }

  InitCustomerAndBooker()
  {
    this._generalService.GetCustomerAndBooker(this.ReservationID).subscribe(
      data=>
      {
        this.CustomerPassengerAndBookerList=data;
        this.advanceTableForm.patchValue({primaryBookerID:this.CustomerPassengerAndBookerList[0].primaryBookerID});
        //this.advanceTableForm.patchValue({booker:this.CustomerPassengerAndBookerList[0].customerPersonName+' - '+this.CustomerPassengerAndBookerList[0].gender+' - '+this.CustomerPassengerAndBookerList[0].importance+' - '+this.CustomerPassengerAndBookerList[0].primaryMobile+' - '+this.CustomerPassengerAndBookerList[0].customerDepartment+' - '+this.CustomerPassengerAndBookerList[0].customerDesignation+' - '+this.CustomerPassengerAndBookerList[0].customerName});
        this.advanceTableForm.patchValue({booker:this.CustomerPassengerAndBookerList[0].bookerInfo});
      }
    )
  }
  
  loadData()
  {
    this.isLoadingdata = true;
    this.reservationService.getBookingDetails(this.ReservationID).subscribe(
      data=>
      {
         if (data != null) 
      {

        this.reservationDataSource=data;
        this.advanceTable=this.reservationDataSource[0];
        this.ReservationStatus = this.advanceTable.reservationStatus;
        let pickupDate=moment(this.advanceTable.pickupDate).format('DD/MM/yyyy');
          this.onBlurUpdateDateEdit(pickupDate);
        var value = this.advanceTable.pickupAddressLatLong.replace(
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

       if(this.advanceTable.dropOffAddressLatLong === null)
       {
        this.advanceTableForm.patchValue({dropOffAddressLatLong:null});
       }
       else
       {
        var value = this.advanceTable.dropOffAddressLatLong.replace('(','');
        value = value.replace(')', '');
        var droplat = value.split(' ')[2];
        var droplong = value.split(' ')[1];
        this.advanceTableForm.patchValue({dropOffAddressLatLong:droplat +',' + droplong});
       }
       
        this.customerID=this.advanceTable.customerID;
        this.customerGroupID=this.advanceTable.customerGroupID;
        this.InitProjectCode();
        // this.InitBooker();
        // this.InitPassenger();
        this.InitCompanyForCustomer();
          this.GetIsGSTMandatoryWithResrvation(this.customerGroupID);
        this.advanceTableForm.patchValue({reservationID:this.advanceTable.reservationID});
        this.advanceTableForm.patchValue({reservationGroupID:this.advanceTable.reservationGroupID});
        this.advanceTableForm.patchValue({customerTypeID:this.advanceTable.customerTypeID});
        this.advanceTableForm.patchValue({customerType:this.advanceTable.customerType});
        this.advanceTableForm.patchValue({customerID:this.advanceTable.customerID});
        this.advanceTableForm.patchValue({customerGroupID:this.advanceTable.customerGroupID});
        this.advanceTableForm.patchValue({customerCustomerGroup:this.advanceTable.customer+' - '+this.advanceTable.customerGroup});
        //this.advanceTableForm.patchValue({booker:this.advanceTable.primaryBooker+' - '+this.advanceTable.gender});
        //Pickup Details
        this.advanceTableForm.patchValue({pickupDate:this.advanceTable.pickupDate});
        this.advanceTableForm.patchValue({pickupTime:this.advanceTable.pickupTime});
        this.advanceTableForm.patchValue({packageTypeID:this.advanceTable.packageTypeID});
        this.advanceTableForm.patchValue({packageType:this.advanceTable.packageType +' '+ "Rate"});
        this.advanceTableForm.patchValue({packageID:this.advanceTable.packageID});
        this.advanceTableForm.patchValue({package:this.advanceTable.package});
        this.advanceTableForm.patchValue({pickupCityID:this.advanceTable.pickupCityID});
        this.advanceTableForm.patchValue({pickupCity:this.advanceTable.pickupCity});
        this.advanceTableForm.patchValue({pickupPriorityOrder:this.advanceTable.pickupPriorityOrder});
        this.advanceTableForm.patchValue({dropOffPriorityOrder:this.advanceTable.dropOffPriorityOrder});
        this.advanceTableForm.patchValue({vehicleID:this.advanceTable.vehicleID});
        this.advanceTableForm.patchValue({vehicle:this.advanceTable.vehicle});
        this.advanceTableForm.patchValue({vehicleCategoryID:this.advanceTable.vehicleCategoryID});
        this.advanceTableForm.patchValue({pickupAddress:this.advanceTable.pickupAddress});
        this.advanceTableForm.patchValue({pickupAddressDetails:this.advanceTable.pickupAddressDetails});
        this.advanceTableForm.patchValue({pickupSpotTypeID:this.advanceTable.pickupSpotTypeID});
        this.advanceTableForm.patchValue({pickupSpotType:this.advanceTable.pickupSpotType});
        this.advanceTableForm.patchValue({pickupSpotID:this.advanceTable.pickupSpotID});
        this.advanceTableForm.patchValue({pickupSpot:this.advanceTable.pickupSpot});
        this.advanceTableForm.patchValue({locationOutDate:this.advanceTable.locationOutDate});
        this.advanceTableForm.patchValue({locationOutTime:this.advanceTable.locationOutTime});
        this.advanceTableForm.patchValue({serviceLocationID:this.advanceTable.serviceLocationID});
        this.advanceTableForm.patchValue({serviceLocation:this.advanceTable.serviceLocation});
        this.advanceTableForm.patchValue({transferedLocationID:this.advanceTable.transferedLocationID});
        this.advanceTableForm.patchValue({tripTo:this.advanceTable.tripTo || null});
        this.advanceTableForm.patchValue({tripType:this.advanceTable.tripType || null});

        //Drop Off Details
        this.advanceTableForm.patchValue({etrDate:this.advanceTable.etrDate});
        this.advanceTableForm.patchValue({etrTime:this.advanceTable.etrTime});
        this.advanceTableForm.patchValue({dropOffDate:this.advanceTable.dropOffDate});
        this.advanceTableForm.patchValue({dropOffTime:this.advanceTable.dropOffTime});
        this.advanceTableForm.patchValue({dropOffCityID:this.advanceTable.dropOffCityID});
        this.advanceTableForm.patchValue({dropOffCity:this.advanceTable.dropOffCity});
        this.advanceTableForm.patchValue({dropOffAddress:this.advanceTable.dropOffAddress});
        this.advanceTableForm.patchValue({dropOffAddressDetails:this.advanceTable.dropOffAddressDetails});
        this.advanceTableForm.patchValue({dropOffSpotTypeID:this.advanceTable.dropOffSpotTypeID});
        this.advanceTableForm.patchValue({dropOffSpotType:this.advanceTable.dropOffSpotType});
        this.advanceTableForm.patchValue({dropOffSpotID:this.advanceTable.dropOffSpotID});
        this.advanceTableForm.patchValue({dropOffSpot:this.advanceTable.dropOffSpot});

        //Other Details
        this.advanceTableForm.patchValue({ticketNumber:this.advanceTable.ticketNumber});
        this.advanceTableForm.patchValue({emailLink:this.advanceTable.emailLink});
        this.advanceTableForm.patchValue({reservationSourceID:this.advanceTable.reservationSourceID});
        this.advanceTableForm.patchValue({reservationSource:this.advanceTable.reservationSource});
        this.advanceTableForm.patchValue({reservationSourceDetail:this.advanceTable.reservationSourceDetail});
        this.advanceTableForm.patchValue({referenceNumber:this.advanceTable.referenceNumber});
        this.advanceTableForm.patchValue({reservationStatus:this.advanceTable.reservationStatus});
        this.advanceTableForm.patchValue({modeOfPaymentID:this.advanceTable.modeOfPaymentID});
        this.advanceTableForm.patchValue({modeOfPayment:this.advanceTable.modeOfPayment}); 
        if (this.advanceTable?.isTimeNotConfirmed === true) 
        {
          this.advanceTableForm.get('isTimeNotConfirmed')?.setValue(true);
          this.advanceTableForm.get('pickupTime').disable();
        } 
        else 
        {
          this.advanceTableForm.get('isTimeNotConfirmed')?.setValue(false);
        }
        //this.advanceTableForm.patchValue({isTimeNotConfirmed:this.advanceTable.isTimeNotConfirmed});    
        this.ImagePath=this.advanceTable.attachment;
        this.advanceTableForm.patchValue({attachment:this.ImagePath});
        this.InitCustomerCustomerGroup();
        // this.InitBooker();
        // this.InitPassenger();
        //this.advanceTable.packageType=this.advanceTable.packageType +' '+"Rate";
        // this.InitCity(this.advanceTable.packageType);
        // this.InitDropOffCity(this.advanceTable.packageType);
        let pickupDateOnload = moment(this.advanceTable.pickupDate).format('DD/MM/yyyy');
        this.onPickupDateChangeAndLocationTimeSet(pickupDateOnload);
        this.InitCompanyForCustomer();
        this.dropOffSpotTypeID=this.advanceTable.dropOffSpotTypeID;
        this.pickupSpotTypeID=this.advanceTable.pickupSpotTypeID;
        this.InitDropOffSpot();
        this.InitPickupSpot();
        this.InitServiceLocationBasedOnCity();
        // this.InitReservationInvoiceGSTDetails( this.customerID);
        this.getETRDropOffTime();     
        // this.InitReservationSource();   
        //this.GetReservationCapping(this.customerGroupID,this.customerID,this.advanceTable.pickupDate,this.advanceTable.pickupCityID,this.advanceTable.packageTypeID,this.advanceTable.vehicleCategoryID);
     }
      else{
        this.reservationDataSource = null;
       
      }
       this.isLoadingdata = false;
    },
    (error: HttpErrorResponse) => { 
      this.reservationDataSource = null;
      this.isLoadingdata = false;
    }
      
    );
  }


  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  onPickupGeoLocation(){
     var Prefix = this.advanceTableForm.get("pickupAddress").value;
      if(Prefix.length < 3)
      { 
        this.GoogleAddressList = [];
        return;
      }
    this._generalService.getGoogleAddress(Prefix ).subscribe(
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
    // if(filterValue.length===0)
    // {
    //   return []
    // }
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

  onPickupTyping() 
  {
    const control = this.advanceTableForm.get('pickupAddress');
    if (!control?.value || control.value.trim() === '')
    {
      control?.setErrors(null);
      return;
    }
    control?.setErrors({ invalidPickupAddress: true });
  }

  googlePickupValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const parent = control.parent;
      if (!parent) return null;
      const latLong = parent.get('pickupAddressLatLong')?.value;
      return latLong ? null : { invalidPickupAddress: true };
    };
  }

  public handleAddressChange(address: any) {    
    this.pickupAddress = address.formatted_address;
    //this.pickupAddress = address.name;
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
    // this.pickupCity = pickupCity;
    // this.advanceTableForm.controls["pickupCity"].disable();
    // this.getCityIDByName(this.pickupCity);
    // this.advanceTableForm.patchValue({pickupCity:this.pickupCity});
    // ✅ Mark touched so validation updates
    this.advanceTableForm.get('pickupAddress')?.setErrors(null);
    this.advanceTableForm.get('pickupAddress')?.markAsTouched();
    this.advanceTableForm.get('pickupAddress')?.updateValueAndValidity();
    
  }

  onDropOffTyping() 
  {
    const control = this.advanceTableForm.get('dropOffAddress');
    if (!control?.value || control.value.trim() === '')
    {
      control?.setErrors(null);
      return;
    }
    control?.setErrors({ invalidDropOffAddress: true });
  }

  validateDropOffOnBlur() 
  {
    const control = this.advanceTableForm.get('dropOffAddress');
    if (control?.hasError('invalidDropOffAddress')) 
    {
      control.setValue('');
      control.setErrors(null);
      this.advanceTableForm.patchValue({dropOffAddressLatLong: ''});
    }
  }

  googleDropOffValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const parent = control.parent;
      if (!parent) return null;
      const latLong = parent.get('dropOffAddressLatLong')?.value;
      return latLong ? null : { invalidDropOffAddress: true };
    };
  }
  public handleAddressChangeDropOff(address: any) {
    //this.formattedAddress = address.formatted_address;
    this.dropOffAddress = address.formatted_address;
    //this.dropOffAddress = address.name;
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
    this.dropOffCity = dropOffCity;
    // this.advanceTableForm.controls["dropOffCity"].disable();
    // this.getCityIDByNameForDropOff(this.dropOffCity);
    // this.advanceTableForm.patchValue({dropOffCity:this.dropOffCity});

    // ✅ Mark touched so validation updates
    this.advanceTableForm.get('dropOffAddress')?.setErrors(null);
    this.advanceTableForm.get('dropOffAddress')?.markAsTouched();
    this.advanceTableForm.get('dropOffAddress')?.updateValueAndValidity();
    
  }

  bindPickupSpotTypeandSpot(option:any)
  {
    this.advanceTableForm.patchValue({pickupSpotTypeID:option.spotTypeID});
    this.advanceTableForm.patchValue({pickupSpotType:option.spotType});
    this.advanceTableForm.patchValue({pickupSpotID:option.geoPointID});
    this.advanceTableForm.patchValue({pickupSpot:option.spot});
    // this.advanceTableForm.controls["pickupSpotType"].disable();
    // this.advanceTableForm.controls["pickupSpot"].disable();
  }
  
  // getCity(city:any)
  // {
     
  //   this.pickupGACity=city;
    //this.advanceTableForm.controls["pickupSpotType"].disable();
    // this.getCityIDByName(this.pickupGACity);
    // this.advanceTableForm.patchValue({pickupCity:this.pickupGACity});
  //}

   //------------DropOff Google Address -----------------
   onDropLocationKeyup(){
    var Prefix = this.advanceTableForm.get("dropOffAddress").value;
    if(Prefix.length < 3)
    { 
      this.DropOffGoogleAddressList = [];
      return;
    }
    this._generalService.getGoogleAddress(Prefix).subscribe(
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
    // if(filterValue.length===0)
    // {
    //   return []
    // }
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

  bindDropOffSpotTypeandSpot(option:any)
  {
    this.advanceTableForm.patchValue({dropOffSpotTypeID:option.spotTypeID});
    this.advanceTableForm.patchValue({dropOffSpotType:option.spotType});
    this.advanceTableForm.patchValue({dropOffSpotID:option.geoPointID});
    this.advanceTableForm.patchValue({dropOffSpot:option.spot});
    // this.advanceTableForm.controls["dropOffSpotType"].disable();
    // this.advanceTableForm.controls["dropOffSpot"].disable();
  }
  // getDropOffCity(dropOffCity:any)
  // {
  //   this.dropOffGACity=dropOffCity;
    // this.advanceTableForm.controls["dropOffCity"].disable();
    // this.getCityIDByNameForDropOff(this.dropOffGACity);
    // this.advanceTableForm.patchValue({dropOffCity:this.dropOffGACity});
  //}

  //------------ CustomerType -----------------
  InitCustomerType(){
    this._generalService.getCustomerType().subscribe(
      data=>
      {
        this.CustomerTypeList=data;
        this.filteredCustomerTypeOptions = this.advanceTableForm.controls['customerType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCT(value || ''))
        ) 
      });;
  }

  private _filterCT(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CustomerTypeList?.filter(
      customer => 
      {
        return customer.customerType.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  getTitles(customerTypeID: any, custopmerType:any) {
    this.customerTypeID=customerTypeID;
    this.advanceTableForm.patchValue({customerTypeID:this.customerTypeID});
    this.InitCustomerCustomerGroup();
    this.advanceTableForm.controls['customerCustomerGroup'].setValue('');
  }

  // onCustomerInputChange(event: any) {
  //   if(event.target.value.length === 0) {
  //     this.advanceTableForm.controls['customerCustomerGroup'].setValue('');
      
  //   } 
  // }
   //------------ CustomerCustomerGroup -----------------
  InitCustomerCustomerGroup(){
      const customerTypeID = this.customerTypeID || this.advanceTableForm.value.customerTypeID;
      // Skip while no customer type is picked yet; otherwise the backend URL
      // path trails nothing and the request returns 400 on page load.
      if (!customerTypeID) { return; }
      this._generalService.getCustomerCustomerGroup(customerTypeID).subscribe(
        data=>
        {
          this.CustomerCustomerGroupList=data;
          this.filteredCustomerCustomerGroupOptions = this.advanceTableForm.controls['customerCustomerGroup'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterCCG(value || ''))
          ); 
        });
    
  }

  private _filterCCG(value: string): any {
    const filterValue = value.toLowerCase();
    if(filterValue.length === 0) {
      return [];
    }
    return this.CustomerCustomerGroupList.filter(
      customer => 
      {
        return customer.customerName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  onCustomerCustomerGroupSelected(selectedCustomerCustomerGroup: string) {
    const CustomerCustomerGroup = this.CustomerCustomerGroupList.find(
      data => data.customerName + '-' + data.customerGroup === selectedCustomerCustomerGroup
    );
    if (CustomerCustomerGroup) 
    {
      this.getCustomerCustomerGroupID(CustomerCustomerGroup.customerID,CustomerCustomerGroup.customerGroupID,CustomerCustomerGroup.customerName);
    }
  }
  
  getCustomerCustomerGroupID(customerID: any,customerGroupID:any, customer: any) {
    this.customerID=customerID;
    this.customerGroupID=customerGroupID;
    this.customerDetailData = customer;
    this.advanceTableForm.patchValue({customerID:this.customerID});
    this.advanceTableForm.patchValue({customerGroupID:this.customerGroupID});
    // this.InitBooker();
    // this.InitPassenger();
    this.InitProjectCode();
    this.InitCompanyForCustomer();
    this.GetReservationCapping(this.customerGroupID,this.customerID,this.pickupDate,this.cityID,this.packageTypeID,this.vehicleCategoryID);
  }

  getStopReservationReason(customerID)
  {
    let FromToDate = this.FromToDate || ''; // Ensure FromToDate is not undefined
    if (FromToDate.trim() !== '') 
    {
      FromToDate = moment(FromToDate).format('YYYY-MM-DD');
    } 
    else 
    {
      FromToDate = moment().format('YYYY-MM-DD');// If empty, set it to today's date
    }
    this.rervationGroupService.getReason(customerID,FromToDate).subscribe(
      (data: string[]) =>
      {
        if (data && data.length > 0) 
        {
          this.ReasonMessageShow = true;
          this.Reason = data.join(', ');
        }
        else
        {
          this.ReasonMessageShow = false;
        }      
      }
    );
  }

  getReservationAlertForCustomer(customerID)
  {
    let FromToDate = this.FromToDate || ''; // Ensure FromToDate is not undefined
    if (FromToDate.trim() !== '') 
    {
      FromToDate = moment(FromToDate).format('YYYY-MM-DD');
    } 
    else 
    {
      FromToDate = moment().format('YYYY-MM-DD');// If empty, set it to today's date
    }
    this.rervationGroupService.getReservationAlertForCustomer(customerID,FromToDate).subscribe(
      (data: string[]) =>
      {
        if (data && data.length > 0) 
        {
          this.ReservationAlertShow = true;
          this.ReservationAlert = data.join(', ');
        }
        else
        {
          this.ReservationAlertShow = false;
        }      
      }
    );
  }

  getAlerMessagetForCustomer(customerID)
  {
    let FromToDate = this.FromToDate || ''; // Ensure FromToDate is not undefined
    if (FromToDate.trim() !== '') 
    {
      FromToDate = moment(FromToDate).format('YYYY-MM-DD');
    } 
    else 
    {
      FromToDate = moment().format('YYYY-MM-DD');// If empty, set it to today's date
    }
    this.rervationGroupService.getAlerMessagetForCustomer(customerID,FromToDate).subscribe(
      (data: string[]) =>
      {
        if (data && data.length > 0) 
        {
          this.CustomerAlertMessage = data.join(', ');
          this.CustomerAlertMessageShow = true;
        }
        else
        {
          this.CustomerAlertMessageShow = false;
        }      
      }
    );
  }

  ViewKAM()
  {
    // customerID may live on the component property (set during edit init)
    // or on the form control. Fall back to both so the dialog opens even
    // when the form's customerID patch hasn't happened yet.
    const customerID = this.advanceTableForm.value.customerID || this.customerID;
    if (!customerID) {
      console.warn('[ViewKAM] No customerID available yet; aborting dialog open.');
      return;
    }
    const payload = { ...this.advanceTableForm.value, customerID };
    this.dialog.open(FormDialogComponent,
      {
        width: '60%',
        data:
          {
            advanceTable: payload,
          }
      });
  }
  
  //------------ Booker -----------------
  onKeyupBookerName(){
    var Prefix = this.advanceTableForm.get("booker").value;
      if(Prefix.length < 3)
      { 
        this.BookerList = [];
        return;
      }
    this._generalService.GetCPForBooker(this.customerGroupID || this.advanceTableForm.value.customerGroupID, Prefix).subscribe(
      data=>
      {
        this.BookerList=data;
        this.advanceTableForm.controls['booker']?.setValidators([Validators.required,this.primaryBookerValidator(this.BookerList)]);
        this.advanceTableForm.controls['booker']?.updateValueAndValidity();
        this.filteredBookerOptions = this.advanceTableForm?.controls['booker'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterBooker(value || ''))
        ); 
      });
  }

  private _filterBooker(value: string): any {
  // if (!value || value.length < 3) {
  //   return []; 
  // }
  const filterValue = value.toLowerCase();

  return this.BookerList?.filter(customer =>
    customer.customerPersonName.toLowerCase().includes(filterValue) ||
    customer.gender.toLowerCase().includes(filterValue) ||
    customer.importance.toLowerCase().includes(filterValue) ||
    customer.phone.toLowerCase().includes(filterValue)
  );
}

  // private _filterBooker(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   // if(filterValue.length === 0) {
  //   //   return [];
  //   // }
  //   return this.BookerList?.filter(
  //     customer => 
  //     {
  //       return customer.customerPersonName.toLowerCase().includes(filterValue) || customer.gender.toLowerCase().includes(filterValue) || customer.importance.toLowerCase().includes(filterValue)
  //       || customer.phone.toLowerCase().includes(filterValue);
  //     }
  //   );
  // }

  primaryBookerValidator(BookerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = BookerList?.some(option =>
        (option.customerPersonName + '-' + option.gender + '-' + option.importance + '-' + option.phone + '-' + option.customerDepartment + '-' + option.customerDesignation + '-' + option.customerName)?.toLowerCase() === value
      );
      return match ? null : { primaryBookerInvalid: true };
    };
  }


  onBookerSelected(selectedBookerName: string) {
    const selectedBooker = this.BookerList.find(
      data => data.customerPersonName +'-'+              
              data.gender +'-'+
              data.importance +'-'+
              data.phone +'-'+
              data.customerDepartment +'-'+
              data.customerDesignation +'-'+
               data.customerName === selectedBookerName
    );
  
    if (selectedBooker) {
      this.getBookerID(selectedBooker.customerPersonID);
    }
  }
  
  getBookerID(bookerID: any) {
    this.bookerID=bookerID;
    this.advanceTableForm.patchValue({primaryBookerID:this.bookerID});
  }

  //------------ Passenger -----------------
  onKeyupPassengerName(){
     var Prefix = this.advanceTableForm.get("passenger").value;
      if(Prefix.length < 3)
      { 
        this.PassengerList = [];
        return;
      }
    this._generalService.GetCPForPassenger(this.advanceTableForm.value.customerGroupID, Prefix).subscribe(
      data=>
      {
        this.PassengerList=data;
        this.advanceTableForm.controls['passenger'].setValidators([Validators.required,this.PassengerValidator(this.PassengerList)]);
        this.advanceTableForm.controls['passenger'].updateValueAndValidity({ emitEvent: false });

        const selectedPassenger = this.PassengerList.find(
          data => data.customerPersonID === this.advanceTableForm.value.primaryPassengerID
        );
        this.selectedPassengerData = selectedPassenger || null;
        
        this.filteredPassengerOptions = this.advanceTableForm.controls['passenger'].valueChanges.pipe(
          startWith(""),
          map(value => {
            const data = this._filterPassenger(value || '');
            return data
          })
        ); 
      });
  }

  private _filterPassenger(value: string): any {
  const filterValue = (value || '').toLowerCase();
  // if (!filterValue || filterValue.length < 3) {
  //   return [];
  // }
  return this.PassengerList.filter(customer =>
    customer?.customerPersonName?.toLowerCase().includes(filterValue) ||
    customer?.phone?.toLowerCase().includes(filterValue) ||
    customer?.importance?.toLowerCase().includes(filterValue) ||
    customer?.gender?.toLowerCase().includes(filterValue)
  );
}

  // private _filterPassenger(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   if(filterValue.length === 0) {
  //     return [];
  //   }
  //   return this.PassengerList.filter(
  //     customer => 
  //     {
  //       return customer?.customerPersonName.toLowerCase().includes(filterValue) || customer?.phone.toLowerCase().includes(filterValue) || customer?.importance.toLowerCase().includes(filterValue)
  //       || customer?.gender.toLowerCase().includes(filterValue);
  //     }
  //   );
  // }
  PassengerValidator(PassengerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = PassengerList.some(data => ((data.customerPersonName + '-' + data.gender + '-' + data.importance + '-' + data.phone + '-' + data.customerDepartment + '-' + data.customerDesignation + '-' + data.customerName).toLowerCase()) === value);
      return match ? null : { passengerInvalid: true };
    };
  }


  onPassengerSelected(selectedPassengerName: string) {
    const selectedPassenger = this.PassengerList.find(
      data => data.customerPersonName +'-'+
              data.gender +'-'+
              data.importance +'-'+
              data.phone +'-'+
              data.customerDepartment +'-'+
              data.customerDesignation +'-'+
               data.customerName === selectedPassengerName
    );
  
    if (selectedPassenger) {
      this.selectedPassengerData = selectedPassenger;
      this.getPassengerID(selectedPassenger.customerPersonID,selectedPassenger.customerPersonName);
    }
  }
  
  getPassengerID(passengerID: any,passengerName:any) {
    this.passengerID=passengerID;
    this.passengerName=passengerName
    this.advanceTableForm.patchValue({primaryPassengerID:this.passengerID});
  }

  openAddPassenger(viewValue: boolean)
  {
    const dialogRef = this.dialog.open(FormDialogRPComponent, 
      {
        width:'50%',
        data: 
          {
            reservationID:this.ReservationID,
            customerGroupID:this.customerGroupID,
            view: viewValue
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        this.passengerloadData();
      })
  }
  
  passengerloadData() {
    this.passengerDetailsService.getTableData(this.ReservationID, this.SearchActivationStatus, this.PageNumber).subscribe(
      (data: PassengerDetails) => {
        this.advanceTablePassenger = data;
      },
      (error: HttpErrorResponse) => {
        this.advanceTablePassenger = null;
      }
    );
  }
  
  newDataAdded(msg: boolean) {
    this.newDataAddedEvent.emit(msg);
  }

  //------------Pickup City -----------------
  onPickupCitysKeyUp(PackageType:string)
  {
     var Prefix = this.advanceTableForm.get("pickupCity").value;
     if(Prefix.length < 3)
      { 
        this.CityList = [];
        return;
      }
    if(PackageType === "Local Rate")
      {
        this._generalService.GetPickupAndDropOffCities(this.contractID,this.packageID ||this.advanceTableForm.value.packageID,Prefix).subscribe(
          data=>
          {
            this.CityList=data;
            this.advanceTableForm.controls['pickupCity'].setValidators([Validators.required,this.PCValidator(this.CityList)]);
            this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
              startWith(""),
              map(value => this._filterCity(value || ''))
            ); 
          });
      }
    else if(PackageType === "Local Lumpsum Rate")
    {
      var Prefix = this.advanceTableForm.get("pickupCity").value;
      if(Prefix.length < 3)
      { 
        this.CityList = [];
        return;
      }
      this._generalService.GetPickupAndDropOffCitiesForLocalLumpsum(this.contractID,this.packageID ||this.advanceTableForm.value.packageID,Prefix).subscribe(
        data=>
        {
          this.CityList=data;
          this.advanceTableForm.controls['pickupCity'].setValidators([Validators.required,this.PCValidator(this.CityList)]);
          this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterCity(value || ''))
          ); 
        });
    }

    else if(PackageType === "Local On Demand Rate")
    {
      var Prefix = this.advanceTableForm.get("pickupCity").value;
      if(Prefix.length < 3)
      { 
        this.CityList = [];
        return;
      }
      this._generalService.GetPickupAndDropOffCitiesForLocalOnDemand(this.contractID,this.packageID ||this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.CityList=data;
        this.advanceTableForm.controls['pickupCity'].setValidators([Validators.required,this.PCValidator(this.CityList)]);
        this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterCity(value || ''))
        ); 
      });
    }

    else if(PackageType === "Local Transfer Rate")
    {
      var Prefix = this.advanceTableForm.get("pickupCity").value;
      if(Prefix.length < 3)
      { 
        this.CityList = [];
        return;
      }
      this._generalService.GetPickupAndDropOffCitiesForLocalTransfer(this.contractID,this.packageID ||this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.CityList=data;
        this.advanceTableForm.controls['pickupCity'].setValidators([Validators.required,this.PCValidator(this.CityList)]);
        this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterCity(value || ''))
        ); 
      });
    }

    else if(PackageType === "Long Term Rental Rate")
    {
      var Prefix = this.advanceTableForm.get("pickupCity").value;
      if(Prefix.length < 3)
      { 
        this.CityList = [];
        return;
      }
      this._generalService.GetPickupAndDropOffCitiesForLongTermRental(this.contractID,this.packageID ||this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.CityList=data;
        this.advanceTableForm.controls['pickupCity'].setValidators([Validators.required,this.PCValidator(this.CityList)]);
        this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterCity(value || ''))
        ); 
      });
    }

    else if(PackageType === "Outstation Lumpsum Rate")
    {
      var Prefix = this.advanceTableForm.get("pickupCity").value;
      if(Prefix.length < 3)
      { 
        this.CityList = [];
        return;
      }
      this._generalService.GetPickupAndDropOffCitiesForOutStationLumpsum(this.contractID,this.packageID ||this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.CityList=data;
        this.advanceTableForm.controls['pickupCity'].setValidators([Validators.required,this.PCValidator(this.CityList)]);
        this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterCity(value || ''))
        ); 
      });
    }

    else if(PackageType === "Outstation OneWay Trip Rate")
    {
      var Prefix = this.advanceTableForm.get("pickupCity").value;
      if(Prefix.length < 3)
      { 
        this.CityList = [];
        return;
      }
      this._generalService.GetPickupAndDropOffCitiesForOutStationOneWayTrip(this.contractID,this.packageID ||this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.CityList=data;
        this.advanceTableForm.controls['pickupCity'].setValidators([Validators.required,this.PCValidator(this.CityList)]);
        this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterCity(value || ''))
        ); 
      });
    }

    else if(PackageType === "Outstation Round Trip Rate")
    {
      var Prefix = this.advanceTableForm.get("pickupCity").value;
      if(Prefix.length < 3)
      { 
        this.CityList = [];
        return;
      }
      this._generalService.GetPickupAndDropOffCitiesForOutStationRoundTrip(this.contractID,this.packageID ||this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.CityList=data;
        this.advanceTableForm.controls['pickupCity'].setValidators([Validators.required,this.PCValidator(this.CityList)]);
        this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterCity(value || ''))
        ); 
      });
    }
}

  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
  //   if (!value || value.length < 3) {
  //   return [];   
  // }
    return this.CityList?.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }
  
  PCValidator(CityList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = CityList.some(data =>(data.geoPointName.toLowerCase()) === value);
        return match ? null : { pickupCityInvalid: true };
      };
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
    this.cityID=cityID;
    this.advanceTableForm.patchValue({pickupCityID:this.cityID});
    //this.InitGoogleAddress();
    //this.InitServiceLocation();
    this.InitServiceLocationBasedOnCity();
    this.pickupCitySet(this.cityID,this.packageType);
    //this.InitReservationInvoiceGSTDetails( this.customerID);
    //this.InitResrvationGSTForCityID(this.customerID,this.cityID);
    this.GetReservationCapping(this.customerGroupID,this.customerID,this.pickupDate,this.cityID,this.packageTypeID,this.vehicleCategoryID);
    // Recalculate drop-off time in case the user picked the city last; the
    // guard inside getETRDropOffTime skips the API call until every required
    // input is populated, so this is safe to call unconditionally.
    this.getETRDropOffTime();
  }

   //------------DropOff City -----------------
   onDropOffCityKeyup(PackageType:string)
   {
      var Prefix = this.advanceTableForm.get("dropOffCity").value;
      if(Prefix.length < 3)
      { 
        this.DropOffCityList = [];
        return;
      }
    if(PackageType === 'Local Rate')
      {
        this._generalService.GetPickupAndDropOffCities(this.contractID,this.packageID ||this.advanceTableForm.value.packageID,Prefix).subscribe(
          data=>
          {
            this.DropOffCityList=data;
             this.advanceTableForm.controls['dropOffCity'].setValidators([this.DropCityValidator(this.DropOffCityList)]);
        this.filteredDropOffCityOptions = this.advanceTableForm.controls['dropOffCity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDropOffCity(value || ''))
        ); 
      });
      }
    else if(PackageType === 'Local Lumpsum Rate')
    {
      var Prefix = this.advanceTableForm.get("dropOffCity").value;
      if(Prefix.length < 3)
      { 
        this.DropOffCityList = [];
        return;
      }
      this._generalService.GetPickupAndDropOffCitiesForLocalLumpsum(this.contractID,this.packageID ||this.advanceTableForm.value.packageID,Prefix).subscribe(
        data=>
        {
          this.DropOffCityList=data;
           this.advanceTableForm.controls['dropOffCity'].setValidators([this.DropCityValidator(this.DropOffCityList)]);
        this.filteredDropOffCityOptions = this.advanceTableForm.controls['dropOffCity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDropOffCity(value || ''))
        ); 
      });
    }

    else if(PackageType === 'Local On Demand Rate')
    {
      var Prefix = this.advanceTableForm.get("dropOffCity").value;
      if(Prefix.length < 3)
      { 
        this.DropOffCityList = [];
        return;
      }
      this._generalService.GetPickupAndDropOffCitiesForLocalOnDemand(this.contractID,this.packageID ||this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.DropOffCityList=data;
         this.advanceTableForm.controls['dropOffCity'].setValidators([this.DropCityValidator(this.DropOffCityList)]);
        this.filteredDropOffCityOptions = this.advanceTableForm.controls['dropOffCity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDropOffCity(value || ''))
        ); 
      });
    }

    else if(PackageType === 'Local Transfer Rate')
    {
      var Prefix = this.advanceTableForm.get("dropOffCity").value;
      if(Prefix.length < 3)
      { 
        this.DropOffCityList = [];
        return;
      }
      this._generalService.GetPickupAndDropOffCitiesForLocalTransfer(this.contractID,this.packageID ||this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.DropOffCityList=data;
         this.advanceTableForm.controls['dropOffCity'].setValidators([this.DropCityValidator(this.DropOffCityList)]);
        this.filteredDropOffCityOptions = this.advanceTableForm.controls['dropOffCity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDropOffCity(value || ''))
        ); 
      });
    }

    else if(PackageType === 'Long Term Rental Rate')
    {
      var Prefix = this.advanceTableForm.get("dropOffCity").value;
      if(Prefix.length < 3)
      { 
        this.DropOffCityList = [];
        return;
      }
      this._generalService.GetPickupAndDropOffCitiesForLongTermRental(this.contractID,this.packageID ||this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.DropOffCityList=data;
         this.advanceTableForm.controls['dropOffCity'].setValidators([this.DropCityValidator(this.DropOffCityList)]);
        this.filteredDropOffCityOptions = this.advanceTableForm.controls['dropOffCity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDropOffCity(value || ''))
        ); 
      });
    }

    else if(PackageType === 'Outstation Lumpsum Rate')
    {
      var Prefix = this.advanceTableForm.get("dropOffCity").value;
      if(Prefix.length < 3)
      { 
        this.DropOffCityList = [];
        return;
      }
      this._generalService.GetPickupAndDropOffCitiesForOutStationLumpsum(this.contractID,this.packageID ||this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.DropOffCityList=data;
         this.advanceTableForm.controls['dropOffCity'].setValidators([this.DropCityValidator(this.DropOffCityList)]);
        this.filteredDropOffCityOptions = this.advanceTableForm.controls['dropOffCity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDropOffCity(value || ''))
        ); 
      });
    }

    else if(PackageType === 'Outstation OneWay Trip Rate')
    {
      var Prefix = this.advanceTableForm.get("dropOffCity").value;
      if(Prefix.length < 3)
      { 
        this.DropOffCityList = [];
        return;
      }
      this._generalService.GetPickupAndDropOffCitiesForOutStationOneWayTrip(this.contractID,this.packageID ||this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.DropOffCityList=data;
         this.advanceTableForm.controls['dropOffCity'].setValidators([this.DropCityValidator(this.DropOffCityList)]);
        this.filteredDropOffCityOptions = this.advanceTableForm.controls['dropOffCity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDropOffCity(value || ''))
        ); 
      });
    }

    else if(PackageType === 'Outstation Round Trip Rate')
    {
      var Prefix = this.advanceTableForm.get("dropOffCity").value;
      if(Prefix.length < 3)
      { 
        this.DropOffCityList = [];
        return;
      }
      this._generalService.GetPickupAndDropOffCitiesForOutStationRoundTrip(this.contractID,this.packageID ||this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.DropOffCityList=data;
        this.advanceTableForm.controls['dropOffCity'].setValidators([this.DropCityValidator(this.DropOffCityList)]);
        this.filteredDropOffCityOptions = this.advanceTableForm.controls['dropOffCity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDropOffCity(value || ''))
        ); 
      });
    }
  }

  private _filterDropOffCity(value: string): any {
    const filterValue = value.toLowerCase();
  //   if (!value || value.length < 3) {
  //   return [];   
  // }
    return this.DropOffCityList?.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }

  DropCityValidator(DropOffCityList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
          return null; // No value to validate, return null (no error)
        }
        const value = control.value?.toLowerCase();
        const match = DropOffCityList.some(group => group.geoPointName.toLowerCase() === value);
        return match ? null : { dropOffCityInvalid: true };
      };
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
    //this.InitDropOffGoogleAddress();
  }

  //------------ Vehicle -----------------
  onKeyupVehicle(PackageType)
  {
     var Prefix = this.advanceTableForm.get("vehicle").value;
      if(Prefix.length < 3)
      { 
        this.VehicleList = [];
        return;
      }

    if(PackageType === 'Local Rate')
      {
        this._generalService.GetVehicleBasedOnContractID(this.contractID,this.packageID || this.advanceTableForm.value.packageID,Prefix).subscribe(
        data=>
        {
          this.VehicleList=data;
          this.advanceTableForm.controls['vehicle'].setValidators([Validators.required,this.CValidator(this.VehicleList)]);
          this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicle(value || ''))
          ); 
        });
      }

    else if(PackageType === 'Local Lumpsum Rate')
    {
     if(Prefix.length < 3)
      { 
        this.VehicleList = [];
        return;
      }
      this._generalService.GetVehicleBasedOnContractIDForLocalLumpsum(this.contractID,this.packageID || this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.VehicleList=data;
        this.advanceTableForm.controls['vehicle'].setValidators([Validators.required,this.CValidator(this.VehicleList)]);
        this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterVehicle(value || ''))
        ); 
      });
    }

    else if(PackageType === 'Local On Demand Rate')
    {
       if(Prefix.length < 3)
      { 
        this.VehicleList = [];
        return;
      }
      this._generalService.GetVehicleBasedOnContractIDForLocalOnDemand(this.contractID,this.packageID || this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.VehicleList=data;
        this.advanceTableForm.controls['vehicle'].setValidators([Validators.required,this.CValidator(this.VehicleList)]);
        this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterVehicle(value || ''))
        ); 
      });
    }

    else if(PackageType === 'Local Transfer Rate')
    {
      var Prefix = this.advanceTableForm.get("vehicle").value;
      if(Prefix.length < 3)
      { 
        this.VehicleList = [];
        return;
      }
      this._generalService.GetVehicleBasedOnContractIDForLocalTransfer(this.contractID,this.packageID || this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.VehicleList=data;
        this.advanceTableForm.controls['vehicle'].setValidators([Validators.required,this.CValidator(this.VehicleList)]);
        this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterVehicle(value || ''))
        ); 
      });
    }

    else if(PackageType === 'Long Term Rental Rate')
    {
       if(Prefix.length < 3)
      { 
        this.VehicleList = [];
        return;
      }
      this._generalService.GetVehicleBasedOnContractIDForLongTermRental(this.contractID,this.packageID || this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.VehicleList=data;
        this.advanceTableForm.controls['vehicle'].setValidators([Validators.required,this.CValidator(this.VehicleList)]);
        this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterVehicle(value || ''))
        ); 
      });
    }

    else if(PackageType === 'Outstation Lumpsum Rate')
    {
      var Prefix = this.advanceTableForm.get("vehicle").value;
      if(Prefix.length < 3)
      { 
        this.VehicleList = [];
        return;
      }
      this._generalService.GetVehicleBasedOnContractIDForOutStationLumpsum(this.contractID,this.packageID || this.advanceTableForm.value.packageID,Prefix).subscribe(
      data=>
      {
        this.VehicleList=data;
        this.advanceTableForm.controls['vehicle'].setValidators([Validators.required,this.CValidator(this.VehicleList)]);
        this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterVehicle(value || ''))
        ); 
      });
    }

  else if(PackageType === 'Outstation OneWay Trip Rate')
  {
    var Prefix = this.advanceTableForm.get("vehicle").value;
    if(Prefix.length < 3)
    { 
      this.VehicleList = [];
      return;
    }
    this._generalService.GetVehicleBasedOnContractIDForOutStationOneWayTrip(this.contractID,this.packageID || this.advanceTableForm.value.packageID,Prefix).subscribe(
    data=>
    {
      this.VehicleList=data;
      this.advanceTableForm.controls['vehicle'].setValidators([Validators.required,this.CValidator(this.VehicleList)]);
      this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
      startWith(""),
      map(value => this._filterVehicle(value || ''))
      ); 
    });
  }

  else if(PackageType === 'Outstation Round Trip Rate')
  {
    var Prefix = this.advanceTableForm.get("vehicle").value;
    if(Prefix.length < 3)
    { 
      this.VehicleList = [];
      return;
    }
    this._generalService.GetVehicleBasedOnContractIDForOutStationRoundTrip(this.contractID,this.packageID || this.advanceTableForm.value.packageID,Prefix).subscribe(
    data=>
    {
      this.VehicleList=data;
      this.advanceTableForm.controls['vehicle'].setValidators([Validators.required,this.CValidator(this.VehicleList)]);
      this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
      startWith(""),
      map(value => this._filterVehicle(value || ''))
      ); 
    });
  }
}

  private _filterVehicle(value: string): any {
    const filterValue = value.toLowerCase();
    //  if (!value || value.length < 3) {
    // return [];   
    //  }

    return this.VehicleList?.filter(
      customer => 
      {
        return customer.vehicle.toLowerCase().includes(filterValue);
      }
    );
  }

  CValidator(VehicleList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = VehicleList.some(data =>
          (data.vehicle.toLowerCase()) === value
        );
        return match ? null : { vehicleInvalid: true };
      };
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
    this.getETRDropOffTime();
    this.GetReservationCapping(this.customerGroupID,this.customerID,this.pickupDate,this.cityID,this.packageTypeID,this.vehicleCategoryID);
  }

  //------------ Type -----------------
  onKeyupDuty(){
    
    if (!this.contractID) { return; }
     var Prefix = this.advanceTableForm.get("packageType").value;
      if(Prefix.length < 3)
      { 
        this.PackageTypeList = [];
        return;
      }

    this._generalService.getPackageTypeByContractID(this.contractID,Prefix).subscribe(
      data=>
      {
        this.PackageTypeList=data;
         this.advanceTableForm.controls['packageType'].setValidators([Validators.required,this.DTValidator(this.PackageTypeList)]);
        this.filteredPackageTypeOptions = this.advanceTableForm.controls['packageType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackageType(value || ''))
        ); 
      });
  }

//   private _filterPackageType(value: string): any {

//   const filterValue = (value || '').toLowerCase();
//   if (!filterValue || filterValue.length < 3) {
//     return [];
//   }
//   return this.PackageTypeList?.filter(customer =>
//     customer.packageType.toLowerCase().includes(filterValue)
//   );
// }

DTValidator(PackageTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = PackageTypeList.some(data =>
        (data.packageType.toLowerCase()) === value
      );
      return match ? null : { packageTypeInvalid: true };
    };
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
    this.resetOtherFields();
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
    // this.InitPackage();
    this.ETRDropoffDateSet(packageType);
    this.changeDropOffDate(packageType);
    this.GetReservationCapping(this.customerGroupID,this.customerID,this.pickupDate,this.cityID,this.packageTypeID,this.vehicleCategoryID);
  }
  //----------DropOFFDate-------------

  changeDropOffDate(PackageType:any): void {
    if (PackageType !== 'Local Rate') {
      this.advanceTableForm.controls['dropOffDate']?.setValue('');

    }
  }

  //------------ Package -----------------
  onKeyupPackage()
  {  
    var Prefix = this.advanceTableForm.get("package").value;
      if(Prefix.length < 3)
      { 
        this.PackageList = [];
        return;
      } 
    this._generalService.GetPackagesForReservation(this.packageTypeID || this.advanceTableForm.value.packageTypeID,this.advanceTableForm.value.packageType,this.contractID,Prefix,this.customerID || this.advanceTableForm.value.customerID).subscribe(
      data=>
      {
        this.PackageList=data;
        this.advanceTableForm.controls['package'].setValidators([Validators.required,this.PValidator(this.PackageList)]);
        this.filteredPackageOptions = this.advanceTableForm.controls['package'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackage(value || ''))
        ); 
      });
  }
//   private _filterPackage(value: string): any {

//   const filterValue = (value || '').toLowerCase();

//   if (!filterValue || filterValue.length < 3) {
//     return [];
//   }
//   return this.PackageList?.filter(customer =>
//     customer.package.toLowerCase().includes(filterValue)
//   );
// }


  PValidator(PackageList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = PackageList.some(data =>(data.package.toLowerCase()) === value);
        return match ? null : { packageInvalid: true };
      };
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
    // `this.advanceTable` is undefined in new-reservation mode; guard every
    // access so a missing record doesn't throw and abort the rest of this
    // function (which would leave downstream form state half-initialised).
    const fallbackPackageType = this.packageType || (this.advanceTable && this.advanceTable.packageType) || '';
    // this.InitCity(fallbackPackageType);
    // this.InitDropOffCity(fallbackPackageType);
    // this.InitVehicle(this.packageType);
    // Re-enabled so Drop-off Time / ETR binds as soon as a Package is picked.
    // Previously only getVehicleID() triggered this, which meant the field
    // stayed blank until a vehicle was also selected.
    this.getETRDropOffTime();
  }

  //------------ PickupSpotType -----------------
  InitPickupSpotType(){
    this._generalService.GetGeoPointTypeForReservation().subscribe(
      data=>
      {
        this.PickupSpotTypeList=data;
        this.filteredPSTOptions = this.advanceTableForm.controls['pickupSpotType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPST(value || ''))
        ); 
      });
  }

  private _filterPST(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PickupSpotTypeList?.filter(
      customer => 
      {
        return customer.geoPointType.toLowerCase().includes(filterValue);
      }
    );
  }

  onPSTSelected(selectedPSTName: string) {
    const selectedPST = this.PickupSpotTypeList.find(
      data => data.geoPointType === selectedPSTName
    );
  
    if (selectedPST) {
      this.getPSTID(selectedPST.geoPointTypeID,selectedPST.geoPointType);
    }
  }
  
  getPSTID(pickupSpotTypeID: any,pickupSpotType:any) {
    this.pickupSpotTypeID=pickupSpotTypeID;
    this.pickupSpotType=pickupSpotType;
    this.advanceTableForm.patchValue({pickupSpotTypeID:this.pickupSpotTypeID});
    this.InitPickupSpot();
  }

   //------------ PickupSpot -----------------
  InitPickupSpot(){
    // Skip until a pickup-spot type is selected; otherwise the URL ends in
    // "undefined" and the backend returns 400 on page load.
    if (!this.pickupSpotTypeID) { return; }
    this._generalService.GetPickupSpotForReservation(this.pickupSpotTypeID).subscribe(
      data=>
      {
        this.PickupSpotList = this.selectedCity
        ? data.filter(spot => spot.geoPointName.toLowerCase().includes(this.selectedCity.toLowerCase()))
        : data;
        this.filteredPSOptions = this.advanceTableForm.controls['pickupSpot'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPSpot(value || ''))
        ); 
      });
  }

  private _filterPSpot(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PickupSpotList?.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }

  onPSSelected(selectedPSName: string) {
    const selectedPS = this.PickupSpotList.find(
      data => data.geoPointName === selectedPSName
    );
  
    if (selectedPS) {
      this.getPSpotID(selectedPS.geoPointID);
    }
  }
  
  getPSpotID(pickupSpotID: any) {
    this.pickupSpotID=pickupSpotID;
    this.advanceTableForm.patchValue({pickupSpotID:this.pickupSpotID});
  }

  //------------ Service Location -----------------
  InitServiceLocationBasedOnCity()
  { 
    // Keep options empty on focus/click. Load only when user types.
    this.ServiceLocationList = [];
    this.filteredServiceLocationOptions = of([] as OrganizationalEntityDropDown[]);
    this.advanceTableForm.controls['serviceLocation'].setValidators([Validators.required]);
  }

  private _filterServiceLocationBasedOnCity(value: string): any {
    const filterValue = value.toLowerCase();
  //    if (!value || value.length < 3) {
  //   return [];   
  // }
    return this.ServiceLocationList?.filter(
      customer => 
      {
        return customer.organizationalEntityName.toLowerCase().includes(filterValue);
      }
    );
  }

  SLValidator(ServiceLocationList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = ServiceLocationList.some(data => (data.organizationalEntityName.toLowerCase()) === value);
        return match ? null : { serviceLocationeInvalid: true };
      };
    }
  
  onSLSelectedBasedOnCity(selectedSLName: string) {
    const selectedSL = this.ServiceLocationList.find(
      data => data.organizationalEntityName === selectedSLName
    );
  
    if (selectedSL) {
      this.getServiceLocationIDBasedOnCity(selectedSL.organizationalEntityID);
    }
  }

  getServiceLocationIDBasedOnCity(serviceLocationID: any) {
    this.serviceLocationID=serviceLocationID;
    this.advanceTableForm.patchValue({serviceLocationID:this.serviceLocationID});
    this.advanceTableForm.patchValue({transferedLocationID:this.serviceLocationID});
  }

  onServiceLocationKeyup(){ 
     var Prefix = this.advanceTableForm.get("serviceLocation").value;
      if(Prefix.length < 3)
      { 
        this.ServiceLocationList = [];
        this.filteredServiceLocationOptions = of([] as OrganizationalEntityDropDown[]);
        return;
      }
    this._generalService.GetLocation(Prefix).subscribe(
      data=>
      {
        this.ServiceLocationList=data;
        this.advanceTableForm.controls['serviceLocation'].setValidators([Validators.required,this.SLValidator(this.ServiceLocationList)]);
        this.filteredServiceLocationOptions = of(this.ServiceLocationList || []);
      });
  }

  private _filterServiceLocation(value: string): any {
    const filterValue = value.toLowerCase();
  //    if (!value || value.length < 3) {
  //   return [];   
  // }
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

  valueSwitchForLoaction()
  {  

    if(this.advanceTableForm.value.serviceLocationBasedOnCity===true)
    {
      this.ifBlockService=false;
      this.advanceTableForm.controls["serviceLocation"].setValue('');
      // this.InitServiceLocation();
    }
    if(this.advanceTableForm.value.serviceLocationBasedOnCity===false)
    {
      this.ifBlockService=true;
      this.advanceTableForm.controls["serviceLocation"].setValue('');
      this.InitServiceLocationBasedOnCity();
    }
  }

  GetServiceLocation(){ 
    this.reservationService.GetServiceLocation(this.reservationID).subscribe(
      data=>
      {
        this.ServiceLocationData=data;
        this.advanceTableForm.patchValue({serviceLocationID:this.ServiceLocationData.transferedLocationID});
        this.advanceTableForm.patchValue({serviceLocation:this.ServiceLocationData.transferedLocation});
      });
       
  }

  //------------ DropOffSpotType -----------------
  InitDropOffSpotType(){
    this._generalService.GetGeoPointTypeForReservation().subscribe(
      data=>
      {
        this.DropOffSpotTypeList=data;
        this.filteredDSTOptions = this.advanceTableForm.controls['dropOffSpotType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDST(value || ''))
        ); 
      });
  }

  private _filterDST(value: string): any {
    const filterValue = value.toLowerCase();
    return this.DropOffSpotTypeList?.filter(
      customer => 
      {
        return customer.geoPointType.toLowerCase().includes(filterValue);
      }
    );
  }

  onDropSTSelected(selectedDSTName: string) {
    const selectedDST = this.DropOffSpotTypeList.find(
      data => data.geoPointType === selectedDSTName
    );
  
    if (selectedDST) {
      this.getDSTID(selectedDST.geoPointTypeID,selectedDST.geoPointType);
    }
  }
  
  getDSTID(dropOffSpotTypeID: any,dropOffSpotType:any) {
    this.dropOffSpotTypeID=dropOffSpotTypeID;
    this.dropOffSpotType=dropOffSpotType;
    this.advanceTableForm.patchValue({dropOffSpotTypeID:this.dropOffSpotTypeID});
    this.InitDropOffSpot();
  }

   //------------ DropOffSpot -----------------
  InitDropOffSpot(){
    // Skip until a drop-off-spot type is selected; otherwise the URL ends
    // in "undefined" and the backend returns 400 on page load.
    if (!this.dropOffSpotTypeID) { return; }
    this._generalService.GetPickupSpotForReservation(this.dropOffSpotTypeID).subscribe(
      data=>
      {
        this.DropOffSpotList= this.selectedCity
        ? data.filter(spot => spot.geoPointName.toLowerCase().includes(this.selectedCity.toLowerCase()))
        : data;
        this.filteredDSOptions = this.advanceTableForm.controls['dropOffSpot'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDSpot(value || ''))
        ); 
      });
  }

  private _filterDSpot(value: string): any {
    const filterValue = value.toLowerCase();
    return this.DropOffSpotList?.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }
  
  onDropSpotSelected(selectedDSName: string) {
    const selectedDS = this.DropOffSpotList.find(
      data => data.geoPointName === selectedDSName
    );
  
    if (selectedDS) {
      this.getDSpotID(selectedDS.geoPointID);
    }
  }

  getDSpotID(dropOffSpotID: any) {
    this.dropOffSpotID=dropOffSpotID;
    this.advanceTableForm.patchValue({dropOffSpotID:this.dropOffSpotID});
  }

   //------------ ReservationSource -----------------
   onKeyupReservationSource(){
    var Prefix = this.advanceTableForm.get("reservationSource").value;
      if(Prefix.length < 3)
      { 
        this.ReservationSourceList = [];
        return;
      } 

    this._generalService.GetReservationSource(Prefix).subscribe(
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
      customer => 
      {
        return customer.reservationSource.toLowerCase().includes(filterValue);
      }
    );
  }
  
  onRSSelected(selectedRSName: string) {
    const selectedRS = this.ReservationSourceList.find(
      data => data.reservationSource === selectedRSName
    );
  
    if (selectedRS) {
      this.getReservationSourceID(selectedRS.reservationSourceID);
    }
  }

  getReservationSourceID(reservationSourceID: any) {
    this.reservationSourceID=reservationSourceID;
    this.advanceTableForm.patchValue({reservationSourceID:this.reservationSourceID});
  }

public PostGoogleAddress(): void
{
  this.googlePlacesForm.patchValue({geoLocation:this.googlePlacesForm.value.latitude
    +
     ',' +
     this.googlePlacesForm.value.longitude
 });
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

public OtherDetails(): boolean {
  // if (this.advanceTableForm.value.ticketNumber == "") {
  //   Swal.fire({
  //     title: '',
  //     text: 'Please Select Ticket Number.',
  //     icon: 'warning',
  //   });
  //   return false;
  // }
  if (this.advanceTableForm.value.ticketNumber === "") {
    Swal.fire({
      title: '',
      text: 'Please Select Ticket Number.',
      icon: 'warning',
    });
    return false;
  }
  if (this.advanceTableForm.value.reservationSource === "") {
    Swal.fire({
      title: '',
      text: 'Please Select Reservation Source.',
      icon: 'warning',
    });
    return false;
  }

  if (this.advanceTableForm.value.modeOfPayment === "") {
    Swal.fire({
      title: '',
      text: 'Please Select Payment Mode.',
      icon: 'warning',
    });
    return false;
  }
  // if (this.advanceTableForm.value.reservationSourceDetail == "") {
  //   Swal.fire({
  //     title: '',
  //     text: 'Please Select Reservation Source Detail.',
  //     icon: 'warning',
  //   });
  //   return false;
  // }
  // if (this.advanceTableForm.value.referenceNumber == "") {
  //   Swal.fire({
  //     title: '',
  //     text: 'Please Select Reference Number.',
  //     icon: 'warning',
  //   });
  //   return false;
  // }
  return true;
}
public PickupDetails(): boolean {
   
  if (this.advanceTableForm.value.pickupDate === null) {
    Swal.fire({
      title: '',
      text: 'Please Select Pickup Date.',
      icon: 'warning',
    });
    return false;
  }
  if (this.advanceTableForm.value.packageTypeID === 0 || this.advanceTableForm.value.packageType === "") {
    Swal.fire({
      title: '',
      text: 'Please Select Duty Type.',
      icon: 'warning',
    });
    return false;
  }
  if (this.advanceTableForm.value.packageID === 0 || this.advanceTableForm.value.package === "") {
    Swal.fire({
      title: '',
      text: 'Please Select Package.',
      icon: 'warning',
    });
    return false;
  }
 
  if (this.advanceTableForm.value.pickupCityID === 0 || this.advanceTableForm.value.pickupCity === "") {
    Swal.fire({
      title: '',
      text: 'Please Select Pickup City.',
      icon: 'warning',
    });
    return false;
  }
  if (this.advanceTableForm.value.vehicleID === 0 || this.advanceTableForm.value.vehicle === "") {
    Swal.fire({
      title: '',
      text: 'Please Select Vehicle.',
      icon: 'warning',
    });
    return false;
  }
  if (this.advanceTableForm.value.pickupAddress === "") {
    Swal.fire({
      title: '',
      text: 'Please Select Pickup Address.',
      icon: 'warning',
    });
    return false;
  }
  if (this.advanceTableForm.value.pickupAddressDetails === "") {
    Swal.fire({
      title: '',
      text: 'Please Select Pickup Address Details.',
      icon: 'warning',
    });
    return false;
  }
  if (this.advanceTableForm.value.serviceLocationID === 0 || this.advanceTableForm.value.serviceLocation === "") {
    Swal.fire({
      title: '',
      text: 'Please Select Service Location.',
      icon: 'warning',
    });
    return false;
  }
  // if (this.advanceTableForm.value.pickupPriorityOrder === 0) {
  //   Swal.fire({
  //     title: '',
  //     text: 'Please Select Pickup Priority Order.',
  //     icon: 'warning',
  //   });
  //   return false;
  // }
  return true;
}
public CustomerDetails(): boolean {
  if (this.advanceTableForm.value.customerTypeID === 0) {
    Swal.fire({
      title: '',
      text: 'Please Select Customer Type.',
      icon: 'warning',
    });
    return false;
  }
  if (this.advanceTableForm.value.customerID === 0) {
    Swal.fire({
      title: '',
      text: 'Please Select Customer Customer Group.',
      icon: 'warning',
    });
    return false;
  }
  if (this.advanceTableForm.value.primaryBookerID === 0 || this.advanceTableForm.value.booker === "") {
    Swal.fire({
      title: '',
      text: 'Please Select Booker.',
      icon: 'warning',
    });
    return false;
  }
  if (this.advanceTableForm.value.primaryPassengerID === 0 || this.advanceTableForm.value.passenger === "") {
    Swal.fire({
      title: '',
      text: 'Please Select Passenger.',
      icon: 'warning',
    });
    return false;
  }
  if(this.isGSTMandatoryWithReservation === true)
  {
    if (this.advanceTableForm.value.gSTForBilling  === "" || this.advanceTableForm.value.customerConfigurationInvoicingID === 0) 
    {
      Swal.fire({
        title: '',
        text: 'Please Select GST.',
        icon: 'warning',
      });
      return false;
    }
  }
  return true;
}

public validateCustomerSpecificFields(): boolean {
  for (let field of this.CustomerExtraFieldList) {
    if (field.isMandatory) 
    {
      const value = this.advanceTableForm.value[field.fieldName];
      if (!value || value.trim() === '') {
        Swal.fire({
          title: '',
          text: `Please fill in ${field.fieldName}.`,
          icon: 'warning',
        });
        return false;
      }
    }
  }
  return true;
}
public validateONReservationGST(): boolean {
  if(this.isGSTMandatoryWithReservation === true)
  {
    if (this.advanceTableForm.value.gSTForBilling  === "" || this.advanceTableForm.value.customerConfigurationInvoicingID === 0) 
    {
      Swal.fire({
        title: '',
        text: 'Please Select GST.',
        icon: 'warning',
      });
      return false;
    }
  }
  return true;
}


  navigateToControlPanel() 
  {

    this.router.navigate(['/controlPanelDesign']);
    //const url= this.router.serializeUrl(this.router.createUrlTree(['/controlPanelDesign']));
    //window.open(this._generalService.FormURL+ url);
    Swal.close();
  }

  public Put(): void
  {
    this.advanceTableForm.patchValue({isTimeNotConfirmed:this.isTNCSelected});
    if (this.CustomerDetails()) 
    {
      if(this.PickupDetails() && this.OtherDetails() || this.validateCustomerSpecificFields())
      {
        if(!this.advanceTableForm.value.dropOffPriorityOrder)
        {
          this.advanceTableForm.patchValue({dropOffPriorityOrder:0});
        }
    this.advanceTableForm.patchValue({projectCode:this.arr});
    if(this.advanceTableForm.value.customerConfigurationInvoicingID !== 0)
    {
      this.advanceTableForm.patchValue({customerConfigurationInvoicingID:this.customerConfigurationInvoicingID});
    }
    else
    {
      this.advanceTableForm.patchValue({customerConfigurationInvoicingID:0});
    }
    this.reservationService.update(this.advanceTableForm.value)  
    .subscribe(
    response => 
    {
      this.showNotification(
        'snackbar-success',
        'Reservation Updated...!!!',
        'bottom',
        'center'
      );
      this.reservationNo=response.reservationID
      Swal.fire({
        title: '',
        text: 'Reservation - '+ this.reservationNo+' updated. You can add further details from booking details section.',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        denyButtonColor: '#6c757d',
        confirmButtonText: 'Add Details',
        cancelButtonText:'Reservation List',
        denyButtonText: 'Control Panel'
      // footer: '<button color="primary" (click)="takeMeOnBookingDetails()">Add Details</button><button tabindex="-1"  (click)="takeMeOnDashboard()">Reservation List</button>'
      }).then((result) => {
        if (result.isConfirmed) 
        {
          this.takeMeToReservationEditForm(response.customerGroupID,response.reservationID,response.reservationGroupID);
        }
        else if (result.isDenied) 
        {
          this.navigateToControlPanel();
        } 
        else if (result.isDismissed) 
        {
          this.takeMeToReservationList(response);
        }
      });

      // this.advanceTableForm.reset();
      // this.ImagePath='';
      // window.location.reload();
       //this._generalService.sendUpdate('QualificationCreate:QualificationView:Success');//To Send Updates  
    
    },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      );
      // this._generalService.sendUpdate('QualificationAll:QualificationView:Failure');//To Send Updates  
    }
  )
      }
  }
  }

  public PutForReservationEdit(): void
  { 
    this.advanceTableForm.patchValue({isTimeNotConfirmed:this.isTNCSelected});
    if (this.CustomerDetails()) 
    {
      if(this.PickupDetails() && this.OtherDetails() || this.validateCustomerSpecificFields())
      {
        if(!this.advanceTableForm.value.dropOffPriorityOrder)
          {
            this.advanceTableForm.patchValue({dropOffPriorityOrder:0});
          }
    this.advanceTableForm.patchValue({projectCode:this.arr});
    if(this.advanceTableForm.value.customerConfigurationInvoicingID !== 0)
    {
      this.advanceTableForm.patchValue({customerConfigurationInvoicingID:this.customerConfigurationInvoicingID});
    }
    else
    {
      this.advanceTableForm.patchValue({customerConfigurationInvoicingID:0});
    }
    this.reservationService.updateReservationEdit(this.advanceTableForm.value)  
    .subscribe(
    response => 
    {
      //this.dialogRef.close();
      this.showNotification(
        'snackbar-success',
        'Reservation Updated...!!!',
        'bottom',
        'center'
      );    
    },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      );
      // this._generalService.sendUpdate('QualificationAll:QualificationView:Failure');//To Send Updates  
    }
  )
      }
  }
  }

  public Post(): void
  {
    this.reservationService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this.showNotification(
        'snackbar-success',
        'Reservation Updated...!!!',
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
     //this._generalService.sendUpdate('PaymentCycleAll:PaymentCycleView:Failure');//To Send Updates  
    }
  )
  }

  takeMeToReservationList(response:any)
  {
    // this.router.navigate(['/controlPanelDesign']);
    const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(response.reservationGroupID.toString()));
    this.router.navigate(['/reservationGroupDetails'],{ queryParams: {
      reservationGroupID: encryptedReservationGroupID,
      // reservationGroupID:response.reservationGroupID,
      // formName:'fromControlPanel',
      // customerID:response.customerID,
      // customerName:response.customerName,
      // customerGroupID:response.customerGroupID,
      // customerTypeID:response.customerTypeID,
      // customerType:response.customerType,
      // primaryBookerID:response.primaryBookerID,
      // primaryBooker:response.primaryBooker,
      // gender:response.gender,
      // importance:response.importance,
      // phone:response.phone,
      // customerDepartment:response.customerDepartment,
      // customerDesignation:response.customerDesignation,
      // customerForBooker:response.customerForBooker
      type:'edit',
    }});
  }

  takeMeToReservationEditForm(customerGroupID:any,reservationID:any,reservationGroupID:any)
  {
    const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(reservationGroupID.toString()));
    const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(reservationID.toString()));
    const encryptedCustomerGroupID = encodeURIComponent(this._generalService.encrypt(customerGroupID.toString()));
    this.router.navigate(['/newForm'], { queryParams: {
      
      reservationID:encryptedReservationID,     
      reservationGroupID: encryptedReservationGroupID ,
      customerGroupID:encryptedCustomerGroupID                 
    } });
    //window.open(this._generalService.FormURL+ url, '_blank');
  }

  submit() 
  {
    // emppty stuff
  }

  navigateToNewForms() {
    // Guard against the silent-failure case: if the reservation hasn't been
    // saved yet (or route params didn't populate), these three ids are
    // undefined and calling `.toString()` on undefined throws a TypeError
    // that Angular swallows -> button click appears to do nothing.
    const reservationId = this.ReservationID;
    const reservationGroupId = this.reservationGroupID;
    const customerGroupId = this.customerGroupID;

    if (
      reservationId === null || reservationId === undefined || reservationId === '' ||
      reservationGroupId === null || reservationGroupId === undefined || reservationGroupId === '' ||
      customerGroupId === null || customerGroupId === undefined || customerGroupId === ''
    ) {
      this.showNotification(
        'snackbar-warning',
        'Please save the reservation first before adding details.',
        'bottom',
        'center'
      );
      return;
    }

    const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(String(reservationGroupId)));
    const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(String(reservationId)));
    const encryptedCustomerGroupID = encodeURIComponent(this._generalService.encrypt(String(customerGroupId)));
    const url = this.router.serializeUrl(this.router.createUrlTree(['/newForm'], {
      queryParams: {
        reservationID: encryptedReservationID,
        reservationGroupID: encryptedReservationGroupID,
        customerGroupID: encryptedCustomerGroupID,
        type: 'edit',
      }
    }));

    const formUrl = this._generalService.FormURL || '';
    const fullUrl = formUrl + url;
    const opened = window.open(fullUrl, '_blank');

    // Modern browsers block window.open when a popup blocker is active or the
    // call is not treated as user-activated. If that happens, fall back to
    // same-tab navigation so the user isn't stuck.
    if (!opened) {
      this.router.navigate(['/newForm'], {
        queryParams: {
          reservationID: encryptedReservationID,
          reservationGroupID: encryptedReservationGroupID,
          customerGroupID: encryptedCustomerGroupID,
          type: 'edit',
        }
      });
    }
  }
  // navigateToNewForms()
  // {
  //   const url= this.router.serializeUrl(this.router.createUrlTree(['/newForm'],{ queryParams: {
  //     reservationID:this.ReservationID,
  //     customerGroupID:this.customerGroupID,
  //     reservationGroupID:this.reservationGroupID
  //   }}));
  //   window.open(this._generalService.FormURL+ url, '_blank');
  // }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  onContextMenu(event: MouseEvent, item: Reservation) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

/////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string;
  public uploadFinished = (event) => {
  this.response = event;
  this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
  this.advanceTableForm.patchValue({attachment:this.ImagePath})
  }
/////////////////for Image Upload ends////////////////////////////

  /////////////////To Recieve Updates Start////////////////////////////
  messageReceived: string;
  MessageArray:string[]=[];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService()
  {
    this.subscriptionName=this._generalService.getUpdate().subscribe
    (
      message => 
      { 
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="ReservationCreate")
          {
            if(this.MessageArray[1]=="ReservationView")
            {
              if(this.MessageArray[2]=="Success")
              {
                
                this.showNotification(
                'snackbar-success',
                'Reservation Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ReservationUpdate")
          {
            if(this.MessageArray[1]=="ReservationView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'Reservation Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ReservationDelete")
          {
            if(this.MessageArray[1]=="ReservationView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ReservationAll")
          {
            if(this.MessageArray[1]=="ReservationView")
            {
              if(this.MessageArray[2]=="Failure")
              {
               
               this.showNotification(
                'snackbar-danger',
                'Operation Failed.....!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DataNotFound")
          {
            if(this.MessageArray[1]=="DuplicacyError")
            {
              if(this.MessageArray[2]=="Failure")
              {
               
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

  customerShort()
  {
    const dialogRef = this.dialog.open(FormDialogCustomerShortComponent, 
      {
        data: 
          {
            advanceTable: this.customerDetailData,
            action: 'add',
            customerID: this.advanceTableForm.value.customerID,
            customerGroupID: this.advanceTableForm.value.customerGroupID,
            
          }
      });
      dialogRef.afterClosed().subscribe(res => {
        // received data from dialog-component
        this.InitCustomerCustomerGroup();
        
      })
  }

  personShort()
  {
    if(this.action==='edit')
    {
      // let customer=this.advanceTableForm.value.customerCustomerGroup?.split('-')[0];
      // let customerGroup=this.advanceTableForm.value.customerCustomerGroup?.split('-')[1];
      let customerGroup=this.advanceTableForm.controls['customerCustomerGroup'].value.split('-')[1];
      this.customerDetailData={customerGroup:customerGroup,customerGroupID:this.advanceTableForm.value.customerGroupID,
        // customerID:this.advanceTableForm.value.customerID,customerName:this.customerName}
        customerID:this.customerID,customerName:this.customerName}
      if(this.customerDetailData)
      {
      const dialogRef = this.dialog.open(FormDialogComponentCustomerPerson, 
        {
          data: 
            {
              advanceTable: this.customerDetailData,
              action: 'add',
              forCP:'CP',
              // forCP:'368807',
              CustomerGroupID:this.customerDetailData.customerGroupID,
              CustomerGroupName:this.customerDetailData.customerGroup
            }
        });
        dialogRef.afterClosed().subscribe(res => {
          // received data from dialog-component
          // this.InitBooker();
          // this.InitPassenger();
        })
      }
    }
    else
    {
      if(this.customerDetailData)
    {
    const dialogRef = this.dialog.open(FormDialogComponentCustomerPerson, 
      {
        data: 
          {
            advanceTable: this.customerDetailData,
            action: 'add',
            forCP:'CP',
            CustomerGroupID:this.customerDetailData.customerGroupID,
            CustomerGroupName:this.customerDetailData.customerGroup
          }
      });
      dialogRef.afterClosed().subscribe(res => {
        // received data from dialog-component
        // this.InitBooker();
        // this.InitPassenger();
      })
    }
    }
    
  }

  editPassenger() {
    if(this.action===undefined)
   {
     this.action = 'edit';
    }
   
    if(this.action==='edit')
    {
      let customerGroup=this.advanceTableForm.controls['customerCustomerGroup'].value.split('-')[1];
      this.customerDetailData={customerGroup:customerGroup,customerGroupID:this.advanceTableForm.value.customerGroupID, customerID:this.customerID,customerName:this.customerName}
      if(this.customerDetailData)
      {
      const dialogRef = this.dialog.open(FormDialogComponentCustomerPerson, 
        {
          data: 
            {
              advanceTable: this.selectedPassengerData,
              action: 'edit',
              CustomerGroupID:this.customerDetailData.customerGroupID,
              CustomerGroupName:this.customerDetailData.customerGroup
            }
        });
        dialogRef.afterClosed().subscribe(res => {
          // received data from dialog-component
          // this.InitBooker();
          // this.InitPassenger();
        })
      }
    }
  }

  personShortBooker()
  {
    if(this.action==='edit')
    {
      // let customer=this.advanceTableForm.value.customerCustomerGroup?.split('-')[0];
      // let customerGroup=this.advanceTableForm.value.customerCustomerGroup?.split('-')[1];
            // let customer= this.customerName;
            let customerGroup=this.advanceTableForm.controls['customerCustomerGroup'].value.split('-')[1];
      this.customerDetailData={customerGroup:customerGroup,customerGroupID:this.advanceTableForm.value.customerGroupID,
        customerID:this.advanceTableForm.value.customerID,customerName:this.customerName}
        // customerID:this.customerID,customerName:this.customerName}
      if(this.customerDetailData)
      {
      const dialogRef = this.dialog.open(FormDialogComponentCustomerPerson, 
        {
          data: 
            {
              advanceTable: this.customerDetailData,
              action: 'add',
              // forCP:'368807',
              forCP:'CP',
              CustomerGroupID:this.customerDetailData.customerGroupID,
              CustomerGroupName:this.customerDetailData.customerGroup
            }
        });
        dialogRef.afterClosed().subscribe(res => {
          // received data from dialog-component
          // this.InitBooker();
          // this.InitPassenger();
        })
      }
    }
    else
    {
      if(this.customerDetailData)
    {
    const dialogRef = this.dialog.open(FormDialogComponentCustomerPerson, 
      {
        data: 
          {
            advanceTable: this.customerDetailData,
            action: 'add',
            forCP:'CP',
            CustomerGroupID:this.customerDetailData.customerGroupID,
            CustomerGroupName:this.customerDetailData.customerGroup
          }
      });
      dialogRef.afterClosed().subscribe(res => {
        // received data from dialog-component
        // this.InitBooker();
        // this.InitPassenger();
      })
    }
    }
    
  }

  AddSpots()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
      {
        data: 
          {           
            action: 'add'
          }
      });
      dialogRef.afterClosed().subscribe(res => {
          this.InitPickupSpot();
      })
  }

  clearCitySelection() {
    this.selectedCity = null;
    this.advanceTableForm.controls["pickupSpot"].setValue('');
    this.advanceTableForm.controls["pickupSpotID"].setValue(0);  
    this.InitPickupSpot();     
  }

  clearCitySelectionForDropOff() {
    this.selectedCity = null;
    this.advanceTableForm.controls["dropOffSpot"].setValue('');
    this.advanceTableForm.controls["dropOffSpotID"].setValue(0);  
    this.InitDropOffSpot();     
  }

  CityBasedSpots()
  {
    const dialogRef = this.dialog.open(CityBasedSpotsComponent, 
      {
        data: 
          {           
            
          }
      });
      dialogRef.afterClosed().subscribe(res => {
          this.selectedCity=res;
          this.InitPickupSpot();
      })
  }

  CityBasedSpotsForDropOff()
  {
    const dialogRef = this.dialog.open(CityBasedSpotsComponent, 
      {
        data: 
          {           
            
          }
      });
      dialogRef.afterClosed().subscribe(res => {
          this.selectedCity=res;
          this.InitDropOffSpot();
      })
  }

  AddDropOffSpots()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
      {
        data: 
          {
            action: 'add'
          }
      });
      dialogRef.afterClosed().subscribe(res => {
          this.InitDropOffSpot();
      })
  }

  addPassengers()
  {
    const dialogRef = this.dialog.open(FormDialogAddPassengersComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
      });
  }
  dropOffSavedAddress()
  {
    if(this.action==='edit')
    {
      let passenger=this.advanceTableForm.value.passenger.split('-')[0];
      if(this.passengerID || this.advanceTableForm.value.primaryPassengerID){
        const dialogRef = this.dialog.open(SavedAddressComponent, 
          {
            width:'60%',
            data: 
              {
                // advanceTable: this.advanceTable,
                // action: 'add'
                PassengerID:this.passengerID || this.advanceTableForm.value.primaryPassengerID,
                PassengerName:this.passengerName || passenger
              }
          });
          dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            if(res!==undefined)
            {
            this.advanceTableForm.patchValue({dropOffAddress:res.data.addressStringForMap});
            this.advanceTableForm.patchValue({dropOffAddressDetails:res.data.address});
            this.advanceTableForm.patchValue({dropOffCity:res.data.city});
            this.advanceTableForm.patchValue({dropOffCityID:res.data.cityID});
            this.advanceTableForm.controls["dropOffSpotType"].setValue('');
            this.advanceTableForm.controls["dropOffSpotTypeID"].setValue(0);
            this.advanceTableForm.controls["dropOffSpotID"].setValue(0);
            this.advanceTableForm.controls["dropOffSpot"].setValue('');
            }
          })
        }
    }
    else
    {
      if(this.passengerID){
        const dialogRef = this.dialog.open(SavedAddressComponent, 
          {
            width:'60%',
            data: 
              {
                // advanceTable: this.advanceTable,
                // action: 'add'
                PassengerID:this.passengerID,
                PassengerName:this.passengerName
              }
          });
          dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            if(res!==undefined)
            {
            this.advanceTableForm.patchValue({dropOffAddress:res.data.addressStringForMap});
            this.advanceTableForm.patchValue({dropOffAddressDetails:res.data.address});
            this.advanceTableForm.patchValue({dropOffCity:res.data.city});
            this.advanceTableForm.patchValue({dropOffCityID:res.data.cityID});
            this.advanceTableForm.controls["dropOffSpotType"].setValue('');
            this.advanceTableForm.controls["dropOffSpotTypeID"].setValue(0);
            this.advanceTableForm.controls["dropOffSpotID"].setValue(0);
            this.advanceTableForm.controls["dropOffSpot"].setValue('');
            }
          })
        }
    }
  }
  savedAddress()
  {
    if(this.action==='edit')
    {
      let passenger=this.advanceTableForm.value.passenger.split('-')[0];
      if(this.passengerID || this.advanceTableForm.value.primaryPassengerID){
        const dialogRef = this.dialog.open(SavedAddressComponent, 
          {
            width:'60%',
            data: 
              {
                // advanceTable: this.advanceTable,
                // action: 'add'
    
                PassengerID:this.passengerID || this.advanceTableForm.value.primaryPassengerID,
                PassengerName:this.passengerName || passenger
              }
          });
          dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
          
            if(res!==undefined)
            {
          const selectedCity = res.data.city;
          const savedCity = this.advanceTableForm.value.pickupCity;
            if (savedCity  !== selectedCity) {
            Swal.fire({
              title: 'Pickup City Mismatch',
              html: `Saved City: <b>${savedCity}</b> <br/> Selected City: <b>${selectedCity}</b> <br/><br/>Do you want to continue?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, continue',
              cancelButtonText: 'No, cancel'
            }).then(result => {
              if (result.isConfirmed) {
                this.advanceTableForm.patchValue({pickupAddress:res.data.addressStringForMap});
              }
            });
          } else {
            this.patchPickupAddress(res)
          }
           
            // this.advanceTableForm.patchValue({pickupAddressDetails:res.data.address});
            // this.advanceTableForm.patchValue({pickupCity:res.data.city});
            // this.advanceTableForm.patchValue({pickupCityID:res.data.cityID});
            // this.advanceTableForm.controls["pickupSpotType"].setValue('');
            // this.advanceTableForm.controls["pickupSpotTypeID"].setValue(0);
            // this.advanceTableForm.controls["pickupSpotID"].setValue(0);
            // this.advanceTableForm.controls["pickupSpot"].setValue('');
            }
    
          })
        }
    }
    else
    {
      if(this.passengerID){
        const dialogRef = this.dialog.open(SavedAddressComponent, 
          {
            width:'60%',
            data: 
              {
                // advanceTable: this.advanceTable,
                // action: 'add'
    
                PassengerID:this.passengerID,
                PassengerName:this.passengerName
              }
          });
          dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            if(res!==undefined)
            {
          const selectedCity = res.data.city;
          const savedCity = this.advanceTableForm.value.pickupCity;
            if (savedCity  !== selectedCity) {
            Swal.fire({
              title: 'Pickup City Mismatch',
              html: `Saved City: <b>${savedCity}</b> <br/> Selected City: <b>${selectedCity}</b> <br/><br/>Do you want to continue?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, continue',
              cancelButtonText: 'No, cancel'
            }).then(result => {
              if (result.isConfirmed) {
                this.advanceTableForm.patchValue({pickupAddress:res.data.addressStringForMap});
              }
            });
          } else {
            this.patchPickupAddress(res)
          }
           
            // this.advanceTableForm.patchValue({pickupAddress:res.data.addressStringForMap});
            // this.advanceTableForm.patchValue({pickupAddressDetails:res.data.address});
            // this.advanceTableForm.patchValue({pickupCity:res.data.city});
            // this.advanceTableForm.patchValue({pickupCityID:res.data.cityID});
            // this.advanceTableForm.controls["pickupSpotType"].setValue('');
            // this.advanceTableForm.controls["pickupSpotTypeID"].setValue(0);
            // this.advanceTableForm.controls["pickupSpotID"].setValue(0);
            // this.advanceTableForm.controls["pickupSpot"].setValue('');
            }
    
          })
        }
    }
    
  }
private patchPickupAddress(res: any) {
  this.advanceTableForm.patchValue({
    pickupAddress: res.data.addressStringForMap,
    pickupAddressDetails: res.data.address,
    pickupCity: res.data.city,
    pickupCityID: res.data.cityID
  });
  this.advanceTableForm.controls['pickupSpotType'].setValue('');
  this.advanceTableForm.controls['pickupSpotTypeID'].setValue(0);
  this.advanceTableForm.controls['pickupSpotID'].setValue(0);
  this.advanceTableForm.controls['pickupSpot'].setValue('');
}
  onPickupDateChangeAndLocationTimeSet(event: any) 
  {
    this.onPickupDateChange(event);
    this.locationTimeSet(event);
    this.SetDropOffDate();
  }

  GetIntervalMin() 
  {
    this.reservationService.getIntervalMin(this.customerID).subscribe(
      (data) => {
        this.locationOutIntervalInMinutes = data;        
      },
      (error: HttpErrorResponse) => {
        this.locationOutIntervalInMinutes = null;
      }
    );
  }

  locationTimeSet(event)
  {
    if(this.action==='edit')
    {
      if( this.locationOutIntervalInMinutes !== 0)
      {
        const pickupDate = new Date(this.advanceTableForm.value.pickupDate);
        const eventTime = new Date(this.advanceTableForm.value.pickupTime);
        const combinedDateTime = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate(), eventTime.getHours(), eventTime.getMinutes());
        combinedDateTime.setMinutes(combinedDateTime.getMinutes() - this.locationOutIntervalInMinutes);
        const locOutDateTime=new Date(combinedDateTime);
        this.advanceTableForm.patchValue({locationOutDate:locOutDateTime});
        this.advanceTableForm.patchValue({locationOutTime:locOutDateTime});
      }
      else
      {
        const pickupDate = new Date(this.advanceTableForm.value.pickupDate);
        const eventTime = new Date(this.advanceTableForm.value.pickupTime);
        const combinedDateTime = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate(), eventTime.getHours(), eventTime.getMinutes());
        combinedDateTime.setMinutes(combinedDateTime.getMinutes() - 90);
        const locOutDateTime=new Date(combinedDateTime);
        this.advanceTableForm.patchValue({locationOutDate:locOutDateTime});
        this.advanceTableForm.patchValue({locationOutTime:locOutDateTime});
      }  
      this.getETRDropOffTime();    
    }
    else
    {
      if( this.locationOutIntervalInMinutes !== 0)
      {
        const pickupDate = new Date(this.advanceTableForm.value.pickupDate);
        const eventTime = new Date(this.advanceTableForm.value.pickupTime);
        const combinedDateTime = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate(), eventTime.getHours(), eventTime.getMinutes());
        combinedDateTime.setMinutes(combinedDateTime.getMinutes() - this.locationOutIntervalInMinutes);
        const locOutDateTime=new Date(combinedDateTime);
        this.advanceTableForm.patchValue({locationOutDate:locOutDateTime});
        this.advanceTableForm.patchValue({locationOutTime:locOutDateTime});
      }
      else
      {
        const pickupDate = new Date(this.advanceTableForm.value.pickupDate);
        const eventTime = new Date(event.getTime());
        const combinedDateTime = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate(), eventTime.getHours(), eventTime.getMinutes());
        combinedDateTime.setMinutes(combinedDateTime.getMinutes() - 90);
        const locOutDateTime=new Date(combinedDateTime);        
        this.advanceTableForm.patchValue({locationOutDate:locOutDateTime});
        this.advanceTableForm.patchValue({locationOutTime:locOutDateTime});
      }
      this.getETRDropOffTime();
    } 
  }

  SetDropOffDate()
  {
    const pickupDate = new Date(this.advanceTableForm.value.pickupDate);
    const combinedDropOffDate = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate());
    const dropOffDate=new Date(combinedDropOffDate);
    this.advanceTableForm.patchValue({dropOffDate:dropOffDate});
    this.advanceTableForm.patchValue({etrDate:dropOffDate});
  }

  ETRDropoffDateSet(packageType:any)
  {
    if(packageType === 'Outstation Lumpsum Rate' || packageType === 'Outstation OneWay Trip Rate' || packageType === 'Outstation Round Trip Rate')
    {
      this.advanceTableForm.controls['dropOffDate'].setValue('');
      this.advanceTableForm.controls['etrDate'].setValue('');
      this.advanceTableForm.controls['dropOffTime'].setValue('');
      this.advanceTableForm.controls['etrTime'].setValue('');
    }
    else
    {
      const pickupDate = new Date(this.advanceTableForm.value.pickupDate);
      const combinedDropOffDate = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate());
      const dropOffDate=new Date(combinedDropOffDate);
      this.advanceTableForm.patchValue({dropOffDate:dropOffDate});
      this.advanceTableForm.patchValue({etrDate:dropOffDate});
    }
  }

  pickupCitySet(cityID:number,packageType:string)
  {  
    if(packageType === 'Local Rate') 
      {
        if(this.action==='edit')
          {
            const pickupCity = this.advanceTableForm.value.pickupCity;
            const pickupCityID = this.advanceTableForm.value.pickupCityID;
            this.advanceTableForm.patchValue({dropOffCityID:pickupCityID});
            this.advanceTableForm.patchValue({dropOffCity:pickupCity});
          }
          else
          {
            const pickupCity = this.advanceTableForm.value.pickupCity;
            //const pickupCityID = this.advanceTableForm.value.pickupCityID;
            this.advanceTableForm.patchValue({dropOffCityID:cityID});
            this.advanceTableForm.patchValue({dropOffCity:pickupCity});
          } 
      }  
  }

  getCityIDByName(name: string) {
    let data = this._generalService.GetCityID(name);
    //this.cityID = data.cityID;
    this.cityID=parseInt(data.cityID)
    this.advanceTableForm.patchValue({pickupCityID:this.cityID})
    this.advanceTableForm.patchValue({dropOffCityID:this.cityID})
  }

  getCityIDByNameForDropOff(name: string) {
    let data = this._generalService.GetCityID(name);
    this.dropOffcityID = parseInt(data.cityID);
    this.advanceTableForm.patchValue({dropOffCityID:this.dropOffcityID})
  }
  
  valueSwitch(){  
       
    if(this.advanceTableForm.value.googleAddresses===true)
    {
      this.ifBlock=false;
      this.advanceTableForm.controls["pickupAddress"].setValue('');
      // this.advanceTableForm.controls["pickupSpotType"].setValue('');
      //   this.advanceTableForm.controls["pickupSpotTypeID"].setValue(0);
      //   this.advanceTableForm.controls["pickupSpotID"].setValue(0);
      //   this.advanceTableForm.controls["pickupSpot"].setValue('');
    }
    if(this.advanceTableForm.value.googleAddresses===false)
    {
      this.ifBlock=true;
      this.advanceTableForm.controls["pickupAddress"].setValue('');
      // this.advanceTableForm.controls["pickupSpotType"].setValue('');
      //   this.advanceTableForm.controls["pickupSpotTypeID"].setValue(0);
      //   this.advanceTableForm.controls["pickupSpotID"].setValue(0);
      //   this.advanceTableForm.controls["pickupSpot"].setValue('');
    }
  }

  dropOffControlSwitch(){
    if(this.advanceTableForm.value.googleAdressesDropOff===true)
    {
      this.dropOffifBlock=false;
      this.advanceTableForm.controls["dropOffAddress"].setValue('');
      // this.advanceTableForm.controls["dropOffSpotType"].setValue('');
      // this.advanceTableForm.controls["dropOffSpotTypeID"].setValue(0);
      // this.advanceTableForm.controls["dropOffSpotID"].setValue(0);
      // this.advanceTableForm.controls["dropOffSpot"].setValue('');
    }
    if(this.advanceTableForm.value.googleAdressesDropOff===false)
    {
      this.dropOffifBlock=true;
      this.advanceTableForm.controls["dropOffAddress"].setValue('');
      // this.advanceTableForm.controls["dropOffSpotType"].setValue('');
      // this.advanceTableForm.controls["dropOffSpotTypeID"].setValue(0);
      // this.advanceTableForm.controls["dropOffSpotID"].setValue(0);
      // this.advanceTableForm.controls["dropOffSpot"].setValue('');
    }

  }


  emailInfo() 
  {
    this.dialog.open(EmailInfoComponent, {
    data: {
        reservationID: this.ReservationID
      }
    });
  }

  // onPickupDateChange(event)
  // {
  //   var endDate=moment(event).format('yyyy-MM-DD');
  //   if(this.action==='edit')
  //   {
  //     this._generalService.GetContractIDBasedOnDate(this.advanceTable.customerID,endDate).subscribe(
  //       data=>
  //       {
  //         this.contractID=data;
  //         this.InitPackage();
  //          this.InitCity();
  //          this.InitDropOffCity();
  //          this.InitVehicle();
  //       }
  //     );
  //   }
  //   else
  //   {
  //     this._generalService.GetContractIDBasedOnDate(this.customerID,endDate).subscribe(
  //       data=>
  //       {
  //         this.contractID=data;
  //         // this.InitCity();
  //         // this.InitDropOffCity();
  //       }
  //     );
  //   }

  // }

  onPickupDateChange(event: any) {
    var date = event.split('/');
    var endDate = date[2] + '-' + date[1] + '-' + date[0];
    // if (this.action === 'edit') {
    //   this._generalService.GetContractIDBasedOnDate(this.advanceTable.customerID, endDate).subscribe(
    //     data => {
    //       if (data) {
    //         this.contractID = data;
    //         this.noReservationMessage = false;
    //         this.InitPackageType();
    //         this.InitPackage();
    //         this.InitDropOffCity(this.packageType);
    //         this.InitVehicle(this.packageType);
    //       } 
    //       else
    //       {
    //         this.noReservationMessage = true;
    //         this.advanceTableForm.controls['packageTypeID'].setValue(0);
    //         this.advanceTableForm.controls['packageType'].setValue('');
    //         this.advanceTableForm.controls['packageID'].setValue(0);
    //         this.advanceTableForm.controls['package'].setValue('');
    //         this.advanceTableForm.controls['pickupCityID'].setValue(0);
    //         this.advanceTableForm.controls['pickupCity'].setValue('');
    //         this.advanceTableForm.controls['vehicleCategoryID'].setValue(0);
    //         this.advanceTableForm.controls['vehicle'].setValue('');
    //         this.advanceTableForm.controls['pickupAddress'].setValue('');
    //         this.advanceTableForm.controls['googleAddresses'].setValue('');
    //         this.advanceTableForm.controls['pickupAddressDetails'].setValue('');
    //         this.advanceTableForm.controls['pickupSpotTypeID'].setValue(0);
    //         this.advanceTableForm.controls['pickupSpotType'].setValue('');
    //         this.advanceTableForm.controls['pickupSpotID'].setValue(0);
    //         this.advanceTableForm.controls['pickupSpot'].setValue('');
    //         this.advanceTableForm.controls['locationOutDate'].setValue('');
    //         this.advanceTableForm.controls['locationOutTime'].setValue('');
    //         this.advanceTableForm.controls['serviceLocationID'].setValue(0);
    //         this.advanceTableForm.controls['serviceLocation'].setValue('');
    //         this.advanceTableForm.controls['dropOffDate'].setValue('');
    //         this.advanceTableForm.controls['dropOffTime'].setValue('');
    //         this.advanceTableForm.controls['etrDate'].setValue('');
    //         this.advanceTableForm.controls['etrTime'].setValue('');
    //         this.advanceTableForm.controls['dropOffCityID'].setValue(0);
    //         this.advanceTableForm.controls['dropOffCity'].setValue('');
    //         this.advanceTableForm.controls['dropOffAddress'].setValue('');
    //         this.advanceTableForm.controls['googleAdressesDropOff'].setValue('');
    //         this.advanceTableForm.controls['dropOffAddressDetails'].setValue('');
    //         this.advanceTableForm.controls['dropOffSpotTypeID'].setValue(0);
    //         this.advanceTableForm.controls['dropOffSpotType'].setValue('');
    //         this.advanceTableForm.controls['dropOffSpotID'].setValue(0);
    //         this.advanceTableForm.controls['dropOffSpot'].setValue('');
    //         this.advanceTableForm.controls['ticketNumber'].setValue('');
    //         this.advanceTableForm.controls['emailLink'].setValue('');
    //         this.advanceTableForm.controls['reservationSourceID'].setValue(0);
    //         this.advanceTableForm.controls['reservationSource'].setValue('');
    //         this.advanceTableForm.controls['reservationSourceDetail'].setValue('');
    //         this.advanceTableForm.controls['referenceNumber'].setValue('');
    //         this.advanceTableForm.controls['reservationStatus'].setValue('');
    //         this.advanceTableForm.controls['reservationStatusText'].setValue('');
    //         this.advanceTableForm.controls['reservationStatusDetails'].setValue('');
    //         this.advanceTableForm.controls['attachment'].setValue('');
    //         this.advanceTableForm.controls['projectCode'].setValue('');
    //         this.advanceTableForm.controls['modeOfPaymentID'].setValue(0);
    //         this.advanceTableForm.controls['modeOfPayment'].setValue('');
    //       }
    //     });
    // } 
    // else 
    // {
      this._generalService.GetContractIDBasedOnDate(this.advanceTableForm.value.customerID, endDate).subscribe(
        data => {
          if (data) 
          {
            this.contractID = data;
            this.noReservationMessage = false;
            // this.InitPackageType();
            // this.InitPackage();
            if(this.action ==='edit' && this.advanceTable && this.advanceTable.packageType)
            {
              this.advanceTable.packageType = this.advanceTable.packageType + " " + "Rate";
            }
            // In new-reservation mode `this.advanceTable` may still be null
            // before any contract/package selections exist; guard every access.
            const fallbackPackageType = this.packageType || (this.advanceTable && this.advanceTable.packageType) || '';
            // this.InitCity(fallbackPackageType);
            // this.InitDropOffCity(fallbackPackageType);
            // this.InitVehicle(fallbackPackageType);
            // Retry Drop-off Time calculation now that contractID is known.
            // In edit mode getETRDropOffTime() runs synchronously during
            // loadData() before this async contract lookup completes, so
            // the original call is aborted by the guard; trigger it again
            // here once all the inputs are finally available.
            this.getETRDropOffTime();
          } 
          else
          {
            this.noReservationMessage = true;
            this.advanceTableForm.controls['packageTypeID'].setValue(0);
            this.advanceTableForm.controls['packageType'].setValue('');
            this.advanceTableForm.controls['packageID'].setValue(0);
            this.advanceTableForm.controls['package'].setValue('');
            this.advanceTableForm.controls['pickupCityID'].setValue(0);
            this.advanceTableForm.controls['pickupCity'].setValue('');
            this.advanceTableForm.controls['vehicleCategoryID'].setValue(0);
            this.advanceTableForm.controls['vehicle'].setValue('');
            this.advanceTableForm.controls['pickupAddress'].setValue('');
            this.advanceTableForm.controls['googleAddresses'].setValue('');
            this.advanceTableForm.controls['serviceLocationBasedOnCity'].setValue('');
            this.advanceTableForm.controls['pickupAddressDetails'].setValue('');
            this.advanceTableForm.controls['pickupSpotTypeID'].setValue(0);
            this.advanceTableForm.controls['pickupSpotType'].setValue('');
            this.advanceTableForm.controls['pickupSpotID'].setValue(0);
            this.advanceTableForm.controls['pickupSpot'].setValue('');
            this.advanceTableForm.controls['locationOutDate'].setValue('');
            this.advanceTableForm.controls['locationOutTime'].setValue('');
            this.advanceTableForm.controls['serviceLocationID'].setValue(0);
            this.advanceTableForm.controls['serviceLocation'].setValue('');
            this.advanceTableForm.controls['dropOffDate'].setValue('');
            this.advanceTableForm.controls['dropOffTime'].setValue('');
            this.advanceTableForm.controls['etrDate'].setValue('');
            this.advanceTableForm.controls['etrTime'].setValue('');
            this.advanceTableForm.controls['dropOffCityID'].setValue(0);
            this.advanceTableForm.controls['dropOffCity'].setValue('');
            this.advanceTableForm.controls['dropOffAddress'].setValue('');
            this.advanceTableForm.controls['googleAdressesDropOff'].setValue('');
            this.advanceTableForm.controls['dropOffAddressDetails'].setValue('');
            this.advanceTableForm.controls['dropOffSpotTypeID'].setValue(0);
            this.advanceTableForm.controls['dropOffSpotType'].setValue('');
            this.advanceTableForm.controls['dropOffSpotID'].setValue(0);
            this.advanceTableForm.controls['dropOffSpot'].setValue('');
            this.advanceTableForm.controls['ticketNumber'].setValue('');
            this.advanceTableForm.controls['emailLink'].setValue('');
            this.advanceTableForm.controls['reservationSourceID'].setValue(0);
            this.advanceTableForm.controls['reservationSource'].setValue('');
            this.advanceTableForm.controls['reservationSourceDetail'].setValue('');
            this.advanceTableForm.controls['referenceNumber'].setValue('');
            this.advanceTableForm.controls['reservationStatus'].setValue('');
            this.advanceTableForm.controls['reservationStatusText'].setValue('');
            this.advanceTableForm.controls['reservationStatusDetails'].setValue('');
            this.advanceTableForm.controls['attachment'].setValue('');
            this.advanceTableForm.controls['projectCode'].setValue('');
            this.advanceTableForm.controls['modeOfPaymentID'].setValue(0);
            this.advanceTableForm.controls['modeOfPayment'].setValue('');
          }
        });
    
  }

  resetOtherFields() {
  this.advanceTableForm.patchValue({
    packageID: '',  
    package:'',
    pickupCityID: '',
    pickupCity: '',
    vehicleID: '',
    vehicle: '',
  });
}

  onPackageTypeChanges(event:any)
  {
    this.resetOtherFields();
    if(event.keyCode===8)
    {
      this.advanceTableForm.controls['packageID'].setValue('');
      this.advanceTableForm.controls['package'].setValue('');
      this.advanceTableForm.controls['pickupCityID'].setValue('');
      this.advanceTableForm.controls['pickupCity'].setValue('');
      this.advanceTableForm.controls['vehicleID'].setValue('');
      this.advanceTableForm.controls['vehicle'].setValue('');
      this.advanceTableForm.controls['dropOffCityID'].setValue('');
      this.advanceTableForm.controls['dropOffCity'].setValue('');
    }
  }

  onPackageChanges(event:any)
  {
    if(event.keyCode===8)
    {
      this.advanceTableForm.controls['pickupCityID'].setValue('');
      this.advanceTableForm.controls['pickupCity'].setValue('');
      this.advanceTableForm.controls['vehicle'].setValue('');
      this.advanceTableForm.controls['vehicleID'].setValue('');
    }
  }
 
  onKeyUp(event) {
    if (event.keyCode === 8) {
      this.advanceTableForm.controls['customerGroupID'].setValue('');
      this.advanceTableForm.controls['customerID'].setValue('');
      this.advanceTableForm.controls['customerCustomerGroup'].setValue('');
      this.advanceTableForm.controls['primaryBookerID'].setValue('');
      this.advanceTableForm.controls['booker'].setValue('');
      this.advanceTableForm.controls['primaryPassengerID'].setValue('');
      this.advanceTableForm.controls['passenger'].setValue('');
    }
  }

  onSpotTypeKeyUp(event) {
    if (event.keyCode === 8) {
      this.advanceTableForm.controls['pickupSpotTypeID'].setValue('');
      this.advanceTableForm.controls['pickupSpotID'].setValue('');
      this.advanceTableForm.controls['pickupSpotType'].setValue('');
      this.advanceTableForm.controls['pickupSpot'].setValue('');
    }
  }

  onCustomerTypeKeyUp(event) {
    if (event.keyCode === 8) {
      this.advanceTableForm.controls['customerTypeID'].setValue('');
      this.advanceTableForm.controls['customerType'].setValue('');
      this.advanceTableForm.controls['customerGroupID'].setValue('');
      this.advanceTableForm.controls['customerID'].setValue('');
      this.advanceTableForm.controls['customerCustomerGroup'].setValue('');
      this.advanceTableForm.controls['primaryBookerID'].setValue('');
      this.advanceTableForm.controls['booker'].setValue('');
      this.advanceTableForm.controls['primaryPassengerID'].setValue('');
      this.advanceTableForm.controls['passenger'].setValue('');
    }
  }
  onPickupAddressKeyUp(event) {
    if (event.keyCode === 8) {
      this.advanceTableForm.controls['pickupAddressDetails'].setValue('');
      this.advanceTableForm.controls['serviceLocationID'].setValue('');
      this.advanceTableForm.controls['serviceLocation'].setValue('');
    }
  }
  onDroffKeyUp(event) {
    if (event.keyCode === 8) {
      this.advanceTableForm.controls['dropOffAddress'].setValue('');
      this.advanceTableForm.controls['dropOffAddressDetails'].setValue('');
      this.advanceTableForm.controls['dropOffSpotTypeID'].setValue('');
      this.advanceTableForm.controls['dropOffSpotID'].setValue('');
      this.advanceTableForm.controls['dropOffSpotType'].setValue('');
      this.advanceTableForm.controls['dropOffSpot'].setValue('');
    }
  }
  onPickupCityKeyUp(event) {
    if (event.keyCode === 8) {
      this.advanceTableForm.controls['pickupCityID'].setValue('');
      this.advanceTableForm.controls['pickupCity'].setValue('');
      this.advanceTableForm.controls['vehicleID'].setValue('');
      this.advanceTableForm.controls['vehicle'].setValue('');
      this.advanceTableForm.controls['serviceLocationID'].setValue('');
      this.advanceTableForm.controls['serviceLocation'].setValue('');
    }
  }

  onCustomerConfigurationInvoicingKeyUp(event) {
    if (event.keyCode === 8) {
      this.advanceTableForm.controls['customerConfigurationInvoicingID'].setValue('');
    }
  }

  public confirmAdd(): void 
  {
       if(this.action=="edit")
       {
          this.PutForReservationEdit();
       }
       else
       {
          this.Put();
       }
  }

  InitCompanyForCustomer()
  {
    this._generalService.GetCompanyIDBasedOnCustomer(this.advanceTableForm.value.customerID || this.advanceTable.customerID).subscribe(
      data=>
        {
          this.ecoCompanyID=data;
          this.advanceTableForm.patchValue({ecoCompanyID:this.ecoCompanyID});
        }
    );
  }

  getReservationStatusLog()
  {
    this.reservationService.getReservationStatusLog(this.ReservationID).subscribe(
      data=>
        {
          this.advanceTableRSL=data;
          this.advanceTableForm.patchValue({reservationStatusText:this.advanceTableRSL.reservationStatusText});
          this.advanceTableForm.patchValue({reservationStatusDetails:this.advanceTableRSL.reservationStatusDetails});
          this.advanceTableForm.patchValue({reservationStatusChangedByID:this.advanceTableRSL.reservationStatusChangedByID});

        }
    );
  }

  // Parses a date value coming from the form in one of the many shapes
  // the page hands us (Date, ISO string, "DD/MM/YYYY", "DD-MM-YYYY",
  // "YYYY-MM-DD", etc.). Returns a moment or null if none match.
  private parseFlexibleDate(value: any): moment.Moment | null {
    if (value === null || value === undefined || value === '') { return null; }
    if (value instanceof Date) {
      const m = moment(value);
      return m.isValid() ? m : null;
    }
    const candidates = [
      moment.ISO_8601,
      'YYYY-MM-DDTHH:mm:ss',
      'YYYY-MM-DDTHH:mm:ss.SSSZ',
      'YYYY-MM-DD',
      'DD/MM/YYYY',
      'DD-MM-YYYY',
      'MM/DD/YYYY',
    ];
    const m = moment(value, candidates as any, true);
    if (m.isValid()) { return m; }
    const loose = moment(value);
    return loose.isValid() ? loose : null;
  }

  // Parses a time value in any shape we've seen on the page (Date, ISO
  // datetime, "HH:mm", "HH:mm:ss", "h:mm A"). Returns a moment or null.
  private parseFlexibleTime(value: any): moment.Moment | null {
    if (value === null || value === undefined || value === '') { return null; }
    if (value instanceof Date) {
      const m = moment(value);
      return m.isValid() ? m : null;
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
    const m = moment(value, candidates as any, true);
    if (m.isValid()) { return m; }
    const loose = moment(value);
    return loose.isValid() ? loose : null;
  }

  // Best-effort client-side drop-off computation. Reads the selected
  // package label (e.g. "4 Hrs /40 Kms", "8 Hrs 80 Kms", "12 hr") and,
  // if it contains a usable hour count, sets Drop-off Date / Drop-off
  // Time / ETR Time = Pickup + hours. No-op when any required piece is
  // missing so we never stamp garbage into the form.
  private applyLocalPackageDropOff(pickupDateMoment: moment.Moment | null, pickupTimeMoment: moment.Moment | null): void {
    if (!pickupDateMoment || !pickupDateMoment.isValid()) { return; }
    if (!pickupTimeMoment || !pickupTimeMoment.isValid()) { return; }

    const packageLabel: string = this.advanceTableForm.value.package
      || (this.advanceTable && (this.advanceTable as any).package)
      || '';
    const hours = this.extractPackageHours(packageLabel);
    if (!hours) { return; }

    // Some package types (on-demand / long-term / outstation variants)
    // deliberately leave drop-off blank on the server side. Respect that
    // if we can detect it locally from the packageType label.
    const packageType: string = this.advanceTableForm.value.packageType
      || (this.advanceTable && (this.advanceTable as any).packageType)
      || '';
    const blankTypes = ['Local On Demand', 'Long Term Rental', 'Outstation Lumpsum', 'Outstation OneWay Trip', 'Outstation Round Trip'];
    if (blankTypes.some(t => packageType.toLowerCase().includes(t.toLowerCase()))) {
      return;
    }

    const combined = moment({
      year: pickupDateMoment.year(),
      month: pickupDateMoment.month(),
      day: pickupDateMoment.date(),
      hour: pickupTimeMoment.hour(),
      minute: pickupTimeMoment.minute(),
    });
    if (!combined.isValid()) { return; }

    const dropOff = combined.clone().add(hours, 'hours');
    const dropOffDateStr = dropOff.format('YYYY-MM-DD');

    this.advanceTableForm.patchValue({ dropOffDate: dropOffDateStr });
    this.advanceTableForm.patchValue({ dropOffTime: dropOff.toDate() });
    this.advanceTableForm.patchValue({ etrTime: dropOff.toDate() });
  }

  // Extracts the hour count from a package label. Handles shapes like
  // "4 Hrs /40 Kms", "8 Hrs", "12hr", "24 Hours" - returns null if none.
  private extractPackageHours(label: string): number | null {
    if (!label) { return null; }
    const match = label.match(/(\d+(?:\.\d+)?)\s*(?:hrs?|hours?|h)\b/i);
    if (!match) { return null; }
    const hours = parseFloat(match[1]);
    return isNaN(hours) || hours <= 0 ? null : hours;
  }

  getETRDropOffTime()
  {
    // Prefer live form values, then local state, then the loaded reservation
    // record (edit mode). This lets the call succeed whether the user is
    // editing an existing reservation or filling a fresh one, in any order.
    const av: any = this.advanceTable || {};
    var packageID = this.advanceTableForm.value.packageID || this.packageID || av.packageID;
    var contractID = this.advanceTableForm.value.contractID || this.contractID || av.contractID;
    var vehicleID = this.advanceTableForm.value.vehicleID || this.vehicleID || av.vehicleID;
    var cityID = this.advanceTableForm.value.pickupCityID || this.cityID || av.pickupCityID;

    // `pickupDate` / `pickupTime` can arrive as Date objects (from the Owl
    // date-time picker), ISO strings, "DD/MM/YYYY" strings, or "HH:mm"
    // strings depending on edit vs. new flow. moment(...) with no format
    // silently returns "Invalid date" for anything non-ISO, which would
    // still satisfy a truthy check -> the URL gets "Invalid%20date" in a
    // path segment and the backend returns 400. Parse safely instead.
    const rawPickupDate = this.advanceTableForm.value.pickupDate ?? av.pickupDate;
    const rawPickupTime = this.advanceTableForm.value.pickupTime ?? av.pickupTime;

    const pickupDateMoment = this.parseFlexibleDate(rawPickupDate);
    const pickupTimeMoment = this.parseFlexibleTime(rawPickupTime);

    const pickupDate = pickupDateMoment && pickupDateMoment.isValid()
      ? pickupDateMoment.format('DD-MM-YYYY')
      : null;
    const pickupTime = pickupTimeMoment && pickupTimeMoment.isValid()
      ? pickupTimeMoment.format('HH:mm')
      : null;

    // Guard: the backend URL is a path-parameter style, so any undefined /
    // empty value would be serialised as the literal string "undefined" and
    // cause the request to fail silently, leaving the Drop-off Time field
    // blank. If the server call isn't possible yet, fall back to a purely
    // client-side "pickup + package duration" computation so the field
    // isn't left empty while the user is still filling the form.
    if (!packageID || !contractID || !vehicleID || !cityID || !pickupTime || !pickupDate) {
      this.applyLocalPackageDropOff(pickupDateMoment, pickupTimeMoment);
      return;
    }

    // Pre-fill drop-off locally from the package hours so the field is never
    // empty while waiting for the API, and to cover the case where the API
    // itself returns nothing meaningful for this combo.
    this.applyLocalPackageDropOff(pickupDateMoment, pickupTimeMoment);

    this.reservationService.getTimeForDropoffTime(packageID,pickupTime,pickupDate,contractID,vehicleID,cityID).subscribe(
    (data:any)=>
    {
      if (!data) { return; }
      if(data.packageType === 'Local On Demand' || data.packageType === 'Long Term Rental' || data.packageType === 'Outstation Lumpsum' || data.packageType === 'Outstation OneWay Trip' || data.packageType === 'Outstation Round Trip')
      {
        this.advanceTableForm.controls['dropOffTime'].setValue('');
        this.advanceTableForm.controls['etrTime'].setValue('');
      }
      else
      {
        var timeBasedOnPackage = data.dropOffTime;
        var DropOffDate = data.dropOffDate;
        if (DropOffDate) {
          this.advanceTableForm.patchValue({dropOffDate:DropOffDate});
        }

        if (timeBasedOnPackage) {
          const parsed = moment(timeBasedOnPackage, 'HH:mm');
          if (parsed.isValid()) {
            this.advanceTableForm.patchValue({dropOffTime: parsed.toDate()});
          }
        }

        var etrTime = data.etrTime;
        if (etrTime) {
          const parsedEtr = moment(etrTime, 'HH:mm');
          if (parsedEtr.isValid()) {
            this.advanceTableForm.patchValue({etrTime: parsedEtr.toDate()});
          }
        }
      }
    },
    (err: any) => {
      console.warn('[reservation] getETRDropOffTime failed', err);
    });
  }

  openAddStops()
 {
   const dialogRef = this.dialog.open(FormDialogReservationStopDetailsComponent, 
    {
      width:'50%',
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          reservationID:this.ReservationID,
        }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.emitEventToChild();
    });
 }

 emitEventToChild() 
  {
    this.eventsSubject.next(true);
  }

ShowDataForStops()
 {
  if(this.action === 'edit')
  {
    const dialogRef = this.dialog.open(StopDetailsShowComponent, 
      {
        width:'50%',
        data: 
          {
            reservationID:this.ReservationID,
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        this.emitEventToChild();
      });
   }
   else
   {
    const dialogRef = this.dialog.open(StopDetailsShowComponent, 
      {
        width:'50%',
        data: 
          {
            reservationID:this.reservationID,
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        this.emitEventToChild();
      });
    }
   }

   onDatepickerChange(event: any): void {
    const inputElement = event.targetElement;
    if (inputElement) {
      this.onBlurUpdateDate({ target: inputElement});
    }
  }

   onBlurUpdateDate(event: any): void {
     //let value= this._generalService.resetDateiflessthan12(event.target.value);
     let value = event.target.value;
  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('pickupDate')?.setValue(formattedDate);    
  } else {
    this.advanceTableForm.get('pickupDate')?.setErrors({ invalidDate: true });
  }
  this.onPickupDateChangeAndLocationTimeSet(value);
  this.pickupDate = value;
  this.GetReservationCapping(this.customerGroupID,this.customerID,this.pickupDate,this.cityID,this.packageTypeID,this.vehicleCategoryID);
}

onBlurUpdateDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    if(this.action==='edit')
    {
      this.advanceTable.pickupDate=formattedDate
    }
    else{
      this.advanceTableForm.get('pickupDate')?.setValue(formattedDate);
    }
    
  } else {
    this.advanceTableForm.get('pickupDate')?.setErrors({ invalidDate: true });
  }
}

onTimeInput(event: any): void {
  const inputValue = event.target.value;
  const parsedTime = new Date(`1970-01-01T${inputValue}`);
  if (!isNaN(parsedTime.getTime())) {
      this.advanceTableForm.get('pickupTime').setValue(parsedTime);
  }
  this.locationTimeSet(this.advanceTableForm.value.pickupTime);
}

  getDataForReservation()
  {
    this.reservationService.getDataForReservation(this.reservationID).subscribe(
      data=>
        {
          this.dataForReservationList=data;
          this.customerGroupID=this.dataForReservationList.customerGroupID;
          this.customerGroup=this.dataForReservationList.customerGroup;
          this.customerID=this.dataForReservationList.customerID;
          this.customer=this.dataForReservationList.customerName;
          this.customerTypeID=this.dataForReservationList.customerTypeID;
          this.customerType=this.dataForReservationList.customerType;
          this.primaryBookerID=this.dataForReservationList.primaryBookerID;
          this.primaryBooker=this.dataForReservationList.primaryBooker;
          this.gender=this.dataForReservationList.gender;
          this.importance=this.dataForReservationList.importance;
          this.phone=this.dataForReservationList.phone;
          this.customerDepartment=this.dataForReservationList.customerDepartment;
          this.customerDesignation=this.dataForReservationList.customerDesignation;
          this.customerForBooker=this.dataForReservationList.customerForBooker;
          this.customerDetailData={customerGroup:this.customerGroup,customerGroupID:this.customerGroupID,
            customerID:this.customerID,customerName:this.customer}
          this.advanceTableForm.patchValue({customerTypeID:this.customerTypeID});
          this.advanceTableForm.patchValue({customerType:this.customerType});
          this.advanceTableForm.patchValue({customerID:this.customerID});
          this.advanceTableForm.patchValue({customerGroupID:this.customerGroupID});
          this.advanceTableForm.patchValue({customerCustomerGroup:this.customer+'-'+this.customerGroup});
          this.advanceTableForm.patchValue({primaryBookerID:this.primaryBookerID});
          this.advanceTableForm.patchValue({booker:this.primaryBooker+'-'+this.gender+'-'+this.importance+'-'+this.phone+'-'+this.customerDepartment+'-'+this.customerDesignation+'-'+this.customerForBooker});
          this.InitCompanyForCustomer();
          // this.InitBooker();
          // this.InitPassenger();
          this.InitProjectCode();
          this.GetIsGSTMandatoryWithResrvation(this.customerGroupID);
          // this.InitReservationInvoiceGSTDetails( this.customerID);
          this.GetReservationCapping(this.customerGroupID,this.customerID,this.pickupDate,this.cityID,this.packageTypeID,this.vehicleCategoryID);
          this.getETRDropOffTime();
        }
    );
  }

  showError(controlName: string): boolean {
    const control = this.advanceTableForm.get(controlName);
    return control?.hasError('required') && (control.touched || control.dirty);
  }

  //---------- Reservation Capping ----------
  public GetReservationCapping(customerGroupID,customerID,pickupDate,cityID,packageTypeID,vehicleCategoryID)
  {
    // All 6 params are path segments; any missing value produces URLs like
    // /CheckReservationCapping/4616/9/Invalid%20date/undefined/... and 400s.
    if (!customerGroupID || !customerID || !pickupDate || !cityID || !packageTypeID || !vehicleCategoryID) {
      return;
    }
    const formattedDate = moment(pickupDate, "DD/MM/YYYY");
    if (!formattedDate.isValid()) { return; }
    pickupDate = formattedDate.format("YYYY-MM-DD");
    this.reservationService.getReservationCapping(customerGroupID,customerID,pickupDate,cityID,packageTypeID,vehicleCategoryID).subscribe(
      (data: any) =>   
      {
        if (data) 
        {
          this.bookingCount = data.bookingCount;
          this.cap = data.cap;
          if((this.bookingCount >= this.cap) && (this.bookingCount != 0) && (this.cap != null && this.cap != 0)) 
          {
            Swal.fire({
              title: '',
              text: `The maximum booking limit ${this.bookingCount} for ${this.customer} is exhausted.`,
              icon: 'warning',
            });
            return false;
          }
          return true;
          // if((this.bookingCount > this.cap) && (this.bookingCount != 0) && (this.cap != null && this.cap != 0))
          // {
          //   this.CapMessageShow = true;
          //   this.CapMessage = "You have exceeded your booking limit.";
          // }
          // else
          // {
          //   this.CapMessageShow = false;
          // }
        }
        else 
        {
        }
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  //--------------------GST For Billing------------------

  onCustomerConfigurationUp(customerID){
     const resolvedCustomerID = customerID || this.customerID || this.advanceTableForm.value.customerID;
     var Prefix = this.advanceTableForm.get("gSTForBilling").value;
      if(Prefix.length < 3)
      { 
        this.ConfigurationInvoicingList = [];
        return;
      }

    if (!resolvedCustomerID) { return; }
    this.reservationService.GetResrvationGSTDetails(resolvedCustomerID,Prefix).subscribe(
      data=>
      {
        this.ConfigurationInvoicingList=data;
        if(this.isGSTMandatoryWithReservation === true)
        {
          this.advanceTableForm.controls['gSTForBilling'].setValidators([Validators.required,this.GSTMandatoryValidator(this.ConfigurationInvoicingList)]);
          this.advanceTableForm.controls['gSTForBilling'].updateValueAndValidity();
        }
        else if(this.isGSTMandatoryWithReservation === false)
        {
          this.advanceTableForm.controls['gSTForBilling'].setValidators([this.GSTNonMandatoryValidator(this.ConfigurationInvoicingList)]);
        }        
        this.filteredConfigurationInvoicingOptions = this.advanceTableForm.controls['gSTForBilling'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterReservationInvoiceGSTDetails(value || ''))
        ); 
      });
  }
  InitResrvationGSTForCityID(customerID,pickuCityID)
  {
    // Skip until both IDs are known; otherwise the URL gets "undefined"
    // segments (e.g. /GetResrvationGSTForCityID/9/undefined) and backend 400s.
    if (!customerID || !pickuCityID) { return; }
    this.reservationService.GetResrvationGSTForCityID(customerID,pickuCityID).subscribe(
      data=>
      {
        if (!data || !data.length) { return; }
        this.advanceTableForm.patchValue({gSTForBilling:(data[0].gstNumber +'-'+ data[0].gstRate  +'-'+data[0].billingStateName) || "--Select--"});
        this.advanceTableForm.patchValue({customerConfigurationInvoicingID:data[0].customerConfigurationInvoicingID});
      });
  }
  
  private _filterReservationInvoiceGSTDetails(value: string): any {
    const filterValue = value.toLowerCase();
    return this.ConfigurationInvoicingList?.filter(
      customer => 
      {
        return customer.gstNumber.toLowerCase().includes(filterValue) || customer.gstRate.toLowerCase().includes(filterValue) || customer.billingStateName.toLowerCase().includes(filterValue)
      }
    );
  }

  GSTMandatoryValidator(ConfigurationInvoicingList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = ConfigurationInvoicingList.some(group => (group.gstNumber + '-' + group.gstRate + '-' + group.billingStateName ).toLowerCase() === value);
      return match ? null : { gSTMandatoryForBillingInvaild: true };
    };
  }

  GSTNonMandatoryValidator(ConfigurationInvoicingList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = ConfigurationInvoicingList.some(group => (group.gstNumber + '-' + group.gstRate + '-' + group.billingStateName ).toLowerCase() === value);
      return match ? null : { gSTNonMandatoryForBillingInvaild: true };
    };
  }
  
  onReservationInvoiceGSTSelected(selectedRGName: string) {
    const selectedPM = this.ConfigurationInvoicingList.find(
      data => data.gstNumber +'-'+
      data.gstRate +'-'+
      data.billingStateName === selectedRGName
);
    if (selectedPM) {
      this.getReservationInvoiceGSTDetailsID(selectedPM.customerConfigurationInvoicingID);
    }
  }

  getReservationInvoiceGSTDetailsID(customerConfigurationInvoicingID: any) {
    this.customerConfigurationInvoicingID=customerConfigurationInvoicingID;
    this.advanceTableForm.patchValue({customerConfigurationInvoicingID:this.customerConfigurationInvoicingID});
  }
 //---------------IS GST Mandatory With Reservation------------
 GetIsGSTMandatoryWithResrvation(customerGroupID:any)
 {
  // Skip when no customer group is known yet (new reservation on load);
  // otherwise the URL ends in "undefined" and the backend returns 400.
  if (!customerGroupID) { return; }
  this.reservationService.GetIsGSTMandatoryWithResrvation(customerGroupID).subscribe(
    data=>
    {
      this.isGSTMandatoryWithReservation = data ? data.isGSTMandatoryWithReservation : false;
    });
}

 //---------------Reservation GST Details------------
 getReservationGSTData(){
  // Skip when no reservation is selected (new reservation flow) to avoid
  // /getReservationGSTData/undefined 400s on page load.
  if (!this.ReservationID) { return; }
  this.reservationService.getReservationGSTData(this.ReservationID).subscribe(
    data=>
    {
      this.reservationDataSource = data || [];
      this.advanceTable = this.reservationDataSource[0];
      if (!this.advanceTable) { return; }
      let gstValue = "--Select--";
      if (this.advanceTable?.gstNumber && this.advanceTable?.gstRate && this.advanceTable?.billingStateName)
      {
        gstValue = `${this.advanceTable.gstNumber}-${this.advanceTable.gstRate}-${this.advanceTable.billingStateName}`;
      }
      this.advanceTableForm.patchValue({gSTForBilling:gstValue});
      this.advanceTableForm.patchValue({customerConfigurationInvoicingID:this.advanceTable.customerConfigurationInvoicingID});
    });
}
 onNumberInput(event: any) {
  const input = event.target.value.replace(/[^0-9]/g, ''); // keep only digits
  this.advanceTableForm.get('ticketNumber')?.setValue(input, { emitEvent: false });
}

//---------- Special Instruction ----------
openSpecialInstrucation()
{
  const dialogRef = this.dialog.open(SpecialInstructionDialogComponent, 
  {
    width:'520px',
    data: 
    {
      advanceTable: this.advanceTable,
      action: 'add',
      reservationID:this.ReservationID,
      status: this.status
    }
  });
  dialogRef.afterClosed().subscribe((res: any) => {
    if(res !== undefined)
    {
      // Refresh special instructions data instead of calling ngOnInit
      this.getInstrucationDetails();
      this.emitEventToChild();
    }
  });
}

  public getInstrucationDetails() 
  {
     // Skip when no reservation is selected yet; otherwise
     // /ForSpecialInstructionLoadData/undefined hits the backend and 400s.
     if (!this.ReservationID) { return; }
     this.specialInstructionDetailsService.getspecialInstructionDetails(this.ReservationID).subscribe
     (
       (data: SpecialInstructionDetails)=>   
       {
        if(data != null){
          this.showHideSpecialInst = true;
        }
         this.advanceTableSI = data;
       },
       (error: HttpErrorResponse) => { this.advanceTableSI = null;}
     );
 }
  getOuput(booleanValue: boolean) {
    if(booleanValue) {
      this.loadData();
    }
  }
//---------- Internal Note ----------
InternalNote()
{
  const dialogRef = this.dialog.open(InternalNoteDialogComponent, 
  {
    width:'400px',
    data: 
    {
      //advanceTable: this.advanceTable,
      reservationID:this.ReservationID,
      status: this.status
    }
  });
  dialogRef.afterClosed().subscribe((res: any) => {
    // Load data after dialog is closed to refresh the internal notes
    this.internalNoteLoadData();
  });
}
 public internalNoteLoadData() 
  {
    // Only load data if we have a valid ReservationID
    if (!this.ReservationID) {
      return;
    }

     this.internalNoteDetailsService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
   (
    
     (data :InternalNoteDetails)=>   
     {
      if(data !== null && Array.isArray(data) && data.length > 0)
      {
        this.showHideInternalNote = true;
      }
      else if(data !== null && !Array.isArray(data))
      {
        // If it's a single object, still show the card
        this.showHideInternalNote = true;
      }
      else 
      {
        this.showHideInternalNote = false;
      }
       this.advanceTableIN = data;
     },
     
     (error: HttpErrorResponse) => { 
       console.error('Error loading internal notes:', error);
       this.advanceTableIN = null;
       this.showHideInternalNote = false;
     }
   );
 }

//---------- Settled Rate ----------
 
 settledRates()
 {
  this.settleRateService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
  (
    (dataSRD :SettledRateDetails)=>   
    {
      if(dataSRD !== null)
      {
        this.advanceTableSRD = dataSRD;
        const dialogRef = this.dialog.open(FormDialogSRDComponent, 
        {
          data: 
          {
            reservationID:this.ReservationID,
            advanceTable:this.advanceTableSRD[0],
            action: 'edit',
            status: this.status
          }
        });
        dialogRef.afterClosed().subscribe((res: any) => {
          this.settledRateLoadData();
          //this.ngOnInit();
        })
      }
      else
      {
        const dialogRef = this.dialog.open(FormDialogSRDComponent, 
        {
          data: 
          {
            reservationID:this.ReservationID,
            action: 'add',
            status: this.status
          }
        });
        dialogRef.afterClosed().subscribe((res: any) => {
          this.settledRateLoadData();
          //this.ngOnInit();
        })
      }
    }
  );  
}

settledRateLoadData() 
{
  this.settleRateService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
  (
    (data :SettledRateDetails)=>   
    {
      if(data !== null)
      {
        this.showHidesettledRates = true;
      }
      this.advanceTableSRD = data;
    },
   (error: HttpErrorResponse) => { this.advanceTableSRD = null;}
  );
}

  ///-----SpecialInstrucation
showAndScrollSpecialInstrucation() {
  this.showHideSpecialInst=true;
  setTimeout(() => {
    const element = document.getElementById('specialInstrucation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}
///-----InternalNote
showAndScrollInternalNote() {
   this.showHideInternalNote=true;
  setTimeout(() => {
    const element = document.getElementById('internalNote');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}
//------settledRates
showAndScrollOpenSettledRates() {
  this.showHidesettledRates = true;
  setTimeout(() => {
    const element = document.getElementById('settledRates');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}

// Helper method to determine if editing should be allowed
private isEditingAllowed(): boolean {
  // Allow editing if status explicitly allows changes
  if (this.status === 'Changes allow') {
    return true;
  }
  
  // For duplicate bookings or when action is 'add', allow editing
  if (this.action === 'add') {
    return true;
  }
  
  // If no status is provided, default to allow (for backward compatibility)
  if (!this.status || this.status === '') {
    return true;
  }
  
  // If coming from reservation group details (likely a duplicate or edit), allow changes
  // This is determined by checking if we're in edit mode but status suggests restriction
  if (this.action === 'edit' && this.status && this.status.includes('not allowed')) {
    return true; // Override restriction for reservation group details edits
  }
  
  return false;
}
}




