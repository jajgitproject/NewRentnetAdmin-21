// @ts-nocheck
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation, TemplateRef } from '@angular/core';
import { ControlPanelDesignService } from './controlPanelDesign.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GeneralService } from '../general/general.service';

import { DropOffByExecutiveComponent } from '../dropOffByExecutive/dropOffByExecutive.component';
import { FormDialogDropOffByExecutiveComponent } from '../dropOffByExecutive/dialogs/form-dialog/form-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ControlPanelData,
  ControlPanelDetails,
  ControlPanelHeaderData,
  ControlPanelHeaderDetails,
  Filters
} from './controlPanelDesign.model';
import { BookerInfoComponent } from '../BookerInfo/BookerInfo.component';
import { VehicleCategoryInfoComponent } from '../VehicleCategoryInfo/VehicleCategoryInfo.component';
import { VehicleInfoComponent } from '../VehicleInfo/VehicleInfo.component';
import { PackageInfoComponent } from '../PackageInfo/PackageInfo.component';
import { SpecialInstructionInfoComponent } from '../SpecialInstructionInfo/SpecialInstructionInfo.component';
import { PassengerInfoComponent } from '../PassengerInfo/PassengerInfo.component';
import { TimeAndAddressInfoComponent } from '../TimeAndAddressInfo/TimeAndAddressInfo.component';
import { StopDetailsInfoComponent } from '../StopDetailsInfo/StopDetailsInfo.component';
import { StopOnMapInfoComponent } from '../StopOnMapInfo/StopOnMapInfo.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponent } from '../feedBack/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponent as DutySlipQualityCheckFormDialogComponent} from '../dutySlipQualityCheck/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponent as DutySlipQualityCheckedByExecutive } from '../dutySlipQualityCheckedByExecutive/dialogs/form-dialog/form-dialog.component';
import { DutySlipQualityCheckService } from '../dutySlipQualityCheck/dutySlipQualityCheck.service';
import { FormDialogComponentPUBE } from '../pickUpByExecutive/dialogs/form-dialog/form-dialog.component';
import { FormDialogDBEComponent } from '../dispatchByExecutive/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponent as ReachedByExecutiveFormDialogComponent } from '../reachedByExecutive/dialogs/form-dialog/form-dialog.component';
import { PrintDutySlipComponent } from '../PrintDutySlip/PrintDutySlip.component';
import { FormDialogComponent as MessagingDialog } from '../reservationMessaging/dialogs/form-dialog/form-dialog.component';
import { FormDialogSendEmsComponent } from '../sendEmsAndEmail/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponent as SendSMSFormDialogComponent } from '../sendSMS/dialogs/form-dialog/form-dialog.component';
import { MessageType } from '../messageType/messageType.model';
import { SingleDutySingleBillForOutstationComponent } from '../SingleDutySingleBillForOutstation/SingleDutySingleBillForOutstation.component';
import { SingleDutySingleBillForLocalComponent } from '../SingleDutySingleBillForLocal/SingleDutySingleBillForLocal.component';
import { SingleDutySingleBillComponent } from '../singleDutySingleBill/singleDutySingleBill.component';
import { AllotmentStatusDetailsComponent } from '../AllotmentStatusDetails/AllotmentStatusDetails.component';
import { FormDialogGIComponent } from '../garageIn/dialogs/form-dialog/form-dialog.component';
import { DutySlipQualityCheckDetailsComponent } from '../DutySlipQualityCheckDetails/DutySlipQualityCheckDetails.component';
import { DutySlipQualityCheckedByExecutiveService } from '../dutySlipQualityCheckedByExecutive/dutySlipQualityCheckedByExecutive.service';
import { DutySlipQualityCheckedByExecutiveDetailsComponent } from '../DutySlipQualityCheckedByExecutiveDetails/DutySlipQualityCheckedByExecutiveDetails.component';
import { DispatchByExecutiveService } from '../dispatchByExecutive/dispatchByExecutive.service';
import { ReachedByExecutiveDetailsComponent } from '../ReachedByExecutiveDetails/ReachedByExecutiveDetails.component';
import { GarageOutDetailsComponent } from '../GarageOutDetails/GarageOutDetails.component';
import { DropOffDetailShowComponent } from '../dropOffDetailShow/dropOffDetailShow.component';
import { LocationInDetailShowComponent } from '../locationInDetailShow/locationInDetailShow.component';
import { PickUpDetailShowComponent } from '../pickUpDetailShow/pickUpDetailShow.component';
import { FormDialogdriverRemarkComponent } from '../driverRemark/dialogs/form-dialog/form-dialog.component';
import { DriverRemarkService } from '../driverRemark/driverRemark.service';
import { DriverRemarkDetailsComponent } from '../DriverRemarkDetails/DriverRemarkDetails.component';
import { NextDayInstructionFormDialogComponent } from '../nextDayInstruction/dialogs/form-dialog/form-dialog.component';
import { NextDayInstructionService } from '../nextDayInstruction/nextDayInstruction.service';
import { NextDayInstructionDetailsComponent } from '../NextDayInstructionDetails/NextDayInstructionDetails.component';
import { FormDialogComponent as DutySlipImageDialog } from '../dutySlipImage/dialogs/form-dialog/form-dialog.component';

import { DutySlipImageDetailsShowComponent } from '../dutySlipImageDetailsShow/dutySlipImageDetailsShow.component';
import { DutySlipImageService } from '../dutySlipImage/dutySlipImage.service';
//import { SingleDutySingleBillForLocalComponent } from '../SingleDutySingleBillForLocal/SingleDutySingleBillForLocal/SingleDutySingleBillForLocal.component';
import { FormDialogComponent as PasswrodFormDialogComponent } from '../password/dialogs/form-dialog/form-dialog.component';
import { FeedBackAttachmentService } from '../feedBackAttachment/feedBackAttachment.service';
import { FormDialogRDComponent } from '../reservationDetails/dialogs/form-dialog/form-dialog.component';
import { ReservationDetailsService } from '../reservationDetails/reservationDetails.service';
import { PassengerDetailsService } from '../passengerDetails/passengerDetails.service';
import { ReservationDetails } from '../reservationDetails/reservationDetails.model';
import { PassengerDetails } from '../passengerDetails/passengerDetails.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import { CustomerCustomerGroupDropDown } from '../customerShort/customerCustomerGroupDropDown.model';
import { CustomerPersonDropDown } from '../customerPerson/customerPersonDropDown.model';
import { VehicleCategoryDropDown } from '../general/vehicleCategoryDropDown.model';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
import { PackageDropDown } from '../package/packageDropDown.model';
import { SupplierDropDown } from '../supplier/supplierDropDown.model';
import { DriverInventoryAssociationDropDown } from '../driverInventoryAssociation/driverInventoryAssociationDropDown';
import { DisputeTypeDropDown } from '../dispute/disputeTypeDropDown.model';
import moment from 'moment';
import { ReservationLocationTransferLogComponent } from '../reservationLocationTransferLog/reservationLocationTransferLog.component';
import { FormDialogComponent as FormDialogComponentTransferLocation } from '../reservationLocationTransferLog/dialogs/form-dialog/form-dialog.component';
import { ReservationLocationTransferLogService } from '../reservationLocationTransferLog/reservationLocationTransferLog.service';
import { ReservationLocationTransferLogModel } from '../reservationLocationTransferLog/reservationLocationTransferLog.model';
import { FormDialogSendSmsWhatsappMailComponent } from '../sendSmsWhatsappMail/dialogs/form-dialog/form-dialog.component';
import { VendorDetailsComponent } from '../vendorDetails/vendorDetails.component';
import { LocationDetailsComponent } from '../locationDetails/locationDetails.component';
import { CarMovingStatusByAppComponent } from '../carMovingStatusByApp/carMovingStatusByApp.component';
import { AppDataMissingStatusComponent } from '../appDataMissingStatus/appDataMissingStatus.component';
import { AppDataMissingStatusModel } from '../appDataMissingStatus/appDataMissingStatus.model';
import { AppDataMissingStatusService } from '../appDataMissingStatus/appDataMissingStatus.service';
import { incidenceFormDialogComponent } from '../incidence/dialogs/form-dialog/form-dialog.component';
import { IncidenceService } from '../incidence/incidence.service';
import { resolutionFormDialogComponent } from '../resolution/dialogs/form-dialog/form-dialog.component';
import { ResolutionService } from '../resolution/resolution.service';
import { TrackOnMapInfoComponent } from '../trackOnMapInfo/trackOnMapInfo.component';
import { DriverOfficialIdentityNumberDD } from '../general/driverOfficialIdentityNumberDD.model';
import Swal from 'sweetalert2';
import { TotalBookingCountDetailsComponent } from '../totalBookingCountDetails/totalBookingCountDetails.component';
import { FormDialogComponent as InterstateTaxFormDialogComponent } from '../interstateTaxEntry/dialogs/form-dialog/form-dialog.component';
import { InterstateTaxEntryComponent } from '../interstateTaxEntry/interstateTaxEntry.component';
import { InterstateTaxEntryService } from '../interstateTaxEntry/interstateTaxEntry.service';
import { InterstateTaxEntry } from '../interstateTaxEntry/interstateTaxEntry.model';
import { LifeCycleStatusComponent } from '../lifeCycleStatus/lifeCycleStatus.component';
import { LifeCycleStatusService } from '../lifeCycleStatus/lifeCycleStatus.service';
import { LifeCycleStatus } from '../lifeCycleStatus/lifeCycleStatus.model';
import { NoDataDialogComponent } from '../no-data-dialog/no-data-dialog.component';
import { FormDialogComponent as PassToSupplierFormDialogComponent } from '../passToSupplier/dialogs/form-dialog/form-dialog.component';
import { PassToSupplierService } from '../passToSupplier/passToSupplier.service';
import { PassToSupplierModel } from '../passToSupplier/passToSupplier.model';
import { MTSFormDialogComponent } from '../mailSupplier/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponent as PickupTimeFormDialogComponent } from '../reservation/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponent as FormDialogComponentDutyTracking } from '../dutyTracking/dialogs/form-dialog/form-dialog.component';
import { DutyTrackingComponent } from '../dutyTracking/dutyTracking.component';
import { DutyPostPickUPCallComponent } from '../dutyPostPickUPCall/dutyPostPickUPCall.component';
import { DutyPostPickUPCallService } from '../dutyPostPickUPCall/dutyPostPickUPCall.service';
import { DutyPostPickUPCallModel } from '../dutyPostPickUPCall/dutyPostPickUPCall.model';
import { DutyPostFormDialogComponent } from '../dutyPostPickUPCall/dialogs/form-dialog/form-dialog.component';
import { SoftToHardDialogComponent } from '../cancelAllotment/dialogs/softToHard-Dialog/softToHard-Dialog.component';
import { ControlPanelDialogeComponent } from '../controlPanelDialoge/controlPanelDialoge.component';
import { formatDate } from '@angular/common';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { SpecialInstructionDialogComponent } from '../specialInstruction/dialogs/special-instruction-dialog/special-instruction-dialog.component';
import { ControlPanelDialogeService } from '../controlPanelDialoge/controlPanelDialoge.service';
import { InternalNoteDialogComponent } from '../internalNoteDetails/dialogs/internal-note-dialog/internal-note-dialog.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@Component({
  standalone: false,
  selector: 'app-controlPanelDesign',
  templateUrl: './controlPanelDesign.component.html',
  styleUrls: ['./controlPanelDesign.component.scss'],
  encapsulation:ViewEncapsulation.None,
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } }
  ]
})
export class ControlPanelDesignComponent implements OnInit {
  public cpInfo: ControlPanelData;
  public reservationInfo: any[]=[];
  public reservationHeaderInfo: ControlPanelHeaderDetails[];
  public VehicleList?: VehicleDropDown[] = [];
  filteredVehicleOptions: Observable<VehicleDropDown[]>;

  public CustomerGroupList?: CustomerGroupDropDown[] = [];
  filteredCustomerGroupOptions: Observable<CustomerGroupDropDown[]>;

  public CustomersList?: CustomerCustomerGroupDropDown[] = [];
  filteredCustomersOptions: Observable<CustomerCustomerGroupDropDown[]>;

  public CustomerList?: CustomerCustomerGroupDropDown[] = [];
  filteredCustomerOptions: Observable<CustomerCustomerGroupDropDown[]>;

  filteredBookerOptions: Observable<CustomerPersonDropDown[]>;
  public BookerList?: CustomerPersonDropDown[] = [];

  public PassengerList?: CustomerPersonDropDown[] = [];
  filteredPassengerOptions: Observable<CustomerPersonDropDown[]>;

  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  
  public CityList?: CitiesDropDown[] = [];
  filteredCityOptions: Observable<CitiesDropDown[]>;

  public PackageTypeList?:PackageTypeDropDown[]=[]; 
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;

  public PackageList?:PackageDropDown[]=[];
  filteredPackageOptions: Observable<PackageDropDown[]>;

  public SupplierList?:SupplierDropDown[]=[];
  filteredSupplierOptions: Observable<SupplierDropDown[]>;

  filteredVehicleInventoryOptions: Observable<DriverInventoryAssociationDropDown[]>;
  public VehicleInventoryList?: DriverInventoryAssociationDropDown[] = [];

  filteredDriverOptions: Observable<DriverInventoryAssociationDropDown[]>;
  public DriverList?: DriverInventoryAssociationDropDown[] = [];

  filteredDriverOfficialIdentityNumberOptions: Observable<DriverOfficialIdentityNumberDD[]>;
  public DriverOfficialIdentityNumberList?: DriverOfficialIdentityNumberDD[] = [];

  filteredDisputesOptions: Observable<DisputeTypeDropDown[]>;
  public DisputesList?: DisputeTypeDropDown[] = [];

  totalData = 0;
  recordsPerPage = 50;
  isLoading = true;
  currentPage = 1;
  isExpanded = [];
  rowIndex?: number;
  dialogRequestObject: any;
  public _filters: Filters;
  filterForm: FormGroup;
  advanceTable: any;
  dutyqualityCheckAllotmentID: any;
  dutySlipImageAllotmentID: Object;
  dataSource: DutySlipQualityCheckedByExecutive[] | null;
  lifeCycleStatusdataSource: any[] = [];
  dutyPostPickUPCalldataSource: DutyPostPickUPCallModel[] = [];
  data: any;
  role: string;
  canCreateReservation: boolean = false;

  eventsSubject: Subject<boolean> = new Subject<boolean>();
  advanceTableRD: ReservationDetails | null;
  advanceTablePD: PassengerDetails | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  ReservationID: any;
  customerGroupID: any;
  customerID: any;
  passengerID: any;
  bookerID: any;
  vehicleCategoryID: any;
  packageTypeID: any;
  packageID: any;
  supplierID: any;
  showEmptyTableHeader: boolean = false;
  //sortBy:string='Reservation.ReservationID';
  sortBy:string='Reservation.PickupDate, Reservation.PickupTime ';
  orderBy:string='ASC';
  bookingCategory:string='complete';
  showDataPage: boolean = false;

  public advanceTableRLT:ReservationLocationTransferLogModel | null;
  ShowAllLocation: any;

