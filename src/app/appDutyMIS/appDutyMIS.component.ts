// @ts-nocheck
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
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
import { extractExportErrorMessage } from '../general/export-job.helper';
import { MyUploadComponent } from '../myupload/myupload.component';
// import { FormDialogComponent } from '../appDutyMIS/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
// import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { AppDutyMISService } from './appDutyMIS.service';
import { AppDutyMIS } from './appDutyMIS.model';
import { ActivatedRoute } from '@angular/router';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';

import moment from 'moment';
import { VehicleCategoryDropDown } from '../general/vehicleCategoryDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
@Component({
  standalone: false,
  selector: 'app-appDutyMIS',
  templateUrl: './appDutyMIS.component.html',
  styleUrls: ['./appDutyMIS.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class AppDutyMISComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'reservationID',
    'dutySlipID',
    'registrationNumber',
    'dutyDate',
    'dispatch_Location',
    'driverName',
    'customerName',
    'app_GaragetoStart_KM',
    'app_PicktoEnd_KM',
    'app_EndtoGarage_KM',
    'location_out_km',
    'reporting_km',
    'releasing_km',
    'location_in_Km',
    'locationOutTimeByApp',
    'reportingToGuestTimeByApp',
    'dropOffTimeByApp',
    'locationInTimeByApp',
    'locationOutAddressStringByApp',
    'pickUpAddressStringByApp',
    'dropOffAddressStringByApp',
    'locationInAddressStringByApp',
    'appVersion',
    'mobile1',
    'deviceModel',
    'tripStatus',
    'dispatchMethod',
    'dutyGoingOn',
    'supplierType',
    'supplierName',
    'customerGroup',
    'packageType',
    'carBooked',
    'bookingType',
    'customerSignatureImage',
    // 'activationStatus'
  ];

  columnTitleMap: { [key: string]: string } = {
    reservationID: 'Booking No.',
    dutySlipID: 'Duty Slip No',
    registrationNumber: 'Car No ',
    dutyDate: 'Duty Date',
    dispatch_Location: 'Dispatch Location',
    driverName: 'Driver Name',
    customerName: 'Customer Name',
    app_GaragetoStart_KM: 'G Start km..',
    app_PicktoEnd_KM: 'Pick End km..',
    app_EndtoGarage_KM: 'End Garage km..',
    location_out_km: 'Loc Out km..',
    reporting_km: 'Rpt km..',
    releasing_km: 'Rel km..',
    location_in_Km: 'Loc In km.',
    locationOutTimeByApp: 'Loc Out Time',
    reportingToGuestTimeByApp: 'Rpt to Guest Time',
    dropOffTimeByApp: 'Drop Off Time',
    locationInTimeByApp: 'Loc In Time',
    locationOutAddressStringByApp: 'Loc Out Add..',
    pickUpAddressStringByApp: 'Pick Up Add..',
    dropOffAddressStringByApp: 'Drop Off Add..',
    locationInAddressStringByApp: 'Loc In Add..',
    appVersion: 'App Ver..',
    mobile1: 'Mobile',
    deviceModel: 'Device Model',
    tripStatus: 'Trip Status',
    dispatchMethod: 'Dispatch Me..',
    dutyGoingOn: 'Duty Going On',
    supplierType: 'Type of Supplier',
    supplierName: 'Supplier Name',
    customerGroup: 'Customer Group',
    packageType: 'Package Type',
    carBooked: 'Car Booked',
    bookingType: 'Booking Type',
    customerSignatureImage: 'Sig Image',
    actions: 'Actions',
  };
  
  // displayedColumns: string[] = [];
  dataSource: AppDutyMIS[] | null;
  appDutyMISID: number;
  advanceTable: AppDutyMIS | null;
  RegistrationNumber: string = '';
  State: string = '';
  FromDate: string = '';
  ToDate: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  registrationNumber: FormControl = new FormControl();
   filteredDispatchLocationOptions: Observable<OrganizationalEntityDropDown[]>;
   dispatch_Location: FormControl = new FormControl();
  public DispatchLocationList?: OrganizationalEntityDropDown[] = [];
  state: FormControl = new FormControl();
  public StatesList?: StatesDropDown[] = [];
  filteredStateOptions: Observable<StatesDropDown[]>;
  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  public VehicleList?: VehicleDropDown[] = [];
  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  vehicleCategory:FormControl=new FormControl();

  SearchVehicle:string='';
  vehicle:FormControl=new FormControl();
  searchInventory: string = '';
  
  inventoryID: any;
  redirectingFrom: any;
  StateID: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  VehicleCategory: string = '';
  Vehicle: string = '';
  Inventory: string = '';
  // FromDate: string = '';
  // ToDate: string = '';
  DispatchLocation: string = '';

  searchFromDate: Date | null = null;
  searchToDate: Date | null = null;
  csvExporting = false;
  filtersCollapsed = false;
  exportJobId: string | null = null;
  exportJobStatus: any = null;
  exportJobRunning = false;
  exportJobDownloading = false;
  exportJobError = '';
  exportJobStartedAt: number | null = null;
  private exportPollSub?: Subscription;
  readonly maxDateRangeDays = 15;
  readonly exportJobType = 'AppMISExport';
  private readonly pageSize = 50;

  private readonly zeroAsNaColumns = new Set(['dutySlipID']);

  private getTodayDate(): Date {
    return moment().utcOffset('+05:30').startOf('day').toDate();
  }

  private setDefaultDateRange(): void {
    const today = this.getTodayDate();
    this.searchFromDate = today;
    this.searchToDate = today;
  }

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public appDutyMISService: AppDutyMISService,
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
    this.setDefaultDateRange();
    //this.loadData();
    this.SubscribeUpdateService();
    this.initDispatchLocation();
  }

    // initdispatchLocation(){
    //   this._generalService.GetLocationHub().subscribe(
    //     data=>
    //     {
    //       this.DispatchLocationList=data;
    //       this.filteredDispatchLocationOptions = this.dispatchLocation.valueChanges.pipe(
    //         startWith(""),
    //         map(value => this._filterRN(value || ''))
    //       ); 
    //     });
    // }
    
    // private _filterRN(value: string): any {
    //   const filterValue = value.toLowerCase();
    //   return this.DispatchLocationList.filter(
    //     customer => 
    //     {
    //       return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
    //     }
    //   );
    // }

    initDispatchLocation(){
      this._generalService.GetLocationHub().subscribe(
        data =>
        {
          this.DispatchLocationList = data;  
          this.filteredDispatchLocationOptions = this.dispatch_Location.valueChanges.pipe(
            startWith(""),
            map(value => this._filterRN(value || ''))
          );              
        },
        error=>
        {
      
        }
      );
      }
  
      private _filterRN(value: string): any {
      const filterValue = value.toLowerCase();
    //   if (!value || value.length < 3) {
    //   return [];   
    // }
      return this.DispatchLocationList.filter(
        customer =>
        {
          return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
        }
      );
      }

  ngOnDestroy() {
    this.stopExportPolling();
    if (this.subscriptionName) {
      this.subscriptionName.unsubscribe();
    }
  }

  refresh() {
    this.setDefaultDateRange();
    this.dispatch_Location.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.dataSource = null;
    this.clearExportJob();
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.searchFromDate) count++;
    if (this.searchToDate) count++;
    if (this.dispatch_Location.value?.trim()) count++;
    if (this.SearchActivationStatus === false) count++;
    return count;
  }

  toggleFilters(): void {
    this.filtersCollapsed = !this.filtersCollapsed;
  }

  private formatDateParam(value: Date | null): string {
    if (!value) {
      return '';
    }
    return moment(value).format('MMM DD yyyy');
  }

