// @ts-nocheck
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SupplierService } from './supplier.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Supplier } from './supplier.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, merge, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, skip, startWith } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { formatSupplierCode } from './supplier-display.util';
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
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SupplierComponent implements OnInit, OnDestroy {
  exportJobId: string | null = null;
  exportJobStatus: any = null;
  exportJobRunning = false;
  exportJobDownloading = false;
  exportJobError = '';
  exportJobStartedAt: number | null = null;
  private exportPollSub?: Subscription;
  private readonly exportJobPageKey = 'supplierMaster';
  @ViewChild(StoredMisExportsComponent) storedExports?: StoredMisExportsComponent;
  displayedColumns = [
    'supplierName',
    'supplierCode',
    'supplierType',
    'paymentBasis',
    'dateOfAgreement',
    'supplierAgreementLocation',
    'phone',
    'email',
    'isAdhoc',
    'supplierVerificationStatus',
    'supplierRegistrationDate',
    'actions'
  ];
  dataSource: Supplier[] | null;
  hasSearched = false;
  supplierID: number;
  advanceTable: Supplier | null; 
  PageNumber: number = 0; 
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;

  SearchName: string = '';
  search : FormControl = new FormControl();

  SearchCity: string = '';
  city : FormControl = new FormControl();

  SearchAddress: string = '';
  address : FormControl = new FormControl();

  SearchPin: string = '';
  pin : FormControl = new FormControl();

  SearchPhone: string = '';
  phone : FormControl = new FormControl();

  SearchFax: string = '';
  SearchEmail: string = '';
  SearchSupplierStatus: string = '';
  SearchSupplierVerificationStatus: string = '';
  SearchSupplierRegistrationDate: string = '';
  fax : FormControl = new FormControl();
  supplierName: any;

  public CityList?: CitiesDropDown[] = [];
  filteredCityOptions: Observable<CitiesDropDown[]>;
  supplierDate: any;
  
 selectedFilter: string = 'search';
 filterCtrl = new FormControl('');
 searchTerm: any = '';
 filterSelected:boolean = true;
 filteredFilterOptions: Observable<string[]>;
 filterSuggestions: string[] = [];
 private suggestionRefresh$ = new BehaviorSubject<void>(undefined);

  // supplierMenuItems: any[] = [
  //   //{ label: 'Rate Card', route: '/supplierRateCard', tooltip: 'Rate Card' },
  //   { label: 'City Mapping', route: '/supplierCityMapping', tooltip: 'City Mapping' },
  //   { label: 'Activation Status History', route: '/supplierActivationStatusHistory', tooltip: 'Activation Status History' },
  //   { label: 'Upload Documents', route: '/supplierVerificationDocuments', tooltip: 'Upload Documents' },
  //   { label: 'History', route: '/supplierVerificationStatusHistory', tooltip: 'Supplier History' },
  //   { label: 'Contract Mapping', route: '/supplierRateCardSupplierMapping', tooltip: 'Contract Mapping' }
  // ];
  
  // openSupplierTab(menuItem: any, rowItem: any) {
  //   const baseUrl = this._generalService.FormURL;
  //   const queryParams: any = {
  //     SupplierID: rowItem.supplierID,
  //     SupplierName: rowItem.supplierName
  //   };
  
  //   // Add EmployeeID only if route is supplierVerificationDocuments
  //   if (menuItem.route === '/supplierVerificationDocuments') {
  //     queryParams.EmployeeID = rowItem.supplierCreatedByEmployeeID;
  //   }
  
  //   const url = this.router.serializeUrl(this.router.createUrlTree([menuItem.route], { queryParams }));
  
  //   window.open(baseUrl + url, '_blank');
  // }
  
  supplierMenuItems: any[] = [
    { label: 'City Mapping', route: '/supplierCityMapping', tooltip: 'City Mapping' },
    { label: 'Activation Status History', route: '/supplierActivationStatusHistory', tooltip: 'Activation Status History' },
    { label: 'Upload Documents', route: '/supplierVerificationDocuments', tooltip: 'Upload Documents' },
    { label: 'Verification', route: '/supplierVerificationStatusHistory', tooltip: 'Supplier History' },
    { label: 'Contract Mapping', route: '/supplierRateCardSupplierMapping', tooltip: 'Contract Mapping' }
  ];
  
  openSupplierTab(menuItem: any, rowItem: any) {
  
    const baseUrl = this._generalService.FormURL;
  
    // Encrypt the Supplier ID and Name
    const encryptedSupplierID = this._generalService.encrypt(encodeURIComponent(rowItem.supplierID));
    const encryptedSupplierName = this._generalService.encrypt(encodeURIComponent(rowItem.supplierName));
  
    const queryParams: any = {
      SupplierID: encryptedSupplierID,
      SupplierName: encryptedSupplierName
    };
  
    // Encrypt EmployeeID only if the selected menu item is 'Upload Documents'
    if (menuItem.route === '/supplierVerificationDocuments') {
      queryParams.EmployeeID = this._generalService.encrypt(encodeURIComponent(rowItem.supplierCreatedByEmployeeID));
    }
  
    const url = this.router.serializeUrl(this.router.createUrlTree([menuItem.route], { queryParams }));
  
    window.open(baseUrl + url, '_blank');
  }
  
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public supplierService: SupplierService,
    private snackBar: MatSnackBar,
    
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.filteredCityOptions = this.city.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        ); 
      });
    this.SubscribeUpdateService();
    
 this.supplierMenuItems.sort((a, b) => a.label.localeCompare(b.label));
    this.initInlineFilterAutocomplete();
    this.loadData(true);
    this.resumeExportJobIfNeeded();
  }

  ngOnDestroy() {
    this.stopExportPolling();
  }

  private initInlineFilterAutocomplete(): void {
    this.filteredFilterOptions = merge(
      this.filterCtrl.valueChanges.pipe(startWith('')),
      this.suggestionRefresh$
    ).pipe(
      map(() => this.getLocalFilterOptions(this.filterCtrl.value || ''))
    );

    this.filterCtrl.valueChanges.pipe(
      skip(1),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value) => {
      this.searchTerm = value || '';
      const term = (value || '').trim();
      if (term.length >= 3) {
        this.Filter();
      } else if (term.length === 0) {
        this.filterSuggestions = [];
        this.suggestionRefresh$.next();
        this.loadData(true);
      }
    });
  }

  onSelectedFilterChange(): void {
    this.filterCtrl.setValue('', { emitEvent: false });
    this.searchTerm = '';
    this.filterSuggestions = [];
    this.suggestionRefresh$.next();
    this.loadData(true);
  }

  onFilterOptionSelected(value: string): void {
    this.filterCtrl.setValue(value || '');
    this.searchTerm = value || '';
    this.Filter();
  }

  private getLocalFilterOptions(value: string): string[] {
    const term = (value || '').trim();
    if (term.length < 3) {
      return [];
    }

    const lower = term.toLowerCase();
    return this.filterSuggestions.filter((option) =>
      option.toLowerCase().includes(lower)
    );
  }

  private updateFilterSuggestions(data: Supplier[]): void {
    const term = (this.filterCtrl.value || '').trim();
    if (term.length < 3) {
      this.filterSuggestions = [];
      return;
    }

    const values = (data || [])
      .map((row) => formatSupplierCode(row))
      .filter((value) => !!value && value !== '##');
    this.filterSuggestions = [...new Set(values)];
    this.suggestionRefresh$.next();
  }

  private getSearchTerm(): string {
    let term = (this.filterCtrl.value || this.searchTerm || '').trim();
    // If autocomplete selection is Name#Code#PAN, search using the typed/selected text's name part
    // so backend OR-match still works for PAN / OldRentnetCode typed values.
    if (term.includes('#')) {
      const parts = term.split('#');
      // Prefer Old Rentnet Code when present, else name, else PAN
      if (parts[1] && parts[1].trim()) {
        return parts[1].trim();
      }
      if (parts[0] && parts[0].trim()) {
        return parts[0].trim();
      }
      if (parts[2] && parts[2].trim()) {
        return parts[2].trim();
      }
    }
    return term;
  }
  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.CityList.filter(
      customer =>
      {
        return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      const term = (this.filterCtrl.value || '').trim();
      if (term.length === 0) {
        this.loadData(true);
      }
    }
  }
  refresh() {
    this.clearExportJob();
    this.SearchName = '';
    this.city.setValue(''),
    this.SearchAddress = '',
    this.SearchPin = '',
    this.SearchPhone = '',
    this.SearchFax= '',
    this.SearchEmail= '',
    this.SearchSupplierStatus= '',
    this.SearchSupplierVerificationStatus= '',
    this.SearchSupplierRegistrationDate= '',
    this.filterCtrl.setValue('', { emitEvent: false });
    this.searchTerm='';
    this.selectedFilter ='search';
    this.PageNumber=0;
    this.loadData(true);
  }

  public SearchData()
  {
    this.PageNumber = 0;
    this.loadData(false);
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      panelClass: 'supplier-form-wide-dialog',
      width: '1100px',
      maxWidth: 'calc(100vw - 32px)',
      minWidth: 'min(1100px, calc(100vw - 32px))',
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.supplierID = row.supplierID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      panelClass: 'supplier-form-wide-dialog',
      width: '1100px',
      maxWidth: 'calc(100vw - 32px)',
      minWidth: 'min(1100px, calc(100vw - 32px))',
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });

  }
  deleteItem(row)
  {

    this.supplierID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }
  public Filter()
  {
    this.loadData(true);
  }

  private clearSearchCriteria(): void {
    this.SearchName = '';
    this.city.setValue('', { emitEvent: false });
    this.SearchAddress = '';
    this.SearchPin = '';
    this.SearchPhone = '';
    this.SearchFax = '';
    this.SearchEmail = '';
    this.SearchSupplierStatus = '';
    this.SearchSupplierVerificationStatus = '';
    this.SearchSupplierRegistrationDate = '';
  }

  private applyInlineSearchCriteria(): void {
    this.clearSearchCriteria();
    this.SearchName = this.getSearchTerm();
  }

   public loadData(fromInlineSearch = false) 
   {
    this.hasSearched = true;

    if (fromInlineSearch) {
      this.PageNumber = 0;
      this.applyInlineSearchCriteria();
    }

      this.supplierService.getTableData(this.SearchName,
        this.city.value,
        this.SearchAddress,
        this.SearchPin,
        this.SearchPhone,
        this.SearchFax,
        this.SearchEmail,
        this.SearchSupplierStatus,
        this.SearchSupplierVerificationStatus,
        this.SearchSupplierRegistrationDate,
         this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
        this.updateFilterSuggestions(data || []);
       
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

    this.supplierService.startExportJob(
      this.SearchName || '',
      this.city.value || '',
      this.SearchAddress || '',
      this.SearchPin || '',
      this.SearchPhone || '',
      this.SearchFax || '',
      this.SearchEmail || '',
      this.SearchSupplierStatus || '',
      this.SearchSupplierVerificationStatus || '',
      this.SearchSupplierRegistrationDate || ''
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
    if (!this.exportJobId || !this.supplierService.isExportJobReady(this.exportJobStatus) || this.exportJobDownloading) {
      return;
    }

    this.exportJobDownloading = true;
    this.supplierService.downloadExportJob(this.exportJobId).subscribe(
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

    this.supplierService.cancelExportJob(this.exportJobId).subscribe(
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
    return !!this.exportJobId && this.supplierService.isExportJobReady(this.exportJobStatus) && !this.exportJobDownloading;
  }

  isExportJobInProgress(): boolean {
    return this.exportJobRunning || this.supplierService.isExportJobRunning(this.exportJobStatus);
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
    this.exportPollSub = this.supplierService.pollExportJob(jobId).subscribe(
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

    this.supplierService.getExportJobStatus(jobId).subscribe(
      (status: any) => {
        if (!status) {
          this.exportJobRunning = true;
          this.startExportPolling(jobId);
          return;
        }

        this.exportJobId = jobId;
        this.exportJobStatus = status;
        this.exportJobError = '';
        if (this.supplierService.isExportJobRunning(status)) {
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
    anchor.download = preferredFileName || `SupplierMaster_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
    this.showNotification('snackbar-success', 'CSV downloaded successfully', 'top', 'center');
  }

  getSupplierCode(row: Supplier): string {
    if (!row) {
      return '';
    }
    const name = (row.supplierName || '').toUpperCase();
    const code = row.oldRentnetCode != null && row.oldRentnetCode !== 0
      ? String(row.oldRentnetCode)
      : '';
    return `${name}${code}`;
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: Supplier) {
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
      this.loadData(false);
    }
    //alert([this.PageNumber])
  }
  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData(false);    } 
  }

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
          if(this.MessageArray[0]=="SupplierCreate")
          {
            if(this.MessageArray[1]=="SupplierView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Supplier Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierUpdate")
          {
            if(this.MessageArray[1]=="SupplierView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierDelete")
          {
            if(this.MessageArray[1]=="SupplierView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierAll")
          {
            if(this.MessageArray[1]=="SupplierView")
            {
              if(this.MessageArray[2]=="Failure")
              {
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
          else if(this.MessageArray[0]=="DataNotFound")
          {
            if(this.MessageArray[1]=="OldRentnetCodeDuplicacyError")
            {
              if(this.MessageArray[2]=="Failure")
              {
               this.showNotification(
                'snackbar-danger',
                'Old Rentnet Code already exists.....!!!',
                'bottom',
                'center'
              );
              }
            }
            else if(this.MessageArray[1]=="DuplicacyError")
            {
              if(this.MessageArray[2]=="Failure")
              {
               this.refresh();
               this.showNotification(
                'snackbar-danger',
                'Supplier Official Identity Number already exists.....!!!',
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

  // supplierRateCard(row) {
   
  //   this.supplierID = row.supplierID;
  //   this.supplierName=row.supplierName;
  //   this.router.navigate([
  //     '/supplierRateCard',       
     
  //   ],{
  //     queryParams: {
  //       SupplierID: this.supplierID,
  //       SupplierName:this.supplierName
  //     }
  //   });
  // }

  // supplierActivation(row) {
   
  //   this.supplierID = row.supplierID;
  //   this.supplierName=row.supplierName;
  //   //console.log(this.supplierName)
  //   //alert(row.vendorID);
  //   this.router.navigate([
  //     '/supplierActivationStatusHistory',       
     
  //   ],{
  //     queryParams: {
  //       SupplierID: this.supplierID,
  //       SupplierName:this.supplierName
  //     }
  //   });
  // }

  // supplierCityMapping(row) {
   
  //   this.supplierID = row.supplierID;
  //   this.supplierName=row.supplierName;
  //   this.router.navigate([
  //     '/supplierCityMapping',       
     
  //   ],{
  //     queryParams: {
  //       SupplierID: this.supplierID,
  //       SupplierName:this.supplierName
  //     }
  //   });
  // }

  // supplierVerificationDocuments(row) {
   
  //   this.supplierID = row.supplierID;
  //   this.supplierName=row.supplierName;
  //   //console.log(this.supplierName)
  //   //alert(row.vendorID);
  //   this.router.navigate([
  //     '/supplierVerificationDocuments',       
     
  //   ],{
  //     queryParams: {
  //       SupplierID: this.supplierID,
  //       SupplierName:this.supplierName,
  //     EmployeeID:row.supplierCreatedByEmployeeID
  //     }
  //   });
  // }
  // supplierVerificationStatusHistory(row) {
   
  //   this.supplierID = row.supplierID;
  //   this.supplierName=row.supplierName;
  //   //console.log(this.supplierName)
  //   //alert(row.vendorID);
  //   this.router.navigate([
  //     '/supplierVerificationStatusHistory',       
     
  //   ],{
  //     queryParams: {
  //       SupplierID: this.supplierID,
  //       SupplierName:this.supplierName
  //     }
  //   });
  // }
  SortingData(coloumName:any) {
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.supplierService.getTableDataSort(this.SearchName,
      this.city.value || '',
      this.SearchAddress,
      this.SearchPin,
      this.SearchPhone,
      this.SearchFax,
      this.SearchEmail,
      this.SearchSupplierStatus,
      this.SearchSupplierVerificationStatus,
      this.SearchSupplierRegistrationDate,
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
}