  dataSourceForAppDataMissingStatus: AppDataMissingStatusModel[] | null;
  status:string;
  currentLocationLatitude: string;
  currentLocationLongitude: string;
  currentAddress: any;
  locationBeforeTwoMinutesLatitude: string;
  locationBeforeTwoMinutesLongitude: string;
  locationBeforeTwoMinutesAddress: any;
  dutySlipID: number;
  // incidenceID: any;
  incidenceID: number  
  @Output() newDataAddedEvent = new EventEmitter<boolean>();
  @Input() newDataAddedEvents = new EventEmitter<boolean>();

  searchTerm: any = '';
  selectedFilter: string = 'search';
  SearchBookingNo: string = '';

  sortDirection: 'asc' | 'desc' = 'desc';
  sortColumn: string = 'reservationID';
  
  dataSourceForInterstateTax: InterstateTaxEntry[] | null;
  dataSourceForPassToSupplier: PassToSupplierModel | null;
  public DutyPostPickUPCall:DutyPostPickUPCallModel | null;

  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;

  public TransferLocationList?: OrganizationalEntityDropDown[] = [];
  filteredTransferLocationOptions: Observable<OrganizationalEntityDropDown[]>;
  verifyDutyStatusAndCacellationStatus: any;
    
  constructor(
    public route: Router,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public _dutySlipQualityCheckService:DutySlipQualityCheckService,
    public _dutySlipImageService:DutySlipImageService,
    public _controlPanelDesignService: ControlPanelDesignService,
    public dutySlipQualityCheckedByExecutiveService: DutySlipQualityCheckedByExecutiveService,
    public dispatchByExecutiveService: DispatchByExecutiveService,
    public driverRemarkService: DriverRemarkService, 
    public feedBackAttachmentService: FeedBackAttachmentService,
    public nextDayInstructionService: NextDayInstructionService,
    public lifeCycleStatusService: LifeCycleStatusService,
    public _generalService: GeneralService,
    public router: ActivatedRoute,
    private fb: FormBuilder,
    public reservationDetailsService: ReservationDetailsService,
    private resolutionService: ResolutionService,
     public incidenceService : IncidenceService,
    public passengerDetailsService: PassengerDetailsService,
    public reservationLocationTransferLogService:ReservationLocationTransferLogService,
    public appDataMissingStatusService: AppDataMissingStatusService,
    public interstateTaxEntryService:InterstateTaxEntryService,
    public passToSupplierService: PassToSupplierService,
    public dutyPostPickUPCallService: DutyPostPickUPCallService,
    public controlPanelDialogeService:ControlPanelDialogeService
  ) {
    this._filters = new Filters({});
    this.filterForm = this.createFilterForm();
   }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  @ViewChild('searchDialog') searchDialog: TemplateRef<any>;
// @ViewChild(MatMenuTrigger)
  @ViewChild('topScroll') topScroll!: ElementRef;
  @ViewChild('bottomScroll') bottomScroll!: ElementRef;

  syncScroll(event: Event, source: 'top' | 'bottom') {
    const scrollLeft = (event.target as HTMLElement).scrollLeft;
  
    if (source === 'top') {
      this.bottomScroll.nativeElement.scrollLeft = scrollLeft;
    } else {
      this.topScroll.nativeElement.scrollLeft = scrollLeft;
    }
  }


  onChangedPage(pageData: PageEvent) {
    debugger;
    console.log(this.showDataPage)
    if(this.showDataPage === true)
    {
    const toDate = this.filterForm.value.toDate;
    const fromDate = this.filterForm.value.fromDate ;
    this.filterForm.patchValue({fromDate: fromDate});
    this.filterForm.patchValue({toDate: toDate});
    }
    else
    {
   this.filterForm.patchValue({fromDate: null});
    this.filterForm.patchValue({toDate: null});
    }
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.InitShowAllLocationCheck();
  }

  ngOnInit() {
    
    this.showEmptyTableHeader = false;
    this.role = localStorage.getItem('role');
    if (!this._filters) {
      this._filters = new Filters({});
    }
    if (!this.filterForm) {
      this.filterForm = this.createFilterForm();
    }
    this.safeRun(() => this.FillVehicleDD());
    this.safeRun(() => this.FillCustomerGroupDD());
    this.safeRun(() => this.FillCustomerDDOnPageLoad());
    this.safeRun(() => this.InitBookerOnPageLoad());
    this.safeRun(() => this.InitPassengerOnPageLoad());
    this.safeRun(() => this.InitVehicleCategories());
    this.safeRun(() => this.InitCities());
    this.safeRun(() => this.InitPackageType());
    this.safeRun(() => this.InitPackageOnPageLoad());
    this.safeRun(() => this.InitSupplier());
    this.safeRun(() => this.InitVehicleInventoryOnPageLoad());
    this.safeRun(() => this.InitDriverOnPageLoad());
    this.safeRun(() => this.InitDOINOnPageLoad());
    this.safeRun(() => this.InitDisputesOnPageLoad());
    this.safeRun(() => this.InitLocation());
    this.safeRun(() => this.InitTransferLocation());

    const today = this.formatDate(new Date());
    const now = new Date();
    this.filterForm.patchValue({fromDate: today});
    this.filterForm.patchValue({toDate: today});
    this.filterForm.patchValue({showAllLocation: false});
    // this.filterForm.patchValue({fromTime: now})

    // const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    // this.filterForm.patchValue({toTime: threeHoursLater});
    this.safeRun(() =>
      this.loadDataForHeader(this.bookingCategory, this.currentPage, this.recordsPerPage, this.isLoading)
    );
    this.safeRun(() => this.InitShowAllLocationCheck());

    // Capture status from query params (encrypted) so we can propagate to downstream dialogs
    this.router.queryParams.subscribe((params) => {
      const encStatus = params && params['status'];
      if (encStatus) {
        try {
          const decrypted = this._generalService.decrypt(decodeURIComponent(encStatus));
          let normalized: any = decrypted;
          if (normalized && typeof normalized === 'object') {
            normalized = (normalized.status && typeof normalized.status === 'string') ? normalized.status :
                         (normalized.value && typeof normalized.value === 'string') ? normalized.value : '';
          }
          this.status = (typeof normalized === 'string') ? normalized : '';
        } catch {}
      }
    });

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser?.employee?.PasswordType === 'Default') {
      this.safeRun(() => this.password());
    }

