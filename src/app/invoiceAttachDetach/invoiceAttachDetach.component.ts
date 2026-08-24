// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModeOfPaymentDropDown } from '../supplierContract/modeOfPaymentDropDown.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { CustomerDropDown } from '../supplierCustomerFixedForAllPercentage/customerDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import moment from 'moment';
import { CustomerPersonDetailsDropDown } from '../passengerDetails/customerPersonDetailsDropDown.model';
import { GeoPointTypeDropDown } from '../geoPointType/geoPointTypeDropDown.model';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';
import { InvoiceAttachDetachService } from './invoiceAttachDetach.service';
import { InvoiceAttachDetachModel } from './invoiceAttachDetach.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
import { PackageDropDown } from '../package/packageDropDown.model';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceDetachService } from '../invoiceDetach/invoiceDetach.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import {
  confirmMissingGstnForBatch,
  extractApiErrorMessage
} from '../shared/customer-invoicing-gstn-confirm.util';
import {
  getCustomerDisplayValue,
  getCustomerDisplayLabel,
  getCustomerIdValue,
  getCustomerLabelFromAutocomplete,
  getCustomerNameFromAutocomplete,
  getCustomerTallyId,
  resolveCustomerFromAutocomplete
} from '../shared/customer-autocomplete.util';

