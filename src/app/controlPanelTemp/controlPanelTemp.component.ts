// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlPanelTempService } from './controlPanelTemp.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  ControlPanelData,
  ControlPanelTemp,
  TripDetails
} from './controlPanelTemp.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PackageTypeDropDown } from '../general/packageTypeDropDown.model';
import { OtherFilterFormDialogComponent } from '../otherFilter/dialogs/form-dialog/form-dialog.component';
import { TripFilterFormDialogComponent } from '../tripFilter/dialogs/form-dialog/form-dialog.component';
import { VendorAssignmentComponent } from '../VendorAssignment/VendorAssignment.component';
import { BookerInfoComponent } from '../BookerInfo/BookerInfo.component';
import { PassengerInfoComponent } from '../PassengerInfo/PassengerInfo.component';
import { VehicleCategoryInfoComponent } from '../VehicleCategoryInfo/VehicleCategoryInfo.component';
import { VehicleInfoComponent } from '../VehicleInfo/VehicleInfo.component';
import { PackageInfoComponent } from '../PackageInfo/PackageInfo.component';
import { SpecialInstructionInfoComponent } from '../SpecialInstructionInfo/SpecialInstructionInfo.component';
import { TimeAndAddressInfoComponent } from '../TimeAndAddressInfo/TimeAndAddressInfo.component';
import { StopDetailsInfoComponent } from '../StopDetailsInfo/StopDetailsInfo.component';
import { StopOnMapInfoComponent } from '../StopOnMapInfo/StopOnMapInfo.component';
import { VendorInfoComponent } from '../VendorInfo/VendorInfo.component';
import { VehicleAssignmentComponent } from '../VehicleAssignment/VehicleAssignment.component';
import { TripFilter } from '../tripFilter/tripFilter.model';
import { PrintDutySlipComponent } from '../PrintDutySlip/PrintDutySlip.component';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-controlPanelTemp',
  templateUrl: './controlPanelTemp.component.html',
  styleUrls: ['./controlPanelTemp.component.scss']
})
export class ControlPanelTempComponent implements OnInit {
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
  sortType: string = '';
  sortingData: number = 1;
  dataSource: ControlPanelTemp[];
  controlPanelTempID: number;
  advanceTable: Array<TripDetails> = [];
  SearchControlPanelTemp: string = '';
  SearchTripDate: string = '';
  SearchStatus: string = '';
  SearchVehicle: string = '';
  SearchCity: string = '';
  SearchPackageTypeID: number = 0;
  SearchPackage: string = '';
  SearchBooker: string = '';
  SearchActivationStatus: string = 'Active';
  PageNumber: number = 0;
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
  public cpInfo: ControlPanelData;
  public reservationInfo: ControlPanelTemp;
  vendorID: number = 0;

  totalData = 0;
  recordsPerPage = 10;
  isLoading = true;
  currentPage = 1;
  filters: TripFilter;
  isExpanded = [];
  rowIndex?: number;

  SearchBookingNumber: number = null;
  SearchTripNumber: string = null;
  SearchVendors: string = '';
  SearchDrivers: string = '';
  SearchCars: string = '';
  searchPackages: string = '';
  SearchTripDateFroms: string = '';
  SearchTripDateTo: string = '';
  SearchBookers: string = '';
  SearchPassenger: string = '';
  searchVehicle: string = '';
  searchCity: string = '';
  SearchStatuss: string = '';
  Assignment: string = '';
  SearchDateOfTravel: string = '29/11/2022';
  searchPackageTypes: string = '';
  //SearchPackage: string;
  SearchVendorAssignment: string = 'Assigned';
  SearchTripStatus: string;
  SearchVehicles: string = '';
  SearchTripNotStarted: string;
  SearchTripStarted: string;
  SearchTripEnroute: string = '';
  SearchTripCompleted: string = '';
  searchAssignments: FormControl = new FormControl();
  searchBookingNumber: FormControl = new FormControl();
  searchStatus: FormControl = new FormControl();
  SearchCar: FormControl = new FormControl();
  searchTripNumber: FormControl = new FormControl();
  searchTripDateFrom: FormControl = new FormControl();
  searchTripDateTo: FormControl = new FormControl();
  searchBookers: FormControl = new FormControl();
  searchPassengers: FormControl = new FormControl();
  //SearchVehicle : FormControl = new FormControl();
  SearchCities: FormControl = new FormControl();
  searchTravelDate: FormControl = new FormControl();
  searchPackageType: FormControl = new FormControl();
  searchPackage: FormControl = new FormControl();
  searchvendorAssignment: FormControl = new FormControl();
  searchVendor: FormControl = new FormControl();
  searchTripStatus: FormControl = new FormControl();
  searchDriver: FormControl = new FormControl();
  searchVehicles: FormControl = new FormControl();
  searchTripNotStarted: FormControl = new FormControl();
  searchTripStarted: FormControl = new FormControl();
  searchTripEnroute: FormControl = new FormControl();
  searchTripCompleted: FormControl = new FormControl();