    this.canCreateReservation = localStorage.getItem('canCreateReservation') === 'true';
  }

  private safeRun(action: () => void): void {
    try {
      action();
    } catch (error) {
      console.error('ControlPanel guarded init error:', error);
    }
  }

  onBackPress(event) 
  {
    if (event.keyCode === 8) 
    {
      this.onRadioChange();
    }
  }

  emitEventToChild() {
    this.eventsSubject.next(true);
  }

  newDataAdded(msg: boolean) {
    this.newDataAddedEvent.emit(msg);
  }
  onRadioChange(): void {
    this.filterForm.controls["fromDate"].setValue('');
    this.filterForm.controls["toDate"].setValue('');
    this.filterForm.controls["fromTime"].setValue('');
    this.filterForm.controls["toTime"].setValue('');
    this.showDataPage = false;
    this.loadDataForHeader(this.bookingCategory,this.currentPage, this.recordsPerPage, this.isLoading);
    const today = this.formatDate(new Date());
    const now = new Date();
    this.filterForm.patchValue({fromDate: today});
    this.filterForm.patchValue({toDate: today});
    // this.filterForm.patchValue({fromTime: now})

    // const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    // this.filterForm.patchValue({toTime: threeHoursLater});
  }

  onClick()
  {
    this.filterForm.controls["fromDate"].setValue('');
    this.filterForm.controls["toDate"].setValue('');
    this.filterForm.controls["fromTime"].setValue('');
    this.filterForm.controls["toTime"].setValue('');
    this.loadDataForHeader(this.bookingCategory,this.currentPage, this.recordsPerPage, this.isLoading);
    const today = this.formatDate(new Date());
    const now = new Date();
    this.filterForm.patchValue({fromDate: today});
    this.filterForm.patchValue({toDate: today});
    // this.filterForm.patchValue({fromTime: now})

    // const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    // this.filterForm.patchValue({toTime: threeHoursLater});
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero
    const day = ('0' + date.getDate()).slice(-2); // Add leading zero
    return `${year}-${month}-${day}`; // Adjust format as needed
  }

  private formatTime(date: Date): string {
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${hours}:${minutes}:${seconds}`;
  }

  password() {
    // console.log(item);
    const dialogRef =  this.dialog.open(PasswrodFormDialogComponent, {
      width: '500px',
      disableClose: true, // disable background click
      data: {
        // row: item
      }
    });
    dialogRef.afterOpened().subscribe(() => {
      document.body.classList.add('blur-background');
    });

    dialogRef.afterClosed().subscribe(() => {
      document.body.classList.remove('blur-background');
    });
  }

  createFilterForm(): FormGroup {
    return this.fb.group({
      reservationID: [this._filters.reservationID],
      vendorTripNumber: [this._filters.vendorTripNumber],
      tripStatus: [this._filters.tripStatus],
      qualityStatus: [this._filters.qualityStatus],
      reservationStatus: [this._filters.reservationStatus],
      allotmentStatus: [this._filters.allotmentStatus],
      billingStatus: [this._filters.billingStatus],
      delays: [this._filters.delays],
      security: [this._filters.security],
      disputes: [this._filters.disputes],
      reservationType: [this._filters.reservationType],
      guestType: [this._filters.guestType],
      reservationGroupID:[this._filters.reservationGroupID],
      fromDate: [this._filters.fromDate],
      toDate: [this._filters.toDate],
      fromTime: [this._filters.fromTime],
      toTime: [this._filters.toTime],
      customerGroup: [this._filters.customerGroup],
      customer: [this._filters.customer],
      booker: [this._filters.booker],
      passenger: [this._filters.customer],
      vehicleCategory:[this._filters.vehicleCategory],
      vehicleName: [this._filters.vehicleName],
      city: [this._filters.city],
      packageType: [this._filters.packageType],
      package: [this._filters.package],
      supplier:[this._filters.supplier],
      vehicleInventory:[this._filters.vehicleInventory],
      driver:[this._filters.driver],
      userID:[this._generalService.getUserID()],
      showAllLocation:[this._filters.showAllLocation],
      primarymobile:[this._filters.primarymobile],
      locationName:[this._filters.locationName],
      transferLocationName:[this._filters.transferLocationName],
      driverOfficialIdentityNumber:[this._filters.driverOfficialIdentityNumber],
      gender:[this._filters.gender],
      ownership:[this._filters.ownership],
      contactMobile:[this._filters.contactMobile],
      messageType:[this._filters.messageType],
      customerGroupID:[this._filters.customerGroupID],
      customerID:[this._filters.customerID],
      packageTypeID:[this._filters.packageTypeID],
      packageID:[this._filters.packageID],
      tripType:[this._filters.tripType],
      reservationSourceDetail:[this._filters.reservationSourceDetail]
    });
  }

  public InitShowAllLocationCheck()
  {
    this._controlPanelDesignService.getShowAllLocationCheck(this._generalService.getUserID()).subscribe(
      data => 
      {
        this.ShowAllLocation=data.showAllLocation;
        this.filterForm.patchValue({showAllLocation:this.ShowAllLocation});
        // this.filterForm.controls["fromDate"].setValue('');
        // this.filterForm.controls["toDate"].setValue('');
        this.filterForm.controls["fromTime"].setValue('');
        this.filterForm.controls["toTime"].setValue('');

        this.loadDataForHeader(this.bookingCategory,this.currentPage, this.recordsPerPage, this.isLoading);
        // const today = this.formatDate(new Date());
        // const now = new Date();
        // this.filterForm.patchValue({fromDate: today});
        // this.filterForm.patchValue({toDate: today});
        // this.filterForm.patchValue({fromTime: now})
    
        // const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
        // this.filterForm.patchValue({toTime: threeHoursLater});
      },
      () =>
      {
        this.ShowAllLocation = false;
        this.filterForm.patchValue({showAllLocation: false});
        this.loadDataForHeader(this.bookingCategory, this.currentPage, this.recordsPerPage, this.isLoading);
      }
    );
  }

  sortByColumnName(column: any) 
  {
    if (this.sortColumn === column) 
    {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    else
    {
      this.sortDirection = 'asc';
      this.sortColumn = column;
    }
     const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((value, key) => value?.[key], obj);
  };
  
    this.reservationHeaderInfo.sort((a, b) => {
      // const valueA = a[column]?.toString().toLowerCase() || '';
      // const valueB = b[column]?.toString().toLowerCase() || '';
       const valueA = getNestedValue(a, column)?.toString().toLowerCase() || '';
    const valueB = getNestedValue(b, column)?.toString().toLowerCase() || '';
  
      if (this.sortDirection === 'asc')
      {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      }
      else
      {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  }

  CovertSoftToHard(item:any,i:any)
    {
      debugger;
          if(item.allotmentStatus==='Alloted')
          {
            const dialogRef = this.dialog.open(SoftToHardDialogComponent, 
              {
               width:'400px',
                data: 
                  {
                     advanceTable: item,             
                     allotmentID:item.allotmentID         
                  }
                  
              });
              dialogRef.afterClosed().subscribe(res => {
                  this.loadData(item.reservationID,i);       
              })
            
          }
    }

  refresh() 
  {
    debugger;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this._filters = new Filters({});
       const today = this.formatDate(new Date());
    const now = new Date();
    this.filterForm.patchValue({fromDate: today});
    this.filterForm.patchValue({toDate: today});
    // this.filterForm.controls["fromDate"].setValue('');
    // this.filterForm.controls["toDate"].setValue('');
    // this.filterForm.controls["fromTime"].setValue('');
    // this.filterForm.controls["toTime"].setValue('');
    // this.filterForm.controls["reservationID"].setValue('');
    // this.filterForm.controls["customer"].setValue('');
    // this.filterForm.controls["vehicleInventory"].setValue('');
    // this.filterForm.controls["driver"].setValue('');
    // this.filterForm.controls["primarymobile"].setValue('');
    // this.filterForm.controls["locationName"].setValue('');
    // this.filterForm.controls["city"].setValue('');
    // this.filterForm.controls["reservationStatus"].setValue('');
    //  this.filterForm.controls["allotmentStatus"].setValue('');
    //    this.filterForm.controls["tripStatus"].setValue('');
    //        this.filterForm.controls["qualityStatus"].setValue('');
    // this.filterForm.controls["assignmentStatus"].setValue('');
    // // this.filterForm.controls["gender"].setValue('');
    //   this.filterForm.controls["customerGroup"].setValue('');
    //       this.filterForm.controls["gender"].setValue('');
    // this.filterForm.controls["qualityStatus"].setValue('');
    // this.filterForm.controls["reservationType"].setValue('');
    // this.filterForm.controls["delays"].setValue('');
    // this.filterForm.controls["security"].setValue('');
    // this.filterForm.controls["guestType"].setValue('');
    // this.filterForm.controls["disputes"].setValue('');
    // this.filterForm.controls["vendorTripNumber"].setValue('');
    // this.filterForm.controls["customerGroup"].setValue('');
    // this.filterForm.controls["customer"].setValue('');
    // this.filterForm.controls["booker"].setValue('');
    // this.filterForm.controls["passenger"].setValue('');
    // this.filterForm.controls["vehicleCategory"].setValue('');
    // this.filterForm.controls["vehicleName"].setValue('');
    // this.filterForm.controls["packageType"].setValue('');
    // this.filterForm.controls["package"].setValue('');
    // this.filterForm.controls["supplier"].setValue('');
    // this.filterForm.controls["vehicleInventory"].setValue('');
    // this.filterForm.controls["driver"].setValue('');
    // this.filterForm.controls["driverOfficialIdentityNumber"].setValue('');
    
    this.loadDataForHeader('complete',this.currentPage,50,true);
  }

  public loadDataForHeader(status:string,currentPage: number,pageSize: number,isLoading: boolean,rowIndex?: number)
  {
    if (this.selectedFilter === 'BookingNo')
    {
      this.filterForm.patchValue({ reservationID: this.searchTerm });
    }
    else if (this.selectedFilter === 'Customer')
    {
      this.filterForm.patchValue({ customer: this.searchTerm });
    }
    else if (this.selectedFilter === 'CarNo')
    {
      this.filterForm.patchValue({ vehicleInventory: this.searchTerm });
    }
    else if (this.selectedFilter === 'Driver')
    {
      this.filterForm.patchValue({ driver: this.searchTerm });
    }
    else if (this.selectedFilter === 'GuestMobileNo')
    {
      this.filterForm.patchValue({ primarymobile: this.searchTerm });
    }
    else if (this.selectedFilter === 'Location')
    {
      this.filterForm.patchValue({ locationName: this.searchTerm });
    }
    else if (this.selectedFilter === 'City')
    {
      this.filterForm.patchValue({ city: this.searchTerm });
    } 
    else
    {
      this.filterForm.patchValue({ BookingNo: '' });
    }
    this._controlPanelDesignService.getReservationHeaderDetails(status,this.filterForm.getRawValue(),currentPage,pageSize,this.sortBy,this.orderBy).subscribe(
      (data: ControlPanelHeaderData) => {
          if (data != null) 
          {
            this.reservationHeaderInfo = data.reservationHeaderDetails;
            this.totalData = data.totalRecords;
            console.log(this.reservationHeaderInfo)

            if (rowIndex !== undefined)
            {
              this.isExpanded[rowIndex] = true;
            }
            if (isLoading) 
            {
              this.isLoading = false;
            }
          } 
          else 
          {
            this.reservationHeaderInfo = [];
            this.totalData = 0;
            this.isLoading = false;
          }
        },
        (error: HttpErrorResponse) => {
          this.reservationHeaderInfo = [];
          this.totalData = 0;
          this.isLoading = false;
        }
      );
  }

  trimBookingNo()
  {
    const value = this.filterForm.get('reservationID')?.value;
    if (value)
    {
      this.filterForm.patchValue({
        reservationID: value.toString().trim()
      });
    }
  }

  public loadData(reservationID:any,index:number) {
    this._controlPanelDesignService.getReservationDetails(reservationID).subscribe(
        (data: ControlPanelData) => 
        {
            this.reservationInfo[index] = data.reservationDetails;
            console.log(this.reservationInfo[index]);
        },
        (error: HttpErrorResponse) => {
          this.reservationInfo[index] = null;
        }
      );
  }

  InitLocation()
  {
    this._generalService.GetOrganizationalEntity().subscribe(
    data=>
    {
      this.OrganizationalEntityList=data;
      this.filteredOrganizationalEntityOptions = this.filterForm.controls.locationName.valueChanges.pipe(
        startWith(""),
        map(value => this._filterLocationName(value || ''))
      ); 
    });
  }
  
  private _filterLocationName(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.OrganizationalEntityList.filter(
      data => 
      {
        return data.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  InitTransferLocation()
  {
    this._generalService.GetOrganizationalEntity().subscribe(
    data=>
    {
      this.TransferLocationList=data;
      this.filteredTransferLocationOptions = this.filterForm.controls.transferLocationName.valueChanges.pipe(
        startWith(""),
        map(value => this._filterTransferLocation(value || ''))
      ); 
    });
  }
  
  private _filterTransferLocation(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.TransferLocationList.filter(
      data => 
      {
        return data.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  //Customer Group
  FillCustomerGroupDD() {
    this._generalService.GetCustomersGroups().subscribe(
      (data) => {
        this.CustomerGroupList = data;
        this.filteredCustomerGroupOptions =
          this.filterForm.controls.customerGroup.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterCustomerGroup(value || ''))
          );
      },
      (error) => {}
    );
  }

  private _filterCustomerGroup(value: string): any {
    const filterValue = value.toLowerCase();
    // if(filterValue.length === 0) {
    //   return [];
    // }
     if(filterValue.length < 3) {
      return [];
    }
    return this.CustomerGroupList.filter((data) => {
      return data.customerGroup.toLowerCase().indexOf(filterValue) === 0;
    });
  }

  getCustomerGroupID(customerGroupID:any)
  {
    this.customerGroupID=customerGroupID;
    this.filterForm.controls['customer'].setValue('');
    this.filterForm.controls['booker'].setValue('');
    this.filterForm.controls['passenger'].setValue('');
    this.FillCustomerDD();
    this.InitBooker();
    this.InitPassenger();
  }

  onCustomerGroupKeyUp(event) {
    if (event.keyCode === 8) {
      this.filterForm.controls['customer'].setValue('');
      this.filterForm.controls['booker'].setValue('');
      this.filterForm.controls['passenger'].setValue('');
    }
  }

  //For Customers
  FillCustomerDD() {
    this._generalService.GetCustomersForCPSearch(this.customerGroupID).subscribe(
      (data : CustomerCustomerGroupDropDown[]) => {
        this.CustomerList = data;
        console.log(this.CustomerList)
        this.filteredCustomerOptions =
          this.filterForm.controls.customer.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterCustomer(value || ''))
          );
      },
      (error) => {}
    );
  }

  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    // if(filterValue.length === 0) {
    //   return [];
    // }
     if(filterValue.length < 3) {
      return [];
    }
    return this.CustomerList.filter((data) => {
      return data.customerName.toLowerCase().indexOf(filterValue) === 0 || data.customerGroup.toLowerCase().indexOf(filterValue) === 0;
    });
  }
  getCustomerID(customerID:any)
  {
    this.customerID=customerID;
  }

  FillCustomerDDOnPageLoad() {
    this._generalService.getCustomerForCPSearch().subscribe(
      (data : CustomerCustomerGroupDropDown[]) => {
        this.CustomersList = data;
        this.filteredCustomersOptions =
          this.filterForm.controls.customer.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterCustomerOnPageLoad(value || ''))
          );
      },
      (error) => {}
    );
  }

  private _filterCustomerOnPageLoad(value: string): any {
    const filterValue = value.toLowerCase().trim();
    // if(filterValue.length === 0) {
    //   return [];
    // }
     if(filterValue.length < 3) {
      return [];
    }
    return this.CustomersList.filter((data) => {
      const combinedField = `${data.customerName} ${data.customerGroup}`.toLowerCase();
      return combinedField.includes(filterValue);
      //return data.customerName.toLowerCase().indexOf(filterValue) === 0 || data.customerGroup.toLowerCase().indexOf(filterValue) === 0;;
    });
  }
  getCustomerIDOnPageLoad(customerID:any)
  {
    this.customerID=customerID;
  }

    //------------ Booker -----------------
    InitBooker(){
      this._generalService.GetCPForBooker(this.customerGroupID).subscribe(
        data=>
        {
          this.BookerList=data;
          this.filteredBookerOptions = this.filterForm.controls['booker'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterBooker(value || ''))
          ); 
        });
    }
  
    private _filterBooker(value: string): any {
      const filterValue = value.toLowerCase().trim();
      // if(filterValue.length === 0) {
      //   return [];
      // }
       if(filterValue.length < 3) {
      return [];
    }
      return this.BookerList?.filter(
        booker => 
        {
          const combinedField = `${booker.customerPersonName} ${booker.phone} ${booker.customerName}`.toLowerCase();
          return combinedField.includes(filterValue);
          //return customer.customerPersonName.toLowerCase().indexOf(filterValue)===0;
        }
      );
    }
    
    getBookerID(bookerID: any) {
      this.bookerID=bookerID;
    }

    InitBookerOnPageLoad(){
      this._generalService.GetCPForBookerInCPSearch().subscribe(
        data=>
        {
          this.BookerList=data;
          this.filteredBookerOptions = this.filterForm.controls['booker'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterBookerOnPageLoad(value || ''))
          ); 
        });
    }
  
    private _filterBookerOnPageLoad(value: string): any {
      const filterValue = value.toLowerCase().trim();
      // if(filterValue.length === 0) {
      //   return [];
      // }
       if(filterValue.length < 3) {
      return [];
    }
      return this.BookerList?.filter(
        booker => 
        {
          const combinedField = `${booker.customerPersonName} ${booker.phone} ${booker.customerName}`.toLowerCase();
          return combinedField.includes(filterValue);
          //return customer.customerPersonName.toLowerCase().indexOf(filterValue)===0;
        }
      );
    }
    
    getBookerIDOnPageLoad(bookerID: any) {
      this.bookerID=bookerID;
    }
  
    //------------ Passenger -----------------
    InitPassenger(){
       
      this._generalService.GetCPForPassenger(this.customerGroupID).subscribe(
        data=>
        {
          this.PassengerList=data;
          this.filteredPassengerOptions = this.filterForm.controls['passenger'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterPassenger(value || ''))
          ); 
        });
    }
  
    private _filterPassenger(value: string): any {
      const filterValue = value.toLowerCase().trim();
       if(filterValue.length < 3) {
      return [];
    }
      return this.PassengerList.filter(
        passenger => 
        {
          const combinedField = `${passenger.customerPersonName} ${passenger.phone} ${passenger.customerName}`.toLowerCase();
          return combinedField.includes(filterValue);
          //return customer.customerPersonName.toLowerCase().indexOf(filterValue)===0 || customer.phone.toLowerCase().indexOf(filterValue)===0;
        }
      );
    }
    
    getPassengerID(passengerID: any,passengerName:any) {
      this.passengerID=passengerID;
    }

    InitPassengerOnPageLoad(){
       
      this._generalService.GetCPForPassengerInCPSearch().subscribe(
        data=>
        {
          this.PassengerList=data;
          this.filteredPassengerOptions = this.filterForm.controls['passenger'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterPassengerOnPageLoad(value || ''))
          ); 
        });
    }
  
    private _filterPassengerOnPageLoad(value: string): any {
      const filterValue = value.toLowerCase().trim();
      // if(filterValue.length === 0) {
      //   return [];
      // }
       if(filterValue.length < 3) {
      return [];
    }
      return this.PassengerList.filter(
        passenger => 
        {
          const combinedField = `${passenger.customerPersonName} ${passenger.phone} ${passenger.customerName}`.toLowerCase();
          return combinedField.includes(filterValue);
          //return customer.customerPersonName.toLowerCase().indexOf(filterValue)===0 || customer.phone.toLowerCase().indexOf(filterValue)===0;
        }
      );
    }
    
    getPassengerIDOnPageLoad(passengerID: any,passengerName:any) {
      this.passengerID=passengerID;
    }

    // Vehicle Category
    InitVehicleCategories(){
      this._generalService.GetVehicleCategories().subscribe(
        data=>
        {
          this.VehicleCategoryList=data;
          this.filteredVehicleCategoryOptions = this.filterForm.controls["vehicleCategory"].valueChanges.pipe(
            startWith(""),
            map(value => this._filter(value || ''))
          ); 
        });
    }
    private _filter(value: string): any {
  const filterValue = (value || '').toLowerCase();

  // 3 character required
  if (filterValue.length < 3) {
    return [];
  }

  return this.VehicleCategoryList.filter(customer =>
    customer.vehicleCategory.toLowerCase().startsWith(filterValue)
  );
}

//     private _filter(value: string): any {

//   const filterValue = (value || '').toLowerCase();
//   if (!filterValue || filterValue.length < 3) {
//     return []; 
//   }
//   return this.VehicleCategoryList.filter(customer =>
//     customer.vehicleCategory.toLowerCase().indexOf(filterValue) === 0
//   );
// }

    
    // private _filter(value: string): any {
    //   const filterValue = value.toLowerCase();
    //   return this.VehicleCategoryList.filter(
    //     customer => 
    //     {
    //       return customer.vehicleCategory.toLowerCase().indexOf(filterValue)===0;
    //     }
    //   );
    // }
    
    getTitles(vehicleCategoryID: any) {   
      this.vehicleCategoryID=vehicleCategoryID;
      this.filterForm.controls["vehicleName"].setValue('');
      this.InitVehicleDD();
    }

    onVehicleCategoryChanges(event:any)
  {
    if(event.keyCode===8)
    {
      this.filterForm.controls["vehicleName"].setValue('');
      this.InitVehicleDD();
    }
  }

    //Vehicle
    FillVehicleDD() {
      this._generalService.GetVehicle().subscribe(
        (data) => {
          this.VehicleList = data;
          this.filteredVehicleOptions =
            this.filterForm.controls.vehicleName.valueChanges.pipe(
              startWith(''),
              map((value) => this._filterVehicle(value || ''))
            );
        },
        (error) => {}
      );
    }
  private _filterVehicle(value: string): any {
  const filterValue = (value || '').toLowerCase();
  if (filterValue.length < 3) {
    return [];
  }

  return this.VehicleList.filter(data =>
    data.vehicle.toLowerCase().startsWith(filterValue)
  );
}

    // private _filterVehicle(value: string): any {
    //   const filterValue = value.toLowerCase();
    //   if(filterValue.length === 0) {
    //     return [];
    //   }
    //   return this.VehicleList.filter((data) => {
    //     return data.vehicle.toLowerCase().indexOf(filterValue) === 0;
    //   });
    // }

    InitVehicleDD() {
      this._generalService.GetVehicles(this.vehicleCategoryID).subscribe(
        (data) => {
          this.VehicleList = data;
          this.filteredVehicleOptions =
            this.filterForm.controls.vehicleName.valueChanges.pipe(
              startWith(''),
              map((value) => this._filterVehicleS(value || ''))
            );
        },
        (error) => {}
      );
    }
  
    // private _filterVehicleS(value: string): any {
    //   const filterValue = value.toLowerCase();
    //   if(filterValue.length === 0) {
    //     return [];
    //   }
    //   return this.VehicleList.filter((data) => {
    //     return data.vehicle.toLowerCase().indexOf(filterValue) === 0;
    //   });
    // }
    private _filterVehicleS(value: string): any {

  const filterValue = (value || '').toLowerCase();
  if (!filterValue || filterValue.length < 3) {
    return [];
  }

  return this.VehicleList.filter(data =>
    data.vehicle.toLowerCase().indexOf(filterValue) === 0
  );
}


    //City
    InitCities(){
      this._generalService.GetCitiessAll().subscribe(
        data=>
        {
          this.CityList=data;
          this.filteredCityOptions = this.filterForm.controls["city"].valueChanges.pipe(
            startWith(""),
            map(value => this._filterCity(value || ''))
          ); 
        });
    }
    private _filterCity(value: string): any {
  const filterValue = value.toLowerCase();

  // Only start filtering after 3 characters
  if (filterValue.length < 3) {
    return [];
  }

  return this.CityList.filter(customer => {
    return customer.geoPointName.toLowerCase().indexOf(filterValue) === 0;
  });
}

//     private _filterCity(value: string): any {
//   const filterValue = value.toLowerCase();
//   if (filterValue.length === 0) {
//     return [];
//   }
//   return this.CityList.filter(customer => {
//     return customer.geoPointName.toLowerCase().indexOf(filterValue) === 0;
//   });
// }

    // private _filterCity(value: string): any {
    //   const filterValue = value.toLowerCase();
    //   if(filterValue.length === 0) {
    //     return [];
    //   }
    //   return this.CityList.filter(
    //     customer =>
    //     {
    //       return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
    //     }
    //   );
    // }

    //------------ Type -----------------
  InitPackageType(){
    this._generalService.GetPackgeType().subscribe(
      data=>
      {
        this.PackageTypeList=data;
        this.filteredPackageTypeOptions = this.filterForm.controls['packageType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackageType(value || ''))
        ); 
      });
  }


//   private _filterPackageType(value: string): any {
//   if (!value || value.length < 3) {
//     return []; 
//   }
//   const filterValue = value.toLowerCase();

//   return this.PackageTypeList?.filter(
//     customer =>
//       customer.packageType.toLowerCase().startsWith(filterValue)
//   );
// }

  private _filterPackageType(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PackageTypeList?.filter(
      customer => 
      {
        return customer.packageType.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  getPackageTypeID(packageTypeID: any) { 
    this.packageTypeID=packageTypeID;
    this.filterForm.controls["package"].setValue('');
    this.InitPackage();
  }

  onPackageTypeChanges(event:any)
  {
    if(event.keyCode===8)
    {
      this.filterForm.controls["package"].setValue('');
      this.InitPackageOnPageLoad();
    }
  }

  //------------ Package -----------------
  InitPackage()
  { 
    this._generalService.getPackageForSettleRate(this.packageTypeID).subscribe(
      data=>
      {
        this.PackageList=data;
        this.filteredPackageOptions = this.filterForm.controls['package'].valueChanges.pipe(
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
        return customer.package.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  getPackageID(packageID: any) {
    this.packageID=packageID;
  }

  InitPackageOnPageLoad()
  { 
    this._generalService.GetPackages().subscribe(
      data=>
      {
        this.PackageList=data;
        this.filteredPackageOptions = this.filterForm.controls['package'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackageOnPageLoad(value || ''))
        ); 
      });
  }

  private _filterPackageOnPageLoad(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PackageList?.filter(
      customer => 
      {
        return customer.package.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  //Supplier
  InitSupplier()
  { 
    this._generalService.GetSupplier().subscribe(
      data=>
      {
        this.SupplierList=data;
        this.filteredSupplierOptions = this.filterForm.controls['supplier'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterSupplier(value || ''))
        ); 
      });
  }
  private _filterSupplier(value: string): any[] {
  if (!value || value.length < 3) return [];

  const filterValue = value.toLowerCase();
  return this.SupplierList?.filter(s =>
    s.supplierName?.toLowerCase().includes(filterValue)
  ) || [];
}


  // private _filterSupplier(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   if(filterValue.length === 0) {
  //     return [];
  //   }
  //   return this.SupplierList?.filter(
  //     supplier => 
  //     {
  //       return supplier.supplierName.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
  // }

  getSupplierID(SupplierID:any)
  {
    this.supplierID=SupplierID;
    this.filterForm.controls["vehicleInventory"].setValue('');
    this.filterForm.controls["driver"].setValue('');
    this.InitVehicleInventory();
    this.InitDriver();
    this.InitDriverOfficialIdentityNumber();
  }

  onSupplierChanges(event:any)
  {
    if(event.keyCode===8)
    {
      this.filterForm.controls["vehicleInventory"].setValue('');
      this.filterForm.controls["driver"].setValue('');
      this.InitVehicleInventoryOnPageLoad();
      this.InitDriverOnPageLoad();
      this.InitDOINOnPageLoad();
    }
  }

  //Vehicle Inventory
  InitVehicleInventory(){
    this._generalService.GetDriverInventoryForCpSearch(this.supplierID).subscribe(
      (data)=>
      {
        this.VehicleInventoryList=data;
        this.filteredVehicleInventoryOptions = this.filterForm.controls['vehicleInventory'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicleInventory(value || ''))
        ); 
      });
  }

  private _filterVehicleInventory(value: string): any {
  const filterValue = (value || '').toLowerCase().trim();

  // Minimum 3 characters required
  if (filterValue.length < 3) {
    return [];
  }

  return this.VehicleInventoryList?.filter(vi => {
    const combinedField = `${vi.registrationNumber} ${vi.vehicle} ${vi.driverName} ${vi.supplierName} ${vi.driverPhone}`.toLowerCase();
    return combinedField.includes(filterValue);
  });
}

  // private _filterVehicleInventory(value: string): any {
  //   const filterValue = value.toLowerCase().trim();
  //   if(filterValue.length === 0) {
  //     return [];
  //   }
  //   return this.VehicleInventoryList?.filter(
  //     vi => 
  //     {
  //       const combinedField = `${vi.registrationNumber} ${vi.vehicle} ${vi.driverName} ${vi.supplierName} ${vi.driverPhone}`.toLowerCase();
  //       return combinedField.includes(filterValue);
  //       //return customer.registrationNumber.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
  // }
  
  InitVehicleInventoryOnPageLoad(){
    this._generalService.GetDriverInventoryVehicleForCpSearch().subscribe(
      (data)=>
      {
        this.VehicleInventoryList=data;
        this.filteredVehicleInventoryOptions = this.filterForm.controls['vehicleInventory'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicleInventoryOnPageLoad(value || ''))
        ); 
      });
  }
  private _filterVehicleInventoryOnPageLoad(value: string): any {
  const filterValue = (value || '').toLowerCase().trim();
  if (filterValue.length < 3) {
    return [];
  }

  return this.VehicleInventoryList?.filter(vi => {
    const combinedField = `${vi.registrationNumber} ${vi.vehicle} ${vi.driverName} ${vi.supplierName} ${vi.driverPhone}`.toLowerCase();
    return combinedField.includes(filterValue);
  });
}


  // private _filterVehicleInventoryOnPageLoad(value: string): any {
  //   const filterValue = value.toLowerCase().trim();
  //   if(filterValue.length === 0) {
  //     return [];
  //   }
  //   return this.VehicleInventoryList?.filter(
  //     vi => 
  //     {
  //       const combinedField = `${vi.registrationNumber} ${vi.vehicle} ${vi.driverName} ${vi.supplierName} ${vi.driverPhone}`.toLowerCase();
  //       return combinedField.includes(filterValue);
  //       //return customer.registrationNumber.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
  // }

  //Driver
   InitDriver(){
    this._generalService.GetDriverInventoryForCpSearch(this.supplierID).subscribe(
      (data)=>
      {
        this.DriverList=data;
        this.filteredDriverOptions = this.filterForm.controls['driver'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDriver(value || ''))
        ); 
      });
  }
  private _filterDriver(value: string): any {
  const filterValue = (value || '').toLowerCase().trim();

  // Minimum 3 characters required
  if (filterValue.length < 3) {
    return [];
  }

  return this.DriverList?.filter(driver => {
    const combinedField = `${driver.registrationNumber} ${driver.vehicle} ${driver.driverName} ${driver.supplierName} ${driver.driverPhone}`.toLowerCase();
    return combinedField.includes(filterValue);
  });
}


  // private _filterDriver(value: string): any {
  //   const filterValue = value.toLowerCase().trim();
  //   if(filterValue.length === 0) {
  //     return [];
  //   }
  //   return this.DriverList?.filter(
  //     driver => 
  //     {
  //       const combinedField = `${driver.registrationNumber} ${driver.vehicle} ${driver.driverName} ${driver.supplierName} ${driver.driverPhone}`.toLowerCase();
  //       return combinedField.includes(filterValue);
  //       //return customer.driverName.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
  // }
  
  InitDriverOnPageLoad(){
    this._generalService.GetDriverInventoryVehicleForCpSearch().subscribe(
      (data)=>
      {
        this.DriverList=data;
        this.filteredDriverOptions = this.filterForm.controls['driver'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDriverOnPageLoad(value || ''))
        ); 
      });
  }
  private _filterDriverOnPageLoad(value: string): any {
  const filterValue = (value || '').toLowerCase().trim();

  // Minimum 3 characters required
  if (filterValue.length < 3) {
    return [];
  }

  return this.DriverList?.filter(driver => {
    const combinedField =
      `${driver.registrationNumber} ${driver.vehicle} ${driver.driverName} ${driver.supplierName} ${driver.driverPhone}`.toLowerCase();

    return combinedField.includes(filterValue);
  });
}


  // private _filterDriverOnPageLoad(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   if(filterValue.length === 0) {
  //     return [];
  //   }
  //   return this.DriverList?.filter(
  //     driver => 
  //     {
  //       const combinedField = `${driver.registrationNumber} ${driver.vehicle} ${driver.driverName} ${driver.supplierName} ${driver.driverPhone}`.toLowerCase();
  //       return combinedField.includes(filterValue);
  //       //return customer.driverName.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
  // }

  InitDriverOfficialIdentityNumber(){
    this._generalService.GetDriverOfficialIdentityNumber(this.supplierID).subscribe(
      (data)=>
      {
        this.DriverOfficialIdentityNumberList=data;
        this.filteredDriverOfficialIdentityNumberOptions = this.filterForm.controls['driverOfficialIdentityNumber'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDriverOfficialIdentityNumber(value || ''))
        ); 
      });
  }

  private _filterDriverOfficialIdentityNumber(value: string): any {
  const filterValue = (value || '').toLowerCase().trim();

  // Minimum 3 characters required
  if (filterValue.length < 3) {
    return [];
  }

  return this.DriverOfficialIdentityNumberList?.filter(item =>
    item.driverOfficialIdentityNumber?.toLowerCase().includes(filterValue)
  );
}

  // private _filterDriverOfficialIdentityNumber(value: string): any {
  //   const filterValue = value.toLowerCase().trim();
  //   if(filterValue.length === 0) {
  //     return [];
  //   }
  //   return this.DriverOfficialIdentityNumberList?.filter(
  //     driverOfficialIdentityNumber => 
  //     {
  //       return driverOfficialIdentityNumber.driverOfficialIdentityNumber.toLowerCase().includes(filterValue);
  //       //return customer.driverName.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
  // }

  InitDOINOnPageLoad(){
    this._generalService.GetDOIN().subscribe(
      (data)=>
      {
        this.DriverOfficialIdentityNumberList=data;
        this.filteredDriverOfficialIdentityNumberOptions = this.filterForm.controls['driverOfficialIdentityNumber'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDOINOnPageLoad(value || ''))
        ); 
      });
  }
  private _filterDOINOnPageLoad(value: string): any {
  const filterValue = (value || '').toLowerCase().trim();

  if (filterValue.length < 3) {
    return [];
  }

  return this.DriverOfficialIdentityNumberList?.filter(driver =>
    driver.driverOfficialIdentityNumber?.toLowerCase().includes(filterValue)
  );
}


  // private _filterDOINOnPageLoad(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   if(filterValue.length === 0) {
  //     return [];
  //   }
  //   return this.DriverOfficialIdentityNumberList?.filter(
  //     driver => 
  //     {     
  //       return driver.driverOfficialIdentityNumber.toLowerCase().includes(filterValue);
  //     }
  //   );
  // }

  //Disputes
  InitDisputesOnPageLoad(){
    this._generalService.GetDisputes().subscribe(
      (data)=>
      {
        this.DisputesList=data;
        this.filteredDisputesOptions = this.filterForm.controls['disputes'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDisputesOnPageLoad(value || ''))
        ); 
      });
  }

  private _filterDisputesOnPageLoad(value: string): any {
    const filterValue = value.toLowerCase().trim();
    return this.DisputesList?.filter(
      DisputeType => 
      {
        return DisputeType.disputeType.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  navigateToBooking() {
    //window.open('http://localhost:4200/#/bookingScreen', '_blank');
    //window.open('http://localhost:4200/#/reservationGroupDetails', '_blank');
    window.open(this._generalService.FormURL+'/reservationGroupDetails', '_blank');
  }
  // navigateToBookingForEdit(item) {
  //   // const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(item.customerID.toString()));
  //   // const encryptedCustomerName = encodeURIComponent(this._generalService.encrypt(item.customerName));
  //   const url= this.route.serializeUrl(this.route.createUrlTree(['/reservationGroupDetails'], { queryParams: {
  //     reservationGroupID:item.reservationGroupID
  //   } }));
  //   window.open(this._generalService.FormURL+ url, '_blank');
  // }
  navigateToBookingForEdit(item) {
    // Encrypt the reservationGroupID
    const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(item.reservationGroupID.toString()));
    const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(item.customerID.toString()));
    const encryptedCustomerName = encodeURIComponent(this._generalService.encrypt(item.customerName));
    // Create the URL with encrypted reservationGroupID
    // Pass status for downstream gating (if available)
    const encryptedStatus = this.status ? encodeURIComponent(this._generalService.encrypt(this.status)) : null;
    const url = this.route.serializeUrl(this.route.createUrlTree(['/reservationGroupDetails'], { queryParams: {
      reservationGroupID: encryptedReservationGroupID,
      customerID: encryptedCustomerID,
      customerName: encryptedCustomerName,
      type: 'edit',
      status: encryptedStatus
    }}));
    window.open(this._generalService.FormURL + url, '_blank');
  }
  
  BookingForEdit(item) {
    const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(item.customerID.toString()));
    const encryptedCustomerName = encodeURIComponent(this._generalService.encrypt(item.customerName));
    const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(item.reservationGroupID.toString()));
    const url= this.route.serializeUrl(this.route.createUrlTree(['/bookingScreen'], { queryParams: {
      // reservationGroupID:item.reservationGroupID,reservationID:item.reservationID     
      reservationGroupID: encryptedReservationGroupID                      
    } }));
    window.open(this._generalService.FormURL+ url, '_blank');
  }

  OpenBookingScreenIncomplete(item) {
    const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(item.customerID.toString()));
    const encryptedCustomerName = encodeURIComponent(this._generalService.encrypt(item.customerName));
    const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(item.reservationGroupID.toString()));
    const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(item.reservationID.toString()));

    const url= this.route.serializeUrl(this.route.createUrlTree(['/bookingScreen'], { queryParams: {
      
      reservationID:encryptedReservationID,     
      reservationGroupID: encryptedReservationGroupID             
    } }));
    window.open(this._generalService.FormURL+ url, '_blank');
  }

  OpenBookingScreen(item) {
    console.log(item)
    console.log('Primary Passenger ID:', item.primaryPassengerID); // This logs the value
    const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(item.customerID.toString()));
    const encryptedCustomerName = encodeURIComponent(this._generalService.encrypt(item.customerName));
    const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(item.reservationGroupID.toString()));
    const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(item.reservationID.toString()));
    const encryptedCustomerGroupID = encodeURIComponent(this._generalService.encrypt(item.customerGroupID.toString()));
    // const encryptedPrimaryPassengerID = encodeURIComponent(this._generalService.encrypt(item.primaryPassengerID.toString()));
    // const encryptedPrimaryPassengerName = encodeURIComponent(this._generalService.encrypt(item.primaryPassengerName));
    const encryptedAction = encodeURIComponent(this._generalService.encrypt('edit'));
    const url= this.route.serializeUrl(this.route.createUrlTree(['/bookingScreen'], { queryParams: {
      
      reservationID:encryptedReservationID,     
      reservationGroupID: encryptedReservationGroupID ,
      customerGroupID:encryptedCustomerGroupID, 
      customerID:encryptedCustomerID,
      customerName:encryptedCustomerName,
      // primaryPassengerID: encryptedPrimaryPassengerID,
      // primaryPassengerName: encryptedPrimaryPassengerName,
      action:  encryptedAction                  
    } }));
    window.open(this._generalService.FormURL+ url, '_blank');
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

  reachedByExecutiveManual(item:any){
    if(item.allotmentStatus === 'Alloted'){
      let dialogRef= this.dialog.open(ReachedByExecutiveFormDialogComponent,{
      data:{
        action:'edit',
        allotmentID:item.allotmentID,
        driverName:item.driverName,
        regno:item.registrationNumber,
        reservationID:item.reservationID,
        dutySlipID:item.dutySlipID,
        dutySlipByDriverID:item.dutySlipByDriverID,
        rowRecord: item,
        tab: 'Manual'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        console.log(res);
        item.reportingToGuestDate = res?.reportingToGuestDate; // Update with the received data
        item.reportingToGuestTime = res?.reportingToGuestTime; // Update with the received data
        
        // item.reportingToGuestEntryMethod ="Manual";
      }
  
})
}
}

reachedByExecutiveAPP(item:any){
  if(item.allotmentStatus === 'Alloted'){
    let dialogRef= this.dialog.open(ReachedByExecutiveFormDialogComponent,{
    data:{
      action:'edit',
      allotmentID:item.allotmentID,
      driverName:item.driverName,
      regno:item.registrationNumber,
      reservationID:item.reservationID,
      dutySlipID:item.dutySlipID,
      dutySlipByDriverID:item.dutySlipByDriverID,
      rowRecord: item,
        tab: 'APP'
    }
  });
  dialogRef.afterClosed().subscribe(res => {
    if(res){
      console.log(res);
      item.reportingToGuestDate = res?.reportingToGuestDate; // Update with the received data
      item.reportingToGuestTime = res?.reportingToGuestTime; // Update with the received data
      // item.reportingToGuestEntryMethod ="Manual";
    }

})
}
}
reachedByExecutiveGPS(item:any){
  if(item.allotmentStatus === 'Alloted'){
    let dialogRef= this.dialog.open(ReachedByExecutiveFormDialogComponent,{
    data:{
      action:'edit',
      allotmentID:item.allotmentID,
      driverName:item.driverName,
      regno:item.registrationNumber,
      reservationID:item.reservationID,
      dutySlipID:item.dutySlipID,
      dutySlipByDriverID:item.dutySlipByDriverID,
      rowRecord: item,
      tab: 'GPS'
    }
  });
  dialogRef.afterClosed().subscribe(res => {
    if(res){
      console.log(res);
      item.reportingToGuestDate = res?.reportingToGuestDate; // Update with the received data
      item.reportingToGuestTime = res?.reportingToGuestTime; // Update with the received data
      // item.reportingToGuestEntryMethod ="Manual";
    }

})
}
}

  BookerInfo(item) {
    // const filtered = this.reservationInfo.filter(
    //   (value) => value.reservationID === reservationID
    // )[0];
    console.log(item)
    this.dialog.open(BookerInfoComponent, {
      width: '500px',
      data: {
        advanceTable: item
      }
    });
  }

  VehicleCategoryInfo(item) {
    // const filtered = this.reservationInfo.filter(
    //   (value) => value.reservationID === reservationID
    // )[0];
    this.dialog.open(VehicleCategoryInfoComponent, {
      width: '500px',
      data: {
        advanceTable: item
      }
    });
  }

  VehicleInfo(item) {
    // const filtered = this.reservationInfo.filter(
    //   (value) => value.reservationID === reservationID
    // )[0];
    this.dialog.open(VehicleInfoComponent, {
      width: '500px',
      data: {
        advanceTable: item
      }
    });
  }
  
  SendSMS(reservationId,vehicle,pickupDate,pickupTime,
    registrationNumber,customerPersonName,city,item: any,primaryMobile,primaryEmail) {
    this.dialog.open(SendSMSFormDialogComponent, {
      width: '60%',
      data: {
       
        reservationID:reservationId,
        vehicle:vehicle,
        pickupDate:pickupDate,
        pickupTime:pickupTime,    
        registrationNumber:registrationNumber,
        customerPersonName:customerPersonName,
        city:city,
        primaryMobile:primaryMobile,
        primaryEmail:primaryEmail,
        item: item
      }
    });
  }
  
  qCImage(item: any,i:any){
    if(item.allotmentType === 'Hard'){
    this._dutySlipQualityCheckService.getAllotmentIDForDutyQualityCheck(item.allotmentID).subscribe(
      data => {
        this.dutyqualityCheckAllotmentID=data;
        if(!this.dutyqualityCheckAllotmentID)
        { 
          this.dialogRequestObject = {
            action: 'add',
            dutySlipID:item.dutySlipID,
            reservationID: item.reservationID,
            allotmentID:item.allotmentID,
            driverID:item.driverID,
            driverName:item.driverName,
            inventoryID:item.inventoryID,
            registrationNumber:item.registrationNumber
          };
        }
        if(this.dutyqualityCheckAllotmentID)
        {
          this.dialogRequestObject = {
            action: 'edit',
            dutySlipID:item.dutySlipID,
            reservationID: item.reservationID,
            allotmentID:item.allotmentID,
          };
        }
        let dialogRef = this.dialog.open(DutySlipQualityCheckFormDialogComponent, {
          width:'75%',
          data: this.dialogRequestObject
        });
        dialogRef.afterClosed().subscribe((result: any) => {
          console.log(result);
          if(result){
            item.activationStatus ="Active";
            this.loadData(item.reservationID,i);  
          }

          // this.ngOnInit();
          // if(result !== undefined) {
          //  this.loadData(this.currentPage, this.recordsPerPage, this.isLoading);
          //   //this.viewQcImage(item);
          //   // this.reservationInfo.map(element => {
          //   //   if(element.allotmentID === result.allotmentID){
          //   //     element.isDone = true
          //   //   }
          //   // });
           
          // }
        });
      });
    }
    else{
             
        Swal.fire({
          title: '',
          text: "Hard Allotment Required Before Quality Check.",
          icon: 'warning',
        });
        return;
    }
  }

  openMailToSupplier(reservationID : any)
  {
    const dialogRef = this.dialog.open(MTSFormDialogComponent, 
        {
          width:'60%',
          height:'85%',
          data: 
            {
              reservationID: reservationID
            }
        });
  }

  openSendSmsWhatsappMail(reservationID,vehicle,pickupDate,pickupTime,
    registrationNumber,customerPersonName,city,customerPersonID, item: any)
    {
      this.dialog.open(FormDialogSendSmsWhatsappMailComponent, {
        width: '70%',
        data: {
          // advanceTable: filtered
  
          reservationID:reservationID,
          vehicle:vehicle,
          pickupDate:pickupDate,
          pickupTime:pickupTime,    
          registrationNumber:registrationNumber,
          customerPersonName:customerPersonName,
          city:city,
          item: item,
          customerPersonID:customerPersonID
        }
      });
  
    }
    
  openSendEmsDialog(reservationID,vehicle,pickupDate,pickupTime,
    registrationNumber,customerPersonName,city,customerPersonID, item: any) {
    this.dialog.open(FormDialogSendEmsComponent, {
      width: '70%',
      data: {
        // advanceTable: filtered

        reservationID:reservationID,
        vehicle:vehicle,
        pickupDate:pickupDate,
        pickupTime:pickupTime,    
        registrationNumber:registrationNumber,
        customerPersonName:customerPersonName,
        city:city,
        item: item,
        customerPersonID:customerPersonID
      }
    });
  }

  viewQcImage(item: any,i:any){
    if(item.allotmentType === 'Hard'){
      this._generalService.GetDutyQualityCheckID(item.allotmentID).subscribe((data: any) => {
        if(data !== undefined && data !== 0) {
          let dialogRef = this.dialog.open(DutySlipQualityCheckedByExecutive, {
            data:{
              action: 'edit',
              dutySlipID: item.dutySlipID,
              reservationID: item.reservationID,
              allotmentID: item.allotmentID
            }
          });
          dialogRef.afterClosed().subscribe(res => {       
        if(res){
        item.qcCheckedByExecutivePassed ="Passed";
        this.loadData(item.reservationID,i);  
      }

              //this.loadData(this.currentPage, this.recordsPerPage, this.isLoading);
            
          })
        }
        else{
          Swal.fire({
          title: '',
          text: "Please Do Quality Check Before Verification.",
          icon: 'warning',
        });
        return;
        }
      });
    }
  }

  PackageInfo(item) {
    // const filtered = this.reservationInfo.filter(
    //   (value) => value.reservationID === reservationID
    // )[0];
    this.dialog.open(PackageInfoComponent, {
      width: '500px',
      data: {
        advanceTable: item
      }
    });
  }

  ReservationMessaging(reservationID: number,allotmentID:number) {
    this.dialog.open(MessagingDialog, {
      width: '100%',
      data: {
        reservationID:reservationID,
        allotmentID:allotmentID
        
      }
    });
  }

  PassToSupplier(reservationID: number)
  {
    this.passToSupplierService.getData(reservationID).subscribe
    (
      data => 
      {
        this.dataSourceForPassToSupplier = data;
        if(this.dataSourceForPassToSupplier !== null)
        {
          this.dialog.open(PassToSupplierFormDialogComponent, {
            width: '700px',
            data: {
              reservationID:reservationID,
              action:'edit'
            }
          });
        }
        else
        {
          this.dialog.open(PassToSupplierFormDialogComponent, {
            width: '700px',
            data: {
              reservationID:reservationID,
              action:'add',
              //data:this.dataSourceForPassToSupplier
            }
          });    
        }
      },
    )
  }

  allotmentStatus(item: any) {

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
  bookingCountDetailsInfo() {
    this.dialog.open(TotalBookingCountDetailsComponent, {
      width: '500px',
      data: {}
    });
  }

  vendorStatus(item) {

    this.dialog.open(VendorDetailsComponent, {
      width: '500px',
      data: {
        advanceTable: item
      }
    });
  }
  PassengerInfo(item) {
    // const filtered = this.reservationInfo.filter(
    //   (value) => value.reservationID === reservationID[0] &&
    //      value.customerPersonID === customerPersonID
    //   )[0];
    this.dialog.open(PassengerInfoComponent, {
      width: '500px',
      data: {
        advanceTable: item.passengerDetails
      }
    });
  }

  qCImageDetails(item: any) {
  
    this.QcImageloadData(item)
  }

  garageOutDetails(item: any) {
    console.log(item)
    this.garageOutDetailsloadData(item)
  }

  public garageOutDetailsloadData(item:any) {
   
    this.dispatchByExecutiveService.getgaroutCheckDataDetails(item.dutySlipID).subscribe
      (
        data => {
          this.dataSource = data;
          console.log(this.dataSource)
          this.dialog.open(GarageOutDetailsComponent, {
            width: '500px',
            data: {
              row: item,
              dataSource:this.dataSource
            }
          
          });
         
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  public QcImageloadData(item:any) {
   
    this.dutySlipQualityCheckedByExecutiveService.getdutyQualityCheckDataDetails(item.allotmentID).subscribe
      (
        data => {
          this.dataSource = data;
          console.log(this.dataSource)
          this.dialog.open(DutySlipQualityCheckDetailsComponent, {
            width: '500px',
            data: {
              row: item,
              dataSource:this.dataSource
            }
          
          });
         
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  verifyImageDetails(item: any) {
    // this.dialog.open(DutySlipQualityCheckDetailsComponent, {
    //   width: '500px',
    //   data: {
    //     row: item
    //   }
    
    // });
    // console.log(item)
    this.verifyImageloadData(item)
  }

  public verifyImageloadData(item:any) {
   
    this.dutySlipQualityCheckedByExecutiveService.getdutyQualityCheckDataDetails(item.allotmentID).subscribe
      (
        data => {
          this.dataSource = data;
          console.log(this.dataSource)
          this.dialog.open(DutySlipQualityCheckedByExecutiveDetailsComponent, {
            width: '500px',
            data: {
              row: item,
              dataSource:this.dataSource
            }
          
          });
         
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  reachedDetails(item: any) {
    console.log(item)
    this.reachedDetailsloadData(item)
  }

  public reachedDetailsloadData(item:any) {
   
    this.dispatchByExecutiveService.getgaroutCheckDataDetails(item.dutySlipID).subscribe
      (
        data => {
          this.dataSource = data;
          console.log(this.dataSource)
          this.dialog.open(ReachedByExecutiveDetailsComponent, {
            width: '500px',
            data: {
              row: item,
              dataSource:this.dataSource
            }
          
          });
         
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
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
    debugger
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
    // console.log(filtered)
    this.dialog.open(StopOnMapInfoComponent, {
      width: '750px',
      data: {
        advanceTable: item
      }
    });
  }
  FeedBack(reservationId,cutomerPersonId,allotmentID, primaryPassengerID,dutySlipID,inventoryID,driverID,registrationNumber,driverName,reservationPassengerID,feedbackRemark, item)
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
      {
        
        width:'60%',
        data: 
          {
             advanceTable: this.advanceTable,
             action: 'add',
            reservationID:reservationId,
            customerPersonID:cutomerPersonId,
            allotmentID:allotmentID,
            dutySlipID:dutySlipID,
            primaryPassengerID:primaryPassengerID,
            inventoryID:inventoryID,
            driverID:driverID,
            registrationNumber:registrationNumber,
            driverName:driverName,
            reservationPassengerID:reservationPassengerID,
            feedbackRemark:feedbackRemark,
            customerPersonName:item.customerPerson.customerPersonName,
            item:item 
          }
          
      });
      console.log(item.customerPersonName);
      const dialogInstance = dialogRef.componentInstance;
     
      // Subscribe to the messageSubject to receive messages from the dialog
      dialogInstance.messageSubject.subscribe((data: any) => {
        console.log( data);
        item.feedbackRemark = data.feedbackRemark;
        item.activationStatus = "Active";
        // Handle the received message from the dialog
      });
  }

  // DriverAllotment(reservationID: number,pickupDate:any,pickupAddress:any) {
  //   this.route.navigate(['/CarAndDriverAllotment'], {
  //     queryParams: {
  //       reservationID: reservationID,
  //       pickupDate:pickupDate,
  //       pickupAddress:pickupAddress
  //     }
  //   });

  //   //window.open(window.location.origin + '/newForm');
  // }

DriverAllotment(reservationID: number, reservationGroupID: number, pickupDate: any, pickupAddress: any) {
  console.log('reservationID:', reservationID);
  console.log('reservationGroupID:', reservationGroupID); // <- Confirm this logs correctly
  console.log('pickupDate:', pickupDate);
  console.log('pickupAddress:', pickupAddress);

  if (!reservationGroupID) {
    console.warn('⚠️ reservationGroupID is missing!');
  }

  const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(reservationGroupID.toString()));
  const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(reservationID.toString()));
  const encryptedPickupDate = encodeURIComponent(this._generalService.encrypt(pickupDate));
  const encryptedPickupAddress = encodeURIComponent(this._generalService.encrypt(pickupAddress));
  const encryptedStatus = this.status ? encodeURIComponent(this._generalService.encrypt(this.status)) : undefined;

  console.log('Encrypted reservationGroupID:', encryptedReservationGroupID);

  const url = this.route.serializeUrl(this.route.createUrlTree(
    ['/CarAndDriverAllotment'],
    {
      queryParams: {
        reservationGroupID: encryptedReservationGroupID,
        reservationID: encryptedReservationID,
        pickupDate: encryptedPickupDate,
        pickupAddress: encryptedPickupAddress,
        ...(encryptedStatus ? { status: encryptedStatus } : {})
      }
    }
  ));

  console.log('Final URL:', this._generalService.FormURL + url);

  window.open(this._generalService.FormURL + url, '_blank');
}

// DriverAllotment(reservationID: number, pickupDate: any, pickupAddress: any) {
//   // Encrypt the parameters
//   const encryptedReservationID = this._generalService.encrypt(encodeURIComponent(reservationID.toString()));
//   const encryptedPickupDate = this._generalService.encrypt(encodeURIComponent(pickupDate));
//   const encryptedPickupAddress = this._generalService.encrypt(encodeURIComponent(pickupAddress));

//   // Create the URL with the encrypted values
//   const url = this.route.serializeUrl(this.route.createUrlTree(['/CarAndDriverAllotment'], {
//     queryParams: {
//       reservationID: encryptedReservationID,
//       pickupDate: encryptedPickupDate,
//       pickupAddress: encryptedPickupAddress
//     }
//   }));

//   // Open the new tab with the encrypted URL
//   window.open(this._generalService.FormURL + url, '_blank');
// }

  public SearchData() 
  {

    // if(this.filterForm.value.reservationStatus === 'Incomplete' || this.filterForm.value.reservationStatus === 'Unconfirmed' 
    //   || this.filterForm.value.allotmentStatus === 'Unalloted and Delayed' || this.filterForm.value.billingStatus === 'Verified'
    //   || this.filterForm.value.billingStatus === 'Ready To Bill' || this.filterForm.value.billingStatus === 'Billed')
    // {
    //   this.filterForm.controls["fromDate"].setValue('');
    //   this.filterForm.controls["toDate"].setValue('');
    //   this.filterForm.controls["fromTime"].setValue('');
    //   this.filterForm.controls["toTime"].setValue('');
    //   this.bookingCategory = null;
    // }
    this.showEmptyTableHeader = true;
    this.showDataPage = true;
    this.currentPage=1;
    this.loadDataForHeader(this.bookingCategory,this.currentPage, this.recordsPerPage, this.isLoading);
  }

  pickupByExecutiveManual(item: any){
    if(item.allotmentStatus === 'Alloted'){
      let dialogRef = this.dialog.open(FormDialogComponentPUBE, {
        data: 
        {
          action:'edit',
          allotmentID:item.allotmentID,
          driverName:item.driverName,
          regno:item.registrationNumber,
          reservationID:item.reservationID,
          dutySlipID:item.dutySlipID,
          dutySlipByDriverID:item.dutySlipByDriverID,
          rowRecord: item,
          tab: 'Manual'
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        if(res){
          console.log(res)
          item.pickDate =res?.pickUpDate;
          item.pickTime =res?.pickUpTime;
          // item.pickupEntryMethod ="Manual";
        }
    
  })
  }

  }

  pickupByExecutiveAPP(item: any){
    if(item.allotmentStatus === 'Alloted'){
      let dialogRef = this.dialog.open(FormDialogComponentPUBE, {
        data: 
        {
          action:'edit',
          allotmentID:item.allotmentID,
          driverName:item.driverName,
          regno:item.registrationNumber,
          reservationID:item.reservationID,
          dutySlipID:item.dutySlipID,
          dutySlipByDriverID:item.dutySlipByDriverID,
          rowRecord: item,
             tab: 'APP'
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        if(res){
          console.log(res)
          item.pickDate =res?.pickUpDate;
          item.pickTime =res?.pickUpTime;
          // item.pickupEntryMethod ="Manual";
        }
    
  })
  }

  }
  pickupByExecutiveGPS(item: any){
    if(item.allotmentStatus === 'Alloted'){
      let dialogRef = this.dialog.open(FormDialogComponentPUBE, {
        data: 
        {
          action:'edit',
          allotmentID:item.allotmentID,
          driverName:item.driverName,
          regno:item.registrationNumber,
          reservationID:item.reservationID,
          dutySlipID:item.dutySlipID,
          dutySlipByDriverID:item.dutySlipByDriverID,
          rowRecord: item,
             tab: 'GPS'
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        if(res){
          console.log(res)
          item.pickDate =res?.pickUpDate;
          item.pickTime =res?.pickUpTime;
          // item.pickupEntryMethod ="Manual";
        }
    
  })
  }

  }

  openDropOffByExectiveManual(item: any)
  {
    if(item.allotmentStatus === 'Alloted'){ 
    const dialogRef = this.dialog.open(FormDialogDropOffByExecutiveComponent, 
     {
       data: 
         {
          allotmentID:item.allotmentID,
          driverName:item.driverName,
          regno:item.registrationNumber,
          reservationID:item.reservationID,
          dutySlipID:item.dutySlipID,
          dutySlipByDriverID:item.dutySlipByDriverID,
          rowRecord: item,
          tab: 'Manual'
         }
     });
     dialogRef.afterClosed().subscribe(res => {
        if(res){
          console.log(res);
          item.garageOutDate=res?.dropOffDate;
          item.garageOutTime=res?.dropOffTime;
          // item.dropOffEntryMethod ="Manual";
        }
    
  })
}
}

openDropOffByExectiveAPP(item: any)
{
  if(item.allotmentStatus === 'Alloted'){ 
  const dialogRef = this.dialog.open(FormDialogDropOffByExecutiveComponent, 
   {
     data: 
       {
        allotmentID:item.allotmentID,
        driverName:item.driverName,
        regno:item.registrationNumber,
        reservationID:item.reservationID,
        dutySlipID:item.dutySlipID,
        dutySlipByDriverID:item.dutySlipByDriverID,
        rowRecord: item,
        tab: 'APP'
       }
   });
   dialogRef.afterClosed().subscribe(res => {
      if(res){
        console.log(res);
        item.garageOutDate=res?.dropOffDate;
        item.garageOutTime=res?.dropOffTime;
        // item.dropOffEntryMethod ="Manual";
      }
  
})
}
}

openDropOffByExectiveGPS(item: any)
{
  if(item.allotmentStatus === 'Alloted'){ 
  const dialogRef = this.dialog.open(FormDialogDropOffByExecutiveComponent, 
   {
     data: 
       {
        allotmentID:item.allotmentID,
        driverName:item.driverName,
        regno:item.registrationNumber,
        reservationID:item.reservationID,
        dutySlipID:item.dutySlipID,
        dutySlipByDriverID:item.dutySlipByDriverID,
        rowRecord: item,
        tab:'GPS'
       }
   });
   dialogRef.afterClosed().subscribe(res => {
      if(res){
        console.log(res);
        item.garageOutDate=res?.dropOffDate;
        item.garageOutTime=res?.dropOffTime;
        // item.dropOffEntryMethod ="Manual";
      }
    })
  }
}

  // handleDispatchByQC(item: any)
  // {
  //   if (item.isQCRequiredBeforeDispatch === true || item.activationStatus === true) 
  //   {
  //     this.DispatchByExecutiveManual(item);
  //   } 
  //   else 
  //   {
  //     Swal.fire({
  //       title: '',
  //       text: 'Fill QC Form before Dispatch.',
  //       icon: 'warning',
  //     });
  //   }
  // }

  handleDispatchByQC(item: any)
  {
    this.DispatchByExecutiveManual(item);
  }

  DispatchByExecutiveManual(item: any) {
    if (item.allotmentType === 'Hard') {
      const dialogRef = this.dialog.open(FormDialogDBEComponent, {
        width: '800px',
        data: {
          reservationID: item.reservationID,
          allotmentID: item.allotmentID,
          registrationNumber: item.registrationNumber,
          driverName: item.driverName,
          dutySlipID: item.dutySlipID,
          dutySlipByDriverID: item.dutySlipByDriverID,
          rowRecord: item,
          tab: 'Manual'
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          item.locationOutDate = res?.locationOutDate;
          item.locationOutTime = res?.locationOutTime;
          // item.locationOutEntryMethod ="Manual";
        }
      });
    }
    else{
             
              Swal.fire({
                title: '',
                text: "Only Hard  Alloted Duty Can Be Disptached.",
                icon: 'warning',
              });
              return;
            }
    
  }

   DispatchByExecutiveApp(item: any) {
    if(item.allotmentType === 'Hard'){
      const dialogRef=  this.dialog.open(FormDialogDBEComponent, {
       width: '800px',
       data: {
             reservationID:item.reservationID,
             allotmentID:item.allotmentID,  
             registrationNumber:item.registrationNumber,
             driverName:item.driverName,
             dutySlipID:item.dutySlipID,
             dutySlipByDriverID:item.dutySlipByDriverID,
             rowRecord: item,
             tab:'App'
       }
     });
     dialogRef.afterClosed().subscribe(res => {
      if(res){
        item.locationOutDate=res?.locationOutDate;
        item.locationOutTime=res?.locationOutTime;
         //item.locationOutEntryMethod ="Manual";
      }
    })
    }

    else{
             
              Swal.fire({
                title: '',
                text: "Only Hard  Alloted Duty Can Be Disptached.",
                icon: 'warning',
              });
              return;
            }
   }

   DispatchByExecutiveGPS(item: any) {
    if(item.allotmentType === 'Hard'){
      const dialogRef=  this.dialog.open(FormDialogDBEComponent, {
       width: '800px',
       data: {
             reservationID:item.reservationID,
             allotmentID:item.allotmentID,  
             registrationNumber:item.registrationNumber,
             driverName:item.driverName,
             dutySlipID:item.dutySlipID,
             dutySlipByDriverID:item.dutySlipByDriverID,
             rowRecord: item,
             tab:'GPS'
       }
     });
     dialogRef.afterClosed().subscribe(res => {
      if(res){
        item.locationOutDate=res?.locationOutDate;
        item.locationOutTime=res?.locationOutTime;
         //item.locationOutEntryMethod ="Manual";
      }
    })
    }
    else{            
      Swal.fire({
        title: '',
        text: "Only Hard  Alloted Duty Can Be Disptached.",
        icon: 'warning',
      });
      return;
    }
   }

   PrintDS(item: any) {
    if(item.allotmentStatus === 'Alloted')
    {
      this.dialog.open(PrintDutySlipComponent, {
      width: '800px',
      data: {
        controlPanelData: item
      }
    });
  }
    else{            
      Swal.fire({
        title: '',
        text: "Allotment Required.",
        icon: 'warning',
      });
      return;
    }   
  }

  openGarageInManual(item: any) {
    if(item.allotmentStatus === 'Alloted'){
      const dialogRef=  this.dialog.open(FormDialogGIComponent, {
       width: '800px',
       data: {
             reservationID:item.reservationID,
             allotmentID:item.allotmentID,  
             registrationNumber:item.registrationNumber,
             driverName:item.driverName,
             dutySlipID:item.dutySlipID,
             dutySlipByDriverID:item.dutySlipByDriverID,
             rowRecord: item,
             tab:'Manual'
       }
     });
     dialogRef.afterClosed().subscribe(res => {
      if(res){
        console.log(res)
        item.locationInDate =res?.locationInDate;
        item.locationInTime =res?.locationInTime;
        // item.locationInEntryMethod ="Manual";
      }
    })
    }
   }

   openGarageInApp(item: any) {
    if(item.allotmentStatus === 'Alloted'){
      const dialogRef=  this.dialog.open(FormDialogGIComponent, {
       width: '800px',
       data: {
             reservationID:item.reservationID,
             allotmentID:item.allotmentID,  
             registrationNumber:item.registrationNumber,
             driverName:item.driverName,
             dutySlipID:item.dutySlipID,
             dutySlipByDriverID:item.dutySlipByDriverID,
             rowRecord: item,
             tab:'APP'
       }
     });
     dialogRef.afterClosed().subscribe(res => {
      if(res){
        console.log(res)
        item.locationInDate =res?.locationInDate;
        item.locationInTime =res?.locationInTime;
        // item.locationInEntryMethod ="Manual";
      }
    })
    }
   }
   openGarageInGPS(item: any) {
    if(item.allotmentStatus === 'Alloted'){
      const dialogRef=  this.dialog.open(FormDialogGIComponent, {
       width: '800px',
       data: {
             reservationID:item.reservationID,
             allotmentID:item.allotmentID,  
             registrationNumber:item.registrationNumber,
             driverName:item.driverName,
             dutySlipID:item.dutySlipID,
             dutySlipByDriverID:item.dutySlipByDriverID,
             rowRecord: item,
             tab:'GPS'
       }
     });
     dialogRef.afterClosed().subscribe(res => {
      if(res){
        console.log(res)
        item.locationInDate =res?.locationInDate;
        item.locationInTime =res?.locationInTime;
        // item.locationInEntryMethod ="Manual";
      }
    })
    }
   }

  // SingleDutySingleBillForOutstation(item) {
  //   this.dialog.open(SingleDutySingleBillForOutstationComponent, {
  //     width: '800px',
  //     data: {
  //       controlPanelData: item,
  //       dutySlipID:item.dutySlipID,
  //       reservationID:item.reservationID
  //     }
  //   });
   
  // }

  // openSDSB(item)
  // {
  //   this.dialog.open(SingleDutySingleBillForLocalComponent, {
  //     width: '800px',
  //     height:'90%',
  //     data: {
  //       controlPanelData: item,
  //       dutySlipID:item.dutySlipID,
  //       reservationID:item.reservationID
  //     }
  //   });
  // }
  
  // PrintBill(item: any) {
  //   this.dialog.open(SingleDutySingleBillComponent, {
  //     width: '800px',
  //     height:'80%',
  //     data: {
  //       controlPanelData: item,
  //       dutySlipID:item.dutySlipID,
  //       reservationID:item.reservationID,
  //     }
  //   });
  // }

  PickupDetail(dutySlipID: number) {
    this.dialog.open(PickUpDetailShowComponent, {
      width: '500px',
      data: {
        dutySlipID: dutySlipID
      }
    });
  }

  // driverRemark(dutySlipID: number) {
  //   this.dialog.open(PickUpDetailShowComponent, {
  //     width: '500px',
  //     data: {
  //       dutySlipID: dutySlipID
  //     }
  //   });
  // }

  driverRemark(item: any) {
    console.log(item);
    let dialogRef = this.dialog.open(FormDialogdriverRemarkComponent, {
      data: {
        action: 'edit',
        dutySlipID: item.dutySlipID,
        driverRemark: item.driverRemark,
        rowRecord: item
      }
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result !== undefined && result !== null) {
        item.driverRemark = result.driverRemark;
        item.activationStatus = "Active";
     
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

  driverRemarkDetails(item: any) {
    this.driverRemarkDetailsloadData(item)
  }

  public driverRemarkDetailsloadData(item: any) {
    this.driverRemarkService.getDriverRemarkDetails(item.dutySlipID).subscribe(
      data => {
        this.dataSource = data;
  
        let dialogRef = this.dialog.open(DriverRemarkDetailsComponent, {
          width: '350px',
          data: {
            row: item,
            dataSource: this.dataSource,
          }
        });
  
        dialogRef.afterClosed().subscribe(
          (result: any) => {
            console.log(result);
            if (result !== undefined && result !== null) {
              item.activationStatus ="Active";
            }
          },
          
        );
      },
      (error: HttpErrorResponse) => {
        console.error('Error while fetching driver remark details:', error);
        this.dataSource = null;
      }
    );
  }

  nextDayInstruction(item: any) {
    let dialogRef = this.dialog.open(NextDayInstructionFormDialogComponent, {
      data: {
        action: 'edit',
        dutySlipID: item.dutySlipID,
        nextDayInstruction: item.nextDayInstruction,
        nextDayInstructionDate: item.nextDayInstructionDate,
        nextDayInstructionTime: item.nextDayInstructionTime,

        rowRecord: item
      }
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result !== undefined && result !== null) {
        item.nextDayInstruction = result.nextDayInstruction;
        item.activationStatus = "Active";
     
      }
    });
  }

  nextDayInstructionDetails(item: any) {
    console.log(item)
  this.nextDayInstructionDetailsloadData(item)
}

  public nextDayInstructionDetailsloadData(item: any) {
    this.nextDayInstructionService.getDriverRemarkDetails(item.dutySlipID).subscribe(
      data => {
        this.dataSource = data;
  
        let dialogRef = this.dialog.open(NextDayInstructionDetailsComponent, {
          width: '500px',
          data: {
            row: item,
            dataSource: this.dataSource,
            nextDayInstruction: item.nextDayInstruction,
        nextDayInstructionDate: item.nextDayInstructionDate,
        nextDayInstructionTime: item.nextDayInstructionTime,
          }
        });
  
        dialogRef.afterClosed().subscribe(
          (result: any) => {
            if (result !== undefined && result !== null) {
              item.activationStatus ="Active";
            }
          },
          
        );
      },
      (error: HttpErrorResponse) => {
        console.error('Error while fetching driver remark details:', error);
        this.dataSource = null;
      }
    );
  }

  dutySlipImage(dutySlipID: number) {
    this.dialog.open(DutySlipImageDetailsShowComponent, {
      // width: '250px',
      data: {
        dutySlipID: dutySlipID
      }
    });
  }

  lifeCycleStatus(item: any) {   
    // Call the method to load life cycle status data
    this.lifeCycleStatusLoadData(item);
  }
  
  public lifeCycleStatusLoadData(item: any) {
    this.lifeCycleStatusService.getlifeCycleStatus(item.reservationID).subscribe(
      data => {
        if (data && data.length > 0) {
          this.lifeCycleStatusdataSource = data;
  
          const dialogRef = this.dialog.open(LifeCycleStatusComponent, {
            width: '500px',
            data: {
              row: item,
              reservationID: item.reservationID,
              lifeCycleStatusdataSource: this.lifeCycleStatusdataSource,
            }
          });
        } else {
          // Show a message if no data found
          this.showNoDataMessage();
        }
      },
      (error) => {
        const errorMsg = error?.error?.message || error?.message || 'Unknown error';
        console.error('Failed to fetch life cycle status:', errorMsg);
        this.showNoDataMessage();
      }
    );
  }
  
  // Show message when no data is found
  public showNoDataMessage() {
    this.dialog.open(NoDataDialogComponent, {
      width: '300px',
      data: { message: 'No data found for the given reservation No.' }
    });
  }
  
  openDutySlipImage(item: any) {
    if(item.allotmentStatus === 'Alloted'){
      this._dutySlipImageService.getAllotmentIDForDutySlipImage(item.allotmentID).subscribe(
        data => {
          this.dutySlipImageAllotmentID=data;
          if(!this.dutySlipImageAllotmentID)
          { 
            this.dialogRequestObject = {
              action: 'add',
              dutySlipID:item.dutySlipID,
              reservationID: item.reservationID,
              allotmentID:item.allotmentID,
              driverID:item.driverID,
              driverName:item.driverName,
              inventoryID:item.inventoryID,
              registrationNumber:item.registrationNumber
            };
          }
          if(this.dutySlipImageAllotmentID)
          {
            this.dialogRequestObject = {
              action: 'edit',
              dutySlipID:item.dutySlipID,
              reservationID: item.reservationID,
              allotmentID:item.allotmentID,
            };
          }
          let dialogRef = this.dialog.open(DutySlipImageDialog, {
            data: this.dialogRequestObject
          });
          dialogRef.afterClosed().subscribe((result: any) => {
            console.log(result);
            if(result!==undefined || result!==null){
              item.dutySlipImage = result.dutySlipImage;
              //item.activationStatus ="Active";
            }
  
          });
        });
      }   
   }

  //--------- Transfer Location Popup ----------
  TransferLocation(reservationID:number,i:any)
  {
    const dialogRef = this.dialog.open(FormDialogComponentTransferLocation, 
    {
      data: 
      {
        reservationID:reservationID,     
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.loadData(reservationID,i);  
    })
  }

  //---------- Transfer Location History ----------
  TransferLocationHistory(reservationID:number) 
  {
    this.dialog.open(ReservationLocationTransferLogComponent, 
    {
      width: '500px',
      data: 
      {
        reservationID:reservationID, 
      }
    });
  }

  //---------- Transfer Location Data ----------
  public TransferLocationData(reservationID:number) 
  {
    this.reservationLocationTransferLogService.getTableData(reservationID).subscribe
    (
      data=>   
      {
        this.advanceTableRLT = data;
      },
    );  
  }

  combinedStatusColor(data: any): string {
    const allotment = this.AllotmentOnTime(data);
    const trip = this.TripOnTime(data);
    const car = data.carStatus;
    const reservation = data.reservationStatus;
  
    // All statuses are positive
    if (
      (allotment === 'onTime' || allotment === 'late') &&
      (trip === 'Dispatched' || trip === 'Reached' || trip === 'Pickup' || trip === 'DropOff' || trip === 'GarageIn') &&
      (car === 'Moving' || car === 'Car Moving') &&
      (reservation === 'Confirmed' || reservation === 'Cancelled')
    ) {
      return 'green'; 
    }
  
    // Any critical issue
    if (
      allotment === 'notDone' ||
      trip === 'NotDispatchedLessThanTwoHours' ||
      trip === 'DispatchedButNotReached' ||
      trip === 'NotPickup' ||
      trip === 'NotDropOff' ||
      trip === 'NotGarageIn' ||
      car === 'Not Moving' ||
      (reservation !== 'Confirmed' && reservation !== 'Cancelled')
    ) {
      return 'red'; 
    }
  
    // Default color
    return 'black'; 
  }
  
  //---------- Allotment & Pickup Time Comparison ----------
  AllotmentOnTime(item: any)
  {
    // ------------Pickup DateTime--------------
    var pickupTime = item.pickupTime;
    var pickupTimeConversion = moment(pickupTime).format('HH:mm:ss');
    var pickupDate = item.pickupDate;
    var pickupDateConversion = moment(pickupDate).format('yyyy-MM-DD');
    var pickupDateTime = pickupDateConversion + ' ' + pickupTimeConversion;

    // ------------Allotment DateTime--------------
    var timeofAllotment = item.timeofAllotment;
    var timeofAllotmentConversion = moment(timeofAllotment).format('HH:mm:ss');
    var dateOfAllotment = item.dateOfAllotment;
    var dateOfAllotmentConversion = moment(dateOfAllotment).format('yyyy-MM-DD');
    var allotmentDateTime = dateOfAllotmentConversion + ' ' + timeofAllotmentConversion;

    var diffBtwAllotPickup = new Date(pickupDateTime).getTime() - new Date(allotmentDateTime).getTime();

    const currentDateTime = new Date();
    var systemTime = moment(currentDateTime).format('HH:mm:ss');
    var systemDate = moment(currentDateTime).format('yyyy-MM-DD');
    var systemDateTime = systemDate + ' ' + systemTime;

    var diffBtwSystemPickup = new Date(pickupDateTime).getTime() - new Date(systemDateTime).getTime();

    if (diffBtwAllotPickup > 4 * 60 * 60 * 1000)
    {
      return 'onTime'; // Allotment is done on time
    }
    else if (diffBtwAllotPickup < 4 * 60 * 60 * 1000)
    {
      return 'late'; // Allotment is done but less than 4 hours
    }
    else if (diffBtwSystemPickup < 4 * 60 * 60 * 1000)
    {
      return 'lateNotDone'; // Allotment not done
    }
    else
    {
      return 'notDone';
    }
  }

  getAllotmentDisplay(item: any): { label: string; color: string } {
  const allotmentStatus = this.AllotmentOnTime(item); // 'onTime' | 'late' | 'lateNotDone' | 'notDone'
  const delay = item.lifeCycleStatus?.carAndDriverAllotedDelayInMinutes || 0;
  const isAlloted = item.lifeCycleStatus?.carAndDriverAlloted === 'Yes';
  const type = item.allotmentType;

  if (isAlloted && delay > 0) {
    return { label: `Alloted (${type})`, color: 'red' };
  }

  if (isAlloted && delay === 0) {
    return { label: `Alloted (${type})`, color: 'green' };
  }

  if (allotmentStatus === 'lateNotDone') {
    return { label: 'Pending', color: 'red' };
  }

  if (allotmentStatus === 'notDone') {
    return { label: 'Pending', color: 'black' };
  }

 return { label: 'Pending', color: 'green' }; // if late but still within threshold
}


  //---------- GarageOut,Reached Pickup,Dropoff,GarageIn Time Comparison ----------
  TripOnTime(item: any)
  {
    // ------------GarageOut DateTime--------------
    var locationOutTime = item.locationOutTime;
    var locationOutTimeConversion = moment(locationOutTime).format('HH:mm:ss');
    var locationOutDate = item.locationOutDate;
    var locationOutDateConversion = moment(locationOutDate).format('yyyy-MM-DD');
    var locationOutDateTime = locationOutDateConversion + ' ' + locationOutTimeConversion;

    // ------------Reached DateTime--------------
    var reportingToGuestTime = item.reportingToGuestTime;
    var reportingToGuestTimeConversion = moment(reportingToGuestTime).format('HH:mm:ss');
    var reportingToGuestDate = item.reportingToGuestDate;
    var reportingToGuestDateConversion = moment(reportingToGuestDate).format('yyyy-MM-DD');
    var reportingToGuestDateTime = reportingToGuestDateConversion + ' ' + reportingToGuestTimeConversion;

    // ------------Reservation Pickup DateTime--------------
    var pickupTime = item.pickupTime;
    var pickupTimeConversion = moment(pickupTime).format('HH:mm:ss');
    var pickupDate = item.pickupDate;
    var pickupDateConversion = moment(pickupDate).format('yyyy-MM-DD');
    var pickupDateTime = pickupDateConversion + ' ' + pickupTimeConversion;

    // ------------Duty Pickup DateTime--------------
    var dutyPickUpTime = item.dutyPickUpTime;
    var dutyPickUpTimeConversion = moment(dutyPickUpTime).format('HH:mm:ss');
    var dutyPickUpDate = item.dutyPickUpDate;
    var dutyPickUpDateConversion = moment(dutyPickUpDate).format('yyyy-MM-DD');
    var dutyPickUpDateTime = dutyPickUpDateConversion + ' ' + dutyPickUpTimeConversion;

    // ------------Dropoff DateTime--------------
    var dropOffTime = item.dropOffTime;
    var dropOffTimeConversion = moment(dropOffTime).format('HH:mm:ss');
    var dropOffDate = item.dropOffDate;
    var dropOffDateConversion = moment(dropOffDate).format('yyyy-MM-DD');
    var dropOffDateTime = dropOffDateConversion + ' ' + dropOffTimeConversion;

    // ------------GarageIn DateTime--------------
    var locationInTime = item.locationInTime;
    var locationInTimeConversion = moment(locationInTime).format('HH:mm:ss');
    var locationInDate = item.locationInDate;
    var locationInDateConversion = moment(locationInDate).format('yyyy-MM-DD');
    var locationInDateTime = locationInDateConversion + ' ' + locationInTimeConversion;

    const currentDateTime = new Date();
    var systemTime = moment(currentDateTime).format('HH:mm:ss');
    var systemDate = moment(currentDateTime).format('yyyy-MM-DD');
    var systemDateTime = systemDate + ' ' + systemTime;

    var diffBtwSystemPickup = new Date(pickupDateTime).getTime() - new Date(systemDateTime).getTime();
    var diffBtwPickupLocout = new Date(pickupDateTime).getTime() - new Date(locationOutDateTime).getTime();

    if (diffBtwSystemPickup >= 2 * 60 * 60 * 1000)
    {
      return "NotDispatchedMoreThanTwoHours";
    }
    else if (diffBtwSystemPickup < 2 * 60 * 60 * 1000 && (item.locationOutDate && item.locationOutTime) === null) 
    {
      return "NotDispatchedLessThanTwoHours";
    }
    else if(locationOutDateTime && diffBtwSystemPickup < 20 * 60 * 1000 && (item.reportingToGuestDate && item.reportingToGuestTime) === null)
    {
      return 'DispatchedButNotReached';
    }
    else if(((item.locationOutDate && item.locationOutTime) !== null) && (diffBtwPickupLocout > 20 * 60 * 1000))
    {
      return 'Dispatched';
    }
    else if((item.reportingToGuestDate && item.reportingToGuestTime) !== null)
    {
      return 'Reached';
    }
    else if((item.dutyPickUpDate && item.dutyPickUpTime) === null)
    {
      return 'NotPickup';
    }
    else if((item.dutyPickUpDate && item.dutyPickUpTime) !== null)
    {
      return 'Pickup';
    }
    else if((item.dropOffDate && item.dropOffTime) === null)
    {
      return 'NotDropOff';
    }
    else if((item.dropOffDate && item.dropOffTime) !== null)
    {
      return 'DropOff';
    }
    else if((item.locationInDate && item.locationInTime) === null)
    {
      return 'NotGarageIn';
    }
    else if((item.locationInDate && item.locationInTime) !== null)
    {
      return 'GarageIn';
    }
    // else
    // {
    //   return 'notDone';
    // }
  }
getLifeCycleDisplay(status: any): { label: string; color: string } {
  if (status.garageIn === 'Yes')
 {
    return { label: 'GarageIn', color: 'black' };
  } 
  else if (status.dropped === 'Yes')
 {
    return { label: 'Dropped Off', color: 'black' };
  } 
  else if (status.pickedUp === 'Yes') {
  if (status.pickedUpDelayInMinutes > 0)
 {
      return { label: 'Pickup', color: 'red' };
 } 
  else {
      return { label: 'Pickup', color: 'black' };
    }
  } 
  else if (status.reached === 'Yes') {
    if (status.reachedDelayInMinutes > 0) {
      return { label: 'Reached', color: 'red' };
    } else {
      return { label: 'Reached', color: 'black' };
    }
  } 
  else if (status.dispatched === 'Yes') {
    if (status.dispatchedDelayInMinutes > 0) {
      return { label: 'Dispatch', color: 'red' };
    } else {
      return { label: 'Dispatch', color: 'black' };
    }
  } 
  else if (status.dispatched === 'No') {
    if (status.pickedUpDelayInMinutes > 240) {
      return { label: 'Not Dispatch', color: 'red' };
    } else {
      return { label: 'Not Dispatch', color: 'black' };
    }
  }

  return { label: 'N/A', color: 'black' };
}

  //---------- Car Moving Status By App Popup----------
  CarMovingStatusByApp(item: any) 
  {
    this.dialog.open(CarMovingStatusByAppComponent, {
      width: '500px',
      data: {
        dutySlipID: item.dutySlipID
      }
    });
  }

  //---------- Car Moving Status By App Popup----------
  AppDataMissingStatus(item: any) 
  {
    this.dialog.open(AppDataMissingStatusComponent, {
      width: '500px',
      data: {
        dutySlipID: item.dutySlipID
      }
    });
  }

  incidence(item: any): void {
    if (this.incidenceID !== undefined && (!item.incidenceID || item.incidenceID === 0)) { 
      item.incidenceID = this.incidenceID;
    } else {
      this.incidenceID = item.incidenceID;
    }
    console.log(item);
    console.log(this.incidenceID);
    let dialogRef = this.dialog.open(incidenceFormDialogComponent, {
      width: '60%',
      data: {
        advanceTable: this.advanceTable,
        action: item.incidenceID === 0 ? 'add' : 'edit',
        item: item,
        reservationID: item.reservationID ,
        customerName: item.customerName,
        customerID: item.customerID,
        registrationNumber: item.registrationNumber,
        inventoryID: item.inventoryID,
        customerPersonID: item.customerPersonID,
        driverName: item.driverName,
        organizationalEntityName: item.organizationalEntityName,
        dutySlipID: item.dutySlipID,
        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result) {
        console.log('Dialog result:', result);
        this.incidenceID = result.incidenceID;
        this.emitEventToChild();
        // this.ngOnInit();
      }
    });
    
  }

  resolution(item: any): void {
    if(this.incidenceID === undefined && item.incidenceID != 0) {
      this.incidenceID = item.incidenceID;
    }
    let dialogRef = this.dialog?.open(resolutionFormDialogComponent, {
      width: '80%',
      height: '80%',
      data: {
        advanceTable: this.advanceTable,
        action:'edit',
        item: item,
        reservationID: item.reservationID ,
        customerName: item.customerName,
        customerID: item.customerID,
        registrationNumber: item.registrationNumber,
        inventoryID: item.inventoryID,
        // customerPersonID: item.customerPersonID,
        driverName: item.driverName,
        organizationalEntityName: item.organizationalEntityName,
        dutySlipID: item.dutySlipID,
        incidenceID: this.incidenceID,
        customerPersonID: item.passengerDetails[0]?.customerPersonID,
        customerPersonName: item.passengerDetails[0]?.customerPersonName

      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
        // this.incidenceID = result.incidenceID;
      }
    });
  }
  
  openClosingScreen(item: any) {
  if (!item.locationOutDate || !item.locationOutTime) {
    Swal.fire({
      title: '',
      text: 'Closing can not be done without dispatch.',
      icon: 'warning',
    });
    return;
  }
    
    const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(item.reservationID.toString()));
    const encryptedAllotmentID = encodeURIComponent(this._generalService.encrypt(item.allotmentID.toString()));
    const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(item.customerID.toString()));
    const encryptedDutySlipID = encodeURIComponent(this._generalService.encrypt(item.dutySlipID.toString()));
    const encryptedDutySlipForBillingID = encodeURIComponent(this._generalService.encrypt(item.dutySlipForBillingID.toString()));
    const encryptedPackageID = encodeURIComponent(this._generalService.encrypt(item.package.packageID.toString()));
    const encryptedInventoryID = encodeURIComponent(this._generalService.encrypt(item.inventoryID.toString()));
    const encryptedClosureStatus = encodeURIComponent(this._generalService.encrypt(item.closureStatus));
    const encryptedPackageTypeID = encodeURIComponent(this._generalService.encrypt(item.package.packageTypeID.toString()));
    const encryptedRegistrationNumber = encodeURIComponent(this._generalService.encrypt(item.registrationNumber));
    const encryptedPickupDate = encodeURIComponent(this._generalService.encrypt(item.pickup.pickupDate));
    const encryptedPickupTime = encodeURIComponent(this._generalService.encrypt(item.pickup.pickupTime));
    const encryptedDropOffDate = encodeURIComponent(this._generalService.encrypt(item.drop.dropOffDate));
    const encryptedDropOffTime = encodeURIComponent(this._generalService.encrypt(item.drop.dropOffTime));
    const encryptedLocationOutDate = encodeURIComponent(this._generalService.encrypt(item.locationOutDate));
    const encryptedLocationOutTime = encodeURIComponent(this._generalService.encrypt(item.locationOutTime));
    const encryptedPickupAddress = encodeURIComponent(this._generalService.encrypt(item.pickup.pickupAddress));
    const encryptedDropOffAddress = encodeURIComponent(this._generalService.encrypt(item.drop.dropOffAddress));
    const encryptedLocationOutAddress = encodeURIComponent(this._generalService.encrypt(item.organizationalEntityName));
  
      // Create URL with encrypted query parameters
      const url = this.route.serializeUrl(
        this.route.createUrlTree(['/clossingScreen'], {
          queryParams: {
            reservationID: encryptedReservationID,
            allotmentID: encryptedAllotmentID,
            customerID: encryptedCustomerID,
            dutySlipID: encryptedDutySlipID,
            dutySlipForBillingID: encryptedDutySlipForBillingID,
            packageID: encryptedPackageID,
            inventoryID: encryptedInventoryID,
            closureStatus: encryptedClosureStatus,
            packageTypeID: encryptedPackageTypeID,
            registrationNumber: encryptedRegistrationNumber,
            pickupDate: encryptedPickupDate,
            pickupTime: encryptedPickupTime,
            dropOffDate: encryptedDropOffDate,
            dropOffTime: encryptedDropOffTime,
            locationOutDate: encryptedLocationOutDate,
            locationOutTime: encryptedLocationOutTime,
            pickupAddress: encryptedPickupAddress,
            dropOffAddress: encryptedDropOffAddress,
            locationOutAddress: encryptedLocationOutAddress
          }}));
      window.open(this._generalService.FormURL + url, '_blank');
    }
  
//----------TrackOnMap------------

TrackOnMapInfo(reservationID: number, item?: any) {
  const hasGarageOut = !!(item?.garageOutDate && item?.garageOutTime);
  const hasLocationOut = !!(item?.locationOutDate && item?.locationOutTime);

  // Allow tracking only after garage out is captured.
  if (!hasGarageOut && !hasLocationOut) {
    Swal.fire({
      icon: 'info',
      text: 'You can track trips after Location Out..',
      customClass: { popup: 'swal2-popup-high-zindex' },
      target: document.body
    });
    return;
  }

  const rid = Number(reservationID);
  if (!Number.isFinite(rid) || rid <= 0) {
    console.warn('TrackOnMapInfo skipped: invalid reservationID', reservationID);
    return;
  }

  const trackUrl = `https://ecopartner.ecoserp.in/?id=${encodeURIComponent(String(Math.trunc(rid)))}`;
  window.open(trackUrl, '_blank');
}

