// @ts-nocheck
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from './inventory.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Inventory } from './inventory.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
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
import { formatSupplierDisplay } from '../supplier/supplier-display.util';
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
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class InventoryComponent implements OnInit, OnDestroy {
  exportJobId: string | null = null;
  exportJobStatus: any = null;
  exportJobRunning = false;
  exportJobDownloading = false;
  exportJobError = '';
  exportJobStartedAt: number | null = null;
  private exportPollSub?: Subscription;
  private readonly exportJobPageKey = 'inventoryMaster';
  @ViewChild(StoredMisExportsComponent) storedExports?: StoredMisExportsComponent;
  displayedColumns = [
    'registrationNumber',
    'vehicle',
    'supplierName',
    'supplierType',
    'locationHub',
    'isAdhoc',
    'status',
    'actions'
  ];
  dataSource: Inventory[] = [];
  hasSearched = false;
  inventoryID: number;
  advanceTable: Inventory | null;
  InventoryID: number = 0;
  SearchActivationStatus : string='All';
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  SearchVehcileCategory:string='';
  vehicleCategory:FormControl=new FormControl();

  SearchVehicle:string='';
  vehicle:FormControl=new FormControl();

  SearchSupplier:string='';
  supplier:FormControl=new FormControl();
  registrationNumber: FormControl = new FormControl();
  filteredRegistrationNumberOptions:Observable<RegistrationDropDown[]>;
  public RegistrationNumberList?: RegistrationDropDown[] = [];
    filteredServiceOptions:Observable<OrganizationalEntityDropDown[]>;
     public ServiceList?:OrganizationalEntityDropDown[]=[];
      public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
        filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  // SearchRegNumber:string='';
  // regNumber:FormControl=new FormControl();
    locationHub: FormControl = new FormControl();
    searchLocationHub: string = '';

  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  public VehicleList?: VehicleDropDown[] = [];
  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  public SupplierList?: SupplierDropDown[] = [];
  filteredSupplierOptions: Observable<SupplierDropDown[]>;
  menuItems: any[] = [
    { label: 'Block', route: '/inventoryBlock', tooltip: 'Inventory Block' },
    { label: 'Status History', route: '/inventoryStatusHistory', tooltip: 'Inventory Status History' },
    { label: 'Target', route: '/inventoryTarget', tooltip: 'Inventory Target' },
    { label: 'Insurance', route: '/inventoryInsurance', tooltip: 'Inventory Insurance' },
    { label: 'Permit', route: '/inventoryPermit', tooltip: 'Inventory Permit' },
    { label: 'Tax', route: '/interstateTaxEntry', tooltip: 'Interstate Tax' },
    { label: 'PUC', route: '/inventoryPUC', tooltip: 'Inventory PUC' },
    { label: 'Fitness', route: '/inventoryFitness', tooltip: 'Inventory Fitness' },
    { label: 'Monthly Business Report', route: '/monthlyBusinessReport', tooltip: 'Monthly Business Report' },
    { label: 'Driver Association', route:'/driverInventoryAssociation', tooltip: 'Driver Association' },
    { label: 'Document', route:'/inventoryDocument', tooltip: 'Inventory Document' }
  ];
  
  searchTerm: any = '';
  /** Default to registration so typing filters immediately (old 'search' cleared the term). */
  selectedFilter: string = 'registrationNumber';

  /** Latest filter values sent to the API (plain strings — not shared modal FormControls). */
  private queryRegistrationNumber = '';
  private queryVehicleCategory = '';
  private queryVehicle = '';
  private querySupplier = '';
  private queryLocationHub = '';

  private readonly immediateQuery$ = new Subject<void>();
  private readonly debouncedQuery$ = new Subject<void>();
  private tableQuerySub: Subscription;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public inventoryService: InventoryService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.tableQuerySub = merge(
      this.immediateQuery$,
      this.debouncedQuery$.pipe(debounceTime(250))
    ).pipe(
      switchMap(() => {
        if (!this.hasSearched) {
          return of([]);
        }
        return this.inventoryService.getTableData(
          this.queryRegistrationNumber,
          this.InventoryID,
          this.queryVehicleCategory,
          this.queryVehicle,
          this.querySupplier,
          this.queryLocationHub,
          this.getActivationStatusFilter(),
          this.PageNumber
        ).pipe(catchError(() => of([])));
      })
    ).subscribe((data) => {
      this.dataSource = Array.isArray(data) ? data : [];
    });

    this.SubscribeUpdateService();
    this.InitSupplier();
    this.initVehicleCategories();
    this.initVehicle();
    this.InitRegistrationNumber();
    this.InitLocationHub();
    this.menuItems.sort((a, b) => a.label.localeCompare(b.label));
    this.resumeExportJobIfNeeded();
  }

  ngOnDestroy() {
    this.stopExportPolling();
    if (this.tableQuerySub) {
      this.tableQuerySub.unsubscribe();
    }
    if (this.subscriptionName) {
      this.subscriptionName.unsubscribe();
    }
  }
  
  // InitVehicleCategory(){
  //   this._generalService.GetVehicleCategories().subscribe(
  //     data=>{
  //       this.VehicleCategoryList=data;
  //     }
  //   )
  // }
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
  if (!value || value.length < 3) {
    return [];
  }
  const filterValue = value.toLowerCase();
  return this.VehicleCategoryList.filter(
    customer => 
    {
      return customer.vehicleCategory.toLowerCase().includes(filterValue);
    }
  );
}  initVehicle(){
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
    if (!value || value.length < 3) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.VehicleList.filter(
      customer => 
      {
        return customer.vehicle.toLowerCase().includes(filterValue);
      }
    );
  }
  
  InitSupplier(){
    this._generalService.getSuppliersForInventory().subscribe(
      data=>
      {
        this.SupplierList=data;
        this.filteredSupplierOptions = this.supplier.valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchSupplier(value || ''))
        ); 
      });
  }

  private _filtersearchSupplier(value: string): any {
    if (!value || value.length < 3) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.SupplierList.filter(
      customer => 
      {
        return customer.supplierName.toLowerCase().includes(filterValue);
      }
    );
  }

  InitRegistrationNumber(){
    this._generalService.GetRegistrationForDropDown().subscribe(
      data=>
      {
        this.RegistrationNumberList=data;
        this.filteredRegistrationNumberOptions = this.registrationNumber.valueChanges.pipe(
          startWith(""),
          map(value => this._filterRN(value || ''))
        ); 
      });
  }
  
  private _filterRN(value: string): any {
    if (!value || value.length < 3) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.RegistrationNumberList.filter(
      customer => 
      {
        return customer.registrationNumber.toLowerCase().includes(filterValue);
      }
    );
  }

  refresh() {
    this.clearExportJob();
    this.registrationNumber.setValue('', { emitEvent: false });
    this.vehicleCategory.setValue('', { emitEvent: false });
    this.vehicle.setValue('', { emitEvent: false });
    this.supplier.setValue('', { emitEvent: false });
    this.locationHub.setValue('', { emitEvent: false });
    this.SearchActivationStatus = 'All';
    this.PageNumber = 0;
    this.searchTerm = '';
    this.selectedFilter = 'registrationNumber';
    this.clearQueryFilters();
    this.hasSearched = false;
    this.dataSource = [];
  }

  reloadCurrentSearch() {
    if (this.hasSearched) {
      this.immediateQuery$.next();
    }
  }

  /** Empty / All => no status filter (all activation statuses). */
  private getActivationStatusFilter(): string {
    const status = (this.SearchActivationStatus || '').trim();
    if (!status || status.toLowerCase() === 'all') {
      return '';
    }
    return status;
  }

  public SearchData()
  {
    this.hasSearched = true;
    this.PageNumber = 0;
    this.queryRegistrationNumber = String(this.registrationNumber.value || '');
    this.queryVehicleCategory = String(this.vehicleCategory.value || '');
    this.queryVehicle = String(this.vehicle.value || '');
    this.querySupplier = String(this.supplier.value || '');
    this.queryLocationHub = String(this.locationHub.value || '');
    this.immediateQuery$.next();
  }

  public Filter()
  {
    this.hasSearched = true;
    this.PageNumber = 0;
    this.applyInlineSearchFilter();
    this.immediateQuery$.next();
  }

  onSearchTermChange(value: string) {
    this.searchTerm = value ?? '';
    this.PageNumber = 0;
    this.applyInlineSearchFilter();
    if (this.hasSearched) {
      this.debouncedQuery$.next();
    }
  }

  onSelectedFilterChange(value: string) {
    this.selectedFilter = value || 'registrationNumber';
    this.searchTerm = '';
    this.PageNumber = 0;
    this.applyInlineSearchFilter();
    if (this.hasSearched) {
      this.immediateQuery$.next();
    }
  }

  onActivationStatusChange(value: string) {
    this.SearchActivationStatus = value || 'All';
    this.PageNumber = 0;
    this.applyInlineSearchFilter();
    if (this.hasSearched) {
      this.immediateQuery$.next();
    }
  }

  private clearQueryFilters() {
    this.queryRegistrationNumber = '';
    this.queryVehicleCategory = '';
    this.queryVehicle = '';
    this.querySupplier = '';
    this.queryLocationHub = '';
  }

  /** Map inline Search-By + searchTerm into plain query fields (never touch modal FormControls). */
  private applyInlineSearchFilter() {
    const term = String(this.searchTerm || '').trim();
    this.clearQueryFilters();

    switch (this.selectedFilter) {
      case 'vehicleCategory':
        this.queryVehicleCategory = term;
        break;
      case 'vehicle':
        this.queryVehicle = term;
        break;
      case 'registrationNumber':
        this.queryRegistrationNumber = term.toUpperCase().replace(/[^A-Z0-9]/g, '');
        break;
      case 'supplier':
        this.querySupplier = term;
        break;
      case 'locationHub':
        this.queryLocationHub = term;
        break;
      default:
        break;
    }
  }

  public loadData() {
    this.hasSearched = true;
    this.applyInlineSearchFilter();
    this.immediateQuery$.next();
  }

  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.inventoryID = row.inventoryID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
       
      }
    });

  }
  deleteItem(row)
  {

    this.inventoryID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }

  shouldShowDeleteButton(item: any): boolean {
    // Check if item status is 'Deactive' or any other condition you want to consider
    return item.status !== 'Deactive' && !item.isDeleted; // Assuming you have an isDeleted property
  }

  startExportJob() {
    if (this.exportJobRunning) {
      this.showNotification('snackbar-danger', IN_FLIGHT_EXPORT_MESSAGE, 'bottom', 'center');
      return;
    }

    this.exportJobError = '';
    this.exportJobRunning = true;

    this.inventoryService.startExportJob(
      this.queryRegistrationNumber || '',
      this.InventoryID,
      this.queryVehicleCategory || '',
      this.queryVehicle || '',
      this.querySupplier || '',
      this.queryLocationHub || '',
      this.getActivationStatusFilter()
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
    anchor.download = preferredFileName || `InventoryMaster_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
    this.showNotification('snackbar-success', 'CSV downloaded successfully', 'top', 'center');
  }

  getSupplierDisplay(row: Inventory): string {
    return formatSupplierDisplay({
      supplierName: row?.supplierName,
      oldRentnetCode: row?.supplierOldRentnetCode,
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
  onContextMenu(event: MouseEvent, item: Inventory) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  
  NextCall()
  {
    if (this.dataSource && this.dataSource.length > 0) 
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

  // openInNewTab(menuItem: any, rowItem: any) {
  //   const formURL = this._generalService.FormURL;
  //   const queryParams = {
  //     InventoryID: rowItem.inventoryID,
  //     RegNo: rowItem.registrationNumber,
  //     Vehicle:rowItem.vehicle,
  //     VehicleCategory:rowItem.vehicleCategory,
  //     redirectingFrom:'Inventory',
  //     supplierName:rowItem.supplier
  //   };
   
  //   const url = this.router.serializeUrl(this.router.createUrlTree([menuItem.route], { queryParams }));
  
  //   window.open(formURL + url, '_blank');
  // }

  openInNewTab(menuItem: any, rowItem: any) {
    try {
      const enc = (v: unknown) =>
        this._generalService.encrypt(String(v ?? ''));

      const queryParams = {
        InventoryID: enc(
          rowItem?.inventoryID ?? rowItem?.InventoryID ?? ''
        ),
        RegNo: enc(rowItem?.registrationNumber ?? rowItem?.RegistrationNumber ?? ''),
        Vehicle: enc(rowItem?.vehicle ?? rowItem?.Vehicle ?? ''),
        VehicleCategory: enc(
          rowItem?.vehicleCategory ?? rowItem?.VehicleCategory ?? ''
        ),
        redirectingFrom: enc('Inventory'),
        SupplierName: enc(rowItem?.supplier ?? rowItem?.Supplier ?? ''),
        supplierID: enc(rowItem?.supplierID ?? rowItem?.SupplierID ?? ''),
      };

      const routePath = String(menuItem.route || '').replace(/^\//, '');
      const commands = routePath.split('/').filter(Boolean);
      const url = this.router.serializeUrl(
        this.router.createUrlTree(commands, { queryParams })
      );

      window.open(this._generalService.buildAppWindowUrl(url), '_blank');
    } catch (e) {
      console.error('openInNewTab', e);
      this.showNotification(
        'snackbar-danger',
        'Could not open link. Check inventory row data.',
        'bottom',
        'center'
      );
    }
  }
  
  // inventoryStatus(row) {
  //   this.router.navigate([
  //     '/inventoryStatusHistory',  
  //   ],
  //   {
  //     queryParams: {
  //       InventoryID: row.inventoryID,
  //       RegistrationNumber: row.registrationNumber,
  //       //vehicleID:row.vehicleID,
  //       vechicleName: row.vehicle,
  //     }
  //   }); 
  // }

  // inventoryTarget(row) {
  //   this.router.navigate([
  //     '/inventoryTarget',  
  //   ],
  //   {
  //     queryParams: {
  //       InventoryID: row.inventoryID,
  //       RegistrationNumber: row.registrationNumber,
  //       // vehicleID:row.vehicleID,
  //       // vechicleName: row.vehicle,
  //     }
  //   }); 
  // }

/////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string;
  public uploadFinished = (event) => {
  this.response = event;
  this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
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
          if(this.MessageArray[0]=="InventoryCreate")
          {
            if(this.MessageArray[1]=="InventoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.reloadCurrentSearch();
                this.showNotification(
                'snackbar-success',
                'Inventory Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InventoryUpdate")
          {
            if(this.MessageArray[1]=="InventoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.reloadCurrentSearch();
               this.showNotification(
                'snackbar-success',
                'Inventory Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InventoryDelete")
          {
            if(this.MessageArray[1]=="InventoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.reloadCurrentSearch();
               this.showNotification(
                'snackbar-success',
                'Inventory Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InventoryAll")
          {
            if(this.MessageArray[1]=="InventoryView")
            {
              if(this.MessageArray[2]=="Failure")
              {
               this.reloadCurrentSearch();
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
               this.reloadCurrentSearch();
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
      this.queryRegistrationNumber,
      this.InventoryID,
      this.queryVehicleCategory,
      this.queryVehicle,
      this.querySupplier,
      this.queryLocationHub,
      this.getActivationStatusFilter(),
      this.PageNumber,
      coloumName.active,
      this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = Array.isArray(data) ? data : [];
      },
      (error: HttpErrorResponse) => { this.dataSource = [];}
    );
  }

  // InventoryInsurance(row) {
   
  //   this.inventoryID = row.inventoryID;
  //  this.router.navigate([
  //    '/inventoryInsurance',       
    
  //  ],{
  //    queryParams: {
  //      InventoryID: this.inventoryID,
  //      RegNo:row.registrationNumber
  //    }
  //  });
  // }

  // InventoryPermit(row) {
   
  //   this.inventoryID = row.inventoryID;
  //  this.router.navigate([
  //    '/inventoryPermit',       
    
  //  ],{
  //    queryParams: {
  //      InventoryID: this.inventoryID,
  //      RegNo:row.registrationNumber
  //    }
  //  });
  // }
  // MonthlyBusinessReport(row) {
   
  //   this.inventoryID = row.inventoryID;
  //  this.router.navigate([
  //    '/monthlyBusinessReport',       
    
  //  ],{
  //    queryParams: {
  //      InventoryID: this.inventoryID,
  //      RegNo:row.registrationNumber
  //    }
  //  });
  // }

  // InterstateTax(row) {
   
  //   this.inventoryID = row.inventoryID;
  //  this.router.navigate([
  //    '/vehicleInterStateTax',       
    
  //  ],{
  //    queryParams: {
  //      InventoryID: this.inventoryID,
  //      RegNo:row.registrationNumber,
  //      redirectingFrom:'Inventory'
  //    }
  //  });
  // }

  // InventoryPUC(row) {
   
  //   this.inventoryID = row.inventoryID;
  //  this.router.navigate([
  //    '/inventoryPUC',       
    
  //  ],{
  //    queryParams: {
  //      InventoryID: this.inventoryID,
  //      RegNo:row.registrationNumber
  //    }
  //  });
  // }
  // InventoryFitness(row) {
   
  //   this.inventoryID = row.inventoryID;
  //  this.router.navigate([
  //    '/inventoryFitness',       
    
  //  ],{
  //    queryParams: {
  //      InventoryID: this.inventoryID,
  //      RegNo:row.registrationNumber
  //    }
  //  });
  // }
  // InventoryBlock(row) {
   
  //   this.inventoryID = row.inventoryID;
  //  this.router.navigate([
  //    '/inventoryBlock',       
    
  //  ],{
  //    queryParams: {
  //      InventoryID: this.inventoryID,
  //      RegNo:row.registrationNumber
  //    }
  //  });
  // }

   //-------ServiceLocation-------
  InitLocationHub(){
    this._generalService.GetLocationHub().subscribe(
      data=>
      {
        this.OrganizationalEntitiesList=data;
        this.filteredOrganizationalEntityOptions = this.locationHub.valueChanges.pipe(
          startWith(""),
          map(value => this._filterServiceLocation(value || ''))
        ); 
      });
  }

   
  private _filterServiceLocation(value: string): any {
    const filterValue = value.toLowerCase();
    // if(filterValue.length === 0) {
    //   return [];
    // }
    if (!value || value.length < 3) {
        return [];   
      }
    return this.OrganizationalEntitiesList.filter(
      data => 
      {
        return data.organizationalEntityName.toLowerCase().includes(filterValue);
      }
    );
  }
  

}