  constructor(
    public route: Router,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public _controlPanelTempService: ControlPanelTempService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public router: ActivatedRoute
  ) {}

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.loadData(
      this.SearchBookingNumber,
      this.SearchCars,
      this.SearchCity,
      this.SearchVendors,
      this.SearchDrivers,
      this.searchPackages,
      this.searchPackageTypes,
      this.SearchVehicles,
      this.SearchStatuss,
      this.SearchTripDateFroms,
      this.SearchTripDateTo,
      this.Assignment,
      this.SearchTripNumber,
      this.SearchBookers,
      this.SearchPassenger,
      this.currentPage,
      this.recordsPerPage,
      this.isLoading,
      this.filters
    );
    //this.isLoading = false;
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.router.queryParams.subscribe((paramsData) => {
      this.user_ID = paramsData.userID;
    });
    // this.OnCities();
    // this.OnVehicle();
    // this.OnVendor();
    // this.OnDriver();
    // this.OnPackageType();
    // this.OnPackage();
    // this.OnBooker();
    // this.OnPassenger();
    //this.getTotalCount();
    this.loadData(
      this.SearchBookingNumber,
      this.SearchCars,
      this.SearchCity,
      this.SearchVendors,
      this.SearchDrivers,
      this.searchPackages,
      this.searchPackageTypes,
      this.SearchVehicles,
      this.SearchStatuss,
      this.SearchTripDateFroms,
      this.SearchTripDateTo,
      this.Assignment,
      this.SearchTripNumber,
      this.SearchBookers,
      this.SearchPassenger,
      this.currentPage,
      this.recordsPerPage,
      this.isLoading,
      this.filters
    );
  }

  // public PassengerLists?: EmployeeBookerDropDown[] = [];
  // filteredPassengerOptions: Observable<EmployeeBookerDropDown[]>;
  // public bookerLists?: EmployeeBookerDropDown[] = [];
  // filteredBookerOptions: Observable<EmployeeBookerDropDown[]>;
  // public CityList?: CityDropDown[] = [];
  // filteredCityOptions: Observable<CityDropDown[]>;
  // public DriverList?: DriverDropDown[] = [];
  // filteredDriverOptions: Observable<DriverDropDown[]>;
  public packageTypesList?: PackageTypeDropDown[] = [];
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;
  // public VendorList?: VendorDropDown[] = [];
  // filteredVendorOptions: Observable<VendorDropDown[]>;
  // public VehicleList?: VehicleDropDown[] = [];
  // filteredVehicleOptions: Observable<VehicleDropDown[]>;

  // public PackageList?: PackageDropDown[] = [];
  // filteredPackageOptions: Observable<PackageDropDown[]>;
  public PackageTypeList?: PackageTypeDropDown[] = [];
  // public StatusList?: ReservationPassengerDropDown[] = [];
  search: FormControl = new FormControl();
  searchPac: FormControl = new FormControl();
  searchCities: FormControl = new FormControl();
  searchStatuss: FormControl = new FormControl();
  SearchPackageType: FormControl = new FormControl();

  // public getTotalCount() {
  //   this._controlPanelTempService.getReservationDetailsCount().subscribe(
  //     (data: number) => {
  //       this.totalData = data;
  //     },
  //     (error: HttpErrorResponse) => {
  //       this.totalData = 0;
  //     }
  //   );
  // }

  // OnCities() {
  //   this._generalService.GetCity().subscribe(
  //     (data) => {
  //       this.CityList = data;
  //       this.filteredCityOptions = this.SearchCities.valueChanges.pipe(
  //         startWith(''),
  //         map((value) => this._filterCities(value || ''))
  //       );
  //     },
  //     (error) => {}
  //   );
  // }

  // private _filterCities(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.CityList.filter((customer) => {
  //     return customer.city.toLowerCase().indexOf(filterValue) === 0;
  //   });
  // }

  // OnVehicle() {
  //   this._generalService.GetVehicle().subscribe(
  //     (data) => {
  //       this.VehicleList = data;
  //       this.filteredVehicleOptions = this.SearchCar.valueChanges.pipe(
  //         startWith(''),
  //         map((value) => this._filterCars(value || ''))
  //       );
  //     },
  //     (error) => {}
  //   );
  // }

  // private _filterCars(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.VehicleList.filter((customer) => {
  //     return customer.vehicle.toLowerCase().indexOf(filterValue) === 0;
  //   });
  // }

  // OnPackage() {
  //   this._generalService.GetPackage().subscribe(
  //     (data) => {
  //       //console.log(this.DriverList);
  //       this.PackageList = data;
  //       this.filteredPackageOptions = this.searchPackage.valueChanges.pipe(
  //         startWith(''),
  //         map((value) => this._filterPacakge(value || ''))
  //       );
  //     },
  //     (error) => {}
  //   );
  // }

  // private _filterPacakge(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.PackageList.filter((customer) => {
  //     return customer.package.toLowerCase().indexOf(filterValue) === 0;
  //   });
  // }

  OnPackageType() {
    this._generalService.GetPackageTypes().subscribe(
      (data) => {
        this.packageTypesList = data;
        this.filteredPackageTypeOptions =
          this.searchPackageType.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterPacakgeTypes(value || ''))
          );
      },
      (error) => {}
    );
  }

  private _filterPacakgeTypes(value: string): any {
    const filterValue = value.toLowerCase();
    return this.packageTypesList.filter((customer) => {
      return customer.packageType.toLowerCase().indexOf(filterValue) === 0;
    });
  }
  // OnPassenger() {
  //   this._generalService.GetPassengerDropDown().subscribe(
  //     (data) => {
  //       this.PassengerLists = data;
  //       this.filteredPassengerOptions = this.searchPassengers.valueChanges.pipe(
  //         startWith(''),
  //         map((value) => this._filterPassenger(value || ''))
  //       );
  //     },
  //     (error) => {}
  //   );
  // }

  // private _filterPassenger(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.PassengerLists.filter((customer) => {
  //     return customer.userName.toLowerCase().indexOf(filterValue) === 0;
  //   });
  // }

  // OnBooker() {
  //   this._generalService.GetBookerDropDown().subscribe(
  //     (data) => {
  //       this.bookerLists = data;
  //       this.filteredBookerOptions = this.searchBookers.valueChanges.pipe(
  //         startWith(''),
  //         map((value) => this._filterBooker(value || ''))
  //       );
  //     },
  //     (error) => {}
  //   );
  // }

  // private _filterBooker(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.bookerLists.filter((customer) => {
  //     return customer.userName.toLowerCase().indexOf(filterValue) === 0;
  //   });
  // }

  // OnDriver() {
  //   this._generalService.GetDriver().subscribe(
  //     (data) => {
  //       this.DriverList = data;
  //       this.filteredDriverOptions = this.searchDriver.valueChanges.pipe(
  //         startWith(''),
  //         map((value) => this._filterDriver(value || ''))
  //       );
  //     },
  //     (error) => {}
  //   );
  // }

  // private _filterDriver(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.DriverList.filter((customer) => {
  //     return customer.driverName.toLowerCase().indexOf(filterValue) === 0;
  //   });
  // }

  // OnVendor() {
  //   this._generalService.GetVendor().subscribe(
  //     (data) => {
  //       this.VendorList = data;
  //       this.filteredVendorOptions = this.searchVendor.valueChanges.pipe(
  //         startWith(''),
  //         map((value) => this._filterVendor(value || ''))
  //       );
  //     },
  //     (error) => {}
  //   );
  // }

  // private _filterVendor(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.VendorList.filter((customer) => {
  //     return customer.vendorName.toLowerCase().indexOf(filterValue) === 0;
  //   });
  // }

  public loadData(
    SearchBookingNumber: number,
    SearchCars: string,
    SearchCity: string,
    SearchVendors: string,
    SearchDrivers: string,
    searchPackages: string,
    searchPackageTypes: string,
    SearchVehicles: string,
    SearchStatuss: string,
    SearchTripDateFroms: string,
    SearchTripDateTo: string,
    Assignment: string,
    SearchTripNumber: string,
    SearchBooker: string,
    SearchPassenger: string,
    currentPage: number,
    pageSize: number,
    isLoading: boolean,
    filters: TripFilter,
    rowIndex?: number
  ) {
    debugger
    this._controlPanelTempService
      .getReservationDetails(
        SearchBookingNumber,
        SearchCars,
        SearchCity,
        SearchVendors,
        SearchDrivers,
        searchPackages,
        searchPackageTypes,
        SearchVehicles,
        SearchStatuss,
        SearchTripDateFroms,
        SearchTripDateTo,
        Assignment,
        SearchTripNumber,
        SearchBooker,
        SearchPassenger,
        currentPage,
        pageSize
      )
      .subscribe(
        (data: ControlPanelData) => {
          if (data != null) {
            this.reservationInfo = data.reservationDetails;
            this.totalData = data.totalRecords;
            if (rowIndex !== undefined) {
              this.isExpanded[rowIndex] = true;
            }
            if (isLoading) {
              this.isLoading = false;
            }
          } else {
            this.reservationInfo = null;
            this.totalData = 0;
          }
        },
        (error: HttpErrorResponse) => {
          this.reservationInfo = null;
        }
      );
  }

  refresh() {
    this.SearchTripDate = '';
    this.SearchStatus = '';
    this.SearchVehicle = '';
    this.SearchCity = '';
    (this.SearchPackageTypeID = 0), (this.SearchPackage = '');
    this.SearchBooker = '';
    this.SearchActivationStatus = 'Active';
    this.PageNumber = 0;
  }

  public SearchData() {
    this.loadData(
      this.SearchBookingNumber,
      this.SearchCars,
      this.SearchCity,
      this.SearchVendors,
      this.SearchDrivers,
      this.searchPackages,
      this.searchPackageTypes,
      this.SearchVehicles,
      this.SearchStatuss,
      this.SearchTripDateFroms,
      this.SearchTripDateTo,
      this.Assignment,
      this.SearchTripNumber,
      this.SearchBooker,
      this.SearchPassenger,
      this.currentPage,
      this.recordsPerPage,
      this.isLoading,
      this.filters
    );
  }

  otherFilter() {
    this.dialog.open(OtherFilterFormDialogComponent, {
      data: {
        advanceTable: this.advanceTable,
        action: 'add'
      }
    });
  }

  tripFilter() {
    this.dialog.open(TripFilterFormDialogComponent, {
      data: {
        advanceTable: this.advanceTable,
        action: 'add'
      }
    });
  }

  // BookingInfo(reservationID: number) {
  //   this.dialog.open(ViewBookingDetailsComponent, {
  //     width: '910px',
  //     data: {
  //       advanceTable: this.advanceTable,
  //       reservationID: reservationID,
  //       status: 'Active',
  //       action: 'View'
  //     }
  //   });
  // }

  BookerInfo(reservationID: number) {
    this.dialog.open(BookerInfoComponent, {
      width: '500px',
      data: {
        advanceTable: this.advanceTable,
        reservationID: reservationID,
        status: 'Active'
      }
    });
  }

  PassengerInfo(userID: number) {
    this.dialog.open(PassengerInfoComponent, {
      width: '500px',
      data: {
        advanceTable: this.advanceTable,
        status: 'Active',
        userID: userID
      }
    });
  }

  PassengerInfoUnReg(
    passengerName: string,
    passengerMobile: string,
    passengerEmail: string
  ) {
    this.dialog.open(PassengerInfoComponent, {
      width: '500px',
      data: {
        advanceTable: this.advanceTable,
        status: 'Active',
        passengerName: passengerName,
        passengerMobile: passengerMobile,
        passengerEmail: passengerEmail
      }
    });
  }

  VehicleCategoryInfo(reservationID: number) {
    this.dialog.open(VehicleCategoryInfoComponent, {
      width: '500px',
      data: {
        advanceTable: this.advanceTable,
        status: 'Active',
        reservationID: reservationID
      }
    });
  }

  VehicleInfo(reservationID: number) {
    this.dialog.open(VehicleInfoComponent, {
      width: '500px',
      data: {
        advanceTable: this.advanceTable,
        status: 'Active',
        reservationID: reservationID
      }
    });
  }

  PackageInfo(reservationID: number) {
    this.dialog.open(PackageInfoComponent, {
      width: '500px',
      data: {
        advanceTable: this.advanceTable,
        reservationID: reservationID,
        status: 'Active'
      }
    });
  }

  SpecialInstructionInfo(reservationID: number) {
    this.dialog.open(SpecialInstructionInfoComponent, {
      width: '500px',
      data: {
        advanceTable: this.advanceTable,
        status: 'Active',
        reservationID: reservationID
      }
    });
  }

  TimeAndAddressInfo(reservationStopID: string) {
    this.dialog.open(TimeAndAddressInfoComponent, {
      width: '750px',
      data: {
        advanceTable: this.advanceTable,
        status: 'Active',
        reservationStopID: reservationStopID
      }
    });
  }

  VendorInfo(vendorID: number) {
    this.dialog.open(VendorInfoComponent, {
      width: '550px',
      data: {
        advanceTable: this.advanceTable,
        reservationVendorID: vendorID
      }
    });
  }

  // ChauffeurInfo(reservationID: number) {
  //   this.dialog.open(ChauffeurInfoComponent, {
  //     width: '550px',
  //     data: {
  //       advanceTable: this.advanceTable,
  //       status: 'Active',
  //       reservationID: reservationID
  //     }
  //   });
  // }

  VendorAssignment(reservationID: number, rowIndex: number) {
    const dialogRef = this.dialog.open(VendorAssignmentComponent, {
      width: '650px',
      data: {
        advanceTable: this.advanceTable,
        reassignStatus: false,
        reservationID: reservationID
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.loadData(
        this.SearchBookingNumber,
        this.SearchCars,
        this.SearchCity,
        this.SearchVendors,
        this.SearchDrivers,
        this.searchPackages,
        this.searchPackageTypes,
        this.SearchVehicles,
        this.SearchStatuss,
        this.SearchTripDateFroms,
        this.SearchTripDateTo,
        this.Assignment,
        this.SearchTripNumber,
        this.SearchBooker,
        this.SearchPassenger,
        this.currentPage,
        this.recordsPerPage,
        this.isLoading,
        this.filters,
        rowIndex
      );
    });
  }

  // VendorAcceptanceInfo(reservationID: number, rowIndex: number) {
  //   const dialogRef = this.dialog.open(VendorAcceptanceComponent, {
  //     width: '650px',
  //     data: {
  //       advanceTable: this.advanceTable,
  //       reservationID: reservationID,
  //       reAcceptanceStatus: false
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe((res: any) => {
  //     this.loadData(
  //       this.SearchBookingNumber,
  //       this.SearchCars,
  //       this.SearchCity,
  //       this.SearchVendors,
  //       this.SearchDrivers,
  //       this.searchPackages,
  //       this.searchPackageTypes,
  //       this.SearchVehicles,
  //       this.SearchStatuss,
  //       this.SearchTripDateFroms,
  //       this.SearchTripDateTo,
  //       this.Assignment,
  //       this.SearchTripNumber,
  //       this.SearchBooker,
  //       this.SearchPassenger,
  //       this.currentPage,
  //       this.recordsPerPage,
  //       this.isLoading,
  //       this.filters,
  //       rowIndex
  //     );
  //   });
  // }

  // VehicleSuppliedInfo(reservationID: number) {
  //   this.dialog.open(VehicleSuppliedInfoComponent, {
  //     width: '500px',
  //     data: {
  //       advanceTable: this.advanceTable,
  //       status: 'Active',
  //       reservationID: reservationID
  //     }
  //   });
  // }

  VehicleAssignment(reservationID: number, rowIndex: number) {
    const dialogRef = this.dialog.open(VehicleAssignmentComponent, {
      width: '700px',
      data: {
        advanceTable: this.advanceTable,
        reservationID: reservationID,
        reassignStatus: false
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.loadData(
        this.SearchBookingNumber,
        this.SearchCars,
        this.SearchCity,
        this.SearchVendors,
        this.SearchDrivers,
        this.searchPackages,
        this.searchPackageTypes,
        this.SearchVehicles,
        this.SearchStatuss,
        this.SearchTripDateFroms,
        this.SearchTripDateTo,
        this.Assignment,
        this.SearchTripNumber,
        this.SearchBooker,
        this.SearchPassenger,
        this.currentPage,
        this.recordsPerPage,
        this.isLoading,
        this.filters,
        rowIndex
      );
    });
  }

  // GarageOut(reservationID: number, rowIndex: number) {
  //   const dialogRef = this.dialog.open(GarageOutInfoComponent, {
  //     width: '700px',

  //     data: {
  //       advanceTable: this.advanceTable,
  //       reservationID: reservationID,
  //       isEdit: false,
  //       reassignStatus: false
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe((res: any) => {
  //     this.loadData(
  //       this.SearchBookingNumber,
  //       this.SearchCars,
  //       this.SearchCity,
  //       this.SearchVendors,
  //       this.SearchDrivers,
  //       this.searchPackages,
  //       this.searchPackageTypes,
  //       this.SearchVehicles,
  //       this.SearchStatuss,
  //       this.SearchTripDateFroms,
  //       this.SearchTripDateTo,
  //       this.Assignment,
  //       this.SearchTripNumber,
  //       this.SearchBooker,
  //       this.SearchPassenger,
  //       this.currentPage,
  //       this.recordsPerPage,
  //       this.isLoading,
  //       this.filters,
  //       rowIndex
  //     );
  //   });
  // }

  // Reached(dutySlipID: number, rowIndex: number) {
  //   const dialogRef = this.dialog.open(ReachedInfoComponent, {
  //     width: '700px',
  //     data: {
  //       advanceTable: this.advanceTable,
  //       dutySlipID: dutySlipID,
  //       isEdit: false
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe((res: any) => {
  //     this.loadData(
  //       this.SearchBookingNumber,
  //       this.SearchCars,
  //       this.SearchCity,
  //       this.SearchVendors,
  //       this.SearchDrivers,
  //       this.searchPackages,
  //       this.searchPackageTypes,
  //       this.SearchVehicles,
  //       this.SearchStatuss,
  //       this.SearchTripDateFroms,
  //       this.SearchTripDateTo,
  //       this.Assignment,
  //       this.SearchTripNumber,
  //       this.SearchBooker,
  //       this.SearchPassenger,
  //       this.currentPage,
  //       this.recordsPerPage,
  //       this.isLoading,
  //       this.filters,
  //       rowIndex
  //     );
  //   });
  // }

  // TripStart(dutySlipID: number, rowIndex: number) {
  //   const dialogRef = this.dialog.open(TripStartInfoComponent, {
  //     width: '700px',
  //     data: {
  //       advanceTable: this.advanceTable,
  //       dutySlipID: dutySlipID
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe((res: any) => {
  //     this.loadData(
  //       this.SearchBookingNumber,
  //       this.SearchCars,
  //       this.SearchCity,
  //       this.SearchVendors,
  //       this.SearchDrivers,
  //       this.searchPackages,
  //       this.searchPackageTypes,
  //       this.SearchVehicles,
  //       this.SearchStatuss,
  //       this.SearchTripDateFroms,
  //       this.SearchTripDateTo,
  //       this.Assignment,
  //       this.SearchTripNumber,
  //       this.SearchBooker,
  //       this.SearchPassenger,
  //       this.currentPage,
  //       this.recordsPerPage,
  //       this.isLoading,
  //       this.filters,
  //       rowIndex
  //     );
  //   });
  // }

  // TripEnd(dutySlipID: number, rowIndex: number) {
  //   const dialogRef = this.dialog.open(TripEndInfoComponent, {
  //     width: '700px',
  //     data: {
  //       advanceTable: this.advanceTable,
  //       dutySlipID: dutySlipID
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe((res: any) => {
  //     this.loadData(
  //       this.SearchBookingNumber,
  //       this.SearchCars,
  //       this.SearchCity,
  //       this.SearchVendors,
  //       this.SearchDrivers,
  //       this.searchPackages,
  //       this.searchPackageTypes,
  //       this.SearchVehicles,
  //       this.SearchStatuss,
  //       this.SearchTripDateFroms,
  //       this.SearchTripDateTo,
  //       this.Assignment,
  //       this.SearchTripNumber,
  //       this.SearchBooker,
  //       this.SearchPassenger,
  //       this.currentPage,
  //       this.recordsPerPage,
  //       this.isLoading,
  //       this.filters,
  //       rowIndex
  //     );
  //   });
  // }

  // GarageIn(dutySlipID: number, rowIndex: number) {
  //   const dialogRef = this.dialog.open(GarageInInfoComponent, {
  //     width: '700px',
  //     data: {
  //       advanceTable: this.advanceTable,
  //       dutySlipID: dutySlipID
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe((res: any) => {
  //     this.loadData(
  //       this.SearchBookingNumber,
  //       this.SearchCars,
  //       this.SearchCity,
  //       this.SearchVendors,
  //       this.SearchDrivers,
  //       this.searchPackages,
  //       this.searchPackageTypes,
  //       this.SearchVehicles,
  //       this.SearchStatuss,
  //       this.SearchTripDateFroms,
  //       this.SearchTripDateTo,
  //       this.Assignment,
  //       this.SearchTripNumber,
  //       this.SearchBooker,
  //       this.SearchPassenger,
  //       this.currentPage,
  //       this.recordsPerPage,
  //       this.isLoading,
  //       this.filters,
  //       rowIndex
  //     );
  //   });
  // }

  PrintDS(reservationID: number) {
    this.dialog.open(PrintDutySlipComponent, {
      width: '800px',
      data: {
        advanceTable: this.advanceTable,
        reservationID: reservationID
      }
    });
  }

  StopDetailsInfo(reservationID: number) {
    this.dialog.open(StopDetailsInfoComponent, {
      width: '650px',
      data: {
        advanceTable: this.advanceTable,
        status: 'Active',
        reservationID: reservationID
      }
    });
  }

  StopsOnMapInfo(reservationID: number) {
    this.dialog.open(StopOnMapInfoComponent, {
      width: '750px',
      data: {
        advanceTable: this.advanceTable,
        status: 'Active',
        reservationID: reservationID
      }
    });
  }

  public Filter() {
    this.PageNumber = 0;
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 5000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  onContextMenu(event: MouseEvent, item: ControlPanelTemp) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  NextCall() {
    if (this.dataSource.length > 0) {
      this.PageNumber++;
      //this.loadData();
    }
  }

  PreviousCall() {
    if (this.PageNumber > 0) {
      this.PageNumber--;
    }
  }

  panelOpenState = false;
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}