//--------- Interstate Tax Popup ----------
InterstateTax(item)
{
  if(item.allotmentStatus === 'Alloted')
  {
    const dialogRef = this.dialog.open(InterstateTaxFormDialogComponent, {
      data: 
      {
        inventoryID:item.inventoryID,
        registrationNumber:item.registrationNumber,
        Vehicle:item.vehicle.vehicle, 
        VehicleCategory:item.vehicle.vehicleCategory, 
        SupplierName:item.carVendor, 
        redirectedFrom: 'Inventory',     
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
    if (res) 
      {
        item.interstateTaxAmount = "Done";
      }
    });
  }
}

//--------- Interstate Tax Details ----------
navigateToInterstateTaxDetails(item) 
{
  const encryptedInventoryID = encodeURIComponent(this._generalService.encrypt(item.inventoryID.toString()));
  const encryptedRegNo = encodeURIComponent(this._generalService.encrypt(item.registrationNumber.toString()));
  const encryptedVehicle = encodeURIComponent(this._generalService.encrypt(item.vehicle.vehicle.toString()));
  const encryptedVehicleCategory = encodeURIComponent(this._generalService.encrypt(item.vehicle.vehicleCategory.toString()));
  const encryptedRedirectingFrom = encodeURIComponent(this._generalService.encrypt('Inventory'));
  const encryptedSupplierName = encodeURIComponent(this._generalService.encrypt(item.carVendor.toString()));
  const url = this.route.serializeUrl(this.route.createUrlTree(['/interstateTaxEntry'], { queryParams: {
    InventoryID: encryptedInventoryID,
    RegNo: encryptedRegNo,
    Vehicle: encryptedVehicle,
    VehicleCategory: encryptedVehicleCategory,
    redirectingFrom: encryptedRedirectingFrom,
    SupplierName: encryptedSupplierName
  }}));

  // Open the new tab with the encrypted URL
  window.open(this._generalService.FormURL + url, '_blank');
}
//--------- PickupTime Popup ----------
  pickupTimeUpdate(item)
  {
    const dialogRef = this.dialog.open(PickupTimeFormDialogComponent, 
    {
      data: 
      {
        advanceTable:item,
        customerID:item.customerID,     
        
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
    })
  }

  //--------- Duty Tracking Popup ----------
  DutyTracking(item:any,i:any)
  {
    const dialogRef = this.dialog.open(FormDialogComponentDutyTracking, 
    {
      data: 
      {
        dutySlipID:item.dutySlipID,     
        action: 'add'
      }
    });  
    dialogRef.afterClosed().subscribe(res => {
        this.loadData(item.reservationID,i);       
    })
  }

  //---------- Duty Tracking History ----------
  DutyTrackingHistory(dutySlipID:number) 
  {
    this.dialog.open(DutyTrackingComponent, 
    {
      width: '600px',
      data: 
      {
        dutySlipID:dutySlipID,
      }
    });
  }

  //--------- postPickUPCall Popup ----------
  postPickUPCall(item:any)
  {
    console.log(item);
    if(item && item.dutySlipID === null || item.dutySlipID === undefined || item.dutySlipID === 0 || item.dutySlipID === '')  {
      // console.log(item.dutySlipID);
      return;
    }
    const dialogRef = this.dialog.open(DutyPostFormDialogComponent, 
    {
       width: '500px',           
       maxHeight: '90vh',        
      data: 
      {
        
        dutySlipID: item?.dutySlipID,
        dutyPostPickUPCall: item?.dutyPostPickUPCall,
        action:'add',
        // action: (item.dutyPostPickUPCall?.dutyPostPickUPCallID === null || item.dutyPostPickUPCall?.dutyPostPickUPCallID === undefined || item?.dutyPostPickUPCall.dutyPostPickUPCallID === '' || item?.dutyPostPickUPCall.dutyPostPickUPCallID === 0) ? 'add' : 'edit'
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
     if (res) {
      console.log(res);
      item.dutyPostPickUPCall = {
        ...(item.dutyPostPickUPCall || {}), // fallback to empty object if null
        ...res
      };
      this.postPickUPCallLoadData(item,false);  // Refresh data only if saved
    }
      
    })
  }
 postPickUPCallLoadDataDetails(item: any) {
    console.log(item)
  this.postPickUPCallLoadData(item,true)
}

public postPickUPCallLoadData(item: any, popUpOpen = true) {
  
  if (!item?.dutySlipID || !item?.reservationID) {
    console.error('Missing dutySlipID or reservationID in item:', item);
    return;
  }
  this.dutyPostPickUPCallService.getDataDutyPostPickUpCall(item.dutySlipID, item.reservationID).subscribe(
    data => {
      this.dutyPostPickUPCalldataSource = data;
      item.dutyPostPickUPCall = data;

      if (popUpOpen) {
        const dialogRef = this.dialog.open(DutyPostPickUPCallComponent, {
          width: '600px',
          data: {
            row: item,
            dutySlipID: item.dutySlipID,
            reservationID: item.reservationID,
            dutyPostPickUPCalldataSource: this.dutyPostPickUPCalldataSource,
          }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
          console.log(result);
          if (result !== undefined && result !== null) {
            item.activationStatus = "Active";
          }
        });
      }
    },
    (error: HttpErrorResponse) => {
      console.error('Error while fetching driver remark details:', error);
      this.dutyPostPickUPCalldataSource = null;
    }
  );
}

  //   this.dutyPostPickUPCallService.getDataDutyPostPickUpCall(item.dutySlipID).subscribe(
  //     data => {
  //       if (data && data.length > 0) {
  //         this.dutyPostPickUPCalldataSource = data;
  
  //         const dialogRef = this.dialog.open(DutyPostPickUPCallComponent, {
  //           width: '500px',
  //           data: {
  //             row: item,
  //             dutySlipID: item.dutySlipID,
  //             dutyPostPickUPCalldataSource: this.dutyPostPickUPCalldataSource,
  //           }
  //         });
  //       } else {
  //         // Show a message if no data found
  //         // this.showNoDataMessage();
  //       }
  //     },
  //     (error) => {
  //       const errorMsg = error?.error?.message || error?.message || 'Unknown error';
  //       console.error('Failed to fetch life cycle status:', errorMsg);
  //       // this.showNoDataMessage();
  //     }
  //   );
  // }
   //---------- Transfer Location History ----------
  DutyPostPickUPCallHistory(item:any) 
  {
    this.dialog.open(DutyPostPickUPCallComponent, 
    {
      width: '500px',
      data: 
      {
       dutySlipID:item?.dutySlipID,  
      }
    });
  }
controlPanelDetails(reservationID:any,index:number) {
      const dialogRef = this.dialog.open(ControlPanelDialogeComponent, {
        width: '100%',
        maxWidth: '90vw',
        autoFocus: false,
        panelClass: 'control-panel-main-dialog',
        data: {
          reservationID: reservationID,
          index:index
        }
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        this.loadDataForHeader('complete',this.currentPage,50,true);
      });
      }
 onNoClick(): void {
  // Option 1: Reset to _filters initial values
    this._filters = new Filters({});
    this.filterForm = this.createFilterForm();
    this.searchTerm = '';
    this.selectedFilter = 'search';
    const today = this.formatDate(new Date());
    const now = new Date();
    this.filterForm.patchValue({fromDate: today});
    this.filterForm.patchValue({toDate: today});
    this.filterForm.patchValue({showAllLocation:true});
    this.filterForm.patchValue({
      customer: '',
      customerID: '',
      customerGroup: '',
      customerGroupID: '',
      packageType: '',
      packageTypeID: ''
    });


this.FillCustomerGroupDD(); 
this.FillCustomerDD();          
this.FillCustomerDDOnPageLoad(); 
this.InitPackageType();  
 this.loadDataForHeader('complete',this.currentPage,50,true);
   

}





  openSearchDialog() {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any) {
    SearchData();
    dialogRef.close();
  }

} 


