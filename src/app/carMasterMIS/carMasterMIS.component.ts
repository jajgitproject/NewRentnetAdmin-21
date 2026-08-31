// @ts-nocheck
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CarMasterMISService } from './carMasterMIS.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { carMasterMIS } from './carMasterMIS.model';
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
import { FormControl } from '@angular/forms';
import { VehicleCategoryDropDown } from '../vehicleCategory/vehicleCategoryDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { SupplierDropDown } from '../supplier/supplierDropDown.model';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleCategory } from '../vehicleCategory/vehicleCategory.model';
import { RegistrationDropDown } from '../interstateTaxEntry/registrationDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import moment from 'moment';
import { extractExportErrorMessage, exportJobAcceptedSnackbarMessage, exportSearchButtonLabel, formatExportElapsedTime, IN_FLIGHT_EXPORT_MESSAGE, isExportJobCancelled, isExportJobNotFoundError, loadPersistedExportJobId, markExportDumpStarted, persistExportJobId } from '../general/export-job.helper';
import { StoredMisExportsComponent } from '../general/stored-mis-exports.component';
interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}
@Component({
  standalone: false,
  selector: 'app-carMasterMIS',
  templateUrl: './carMasterMIS.component.html',
  styleUrls: ['./carMasterMIS.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CarMasterMISComponent implements OnInit, OnDestroy {
  exportJobId: string | null = null;
  exportJobStatus: any = null;
  exportJobRunning = false;
  exportJobDownloading = false;
  exportJobError = '';
  exportJobStartedAt: number | null = null;
  private exportPollSub?: Subscription;
  private readonly exportJobPageKey = 'carMasterMIS';
  @ViewChild(StoredMisExportsComponent) storedExports?: StoredMisExportsComponent;
  displayedColumns = [
    'vehicleCategory',
       'vehicle',
   'registrationNumber', 
   'carLocation',
   'driverName',
   'driverOfficialIdentityNumber',
   'purchaseDate',
   'inventoryStatus',
    'ownedSupplied',
    'supplierName',
    'supplierType',
   'registrationFromDate',
   'registrationTillDate',
    'color',
    'fuelType',
    'mileage',
    'noOfAirbags',
    'transmissionType',
    'modelYear',
    'isGPSAvailable',
    'gpsimeiNo',
    'company',
    'status',
    // 'inventoryStatusReason',
    'inventoryCreatedByName',
  ];
  
  columnTitleMap: { [key: string]: string } = {
    vehicleCategory: 'Car Category',
    vehicle: 'Car Type',
    registrationNumber: 'Reg. Number',
    carLocation: 'Location',
    inventoryStatus: 'Car Status',
    ownedSupplied: 'Owned Supplied',
    purchaseDate: 'Purchase Date',
    supplierName: 'Supplier Name',
    supplierType: 'Supplier Type',
    registrationFromDate:'Registration Date',
    registrationTillDate:' Car Creation Date',
    driverName: 'Driver',
    driverOfficialIdentityNumber: 'Driver Official Identity Number',
    color: 'Color',
    fuelType: 'Fuel Type',
    mileage: 'Mileage',
    noOfAirbags: 'No. of Airbags',
    transmissionType: 'Transmission Type',
    modelYear: 'Model Year',
    isGPSAvailable: 'GPS Available',
    gpsimeiNo: 'GPS IMEI No.',
    company: 'Company',
    inventoryStatusReason: 'Status Reason',
    inventoryCreatedByName: 'Created By',
    status: 'Status',
  
  };
  
  dataSource: carMasterMIS[] | null;
  inventoryID: number;
  advanceTable: carMasterMIS | null;
  CarMasterMISID: number = 0;
  SearchActivationStatus : string='';
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  SearchVehcileCategory:string='';
  vehicleCategory:FormControl=new FormControl();
  locationHub:FormControl=new FormControl();
  company:FormControl=new FormControl();
  SearchVehicle:string='';
  vehicle:FormControl=new FormControl();

  SearchSupplier:string='';
  supplier:FormControl=new FormControl();
  registrationNumber: FormControl = new FormControl();
  filteredRegistrationNumberOptions:Observable<RegistrationDropDown[]>;
  public RegistrationNumberList?: RegistrationDropDown[] = [];

  // SearchRegNumber:string='';
  // regNumber:FormControl=new FormControl();

  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  public VehicleList?: VehicleDropDown[] = [];
  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  public SupplierList?: SupplierDropDown[] = [];
  filteredSupplierOptions: Observable<SupplierDropDown[]>;

  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
   filteredVOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
   filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  searchcarLocation: string='';
  searchownedSupplier:string='';
  status:string='';
  searchGps:string='';
  searchCompany:string='';
  purchaseDate: string='';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public inventoryService: CarMasterMISService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.loadData();
    this.initVehicleCategories();
    this.initVehicle();
    this.InitLocationHub();
    this.InitCompany();
    this.resumeExportJobIfNeeded();
  }

  ngOnDestroy() {
    this.stopExportPolling();
  }
  
  initVehicleCategories(){
    this._generalService.GetVehicleCategories().subscribe(
      data=>
      {
        this.VehicleCategoryList=data;
        this.filteredVehicleCategoryOptions = this.vehicleCategory.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.VehicleCategoryList.filter(
      customer => 
      {
        return customer.vehicleCategory.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  initVehicle(){
    this._generalService.GetVehicle().subscribe(
      data=>
      {
        this.VehicleList=data;
        this.filteredVehicleOptions = this.vehicle.valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicle(value || ''))
        ); 
      });
  }
  
  private _filterVehicle(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.VehicleList.filter(
      customer => 
      {
        return customer.vehicle.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

    InitCompany(){
      this._generalService.GetCompany().subscribe(
        data=>
          {
            this.OrganizationalEntityList=data;
            this.filteredVOrganizationalEntityOptions = this.company.valueChanges.pipe(
              startWith(""),
              map(value => this._filterOrganizationalEntity(value || ''))
            ); 
          });
    }
    private _filterOrganizationalEntity(value: string): any {
      const filterValue = value.toLowerCase();
      // if (!value || value.length < 3) {
      //   return [];   
      // }
      return this.OrganizationalEntityList.filter(
        customer => 
        {
          return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
        });
    }
 
    InitLocationHub(){
      this._generalService.GetLocation().subscribe(
        data=>
        {
          this.OrganizationalEntitiesList=data;
        
          this.filteredOrganizationalEntityOptions = this.locationHub.valueChanges.pipe(
            startWith(""),
            map(value => this._filterOrganizationalsEntity(value || ''))
          ); 
        });
    }
    private _filterOrganizationalsEntity(value: string): any {
      const filterValue = value.toLowerCase();
      // if (!value || value.length < 3) {
      //   return [];   
      // }
      return this.OrganizationalEntitiesList.filter(
        customer => 
        {
          return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
        }
      );
    }
  refresh() {
    this.clearExportJob();
    this.vehicleCategory.setValue(''),
    this.vehicle.setValue(''),
    this.locationHub.setValue(''),
    this.searchownedSupplier = '';
    this.status = '';
    this.searchGps = '';
    this.company.setValue(''),
    this.SearchActivationStatus = '';
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  public SearchData()
  {
    this.loadData();    
  }

  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }

onBackPress(event) 
{
  if (event.keyCode === 8) 
  {
    this.loadData();
  }
}

   public loadData() 
   {
     if(this.purchaseDate!==""){
              this.purchaseDate=moment(this.purchaseDate).format('MMM DD yyyy');
            }
      this.inventoryService.getTableData(
        this.vehicleCategory.value,
        this.vehicle.value,
        this.locationHub.value,
        this.searchownedSupplier,
        this.status,
        this.searchGps,
        this.company.value,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
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
  onContextMenu(event: MouseEvent, item: carMasterMIS) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  
  NextCall()
  {
    if (this.dataSource.length>0) 
    {
     
      this.PageNumber++;
      //alert(this.PageNumber + 'mohit')
      this.loadData();
    }
    //alert([this.PageNumber])
  }
  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData();    } 
  }

  SortingData(coloumName:any) {
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.inventoryService.getTableDataSort(
      this.vehicleCategory.value,
      this.vehicle.value,
      this.locationHub.value,
      this.searchownedSupplier,
      this.status,
      this.searchGps,
      this.company.value,
      this.SearchActivationStatus, 
      this.PageNumber,
      coloumName.active,
      this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  startExportJob() {
    if (this.exportJobRunning) {
      this.showNotification('snackbar-danger', IN_FLIGHT_EXPORT_MESSAGE, 'bottom', 'center');
      return;
    }

    this.exportJobError = '';
    this.exportJobRunning = true;

    this.inventoryService.startExportJob(
      this.vehicleCategory.value || '',
      this.vehicle.value || '',
      this.locationHub.value || '',
      this.searchownedSupplier || '',
      this.status || '',
      this.searchGps || '',
      this.company.value || '',
      this.SearchActivationStatus || ''
    ).subscribe(
      (startResult: any) => {
        const jobId = startResult?.jobId ?? startResult?.JobId;
        if (!jobId) {
          this.exportJobRunning = false;
          this.exportJobError = 'Could not start export job.';
          this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
          return;
        }

        this.exportJobId = jobId;
        persistExportJobId(this.exportJobPageKey, jobId);
        this.exportJobStatus = {
          jobId,
          status: startResult?.status ?? startResult?.Status ?? 'Pending',
          message: startResult?.message ?? startResult?.Message ?? 'Export queued'
        };
        this.exportJobStartedAt = markExportDumpStarted(this.exportJobStartedAt, this.exportJobStatus);
        this.startExportPolling(jobId);
        this.showNotification('snackbar-info', exportJobAcceptedSnackbarMessage(startResult), 'bottom', 'center');
      },
      async (error) => {
        this.exportJobRunning = false;
        this.exportJobError = await extractExportErrorMessage(error, 'Could not start export');
        this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
      }
    );
  }

  downloadExportCsv() {
    if (!this.exportJobId || !this.inventoryService.isExportJobReady(this.exportJobStatus) || this.exportJobDownloading) {
      return;
    }

    this.exportJobDownloading = true;
    this.inventoryService.downloadExportJob(this.exportJobId).subscribe(
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
            message = JSON.parse(text || '{}').message || message;
          } catch {
            if (text?.trim()) {
              message = text;
            }
          }
          this.showNotification('snackbar-danger', message, 'bottom', 'center');
          return;
        }

        const fileName = this.exportJobStatus?.fileName ?? this.exportJobStatus?.FileName;
        this.triggerExportDownload(blob, fileName);
      },
      async (error) => {
        this.exportJobDownloading = false;
        this.showNotification('snackbar-danger', await extractExportErrorMessage(error, 'Export download failed.'), 'bottom', 'center');
      }
    );
  }

  cancelExportJob() {
    if (!this.exportJobId || !this.isExportJobInProgress()) {
      return;
    }

    this.inventoryService.cancelExportJob(this.exportJobId).subscribe(
      (status: any) => {
        this.exportJobStatus = status;
        this.exportJobRunning = false;
        this.stopExportPolling();
        this.showNotification('snackbar-info', status?.message ?? status?.Message ?? 'Export cancelled.', 'bottom', 'center');
      },
      async (error) => {
        this.showNotification('snackbar-danger', await extractExportErrorMessage(error, 'Could not cancel export.'), 'bottom', 'center');
      }
    );
  }

  canDownloadExport(): boolean {
    return !!this.exportJobId && this.inventoryService.isExportJobReady(this.exportJobStatus) && !this.exportJobDownloading;
  }

  isExportJobInProgress(): boolean {
    return this.exportJobRunning || this.inventoryService.isExportJobRunning(this.exportJobStatus);
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
    return formatExportElapsedTime(this.exportJobStartedAt, this.exportJobStatus);
  }

  getExportButtonLabel(): string {
    const label = exportSearchButtonLabel(this.exportJobStatus, this.isExportJobInProgress());
    return label === 'Search' ? 'Export CSV' : label;
  }

  private startExportPolling(jobId: string) {
    this.stopExportPolling();
    this.exportPollSub = this.inventoryService.pollExportJob(jobId).subscribe(
      (status: any) => {
        this.exportJobStatus = status;
        this.exportJobStartedAt = markExportDumpStarted(this.exportJobStartedAt, status);
        const current = String(status?.status ?? status?.Status ?? '').toLowerCase();

        if (current === 'failed') {
          this.exportJobRunning = false;
          this.exportJobError = status?.message ?? status?.Message ?? 'Export failed.';
          this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
          this.stopExportPolling();
          persistExportJobId(this.exportJobPageKey, null);
          return;
        }

        if (isExportJobCancelled(status)) {
          this.exportJobRunning = false;
          this.showNotification('snackbar-info', status?.message ?? status?.Message ?? 'Export cancelled.', 'bottom', 'center');
          this.stopExportPolling();
          persistExportJobId(this.exportJobPageKey, null);
          return;
        }

        if (current === 'completed') {
          this.exportJobRunning = false;
          this.showNotification('snackbar-success', status?.message ?? 'Export ready. Click Download CSV.', 'bottom', 'center');
          this.stopExportPolling();
          this.storedExports?.refresh();
        }
      },
      async (error) => {
        this.exportJobRunning = false;
        this.exportJobError = await extractExportErrorMessage(error, 'Export failed.');
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

  private resumeExportJobIfNeeded() {
    const jobId = loadPersistedExportJobId(this.exportJobPageKey);
    if (!jobId) {
      return;
    }

    this.exportJobId = jobId;
    if (!this.exportJobStatus) {
      this.exportJobStatus = { status: 'Pending', message: 'Checking export status...' };
    }

    this.inventoryService.getExportJobStatus(jobId).subscribe(
      (status: any) => {
        if (!status) {
          this.exportJobRunning = true;
          this.startExportPolling(jobId);
          return;
        }

        this.exportJobId = jobId;
        this.exportJobStatus = status;
        this.exportJobError = '';
        if (this.inventoryService.isExportJobRunning(status)) {
          this.exportJobRunning = true;
          this.exportJobStartedAt = markExportDumpStarted(this.exportJobStartedAt, this.exportJobStatus);
          this.startExportPolling(jobId);
          return;
        }

        this.exportJobRunning = false;
      },
      (error) => {
        if (isExportJobNotFoundError(error)) {
          persistExportJobId(this.exportJobPageKey, null);
          this.exportJobId = null;
          this.exportJobStatus = null;
          this.exportJobRunning = false;
          return;
        }

        this.exportJobRunning = true;
        this.startExportPolling(jobId);
      }
    );
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

  private triggerExportDownload(blob: Blob, preferredFileName?: string) {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = preferredFileName || `CarMasterMIS_${moment().format('YYYYMMDD_HHmmss')}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
    this.showNotification('snackbar-success', 'CSV downloaded successfully', 'top', 'center');
  }

  onStatusChange(selectedStatus: string) {
    this.status = selectedStatus;
    // this.fetchDataBasedOnStatus();
  }
}




