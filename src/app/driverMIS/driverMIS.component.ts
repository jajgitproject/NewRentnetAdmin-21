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
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router'
import { QualificationDropDown } from '../general/qualificationDropDown.model';
import { DriverGradeDropDown } from '../driverGrade/driverGradeDropDown.model';
import { DriverMISService } from './driverMIS.service';
import { DriverMIS } from './driverMIS.model';
import { SupplierTypeDropDownModel } from '../supplierType/supplierType.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
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
  selector: 'app-drivermis',
  templateUrl: './drivermis.component.html',
  styleUrls: ['./drivermis.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DriverMISComponent implements OnInit, OnDestroy {
  exportJobId: string | null = null;
  exportJobStatus: any = null;
  exportJobRunning = false;
  exportJobDownloading = false;
  exportJobError = '';
  exportJobStartedAt: number | null = null;
  private exportPollSub?: Subscription;
  private readonly exportJobPageKey = 'driverMIS';
  @ViewChild(StoredMisExportsComponent) storedExports?: StoredMisExportsComponent;
  displayedColumns = [
    'driverName',
    'registrationNumber',
    'driverFatherName',
    'driverGrade',
    'driverEmail',
    'driverOfficialIdentityNumber',
    'dob',
    'driverGradeName',
    'rtoState',
    'idMark',
    'localAddressCity',
    'highestQualification',
    'bloodGroup',
    'driverStatus',
    'dateOfJoining',
    'dateOfLeaving',
    'localAddressAddressString',
    'localAddressLatLong',
    'localAddress',
    'localPincode',
    'permanentAddressCity',
    'permanentAddress',
    'permanentAddressPincode',
    'mobile1',
    'mobile2',
    'hub',
    'location',
    'supplierType',
    'supplier',
    'englishSpeakingSkills',
    'referenceOf',
    'policeVerification',
    'driverImage',
    'medicalInsurance',
    'drivingSinceDate',
    'countryCodes',
    'companyName',
    'driverFeedbackAverage',
    'driverFeedbackReceived',
    'driverFeedbackTotal',
    'driverFeedbackCount',
    'appLoginStatus',
    'offDuty',
    'appVersion',
    'deviceModel',
    'deviceIMEI',
    'deviceType',
    'driverCameraProblem',
    // 'actions'
  ];
  columnTitleMap: { [key: string]: string } = {
    driverName: "Driver Name",
    driverFatherName: "Father Name",
    driverGrade: "Driver Grade",
    driverEmail: "Driver Email",
    driverOfficialIdentityNumber: "Official Identity Number",
    dob: "Dob",
    driverGradeName: "Grade Name",
    rtoState: "State",
    idMark: "Mark",
    localAddressCity: "Local Address City",
    highestQualification: "Highest Qualification",
    bloodGroup: "Blood Group",
    driverStatus: "Driver Status",
    dateOfJoining: "Date Of Joining",
    dateOfLeaving: "Date Of Leaving",
    localAddressAddressString: "Local Address String",
    localAddressLatLong: "Local Address Lat Long",
    localAddress: "Local Address",
    localPincode: "Local Pincode",
    permanentAddressCity: "Permanent Address City",
    permanentAddress: "Permanent Address",
    permanentAddressPincode: "Permanent Address Pincode",
    mobile1: "Mobile 1",
    mobile2: "Mobile 2",
    hub: "Hub",
    location: "Location",
    registrationNumber: "Registration Number",
    supplierType: "Supplier Type",
    supplier: "Supplier",
    englishSpeakingSkills: "English Speaking Skills",
    referenceOf: "Reference Of",
    policeVerification: "Police Verification",
    driverImage: "Driver Image",
    medicalInsurance: "Medical Insurance",
    drivingSinceDate: "Driving Since Date",
    countryCodes: "Country Codes",
    companyName: "Company Name",
    driverFeedbackAverage: "Feedback Average",
    driverFeedbackReceived: "Feedback Received",
    driverFeedbackTotal: "Feedback Total",
    driverFeedbackCount: "Feedback Count",
    appLoginStatus: "App Login Status",
    offDuty: "Off Duty",
    appVersion: "App Version",
    deviceModel: "Device Model",
    deviceIMEI: "Device Imei",
    deviceType: "Device Type",
    driverCameraProblem: "Camera Problem",
     actions: "Actions"
  }
  
  dataSource: DriverMIS[] | null;
  driverID: number;
  advanceTable: DriverMIS | null;
  SearchdriverName: string = '';
  searchdriverFatherName: string = '';
  searchdriverGradeName: string = '';
  searchDriverMISOfficialIdentityNumber: string = '';
  searchhighestQualification: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  driverFatherName : FormControl = new FormControl();
  driverGrade : FormControl = new FormControl();
  idMark : FormControl = new FormControl();
  highestQualification : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  public DriverMISGradeList?: DriverGradeDropDown[] = [];
  filteredGradeOptions: Observable<DriverGradeDropDown[]>;
  public QualificationList?: QualificationDropDown[] = [];

 public SupplierTypeList?: SupplierTypeDropDownModel[] = [];
  filteredSupplierTypeOptions: Observable<SupplierTypeDropDownModel[]>;
filteredDriverOptions:Observable<DriverDropDown[]>;
  public DriverList?:DriverDropDown[]=[];
  searchDriverName:string='';
  searchSupplierType: string = '';
  driver : FormControl=new FormControl();
  supplierType : FormControl = new FormControl();

   filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
   public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
   public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
     locationHub: FormControl = new FormControl();
    searchdateofjoiningfrom:string = ''; 
    searchdateofjoiningto:string = ''; 
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public drivermisService: DriverMISService,
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
    this.loadData();
    this.initSupplierType();
     this.initDriver();
     this.InitLocationHub();
    this.SubscribeUpdateService();
    this.resumeExportJobIfNeeded();
  }

  ngOnDestroy() {
    this.stopExportPolling();
    if (this.subscriptionName) {
      this.subscriptionName.unsubscribe();
    }
  }
  refresh() {
    this.clearExportJob();
    this.driver.setValue('');
    this.locationHub.setValue('');
    this.searchdateofjoiningfrom ='';
    this.searchdateofjoiningto='';
    this.supplierType.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  public SearchData()
  {
    this.loadData();    
  }

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

   public loadData() 
   
   {

      if(this.searchdateofjoiningfrom!==""){
              this.searchdateofjoiningfrom=moment(this.searchdateofjoiningfrom).format('MMM DD yyyy');
            }
            if(this.searchdateofjoiningto!==""){
              this.searchdateofjoiningto=moment(this.searchdateofjoiningto).format('MMM DD yyyy');
            }
      
      this.drivermisService.getTableData(this.driver.value,this.locationHub.value,this.searchdateofjoiningfrom, this.searchdateofjoiningto,this.supplierType.value,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
       
        // this.dataSource.forEach((ele)=>{
        //   if(ele.activationStatus===true){
        //     this.activeData="Active";
        //   }
        //   else{
        //     this.activeData="Deleted"
        //   }
        // })
       
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
  onContextMenu(event: MouseEvent, item: DriverMIS) {
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

//-------Driver-------
initDriver(){
  this._generalService.getDriverMIS().subscribe(
    data=>
    {
      this.DriverList=data;
      this.filteredDriverOptions = this.driver.valueChanges.pipe(
        startWith(""),
        map(value => this._filterDriver(value || ''))
      ); 
    });
}
private _filterDriver(value: string): any {
  const filterValue = value.toLowerCase();
  // if (!value || value.length < 3)
  //    {
  //       return [];   
  //     }
  return this.DriverList.filter(
    customer => 
    {
      return customer.driverName.toLowerCase().indexOf(filterValue)===0;
    }
  );
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
  // if (!value || value.length < 3)
  //    {
  //       return [];   
  //     }
  return this.OrganizationalEntitiesList.filter(
    customer => 
    {
      return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
    }
  );
}

  initSupplierType() {
    
    this._generalService.GetSupplierType().subscribe(
      data =>
      {
        this.SupplierTypeList = data;
       this.filteredSupplierTypeOptions = this.supplierType.valueChanges.pipe(
          startWith(""),
          map(value => this._filterSupplierType(value || ''))
        );
      },
      error =>
      {
       
      }
    );
  }
  private _filterSupplierType(value: string): any {
    const filterValue = value.toLowerCase();
    return this.SupplierTypeList?.filter(
      customer => 
      {
        return customer.supplierType.toLowerCase().indexOf(filterValue)===0;
      }
    );
    
  };

  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData();    } 
  }

  // drivermisDocument(row) {
  
  //   this.router.navigate([
  //     '/drivermisDocument',  
  //   ],
  //   {
  //     queryParams: {
  //       DriverMISID: row.drivermisID,
  //       DriverMISName: row.drivermisName,   
            
  //     }
  //   }); 
  // }

  // drivermisInventoryAssociation(row) {
  
  //   this.router.navigate([
  //     '/drivermisInventoryAssociation',  
  //   ],
  //   {
  //     queryParams: {
  //       DriverMISID: row.drivermisID,
  //       DriverMISName: row.drivermisName,   
            
  //     }
  //   }); 
  // }

  // DriverMISDrivingLicense(row) {
  //   this.router.navigate([
  //     '/drivermisDrivingLicense',  
  //   ],
  //   {
  //     queryParams: {
  //       DriverMISID: row.drivermisID,
  //       DriverMISName: row.drivermisName,       
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
          if(this.MessageArray[0]=="DriverMISCreate")
          {
            if(this.MessageArray[1]=="DriverMISView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'DriverMIS Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverMISUpdate")
          {
            if(this.MessageArray[1]=="DriverMISView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'DriverMIS Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverMISDelete")
          {
            if(this.MessageArray[1]=="DriverMISView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'DriverMIS Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverMISAll")
          {
            if(this.MessageArray[1]=="DriverMISView")
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

  SortingData(coloumName:any) {
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    if(coloumName.active==='hub')
    {
      coloumName.active="hub"
    }
    if(coloumName.active==='location')
    {
      coloumName.active="location"
    }
    this.drivermisService.getTableDataSort(this.driver.value,this.locationHub.value,this.searchdateofjoiningfrom,this.searchdateofjoiningto, this.supplierType.value,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  private buildExportFilterParams() {
    let dateFrom = this.searchdateofjoiningfrom;
    let dateTo = this.searchdateofjoiningto;
    if (dateFrom !== '') {
      dateFrom = moment(dateFrom).format('MMM DD yyyy');
    }
    if (dateTo !== '') {
      dateTo = moment(dateTo).format('MMM DD yyyy');
    }
    return {
      driverName: this.driver.value || '',
      location: this.locationHub.value || '',
      dateFrom: dateFrom || '',
      dateTo: dateTo || '',
      supplierType: this.supplierType.value || '',
      activationStatus: this.SearchActivationStatus
    };
  }

  startExportJob() {
    if (this.exportJobRunning) {
      this.showNotification('snackbar-danger', IN_FLIGHT_EXPORT_MESSAGE, 'bottom', 'center');
      return;
    }

    this.exportJobError = '';
    const filters = this.buildExportFilterParams();
    this.exportJobRunning = true;

    this.drivermisService.startExportJob(
      filters.driverName,
      filters.location,
      filters.dateFrom,
      filters.dateTo,
      filters.supplierType,
      filters.activationStatus
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
    if (!this.exportJobId || !this.drivermisService.isExportJobReady(this.exportJobStatus) || this.exportJobDownloading) {
      return;
    }

    this.exportJobDownloading = true;
    this.drivermisService.downloadExportJob(this.exportJobId).subscribe(
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

    this.drivermisService.cancelExportJob(this.exportJobId).subscribe(
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
    return !!this.exportJobId && this.drivermisService.isExportJobReady(this.exportJobStatus) && !this.exportJobDownloading;
  }

  isExportJobInProgress(): boolean {
    return this.exportJobRunning || this.drivermisService.isExportJobRunning(this.exportJobStatus);
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
    this.exportPollSub = this.drivermisService.pollExportJob(jobId).subscribe(
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

    this.drivermisService.getExportJobStatus(jobId).subscribe(
      (status: any) => {
        if (!status) {
          this.exportJobRunning = true;
          this.startExportPolling(jobId);
          return;
        }

        this.exportJobId = jobId;
        this.exportJobStatus = status;
        this.exportJobError = '';
        if (this.drivermisService.isExportJobRunning(status)) {
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
    const fileUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = preferredFileName || `DriverMIS_${moment().format('YYYYMMDD_HHmmss')}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(fileUrl);
    this.showNotification('snackbar-success', 'CSV downloaded', 'bottom', 'center');
  }
 
}




