// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CarAndDriverAllotmentService } from './CarAndDriverAllotment.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  CarAndDriverAllotment,
  CarAndDriverAllotmentData,
  CarsRestrictedForPassengerModel,
  DriverDutyData,
  DriverModel,
  DriversRestrictedForPassengerModel,
  TripDetails
} from './CarAndDriverAllotment.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookerInfoComponent } from '../BookerInfo/BookerInfo.component';
import { PassengerInfoComponent } from '../PassengerInfo/PassengerInfo.component';
import { VehicleCategoryInfoComponent } from '../VehicleCategoryInfo/VehicleCategoryInfo.component';
import { VehicleInfoComponent } from '../VehicleInfo/VehicleInfo.component';
import { PackageInfoComponent } from '../PackageInfo/PackageInfo.component';
import { SpecialInstructionInfoComponent } from '../SpecialInstructionInfo/SpecialInstructionInfo.component';
import { TimeAndAddressInfoComponent } from '../TimeAndAddressInfo/TimeAndAddressInfo.component';
import { StopDetailsInfoComponent } from '../StopDetailsInfo/StopDetailsInfo.component';
import { StopOnMapInfoComponent } from '../StopOnMapInfo/StopOnMapInfo.component';
import { CarAndDriverSearchFormDialogComponent } from '../CarAndDriverSearch/dialogs/form-dialog/form-dialog.component';
import { CarAndDriverActionsFormDialogComponent } from '../CarAndDriverActions/dialogs/form-dialog/form-dialog.component';
import { PassengerHistoryComponent } from '../PassengerHistory/PassengerHistory.component';
import Swal from 'sweetalert2';
import { ExistingBidsComponent } from '../ExistingBids/ExistingBids.component';
import { AttachAnotherCarFormDialogComponent } from '../AttachAnotherCar/dialogs/form-dialog/form-dialog.component';
//import { AttachAnotherDriverFormDialogComponent } from '../AttachAnotherDriver/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponent as MyFormDialogComponent } from '../driverInventoryAssociation/dialogs/form-dialog/form-dialog.component';
import { DriverFeedbackInfoComponent } from '../DriverFeedbackInfo/DriverFeedbackInfo.component';
import { AddCarAndDriverFormDialogComponent } from '../AddCarAndDriver/dialogs/form-dialog/form-dialog.component';
import { ControlPanelDesignService } from '../controlPanelDesign/controlPanelDesign.service';
import {
  ControlPanelData,
  ControlPanelDetails,
  Filters
} from '../controlPanelDesign/controlPanelDesign.model';
import { DriverInventoryAssociation } from '../driverInventoryAssociation/driverInventoryAssociation.model';
import { DriverInventoryAssociationService } from '../driverInventoryAssociation/driverInventoryAssociation.service';
import { FormDialogComponent } from '../allotCarAndDriver/dialogs/form-dialog/form-dialog.component';
import moment from 'moment';
import { FormDialogCAComponent } from '../cancelAllotment/dialogs/form-dialog/form-dialog.component';
import { AllotmentStatusDropdown } from '../allotCarAndDriver/allotCarAndDriverDropdown.model';
//import { ViewFeedBackInfoComponent } from '../viewFeedBackInfo/viewFeedBackInfo.component';
import { FormDialogComponent as DriverInventoryAssociationFormDialogComponent } from '../driverInventoryAssociation/dialogs/form-dialog/form-dialog.component';
import { AllotCarAndDriverService } from '../allotCarAndDriver/allotCarAndDriver.service';
import { AllotmentNotificationDialogComponent } from './allotmentNotification/allotmentNotification.component';
import { AllotmentNotificationReplyDialogComponent } from './allotmentNotificationReply/allotmentNotificationReply.component';
import { FormDialogNotificationComponent } from './form-dialog/form-dialog.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Address } from '@compat/google-places-shim-objects/address';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SearchDriverByLocationComponent } from '../searchDriverByLocation/searchDriverByLocation.component';
import { VehicleCategoryDropDown } from '../general/vehicleCategoryDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { InventoryDropDown } from '../inventory/inventoryDropDown.model';
import { SupplierDropDown } from '../supplier/supplierDropDown.model';
import { AllotmentStatusDetailsComponent } from '../AllotmentStatusDetails/AllotmentStatusDetails.component';
import { LocationDetailsComponent } from '../locationDetails/locationDetails.component';
import { VendorDetailsComponent } from '../vendorDetails/vendorDetails.component';
import { FeedBackDetailsComponent } from '../feedBackDetails/feedBackDetails.component';
import { FeedBackDetailsService } from '../feedBackDetails/feedBackDetails.service';
import { DropOffDetailShowComponent } from '../dropOffDetailShow/dropOffDetailShow.component';
import { LocationInDetailShowComponent } from '../locationInDetailShow/locationInDetailShow.component';
import { PickUpDetailShowComponent } from '../pickUpDetailShow/pickUpDetailShow.component';
import { ReachedByExecutiveDetailsComponent } from '../ReachedByExecutiveDetails/ReachedByExecutiveDetails.component';
import { GarageOutDetailsComponent } from '../GarageOutDetails/GarageOutDetails.component';
import { DispatchByExecutiveService } from '../dispatchByExecutive/dispatchByExecutive.service';
import { DutySlipQualityCheckedByExecutive } from '../dutySlipQualityCheckedByExecutive/dutySlipQualityCheckedByExecutive.model';
import { ReservationLocationTransferLogComponent } from '../reservationLocationTransferLog/reservationLocationTransferLog.component';
import { FormDialogComponent as FormDialogComponentTransferLocation } from '../reservationLocationTransferLog/dialogs/form-dialog/form-dialog.component';
import { ReservationLocationTransferLogService } from '../reservationLocationTransferLog/reservationLocationTransferLog.service';
import { ReservationLocationTransferLogModel } from '../reservationLocationTransferLog/reservationLocationTransferLog.model';
import { FormDialogComponent as AdhocCarAndDriverFormDialogComponent } from '../adhocCarAndDriver/dialogs/form-dialog/form-dialog.component';
import { DriverOfficialIdentityNumberDD } from '../general/driverOfficialIdentityNumberDD.model';
import { SupplierTypeDropDownModel } from '../supplierType/supplierType.model';
import { SoftToHardDialogComponent } from '../cancelAllotment/dialogs/softToHard-Dialog/softToHard-Dialog.component';
import { UpdateDriverMobileComponent } from '../driverInventoryAssociation/dialogs/updateDriverMobile/updateDriverMobile.component';

@Component({
  standalone: false,
  selector: 'app-CarAndDriverAllotment',
  templateUrl: './CarAndDriverAllotment.component.html',
  styleUrls: ['./CarAndDriverAllotment.component.scss']
})
export class CarAndDriverAllotmentComponent implements OnInit {
  @Input() suggestiveData;
  displayedColumns = [
    'tripDetails',
    'carDetails',
    'route',
    'passenger',
    'tripTracker',
    'BillingDetails',
    'paymentStatus'
  ];
  data = {
    bookingCount: '', // Yahan "Data Not Found" nahi dikhana hai, to ye blank ya number ho sakta hai
    achievementPercentage: '', // Yahan agar empty hai to "Data Not Found" dikhayega
    driverAverage: null,
    previousDuty: '',   // Empty value will show "Data Not Found"
    currentDuty: '',
    futureDuty: '' // Yahan bhi "Data Not Found" dikhayega
  };

  dutyData = {
    previousDuty: '',   // Empty value will show "Data Not Found"
    currentDuty: '',
    futureDuty: ''  // Null value will show "Data Not Found"
  };
  sortType: string = '';
  selectAll: boolean = false;
  sortingData: number = 1;
  driversLatLong: DriverModel | null;
  driverModelLatLong: DriverModel | null;
  dataSource: CarAndDriverAllotment[];
  dataSourceForDutySlip: DutySlipQualityCheckedByExecutive[] | null;
  driverDutyData: DriverDutyData[];
  driverPreviousDutyData: DriverDutyData[];
  driverNextDutyData: DriverDutyData[];
  CarAndDriverAllotmentID: number;
  advanceTable: Array<TripDetails> = [];
  SearchCarAndDriverAllotment: string = '';
  SearchTripDate: string = '';
  SearchStatus: string = '';
  SearchVehicle: string = '';
  SearchCity: string = '';
  SearchPackageTypeID: number = 0;
  SearchPackage: string = '';
  SearchBooker: string = '';
  SearchActivationStatus: string = 'Active';
  PageNumber: number = 1;
  user_ID: number;
  Rid: number;
  name: string;
  bUserID: number;
  TripDetails: any;
  CarDetails: string;
  Route: string;
  Passenger: string;
  TripTracker: string;
  BillingDetails: string;
  PaymentStatus: string;
  Booker: string;
  BookedVehicle: string;
  Route1: string;
  Passenger1: string;
  Amount: number;
  paymentMode: string;
  vendorStatus: string;
  packageBooked: string;
  Passenger2: string;
  AmountPaid: number;
  Vendor: string;
  VehicleStatus: string;
  VendorBookingNo: string;
  VehSupplied: string;
  Map: string;
  ConnectDriver: string;
  Disputes: string;
  VehNo: string;
  Drop: string;
  Driver: string;
  SpecialInstruction: string;
  Route6: string;
  TripTracker1: string;
  SearchPassenger: string;
  selectedDriversAllotments = [];
  reservationID: any;
  _filters: Filters;
  currentPage = 1;
  recordsPerPage = 50;
  public reservationInfo: ControlPanelDetails[];
  public isChecked = false;
  advanceTableACD: DriverInventoryAssociation;
  public driverInventoryAssociationDataSource: DriverInventoryAssociation[] | null;
  driverID: number = 0;
  searchDriverName: string = '';
  searchInventoryName: string = '';
  searchActivationStatus: boolean = true;
  allotmentStatus: any;
  public advanceTableRLT: ReservationLocationTransferLogModel | null;

  public DriversRestrictedForPassengerList: DriversRestrictedForPassengerModel[] | [];
  public CarsRestrictedForPassengerList: CarsRestrictedForPassengerModel[] | [];

  isLoading = true;
  totalData = 0;
  pickupDate: any;
  allotmentID: any;
  selectedBadge: string = '';
  //public newItems: any[];