//   addNew()
//   {
//     const dialogRef = this.dialog.open(FormDialogComponent, 
//     {
//       data: 
//         {
//           advanceTable: this.advanceTable,
//           action: 'add',
//           inventoryID:this.inventoryID,
//           registrationNumber:this.RegistrationNumber,
//           redirectedFrom:this.redirectingFrom,
//           StateID:this.StateID,
//           State:this.State
//         }
//     });
//   }

//   editCall(row) {
//     //  alert(row.id);
//   this.appDutyMISID = row.id;
//   const dialogRef = this.dialog.open(FormDialogComponent, {
//     data: {
//       advanceTable: row,
//       action: 'edit',
//       inventoryID:this.inventoryID,
//       registrationNumber:this.RegistrationNumber,
//       redirectedFrom:this.redirectingFrom,
//       StateID:this.StateID,
//       State:this.State
//     }
//   });

// }
// deleteItem(row)
// {
//   this.appDutyMISID = row.id;
//   const dialogRef = this.dialog.open(DeleteDialogComponent, 
//   {
//     data: row
//   });
// }

shouldShowDeleteButton(item: any): boolean {
  return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
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

  private normalizeRows(rows: any[] | null | undefined): AppDutyMIS[] {
    if (!rows?.length) {
      return [];
    }

    return rows.map((row) => this.normalizeRow(row));
  }

  private readonly timeColumns = new Set([
    'locationOutTimeByApp',
    'reportingToGuestTimeByApp',
    'dropOffTimeByApp',
    'locationInTimeByApp',
  ]);

  private normalizeRow(row: any): any {
    const driverOfficialIdentityNumber =
      row.driverOfficialIdentityNumber ?? row.DriverOfficialIdentityNumber ?? null;
    return {
      ...row,
      driverOfficialIdentityNumber,
      driverName: driverOfficialIdentityNumber,
      driverDisplayName: this.formatDriverName({ driverOfficialIdentityNumber }),
      locationOutTimeByApp: this.formatTimeValue(row.locationOutTimeByApp ?? row.LocationOutTimeByApp),
      reportingToGuestTimeByApp: this.formatTimeValue(
        row.reportingToGuestTimeByApp ?? row.ReportingToGuestTimeByApp
      ),
      dropOffTimeByApp: this.formatTimeValue(row.dropOffTimeByApp ?? row.DropOffTimeByApp),
      locationInTimeByApp: this.formatTimeValue(row.locationInTimeByApp ?? row.LocationInTimeByApp),
    };
  }

  formatDriverName(row: any): string {
    // Driver Name column shows Driver.DriverOfficialIdentityNumber only.
    const code = (row?.driverOfficialIdentityNumber ?? row?.DriverOfficialIdentityNumber ?? '')
      .toString()
      .trim();
    return code || 'N/A';
  }

  private formatTimeValue(value: any): string {
    if (value === undefined || value === null || value === '' || value === 'N/A') {
      return 'N/A';
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return 'N/A';
      }
      const parsed = moment(trimmed, [moment.ISO_8601, 'HH:mm:ss', 'HH:mm:ss.SSSSSSS', 'HH:mm'], true);
      if (parsed.isValid()) {
        return parsed.format('HH:mm:ss');
      }
      // Already a time-like string from API
      if (/^\d{1,2}:\d{2}(:\d{2})?/.test(trimmed)) {
        return trimmed.length === 5 ? `${trimmed}:00` : trimmed;
      }
      return trimmed;
    }

    if (typeof value === 'object') {
      // Newtonsoft TimeSpan JSON shape
      const hours = value.hours ?? value.Hours;
      const minutes = value.minutes ?? value.Minutes;
      const seconds = value.seconds ?? value.Seconds;
      if (hours !== undefined || minutes !== undefined || seconds !== undefined) {
        const pad = (n: number) => String(Math.floor(Math.abs(n || 0))).padStart(2, '0');
        return `${pad(hours || 0)}:${pad(minutes || 0)}:${pad(seconds || 0)}`;
      }
      if (value.ticks != null || value.Ticks != null) {
        const ticks = Number(value.ticks ?? value.Ticks);
        if (Number.isFinite(ticks)) {
          const totalSeconds = Math.floor(Math.abs(ticks) / 10000000);
          const h = Math.floor(totalSeconds / 3600);
          const m = Math.floor((totalSeconds % 3600) / 60);
          const s = totalSeconds % 60;
          const pad = (n: number) => String(n).padStart(2, '0');
          return `${pad(h)}:${pad(m)}:${pad(s)}`;
        }
      }
    }

    return 'N/A';
  }

  getDisplayValue(column: string, row: any): string | number {
    if (column === 'driverName') {
      return row.driverDisplayName || this.formatDriverName(row);
    }

    if (this.timeColumns.has(column)) {
      return this.formatTimeValue(row[column]);
    }

    const value = row[column];

    if (this.zeroAsNaColumns.has(column)) {
      return value === undefined || value === null || value === 0 ? 'N/A' : value;
    }

    if (value === undefined || value === null || value === '') {
      return 'N/A';
    }

    if (typeof value === 'object') {
      return 'N/A';
    }

    return value;
  }

   public loadData() 
   {
    const fromDate = this.formatDateParam(this.searchFromDate);
    const toDate = this.formatDateParam(this.searchToDate);

    switch (this.selectedFilter)
    {
      case 'organizationalEntityName':
        this.dispatch_Location.setValue(this.searchTerm);
        break;
        case 'fromDate':
          this.FromDate = this.searchTerm;
          break;
          case 'toDate':
          this.ToDate = this.searchTerm;
          break;
      default:
        this.searchTerm = '';
        break;
    }
      this.appDutyMISService.getTableData(fromDate,
        toDate,
        this.dispatch_Location.value,this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data =>   
        {
          const rows = this.normalizeRows(data);
          this.dataSource = rows.length ? rows : null;
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
  onContextMenu(event: MouseEvent, item: AppDutyMIS) {
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

    const dateRangeError = this.validateDateRange();
    if (dateRangeError) {
      this.showNotification('snackbar-danger', dateRangeError, 'bottom', 'center');
      return;
    }

    this.PageNumber = 0;
    this.dataSource = null;
    this.exportJobError = '';
    this.exportJobStartedAt = Date.now();
    const fromDate = this.formatDateParam(this.searchFromDate);
    const toDate = this.formatDateParam(this.searchToDate);

    this.exportJobRunning = true;
    this.showNotification('snackbar-info', 'Export job started. CSV will be ready when processing completes.', 'bottom', 'center');

    this.appDutyMISService.startExportJob(
      fromDate,
      toDate,
      this.dispatch_Location.value || '',
      this.SearchActivationStatus
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
    if (!this.exportJobId || !this.appDutyMISService.isExportJobReady(this.exportJobStatus) || this.exportJobDownloading) {
      return;
    }

    this.exportJobDownloading = true;
    this.appDutyMISService.downloadExportJob(this.exportJobId).subscribe(
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
            if (text?.trim()) message = text;
          }
          this.showNotification('snackbar-danger', message, 'bottom', 'center');
          return;
        }

        const fileName = this.exportJobStatus?.fileName ?? this.exportJobStatus?.FileName;
        this.triggerCsvDownload(blob, fileName);
        this.appDutyMISService.getExportJobStatus(this.exportJobId).subscribe((status) => { this.exportJobStatus = status; }, () => {});
      },
      async (error) => {
        this.exportJobDownloading = false;
        this.showNotification('snackbar-danger', await extractExportErrorMessage(error), 'bottom', 'center');
      }
    );
  }

  canDownloadExport(): boolean {
    return !!this.exportJobId && this.appDutyMISService.isExportJobReady(this.exportJobStatus) && !this.exportJobDownloading;
  }

  isExportJobInProgress(): boolean {
    return this.exportJobRunning || this.appDutyMISService.isExportJobRunning(this.exportJobStatus);
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
    if (!this.exportJobStartedAt) return '—';
    const elapsedSeconds = Math.floor((Date.now() - this.exportJobStartedAt) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }

  hasAdditionalFilters(): boolean {
    const dispatch = (this.dispatch_Location.value || '').trim();
    return !!dispatch || this.SearchActivationStatus === false;
  }

  validateDateRange(): string | null {
    if (!this.searchFromDate || !this.searchToDate) {
      return 'Duty date range is required. Please select From and To dates.';
    }

    const fromDate = moment(this.searchFromDate).startOf('day');
    const toDate = moment(this.searchToDate).startOf('day');
    if (!fromDate.isValid() || !toDate.isValid()) {
      return 'Please enter valid duty dates.';
    }
    if (toDate.isBefore(fromDate)) {
      return 'Duty To cannot be earlier than From.';
    }
    if (!this.hasAdditionalFilters()) {
      const inclusiveDays = toDate.diff(fromDate, 'days') + 1;
      if (inclusiveDays > this.maxDateRangeDays) {
        return `Duty date range cannot exceed ${this.maxDateRangeDays} days when no other search filters are selected. Add another filter to search a wider range.`;
      }
    }
    return null;
  }

  private startExportPolling(jobId: string) {
    this.stopExportPolling();
    this.exportPollSub = this.appDutyMISService.pollExportJob(jobId).subscribe(
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
    const fileUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = preferredFileName || `AppDutyMIS_${moment().format('YYYYMMDD_HHmmss')}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(fileUrl);
    this.showNotification('snackbar-success', 'CSV downloaded', 'bottom', 'center');
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
          if(this.MessageArray[0]=="AppDutyMISCreate")
          {
            if(this.MessageArray[1]=="AppDutyMISView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Car Paid Tax MIS  Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AppDutyMISUpdate")
          {
            if(this.MessageArray[1]=="AppDutyMISView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Car Paid Tax MIS Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AppDutyMISDelete")
          {
            if(this.MessageArray[1]=="AppDutyMISView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Car Paid Tax MIS  Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AppDutyMISAll")
          {
            if(this.MessageArray[1]=="AppDutyMISView")
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
            if(this.MessageArray[1]=="DuplicacyError")
            {
              if(this.MessageArray[2]=="Failure")
              {
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

  downloadCsv() {
    if (this.csvExporting) {
      return;
    }

    if (!this.dataSource?.length) {
      this.showNotification('snackbar-danger', 'No data to export. Run a search first.', 'bottom', 'center');
      return;
    }

    // Always export all rows matching filters (not just the current page of 50).
    this.exportFullCsv();
  }

  private exportFullCsv() {
    const fromDate = this.formatDateParam(this.searchFromDate);
    const toDate = this.formatDateParam(this.searchToDate);

    this.csvExporting = true;
    this.showNotification('snackbar-info', 'Preparing CSV export of all matching records...', 'bottom', 'center');

    this.appDutyMISService.downloadCsv(
      fromDate,
      toDate,
      this.dispatch_Location.value || '',
      this.SearchActivationStatus
    ).subscribe(
      async (blob: Blob) => {
        this.csvExporting = false;
        if (!blob || blob.size === 0) {
          this.showNotification('snackbar-danger', 'No data available for CSV export', 'bottom', 'center');
          return;
        }

        if (blob.type?.includes('json') || blob.type?.includes('text/plain')) {
          const message = await this.readBlobText(blob);
          this.showNotification('snackbar-danger', message || 'Failed to download CSV', 'bottom', 'center');
          return;
        }

        this.triggerBlobDownload(blob, 'xls');
        this.showNotification('snackbar-success', 'Excel downloaded successfully (all matching records)', 'bottom', 'center');
      },
      async (err) => {
        this.csvExporting = false;
        let message = 'Failed to download full export for all matching records.';
        try {
          if (err?.error instanceof Blob) {
            const text = await this.readBlobText(err.error);
            try {
              const json = JSON.parse(text);
              message = json.Message || json.message || message;
            } catch {
              if (text?.trim()) {
                message = text.trim();
              }
            }
          } else {
            message =
              err?.error?.Message
              || err?.error?.message
              || err?.message
              || message;
          }
        } catch {
          // keep default message
        }
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    );
  }

  private triggerBlobDownload(blob: Blob, extension: 'csv' | 'xls' | 'xlsx' = 'xls'): void {
    const fileUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = `AppDutyMIS_${moment().format('YYYYMMDD_HHmmss')}.${extension}`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(fileUrl);
  }

  private downloadVisibleRowsCsv(): void {
    const headers = this.displayedColumns.map((column) => this.columnTitleMap[column] || column);
    const rows = (this.dataSource || []).map((row) =>
      this.displayedColumns.map((column) => {
        if (column === 'dutyDate') {
          return row[column] ? moment(row[column]).format('DD-MM-YYYY') : 'N/A';
        }
        if (column === 'driverName') {
          return this.formatDriverName(row);
        }
        return String(this.getDisplayValue(column, row));
      })
    );

    const csv = [headers, ...rows]
      .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    this.triggerBlobDownload(blob, 'csv');
    this.showNotification(
      'snackbar-success',
      'CSV downloaded for visible page only (not full filter result).',
      'bottom',
      'center'
    );
  }

  private readBlobText(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => resolve('');
      reader.readAsText(blob);
    });
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
    this.appDutyMISService.getTableDataSort(this.formatDateParam(this.searchFromDate),
       this.formatDateParam(this.searchToDate),
       this.dispatch_Location.value,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        const rows = this.normalizeRows(data);
        this.dataSource = rows.length ? rows : null;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




