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
  PageNumber: number = 0;
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

  SearchDutySlipID:number = 0;
  SearchReservationID:number = 0;
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
      this.invoiceBillDate = null;
      return;
    }

    this.invoiceAttachDetachService.getInvoiceBillDate(invoiceId).subscribe(
      response => {
        this.invoiceBillDate = response?.invoiceDate ? new Date(response.invoiceDate) : null;
      },
      () => {
        this.invoiceBillDate = null;
      }
    );
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

  private getCustomerNameForSearch(value: any): string {
    const raw = (value || '').toString().trim();
    if (!raw) {
      return raw;
    }
    return raw.split('##')[0].trim();
  }

  private getCustomerDisplayValue(data: CustomerDropDown): string {
    return data.customerName + '##' + (data.customerIdentityNumber || '');
  }

  private _filterCustomer(value: string): any {
    const filterValue = this.getCustomerNameForSearch(value).toLowerCase();
    return this.CustomerList.filter(
      data => 
      {
        const identity = (data.customerIdentityNumber || '').toString().toLowerCase();
        return data.customerName.toLowerCase().includes(filterValue)
          || identity.includes(filterValue)
          || this.getCustomerDisplayValue(data).toLowerCase().includes(filterValue);
      }
    );
  }

  onCustomerSelected(customer: string) 
  {
    const selectedCustomer = this.CustomerList.find(
      data => data.customerName === customer);
    this.selectedCustomerID = selectedCustomer?.customerID > 0 ? selectedCustomer.customerID : 0;
  }

  /** Prefer customer ID from autocomplete; fall back to encoded name search. */
  private getCustomerSearchParam(): string {
    const typed = (this.customer.value || '').trim();
    if (!typed) {
      this.selectedCustomerID = 0;
      return '';
    }
    if (this.selectedCustomerID > 0) {
      const selected = this.CustomerList?.find(c => c.customerID === this.selectedCustomerID);
      if (selected && selected.customerName === typed) {
        return `#${this.selectedCustomerID}`;
      }
    }
    this.selectedCustomerID = 0;
    return typed;
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
    this.SearchReservationID = 0;
    this.SearchDutySlipID = 0;
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
    this.PageNumber = 0;
    this.selectedInvoices = [];
    this.selectAll = false;
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
    this.PageNumber = 0;
    this.runSearchLoad();
  }
 
  public Filter() 
  {
    this.PageNumber = 0;
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
    if (this.InvoiceNumberWithPrefix) {
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
      this.SearchDSStatus,this.SearchBillingStatus,this.SearchVerifyDuty,this.SearchGoodForBilling,this.PageNumber).subscribe
      (
        data => 
        {
          this.dataSource = data;
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
      this.SearchDSStatus,this.SearchBillingStatus,this.SearchVerifyDuty,this.SearchGoodForBilling,this.PageNumber, coloumName.active, this.sortType).subscribe
    (
      data => 
        {
        this.dataSource = data;
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
    this.invoiceAttachDetachService.getTableDataForEdit(this.InvoiceNumberWithPrefix.replace("/","-"),this.getCustomerSearchParam(),this.SearchBranch.value,this.SearchDutySlipID,this.SearchReservationID,this.SearchGSTType,this.SearchDutyFromDate,
      this.SearchDutyToDate,this.SearchPassengerName,this.SearchPassengerMobile,this.SearchPackageType.value,this.SearchPackage.value,
      this.SearchDSStatus,this.SearchBillingStatus,this.PageNumber).subscribe
      (
        data => 
        {
          this.dataSource = data;
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
    this.invoiceAttachDetachService.getTableDataSortForEdit(this.InvoiceNumberWithPrefix.replace("/","-"),this.getCustomerSearchParam(),this.SearchBranch.value,this.SearchDutySlipID,this.SearchReservationID,this.SearchGSTType,this.SearchDutyFromDate,
      this.SearchDutyToDate,this.SearchPassengerName,this.SearchPassengerMobile,this.SearchPackageType.value,this.SearchPackage.value,
      this.SearchDSStatus,this.SearchBillingStatus,this.PageNumber, coloumName.active, this.sortType).subscribe
    (
      data => 
        {
        this.dataSource = data;
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

  NextCall() 
  {
    if (this.hasSearched && this.dataSource?.length > 0) 
    {
      this.PageNumber++;
      this.runSearchLoad();
    }
  }

  PreviousCall() 
  {
    if (this.hasSearched && this.PageNumber > 0) 
    {
      this.PageNumber--;
      this.runSearchLoad();
    }
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

  /** Match legacy Attach: allow select unless billing date is after bill date / today. */
  isRowSelectable(row: any): boolean {
    return !this.isDutyDateAfterBillDate(row);
  }

  getRowSelectTooltip(row: any): string {
    if (!this.isDutyDateAfterBillDate(row)) {
      return '';
    }
    if (this.InvoiceID && this.invoiceBillDate) {
      return 'Billing pickup date is after bill date';
    }
    return 'Billing pickup date is after today — cannot generate/attach yet';
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
    } 
    else if(!checkBoxValue && this.dataSource.includes(data)) 
    {
      this.selectAll = false;
      data.checked = false;
      const index = this.selectedInvoices.findIndex(x => x.dutySlipID === data.dutySlipID);
      if (index > -1) {
        this.selectedInvoices.splice(index, 1);
      }
    }
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
    const duties: number[] = this.selectedInvoices.map(x => x.dutySlipID);
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