  filterForm: FormGroup;
  advanceTableForm: FormGroup;
  public DriverList?: DriverDropDown[] = [];
  filteredOptions: Observable<DriverDropDown[]>;
  filteredVendorTypeOptions: Observable<SupplierTypeDropDownModel[]>;
  eTRAvailabilityDate: string = '';
  eTRAvailabilityTime: string = '';
  eTRAvailabilityGeoLocation: string = '';
  locationString: string = '';
  action: string;
  addressString: string;
  latitude: string = '';
  longitude: string = '';
  options: any = {
    componentRestrictions: { country: 'IN' }
  }
  driver: FormControl = new FormControl();
  driverOfficialIdentityNumber: FormControl = new FormControl();
  supplier: FormControl = new FormControl();
  hideLatLong: boolean = false;
  pickupAddress: any;
  selectAllDrivers: string = '';
  driverLat: any;
  driverLong: any;
  selectedOption: boolean = true;
  selectedOptions: boolean = false;
  selected: string = 'pickup';
  lat: string;
  long: string;
  city: string = '';
  country: string = '';
  province: string = '';
  ipaddress: string = '';
  driverAvg: any[] = [];
  searchTerm: any = '';
  selectedFilter: string = 'search';

  otherCriteria: FormControl = new FormControl();
  monthlyTarget: FormControl = new FormControl();
  bookingCount: FormControl = new FormControl();
  vendorType: FormControl = new FormControl();
  ownedSupplier: FormControl = new FormControl();
  category: FormControl = new FormControl();
  vehicle: FormControl = new FormControl();
  public VehicleList?: VehicleDropDown[] = [];
  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  public VendorTypeList?: SupplierTypeDropDownModel[] = [];

  inventory: FormControl = new FormControl();
  filteredInventoryOptions: Observable<VehicleDropDown[]>;
  filteredRegNumberOptions: Observable<VehicleDropDown[]>;
  public InventoryList: VehicleDropDown[] = [];
  public RegNumberList: InventoryDropDown[] = [];
  //google: any;

  public SupplierList?: SupplierDropDown[] = [];
  filteredSupplierOptions: Observable<SupplierDropDown[]>;

  filteredDriverOfficialIdentityNumberOptions: Observable<DriverOfficialIdentityNumberDD[]>;
  public DriverOfficialIdentityNumberList?: DriverOfficialIdentityNumberDD[] = [];

  supplierID: any;
  vehicleCategoryID: any;
  filterByVehicleCategoryID = 0;
  filterByVehicleCategory = '';

  ShowAllLocation: any;
  selectedCategory: string;
  PickupDate: any;
  searchCategory: string = '';
  SearchVendorType: string = '';
  searchVehicle: string = '';
  SearchBookingCount: string = '';
  SearchMonthlyTarget: string = '';
  SearchOtherCriteria: string = '';
  supplierName: string = '';
  searchRegistration: string = '';
  isDisabled: boolean = true;
  public openedPanelIndex: number;
  resAllotmentID: any;
  reservationGroupID: string;
  allotmentType: string;

  isLoadingdata: boolean = false;

  public inventoryUnassociatedDataSource: DriverInventoryAssociation[] | null;
  unassociatedTotalData = 0;
  associatedUnassociated: FormControl = new FormControl('Associated');
  searchedType: string = 'unAssociated';
  //searchedType: 'Associated' | 'Unassociated' = 'Associated';
  isLoadingdataUnassociated: boolean = false;
  isSearchClicked: boolean = false;

  constructor(
    private fb: FormBuilder,
    public route: Router,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public _carAndDriverAllotmentService: CarAndDriverAllotmentService,
    public _controlPanelDesignService: ControlPanelDesignService,
    public driverInventoryAssociationService: DriverInventoryAssociationService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public advanceTableService: AllotCarAndDriverService,
    public feedBackDetailsService: FeedBackDetailsService,
    public dispatchByExecutiveService: DispatchByExecutiveService,
    public reservationLocationTransferLogService: ReservationLocationTransferLogService,
    public router: ActivatedRoute
  ) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  // Status gating
  status: string = '';
  buttonDisabled: boolean = false; // disable actions in child dialogs only

  ngOnInit() {
    this.router.queryParams.subscribe((paramsData) => {
      const encryptedReservationGroupID = paramsData.reservationGroupID;
      const encryptedReservationID = paramsData.reservationID;
      const encryptedPickupDate = paramsData.pickupDate;
      const encryptedPickupAddress = paramsData.pickupAddress;
      this.status = paramsData.status;
      this.reservationGroupID = this._generalService.decrypt(decodeURIComponent(encryptedReservationGroupID));
      this.reservationID = this._generalService.decrypt(decodeURIComponent(encryptedReservationID));
      this.pickupDate = this._generalService.decrypt(decodeURIComponent(encryptedPickupDate));
      this.pickupAddress = this._generalService.decrypt(decodeURIComponent(encryptedPickupAddress));

      // this.reservationID = paramsData.reservationID;
      // this.pickupDate = paramsData.pickupDate;
      // this.pickupAddress=paramsData.pickupAddress;
      this.monthlyTarget.setValue('');
    });

    if (this.reservationID != null && this.reservationID > 0) {
      this._filters = new Filters({});
      this._filters.reservationID = this.reservationID;
      this._filters.userID = this._generalService.getUserID();
      this.InitShowAllLocationCheck();
    }

    //this.carAndDriverAllotment();

    //this.GetDriverLatLong();
    this.updateSelected();
    this.initVehicleCategories();
    this.InitRegNumber();
    this.initVehicle();
    this.InitDriver();
    this.InitVendorType();
    this.InitDOINOnPageLoad();
    // this.initInventory();
    this.InitSupplier();
    // this.getAllDriver();
    //this.GetDriverDutyData();
    // this.reservationInfo?.forEach(item => item.isOpen = true);

  }

  // Normalize possible status payload shapes
  private extractStatus(raw: any): string {
    if (!raw) return '';
    if (typeof raw === 'string') return raw;
    if (typeof raw === 'object') {
      if (raw.status && typeof raw.status === 'string') return raw.status;
      if (raw.value && typeof raw.value === 'string') return raw.value;
    }
    return '';
  }

  refresh() {
    this.vendorType.setValue('');
    this.category.setValue('');
    this.vehicle.setValue('');
    this.bookingCount.setValue('');
    this.monthlyTarget.setValue('');
    this.otherCriteria.setValue('');
    this.supplier.setValue('');
    this.driver.setValue('');
    this.inventory.setValue('');
    // this.carAndDriverAllotmentData();
    this.carAndDriverAllotmentDataForUnassociated();
  }

  public InitShowAllLocationCheck() {
    this._controlPanelDesignService.getShowAllLocationCheck(this._generalService.getUserID()).subscribe(
      data => {
        this.ShowAllLocation = data.showAllLocation;
        this._filters.showAllLocation = this.ShowAllLocation
        this.loadData(this._filters, this.currentPage, this.recordsPerPage);
      }
    );
  }

  onVehicleAutoCompleteChange(event: any) {
    if (event.keyCode === 8) {
      this.vehicleCategoryID = 0;
      this.initVehicle();
      this.advanceTableForm.controls['vehicle'].setValue('');
    }
  }
  onAutoCompleteChange(event: any) {
    if (event.keyCode === 8) {
      this.supplierID = 0;
      // this.initInventory();
      // this.initInventoryForSupplier();
      this.InitDriver();
      this.advanceTableForm?.controls['driver'].setValue('');
      this.advanceTableForm?.controls['inventory'].setValue('');
    }
  }

  updateSelectedOption() {
    this.selectedOptions = true;
    this.selectedOption = false
    this.locationString = '';
    this.latitude = '';
    this.longitude = '';
    this.eTRAvailabilityGeoLocation = '';
  }

  updateSelected() {
    this.selectedOption = true;
    this.selectedOptions = false;
    this.locationString = this.pickupAddress;
    //this.eTRAvailabilityGeoLocation=this.eTRAvailabilityGeoLocation;
    this.GetDriverLatLong();
    // this.latitude=this.lat;
    // this.longitude=this.long;
  }

  InitDOINOnPageLoad() {
    this._generalService.GetDOIN().subscribe(
      (data) => {
        this.DriverOfficialIdentityNumberList = data;
        this.filteredDriverOfficialIdentityNumberOptions = this.driverOfficialIdentityNumber.valueChanges.pipe(
          startWith(""),
          map(value => this._filterDOINOnPageLoad(value || ''))
        );
      });
  }

