// @ts-nocheck
import { Component, ChangeDetectorRef, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlPanelDesignService } from './controlPanelDesign.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
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
  Filters,
  TransferedLocationDropDown
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
import { Observable, of, Subject, Subscription } from 'rxjs';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
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
import { IncidenceListDialogComponent } from '../incidence/dialogs/incidence-list-dialog/incidence-list-dialog.component';
import { IncidenceService } from '../incidence/incidence.service';
import { ResolutionService } from '../resolution/resolution.service';
import { DriverOfficialIdentityNumberDD } from '../general/driverOfficialIdentityNumberDD.model';
import Swal from 'sweetalert2';
import { isAllotedBooking } from '../shared/messaging-validation.util';
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
import { OrganizationalEntityDropDown} from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { SpecialInstructionDialogComponent } from '../specialInstruction/dialogs/special-instruction-dialog/special-instruction-dialog.component';
import { ControlPanelDialogeService } from '../controlPanelDialoge/controlPanelDialoge.service';
import { InternalNoteDialogComponent } from '../internalNoteDetails/dialogs/internal-note-dialog/internal-note-dialog.component';
import { ModeOfPaymentDropDown } from '../supplierContract/modeOfPaymentDropDown.model';
import { InventoryDropDown } from '../inventory/inventoryDropDown.model';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';

