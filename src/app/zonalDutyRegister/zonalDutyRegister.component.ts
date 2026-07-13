
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ZonalDutyRegisterService } from './zonalDutyRegister.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ZonalDutyRegisterModel, SalesPersonDropDownModel, SearchCriteria } from './zonalDutyRegister.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { extractExportErrorMessage } from '../general/export-job.helper';
import { Form, FormControl } from '@angular/forms';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
import moment from 'moment';
import { ModeOfPaymentDropDown } from '../modeOfPayment/modeOfPaymentDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntity/organizationalEntityDropDown.model';
import { SupplierTypeDropDownModel } from '../supplierType/supplierType.model';
import { SupplierDropDown } from '../supplier/supplierDropDown.model';
import { VehicleVehicleCategoryDropDown } from '../vehicle/vehicleVehicleCategoryDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
import { CustomerTypeDropDown } from '../customerType/customerTypeDropDown.model';
import { CustomerCustomerGroupDropDown } from '../customer/customerCustomerGroupDropDown.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { CustomerPersonDetailsDropDown } from '../passengerDetails/customerPersonDetailsDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import { LocationGroupDropDown } from '../locationGroup/locationGroupDropDown.model';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import { EmployeeDropDown } from '../employee/employeeDropDown.model';
@Component({
  standalone: false,
  selector: 'app-zonalDutyRegister',
  templateUrl: './zonalDutyRegister.component.html',
  styleUrls: ['./zonalDutyRegister.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ZonalDutyRegisterComponent implements OnInit, OnDestroy {
 baseDisplayedColumns = [
  'ReservationID',
  'PickupDate',
  'BookingDate',
  'CustomerName',
  'BookerName',
  'GuestName',
  'City',
  'PackageType',
  'CarNumber',
  'DriverID',
  'DriverName',
  'DispatchLocation',
  'BilledDutyType',
  'Package',
  'CarBooked',
  'CarSent',
  'ModeOfPayment',
  'LocationOutDate',
  'LocationOutTime',
  'LocationOutKM',
  'reportingDate',
  'reportingTime',
  'reportingKM',
  'releasingDate',
  'releasingTime',
  'releasingKM',
  'LocationInDate',
  'LocationInTime',
  'LocationInKM',
  'G2P',
  'D2G',
  'AppP2D',
  'DriverP2D',
  'GPSP2D',
  'TotalKMWithAddtionalKM',
  'TotalHoursWithAddtionalHours',
  'Parking',
  'Toll',
  'FasTag',
  'InvoiceInterstateTax',
  'DutyExpenseChargeTotal',
  'DSVerifyStatus',
  'GoodForBilling',
  'DSStatus',
  'ReservationStatus',
  'OwnedSupplied',
  'SupplierType',
  'AdocStatus',
  'SalesPerson',
  'KAM',
  'ReservationCreatedBy',
  'AllotmentBy',
  'SupplierID',
  'SupplierName',  
  'ClosingDate',
  'ClosureMethod',
  'PickupAddress',
  'PickupAddressDetails',
  'DropOffAddress',
  'DSClosedBy',
  'DutySlipImage',
];

  displayedColumns: string[] = [];
  customerSpecificFieldColumns: { columnId: string; fieldName: string }[] = [];

  
  dataSource: ZonalDutyRegisterModel[] | null;
  advanceTable: ZonalDutyRegisterModel | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string = '';
  search : FormControl = new FormControl();
  selectedFilter: string = 'search';
  searchTerm: any = '';
  SearchRes: string = '';
  SearchDuty: string = '';

  public CustomerGroupList?: CustomerGroupDropDown[] = [];
  SearchCustomerGroup: FormControl = new FormControl();
  filteredCustomerGroupOptions: Observable<CustomerGroupDropDown[]>;

  public CustomerList?: CustomerDropDown[] = [];
  SearchCustomer: FormControl = new FormControl();
  filteredCustomerOptions: Observable<CustomerDropDown[]>;

  public BranchList?: OrganizationalEntityDropDown[] = [];
  SearchBranch: FormControl = new FormControl();
  filteredBranchOptions: Observable<OrganizationalEntityDropDown[]>;

  public KAMList?: EmployeeDropDown[] = [];
  SearchKAM: FormControl = new FormControl();
  filteredKAMOptions: Observable<EmployeeDropDown[]>;

  public CustomerPersonList?: CustomerPersonDetailsDropDown[] = [];
  SearchCustomerPerson: FormControl = new FormControl();
  filteredCustomerPersonOptions: Observable<CustomerPersonDetailsDropDown[]>;
  
  public PackageTypeList?: PackageTypeDropDown[] = [];
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;

  SearchDutyType : FormControl = new FormControl();
  SearchFeedbackDate: string = '';

  SearchSlipReceipt:boolean | null = null;
  SearchKAMID: number = 0;
  SearchBranchID: number = 0;

  SearchDispatchLocation : FormControl = new FormControl();
  public DispatchLocationList?: OrganizationalEntityDropDown[] = [];
  filteredDispatchLocationOptions: Observable<OrganizationalEntityDropDown[]>;

  SearchMOP : FormControl = new FormControl();
  public PaymentModeList?:ModeOfPaymentDropDown[]=[];
  filteredPaymentModeOptions: Observable<ModeOfPaymentDropDown[]>;

  SearchSupplierType : FormControl = new FormControl();
  public SupplierTypeList?: SupplierTypeDropDownModel[] = [];
  filteredSupplierTypeOptions: Observable<SupplierTypeDropDownModel[]>;

  SearchFromDate: string = '';
  SearchToDate: string = '';
  SearchBillToDate: string = '';
  SearchBillDateFrom: string = '';

  SearchSupplier: FormControl = new FormControl();
  public SupplierList?: SupplierDropDown[] = [];
  filteredSupplierOptions: Observable<SupplierDropDown[]>;  

  SearchClosureType : FormControl = new FormControl();

  SearchCarSend : FormControl = new FormControl();
  public CarSendList?:VehicleDropDown[]=[];
  filteredCarSendOptions: Observable<VehicleDropDown[]>;

  SearchCarBooked : FormControl = new FormControl();
  public CarBookedList?:VehicleDropDown[]=[];
  filteredCarBookedOptions: Observable<VehicleDropDown[]>;

  SearchCustomerLocationName : FormControl = new FormControl();
  public CustomerLocationList?: OrganizationalEntityDropDown[] = [];
  filteredCustomerLocationOptions: Observable<OrganizationalEntityDropDown[]>;
  public LocationGroupList?: LocationGroupDropDown[] = [];
  filteredLocationGroupOptions: Observable<LocationGroupDropDown[]>;

  SearchBookingStatus : FormControl = new FormControl();
  SearchImportance : FormControl = new FormControl();
  SearchDSVerification : FormControl = new FormControl(null);
  SearchGoodForBill : FormControl = new FormControl(null);
  SearchBillStatus : FormControl = new FormControl(null);
  
  SearchLocationGroup : FormControl = new FormControl();

  SearchDri : FormControl = new FormControl();
  public DriverList?:DriverDropDown[]=[];
  filteredDriverOptions:Observable<DriverDropDown[]>;

  SearchCarNo : FormControl = new FormControl();
  public CarNoList?: VehicleDropDown[] = [];
  filteredCarNoOptions:Observable<VehicleDropDown[]>;

  SearchSupplierO : FormControl = new FormControl();

  SearchCustomerType: FormControl = new FormControl();
  public CustomerTypeList?: CustomerTypeDropDown[] = [];
  filteredCustomerTypeOptions: Observable<CustomerTypeDropDown[]>;

  SearchSalesPerson: FormControl = new FormControl();
  public SalesPersonList?: SalesPersonDropDownModel[] = [];
  filteredSalesPersonOptions: Observable<SalesPersonDropDownModel[]>;

  SearchReser: string = '';
  SearchDutySlip: string = '';
  SearchChangeMOPCase: string = '';

  SearchGuestName: FormControl = new FormControl();
  public GuestNameList?: CustomerPersonDetailsDropDown[] = [];
  filteredGuestNameOptions: Observable<CustomerPersonDetailsDropDown[]>;

  SearchGuestEmail: string = '';
  SearchGuestMobile: string = '';

  SearchCity: FormControl = new FormControl();
  public CityList?: CityDropDown[] = [];
  filteredCityOptions: Observable<CityDropDown[]>;

  SearchCancellationDateFrom: string = '';
  SearchCancellationDateTo: string = '';

  SearchBookingDateFrom: string = '';
  SearchBookingDate: string = '';
  csvExporting: boolean = false;
  hasManualSearch: boolean = false;
  exportJobId: string | null = null;
  exportJobStatus: any = null;
  exportJobRunning = false;
  exportJobDownloading = false;
  exportJobError = '';
  exportJobStartedAt: number | null = null;
  private exportPollSub?: Subscription;
  readonly maxPickupDateRangeDays = 15;
  readonly exportJobType = 'ZonalDutyRegisterExport';
    
  
 
  

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public zonalDutyRegisterService: ZonalDutyRegisterService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    this.displayedColumns = [...this.baseDisplayedColumns];
    // this.loadData();
    this.InitCustomerGroup();
    this.InitCustomerPerson();
    this.InitPackageType();
    this.InitDispatchLocation();
    this.InitCustomerLocation();
    this.InitPaymentMode();
    this.InitSupplierType();
    this.InitSupplier();
    this.InitCarSend();
    this.InitCarBooked();
    this.InitDriver();
    this.InitCarNo();
    this.InitCustomerType();
    this.InitSalesPerson();
    this.InitGuestName();
    this.InitLocationGroup();
    this.InitCities();
    this.InitBranch();
    this.InitKAM();
    //this.SubscribeUpdateService();
  }

  ngOnDestroy() {
    this.stopExportPolling();
  }

  refresh() 
  {
    this.selectedFilter='search';
    this.searchTerm='';
    this.SearchCustomerGroup.setValue('');
    this.SearchCustomer.setValue('');
    this.SearchBranch.setValue('');
    this.SearchKAM.setValue('');
    this.SearchCustomerPerson.setValue('');
    this.SearchDutyType.setValue('');
    this.SearchFeedbackDate = '';
    this.SearchSlipReceipt = null;
    this.SearchClosureType.setValue('');
    this.SearchDispatchLocation.setValue('');
    this.SearchCustomerLocationName.setValue('');
    this.SearchMOP.setValue('');
    this.SearchSupplierType.setValue('');
    this.SearchFromDate = '';
    this.SearchToDate = '';
    this.SearchSalesPerson.setValue('');
    this.SearchSupplier.setValue('');
    this.SearchCarSend.setValue('');
    this.SearchCarBooked.setValue('');
    this.SearchBookingStatus.setValue('');
    this.SearchImportance.setValue('');
    this.SearchDSVerification.setValue(null);
    this.SearchGoodForBill.setValue(null);
    this.SearchBillStatus.setValue(null);
    this.SearchDri.setValue('');
    this.SearchCarNo.setValue('');
    this.SearchSupplierO.setValue('');
    this.SearchCustomerType.setValue('');
    this.SearchRes = '';
    this.SearchDuty = '';
    this.SearchGuestName.setValue('');
    // this.SearchGuestEmail = '';
        this.SearchGuestMobile = '';
    this.SearchCity.setValue('');
    this.SearchCancellationDateFrom = '';
    this.SearchCancellationDateTo = '';
    this.SearchBookingDateFrom = '';
    this.SearchBookingDate = '';
    this.SearchChangeMOPCase = '';
    this.SearchActivationStatus = true;
    this.hasManualSearch = false;
    this.PageNumber=0;
    this.dataSource = [];
    this.clearExportJob();
  }

  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }

  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

  
  // public loadData() 
  // {
  //   if(this.SearchFeedbackDate!=="")
  //   {
  //     this.SearchFeedbackDate=moment(this.SearchFeedbackDate).format('MMM DD yyyy');
  //   }
  //   if(this.SearchFromDate!=="")
  //   {
  //     this.SearchFromDate=moment(this.SearchFromDate).format('MMM DD yyyy');
  //   }
  //   if(this.SearchToDate!=="")
  //   {
  //     this.SearchToDate=moment(this.SearchToDate).format('MMM DD yyyy');
  //   }
  //   this.ZonalDutyRegisterService.getTableData(this.SearchCustomerGroup.value,this.SearchCustomerPerson.value,this.SearchDutyType.value,this.SearchFeedbackDate,
  //                                         this.SearchClosureType.value,this.SearchDispatchLocation.value,this.SearchMOP.value,this.SearchSupplierType.value,this.SearchSupplier.value,
  //                                         this.SearchFromDate,this.SearchToDate,this.SearchSalesPerson.value,this.SearchCarSend.value,this.SearchCarBooked.value,
  //                                         this.SearchCustomerType.value,this.SearchCustomerLocation.value,this.SearchBookingStatus.value,this.SearchDri.value,this.SearchCarNo.value,
  //                                         this.SearchOwnSupplier.value,this.SearchReservationNo,this.SearchDutySlipNo,this.SearchGuestName.value,this.SearchGuestEmail,
  //                                         this.SearchCity.value,
  //   this.PageNumber).subscribe
  //   (
  //     data =>   
  //     {
  //       this.dataSource = data;
  //     },
  //   (error: HttpErrorResponse) => { this.dataSource = null;}
  //   );
  // }

  public loadData() 
  {
    const searchCriteria = this.buildSearchCriteria();
    this.zonalDutyRegisterService.getTableData(searchCriteria,this.PageNumber,).subscribe(
      data =>   
      {
        this.dataSource = this.applyCustomerSpecificFieldColumns(Array.isArray(data) ? data : []);
        console.log(this.dataSource);
      },
    (error: HttpErrorResponse) => { 
       console.log(error);
  this.dataSource = [];
  this.applyCustomerSpecificFieldColumns([]);
  this.showNotification('snackbar-danger', error?.message || 'Zonal Duty Register search failed', 'bottom', 'center');
    }
    );
  }
  
  showNotification(colorName, text, placementFrom, placementAlign) 
  {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  onContextMenu(event: MouseEvent, item: ZonalDutyRegisterModel) 
  {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  NextCall()
  {
    if (this.dataSource?.length>0) 
    {
      this.PageNumber++;
      this.loadData();
    }
  }

  PreviousCall()
  {
    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData(); 
    } 
  }

  public SearchData()
  {
    if (this.exportJobRunning) {
      return;
    }

    const dateRangeError = this.validatePickupDateRange();
    if (dateRangeError) {
      this.showNotification('snackbar-danger', dateRangeError, 'bottom', 'center');
      return;
    }

    this.hasManualSearch = true;
    this.dataSource = [];
    this.exportJobError = '';
    this.exportJobStartedAt = Date.now();
    const searchCriteria = this.buildSearchCriteria();

    this.exportJobRunning = true;
    this.showNotification('snackbar-info', 'Export job started. CSV will be ready when processing completes.', 'bottom', 'center');

    this.zonalDutyRegisterService.startExportJob(searchCriteria).subscribe(
      (startResult: any) => {
        const jobId = startResult?.jobId ?? startResult?.JobId;
        if (!jobId) {
          this.exportJobRunning = false;
          this.exportJobError = 'Could not start export job.';
          this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
          return;
        }

        this.exportJobId = jobId;
        this.exportJobStatus = {
          jobId,
          jobType: startResult?.jobType ?? startResult?.JobType ?? this.exportJobType,
          status: startResult?.status ?? startResult?.Status ?? 'Pending',
          message: startResult?.message ?? startResult?.Message ?? 'Export queued'
        };
        this.startExportPolling(jobId);
      },
      async (error) => {
        this.exportJobRunning = false;
        this.exportJobError = await extractExportErrorMessage(error);
        this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
      }
    );
  }

  downloadExportCsv() {
    if (!this.exportJobId || !this.zonalDutyRegisterService.isExportJobReady(this.exportJobStatus) || this.exportJobDownloading) {
      return;
    }

    this.exportJobDownloading = true;
    this.zonalDutyRegisterService.downloadExportJob(this.exportJobId).subscribe(
      async (blob: Blob) => {
        this.exportJobDownloading = false;
        if (!blob || blob.size === 0) {
          this.showNotification('snackbar-danger', 'Export file is empty or unavailable.', 'bottom', 'center');
          return;
        }

        const contentType = (blob.type || '').toLowerCase();
        if (contentType.includes('application/json') || contentType.includes('text/plain')) {
          const text = await blob.text();
          let message = 'Export file is not ready.';
          try {
            const parsed = JSON.parse(text || '{}');
            message = parsed.message || message;
          } catch {
            if (text?.trim()) {
              message = text;
            }
          }
          this.showNotification('snackbar-danger', message, 'bottom', 'center');
          return;
        }

        const fileName = this.exportJobStatus?.fileName ?? this.exportJobStatus?.FileName;
        this.triggerCsvDownload(blob, fileName);
        this.zonalDutyRegisterService.getExportJobStatus(this.exportJobId).subscribe(
          (status) => { this.exportJobStatus = status; },
          () => {}
        );
      },
      async (error) => {
        this.exportJobDownloading = false;
        const message = await extractExportErrorMessage(error);
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    );
  }

  canDownloadExport(): boolean {
    return !!this.exportJobId && this.zonalDutyRegisterService.isExportJobReady(this.exportJobStatus) && !this.exportJobDownloading;
  }

  isExportJobInProgress(): boolean {
    return this.exportJobRunning || this.zonalDutyRegisterService.isExportJobRunning(this.exportJobStatus);
  }

  getExportJobStatusLabel(): string {
    return this.exportJobStatus?.status ?? this.exportJobStatus?.Status ?? '';
  }

  getExportJobMessage(): string {
    return this.exportJobStatus?.message ?? this.exportJobStatus?.Message ?? this.exportJobError ?? '';
  }

  getExportRowsExported(): number {
    return this.exportJobStatus?.rowsExported ?? this.exportJobStatus?.RowsExported ?? 0;
  }

  getExportElapsedTime(): string {
    if (!this.exportJobStartedAt) {
      return '—';
    }
    const elapsedSeconds = Math.floor((Date.now() - this.exportJobStartedAt) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }

  private startExportPolling(jobId: string) {
    this.stopExportPolling();
    this.exportPollSub = this.zonalDutyRegisterService.pollExportJob(jobId).subscribe(
      (status: any) => {
        this.exportJobStatus = status;
        const current = String(status?.status ?? status?.Status ?? '').toLowerCase();

        if (current === 'failed') {
          this.exportJobRunning = false;
          this.exportJobError = status?.message ?? status?.Message ?? 'Export failed.';
          this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
          this.stopExportPolling();
          return;
        }

        if (current === 'completed') {
          this.exportJobRunning = false;
          const rows = status?.rowsExported ?? status?.RowsExported ?? 0;
          this.showNotification('snackbar-success', status?.message ?? `Export ready (${rows} rows). Click Download CSV.`, 'bottom', 'center');
          this.stopExportPolling();
        }
      },
      async (error) => {
        this.exportJobRunning = false;
        this.exportJobError = await extractExportErrorMessage(error);
        this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
        this.stopExportPolling();
      }
    );
  }

  private stopExportPolling() {
    if (this.exportPollSub) {
      this.exportPollSub.unsubscribe();
      this.exportPollSub = undefined;
    }
  }

  private clearExportJob() {
    this.stopExportPolling();
    this.exportJobId = null;
    this.exportJobStatus = null;
    this.exportJobRunning = false;
    this.exportJobDownloading = false;
    this.exportJobError = '';
    this.exportJobStartedAt = null;
  }

  private triggerCsvDownload(blob: Blob, preferredFileName?: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timeStamp = moment().format('YYYYMMDD_HHmmss');
    link.href = url;
    link.download = preferredFileName || `ZonalDutyRegister_${timeStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    this.showNotification('snackbar-success', 'CSV downloaded', 'bottom', 'center');
  }

  private isSearchValueSet(value: any): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === 'boolean') {
      return true;
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    const text = String(value).trim();
    return text !== '' && text.toLowerCase() !== 'null';
  }

  hasAdditionalSearchFilters(): boolean {
    return (
      this.isSearchValueSet(this.SearchCustomerGroup?.value) ||
      this.isSearchValueSet(this.SearchCustomer?.value) ||
      this.isSearchValueSet(this.SearchBranch?.value) ||
      this.isSearchValueSet(this.SearchKAM?.value) ||
      this.isSearchValueSet(this.SearchBranchID) ||
      this.isSearchValueSet(this.SearchKAMID) ||
      this.isSearchValueSet(this.SearchCustomerPerson?.value) ||
      this.isSearchValueSet(this.SearchDutyType?.value) ||
      this.isSearchValueSet(this.SearchFeedbackDate) ||
      (this.SearchSlipReceipt !== null && this.SearchSlipReceipt !== undefined) ||
      this.isSearchValueSet(this.SearchClosureType?.value) ||
      this.isSearchValueSet(this.SearchDispatchLocation?.value) ||
      this.isSearchValueSet(this.SearchMOP?.value) ||
      this.isSearchValueSet(this.SearchSupplierType?.value) ||
      this.isSearchValueSet(this.SearchSupplier?.value) ||
      this.isSearchValueSet(this.SearchSalesPerson?.value) ||
      this.isSearchValueSet(this.SearchCarSend?.value) ||
      this.isSearchValueSet(this.SearchCarBooked?.value) ||
      this.isSearchValueSet(this.SearchCustomerType?.value) ||
      this.isSearchValueSet(this.SearchCustomerLocationName?.value) ||
      this.isSearchValueSet(this.SearchBookingStatus?.value) ||
      this.isSearchValueSet(this.SearchImportance?.value) ||
      (this.SearchDSVerification?.value !== null && this.SearchDSVerification?.value !== undefined) ||
      (this.SearchGoodForBill?.value !== null && this.SearchGoodForBill?.value !== undefined) ||
      (this.SearchBillStatus?.value !== null && this.SearchBillStatus?.value !== undefined) ||
      this.isSearchValueSet(this.SearchDri?.value) ||
      this.isSearchValueSet(this.SearchCarNo?.value) ||
      this.isSearchValueSet(this.SearchSupplierO?.value) ||
      this.isSearchValueSet(this.SearchRes) ||
      this.isSearchValueSet(this.SearchDuty) ||
      this.isSearchValueSet(this.SearchGuestName?.value) ||
      this.isSearchValueSet(this.SearchGuestMobile) ||
      this.isSearchValueSet(this.SearchCity?.value) ||
      this.isSearchValueSet(this.SearchCancellationDateFrom) ||
      this.isSearchValueSet(this.SearchCancellationDateTo) ||
      this.isSearchValueSet(this.SearchBookingDateFrom) ||
      this.isSearchValueSet(this.SearchBookingDate) ||
      this.isSearchValueSet(this.SearchChangeMOPCase) ||
      this.isSearchValueSet(this.SearchLocationGroup?.value) ||
      this.isSearchValueSet(this.SearchBillDateFrom) ||
      this.isSearchValueSet(this.SearchBillToDate)
    );
  }

  validatePickupDateRange(): string | null {
    if (!this.SearchFromDate || !this.SearchToDate) {
      return 'Pickup date range is required. Please select From and To dates.';
    }

    const fromDate = moment(this.SearchFromDate).startOf('day');
    const toDate = moment(this.SearchToDate).startOf('day');
    if (!fromDate.isValid() || !toDate.isValid()) {
      return 'Please enter valid pickup dates.';
    }
    if (toDate.isBefore(fromDate)) {
      return 'Pickup To Date cannot be earlier than From Date.';
    }
    if (!this.hasAdditionalSearchFilters()) {
      const inclusiveDays = toDate.diff(fromDate, 'days') + 1;
      if (inclusiveDays > this.maxPickupDateRangeDays) {
        return `Pickup date range cannot exceed ${this.maxPickupDateRangeDays} days when no other search filters are selected. Add another filter to search a wider range.`;
      }
    }

    return null;
  }

  private buildSearchCriteria(): SearchCriteria {
    return {
      UserID: this._generalService.getUserID(),
      ShowAllLocation:null,
      SearchCustomerGroup: this.SearchCustomerGroup?.value || "",
      SearchCustomer: this.SearchCustomer?.value || "",
      SearchBranch: this.SearchBranch?.value || "",
      SearchKAM: this.SearchKAM?.value || "",
      SearchBranchID: this.SearchBranchID,
      SearchKAMID: this.SearchKAMID,
      SearchCustomerPersonName: this.SearchCustomerPerson?.value || "",
      SearchDutyType: this.SearchDutyType?.value || "",
      SearchFeedbackDate: this.SearchFeedbackDate !== "" ? moment(this.SearchFeedbackDate).format('MMM DD yyyy') : "",
      SearchSlipReceipt: this.SearchSlipReceipt,
      SearchClosureType: this.SearchClosureType?.value || "",
      SearchDispatchLocation: this.SearchDispatchLocation?.value || "",
      SearchMOP: this.SearchMOP?.value || "",
      SearchSupplierType: this.SearchSupplierType?.value || "",
      SearchSupplier: this.SearchSupplier?.value || "",
      SearchFromDate: this.SearchFromDate !== "" ? moment(this.SearchFromDate).format('MMM DD yyyy') : "",
      SearchToDate: this.SearchToDate !== "" ? moment(this.SearchToDate).format('MMM DD yyyy') : "",
      SearchSalesPersonName: this.SearchSalesPerson?.value || "",
      SearchCarSent: this.SearchCarSend?.value || "",
      SearchCarBook: this.SearchCarBooked?.value || "",
      SearchCustomerType: this.SearchCustomerType?.value || "",
      SearchCustomerLocationName: this.SearchCustomerLocationName?.value || "",
      SearchBookingStatus: this.SearchBookingStatus?.value || "",
      SearchImportance : this.SearchImportance?.value || "",
      SearchDSVerification: this.SearchDSVerification?.value,
      SearchGoodForBill: this.SearchGoodForBill?.value,
      SearchBillStatus: this.SearchBillStatus?.value,
      SearchDri: this.SearchDri?.value || "",
      SearchCarNo: this.SearchCarNo?.value || "",
      SearchSupplierO: this.SearchSupplierO?.value || "",
      SearchRes: this.SearchRes || "",
      SearchDuty: this.SearchDuty || "",
      SearchGuestName: this.SearchGuestName?.value || "",
      // SearchGuestEmail: this.SearchGuestEmail || "",
      SearchGuestMobile: this.SearchGuestMobile || "",
      SearchCity: this.SearchCity?.value || "",
      SearchCancellationDateFrom: this.SearchCancellationDateFrom !== "" ? moment(this.SearchCancellationDateFrom).format('MMM DD yyyy') : "",
      SearchCancellationDateTo: this.SearchCancellationDateTo !== "" ? moment(this.SearchCancellationDateTo).format('MMM DD yyyy') : "",
      SearchBookingDateFrom: this.SearchBookingDateFrom !== "" ? moment(this.SearchBookingDateFrom).format('MMM DD yyyy') : "",
      SearchBookingDate: this.SearchBookingDate !== "" ? moment(this.SearchBookingDate).format('MMM DD yyyy') : "",
      SearchChangeMOPCase: this.SearchChangeMOPCase,
      SearchLocationGroup: this.SearchLocationGroup?.value || "null",
      SearchBillFromDate: this.SearchBillDateFrom !== "" ? moment(this.SearchBillDateFrom).format('MMM DD yyyy') : "",
      SearchBillToDate: this.SearchBillToDate !== "" ? moment(this.SearchBillToDate).format('MMM DD yyyy') : "",
    };
  }

  SortingData(coloumName:any) 
  {   
    if (this.sortingData == 1) 
    {
      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else 
    {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    const searchCriteria = this.buildSearchCriteria();
    this.zonalDutyRegisterService.getTableDataSort(searchCriteria,this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = this.applyCustomerSpecificFieldColumns(Array.isArray(data) ? data : []);
      
      },
      (error: HttpErrorResponse) => { 
        this.dataSource = [];
        this.applyCustomerSpecificFieldColumns([]);
        this.showNotification('snackbar-danger', error?.message || 'Zonal Duty Register search failed', 'bottom', 'center');
      }
    );
  }

  //---------- Customer Group ----------
  InitCustomerGroup()
  {
    this._generalService.getCustomerGroup().subscribe(
    data=>
    {
      this.CustomerGroupList = data;
      this.filteredCustomerGroupOptions =this.SearchCustomerGroup.valueChanges.pipe(
      startWith(""),
      map(value => this._filterCustomerGroup(value || ''))
      ); 
    });
  }
  private _filterCustomerGroup(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 0)
     {
        return [];   
      }
    return this.CustomerGroupList.filter(
      data => 
      {
        return data.customerGroup.toLowerCase().indexOf(filterValue)===0;
      });
  }

  OnCustomerGroupSelected(selectedName: string) {
    const selectedSL = this.CustomerGroupList.find(
      data => data.customerGroup === selectedName
    );
  
    if (selectedSL) {
      this.getCustomerGroupID(selectedSL.customerGroupID);
    }
  }

  getCustomerGroupID(customerGroupID: any) {
    this.InitCustomer(customerGroupID);
  }

  //---------- Customer ----------
  InitCustomer(customerGroupID?:any)
  {
    this._generalService.GetCustomersForCP(customerGroupID).subscribe(
    data=>
    {
      this.CustomerList = data;
      this.filteredCustomerOptions =this.SearchCustomer.valueChanges.pipe(
      startWith(""),
      map(value => this._filterCustomer(value || ''))
      ); 
    });
  }
  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 0)
     {
        return [];   
      }
    return this.CustomerList.filter(
      data => 
      {
        return data.customerName.toLowerCase().indexOf(filterValue)===0;
      });
  }

  clearCustomerGroup(event: KeyboardEvent) {
  if (this.SearchCustomerGroup.value) {

    event.preventDefault();

    this.SearchCustomerGroup.setValue('');
    this.SearchCustomer.setValue('');
  }
}

  //----------Branch----------
  InitBranch()
  {
    this._generalService.GetOrganizationalBranch().subscribe(
    data=>
    {
      this.BranchList = data;
      this.filteredBranchOptions =this.SearchBranch.valueChanges.pipe(
      startWith(""),
      map(value => this._filterBranch(value || ''))
      ); 
    });
  }
  private _filterBranch(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 0)
     {
        return [];   
      }
    return this.BranchList.filter(
      data => 
      {
        return data.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
      });
  }

  OnBranchSelected(selectedName: string) {
    const selectedSL = this.BranchList.find(
      data => data.organizationalEntityName === selectedName
    );
  
    if (selectedSL) {
      this.getBranchID(selectedSL.organizationalEntityID);
    }
  }

  getBranchID(BranchID: any) {
    this.SearchBranchID = BranchID;

  }

  //----------KAM----------
  InitKAM()
  {
    this._generalService.GetEmployee().subscribe(
    data=>
    {
      this.KAMList = data;
      this.filteredKAMOptions =this.SearchKAM.valueChanges.pipe(
      startWith(""),
      map(value => this._filterKAM(value || ''))
      ); 
    });
  }
  private _filterKAM(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 0)
     {
        return [];   
      }
    return this.KAMList.filter(
      data => 
      {
        return data.firstName.toLowerCase().indexOf(filterValue)===0 || data.lastName.toLowerCase().indexOf(filterValue)===0;
      });
  }

  OnKAMSelected(selectedName: string) {
    const selectedSL = this.KAMList.find(
      data => data.firstName + ' ' + data.lastName === selectedName
    );
  
    if (selectedSL) {
      this.getKAMID(selectedSL.employeeID);
    }
  }

  getKAMID(KAMID: any) {
    this.SearchKAMID = KAMID;

  }

  //---------- Client Name ----------
  InitCustomerPerson()
  {
    this._generalService.getCustomerPersonDetails().subscribe(
    data=>
    {
      this.CustomerPersonList = data;
      this.filteredCustomerPersonOptions =this.SearchCustomerPerson.valueChanges.pipe(
      startWith(""),
      map(value => this._filterCustomerPerson(value || ''))
      ); 
    });
  }
  private _filterCustomerPerson(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 0)
     {
        return [];   
      }
    return this.CustomerPersonList.filter(
      data => 
      {
        return data.customerPersonName.toLowerCase().indexOf(filterValue)===0;
      });
  }

  //---------- Duty Type ----------
  InitPackageType()
  {
    this._generalService.GetPackgeType().subscribe(
    data=>
    {
      this.PackageTypeList=data;  
      this.filteredPackageTypeOptions = this.SearchDutyType.valueChanges.pipe(
      startWith(""),
      map(value => this._filterPackgeType(value || ''))
      ); 
    });
  }
  private _filterPackgeType(value: string): any {
  const filterValue = value.toLowerCase();
  if (!value || value.length < 0)
     {
        return [];   
      }
    return this.PackageTypeList.filter(
    data => 
    {
      return data.packageType.toLowerCase().indexOf(filterValue)===0;
    });
  }

  //---------- Mode Of Payment ----------
  InitPaymentMode()
  {
    this._generalService.GetModeOfPayment().subscribe(
    data=>
    {
      this.PaymentModeList=data;
      this.filteredPaymentModeOptions = this.SearchMOP.valueChanges.pipe(
      startWith(""),
      map(value => this._filterPaymentMode(value || ''))
      ); 
    });
  }
  private _filterPaymentMode(value: string): any {
  const filterValue = value.toLowerCase();
    return this.PaymentModeList?.filter(
    data => 
    {
      return data.modeOfPayment.toLowerCase().indexOf(filterValue)===0;
    });
  }

  //---------- Dispatch Location ----------
  InitDispatchLocation()
  {
    this._generalService.GetLocationHub().subscribe(
    data=>
    {
      this.DispatchLocationList=data;
      this.filteredDispatchLocationOptions = this.SearchDispatchLocation.valueChanges.pipe(
      startWith(""),
      map(value => this._filterOrganizationalsEntity(value || ''))
      ); 
    });
  }
  private _filterOrganizationalsEntity(value: string): any {
  const filterValue = value.toLowerCase();
  if (!value || value.length < 0)
     {
        return [];   
      }
    return this.DispatchLocationList.filter(
    data => 
    {
      return data.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
    });
  }

  //---------- Customer Location ----------
  InitCustomerLocation()
  {
    this._generalService.GetLocationHub().subscribe(
    data=>
    {
      this.CustomerLocationList=data;
      this.filteredCustomerLocationOptions = this.SearchCustomerLocationName.valueChanges.pipe(
      startWith(""),
      map(value => this._filterCustomerLocation(value || ''))
      ); 
    });
  }
  private _filterCustomerLocation(value: string): any {
  const filterValue = value.toLowerCase();
  if (!value || value.length < 0)
     {
        return [];   
      }
    return this.CustomerLocationList.filter(
    data => 
    {
      return data.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
    });
  }

  //---------- Supplier Type ----------
  InitSupplierType()
  {
    this._generalService.GetSupplierType().subscribe(
    data=>
    {
      this.SupplierTypeList=data;
      this.filteredSupplierTypeOptions = this.SearchSupplierType.valueChanges.pipe(
      startWith(""),
      map(value => this._filterSupplierType(value || ''))
      );
    });
  }
  private _filterSupplierType(value: string): any {
  const filterValue = value.toLowerCase();
    return this.SupplierTypeList.filter(
    data =>
    {
      return data.supplierType.toLowerCase().indexOf(filterValue)===0;
    });
  }

  //---------- Supplier Type ----------
  InitSupplier() 
  {
    this._generalService.getSupplier().subscribe(
    data => {
      this.SupplierList = data;
      this.filteredSupplierOptions = this.SearchSupplier.valueChanges.pipe(
      startWith(""),
      map(value => this._filterSupplier(value || ''))
      );
    });
  }
  private _filterSupplier(value: string): any {
    const filterValue = value.toLowerCase();
      if (!value || value.length < 0)
     {
        return [];   
      }
      return this.SupplierList.filter(
      data => 
      {
        return data.supplierName.toLowerCase().indexOf(filterValue) === 0;
      });
  }

  //---------- Car Send ----------
  InitCarSend()
  {
    this._generalService.GetVehicle().subscribe(
    data=>
    {
      this.CarSendList = data;
      this.filteredCarSendOptions = this.SearchCarSend.valueChanges.pipe(
      startWith(""),
      map(value => this._filterCarSend(value || ''))
      ); 
    });
  }
  private _filterCarSend(value: string): any {
  const filterValue = value.toLowerCase();
  if (!value || value.length < 0)
     {

        return [];   
      }
    return this.CarSendList.filter(
    data => 
    {
      return data.vehicle.toLowerCase().indexOf(filterValue)===0;
    });
  }

  //---------- Car Booked ----------
  InitCarBooked()
  {
    this._generalService.GetVehicle().subscribe(
    data=>
    {
      this.CarBookedList = data;
      this.filteredCarBookedOptions = this.SearchCarBooked.valueChanges.pipe(
      startWith(""),
      map(value => this._filterCarBooked(value || ''))
      ); 
    });
  }
  private _filterCarBooked(value: string): any {
  const filterValue = value.toLowerCase();
  if (!value || value.length < 0)
     {
        return [];   
      }
    return this.CarBookedList.filter(
    data => 
    {
      return data.vehicle.toLowerCase().indexOf(filterValue)===0;
    });
  }

  //---------- Driver ----------
  InitDriver()
  {
    this._generalService.GetDriver().subscribe(
    data=>
    {
      this.DriverList=data;
      this.filteredDriverOptions = this.SearchDri.valueChanges.pipe(
      startWith(""),
      map(value => this._filterDriver(value || ''))
      ) 
    });;
  }
  private _filterDriver(value: string): any {
  const filterValue = value.toLowerCase();
  if (!value || value.length < 0)
     {
        return [];   
      }
    return this.DriverList.filter(
    data => 
    {
      return data.driverName.toLowerCase().indexOf(filterValue)===0;
    });
  }

  //---------- Car No ----------
  InitCarNo()
  {
    this.zonalDutyRegisterService.getRegistrationNumber().subscribe(
    data=>
    {
      this.CarNoList=data;
      this.filteredCarNoOptions = this.SearchCarNo.valueChanges.pipe(
      startWith(""),
      map(value => this._filterCarNo(value || ''))
      ); 
    });
  }
  private _filterCarNo(value: string): any {
  const filterValue = value.toLowerCase();
  if (!value || value.length < 0)
     {
        return [];   
      }
    return this.CarNoList.filter(
    data => 
    {
      return data.vehicle.toLowerCase().indexOf(filterValue)===0;
    });
  }

  //---------- Customer Type ----------
  InitCustomerType()
  {
    this._generalService.getCustomerType().subscribe(
    data=>
    {
      this.CustomerTypeList=data;
      this.filteredCustomerTypeOptions = this.SearchCustomerType.valueChanges.pipe(
      startWith(""),
      map(value => this._filterCustomerType(value || ''))
      ) 
    });;
  }
  private _filterCustomerType(value: string): any {
  const filterValue = value.toLowerCase();
    return this.CustomerTypeList?.filter(
    data => 
    {
      return data.customerType.toLowerCase().indexOf(filterValue)===0;
    });
  }

  //---------- Sales Person ----------
  InitSalesPerson()
  {
    this.zonalDutyRegisterService.getSalesPerson().subscribe(
    data=>
    {
      this.SalesPersonList=data;
      this.filteredSalesPersonOptions = this.SearchSalesPerson.valueChanges.pipe(
      startWith(""),
      map(value => this._filterSalesPerson(value || ''))
      ) 
    });;
  }
  private _filterSalesPerson(value: string): any {
  const filterValue = value.toLowerCase();
  if (!value || value.length < 0)
     {
        return [];   
      }
    return this.SalesPersonList?.filter(
    data => 
    {
      return data.salesPerson.toLowerCase().indexOf(filterValue)===0;
    });
  }

  //---------- Guest Name ----------
  InitGuestName()
  {
    this._generalService.getCustomerPersonDetails().subscribe(
    data=>
    {
      this.GuestNameList = data;
      this.filteredGuestNameOptions =this.SearchGuestName.valueChanges.pipe(
      startWith(""),
      map(value => this._filterGuestName(value || ''))
      ); 
    });
  }
  private _filterGuestName(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 0)
     {
        return [];   
      }
  
    return this.GuestNameList.filter(
      data => 
      {
        return data.customerPersonName.toLowerCase().indexOf(filterValue)===0;
      });
  }

  //---------- Cities ----------
  InitCities()
  {
    this._generalService.GetCitiessAll().subscribe(
    data=>
    {
      this.CityList = data;
      this.filteredCityOptions =this.SearchCity.valueChanges.pipe(
      startWith(""),
      map(value => this._filterCity(value || ''))
      ); 
    });
  }
  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 0)
     {
        return [];   
      }
    return this.CityList.filter(
      data => 
      {
        return data.geoPointName.toLowerCase().indexOf(filterValue)===0;
      });
  }
 //---------- Location Group ---------
  InitLocationGroup()
  {
    this._generalService.GetLocationGroup().subscribe(
    data=>
    {
      this.LocationGroupList = data;
      this.filteredLocationGroupOptions =this.SearchLocationGroup.valueChanges.pipe(
      startWith(""),
      map(value => this._filterLocationGroup(value || ''))
      ); 
    });
  }
  private _filterLocationGroup(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 0)
     {
        return [];   
      }
    return this.LocationGroupList.filter(
      data => 
      {
        return data.locationGroup.toLowerCase().indexOf(filterValue)===0;
      });
  }
  trackByFn(index: number, item: any) {
  return item.reservationID || index;
}

  trackCustomerSpecificFieldColumn(_index: number, col: { columnId: string; fieldName: string }): string {
    return col.columnId;
  }

  getCustomerSpecificFieldValue(row: any, fieldName: string): string {
    const value = row?.customerSpecificFieldMap?.[fieldName];
    return value !== undefined && value !== null && String(value).trim() !== '' ? String(value) : 'NA';
  }

  private applyCustomerSpecificFieldColumns(data: ZonalDutyRegisterModel[]): ZonalDutyRegisterModel[] {
    const rows = Array.isArray(data) ? data : [];
    const fieldNames = new Set<string>();

    rows.forEach(row => {
      const items = this.parseCustomerSpecificFields(row.customerSpecificFields);
      const fieldMap: Record<string, string> = {};

      items.forEach(item => {
        if (item.fieldName) {
          fieldNames.add(item.fieldName);
          fieldMap[item.fieldName] = item.fieldValue ?? '';
        }
      });

      (row as any).customerSpecificFieldMap = fieldMap;
    });

    this.customerSpecificFieldColumns = Array.from(fieldNames)
      .sort((a, b) => a.localeCompare(b))
      .map((fieldName, index) => ({
        columnId: this.buildCustomerSpecificColumnId(fieldName, index),
        fieldName
      }));

    const insertIndex = this.baseDisplayedColumns.indexOf('DSClosedBy');
    const dynamicColumnIds = this.customerSpecificFieldColumns.map(col => col.columnId);

    if (insertIndex === -1) {
      this.displayedColumns = [
        ...this.baseDisplayedColumns,
        ...dynamicColumnIds
      ];
    } else {
      this.displayedColumns = [
        ...this.baseDisplayedColumns.slice(0, insertIndex),
        ...dynamicColumnIds,
        ...this.baseDisplayedColumns.slice(insertIndex)
      ];
    }

    return rows;
  }

  private buildCustomerSpecificColumnId(fieldName: string, index: number): string {
    const slug = fieldName.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '') || 'field';
    return `csf_${index}_${slug}`;
  }

  private parseCustomerSpecificFields(value: string | null | undefined): { fieldName: string; fieldValue: string }[] {
    const trimmed = (value || '').trim();
    if (!trimmed) {
      return [];
    }

    const parseCandidates = [
      trimmed,
      `[${trimmed}]`,
      trimmed.startsWith('[') ? trimmed : `[${trimmed.replace(/^\s*,\s*/, '')}]`
    ];

    for (const candidate of parseCandidates) {
      try {
        const parsed = JSON.parse(candidate);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        const mapped = list
          .map(item => this.extractCustomerSpecificFieldPair(item))
          .filter(item => item.fieldName || item.fieldValue);

        if (mapped.length) {
          return mapped;
        }
      } catch {
        // try next parse strategy
      }
    }

    const results: { fieldName: string; fieldValue: string }[] = [];
    const fieldPattern = /"(?:FieldName|fieldName)"\s*:\s*"([^"]*)"[\s\S]*?"(?:FieldValue|fieldValue)"\s*:\s*"([^"]*)"/g;
    let match;

    while ((match = fieldPattern.exec(trimmed)) !== null) {
      results.push({ fieldName: match[1], fieldValue: match[2] });
    }

    return results;
  }

  private extractCustomerSpecificFieldPair(item: any): { fieldName: string; fieldValue: string } {
    return {
      fieldName: item?.FieldName ?? item?.fieldName ?? '',
      fieldValue: item?.FieldValue ?? item?.fieldValue ?? ''
    };
  }
}