  private _filterDOINOnPageLoad(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length === 0) {
      return [];
    }
    return this.DriverOfficialIdentityNumberList?.filter(
      driver => {
        return driver.driverOfficialIdentityNumber.toLowerCase().includes(filterValue);
      }
    );
  }

  InitVendorType() {
    this._generalService.GetSupplierType().subscribe
      (
        data => {
          this.VendorTypeList = data;
          this.filteredVendorTypeOptions = this.vendorType.valueChanges.pipe(
            startWith(""),
            map(value => this._filterVT(value || ''))
          );
        }
      );
  }

  private _filterVT(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length === 0) {
      return [];
    }
    return this.VendorTypeList.filter(
      customer => {
        return customer.supplierType.toLowerCase().includes(filterValue);
      }
    );
  }

  InitDriver() {
    this._generalService.GetDriver().subscribe
      (
        data => {
          this.DriverList = data;
          this.filteredOptions = this.driver.valueChanges.pipe(
            startWith(""),
            map(value => this._filter(value || ''))
          );
        }
      );
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length === 0) {
      return [];
    }
    return this.DriverList.filter(
      customer => {
        return customer.driverName.toLowerCase().includes(filterValue);
      }
    );
  }

  getDriverID(driverID: any) {
    this.driverID = driverID;
    this.advanceTableForm?.patchValue({ driverID: this.driverID });
  }

  initVehicleCategories() {
    this._generalService.GetVehicleCategories().subscribe(
      data => {
        this.VehicleCategoryList = data;
        this.filteredVehicleCategoryOptions = this.category.valueChanges.pipe(
          startWith(""),
          map(value => this._filterVC(value || ''))
        );
      });
  }

  private _filterVC(value: string): any {
    const filterValue = value.toLowerCase();
    return this.VehicleCategoryList.filter(
      customer => {
        return customer.vehicleCategory.toLowerCase().includes(filterValue);
      }
    );
  }
  getVehicleCategoryID(vehicleCategoryID: any) {
    this.vehicleCategoryID = vehicleCategoryID;
    this.InitVehicleBasedONCategory(this.vehicleCategoryID);

  }

  //-----------------------------------------------------

  InitVehicleBasedONCategory(vehicleCategoryID: any) {
    this._generalService.GetVehicleBasedOnCategory(vehicleCategoryID).subscribe(
      data => {
        this.VehicleList = data;
        this.filteredVehicleOptions = this.vehicle.valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicleBasedONCategory(value || ''))
        );
      });
  }
  private _filterVehicleBasedONCategory(value: string): any {
    const filterValue = value.toLowerCase();
    return this.VehicleList.filter(
      customer => {
        return customer.vehicle.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  //-----------------------------------------------------

  initVehicle() {
    this._generalService.GetVehicle().subscribe(
      data => {
        this.VehicleList = data;
        this.filteredVehicleOptions = this.vehicle.valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicle(value || ''))
        );
      });
  }
  private _filterVehicle(value: string): any {
    const filterValue = value.toLowerCase();
    return this.VehicleList.filter(
      customer => {
        return customer.vehicle.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  // initInventory(){
  //   this._generalService.GetInventoryForDropDown().subscribe(
  //     data=>
  //     {
  //       this.InventoryList=data;
  //       this.filteredInventoryOptions = this.inventory.valueChanges.pipe(
  //         startWith(""),
  //         map(value => this._filterInventory(value || ''))
  //       ); 
  //     });
  // }
  // private _filterInventory(value: string): any {
  //   const filterValue = value.toLowerCase().trim();

  // // If the input is empty, return an empty list
  // if (filterValue.length === 0) {
  //   return [];
  // }

  // // Return filtered results matching the typed value
  // return this.InventoryList.filter(customer => 
  //   customer.vehicle.toLowerCase().includes(filterValue)
  // );
  // }

  //------------ForSupplier--------
  InitSupplier() {
    this._generalService.getSuppliersForInventory().subscribe(
      data => {
        this.SupplierList = data;
        this.filteredSupplierOptions = this.supplier.valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchSupplier(value || ''))
        );
      });
  }

  private _filtersearchSupplier(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length === 0) {
      return [];
    }
    return this.SupplierList.filter(
      customer => {
        return customer.supplierName.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  getSupplierID(supplierID: any) {
    this.supplierID = supplierID;
    this.InitDriverForSupplier(this.supplierID);
    this.initInventoryForSupplier(this.supplierID);
    this.advanceTableForm?.patchValue({ supplierID: this.supplierID });
    this.inventory.setValue('');
    this.driver.setValue('');
  }

  //-------ForCascadeDriver-----------

  InitDriverForSupplier(supplierID: any) {
    this._generalService.GetDriverDropDown(supplierID).subscribe
      (
        data => {
          this.DriverList = data;
          this.filteredOptions = this.driver.valueChanges.pipe(
            startWith(""),
            map(value => this._filterSupplier(value || ''))
          );
        }
      );
  }

  private _filterSupplier(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length === 0) {
      return [];
    }
    return this.DriverList?.filter(
      customer => {
        return customer.driverName.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  //--------------------ForCascadeRegistrationNumber----
  InitRegNumber() {
    this._generalService.GetRegNoForDropDown().subscribe(
      data => {
        this.RegNumberList = data;
        this.filteredRegNumberOptions = this.inventory.valueChanges.pipe(
          startWith(""),
          map(value => this._filterRegNo(value || ''))
        );
      });
  }

  private _filterRegNo(value: string): any {
    const filterValue = value.toLowerCase().trim();

    // If the input is empty, return an empty list
    if (filterValue.length === 0) {
      return [];
    }

    // Return filtered results matching the typed value
    return this.RegNumberList.filter(customer =>
      customer.registrationNumber.toLowerCase().includes(filterValue)
    );
  }

  //--------------------ForCascadeRegistrationNumber----
  initInventoryForSupplier(supplierID: any) {
    this._generalService.GetRegistrationNumberDropDown(supplierID).subscribe(
      data => {
        this.InventoryList = data;
        this.filteredInventoryOptions = this.inventory.valueChanges.pipe(
          startWith(""),
          map(value => this._filterInventorySupplier(value || ''))
        );
      });
  }

  private _filterInventorySupplier(value: string): any {
    const filterValue = value.toLowerCase().trim();

    // If the input is empty, return an empty list
    if (filterValue.length === 0) {
      return [];
    }

    // Return filtered results matching the typed value
    return this.InventoryList.filter(customer =>
      customer.vehicle.toLowerCase().includes(filterValue)
    );
  }

  AddressChange(address: Address) {
    this.addressString = address.formatted_address;
    this.latitude = address.geometry.location.lat().toString();
    this.longitude = address.geometry.location.lng().toString();
    this.locationString = this.addressString;
    this.eTRAvailabilityGeoLocation = `POINT (${this.longitude} ${this.latitude})`;
  }

  // CheckData(i: any){
  //   const caranddriver= {
  //     reservationID: this.reservationID,
  //     driverInventoryAssociationID  : this.driverInventoryAssociationDataSource[i].driverInventoryAssociationID,
  //     allotmentID  :-1,
  //     driverID : this.driverInventoryAssociationDataSource[i].driverID,
  //     driverName : this.driverInventoryAssociationDataSource[i].driverName,
  //     inventoryID : this.driverInventoryAssociationDataSource[i].inventoryID,
  //     registrationNumber : this.driverInventoryAssociationDataSource[i].inventoryName,
  //     vehicleID : this.driverInventoryAssociationDataSource[i].vehicleID,
  //     vehicleName : this.driverInventoryAssociationDataSource[i].vehicle,
  //     vehicleCategoryID : this.driverInventoryAssociationDataSource[i].vehicleCategoryID,
  //     vehicleCategoryName : this.driverInventoryAssociationDataSource[i].vehicleCategory,
  //     inventoryOwnedSupplied : this.driverInventoryAssociationDataSource[i].ownedSupplied,
  //     inventorySupplierID : this.driverInventoryAssociationDataSource[i].inventorySupplierID,
  //     inventorySupplierName : this.driverInventoryAssociationDataSource[i].inventorySupplierName,
  //     driverOwnedSupplier : this.driverInventoryAssociationDataSource[i].driverOwnedSupplier,
  //     driverSupplierID : this.driverInventoryAssociationDataSource[i].driverSupplierID,
  //     driverSupplierName : this.driverInventoryAssociationDataSource[i].driverSupplierName,
  //     dateOfAllotment : this.driverInventoryAssociationDataSource[i].driverInventoryAssociationStartDate,
  //     timeofAllotment : this.driverInventoryAssociationDataSource[i].driverInventoryAssociationEndDate,
  //     allotmentByEmployeeID:this._generalService.getUserID(),
  //     allotmentRemark:null,
  //     allotmentStatus:'Alloted',
  //     driverAcceptanceStatus: "Accepted",
  //     acceptanceNotificationSentToDriver: true,      
  //     acceptanceNotificationSentToDriverRemark: "Accepted by Reservation Executive",
  //     driverAcceptanceRemark: "demo",    
  //     driverAcceptanceEnteredByEmployeeID: this._generalService.getUserID(),
  //   }
  //   if(this.isChecked){
  //     caranddriver.driverAcceptanceStatus= "Pending";
  //     caranddriver.acceptanceNotificationSentToDriverRemark= "demo";
  //     caranddriver.driverAcceptanceRemark= null;
  //     caranddriver.driverAcceptanceEnteredByEmployeeID=0;
  //   }

  //   this.advanceTableService.add(caranddriver)
  //     .subscribe(
  //       response => {

  //         this.showNotification(
  //           'snackbar-success',
  //           'Car And Driver Alloted...!!!',
  //           'bottom',
  //           'center'
  //         );
  //         this.loadData(this._filters, this.currentPage, this.recordsPerPage);
  //         this.carAndDriverAllotmentData();
  //       }
  //     )
  // }
  public loadData(filters: Filters, currentPage: number, pageSize: number) {

    this._controlPanelDesignService
      .getReservationDetailsForAllotment(filters, currentPage, pageSize)
      .subscribe(
        (data: ControlPanelData) => {
          if (data != null) {
            this.reservationInfo = data.reservationDetails;
            console.log(this.reservationInfo)
            this.allotmentType = this.reservationInfo[0]?.allotmentType;
            this.filterByVehicleCategoryID = this.reservationInfo[0]?.vehicle?.vehicleCategoryID;
            this.filterByVehicleCategory = this.reservationInfo[0]?.vehicle?.vehicleCategory;
            //this.carAndDriverAllotmentData();
            this.carAndDriverAllotmentDataForUnassociated();
          }
          else {
            this.reservationInfo = null;
          }
        },
        (error: HttpErrorResponse) => {
          this.reservationInfo = null;
        }
      );
  }

  locationTimeSet(event) {
    if (this.action === 'edit') {
      let time = this.advanceTableForm.value.pickupTime;
      let minutes = 90;
      let millisecondsToSubtract = minutes * 60 * 1000;
      let newDate = new Date(time - millisecondsToSubtract);
      this.advanceTableForm.patchValue({ locationOutTime: newDate });
    }
    else {
      let time = event.getTime();
      let minutes = 90;
      let millisecondsToSubtract = minutes * 60 * 1000;
      let newDate = new Date(time - millisecondsToSubtract);
      this.advanceTableForm.patchValue({ locationOutTime: newDate });
    }
  }

  public SearchData() {
    this.carAndDriverAllotment();
  }

  public SearchCarAndDriver() {
    this.isSearchClicked = true;
    this.carAndDriverAllotmentDataForUnassociated();
    // const selected = this.associatedUnassociated.value;
    // if (selected === 'Associated')
    // {
    //   this.searchedType = 'Associated';
    //   this.carAndDriverAllotmentData();
    // } 
    // else if (selected === 'Unassociated') 
    // {
    //   this.searchedType = 'Unassociated';
    //   this.carAndDriverAllotmentDataForUnassociated();
    // }
  }


  onBackPress(event) {
    if (event.keyCode === 8) {
      // this.carAndDriverAllotmentData();
      this.carAndDriverAllotmentDataForUnassociated();
    }
  }

  // carAndDriverAllotmentData()
  // {
  //   switch (this.selectedFilter)
  //     {
  //       case 'CarNo':
  //         this.inventory.setValue(this.searchTerm);
  //         break;
  //       case 'DriverName':
  //         this.driver.setValue(this.searchTerm);
  //         break;
  //         case 'vendorType':
  //           this.vendorType.setValue(this.searchTerm);
  //         break;
  //         case 'carType':
  //           this.vehicle.setValue(this.searchTerm);
  //           break;
  //       default:
  //         this.searchTerm = '';
  //         break;
  //     }
  //   var PickupDate:string;
  //   if(!=="")
  //   {
  //     PickupDate=moment(PickupDate).format('YYYY-MM-DD');
  //   }
  //   if(this.driverID===undefined)
  //   {
  //     this.driverID=0;
  //   }

  //   this.driverInventoryAssociationService.getTableData(this.driverID,this.driver.value,this.supplier.value,this.category.value,this.vehicle.value,this.inventory.value,
  //   this.searchInventoryName,this.vendorType.value,this.bookingCount.value,this.monthlyTarget.value,this.otherCriteria.value,PickupDate,this.searchActivationStatus, this.PageNumber).subscribe
  //   (
  //     (data:CarAndDriverAllotmentData) =>   
  //     {
  //       if (data != null) {
  //       this.driverInventoryAssociationDataSource = data.driverInventoryAssociationModel;
  //       this.driverInventoryAssociationDataSource?.forEach(element => {
  //         Object.assign(element, { checked: false });
  //       });
  //       this.totalData = data.totalRecords;
  //       }
  //       else
  //       {
  //         this.driverInventoryAssociationDataSource=null;
  //         this.totalData=0;
  //       }
  //     },
  //     (error: HttpErrorResponse) => { this.driverInventoryAssociationDataSource = null;}
  //   );
  // }

  carAndDriverAllotmentData() {
    let PickupDate: string = '';
    if (this.pickupDate !== "") {
      this.pickupDate = moment(this.pickupDate).format('MMM DD yyyy');
    }
    if (this.driverID === undefined) {
      this.driverID = 0;
    }
    this.isLoadingdata = true;
    this.driverInventoryAssociationService.getTableData(this.reservationInfo[0].transferedLocationID,
      this.driverID, this.driver.value, this.driverOfficialIdentityNumber.value, this.supplier.value, this.category.value,
      this.vehicle.value, this.inventory.value, this.searchInventoryName,
      this.vendorType.value, this.ownedSupplier.value, this.bookingCount.value, this.monthlyTarget.value,
      this.otherCriteria.value, this.pickupDate, this.searchActivationStatus, this.PageNumber
    ).subscribe(
      (data: CarAndDriverAllotmentData) => {
        if (data != null) {
          this.driverInventoryAssociationDataSource = data.driverInventoryAssociationModel;
          this.driverInventoryAssociationDataSource?.forEach(element => {
            Object.assign(element, { checked: false });
          });
          this.totalData = data.totalRecords;
        }
        else {
          this.driverInventoryAssociationDataSource = null;
          this.totalData = 0;
          // Show message if registration number was searched but no data found
          if (this.inventory.value && this.inventory.value.trim() !== '') {
            Swal.fire({
              //title: 'Not Found',
              text: 'No records found',
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          }
        }
        this.isLoadingdata = false;
      },
      (error: HttpErrorResponse) => {
        this.driverInventoryAssociationDataSource = null;
        this.isLoadingdata = false;
      }
    );
  }

  carAndDriverAllotmentDataForUnassociated() {
    let PickupDate: string = '';
    if (this.pickupDate !== "") {
      this.pickupDate = moment(this.pickupDate).format('MMM DD yyyy');
    }
    if (this.driverID === undefined) {
      this.driverID = 0;
    }
    this.isLoadingdataUnassociated = true;
    this.driverInventoryAssociationService.getDataInventoryUnassociation(this.reservationInfo[0].transferedLocationID,
      this.driverID, this.driver.value,
      this.driverOfficialIdentityNumber.value, this.supplier.value, this.category.value,
      this.vehicle.value, this.inventory.value, this.searchInventoryName,
      this.vendorType.value, this.ownedSupplier.value, this.bookingCount.value, this.monthlyTarget.value,
      this.otherCriteria.value, this.pickupDate, this.searchActivationStatus, this.PageNumber
    ).subscribe(
      (data: CarAndDriverAllotmentData) => {
        if (data != null) {
          this.driverInventoryAssociationDataSource = data.driverInventoryAssociationModel;
          console.log(this.driverInventoryAssociationDataSource)
          this.driverInventoryAssociationDataSource?.forEach(element => {
            Object.assign(element, { checked: false });
          });
          this.unassociatedTotalData = data.totalRecords;
        }
        else {
          this.driverInventoryAssociationDataSource = null;
          this.unassociatedTotalData = 0;
          // Show message if registration number was searched but no data found
          if (this.inventory.value && this.inventory.value.trim() !== '') {
            Swal.fire({
              //title: 'Not Found',
              text: 'No records found',
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          }
        }
        this.isLoadingdataUnassociated = false;
      },
      (error: HttpErrorResponse) => {
        this.driverInventoryAssociationDataSource = null;
        this.isLoadingdataUnassociated = false;
      }
    );
  }

  carAndDriverAllotment() {
    if (this.pickupDate !== "") {
      this.pickupDate = moment(this.pickupDate).format('MMM DD yyyy');
    }
    if (this.driverID === undefined) {
      this.driverID = 0;
    }
    if (this.eTRAvailabilityTime !== "") {
      this.eTRAvailabilityTime = moment(this.eTRAvailabilityTime).format('HH:mm');
    }
    if (this.eTRAvailabilityDate !== "") {
      this.eTRAvailabilityDate = moment(this.eTRAvailabilityDate).format('MMM DD yyyy');
    }
    this.driverInventoryAssociationService.getTableDataByDriver(this.driverID, this.driver.value, this.eTRAvailabilityDate,
      this.eTRAvailabilityTime,
      this.eTRAvailabilityGeoLocation, this.searchInventoryName, this.pickupDate, this.searchActivationStatus, this.PageNumber).subscribe
      (
        (data: CarAndDriverAllotmentData) => {
          if (data != null) {
            this.driverInventoryAssociationDataSource = data.driverInventoryAssociationModel;
            this.driverInventoryAssociationDataSource?.forEach(element => {
              Object.assign(element, { checked: false });
            });
            this.totalData = data.totalRecords;
          }
          else {
            this.driverInventoryAssociationDataSource = null;
            this.totalData = 0;
          }
        },
        (error: HttpErrorResponse) => { this.driverInventoryAssociationDataSource = null; }
      );
  }

  GetDriverLatLong() {

    this._carAndDriverAllotmentService.GetLatLong(this.pickupAddress).subscribe
      (
        (data: DriverModel) => {
          this.driverModelLatLong = data;
          const geoLocation = this.driverModelLatLong?.geoLocation;
          if (!geoLocation) {
            this.latitude = '';
            this.longitude = '';
            this.eTRAvailabilityGeoLocation = '';
            return;
          }

          var value = geoLocation.replace(
            '(',
            ''
          );
          value = value.replace(')', '');
          var lat = value.split(' ')[2];
          var long = value.split(' ')[1];

          this.latitude = lat;
          this.longitude = long;
          this.eTRAvailabilityGeoLocation = `POINT (${this.longitude} ${this.latitude})`;

        },
        (error: HttpErrorResponse) => { this.driverModelLatLong = null; }
      );
  }

  getAllDriver() {

    this._carAndDriverAllotmentService.GetAllDriver(this.pickupAddress).subscribe
      (
        (data: DriverModel) => {
          this.driversLatLong = data;

        },
        (error: HttpErrorResponse) => { this.driverModelLatLong = null; }
      );
  }

  GetDriversRestricted(i: any) {
    this._carAndDriverAllotmentService.GetDriverRestricted(this.reservationInfo[i]?.passengerDetails[i].customerPersonID).subscribe(
      (data: DriversRestrictedForPassengerModel[]) => {
        this.DriversRestrictedForPassengerList = data;
        this.updateDriverRestrictions();
      }
    );
  }

  GetCarsRestricted(i: any) {
    this._carAndDriverAllotmentService.GetCarRestricted(this.reservationInfo[i].passengerDetails[i].customerPersonID).subscribe(
      (data: CarsRestrictedForPassengerModel[]) => {
        this.CarsRestrictedForPassengerList = data;
        this.updateCarRestrictions();
      }
    );
  }

  updateDriverRestrictions() {
    if (this.driverInventoryAssociationDataSource && this.DriversRestrictedForPassengerList) {
      this.driverInventoryAssociationDataSource.forEach(driver => {
        if (this.DriversRestrictedForPassengerList.some((restrictedDriver: DriversRestrictedForPassengerModel) => restrictedDriver.driverID === driver.driverID)) {
          Object.assign(driver, { restrictedMessage: "Driver Restricted" });
        } else {
          Object.assign(driver, { restrictedMessage: "" });
        }
      });
    }
  }

  updateCarRestrictions() {
    if (this.driverInventoryAssociationDataSource && this.CarsRestrictedForPassengerList) {
      this.driverInventoryAssociationDataSource.forEach(car => {
        if (this.CarsRestrictedForPassengerList.some((restrictedDriver: CarsRestrictedForPassengerModel) => restrictedDriver.inventoryID === car.inventoryID)) {
          Object.assign(car, { carRestrictedMessage: "Car Restricted" });
        } else {
          Object.assign(car, { carRestrictedMessage: "" });
        }
      });
    }
  }

  // openAllotCarAndDriver(i:any,allotmentType:string,allotmentID:any)
  // {

  //   let allottedDriverIndex = this.reservationInfo.findIndex(r => r.allotmentStatus === 'Alloted');
  //       if(this.reservationInfo[0].allotmentStatus==='Cancelled' || this.reservationInfo[0].allotmentStatus=== null)
  //       {
  //         const dialogRef = this.dialog.open(FormDialogComponent, 
  //           {
  //             data: 
  //               {
  //                 advanceTable: this.driverInventoryAssociationDataSource[i],
  //                 action: 'add',
  //                 Text:'AllotCarDriver',
  //                 reservationID:this.reservationID,
  //                 allotmentType:allotmentType
  //               }
  //           });
  //           dialogRef.afterClosed().subscribe(res => {
  //             if(res.isClose===false){
  //               this.loadData(this._filters, this.currentPage, this.recordsPerPage);
  //               this.carAndDriverAllotmentData();
  //             }
  //           })
  //       }
  //       if(this.reservationInfo[0].allotmentStatus==='Alloted')
  //       {
  //         if (this.openedPanelIndex === null) {
  //           this.openedPanelIndex = i; // Refresh के बाद भी allotted driver retain होगा
  //         }

  //         if(this.openedPanelIndex === i)
  //         {
  //           const dialogRef = this.dialog.open(FormDialogComponent, 
  //             {
  //               data: 
  //                 {
  //                   advanceTable: this.driverInventoryAssociationDataSource[i],
  //                   action: 'update',
  //                   Text:'AllotCarDriver',
  //                   reservationID:this.reservationID,
  //                   allotmentType:allotmentType,
  //                   allotmentID:allotmentID
  //                 }
  //             });
  //             dialogRef.afterClosed().subscribe(res => {
  //               if(res.isClose===false){
  //                 this.loadData(this._filters, this.currentPage, this.recordsPerPage);
  //                 this.carAndDriverAllotmentData();
  //               }
  //             })
  //         }
  //         else{
  //           Swal.fire({
  //             title: '',
  //             text: 'Driver is already assigned on this trip. If you want to change then first deattach assigned driver.',
  //             icon: 'warning',
  //           });
  //         }

  //       }

  // }

  openAllotCarAndDriver(i: any, allotmentType: string, allotmentID: any) {
    debugger
    // 👉 Check if HARD allotment already exists
    let isHardAllotted = this.reservationInfo.some(
      r => r.allotmentType === 'Hard' && r.allotmentStatus === 'Alloted'
    );
    let allottedDriverIndex = this.reservationInfo.findIndex(r => r.allotmentStatus === 'Alloted');

    if (this.reservationInfo[0].allotmentStatus === 'Cancelled' || this.reservationInfo[0].allotmentStatus === null) {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        data: {
          advanceTable: this.driverInventoryAssociationDataSource[i],
          action: 'add',
          Text: 'AllotCarDriver',
          reservationID: this.reservationID,
          allotmentType: allotmentType,
          status: this.status
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        if (!res.isClose) {
          this.loadData(this._filters, this.currentPage, this.recordsPerPage);
          //this.carAndDriverAllotmentData();
          this.carAndDriverAllotmentDataForUnassociated();
        }
      });

      return;
    }

    ////  If a driver is already allotted, restrict popup to only that driver
    // if (allottedDriverIndex !== -1) {
    //   let allottedDriverID = this.reservationInfo[allottedDriverIndex].driverID;

    //   if (this.driverInventoryAssociationDataSource[i].driverID !== allottedDriverID) {
    //     //  Prevent popup for any other driver
    //     Swal.fire({
    //       title: '',
    //       text: 'Driver is already assigned on this trip. If you want to change then first deattach assigned driver.',
    //       icon: 'warning',
    //     });
    //     return;
    //   }
    // }
    if (isHardAllotted) {
      Swal.fire({
        title: '',
        text: 'Driver is already assigned on this trip. If you want to change then first deattach assigned driver.',
        icon: 'warning',
      });
      return;
    }

    //  Open popup only for the correct driver
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: this.driverInventoryAssociationDataSource[i],
        action: 'update',
        Text: 'AllotCarDriver',
        reservationID: this.reservationID,
        allotmentType: allotmentType,
        allotmentID: allotmentID,
        status: this.status
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res.isClose) {
        this.loadData(this._filters, this.currentPage, this.recordsPerPage);
        //this.carAndDriverAllotmentData();
        this.carAndDriverAllotmentDataForUnassociated();
      }
    });
  }

  togglePanel(index: number) {
    if (this.openedPanelIndex !== index) {
      this.openedPanelIndex = index;
    }
  }

  GetDriverDutyData(driverID: number, index: number) {
    this.togglePanel(index);
    this.GetDriversRestricted(index);
    this.GetCarsRestricted(index);
    this.GetDriverFeedbackAverage(driverID, index);

    if (driverID !== null && driverID !== undefined) {
      this.pickupDate = moment(this.pickupDate).format('yyyy-MM-DD');
      this._carAndDriverAllotmentService.GetDriverDuty(this.pickupDate, driverID).subscribe
        (
          (data: DriverDutyData[]) => {
            this.driverDutyData = data;
          },
          (error: HttpErrorResponse) => { this.driverDutyData = null; }
        );

      this._carAndDriverAllotmentService.GetPreviousDriverDuty(this.pickupDate, driverID).subscribe
        (
          (data: DriverDutyData[]) => {
            this.driverPreviousDutyData = data;
          },
          (error: HttpErrorResponse) => { this.driverDutyData = null; }
        );

      this._carAndDriverAllotmentService.GetNextDriverDuty(this.pickupDate, driverID).subscribe
        (
          (data: DriverDutyData[]) => {
            this.driverNextDutyData = data;
          },
          (error: HttpErrorResponse) => { this.driverDutyData = null; }
        );
    }

  }

  GetDriverFeedbackAverage(driverID: any, index: number) {

    this._carAndDriverAllotmentService.GetDriverFeedbackAverage(driverID).subscribe
      (
        data => {

          this.driverAvg[index] = data;

        },
        (error: HttpErrorResponse) => { this.driverAvg[index] = 0; }
      );
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.PageNumber = pageData.pageIndex + 1;
    //this.carAndDriverAllotmentData();
    this.carAndDriverAllotmentDataForUnassociated();
  }
  //   openAllotCarAndDriver(i: any) {     
  //     if (this.reservationInfo[0].allotmentStatus  === 'Cancelled' || this.reservationInfo[0].allotmentStatus  === null)
  //      {
  //       const caranddriver = {
  //         reservationID: this.reservationID,
  //         driverInventoryAssociationID  : this.driverInventoryAssociationDataSource[i].driverInventoryAssociationID,
  //         allotmentID  :-1,
  //         driverID : this.driverInventoryAssociationDataSource[i].driverID,
  //         driverName : this.driverInventoryAssociationDataSource[i].driverName,
  //         inventoryID : this.driverInventoryAssociationDataSource[i].inventoryID,
  //         registrationNumber : this.driverInventoryAssociationDataSource[i].inventoryName,
  //         vehicleID : this.driverInventoryAssociationDataSource[i].vehicleID,
  //         vehicleName : this.driverInventoryAssociationDataSource[i].vehicle,
  //         vehicleCategoryID : this.driverInventoryAssociationDataSource[i].vehicleCategoryID,
  //         vehicleCategoryName : this.driverInventoryAssociationDataSource[i].vehicleCategory,
  //         inventoryOwnedSupplied : this.driverInventoryAssociationDataSource[i].ownedSupplied,
  //         inventorySupplierID : this.driverInventoryAssociationDataSource[i].inventorySupplierID,
  //         inventorySupplierName : this.driverInventoryAssociationDataSource[i].inventorySupplierName,
  //         driverOwnedSupplier : this.driverInventoryAssociationDataSource[i].driverOwnedSupplier,
  //         driverSupplierID : this.driverInventoryAssociationDataSource[i].driverSupplierID,
  //         driverSupplierName : this.driverInventoryAssociationDataSource[i].driverSupplierName,
  //         dateOfAllotment : this.driverInventoryAssociationDataSource[i].driverInventoryAssociationStartDate,
  //         timeofAllotment : this.driverInventoryAssociationDataSource[i].driverInventoryAssociationEndDate,
  //         allotmentByEmployeeID:this._generalService.getUserID(),
  //         allotmentRemark:null,
  //         allotmentStatus:'Alloted',
  //       }
  //       //   this.driverInventoryAssociationDataSource[i].driverID,
  //       //   this.driverInventoryAssociationDataSource[i].driverName,this.reservationID,
  //       //   this.driverInventoryAssociationDataSource[i].inventoryID,
  //       //   this.driverInventoryAssociationDataSource[i].inventoryName,
  //       //   this.driverInventoryAssociationDataSource[i].vehicleID,
  //       //   this.driverInventoryAssociationDataSource[i].vehicle,
  //       //   this.driverInventoryAssociationDataSource[i].vehicleCategoryID,
  //       //   this.driverInventoryAssociationDataSource[i].vehicleCategory,
  //       //   this.driverInventoryAssociationDataSource[i].ownedSupplied,
  //       //   this.driverInventoryAssociationDataSource[i].inventorySupplierID,
  //       //   this.driverInventoryAssociationDataSource[i].inventorySupplierName,
  //       //   this.driverInventoryAssociationDataSource[i].driverOwnedSupplier,
  //       //  this.driverInventoryAssociationDataSource[i].driverSupplierID,
  //       //   this.driverInventoryAssociationDataSource[i].driverSupplierName,
  //       //   this.driverInventoryAssociationDataSource[i].driverSupplierName,
  //       //   this.driverInventoryAssociationDataSource[i].driverInventoryAssociationStartDate,
  //       //   this.driverInventoryAssociationDataSource[i].driverInventoryAssociationEndDate);
  //       this.advanceTableService.add(caranddriver)
  //         .subscribe(
  //           response => {

  //             this.showNotification(
  //               'snackbar-success',
  //               'Car And Driver Alloted...!!!',
  //               'bottom',
  //               'center'
  //             );
  //             this.loadData(this._filters, this.currentPage, this.recordsPerPage);
  //             this.carAndDriverAllotmentData();
  //           },
  //           error => {
  //             this.showNotification(
  //               'snackbar-danger',
  //               'Operation Failed...!!!',
  //               'bottom',
  //               'center'
  //             );
  //           }
  //         )
  //     }
  //     if (this.reservationInfo[0].allotmentStatus === 'Alloted') {
  //       Swal.fire({
  //         title: '',
  //         text: 'Driver is already assigned on this trip. If you want to change then first deattach assigned driver.',
  //         icon: 'warning',
  //       });
  //     }

  // }

  opencarWithDriver(i: any) {
    if (this.reservationInfo[0].allotmentStatus === 'Cancelled' || this.reservationInfo[0].allotmentStatus === null) {
      const dialogRef = this.dialog.open(FormDialogComponent,
        {
          data:
          {
            advanceTable: this.driverInventoryAssociationDataSource[i],
            action: 'add',
            Text: 'opencarWithDriver',
            reservationID: this.reservationID
          }
        });
      dialogRef.afterClosed().subscribe(res => {
        if (res.isClose === false) {
          this.loadData(this._filters, this.currentPage, this.recordsPerPage);
          //this.carAndDriverAllotmentData();
          this.carAndDriverAllotmentDataForUnassociated();
        }
      })
    }
    if (this.reservationInfo[0].allotmentStatus === 'Alloted') {
      Swal.fire({
        title: '',
        text: 'Driver is already assigned on this trip. If you want to change then first deattach assigned driver.',
        icon: 'warning',
      });
    }

  }

  onCheckBox(checkBoxValue: boolean, data: any) {
    if (checkBoxValue && !this.selectedDriversAllotments.includes(data)) {
      this.selectedDriversAllotments.push(data);
      data.checked = true;
    } else if (!checkBoxValue && this.selectedDriversAllotments.includes(data)) {
      this.selectAll = false;
      data.checked = false;
      const index = this.selectedDriversAllotments.findIndex(x => x.driverID === data.driverID);
      this.selectedDriversAllotments.splice(index, 1);
    }
  }

  checkAll(checkBoxValue: boolean) {
    this.driverInventoryAssociationDataSource?.forEach((element: any) => {
      if (checkBoxValue) {
        this.selectAll = true;
        element.checked = true;
        this.selectedDriversAllotments.push(element);
      } else {
        this.selectAll = false;
        element.checked = false;
        const index = this.selectedDriversAllotments.findIndex(x => x.driverID === element.driverID);
        this.selectedDriversAllotments.splice(index, 1);
      }
    });
  }

  openDriverWithCar(i: any) {
    if (this.reservationInfo[0].allotmentStatus === 'Cancelled' || this.reservationInfo[0].allotmentStatus === null) {
      const dialogRef = this.dialog.open(FormDialogComponent,
        {
          data:
          {
            advanceTable: this.driverInventoryAssociationDataSource[i],
            action: 'add',
            Text: 'openDriverWithCar',
            reservationID: this.reservationID
          }
        });
      dialogRef.afterClosed().subscribe(res => {
        if (res.isClose === false) {
          this.loadData(this._filters, this.currentPage, this.recordsPerPage);
          // this.carAndDriverAllotmentData();
          this.carAndDriverAllotmentDataForUnassociated();
        }
      })
    }
    if (this.reservationInfo[0].allotmentStatus === 'Alloted') {
      Swal.fire({
        title: '',
        text: 'Driver is already assigned on this trip. If you want to change then first deattach assigned driver.',
        icon: 'warning',
      });
    }

  }

  navigateToBooking() {
    // window.open('http://localhost:4200/#/driverInventoryAssociation', '_blank');
    //window.open('https://ecoserp.in/bookingScreen', '_blank');
    window.open(this._generalService.FormURL + 'fleet', '_blank');
  }

  BookingInfo(reservationID: number) {
    // this.dialog.open(NewFormComponent, {
    //   width: '910px',
    //   data: {
    //     reservationID: reservationID,
    //     action: 'View'
    //   }
    // });
    this.route.navigate(['/newForm'], {
      queryParams: {
        reservationID: reservationID
      }
    });
  }

  BookerInfo(reservationID: number) {
    const filtered = this.reservationInfo.filter(
      (value) => value.reservationID === reservationID
    )[0];
    this.dialog.open(BookerInfoComponent, {
      width: '500px',
      data: {
        advanceTable: filtered
      }
    });
  }

  VehicleCategoryInfo(reservationID: number) {
    const filtered = this.reservationInfo.filter(
      (value) => value.reservationID === reservationID
    )[0];
    this.dialog.open(VehicleCategoryInfoComponent, {
      width: '500px',
      data: {
        advanceTable: filtered
      }
    });
  }

  VehicleInfo(reservationID: number) {
    const filtered = this.reservationInfo.filter(
      (value) => value.reservationID === reservationID
    )[0];
    this.dialog.open(VehicleInfoComponent, {
      width: '500px',
      data: {
        advanceTable: filtered
      }
    });
  }

  PackageInfo(reservationID: number) {
    const filtered = this.reservationInfo.filter(
      (value) => value.reservationID === reservationID
    )[0];
    this.dialog.open(PackageInfoComponent, {
      width: '500px',
      data: {
        advanceTable: filtered
      }
    });
  }

  PassengerInfo(item) {
    // const filtered = this.reservationInfo
    //   .filter((value) => value.reservationID === reservationID)[0]
    //   .passengerDetails.filter(
    //     (value) => value.customerPersonID === customerPersonID
    //   )[0];

    this.dialog.open(PassengerInfoComponent, {
      width: '500px',
      data: {
        advanceTable: item.passengerDetails
      }
    });
  }

  SpecialInstructionInfo(item) {
    // const filtered = this.reservationInfo.filter(
    //   (value) => value.reservationID === reservationID
    // )[0];
    this.dialog.open(SpecialInstructionInfoComponent, {
      width: '500px',
      data: {
        advanceTable: item
      }
    });
  }

  TimeAndAddressInfo(item) {
    // const filtered = this.reservationInfo
    //   .filter((value) => value.reservationID === reservationID)[0]
    //   .stopsDetails.filter(
    //     (value) => value.reservationStopID === reservationStopID
    //   )[0];
    this.dialog.open(TimeAndAddressInfoComponent, {
      width: '750px',
      data: {
        advanceTable: item.stopsDetails[0]
      }
    });
  }

  TimeAndAddressDrop(item) {
    // const filtered = this.reservationInfo
    //   .filter((value) => value.reservationID === reservationID)[0]
    //   .stopsDetails.filter(
    //     (value) => value.reservationStopID === reservationStopID
    //   )[0];
    this.dialog.open(TimeAndAddressInfoComponent, {
      width: '750px',
      data: {
        advanceTable: item.stopsDetails[1]
      }
    });
  }

  StopDetailsInfo(item) {
    // const filtered = this.reservationInfo.filter(
    //   (value) => value.reservationID === reservationID
    // )[0].stopsDetails;
    this.dialog.open(StopDetailsInfoComponent, {
      width: '650px',
      data: {
        advanceTable: item
      }
    });
  }

  StopsOnMapInfo(item) {
    // const filtered = this.reservationInfo.filter(
    //   (value) => value.reservationID === item.reservationID
    // )[0].stopsDetails;
    this.dialog.open(StopOnMapInfoComponent, {
      width: '750px',
      data: {
        advanceTable: item
      }
    });
  }
  allotmentStatusDetails(item: any) {

    this.dialog.open(AllotmentStatusDetailsComponent, {
      width: '500px',
      data: {
        row: item
      }
    });
  }

  locationDetailsInfo(item: any) {

    this.dialog.open(LocationDetailsComponent, {
      width: '500px',
      data: {
        advanceTable: item
      }
    });
  }

  vendorStatusInfo(item) {

    this.dialog.open(VendorDetailsComponent, {
      width: '500px',
      data: {
        advanceTable: item
      }
    });
  }

  Search() {
    this.dialog.open(CarAndDriverSearchFormDialogComponent, {
      data: {
        advanceTable: this.advanceTable,
        action: 'add'
      }
    });
  }

  ExistingBids() {
    this.dialog.open(ExistingBidsComponent, {
      width: '70%',
      height: '50%',
      data: {
        advanceTable: this.advanceTable,
        action: 'add',
        reservationID: this.reservationID
      }
    });
  }

  AdhocCarAndDriver(reservationInfo: any) {
    const reservationData = Array.isArray(reservationInfo) ? reservationInfo[0] : reservationInfo;
    if (!reservationData) {
      this.snackBar.open('Reservation details are not loaded yet.', '', {
        duration: 6000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'snackbar-danger',
      });
      return;
    }

    const allotmentStatus = (reservationData.allotmentStatus || '').toString().trim().toLowerCase();
    if (allotmentStatus === 'alloted' || allotmentStatus === 'allotted') {
      Swal.fire({
        title: 'Already Alloted',
        icon: 'warning',
      });
      return;
    }

    let dialogRef: any;
    try {
      dialogRef = this.dialog.open(AdhocCarAndDriverFormDialogComponent, {
        data: {
          reservationInfo: reservationData,
          action: 'add'
        }
      });
    } catch (error: any) {
      this.snackBar.open(`Unable to open Adhoc popup: ${error?.message || 'unknown error'}`, '', {
        duration: 6000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'snackbar-danger',
      });
      return;
    }
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadData(this._filters, this.currentPage, this.recordsPerPage);
        this.driver.setValue(res.response.driverName);
        //this.carAndDriverAllotmentData();
        this.carAndDriverAllotmentDataForUnassociated();
      }
    });
  }

  // AddCarAndDriver() {
  //   this.dialog.open(AddCarAndDriverFormDialogComponent, {
  //     data: {
  //       advanceTable: this.advanceTable,
  //       action: 'add'
  //     }
  //   });
  // }

  // searchDriverByLocation() {
  //   this.dialog.open(SearchDriverByLocationComponent, {
  //     data: {
  //       advanceTable: this.advanceTable,
  //       action: 'add'
  //     }
  //   });
  // }

  AttachAnotherCar(i: any) {
    const dialogRef = this.dialog.open(DriverInventoryAssociationFormDialogComponent, {
      data: {
        advanceTable: this.advanceTable,
        action: 'edit',
        text: 'AttachAnotherCar',
        driverInventoryAssociationID: this.driverInventoryAssociationDataSource[i].driverInventoryAssociationID,
        driverID: this.driverInventoryAssociationDataSource[i].driverID,
        driverName: this.driverInventoryAssociationDataSource[i].driverName,
        inventoryName: this.driverInventoryAssociationDataSource[i].inventoryName,
        inventoryID: this.driverInventoryAssociationDataSource[i].inventoryID,
        vehicle: this.driverInventoryAssociationDataSource[i].vehicle,
        vehicleCategory: this.driverInventoryAssociationDataSource[i].vehicleCategory,
        driverInventoryAssociationStartDate: this.driverInventoryAssociationDataSource[i].driverInventoryAssociationStartDate,
        driverInventoryAssociationEndDate: this.driverInventoryAssociationDataSource[i].driverInventoryAssociationEndDate,
        driverInventoryAssociationStatus: this.driverInventoryAssociationDataSource[i].driverInventoryAssociationStatus,
        activationStatus: this.driverInventoryAssociationDataSource[i].activationStatus,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.isClose === false) {
        //this.carAndDriverAllotmentData(); 
        this.carAndDriverAllotmentDataForUnassociated();
      }

    })
  }

  AttachAnotherDriver(i: any) {
    console.log(i)
    const dialogRef = this.dialog.open(MyFormDialogComponent, {
      data: {
        advanceTable: this.advanceTable,
        driverInventoryAssociationDataSource: this.driverInventoryAssociationDataSource[i],
        action: 'add',
        text: 'AttachAnotherDriver',
        driverInventoryAssociationID: this.driverInventoryAssociationDataSource[i].driverInventoryAssociationID,
        inventoryID: this.driverInventoryAssociationDataSource[i].inventoryID,
        inventoryName: this.driverInventoryAssociationDataSource[i].inventoryName,
        vehicle: this.driverInventoryAssociationDataSource[i].vehicle,
        vehicleCategory: this.driverInventoryAssociationDataSource[i].vehicleCategory,
        driverName: this.driverInventoryAssociationDataSource[i].driverName,
        driverID: this.driverInventoryAssociationDataSource[i].driverID,
        driverInventoryAssociationStartDate: this.driverInventoryAssociationDataSource[i].driverInventoryAssociationStartDate,
        driverInventoryAssociationEndDate: this.driverInventoryAssociationDataSource[i].driverInventoryAssociationEndDate,
        driverInventoryAssociationStatus: this.driverInventoryAssociationDataSource[i].driverInventoryAssociationStatus,
        activationStatus: this.driverInventoryAssociationDataSource[i].activationStatus,
        driverSupplierName: this.driverInventoryAssociationDataSource[i].driverSupplierName,
        inventorySupplierName: this.driverInventoryAssociationDataSource[i].inventorySupplierName,

      },
    });
    dialogRef.afterClosed().subscribe(res => {

      if (res.isClose === false) {
        //this.carAndDriverAllotmentData(); 
        this.carAndDriverAllotmentDataForUnassociated();
      }
    })
  }

  AttachAnotherDriverForUnassoicated(i: any) {
    const dialogRef = this.dialog.open(MyFormDialogComponent, {
      data: {
        advanceTable: this.advanceTable,
        driverInventoryAssociationDataSource: this.driverInventoryAssociationDataSource[i],
        action: 'add',
        text: 'AttachAnotherDriver',
        driverInventoryAssociationID: this.driverInventoryAssociationDataSource[i].driverInventoryAssociationID,
        inventoryID: this.driverInventoryAssociationDataSource[i].inventoryID,
        inventoryName: this.driverInventoryAssociationDataSource[i].inventoryName,
        vehicle: this.driverInventoryAssociationDataSource[i].vehicle,
        vehicleCategory: this.driverInventoryAssociationDataSource[i].vehicleCategory,
        driverName: this.driverInventoryAssociationDataSource[i].driverName,
        driverID: this.driverInventoryAssociationDataSource[i].driverID,
        driverInventoryAssociationStartDate: this.driverInventoryAssociationDataSource[i].driverInventoryAssociationStartDate,
        driverInventoryAssociationEndDate: this.driverInventoryAssociationDataSource[i].driverInventoryAssociationEndDate,
        driverInventoryAssociationStatus: this.driverInventoryAssociationDataSource[i].driverInventoryAssociationStatus,
        activationStatus: this.driverInventoryAssociationDataSource[i].activationStatus,
        driverSupplierName: this.driverInventoryAssociationDataSource[i].driverSupplierName,
        inventorySupplierName: this.driverInventoryAssociationDataSource[i].inventorySupplierName,
      },
    });
    dialogRef.afterClosed().subscribe(res => {

      if (res.isClose === false) {
        //this.carAndDriverAllotmentData();
        this.carAndDriverAllotmentDataForUnassociated();
      }
    })
  }

  AddNewBid() {
    var newItems = [];
    for (var i = 0; i < this.selectedDriversAllotments.length; i++) {
      newItems.push(this.selectedDriversAllotments[i].driverID);
    }
    if (this.selectedDriversAllotments.length > 0) {
      const dialogRef = this.dialog.open(FormDialogNotificationComponent,
        {
          width: '400px',
          data:
          {
            reservationID: this.reservationID,
            newItems: newItems
          }

        });
      dialogRef.afterClosed().subscribe(res => {
        newItems = [];

      })
    }
    else {
      Swal.fire({
        title:
          'Please select driver first',
        icon: 'warning',
      }).then((result) => {
        if (result.value) {

        }
      });
    }

  }
  feedBackDetails(reservationID: number) {

    const filtered = this.reservationInfo.filter(
      (value) => value.reservationID === reservationID
    )[0];
    this.dialog.open(FeedBackDetailsComponent, {
      width: '500px',
      data: {
        advanceTable: filtered
      }
    });
  }

  CancellAllotment(allotmentID: any, reservationID: any) {
    if (this.reservationInfo[0].allotmentStatus === 'Cancelled' || this.reservationInfo[0].allotmentStatus === "") {

      Swal.fire({
        title: '',
        text: 'Driver is Not assigned on this trip. If you want to change then first attach  driver.',
        icon: 'warning',

      })
    }
    if (this.reservationInfo[0].allotmentStatus === 'Alloted') {
      const dialogRef = this.dialog.open(FormDialogCAComponent,
        {
          width: '400px',
          data:
          {
            advanceTable: this.advanceTable,
            allotmentID: allotmentID,
            reservationID: reservationID,
            status: this.status
          }

        });
      dialogRef.afterClosed().subscribe(res => {
        if (res.isClose === false) {
          this.allotmentDeleted(allotmentID);
          this.loadData(this._filters, this.currentPage, this.recordsPerPage);
          //this.carAndDriverAllotmentData(); 
          this.carAndDriverAllotmentDataForUnassociated();
        }

      })

    }
  }

  CovertSoftToHard(allotmentID: any, reservationInfo) {
    if (this.reservationInfo[0].allotmentStatus === 'Alloted') {
      const dialogRef = this.dialog.open(SoftToHardDialogComponent,
        {
          width: '400px',
          data:
          {
            advanceTable: reservationInfo,
            allotmentID: allotmentID
          }

        });
      dialogRef.afterClosed().subscribe(res => {
        this.loadData(this._filters, this.currentPage, this.recordsPerPage);
      })

    }
  }

  allotmentDeleted(allotmentID: any) {
    this._carAndDriverAllotmentService.delete(allotmentID
    )
      .subscribe(
        data => {
          this._generalService.sendUpdate('AllotmentDelete:AcrisCodeView:Success');//To Send Updates   
        },
        error => {
          this._generalService.sendUpdate('AllotmentDelete:AcrisCodeView:Failure');//To Send Updates  
        }
      )
  }
  DetachFromDuty(allotmentID, allotmentStatus) {
    const dialogRef = this.dialog.open(FormDialogCAComponent,
      {
        width: '400px',
        data:
        {
          advanceTable: this.advanceTable,
          allotmentID: allotmentID,
          allotmentStatus: allotmentStatus
        }
      });
    dialogRef.afterClosed().subscribe(res => {

      if (res.isClose === false) {
        this.loadData(this._filters, this.currentPage, this.recordsPerPage);
        //this.carAndDriverAllotmentData();
        this.carAndDriverAllotmentDataForUnassociated();
      }
    })

  }
  // PassengerHistory() {
  //   this.dialog.open(PassengerHistoryComponent, {
  //     width:'600px',
  //     data: {
  //       advanceTable: this.advanceTable,
  //       action: 'add',
  //       PassengerID: this.reservationInfo[0].passengerDetails[0].customerPersonID,
  //       cityID:this.reservationInfo[0].pickupCityID,
  //     }
  //   });
  // }

  PassengerHistory() {

    if (!this.reservationInfo || !this.reservationInfo[0]?.pickupCityID) {
      console.error('pickupCityID is missing');

    }

    this.dialog.open(PassengerHistoryComponent, {
      width: '600px',
      data: {
        advanceTable: this.advanceTable,
        action: 'add',
        PassengerID: this.reservationInfo[0]?.passengerDetails?.[0]?.customerPersonID,
        pickupCityID: this.reservationInfo[0]?.pickupCityID,
      }
    });
  }

  DriverFeedbackInfo(i: any) {
    this.dialog.open(DriverFeedbackInfoComponent, {
      data: {
        driverID: this.driverInventoryAssociationDataSource[i].driverID,
        driverName: this.driverInventoryAssociationDataSource[i].driverName
      }
    });
  }

  Actions() {
    this.dialog.open(CarAndDriverActionsFormDialogComponent, {
      data: {
        advanceTable: this.advanceTable,
        action: 'add'
      }
    });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  onContextMenu(event: MouseEvent, item: CarAndDriverAllotment) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  openAllotmentNotification() {
    if (this.reservationInfo[0].allotmentStatus === 'Alloted') {
      const dialogRef = this.dialog.open(AllotmentNotificationDialogComponent,
        {
          data:
          {
            allotmentID: this.reservationInfo[0].allotmentID,
            driverName: this.reservationInfo[0].driverName,
            reservationID: this.reservationInfo[0].reservationID
          }
        });
    }
    if (this.reservationInfo[0].allotmentStatus === 'Cancelled' || this.reservationInfo[0].allotmentStatus === null) {
      Swal.fire({
        title: '',
        text: 'Cannot Send Notification To Cancelled Allotment or Unalloted Allotment',
        icon: 'warning',
      });
    }
  }

  openAllotmentNotificationReply() {
    if (this.reservationInfo[0].allotmentStatus === 'Alloted') {
      const dialogRef = this.dialog.open(AllotmentNotificationReplyDialogComponent,
        {
          data:
          {
            allotmentID: this.reservationInfo[0].allotmentID,
            reservationID: this.reservationInfo[0].reservationID
          }
        });
    }
    if (this.reservationInfo[0].allotmentStatus === 'Cancelled' || this.reservationInfo[0].allotmentStatus === null) {
      Swal.fire({
        title: '',
        text: 'Cannot Reply Notification To Cancelled Allotment or Unalloted Allotment',
        icon: 'warning',
      });
    }
  }

  garageOutDetails(item: any) {

    this.dispatchByExecutiveService.getgaroutCheckDataDetails(item.dutySlipID).subscribe
      (
        data => {
          this.dataSource = data;
          this.dialog.open(GarageOutDetailsComponent, {
            width: '500px',
            data: {
              row: item,
              dataSource: this.dataSource
            }

          });

        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  reachedDetails(item: any) {

    this.dispatchByExecutiveService.getgaroutCheckDataDetails(item.dutySlipID).subscribe
      (
        data => {
          this.dataSource = data;
          this.dialog.open(ReachedByExecutiveDetailsComponent, {
            width: '500px',
            data: {
              row: item,
              dataSource: this.dataSource
            }

          });

        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }
  PickupDetail(dutySlipID: number) {
    this.dialog.open(PickUpDetailShowComponent, {
      width: '500px',
      data: {
        dutySlipID: dutySlipID
      }
    });
  }

  DropOffDetail(dutySlipID: number) {
    this.dialog.open(DropOffDetailShowComponent, {
      width: '500px',
      data: {
        dutySlipID: dutySlipID
      }
    });
  }

  LocationInDetail(dutySlipID: number) {
    this.dialog.open(LocationInDetailShowComponent, {
      width: '500px',
      data: {
        dutySlipID: dutySlipID
      }
    });
  }
  //--------- Transfer Location Popup ----------
  TransferLocation(reservationID: number) {
    const dialogRef = this.dialog.open(FormDialogComponentTransferLocation,
      {
        data:
        {
          reservationID: reservationID,
          action: 'edit'
        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      // if(res)
      // {
      //   transferedLocation = transferedLocation;
      // }
      //this.TransferLocationData();
    })
  }

  //---------- Transfer Location History ----------
  TransferLocationHistory(reservationID: number) {
    this.dialog.open(ReservationLocationTransferLogComponent,
      {
        width: '500px',
        data:
        {
          reservationID: reservationID,
        }
      });
  }

  //---------- Transfer Location Data ----------
  public TransferLocationData(reservationID: number) {
    this.reservationLocationTransferLogService.getTableData(reservationID).subscribe
      (
        data => {
          this.advanceTableRLT = data;
        },
      );
  }

  // fetchSameCategoryVehicles(vendorType='All', bookingCount?: 0, businessVolume?: string) {
  //   if(vendorType === 'All' || vendorType === undefined || vendorType === null) {
  //     this.vendorType.setValue('All');
  //   } else {
  //     this.vendorType.setValue(vendorType);
  //   }
  //   this.selectedCategory = this.filterByVehicleCategory;
  //   this.category.setValue('');
  //   this.monthlyTarget.setValue('');
  //   this.bookingCount.setValue('');
  //   // this.vendorType.setValue('');
  //   if(this.pickupDate!==""){
  //     this.pickupDate=moment(this.pickupDate).format('MMM DD yyyy');
  //   }

  //   if (this.driverID === undefined || this.driverID === null) {
  //     this.driverID = 0;
  //   }

  //   if(bookingCount == 0) {
  //     this.bookingCount.setValue(0);
  //   } else {
  //     this.bookingCount.setValue('');
  //   }

  //   if(businessVolume === undefined || businessVolume === null) { 
  //     this.monthlyTarget.setValue('');
  //   } else {
  //     this.monthlyTarget.setValue('businessVolume');
  //   }

  //   this.driverInventoryAssociationService.getTableData(
  //     this.driverID,
  //     this.driver?.value || '',
  //     this.supplier?.value || '',
  //     this.selectedCategory ||  '',
  //     this.vehicle?.value || '',
  //     this.inventory?.value || '',
  //     this.searchInventoryName || '',
  //     this.vendorType?.value || '',
  //     this.bookingCount?.value,
  //     this.monthlyTarget?.value || '',
  //     this.otherCriteria?.value || '',
  //     this.PickupDate || '',  // this.pickupDate
  //     this.searchActivationStatus,
  //     this.PageNumber
  //   ).subscribe(
  //     (data: CarAndDriverAllotmentData) => {
  //       if (data && data.driverInventoryAssociationModel) {
  //         this.driverInventoryAssociationDataSource = data.driverInventoryAssociationModel;
  //         this.driverInventoryAssociationDataSource.forEach(element => {
  //           Object.assign(element, { checked: false });
  //         });
  //         this.totalData = data.totalRecords;
  //       } else {
  //         console.warn("No data received from API");
  //         this.driverInventoryAssociationDataSource = null;
  //         this.totalData = 0;
  //       }
  //     },
  //     (error: HttpErrorResponse) => {
  //       console.error("Error fetching data:", error);
  //       this.driverInventoryAssociationDataSource = null;
  //     }
  //   );
  // }

  // fetchSameCategoryVehicles(vendorType = 'All', bookingCount?: number, businessVolume?: string, selectedBadge?: string) {
  //   this.selectedBadge = selectedBadge || ''; // Set the clicked badge as selected

  //   if (!vendorType) {
  //     this.vendorType.setValue('All');
  //   } else {
  //     this.vendorType.setValue(vendorType);
  //   }

  //   this.selectedCategory = this.filterByVehicleCategory;
  //   this.category.setValue('');
  //   this.monthlyTarget.setValue('');
  //   this.bookingCount.setValue('');

  //   if (this.pickupDate !== "") {
  //     this.pickupDate = moment(this.pickupDate).format('MMM DD yyyy');
  //   }

  //   this.driverID = this.driverID || 0;

  //   if (bookingCount == 0) {
  //     this.bookingCount.setValue(0);
  //   } else {
  //     this.bookingCount.setValue('');
  //   }

  //   if (!businessVolume) {
  //     this.monthlyTarget.setValue('');
  //   } else {
  //     this.monthlyTarget.setValue(businessVolume);
  //   }

  //   this.driverInventoryAssociationService.getTableData(
  //     this.driverID,
  //     this.driver?.value || '',
  //     this.supplier?.value || '',
  //     this.selectedCategory || '',
  //     this.vehicle?.value || '',
  //     this.inventory?.value || '',
  //     this.searchInventoryName || '',
  //     this.vendorType?.value || '',
  //     this.bookingCount?.value,
  //     this.monthlyTarget?.value || '',
  //     this.otherCriteria?.value || '',
  //     this.PickupDate || '',
  //     this.searchActivationStatus,
  //     this.PageNumber
  //   ).subscribe(
  //     (data: CarAndDriverAllotmentData) => {
  //       if (data?.driverInventoryAssociationModel) {
  //         this.driverInventoryAssociationDataSource = data.driverInventoryAssociationModel;
  //         this.driverInventoryAssociationDataSource.forEach(element => {
  //           Object.assign(element, { checked: false });
  //         });
  //         this.totalData = data.totalRecords;
  //       } else {
  //         console.warn("No data received from API");
  //         this.driverInventoryAssociationDataSource = null;
  //         this.totalData = 0;
  //       }
  //     },
  //     (error: HttpErrorResponse) => {
  //       console.error("Error fetching data:", error);
  //       this.driverInventoryAssociationDataSource = null;
  //     }
  //   );
  // }

  fetchSameCategoryVehicles(vendorType = 'All', bookingCount?: number, businessVolume?: string, selectedBadge?: string) {
    // 🏷 Selected Badges ko Track karein
    if (!this.selectedBadge) {
      this.selectedBadge = selectedBadge || '';
    } else {
      if (this.selectedBadge.includes(selectedBadge)) {
        return; // Agar already selected hai toh duplicate call avoid karein
      }
      this.selectedBadge += `, ${selectedBadge}`;
    }


    if (!vendorType) {
      this.vendorType.setValue('All');
    } else {
      this.vendorType.setValue(vendorType);
    }

    this.selectedCategory = this.filterByVehicleCategory;
    this.category.setValue('');
    this.monthlyTarget.setValue('');
    this.bookingCount.setValue('');

    if (this.pickupDate !== "") {
      this.pickupDate = moment(this.pickupDate).format('MMM DD yyyy');
    }

    this.driverID = this.driverID || 0;

    if (bookingCount == 0) {
      this.bookingCount.setValue(0);
    } else {
      this.bookingCount.setValue('');
    }

    if (!businessVolume) {
      this.monthlyTarget.setValue('');
    } else {
      this.monthlyTarget.setValue(businessVolume);
    }

    let categories = this.selectedBadge.split(', ').map(category => category.trim()); // ✅ Multiple Categories Array

    let requests = categories.map(category =>
      this.driverInventoryAssociationService.getTableData(
        this.reservationInfo[0].serviceLocationID,
        this.driverID,
        this.driver?.value || '',
        this.driverOfficialIdentityNumber?.value || '',
        this.supplier?.value || '',
        category, // 🔥 Dynamic category selection
        this.vehicle?.value || '',
        this.inventory?.value || '',
        this.searchInventoryName || '',
        this.vendorType?.value || '',
        this.ownedSupplier?.value || '',
        this.bookingCount?.value,
        this.monthlyTarget?.value || '',
        this.otherCriteria?.value || '',
        this.PickupDate || '',
        this.searchActivationStatus,
        this.PageNumber
      )
    );

    // 🔥 Multiple API Calls Ek Saath Execute
    forkJoin(requests).subscribe(
      (results: CarAndDriverAllotmentData[]) => {
        this.driverInventoryAssociationDataSource = []; // ✅ Purane Data Ko Reset Karein

        results.forEach(data => {
          if (data?.driverInventoryAssociationModel) {
            this.driverInventoryAssociationDataSource.push(...data.driverInventoryAssociationModel);
          }
        });

        this.totalData = this.driverInventoryAssociationDataSource.length;
      },
      (error: HttpErrorResponse) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  fetchOwnedCars() {
    this.selectedCategory = this.filterByVehicleCategory;
    this.category.setValue('');
    if (this.pickupDate !== "") {
      this.pickupDate = moment(this.pickupDate).format('MMM DD yyyy');
    }

    if (this.driverID === undefined || this.driverID === null) {
      this.driverID = 0;
    }

    this.driverInventoryAssociationService.getTableData(
      this.reservationInfo[0].serviceLocationID,
      this.driverID,
      this.driver?.value || '',
      this.driverOfficialIdentityNumber?.value || '',
      this.supplier?.value || '',
      this.selectedCategory || '',
      this.vehicle?.value || '',
      this.inventory?.value || '',
      this.searchInventoryName || '',
      this.vendorType?.value || '',
      this.ownedSupplier?.value || '',
      this.bookingCount?.value || '',
      this.monthlyTarget?.value || '',
      this.otherCriteria?.value || '',
      this.PickupDate || '',  // this.pickupDate
      this.searchActivationStatus,
      this.PageNumber
    ).subscribe(
      (data: CarAndDriverAllotmentData) => {
        if (data && data.driverInventoryAssociationModel) {
          this.driverInventoryAssociationDataSource = data.driverInventoryAssociationModel;
          this.driverInventoryAssociationDataSource.forEach(element => {
            Object.assign(element, { checked: false });
          });
          this.totalData = data.totalRecords;
        } else {
          console.warn("No data received from API");
          this.driverInventoryAssociationDataSource = null;
          this.totalData = 0;
        }
      },
      (error: HttpErrorResponse) => {
        console.error("Error fetching data:", error);
        this.driverInventoryAssociationDataSource = null;
      }
    );
  }

  submit() {

  }
  UpdateDriverMobile() {

    const dialogRef = this.dialog.open(UpdateDriverMobileComponent,
      {
        width: '400px',
        data:
        {
          status: this.status
        }

      });
    dialogRef.afterClosed().subscribe(res => {
      if (res.isClose === false) {       
        this.loadData(this._filters, this.currentPage, this.recordsPerPage);
        this.carAndDriverAllotmentDataForUnassociated();
      }

    })

  }



}