@Component({
  standalone: false,
  selector: 'app-invoiceAttachDetach',
  templateUrl: './invoiceAttachDetach.component.html',
  styleUrls: ['./invoiceAttachDetach.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class InvoiceAttachDetachComponent implements OnInit {
  displayedColumns = [
    'check',
    'DutySlipID',
    'CustomerName',
    'CustomerState',
    'BranchName',
    'VerifyDuty',
    'PickUpDate',
    'Vehicle',
    'PackageType',
    'ReservationBillingInstruction',
    'ApplicableGST',
    'TotalAmountAfterGST',
  ];

  dataSource: InvoiceAttachDetachModel[] | null = null;
  hasSearched = false;
  employeeID: number;
  row: InvoiceAttachDetachModel | null;
  SearchName: string = '';
  IsLockedOut:boolean=true;
  SearchActivationStatus: boolean = true;
  search: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  dialogRef: MatDialogRef<any>;
  ActiveStatus: any;
  last: any;
  filteredCustomerOptions:Observable<CustomerDropDown[]>;
  public CustomerList?:CustomerDropDown[]=[];
  filteredOptions: Observable<CustomerGroupDropDown[]>;
  public customerGroupList?: CustomerGroupDropDown[] = [];

  searchCustomerGroup:string='';
  customerGroup : FormControl=new FormControl();
  searchCustomerName:string='';
  customer : FormControl=new FormControl();
  selectedCustomerID = 0;
  displayCustomer = (value: string) => getCustomerLabelFromAutocomplete(value);
  getCustomerDisplayValue = getCustomerDisplayValue;
  getCustomerDisplayLabel = getCustomerDisplayLabel;
  geoPointTypeID: any;
  customerGroupID: any;

  SearchCreditNoteNumber: string = '';
  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  filteredBranchOptions: Observable<ModeOfPaymentDropDown[]>;
  SearchBranch: FormControl=new FormControl();

  SearchDutyFromDate: string = '';
  startDate : FormControl = new FormControl();

  SearchDutyToDate: string = '';
  endDate : FormControl = new FormControl();
  SearchType: string = '';

  public PackageTypeList?: PackageTypeDropDown[] = [];
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;
  packageTypeID: any;

  public PackageList?: PackageDropDown[] = [];
  filteredPackageOptions: Observable<PackageDropDown[]>;

  SearchDutySlipID:string = '';
  SearchReservationID:string = '';
  SearchGSTType:string = '';
  SearchPassengerName:string = '';
  SearchPassengerMobile:string = '';
  SearchPackageType:FormControl = new FormControl();
  SearchPackage:FormControl = new FormControl();
  SearchDSStatus:string = '';
  SearchBillingStatus:boolean;
  InvoiceNumberWithPrefix: string = '';
  
  selectAll:boolean=false;
  selectedInvoices: any[] = []; 
  InvoiceID: any;
  invoiceBillDate: Date | null = null;
  invoiceCustomerName: string = '';
  invoiceType: string = '';
  hasAttachedDuties = false;
  invoiceAnchorGstNumbers: string[] = [];
  hasMixedInvoiceGst = false;
  activeGstKey: string | null = null;
  groupedDutySections: any[] = [];
  readonly noGstConfiguredKey = '(No GST configured)';
  SearchVerifyDuty:boolean;
  SearchGoodForBilling:boolean;

  singleDutyGenerateInProgress = false;
  multiDutyGenerateInProgress = false;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public invoiceAttachDetachService: InvoiceAttachDetachService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public route:ActivatedRoute,
    private fb: FormBuilder,
    public invoiceDetachService: InvoiceDetachService,
    public router: Router,
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
 ngOnInit() {
  this.route.queryParams.subscribe(paramsData => {
    this.InvoiceNumberWithPrefix = paramsData.invoiceNumberWithPrefix;
    this.InvoiceID = paramsData.invoiceID;

    if (this.InvoiceID) {
      this.loadInvoiceBillDate();
    }
  });

  this.InitCustomer();
  this.InitBranch();
  this.InitPackageTypes();
}

  loadInvoiceBillDate() {
    const invoiceId = Number(this.InvoiceID);
    if (!invoiceId || invoiceId <= 0) {
      this.resetInvoiceGstContext();
      return;
    }

    this.invoiceAttachDetachService.getInvoiceBillDate(invoiceId).subscribe(
      response => {
        this.invoiceBillDate = response?.invoiceDate ? new Date(response.invoiceDate) : null;
        this.invoiceCustomerName = response?.invoiceCustomerName || '';
        this.invoiceType = response?.invoiceType || '';
        this.hasAttachedDuties = !!response?.hasAttachedDuties;
        this.invoiceAnchorGstNumbers = response?.distinctInvoiceGstNumbers || [];
        this.hasMixedInvoiceGst = !!response?.hasMixedGst;
        this.applyInvoiceGstAnchor();
        this.buildGroupedDutySections();
      },
      () => {
        this.resetInvoiceGstContext();
      }
    );
  }

  normalizeGstKey(gstNumber?: string): string {
    if (!gstNumber || !String(gstNumber).trim()) {
      return this.noGstConfiguredKey;
    }
    return String(gstNumber).trim().toUpperCase();
  }

  resetInvoiceGstContext() {
    this.invoiceBillDate = null;
    this.invoiceCustomerName = '';
    this.invoiceType = '';
    this.hasAttachedDuties = false;
    this.invoiceAnchorGstNumbers = [];
    this.hasMixedInvoiceGst = false;
    this.activeGstKey = null;
  }

  isEmptyInvoiceGeneral(): boolean {
    return this.invoiceType === 'InvoiceGeneral' && !this.hasAttachedDuties;
  }

  applyInvoiceGstAnchor() {
    if (!this.InvoiceID) {
      return;
    }

    if (this.invoiceAnchorGstNumbers.length === 1) {
      this.activeGstKey = this.normalizeGstKey(this.invoiceAnchorGstNumbers[0]);
      return;
    }

    if (this.hasMixedInvoiceGst) {
      this.activeGstKey = null;
      return;
    }

    if (this.isEmptyInvoiceGeneral()) {
      this.activeGstKey = null;
      return;
    }

    this.activeGstKey = this.noGstConfiguredKey;
  }

  buildGroupedDutySections() {
    if (!this.dataSource || !this.dataSource.length) {
      this.groupedDutySections = [];
      return;
    }

    const groups = new Map<string, any[]>();
    this.dataSource.forEach((row: any) => {
      const key = this.normalizeGstKey(row.invoiceGstNumber);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(row);
    });

    this.groupedDutySections = Array.from(groups.entries())
      .sort((a, b) => {
        if (a[0] === this.noGstConfiguredKey) {
          return 1;
        }
        if (b[0] === this.noGstConfiguredKey) {
          return -1;
        }
        return a[0].localeCompare(b[0]);
      })
      .map(([gstKey, duties]) => ({
        gstKey,
        gstLabel: gstKey === this.noGstConfiguredKey ? gstKey : gstKey,
        duties,
        dutyCount: duties.length,
        selectable: this.isGroupSelectable(gstKey),
        customerState: duties[0]?.customerState || ''
      }));
  }

  isGroupSelectable(gstKey: string): boolean {
    if (this.activeGstKey === null || this.activeGstKey === undefined) {
      return true;
    }
    return gstKey === this.activeGstKey;
  }

  isSameGstGroup(row: any): boolean {
    return this.isGroupSelectable(this.normalizeGstKey(row?.invoiceGstNumber));
  }

  getGstSelectionBanner(): string {
    if (this.hasMixedInvoiceGst && this.InvoiceID) {
      return 'This invoice already has multiple GSTINs on Finance Dashboard — contact billing. You may only attach duties from one GSTIN group at a time.';
    }
    if (this.InvoiceID && this.invoiceAnchorGstNumbers.length === 1) {
      return `This invoice uses GSTIN ${this.invoiceAnchorGstNumbers[0]} — only matching duties can be attached.`;
    }
    if (this.activeGstKey && this.activeGstKey !== this.noGstConfiguredKey) {
      return `Selected GSTIN group: ${this.activeGstKey}. Duties from other GSTIN groups cannot be selected together.`;
    }
    if (this.activeGstKey === this.noGstConfiguredKey) {
      return 'Selected group: duties with no GST configured. Mixed GSTINs cannot be billed together.';
    }
    if (this.isEmptyInvoiceGeneral()) {
      return 'Select duties from one GSTIN group only. Mixed GSTINs cannot be billed together.';
    }
    return 'Select duties from one GSTIN group only. Mixed GSTINs cannot be billed together on a Multi-Duty invoice.';
  }

  getGroupHeaderLabel(section: any): string {
    const countLabel = `${section.dutyCount} ${section.dutyCount === 1 ? 'duty' : 'duties'}`;
    if (section.gstKey === this.noGstConfiguredKey) {
      return `${section.gstLabel} (${countLabel})`;
    }
    const stateSuffix = section.customerState ? ` — ${section.customerState}` : '';
    return `${section.gstLabel}${stateSuffix} (${countLabel})`;
  }

  advanceTableForm:FormGroup = this.fb.group({
        invoiceID:[],
        invoiceType:[],
        listOfDuties:[[]],
        userID:[],
        action: [],
        acknowledgeMissingGstnDutySlipIds: [[]]
      })
      
  //---------- Customer Group ----------
  InitCustomerGroup()
  {
    this._generalService.getCustomerGroup().subscribe(
    data=>{
      this.customerGroupList=data;
      this.filteredOptions = this.customerGroup.valueChanges.pipe(
        startWith(""),
        map(value => this._filterCustomerGroup(value || ''))
      );
    })
  }
  private _filterCustomerGroup(value: string): any {
    const filterValue = value.toLowerCase();
    return this.customerGroupList.filter(
      customer => 
      {
        return customer.customerGroup.toLowerCase().includes(filterValue);
      }
    );    
  };

  onCustomerGroupSelected(customerGroup: string) {
    const selectedCustomerGroup = this.customerGroupList.find(
      data => data.customerGroup === customerGroup
    );
  
    if (selectedCustomerGroup) {
      this.getGroupID(selectedCustomerGroup.customerGroupID);
    }
  }

  getGroupID(customerGroupID: any) {
    this.customerGroupID=customerGroupID;
    this.InitCustomer();
  }
  

  //-------Customer-------
  InitCustomer()
  {
    this._generalService.getCustomers().subscribe(
    data=>
    {
      this.CustomerList=data;
      this.filteredCustomerOptions = this.customer.valueChanges.pipe(
        startWith(""),
        map(value => this._filterCustomer(value || ''))
      ); 
    });
  }

  private _filterCustomer(value: string): any {
    const raw = (value || '').toLowerCase();
    const filterValue = getCustomerNameFromAutocomplete(value).toLowerCase();
    return this.CustomerList.filter(
      data => 
      {
        const name = (data.customerName || '').toLowerCase();
        const tally = getCustomerTallyId(data).toLowerCase();
        const customerId = getCustomerIdValue(data).toLowerCase();
        const label = getCustomerDisplayLabel(data).toLowerCase();
        return name.includes(filterValue)
          || name.includes(raw)
          || tally.includes(raw)
          || customerId.includes(raw)
          || label.includes(raw)
          || getCustomerDisplayValue(data).toLowerCase().includes(raw);
      }
    );
  }

  onCustomerSelected(customerValue: string): void {
    const selected = resolveCustomerFromAutocomplete(customerValue, this.CustomerList);
    this.selectedCustomerID = selected?.customerID > 0 ? selected.customerID : 0;
  }

  /** Prefer customer ID from autocomplete; fall back to encoded name search. */
  private getCustomerSearchParam(): string {
    const typed = (this.customer.value || '').trim();
    if (!typed) {
      this.selectedCustomerID = 0;
      return '';
    }

    const resolved = resolveCustomerFromAutocomplete(typed, this.CustomerList);
    if (resolved?.customerID > 0) {
      this.selectedCustomerID = resolved.customerID;
      return `#${resolved.customerID}`;
    }

    if (this.selectedCustomerID > 0) {
      const selected = this.CustomerList?.find(c => c.customerID === this.selectedCustomerID);
      const namePart = getCustomerNameFromAutocomplete(typed);
      if (selected && selected.customerName === namePart) {
        return `#${this.selectedCustomerID}`;
      }
    }

    this.selectedCustomerID = 0;
    return getCustomerNameFromAutocomplete(typed);
  }

  //---------- Branch ----------
  InitBranch()
  {
    this._generalService.GetOrganizationalBranch().subscribe(
    data=>{
      this.OrganizationalEntityList=data;
      this.filteredBranchOptions = this.SearchBranch.valueChanges.pipe(
        startWith(""),
        map(value => this._filterBranch(value || ''))
      );
    })
  }
  private _filterBranch(value: string): any {
    const filterValue = value.toLowerCase();
    return this.OrganizationalEntityList.filter(
      customer => 
      {
        return customer.organizationalEntityName.toLowerCase().includes(filterValue);
      });
  };
  OnBranchSelect(selectedBranch: string)
  {
    const BranchName = this.OrganizationalEntityList.find(
      data => data.organizationalEntityName === selectedBranch
    );
  }

  //---------- Package Type ----------
  InitPackageTypes()
  {
    this._generalService.GetPackgeType().subscribe(
    data=>
    {
      this.PackageTypeList=data;  
      this.filteredPackageTypeOptions = this.SearchPackageType.valueChanges.pipe(
        startWith(""),
        map(value => this._filterPackageTypes(value || ''))
      ); 
    });
  } 
  private _filterPackageTypes(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PackageTypeList.filter(
      customer => 
      {
        return customer.packageType.toLowerCase().includes(filterValue);
      }
    );
  }
  onPackageTypeSelected(selectedPackageType: string) 
  {
    const selectedPackage = this.PackageTypeList.find(
      data => data.packageType === selectedPackageType
    ); 
    if (selectedPackageType) 
    {
      this.getTitles(selectedPackage.packageTypeID);
    }
  }
  getTitles(packageTypeID: any) 
  {
    this.packageTypeID=packageTypeID;
    this.InitPackage()
  }

  //------------ Package -----------------
  InitPackage()
  {
    this._generalService.getPackageForSettleRate(this.packageTypeID).subscribe(
    data=>
    {
      this.PackageList=data;
      this.filteredPackageOptions = this.SearchPackage.valueChanges.pipe(
        startWith(""),
        map(value => this._filterPackage(value || ''))
      ); 
    });
  }
  private _filterPackage(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PackageList.filter(
      customer => 
      {
        return customer.package.toLowerCase().includes(filterValue);
      }
    );
  }
  onPackageSelected(selectedPackage: string) 
  {
    const selectedPac = this.PackageList.find(
      data => data.package === selectedPackage
    );
  }

  refresh(reload = false) 
  {
    this.customerGroup.setValue('');
    this.customer.setValue('');
    this.selectedCustomerID = 0;
    this.SearchCreditNoteNumber = '';
    this.SearchBranch.setValue('');
    this.SearchDutyFromDate = '';
    this.SearchDutyToDate = '';
    this.SearchReservationID = '';
    this.SearchDutySlipID = '';
    this.SearchGSTType = '';
    this.SearchPassengerName = '';
    this.SearchPassengerMobile = '';
    this.SearchPackageType.setValue('');
    this.SearchPackage.setValue('');
    this.SearchDSStatus = '';
    this.SearchBillingStatus = null;
    this.SearchVerifyDuty = null;
    this.SearchGoodForBilling = null;
    this.SearchType = '';
    this.selectedInvoices = [];
    this.selectAll = false;
    if (this.InvoiceID) {
      this.applyInvoiceGstAnchor();
    } else {
      this.activeGstKey = null;
    }
    if (reload) {
      this.hasSearched = true;
      this.runSearchLoad();
    } else {
      this.hasSearched = false;
      this.dataSource = null;
    }
  }

  public SearchData() 
  {
    this.runSearchLoad();
  }
 
  public Filter() 
  {
    this.runSearchLoad();
  }

  onBackPress(event) 
  {
    if (event.keyCode === 8 && this.hasSearched) 
    {
      this.runSearchLoad();
    }
  }

  private runSearchLoad() {
    if (this.InvoiceID || this.InvoiceNumberWithPrefix) {
      this.loadDataForEdit();
    } else {
      this.loadData();
    }
  }

  /** Rematch checkbox state from selectedInvoices after paging/search. */
  rematchCheckedFromSelection() {
    if (!this.dataSource) {
      return;
    }
    const selectedIds = new Set((this.selectedInvoices || []).map(x => x.dutySlipID));
    this.dataSource.forEach((row: any) => {
      row.checked = selectedIds.has(row.dutySlipID);
    });
    const selectable = this.dataSource.filter(r => this.isRowSelectable(r));
    this.selectAll = selectable.length > 0 && selectable.every(r => r.checked);
  }

  public loadData() 
  {
    this.hasSearched = true;
    if(this.SearchDutyFromDate!=="")
    {
      this.SearchDutyFromDate=moment(this.SearchDutyFromDate).format('yyyy-MM-DD');
    }
    if(this.SearchDutyToDate!=="")
    {
      this.SearchDutyToDate=moment(this.SearchDutyToDate).format('yyyy-MM-DD');
    }
    if( this.SearchPackage.value && this.SearchPackage.value.includes('/'))
    {
      this.SearchPackage.setValue(this.SearchPackage.value.replace("/","-"));
    }
    this.invoiceAttachDetachService.getTableData(this.getCustomerSearchParam(),this.SearchBranch.value,this.SearchDutySlipID,this.SearchReservationID,this.SearchGSTType,this.SearchDutyFromDate,
      this.SearchDutyToDate,this.SearchPassengerName,this.SearchPassengerMobile,this.SearchPackageType.value,this.SearchPackage.value,
      this.SearchDSStatus,this.SearchBillingStatus,this.SearchVerifyDuty,this.SearchGoodForBilling,0).subscribe
      (
        data => 
        {
          this.dataSource = data;
          this.buildGroupedDutySections();
          this.rematchCheckedFromSelection();
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  SortingData(coloumName: any) 
  {
    if (!this.hasSearched) {
      return;
    }
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
    this.invoiceAttachDetachService.getTableDataSort(this.getCustomerSearchParam(),this.SearchBranch.value,this.SearchDutySlipID,this.SearchReservationID,this.SearchGSTType,this.SearchDutyFromDate,
      this.SearchDutyToDate,this.SearchPassengerName,this.SearchPassengerMobile,this.SearchPackageType.value,this.SearchPackage.value,
      this.SearchDSStatus,this.SearchBillingStatus,this.SearchVerifyDuty,this.SearchGoodForBilling,0, coloumName.active, this.sortType).subscribe
    (
      data => 
        {
        this.dataSource = data;
        this.buildGroupedDutySections();
        this.rematchCheckedFromSelection();
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }

  //---------- Edit ----------

  public loadDataForEdit() 
  {
    this.hasSearched = true;
    if(this.SearchDutyFromDate!=="")
    {
      this.SearchDutyFromDate=moment(this.SearchDutyFromDate).format('yyyy-MM-DD');
    }
    if(this.SearchDutyToDate!=="")
    {
      this.SearchDutyToDate=moment(this.SearchDutyToDate).format('yyyy-MM-DD');
    }
    if( this.SearchPackage.value && this.SearchPackage.value.includes('/'))
    {
      this.SearchPackage.setValue(this.SearchPackage.value.replace("/","-"));
    }
    this.invoiceAttachDetachService.getTableDataForEdit(Number(this.InvoiceID) || 0, (this.InvoiceNumberWithPrefix || '').replace("/","-"),this.getCustomerSearchParam(),this.SearchBranch.value,this.SearchDutySlipID,this.SearchReservationID,this.SearchGSTType,this.SearchDutyFromDate,
      this.SearchDutyToDate,this.SearchPassengerName,this.SearchPassengerMobile,this.SearchPackageType.value,this.SearchPackage.value,
      this.SearchDSStatus,this.SearchBillingStatus,0).subscribe
      (
        data => 
        {
          this.dataSource = data;
          this.buildGroupedDutySections();
          this.rematchCheckedFromSelection();
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  SortingDataForEdit(coloumName: any) 
  {
    if (!this.hasSearched) {
      return;
    }
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
    this.invoiceAttachDetachService.getTableDataSortForEdit(Number(this.InvoiceID) || 0, (this.InvoiceNumberWithPrefix || '').replace("/","-"),this.getCustomerSearchParam(),this.SearchBranch.value,this.SearchDutySlipID,this.SearchReservationID,this.SearchGSTType,this.SearchDutyFromDate,
      this.SearchDutyToDate,this.SearchPassengerName,this.SearchPassengerMobile,this.SearchPackageType.value,this.SearchPackage.value,
      this.SearchDSStatus,this.SearchBillingStatus,0, coloumName.active, this.sortType).subscribe
    (
      data => 
        {
        this.dataSource = data;
        this.buildGroupedDutySections();
        this.rematchCheckedFromSelection();
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
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

  onContextMenu(event: MouseEvent, item: InvoiceAttachDetachModel) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  private isTrueValue(value: any): boolean {
    return value === true || value === 'true' || value === 'True' || value === 1 || value === '1';
  }

  formatYesNo(value: any): string {
    return this.isTrueValue(value) ? 'Yes' : 'No';
  }

  private isDutyDateAfterBillDate(row: any): boolean {
    const dutyDateValue = row?.pickUpDateForBilling || row?.pickUpDate;
    if (!dutyDateValue) {
      return false;
    }

    const dutyDate = new Date(dutyDateValue);
    dutyDate.setHours(0, 0, 0, 0);

    if (this.InvoiceID && this.invoiceBillDate) {
      const billDate = new Date(this.invoiceBillDate);
      billDate.setHours(0, 0, 0, 0);
      return dutyDate > billDate;
    }

    if (!this.InvoiceID) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dutyDate > today;
    }

    return false;
  }

  isRowBlockedByBillDate(row: any): boolean {
    return this.isDutyDateAfterBillDate(row);
  }

  /** Match legacy Attach: allow select unless billing date is after bill date / today, and GST group matches. */
  isRowSelectable(row: any): boolean {
    return !this.isDutyDateAfterBillDate(row) && this.isSameGstGroup(row);
  }

  getRowSelectTooltip(row: any): string {
    if (this.isDutyDateAfterBillDate(row)) {
      if (this.InvoiceID && this.invoiceBillDate) {
        return 'Billing pickup date is after bill date';
      }
      return 'Billing pickup date is after today — cannot generate/attach yet';
    }
    if (!this.isSameGstGroup(row)) {
      if (this.InvoiceID && this.invoiceAnchorGstNumbers.length === 1) {
        return `This duty has a different GSTIN than invoice ${this.invoiceAnchorGstNumbers[0]}`;
      }
      if (this.activeGstKey) {
        return `This duty belongs to a different GSTIN group than ${this.activeGstKey}`;
      }
      return 'Select duties from one GSTIN group only';
    }
    return '';
  }

  private syncActiveGstKeyFromSelection() {
    if (this.selectedInvoices.length === 0) {
      if (!this.InvoiceID || this.hasMixedInvoiceGst) {
        this.activeGstKey = null;
      } else {
        this.applyInvoiceGstAnchor();
      }
      this.buildGroupedDutySections();
      return;
    }

    if (this.activeGstKey === null || this.activeGstKey === undefined) {
      this.activeGstKey = this.normalizeGstKey(this.selectedInvoices[0]?.invoiceGstNumber);
      this.buildGroupedDutySections();
    }
  }

  
  //---------- Check Box ----------
   checkAll(checkBoxValue: boolean) 
   {
    this.dataSource?.forEach((element: any) => {
      if (!this.isRowSelectable(element)) {
        element.checked = false;
        const blockedIndex = this.selectedInvoices.findIndex(x => x.dutySlipID === element.dutySlipID);
        if (blockedIndex > -1) {
          this.selectedInvoices.splice(blockedIndex, 1);
        }
        return;
      }

      if(checkBoxValue) 
      {
        this.selectAll = true;
        element.checked = true;
        const exists = this.selectedInvoices.some(x => x.dutySlipID === element.dutySlipID);
        if (!exists) {
          this.selectedInvoices.push(element);
        }
      } 
      else 
      {
        this.selectAll = false;
        element.checked = false;
        const index = this.selectedInvoices.findIndex(x => x.dutySlipID === element.dutySlipID);
        if (index > -1) {
          this.selectedInvoices.splice(index, 1);
        }
      }
    });
  }

  onCheckBox(checkBoxValue: boolean, data: any) 
  {
    if (!this.isRowSelectable(data)) {
      data.checked = false;
      return;
    }

    if(checkBoxValue && this.dataSource.includes(data))
    {
      const exists = this.selectedInvoices.some(x => x.dutySlipID === data.dutySlipID);
      if (!exists) {
        this.selectedInvoices.push(data);
      }
      data.checked = true;
      this.syncActiveGstKeyFromSelection();
      this.syncSelectAllState();
    } 
    else if(!checkBoxValue && this.dataSource.includes(data)) 
    {
      this.selectAll = false;
      data.checked = false;
      const index = this.selectedInvoices.findIndex(x => x.dutySlipID === data.dutySlipID);
      if (index > -1) {
        this.selectedInvoices.splice(index, 1);
      }
      this.syncActiveGstKeyFromSelection();
    }
  }

  checkAllInGroup(section: any, checkBoxValue: boolean) {
    if (!section?.selectable) {
      return;
    }

    section.duties.forEach((element: any) => {
      if (!this.isRowSelectable(element)) {
        element.checked = false;
        const blockedIndex = this.selectedInvoices.findIndex(x => x.dutySlipID === element.dutySlipID);
        if (blockedIndex > -1) {
          this.selectedInvoices.splice(blockedIndex, 1);
        }
        return;
      }

      if (checkBoxValue) {
        element.checked = true;
        const exists = this.selectedInvoices.some(x => x.dutySlipID === element.dutySlipID);
        if (!exists) {
          this.selectedInvoices.push(element);
        }
      } else {
        element.checked = false;
        const index = this.selectedInvoices.findIndex(x => x.dutySlipID === element.dutySlipID);
        if (index > -1) {
          this.selectedInvoices.splice(index, 1);
        }
      }
    });

    this.syncActiveGstKeyFromSelection();
    this.syncSelectAllState();
  }

  isGroupIndeterminate(section: any): boolean {
    const selectableRows = (section?.duties || []).filter(r => this.isRowSelectable(r));
    const checkedCount = selectableRows.filter(r => r.checked).length;
    return checkedCount > 0 && checkedCount < selectableRows.length;
  }

  isGroupFullySelected(section: any): boolean {
    const selectableRows = (section?.duties || []).filter(r => this.isRowSelectable(r));
    return selectableRows.length > 0 && selectableRows.every(r => r.checked);
  }

  private syncSelectAllState() {
    const selectableRows = this.dataSource?.filter(r => this.isRowSelectable(r)) || [];
    this.selectAll = selectableRows.length > 0 && selectableRows.every(r => r.checked);
  }

  isIndeterminate()
  {
    const selectableRows = this.dataSource?.filter(r => this.isRowSelectable(r)) || [];
    const checkedCount = selectableRows.filter(r => r.checked).length;
    return checkedCount > 0 && checkedCount < selectableRows.length;
  }

  //---------- Post ----------
  AttachDuty()
  {
    if (!this.selectedInvoices || this.selectedInvoices.length === 0) {
      Swal.fire({
        title: 'No Duties Selected!',
        text: 'Please select at least one duty before attach.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }
    if (this.invoiceType === 'InvoiceSingleDuty' && !this.hasAttachedDuties) {
      Swal.fire({
        title: 'No duty on this invoice',
        text: 'This Single Duty invoice has no duty attached yet. After it already has one duty, attaching another converts InvoiceType to InvoiceMultyDuty.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }
    const duties: number[] = [...new Set(this.selectedInvoices.map(x => x.dutySlipID))];
    this.advanceTableForm.patchValue({invoiceID:this.InvoiceID});
    this.advanceTableForm.patchValue({invoiceType:"InvoiceMultyDuty"});
    this.advanceTableForm.patchValue({action:"Attach"});
    this.advanceTableForm.patchValue({listOfDuties:duties});
    this.invoiceDetachService.add(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    { 
      const dutyList = response.result.replace("Success:", "").split(",").map(item => item.split("#")[1]).join(", ");
      Swal.fire({
          title: `Duties linked to invoice ${dutyList}`,
          text: 'Duty calculations are linked only. General bill line items and header amounts are not changed.',
          icon: 'success',
          confirmButtonText: 'Ok'
          }).then(result => {
            if (result.isConfirmed) 
            {
              window.location.reload();
            }
          });
      this.refresh();
    },
    error =>
    {
      const errorMessage = error || 'Attach failed. Please try again.';
      Swal.fire({
          title: errorMessage,
          icon: 'error'
          });
    });
  }


  async GenerateSingleInvoiceforSingleDuty()
  {
    if (this.singleDutyGenerateInProgress) {
      return;
    }

    if (!this.selectedInvoices || this.selectedInvoices.length === 0) {
    Swal.fire({
      title: 'No Duties Selected!',
      text: 'Please select at least one duty before generating an invoice.',
      icon: 'warning',
      confirmButtonText: 'Ok'
    });
    return;
  }
    const duties: number[] = this.selectedInvoices.map(x => x.dutySlipID);
    this.singleDutyGenerateInProgress = true;

    try {
      const check = await firstValueFrom(
        this.invoiceDetachService.checkCustomerInvoicingGstnBatch(duties)
      );
      const confirmation = await confirmMissingGstnForBatch(check, duties);
      if (!confirmation.proceed) {
        return;
      }

      this.advanceTableForm.patchValue({ invoiceID: 0 });
      this.advanceTableForm.patchValue({ invoiceType: 'InvoiceSingleDuty' });
      this.advanceTableForm.patchValue({ action: 'N/A' });
      this.advanceTableForm.patchValue({ listOfDuties: confirmation.dutiesToGenerate });
      this.advanceTableForm.patchValue({
        acknowledgeMissingGstnDutySlipIds: confirmation.acknowledgeMissingGstnDutySlipIds
      });

      const response = await firstValueFrom(
        this.invoiceDetachService.add(this.advanceTableForm.getRawValue())
      );
      const parsed = this.parseSingleDutyBatchResult(response?.result || '');
      const successLines = parsed.successes.map(item =>
        `Duty ${item.dutySlipId}: ${item.invoiceNumber} (${item.action})`
      ).join('<br/>');
      const failLines = parsed.failures.map(item =>
        `Duty ${item.dutySlipId}: ${item.message}`
      ).join('<br/>');

      if (parsed.successes.length === 0) {
        Swal.fire({
          title: 'Invoice generation failed',
          html: failLines || 'Operation Failed.....!!!',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        return;
      }

      const partial = parsed.failures.length > 0;
      Swal.fire({
          title: partial
            ? `${parsed.successes.length} invoice(s) created, ${parsed.failures.length} failed`
            : `${parsed.successes.length} Single Duty invoice(s) created`,
          html: successLines + (partial ? `<br/><br/><strong>Failed:</strong><br/>${failLines}` : ''),
          icon: partial ? 'warning' : 'success',
          confirmButtonText: 'Ok'
          }).then(() => {
            this.selectedInvoices = [];
            this.selectAll = false;
            this.refresh(true);
          });
    } catch (error) {
      Swal.fire({
        title: extractApiErrorMessage(error),
        icon: 'error'
      });
    } finally {
      this.singleDutyGenerateInProgress = false;
    }
  }

  private parseSingleDutyBatchResult(result: string): {
    successes: { invoiceId: string; invoiceNumber: string; dutySlipId: string; action: string }[];
    failures: { dutySlipId: string; message: string }[];
  } {
    const successes: { invoiceId: string; invoiceNumber: string; dutySlipId: string; action: string }[] = [];
    const failures: { dutySlipId: string; message: string }[] = [];

    if (!result || !result.startsWith('Success:')) {
      return { successes, failures };
    }

    const body = result.substring('Success:'.length);
    const segments = body.split('|Failed:');
    const successPart = segments[0] || '';
    const failPart = segments[1] || '';

    successPart.split(',').filter(x => x.trim()).forEach(entry => {
      const parts = entry.split('#');
      if (parts.length >= 2) {
        successes.push({
          invoiceId: parts[0],
          invoiceNumber: parts[1],
          dutySlipId: parts.length >= 3 ? parts[2] : '',
          action: parts.length >= 4 ? parts[3] : 'Created'
        });
      }
    });

    failPart.split(',').filter(x => x.trim()).forEach(entry => {
      const hashIndex = entry.indexOf('#');
      if (hashIndex > 0) {
        failures.push({
          dutySlipId: entry.substring(0, hashIndex),
          message: entry.substring(hashIndex + 1)
        });
      }
    });

    return { successes, failures };
  }


  GenerateSingleInvoiceforMultipleDuties()
  {
    if (this.multiDutyGenerateInProgress) {
      return;
    }

    if (!this.selectedInvoices || this.selectedInvoices.length === 0) {
    Swal.fire({
      title: 'No Duties Selected!',
      text: 'Please select at least one duty before generating an invoice.',
      icon: 'warning',
      confirmButtonText: 'Ok'
    });
    return; // stop execution
  }
    if (this.selectedInvoices.length < 2) {
      Swal.fire({
        title: 'Select at least two duties',
        text: 'Multy Duty invoice requires 2 or more calculated duties. Use Single Duty generate for one duty.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }
    this.multiDutyGenerateInProgress = true;
    const duties: number[] = this.selectedInvoices.map(x => x.dutySlipID);
    this.advanceTableForm.patchValue({invoiceID:0});
    this.advanceTableForm.patchValue({invoiceType:"InvoiceMultyDuty"});
    this.advanceTableForm.patchValue({action:"N/A"});
    this.advanceTableForm.patchValue({listOfDuties:duties});
    this.invoiceDetachService.add(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    { 
      this.multiDutyGenerateInProgress = false;
      const dutyList = response.result.replace("Success:", "").split(",").map(item => item.split("#")[1]).join(", ");
      const invoiceNo = response.result.replace("Success:", "").split(",").map(item => item.split("#")[0]).join(", ");
      console.log('Duty List:', dutyList,invoiceNo); // Log the duty list for debugging
      Swal.fire({
          title: `Invoice Multy Duty Created with Duties: ${dutyList}...!!!`,
          icon: 'success',
          confirmButtonText: 'Ok'
          }).then(result => {
            if (result.isConfirmed) 
            {
             const url = this.router.serializeUrl(
      this.router.createUrlTree(
        ['/invoiceAttachDetach'],
        {
          queryParams: {
            invoiceNumberWithPrefix: dutyList,
            invoiceID: invoiceNo
          }
        }
      )
    );

    window.location.href = this._generalService.FormURL + url;
            }
          });
      //this.refresh();
    },
    error =>
    {
      this.multiDutyGenerateInProgress = false;
      const errorMessage = error?.error?.message || error || 'Operation Failed.....!!!';
      Swal.fire({
          title: errorMessage,
          icon: 'error'
          });
    });
  }

}