@Component({
  standalone: false,
  selector: 'app-controlPanelDesign',
  templateUrl: './controlPanelDesign.component.html',
  styleUrls: ['./controlPanelDesign.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ControlPanelDesignComponent implements OnInit {
  public cpInfo: ControlPanelData;
  public reservationInfo: any[]=[];
  public reservationHeaderInfo: ControlPanelHeaderDetails[];
  public VehicleList?: VehicleDropDown[] = [];

  public CustomerGroupList?: CustomerGroupDropDown[] = [];

  public CustomersList?: CustomerCustomerGroupDropDown[] = [];

  public CustomerList?: CustomerCustomerGroupDropDown[] = [];

  public BookerList?: CustomerPersonDropDown[] = [];

  public PassengerList?: CustomerPersonDropDown[] = [];
  cpGuestNamePanelWidth: string | number = 420;

  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  vehicleCategoryOptions: VehicleCategoryDropDown[] = [];
  vehicleInventoryAutocompleteMode: 'regNo' | 'driverInventory' = 'driverInventory';
  private prefixAutocompleteDestroy$ = new Subject<void>();
  
  public CityList?: CitiesDropDown[] = [];

  public PackageTypeList?:PackageTypeDropDown[]=[]; 

  public PackageList?:PackageDropDown[]=[];

  public SupplierList?:SupplierDropDown[]=[];

  public VehicleInventoryList?: DriverInventoryAssociationDropDown[] = [];

  public DriverList?: DriverInventoryAssociationDropDown[] = [];

  public DriverOfficialIdentityNumberList?: DriverOfficialIdentityNumberDD[] = [];

  public DisputesList?: DisputeTypeDropDown[] = [];

  totalData = 0;
  isCountLoading = false;
  private headerSearchGeneration = 0;
  private headerCountSub?: Subscription;
  private headerMessagingSub?: Subscription;
  recordsPerPage = 50;
  isLoading = false;
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
  Math = Math;
  calculatedLocationOutDateTime: Date;

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
  driverAppLatestVersion = '';

  status:string;
  dutySlipID: number;
  @Output() newDataAddedEvent = new EventEmitter<boolean>();
  @Input() newDataAddedEvents = new EventEmitter<boolean>();

  searchTerm: any = '';
  selectedFilter: string = 'search';
  SearchBookingNo: string = '';
  pendingReservationId: number | null = null;
  private showAllLocationReady = false;
  private pendingReservationSearchApplied = false;

  sortDirection: 'asc' | 'desc' = 'desc';
  sortColumn: string = 'reservationID';
  
  dataSourceForInterstateTax: InterstateTaxEntry[] | null;
  dataSourceForPassToSupplier: PassToSupplierModel | null;
  public DutyPostPickUPCall:DutyPostPickUPCallModel | null;

  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];

  public TransferLocationList?: TransferedLocationDropDown[] = [];
  verifyDutyStatusAndCacellationStatus: any;

  public RegNumberList: InventoryDropDown[] = [];

  public PaymentModeList?:ModeOfPaymentDropDown[]=[];

  public SupplierTypeList?: SupplierTypeDropDownModel[] = [];

  public KAMList?: EmployeeDropDown[] = [];

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
    public interstateTaxEntryService:InterstateTaxEntryService,
    public passToSupplierService: PassToSupplierService,
    public dutyPostPickUPCallService: DutyPostPickUPCallService,
    public controlPanelDialogeService:ControlPanelDialogeService,
    private cdr: ChangeDetectorRef
  ) {
    this._filters = new Filters({});
    this.filterForm = this.createFilterForm();
   }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
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
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.recordsPerPage = pageData.pageSize;
    this.showDataPage = true;
    this.loadDataForHeader(this.bookingCategory, this.currentPage, this.recordsPerPage, this.isLoading);
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
    this.setupPrefixAutocompletes();
    this.safeRun(() => this.InitVehicleCategories());
    // Phase 2.1: defer heavy dropdown full-list loads; prefix APIs load on valueChanges (min 3 chars).
    // this.safeRun(() => this.InitDisputesOnPageLoad());
    // this.safeRun(() => this.InitLocation());
    // this.safeRun(() => this.InitTransferLocation());
    // this.safeRun(() => this.InitRegNumber());
    // this.safeRun(() => this.InitPaymentMode());

    const today = this.formatDate(new Date());
    const now = new Date();
    this.filterForm.patchValue({fromDate: today});
    this.filterForm.patchValue({toDate: today});
    this.filterForm.patchValue({showAllLocation: this.getLoginShowAllLocation()});
    // this.filterForm.patchValue({fromTime: now})

    // const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    // this.filterForm.patchValue({toTime: threeHoursLater});
    this.captureReservationIdFromRoute(this.router.snapshot.queryParams);
    this.safeRun(() => this.InitShowAllLocationCheck());
    this.safeRun(() => this.InitDriverAppLatestVersion());

    // Capture status from query params (encrypted) so we can propagate to downstream dialogs
    this.router.queryParams.subscribe((params) => {
      this.captureReservationIdFromRoute(params);
      this.tryApplyPendingReservationSearch();
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

  private setupPrefixAutocomplete(
    controlName: string,
    fetchFn: (prefix: string) => Observable<any[]>,
    assignFn: (list: any[]) => void,
    onClear?: () => void
  ): void {
    const control = this.filterForm?.controls?.[controlName];
    if (!control) {
      return;
    }
    control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        const term = (value ?? '').toString().trim();
        if (term.length < this._generalService.lengthToCheck) {
          assignFn([]);
          onClear?.();
          return of([]);
        }
        return fetchFn(term);
      }),
      takeUntil(this.prefixAutocompleteDestroy$)
    ).subscribe((list) => assignFn(list || []));
  }

  private setupPrefixAutocompletes(): void {
    this.prefixAutocompleteDestroy$.next();
    this.prefixAutocompleteDestroy$.complete();
    this.prefixAutocompleteDestroy$ = new Subject<void>();

    this.setupPrefixAutocomplete(
      'locationName',
      (prefix) => this._generalService.GetLocationDropDownForControlPanel(prefix),
      (list) => { this.OrganizationalEntityList = list; }
    );
    this.setupPrefixAutocomplete(
      'transferLocationName',
      (prefix) => this._generalService.GetTransferLocationDropDownForControlPanel(prefix),
      (list) => { this.TransferLocationList = list; }
    );
    this.setupPrefixAutocomplete(
      'customerGroup',
      (prefix) => this._generalService.GetCustomerGroupDropDownForControlPanel(prefix),
      (list) => { this.CustomerGroupList = list; }
    );
    this.setupPrefixAutocomplete(
      'customer',
      (prefix) => this._generalService.GetCustomerDropDownForControlPanel(prefix),
      (list) => { this.CustomerList = list; }
    );
    this.setupPrefixAutocomplete(
      'booker',
      (prefix) => this._generalService.GetBookerDropDownForControlPanel(prefix),
      (list) => { this.BookerList = list; }
    );
    this.filterForm.controls['passenger'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        const term = (value ?? '').toString().trim();
        if (term.length < this._generalService.lengthToCheck) {
          this.PassengerList = [];
          this.passengerID = null;
          this.filterForm.patchValue({ passengerID: 0 }, { emitEvent: false });
          return of([]);
        }
        return this._generalService.GetPassengerDropDownForControlPanel(term);
      }),
      takeUntil(this.prefixAutocompleteDestroy$)
    ).subscribe((list) => { this.PassengerList = list || []; });
    this.setupPrefixAutocomplete(
      'vehicleName',
      (prefix) => this._generalService.GetVehicleDropDownForControlPanel(prefix),
      (list) => { this.VehicleList = list; }
    );
    this.setupPrefixAutocomplete(
      'city',
      (prefix) => this._generalService.GetCityDropDownForControlPanel(prefix),
      (list) => { this.CityList = list; }
    );
    this.setupPrefixAutocomplete(
      'packageType',
      (prefix) => this._generalService.GetDutyTypeDropDownForControlPanel(prefix),
      (list) => { this.PackageTypeList = list; }
    );
    this.filterForm.controls['package'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        const term = (value ?? '').toString().trim();
        if (term.length < this._generalService.lengthToCheck) {
          this.PackageList = [];
          return of([]);
        }
        return this._generalService.GetPackageDropDownForControlPanel(term, this.packageTypeID || 0);
      }),
      takeUntil(this.prefixAutocompleteDestroy$)
    ).subscribe((list) => { this.PackageList = list || []; });
    this.setupPrefixAutocomplete(
      'supplier',
      (prefix) => this._generalService.GetSupplierDropDownForControlPanel(prefix),
      (list) => { this.SupplierList = list; }
    );
    const assignDriverInventoryAssociation = (list: DriverInventoryAssociationDropDown[]) => {
      const rows = list || [];
      this.VehicleInventoryList = rows;
      this.DriverList = rows;
    };
    this.filterForm.controls['vehicleInventory'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        const term = (value ?? '').toString().trim();
        if (term.length < this._generalService.lengthToCheck) {
          if (this.vehicleInventoryAutocompleteMode === 'regNo') {
            this.RegNumberList = [];
          } else {
            this.clearDriverInventoryAssociationLists();
          }
          return of([]);
        }
        if (this.vehicleInventoryAutocompleteMode === 'regNo') {
          return this._generalService.GetRegNoDropDownForControlPanel(term);
        }
        return this._generalService.GetDriverInventoryDropDownForControlPanel(term, this.supplierID || 0);
      }),
      takeUntil(this.prefixAutocompleteDestroy$)
    ).subscribe((list) => {
      if (this.vehicleInventoryAutocompleteMode === 'regNo') {
        this.RegNumberList = list || [];
      } else {
        assignDriverInventoryAssociation(list || []);
      }
    });
    this.setupPrefixAutocomplete(
      'driver',
      (prefix) => this._generalService.GetDriverInventoryDropDownForControlPanel(prefix, this.supplierID || 0),
      assignDriverInventoryAssociation,
      () => this.clearDriverInventoryAssociationLists()
    );
    this.setupPrefixAutocomplete(
      'driverOfficialIdentityNumber',
      (prefix) => this._generalService.GetDOINDropDownForControlPanel(prefix, this.supplierID || 0),
      (list) => { this.DriverOfficialIdentityNumberList = list; },
      () => { this.DriverOfficialIdentityNumberList = []; }
    );
    this.setupPrefixAutocomplete(
      'disputes',
      (prefix) => this._generalService.GetDisputeTypeDropDownForControlPanel(prefix),
      (list) => { this.DisputesList = list; }
    );
    this.setupPrefixAutocomplete(
      'modeOfPayment',
      (prefix) => this._generalService.GetModeOfPaymentDropDownForControlPanel(prefix),
      (list) => { this.PaymentModeList = list; }
    );
    this.setupPrefixAutocomplete(
      'supplierType',
      (prefix) => this._generalService.GetSupplierTypeDropDownForControlPanel(prefix),
      (list) => { this.SupplierTypeList = list; }
    );
    this.setupPrefixAutocomplete(
      'kAM',
      (prefix) => this._generalService.GetKAMDropDownForControlPanel(prefix),
      (list) => { this.KAMList = list; }
    );
    this.filterForm.controls['vehicleCategory'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.prefixAutocompleteDestroy$)
    ).subscribe((value) => this.updateVehicleCategoryOptions((value ?? '').toString()));
  }

  onVehicleInventoryAutocompleteFocus(mode: 'regNo' | 'driverInventory'): void {
    this.vehicleInventoryAutocompleteMode = mode;
  }

  private updateVehicleCategoryOptions(term: string): void {
    const filterValue = term.toLowerCase().trim();
    if (filterValue.length < this._generalService.lengthToCheck) {
      this.vehicleCategoryOptions = [];
      return;
    }
    this.vehicleCategoryOptions = (this.VehicleCategoryList || []).filter((item) =>
      item.vehicleCategory.toLowerCase().startsWith(filterValue)
    );
  }

  private captureReservationIdFromRoute(params: Record<string, unknown> | null | undefined): void {
    const raw = params?.['reservationID'] ?? params?.['reservationId'];
    if (raw == null || raw === '') {
      return;
    }
    const id = this.parseReservationIdFromQuery(String(raw));
    if (id > 0) {
      this.pendingReservationId = id;
    }
  }

  private parseReservationIdFromQuery(raw: string): number {
    const trimmed = raw.trim();
    if (/^\d+$/.test(trimmed)) {
      return Number(trimmed);
    }
    try {
      const decrypted = this._generalService.decrypt(decodeURIComponent(trimmed));
      const id = Number(decrypted);
      return !Number.isNaN(id) && id > 0 ? id : 0;
    } catch {
      return 0;
    }
  }

  applySingleReservationFilter(reservationID: number): void {
    this.currentPage = 1;
    this.filterForm.patchValue({
      reservationID: 0,
      resID: String(reservationID),
      reservationStatus: 'All',
      fromDate: '',
      toDate: '',
      fromTime: '',
      toTime: ''
    });
    this.SearchData();
  }

  private tryApplyPendingReservationSearch(): void {
    if (!this.showAllLocationReady || !this.pendingReservationId || this.pendingReservationSearchApplied) {
      return;
    }
    this.pendingReservationSearchApplied = true;
    this.applySingleReservationFilter(this.pendingReservationId);
  }

  private normalizeBoolean(value: any, fallback: boolean): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true') {
        return true;
      }
      if (normalized === 'false') {
        return false;
      }
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    return fallback;
  }

  private getLoginShowAllLocation(): boolean {
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      return false;
    }
    try {
      const parsed = JSON.parse(raw);
      const loginValue = parsed?.employee?.ShowAllLocation ?? parsed?.employee?.showAllLocation;
      return this.normalizeBoolean(loginValue, false);
    } catch {
      return false;
    }
  }

  private getEffectiveShowAllLocation(candidateValue: any): boolean {
    const loginShowAllLocation = this.getLoginShowAllLocation();
    const candidateShowAllLocation = this.normalizeBoolean(candidateValue, loginShowAllLocation);
    // Login/localStorage is source-of-truth when it is true.
    return loginShowAllLocation || candidateShowAllLocation;
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
    this.currentPage = 1;
    if (this.paginator && this.paginator.pageIndex !== 0) {
      this.paginator.firstPage();
    } else {
      this.loadDataForHeader(this.bookingCategory,this.currentPage, this.recordsPerPage, this.isLoading);
    }
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
    this.currentPage = 1;
    if (this.paginator && this.paginator.pageIndex !== 0) {
      this.paginator.firstPage();
    } else {
      this.loadDataForHeader(this.bookingCategory,this.currentPage, this.recordsPerPage, this.isLoading);
    }
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
      reservationStatus: [this._filters.reservationStatus || 'Confirmed'],
      allotmentStatus: [this._filters.allotmentStatus],
      billingStatus: [this._filters.billingStatus],
      delays: [this._filters.delays],
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
      passenger: [this._filters.passenger],
      passengerID: [this._filters.passengerID || 0],
      vehicleCategory:[this._filters.vehicleCategory],
      vehicleName: [this._filters.vehicleName],
      city: [this._filters.city],
      packageType: [this._filters.packageType],
      package: [this._filters.package],
      supplier:[this._filters.supplier],
      vehicleInventory:[this._filters.vehicleInventory],
      driver:[this._filters.driver],
      userID:[this._generalService.getUserID()],
      showAllLocation:[this.getEffectiveShowAllLocation(this._filters.showAllLocation)],
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
      reservationSourceDetail:[this._filters.reservationSourceDetail],
      verifyDuty:[this._filters.verifyDuty],
      goodForBilling:[this._filters.goodForBilling],
      billed:[this._filters.billed],
      passed: [this._filters.passed],
      driverAcceptanceStatus: [this._filters.driverAcceptanceStatus],
      modeOfPayment: [this._filters.modeOfPayment],
      emailtosupplier: [this._filters.emailtosupplier],
      tncStatus: [this._filters.tncStatus],
      ticketNumb: [this._filters.ticketNumb],
      supplierType:[this._filters.supplierType],
      dutySlipID: [this._filters.dutySlipID || ''],
      kAM:[this._filters.kAM],
      resID:[this._filters.resID || ''],
    });
  }

  public InitShowAllLocationCheck()
  {
    this._controlPanelDesignService.getShowAllLocationCheck(this._generalService.getUserID()).subscribe(
      data => 
      {
        this.ShowAllLocation = this.getEffectiveShowAllLocation(data?.showAllLocation);
        this.filterForm.patchValue({showAllLocation:this.ShowAllLocation});
        // this.filterForm.controls["fromDate"].setValue('');
        // this.filterForm.controls["toDate"].setValue('');
        this.filterForm.controls["fromTime"].setValue('');
        this.filterForm.controls["toTime"].setValue('');

        this.showAllLocationReady = true;
        this.tryApplyPendingReservationSearch();
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
        this.ShowAllLocation = this.getLoginShowAllLocation();
        this.filterForm.patchValue({showAllLocation: this.ShowAllLocation});
        this.showAllLocationReady = true;
        this.tryApplyPendingReservationSearch();
      }
    );
  }

  public InitDriverAppLatestVersion()
  {
    this._controlPanelDesignService.getDriverAppLatestVersion().subscribe(
      data => {
        this.driverAppLatestVersion = (data?.appVersion || '').trim();
        if (this.reservationHeaderInfo?.length) {
          this.reservationHeaderInfo = [...this.reservationHeaderInfo];
        }
      },
      () => {
        this.driverAppLatestVersion = '';
      }
    );
  }

  isDriverAppVersionOutdated(driverAppVersion: string | null | undefined): boolean {
    const latest = (this.driverAppLatestVersion || '').trim();
    const current = (driverAppVersion || '').trim();
    if (!current || !latest) return false;
    return current.localeCompare(latest, undefined, { sensitivity: 'accent' }) !== 0;
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
    const requestPayload = {
      ...this.filterForm.getRawValue(),
      showAllLocation: this.getEffectiveShowAllLocation(this.filterForm.get('showAllLocation')?.value)
    };
    this.filterForm.patchValue({ showAllLocation: requestPayload.showAllLocation }, { emitEvent: false });
    const searchGeneration = ++this.headerSearchGeneration;
    if (this.headerCountSub) {
      this.headerCountSub.unsubscribe();
      this.headerCountSub = undefined;
    }
    if (this.headerMessagingSub) {
      this.headerMessagingSub.unsubscribe();
      this.headerMessagingSub = undefined;
    }
    const bookingLookup = this.isBookingNumberLookup(requestPayload);
    if (!bookingLookup) {
      this.isCountLoading = true;
    }
    console.log(status);
    this._controlPanelDesignService.getReservationHeaderDetails(status,requestPayload,currentPage,pageSize,this.sortBy,this.orderBy).subscribe(
      (data: ControlPanelHeaderData) => {
          if (searchGeneration !== this.headerSearchGeneration) {
            return;
          }
          if (data != null) 
          {
            this.reservationHeaderInfo = data.reservationHeaderDetails;
            if (data.totalRecords != null) {
              this.totalData = data.totalRecords;
              this.isCountLoading = false;
            }
            console.log(this.reservationHeaderInfo);
             this.reservationHeaderInfo.forEach(row => {
            
            this.setCalculatedLocationOutTime(row, row.locationOutIntervalInMinutes);
        
          });
            this.precomputeCpMsgDisplayForRows(this.reservationHeaderInfo);
            this.loadMessagingLatestStatusBatch(this.reservationHeaderInfo, searchGeneration);

            if (rowIndex !== undefined)
            {
              this.isExpanded[rowIndex] = true;
            }
            const pendingId = this.pendingReservationId;
            if (pendingId && this.reservationHeaderInfo?.length) {
              const matchIndex = this.reservationHeaderInfo.findIndex(
                (row) => Number(row.reservationID) === pendingId
              );
              const expandIndex = matchIndex >= 0 ? matchIndex : 0;
              this.isExpanded[expandIndex] = true;
              this.loadData(pendingId, expandIndex);
              this.pendingReservationId = null;
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
            if (this.pendingReservationId) {
              this.pendingReservationId = null;
            }
          }
        },
        (error: HttpErrorResponse) => {
          if (searchGeneration !== this.headerSearchGeneration) {
            return;
          }
          this.reservationHeaderInfo = [];
          this.totalData = 0;
          this.isCountLoading = false;
          this.isLoading = false;
          if (this.pendingReservationId) {
            this.pendingReservationId = null;
          }
        }
      );

    if (!bookingLookup) {
      this.headerCountSub = this._controlPanelDesignService
        .getReservationHeaderCount(status, requestPayload)
        .subscribe(
          (countData: { totalRecords: number }) => {
            if (searchGeneration !== this.headerSearchGeneration) {
              return;
            }
            this.totalData = countData?.totalRecords ?? 0;
            this.isCountLoading = false;
          },
          () => {
            if (searchGeneration !== this.headerSearchGeneration) {
              return;
            }
            this.isCountLoading = false;
          }
        );
    }
  }

  private precomputeCpMsgDisplayForRows(rows: ControlPanelHeaderDetails[]): void {
    if (!rows?.length) {
      return;
    }
    rows.forEach((row) => {
      row.cpMsgDisplay = this.getControlPanelMessagingHeaderDisplay(row);
    });
  }

  private loadMessagingLatestStatusBatch(
    rows: ControlPanelHeaderDetails[],
    searchGeneration: number
  ): void {
    if (!rows?.length) {
      return;
    }

    const reservationIds = rows
      .map((row) => Number(row.reservationID))
      .filter((id) => id > 0);
    if (!reservationIds.length) {
      return;
    }

    this.headerMessagingSub = this._controlPanelDesignService
      .getReservationMessagingLatestStatus(reservationIds)
      .subscribe(
        (statuses: any[]) => {
          if (searchGeneration !== this.headerSearchGeneration) {
            return;
          }
          const statusByReservationId = new Map<number, any>();
          (statuses || []).forEach((status) => {
            const reservationId = Number(status?.reservationID ?? status?.reservationId);
            if (reservationId > 0) {
              statusByReservationId.set(reservationId, status);
            }
          });
          rows.forEach((row) => {
            const reservationId = Number(row.reservationID);
            const status = statusByReservationId.get(reservationId);
            if (status) {
              this.mergeMessagingStatusOntoRow(row, status);
            }
            row.cpMsgDisplay = this.getControlPanelMessagingHeaderDisplay(row);
          });
        },
        () => {
          if (searchGeneration !== this.headerSearchGeneration) {
            return;
          }
          this.precomputeCpMsgDisplayForRows(rows);
        }
      );
  }

  private mergeMessagingStatusOntoRow(row: any, status: any): void {
    if (!row || !status) {
      return;
    }
    const messagingFields = [
      'latestPassengerSmsMessageStatus',
      'latestPassengerSmsMessageStatusDetails',
      'latestPassengerWhatsAppMessageStatus',
      'latestPassengerWhatsAppMessageStatusDetails',
      'latestBookerSmsMessageStatus',
      'latestBookerSmsMessageStatusDetails',
      'latestBookerWhatsAppMessageStatus',
      'latestBookerWhatsAppMessageStatusDetails',
      'latestSmsMessageStatus',
      'latestSmsMessageStatusDetails',
      'latestWhatsAppMessageStatus',
      'latestWhatsAppMessageStatusDetails',
    ];
    messagingFields.forEach((field) => {
      const pascalField = field.charAt(0).toUpperCase() + field.slice(1);
      const value = status[field] ?? status[pascalField];
      if (value !== null && value !== undefined) {
        row[field] = value;
      }
    });
  }

  private isBookingNumberLookup(filters: Partial<Filters>): boolean {
    const reservationId = filters?.reservationID;
    if (reservationId != null && reservationId !== '' && Number(reservationId) !== 0) {
      return true;
    }
    const resId = filters?.resID;
    return resId != null && String(resId).trim() !== '';
  }

  trimBookingNo()
  {
    const value = this.filterForm.get('resID')?.value;
    if (value)
    {
      this.filterForm.patchValue({
        resID: value.toString().trim()
      });
    }
  }

  trimDutySlipNo(): void {
    const value = this.filterForm.get('dutySlipID')?.value;
    if (value !== null && value !== undefined && value !== '') {
      this.filterForm.patchValue({
        dutySlipID: value.toString().trim()
      });
    }
  }

  getSpecialInstructions(instructions: any[]): string {
    return 'Special Instruction : ' + instructions.map(x => x.specialInstruction).join(', ');
  }

  /** Primary guest passenger for VIP / Female labels (not booker). */
  getPrimaryGuestPassenger(item: any): { importance?: string; gender?: string } | null {
    const passengers = item?.passengerDetails;
    if (passengers?.length) {
      const primary = passengers.find(
        (p: any) => String(p?.isPrimaryPassenger ?? '').toLowerCase() === 'true'
      );
      return primary ?? passengers[0];
    }
    if (item?.importance != null || item?.gender != null) {
      return { importance: item.importance, gender: item.gender };
    }
    return null;
  }

  isVipBooking(item: any): boolean {
    return this.getPrimaryGuestPassenger(item)?.importance === 'VIP';
  }

  isFemaleTraveller(item: any): boolean {
    return this.getPrimaryGuestPassenger(item)?.gender === 'Female';
  }

  public loadData(reservationID:any,index:number) {
    this._controlPanelDesignService.getReservationDetails(reservationID).subscribe(
        (data: ControlPanelData) => 
        {
            this.reservationInfo[index] = data.reservationDetails;
        },
        (error: HttpErrorResponse) => {
          this.reservationInfo[index] = null;
        }
      );
  }

  //---------- Location ----------
  // InitLocation()
  // {
  //   this._generalService.GetOrganizationalEntity().subscribe(
  //   data=>
  //   {
  //     this.OrganizationalEntityList=data;
  //     this.filteredOrganizationalEntityOptions = this.filterForm.controls.locationName.valueChanges.pipe(
  //       startWith(""),
  //       map(value => this._filterLocationName(value || ''))
  //     ); 
  //   });
  // }


  getCustomerGroupID(customerGroupID:any)
  {
    this.customerGroupID=customerGroupID;
    this.filterForm.controls['customer'].setValue('');
    this.filterForm.controls['booker'].setValue('');
    this.filterForm.controls['passenger'].setValue('');
    this.filterForm.patchValue({ passengerID: 0 });
    //this.FillCustomerDD();
    //his.InitBooker();
    //this.InitPassenger();
  }

  onCustomerGroupKeyUp(event) {
    if (event.keyCode === 8) {
      this.filterForm.controls['customer'].setValue('');
      this.filterForm.controls['booker'].setValue('');
      this.filterForm.controls['passenger'].setValue('');
      this.filterForm.patchValue({ passengerID: 0 });
    }
  }

  //For Customers
  // FillCustomerDD() {
  //   this._generalService.GetCustomersForCPSearch(this.customerGroupID).subscribe(
  //     (data : CustomerCustomerGroupDropDown[]) => {
  //       this.CustomerList = data;
  //       this.filteredCustomerOptions =
  //         this.filterForm.controls.customer.valueChanges.pipe(
  //           startWith(''),
  //           map((value) => this._filterCustomer(value || ''))
  //         );
  //     },
  //     (error) => {}
  //   );
  // }
  getCustomerID(customerID:any)
  {
    this.customerID=customerID;
  }

  FillCustomerDDOnPageLoad() {
    this._generalService.getCustomerForCPSearch().subscribe(
      (data : CustomerCustomerGroupDropDown[]) => {
        this.CustomersList = data;
      },
      (error) => {}
    );
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
        });
    }
    
    getBookerID(bookerID: any) {
      this.bookerID=bookerID;
    }
    
    getBookerIDOnPageLoad(bookerID: any) {
      this.bookerID=bookerID;
    }
  
    InitPassenger(){
      this._generalService.GetCPForPassenger(this.customerGroupID).subscribe(
        data=>
        {
          this.PassengerList=data;
        });
    }
    
    getPassengerID(passengerID: any,passengerName:any) {
      this.passengerID=passengerID;
      this.filterForm.patchValue({ passengerID: passengerID || 0 });
    }

    buildGuestDisplay(option: CustomerPersonDropDown): string {
      if (!option) {
        return '';
      }
      return [
        option.customerPersonName ?? '',
        option.gender ?? '',
        option.importance ?? '',
        option.phone ?? '',
        option.customerName ?? ''
      ].join('-');
    }

    onGuestNamePanelOpened(): void {
      const active = document.activeElement as HTMLElement | null;
      const width = active?.getBoundingClientRect?.()?.width;
      this.cpGuestNamePanelWidth = width ? Math.max(Math.round(width), 420) : 420;
    }
    
    getPassengerIDOnPageLoad(passengerID: any,passengerName:any) {
      this.passengerID=passengerID;
      this.filterForm.patchValue({ passengerID: passengerID || 0 });
    }

    onGuestNameSelected(selectedValue: string): void {
      const selected = this.PassengerList?.find(
        (p) => this.buildGuestDisplay(p) === selectedValue
      );
      if (selected) {
        this.getPassengerIDOnPageLoad(selected.customerPersonID, selected.customerPersonName);
      }
    }

    // Vehicle Category
    InitVehicleCategories(){
      this._generalService.GetVehicleCategories().subscribe(
        data=>
        {
          this.VehicleCategoryList=data;
        });
    }

    getTitles(vehicleCategoryID: any) {   
      this.vehicleCategoryID=vehicleCategoryID;
      this.filterForm.controls["vehicleName"].setValue('');
      this.VehicleList = [];
    }

    onVehicleCategoryChanges(event:any)
  {
    if(event.keyCode===8)
    {
      this.filterForm.controls["vehicleName"].setValue('');
      this.VehicleList = [];
    }
  }

  getPackageTypeID(packageTypeID: any) { 
    this.packageTypeID=packageTypeID;
    this.filterForm.controls["package"].setValue('');
    this.PackageList = [];
  }

  onPackageTypeChanges(event:any)
  {
    if(event.keyCode===8)
    {
      this.filterForm.controls["package"].setValue('');
      this.packageTypeID = null;
      this.PackageList = [];
    }
  }

  InitPackage()
  { 
    this._generalService.getPackageForSettleRate(this.packageTypeID).subscribe(
      data=>
      {
        this.PackageList=data;
      });
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
      });
  }

  InitSupplier()
  { 
    this._generalService.GetSupplier().subscribe(
      data=>
      {
        this.SupplierList=data;
      });
  }

  getSupplierID(SupplierID:any)
  {
    this.supplierID=SupplierID;
    this.filterForm.controls["vehicleInventory"].setValue('');
    this.filterForm.controls["driver"].setValue('');
    this.filterForm.controls["driverOfficialIdentityNumber"].setValue('');
    this.clearDriverInventoryAssociationLists();
  }

  onSupplierChanges(event:any)
  {
    if(event.keyCode===8)
    {
      this.supplierID = null;
      this.filterForm.controls["vehicleInventory"].setValue('');
      this.filterForm.controls["driver"].setValue('');
      this.filterForm.controls["driverOfficialIdentityNumber"].setValue('');
      this.clearDriverInventoryAssociationLists();
    }
  }

  private clearDriverInventoryAssociationLists(): void {
    this.VehicleInventoryList = [];
    this.DriverList = [];
    this.DriverOfficialIdentityNumberList = [];
  }

  InitVehicleInventory(){
    this._generalService.GetDriverInventoryForCpSearch(this.supplierID).subscribe(
      (data)=>
      {
        this.VehicleInventoryList=data;
      });
  }

  InitVehicleInventoryOnPageLoad(){
    this._generalService.GetDriverInventoryVehicleForCpSearch().subscribe(
      (data)=>
      {
        this.VehicleInventoryList=data;
      });
  }

  InitDriver(){
    this._generalService.GetDriverInventoryForCpSearch(this.supplierID).subscribe(
      (data)=>
      {
        this.DriverList=data;
      });
  }

  InitDriverOnPageLoad(){
    this._generalService.GetDriverInventoryVehicleForCpSearch().subscribe(
      (data)=>
      {
        this.DriverList=data;
      });
  }

  InitDriverOfficialIdentityNumber(){
    this._generalService.GetDriverOfficialIdentityNumber(this.supplierID).subscribe(
      (data)=>
      {
        this.DriverOfficialIdentityNumberList=data;
      });
  }

  InitDOINOnPageLoad(){
    this._generalService.GetDOIN().subscribe(
      (data)=>
      {
        this.DriverOfficialIdentityNumberList=data;
      });
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
    const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(item.reservationID.toString()));
    const encryptedCustomerGroupID = encodeURIComponent(this._generalService.encrypt(item.customerGroupID.toString()));
    const encryptedAction = encodeURIComponent(this._generalService.encrypt('edit'));
    const encryptedStatus = encodeURIComponent(this._generalService.encrypt('Changes allow'));
    const url= this.route.serializeUrl(this.route.createUrlTree(['/bookingScreen'], { queryParams: {
      reservationID: encryptedReservationID,
      reservationGroupID: encryptedReservationGroupID,
      customerGroupID: encryptedCustomerGroupID,
      customerID: encryptedCustomerID,
      customerName: encryptedCustomerName,
      action: encryptedAction,
      status: encryptedStatus
    } }));
    window.open(this._generalService.FormURL+ url, '_blank');
  }

  OpenBookingScreenIncomplete(item) {
    const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(item.customerID.toString()));
    const encryptedCustomerName = encodeURIComponent(this._generalService.encrypt(item.customerName));
    const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(item.reservationGroupID.toString()));
    const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(item.reservationID.toString()));
    const encryptedCustomerGroupID = encodeURIComponent(this._generalService.encrypt(item.customerGroupID.toString()));
    const encryptedAction = encodeURIComponent(this._generalService.encrypt('edit'));
    const encryptedStatus = encodeURIComponent(this._generalService.encrypt('Changes allow'));

    const url= this.route.serializeUrl(this.route.createUrlTree(['/bookingScreen'], { queryParams: {
      reservationID: encryptedReservationID,
      reservationGroupID: encryptedReservationGroupID,
      customerGroupID: encryptedCustomerGroupID,
      customerID: encryptedCustomerID,
      customerName: encryptedCustomerName,
      action: encryptedAction,
      status: encryptedStatus
    } }));
    window.open(this._generalService.FormURL+ url, '_blank');
  }

  OpenBookingScreen(item) {
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

  private resolveMessagingCustomerPersonId(customerPersonID: any, item: any): any {
    if (
      customerPersonID != null &&
      customerPersonID !== '' &&
      typeof customerPersonID !== 'object'
    ) {
      return customerPersonID;
    }
    return (
      item?.passengerDetails?.[0]?.customerPersonID ??
      item?.primaryPassengerID ??
      item?.customerPerson?.customerPersonID ??
      item?.customerPersonID ??
      null
    );
  }

  openSendSmsWhatsappMail(reservationID,vehicle,pickupDate,pickupTime,
    registrationNumber,customerPersonName,city, item: any, customerPersonID)
    {
      if (!this.isMessagingEnabledForAllotment(item)) {
        Swal.fire({
          title: '',
          icon: 'warning',
          html: `<b>Send WA/SMS/Mail is available after the booking is allotted.</b>`
        });
        return;
      }
      const rowItem = item;
      const pickText = (...values: any[]) => {
        for (const value of values) {
          const text = (value ?? '').toString().trim();
          if (text && text.toLowerCase() !== 'n/a') {
            return text;
          }
        }
        return null;
      };
      const pickCityFromRow = (row: any) =>
        pickText(
          row?.reservationHeaderDetails?.[0]?.pickupCity,
          row?.reservationDetails?.[0]?.pickupCity,
          row?.reservationDetails?.[0]?.city,
          row?.pickupCity,
          row?.city,
          row?.pickup?.pickupCity,
          row?.pickup?.city,
          row?.header?.pickupCity,
          row?.stopsDetails?.[0]?.pickupCity,
          row?.stopsDetails?.[0]?.city
        );
      const headerCity = this.reservationHeaderInfo?.find(
        (x: any) => Number(x?.reservationID) === Number(reservationID)
      )?.pickupCity;
      const reservationCity = this.reservationInfo?.find(
        (x: any) => Number(x?.reservationID) === Number(reservationID)
      )?.pickupCity;
      const resolvedCity =
        pickText(
          headerCity,
          reservationCity,
          pickCityFromRow(rowItem),
          pickCityFromRow(item),
          rowItem?.pickupLocation?.cityName,
          rowItem?.pickupLocation?.city,
          city
        );
      const resolvedRegistrationNumber =
        registrationNumber ??
        rowItem?.registrationNumber ??
        rowItem?.inventory?.registrationNumber;
      const resolvedCustomerPersonID = this.resolveMessagingCustomerPersonId(
        customerPersonID,
        item
      );
      this.dialog.open(FormDialogSendSmsWhatsappMailComponent, {
        width: '70%',
        data: {
          // advanceTable: filtered
  
          reservationID:reservationID,
          vehicle:vehicle,
          pickupDate:pickupDate,
          pickupTime:pickupTime,    
          registrationNumber:resolvedRegistrationNumber,
          driverName: rowItem?.driverName ?? rowItem?.driver?.driverName,
          driverPhone: rowItem?.driverPhone ?? rowItem?.driverMobile ?? rowItem?.driver?.mobile1,
          customerPersonName:customerPersonName,
          city:resolvedCity,
          item: rowItem,
          customerPersonID:resolvedCustomerPersonID
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

  isMessagingEnabledForAllotment(item: any): boolean {
    return isAllotedBooking(item);
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
      data: 
      {
        advanceTable:
        {
          fromDate: this._filters.fromDate,
          toDate: this._filters.toDate,
        }        
      }
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
    this.garageOutDetailsloadData(item)
  }

  public garageOutDetailsloadData(item:any) {
   
    this.dispatchByExecutiveService.getgaroutCheckDataDetails(item.dutySlipID).subscribe
      (
        data => {
          this.dataSource = data;
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
    this.verifyImageloadData(item)
  }

  public verifyImageloadData(item:any) {
   
    this.dutySlipQualityCheckedByExecutiveService.getdutyQualityCheckDataDetails(item.allotmentID).subscribe
      (
        data => {
          this.dataSource = data;
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
    this.reachedDetailsloadData(item)
  }

  public reachedDetailsloadData(item:any) {
   
    this.dispatchByExecutiveService.getgaroutCheckDataDetails(item.dutySlipID).subscribe
      (
        data => {
          this.dataSource = data;
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
      width: '920px',
      maxWidth: '96vw',
      data: {
        advanceTable: item.stopsDetails[0],
        parentRow: item
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
      width: '920px',
      maxWidth: '96vw',
      data: {
        advanceTable: item.stopsDetails[1],
        parentRow: item,
        locationKind: 'drop'
      }
    });
  }

  StopDetailsInfo(item) {
    // const filtered = this.reservationInfo.filter(
    //   (value) => value.reservationID === reservationID
    // )[0].stopsDetails;
    this.dialog.open(StopDetailsInfoComponent, {
      width: 'min(1200px, 98vw)',
      maxWidth: '98vw',
      panelClass: 'stop-details-wide-dialog',
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
      width: 'min(1200px, 98vw)',
      maxWidth: '98vw',
      panelClass: 'stops-on-map-wide-dialog',
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
        maxWidth: '920px',
        panelClass: 'trip-feedback-dialog-panel',
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
            customerPersonName: item?.passengerDetails?.[0]?.customerPersonName,
            item:item,
            verifyDutyStatusAndCacellationStatus: 'Changes allow'
          }
          
      });
      const dialogInstance = dialogRef.componentInstance;
     
      // Subscribe to the messageSubject to receive messages from the dialog
      dialogInstance.messageSubject.subscribe((data: any) => {
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

  if (!reservationGroupID) {
    console.warn('⚠️ reservationGroupID is missing!');
  }

  const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt((reservationGroupID ?? '').toString()));
  const encryptedReservationID = encodeURIComponent(this._generalService.encrypt((reservationID ?? '').toString()));
  const encryptedPickupDate = encodeURIComponent(this._generalService.encrypt(
    pickupDate instanceof Date ? pickupDate.toISOString() : (pickupDate ?? '').toString()
  ));
  const encryptedPickupAddress = encodeURIComponent(this._generalService.encrypt((pickupAddress ?? '').toString()));
  const encryptedStatus = this.status ? encodeURIComponent(this._generalService.encrypt(this.status)) : undefined;


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
    this.isLoading = true;
    if (this.paginator && this.paginator.pageIndex !== 0) {
      this.paginator.firstPage();
      return;
    }
    this.loadDataForHeader(this.bookingCategory,this.currentPage, this.recordsPerPage, true);
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
       maxWidth: '95vw',
       maxHeight: '90vh',
       autoFocus: false,
       restoreFocus: false,
       panelClass: 'dbe-dialog-centered',
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
       maxWidth: '95vw',
       maxHeight: '90vh',
       autoFocus: false,
       restoreFocus: false,
       panelClass: 'dbe-dialog-centered',
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
       maxWidth: '95vw',
       maxHeight: '90vh',
       autoFocus: false,
       restoreFocus: false,
       panelClass: 'dbe-dialog-centered',
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
    let dialogRef = this.dialog.open(FormDialogdriverRemarkComponent, {
      data: {
        action: 'edit',
        dutySlipID: item.dutySlipID,
        driverRemark: item.driverRemark,
        rowRecord: item
      }
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
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
      if (result !== undefined && result !== null) {
        item.nextDayInstruction = result.nextDayInstruction;
        item.activationStatus = "Active";
     
      }
    });
  }

  nextDayInstructionDetails(item: any) {
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

  getOwnershipImpLabel(row: any): string | null {
    const v = (row?.inventoryOwnedSupplied ?? '').toString().trim();
    if (v === 'Owned') return 'Own';
    if (v === 'Supplier') return 'Sup';
    return null;
  }

  getOwnershipImpTooltip(row: any): string | null {
    const v = (row?.inventoryOwnedSupplied ?? '').toString().trim();
    if (v === 'Owned') return row?.companyName?.trim() || 'Owned';
    if (v === 'Supplier') {
      const type = row?.supplierType?.trim();
      const name = row?.inventorySupplierName?.trim()
        || row?.supplierName?.trim()
        || row?.rpsName?.trim();
      if (type && name) return `${type} - ${name}`;
      return type || name || 'Supplier';
    }
    return null;
  }

  getModeOfPaymentImpLabel(row: any): string | null {
    const v = (row?.modeOfPayment ?? '').toString().trim();
    if (!v) return null;
    return v.length <= 12 ? v : `${v.substring(0, 11)}…`;
  }

  getModeOfPaymentImpTooltip(row: any): string | null {
    const v = (row?.modeOfPayment ?? '').toString().trim();
    return v ? `Mode of Payment: ${v}` : null;
  }

  private getControlPanelMessagingHeaderDisplay(row: any): {
    successBadges: string[];
    failedBadges: string[];
    otherParts: string[];
    hasAnyStatus: boolean;
    tooltip: string;
  } {
    const passengerSms = this.readCpMessagingField(
      row,
      ['latestPassengerSmsMessageStatus', 'latestSmsMessageStatus'],
      ['LatestPassengerSmsMessageStatus', 'LatestSmsMessageStatus']
    );
    const passengerSmsDetails = this.readCpMessagingField(
      row,
      ['latestPassengerSmsMessageStatusDetails', 'latestSmsMessageStatusDetails'],
      ['LatestPassengerSmsMessageStatusDetails', 'LatestSmsMessageStatusDetails']
    );
    const passengerWa = this.readCpMessagingField(
      row,
      ['latestPassengerWhatsAppMessageStatus', 'latestWhatsAppMessageStatus'],
      ['LatestPassengerWhatsAppMessageStatus', 'LatestWhatsAppMessageStatus']
    );
    const passengerWaDetails = this.readCpMessagingField(
      row,
      ['latestPassengerWhatsAppMessageStatusDetails', 'latestWhatsAppMessageStatusDetails'],
      ['LatestPassengerWhatsAppMessageStatusDetails', 'LatestWhatsAppMessageStatusDetails']
    );

    const bookerSms = this.readCpMessagingField(
      row,
      ['latestBookerSmsMessageStatus'],
      ['LatestBookerSmsMessageStatus']
    );
    const bookerSmsDetails = this.readCpMessagingField(
      row,
      ['latestBookerSmsMessageStatusDetails'],
      ['LatestBookerSmsMessageStatusDetails']
    );
    const bookerWa = this.readCpMessagingField(
      row,
      ['latestBookerWhatsAppMessageStatus'],
      ['LatestBookerWhatsAppMessageStatus']
    );
    const bookerWaDetails = this.readCpMessagingField(
      row,
      ['latestBookerWhatsAppMessageStatusDetails'],
      ['LatestBookerWhatsAppMessageStatusDetails']
    );

    const tooltipParts: string[] = [];
    const successBadges: string[] = [];
    const failedBadges: string[] = [];
    const otherParts: string[] = [];

    // Keep compact UI badges with passenger-first fallback.
    const effectiveSms = passengerSms || bookerSms;
    const effectiveWa = passengerWa || bookerWa;
    this.appendCpMessagingBadge('SMS', effectiveSms, successBadges, failedBadges, otherParts);
    this.appendCpMessagingBadge('WA', effectiveWa, successBadges, failedBadges, otherParts);

    this.appendCpMessagingTooltipLine(tooltipParts, 'Passenger SMS', passengerSms, passengerSmsDetails);
    this.appendCpMessagingTooltipLine(tooltipParts, 'Passenger WhatsApp', passengerWa, passengerWaDetails);
    this.appendCpMessagingTooltipLine(tooltipParts, 'Booker SMS', bookerSms, bookerSmsDetails);
    this.appendCpMessagingTooltipLine(tooltipParts, 'Booker WhatsApp', bookerWa, bookerWaDetails);

    const hasAnyStatus = !!(successBadges.length || failedBadges.length || otherParts.length);

    return {
      successBadges,
      failedBadges,
      otherParts,
      hasAnyStatus,
      tooltip: tooltipParts.join('\n'),
    };
  }

  private appendCpMessagingTooltipLine(lines: string[], label: string, status: string, details: string): void {
    if (!status) {
      return;
    }
    const st = status.trim();
    const det = this.sanitizeCpMessagingTooltipDetails(details);
    const stCmp = this.normalizeCpMessagingCompareText(st);
    const detCmp = this.normalizeCpMessagingCompareText(det);
    const isDuplicateDetail = !!det && (
      det.localeCompare(st, undefined, { sensitivity: 'accent' }) === 0 ||
      (stCmp && detCmp && (detCmp === stCmp || detCmp.includes(stCmp) || stCmp.includes(detCmp)))
    );

    if (det && !isDuplicateDetail) {
      lines.push(`${label}: ${st} — ${det}`);
      return;
    }
    lines.push(`${label}: ${st}`);
  }

  private sanitizeCpMessagingTooltipDetails(details: string): string {
    if (!details) {
      return '';
    }
    return details
      .replace(/kaleyra\s*ac/gi, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^[-,:;\s]+|[-,:;\s]+$/g, '')
      .trim();
  }

  private normalizeCpMessagingCompareText(value: string): string {
    if (!value) {
      return '';
    }
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
  }

  private readCpMessagingField(row: any, camelCandidates: string[], pascalCandidates: string[]): string {
    if (!row) {
      return '';
    }
    const keys = [...(camelCandidates || []), ...(pascalCandidates || [])];
    for (const key of keys) {
      const value = row[key];
      if (value !== null && value !== undefined) {
        return String(value).trim();
      }
    }
    return '';
  }

  /** Accepted -> S, Delivered -> D for compact badges. */
  private getMessagingStatusLetter(raw: string): 'S' | 'D' | null {
    if (!raw) {
      return null;
    }
    const u = raw.trim().toUpperCase();
    if (u === 'ACCEPTED') {
      return 'S';
    }
    if (u === 'DELIVERED') {
      return 'D';
    }
    return null;
  }

  private appendCpMessagingBadge(
    prefix: string,
    status: string,
    successBadges: string[],
    failedBadges: string[],
    otherParts: string[]
  ): void {
    if (!status) {
      return;
    }
    const letter = this.getMessagingStatusLetter(status);
    if (letter) {
      successBadges.push(`${prefix}-${letter}`);
      return;
    }
    const cat = this.classifyMessagingStatus(status);
    if (cat === 's') {
      successBadges.push(`${prefix}-S`);
    } else if (cat === 'f') {
      failedBadges.push(`${prefix}-F`);
    } else if (cat === 'o') {
      otherParts.push(`${prefix}:${status}`);
    }
  }

  private classifyMessagingStatus(raw: string): 'n' | 's' | 'f' | 'o' {
    if (!raw) {
      return 'n';
    }
    const u = raw.toUpperCase();
    if (u === 'OK' || u === 'CREATED' || u === 'SENT' || u === 'READ') {
      return 's';
    }
    if (/^\d{3}$/.test(u)) {
      const code = parseInt(u, 10);
      if (code >= 200 && code < 300) {
        return 's';
      }
      if (code >= 400) {
        return 'f';
      }
      return 'o';
    }
    if (
      u.includes('FAIL') ||
      u.includes('ERROR') ||
      u.includes('UNDELIVER') ||
      u.includes('INVALID') ||
      u.includes('REJECT') ||
      u === 'FALSE'
    ) {
      return 'f';
    }
    return 'o';
  }

  getAllotmentDisplay(item: any): { label: string; color: string } {
  const allotmentStatus = this.AllotmentOnTime(item); // 'onTime' | 'late' | 'lateNotDone' | 'notDone'
  const delay = item.lifeCycleStatus?.carAndDriverAllotedDelayInMinutes || 0;
  const isAlloted = item.lifeCycleStatus?.carAndDriverAlloted === 'Yes';
  const type = item.allotmentType;
  const displayType = type?.toLowerCase() === 'Soft' ? 'Soft' : type;

  if (isAlloted && delay > 0) {
    return { label: `Alloted (${displayType})`, color: 'red' };
  }

  if (isAlloted && delay === 0) {
    return { label: `Alloted (${displayType})`, color: 'green' };
  }

  if (allotmentStatus === 'lateNotDone') {
    return { label: 'Pending', color: 'red' };
  }

  if (allotmentStatus === 'notDone') {
    if(displayType === null)
    {
     return { label: 'Pending', color: 'black' };
    }
    else
  {
     return { label:  `Alloted (${displayType})`, color: 'black' };

    }
  }

 return { label: `Alloted (${displayType})`, color: 'green' };; // if late but still within threshold
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
  getDropOffAddressValue(source: any): string {
    if (!source) {
      return 'N/A';
    }
    const raw =
      source.dropOffAddressDetails ??
      source.dropOffAddress ??
      source.drop?.dropOffAddressDetails ??
      source.drop?.dropOffAddress;
    const trimmed = (raw ?? '').toString().trim();
    return trimmed || 'N/A';
  }

getLifeCycleDisplay(status: any): { label: string; color: string } {
  if (status.garageIn === 'Yes')
 {
    return { label: 'GarageIn', color: 'black' };
  } 
  else if (status.dropped === 'Yes')
 {
    return { label: 'Trip End', color: 'black' };
  } 
  else if (status.pickedUp === 'Yes') {
  if (status.pickedUpDelayInMinutes > 0)
 {
      return { label: 'Trip Start', color: 'red' };
 } 
  else {
      return { label: 'Trip Start', color: 'black' };
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

  incidence(item: any): void {
    this.openIncidenceListDialog(item, 'incidence');
  }

  incidenceOne(item: any): void {
    const encryptedReservationID = encodeURIComponent(
      this._generalService.encrypt(item.reservationID.toString())
    );
    const url = this.route.serializeUrl(
      this.route.createUrlTree(['/incidence'], {
        queryParams: {
          reservationID: encryptedReservationID,
        },
      })
    );
    const closingWin = window.open(this._generalService.FormURL + url, '_blank');
    closingWin?.focus();
  }

  openIncidenceListDialog(item: any, focusAction: 'incidence' | 'resolution'): void {
    const dialogRef = this.dialog.open(IncidenceListDialogComponent, {
      width: '90%',
      maxWidth: '1100px',
      data: {
        item: item,
        reservationID: item.reservationID,
        focusAction: focusAction,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.emitEventToChild();
      }
    });
  }

  resolution(item: any): void {
    this.openIncidenceListDialog(item, 'resolution');
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
    const encryptedDropOffAddress = encodeURIComponent(
      this._generalService.encrypt(this.getDropOffAddressValue(item.drop))
    );
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
  const rid = Number(
    reservationID != null && reservationID !== ''
      ? reservationID
      : item?.reservationID
  );
  if (!Number.isFinite(rid) || rid <= 0) {
    console.warn('TrackOnMapInfo skipped: invalid reservationID', reservationID, item);
    return;
  }

  const trackUrl = `https://ecopartner.ecoserp.in/?id=${encodeURIComponent(String(Math.trunc(rid)))}`;
  window.open(trackUrl, '_blank', 'noopener,noreferrer');
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
      width: '520px',
      maxWidth: '96vw',
      data: 
      {
        advanceTable:item,
        customerID:item.customerID,
        status: this.status
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
    if(item && item.dutySlipID === null || item.dutySlipID === undefined || item.dutySlipID === 0 || item.dutySlipID === '')  {
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
      item.dutyPostPickUPCall = {
        ...(item.dutyPostPickUPCall || {}), // fallback to empty object if null
        ...res
      };
      this.postPickUPCallLoadData(item,false);  // Refresh data only if saved
    }
      
    })
  }
 postPickUPCallLoadDataDetails(item: any) {
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
  /** Keep inline (green) expansion body closed on single click; Reservation Details opens on double-click only. */
  onCpReservationExpandedChange(opened: boolean, panel: MatExpansionPanel): void {
    if (opened) {
      panel.close();
    }
  }

  /** Double-click row title area to open Reservation Details modal. */
  onReservationHeaderDblClick(event: MouseEvent, reservationID: any, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.controlPanelDetails(reservationID, index);
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
    this.setupPrefixAutocompletes();
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

setCalculatedLocationOutTime(data: any, interval?: number) {

  if (!data?.pickupDate || !data?.pickupTime) {
    data.calculatedLocationOutDateTime = null;
    return;
  }

  const pickupDate = new Date(data.pickupDate);
  const eventTime = new Date(data.pickupTime);

  // 👇 invalid date check
  if (isNaN(eventTime.getTime())) {
    data.calculatedLocationOutDateTime = null;
    return;
  }

  const combinedDateTime = new Date(
    pickupDate.getFullYear(),
    pickupDate.getMonth(),
    pickupDate.getDate(),
    eventTime.getHours(),
    eventTime.getMinutes()
  );

  const minutesToSubtract = interval && interval > 0 ? interval : 90;

  combinedDateTime.setMinutes(combinedDateTime.getMinutes() - minutesToSubtract);

  data.calculatedLocationOutDateTime = combinedDateTime;

  //console.log('Calculated Location Out Time:', combinedDateTime);
}


   //---------- Reg Number ----------
    // InitRegNumber()
    // {
    //   this._generalService.GetRegNoForDropDown().subscribe(
    //   data=>
    //   {
    //     this.RegNumberList=data;
    //     this.filteredRegNumberOptions = this.filterForm.controls.vehicleInventory.valueChanges.pipe(
    //       startWith(""),
    //       map(value => this._filterRegNo(value || ''))
    //     ); 
    //   });
    // }
} 


