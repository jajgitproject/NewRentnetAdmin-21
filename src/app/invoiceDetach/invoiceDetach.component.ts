// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
import { InvoiceDetachService } from './invoiceDetach.service';
import { InvoiceDetachModel } from './invoiceDetach.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
import { PackageDropDown } from '../package/packageDropDown.model';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-invoiceDetach',
  templateUrl: './invoiceDetach.component.html',
  styleUrls: ['./invoiceDetach.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class InvoiceDetachComponent implements OnInit {
  @Input() InvoiceID;
  displayedColumns = [
    'check',
    'DutySlipID',
    'CustomerName',
    'BranchName',
    'VerifyDuty',
    'InvoiceNumberWithPrefix',
    'PickUpDate',
    'Vehicle',
    'PackageType',
    'ReservationBillingInstruction',
    'ApplicableGST',
    'TotalAmountAfterGST',
    'DiscountPercentage',  
  ];

  dataSource: InvoiceDetachModel[] | null;
  employeeID: number;
  row: InvoiceDetachModel | null;
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

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public invoiceDetachService: InvoiceDetachService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public route:ActivatedRoute,
    private fb: FormBuilder,
    public router: Router,
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    this.route.queryParams.subscribe(paramsData =>{
      this.InvoiceNumberWithPrefix = paramsData.invoiceNumberWithPrefix;
    });
    if(this.InvoiceNumberWithPrefix === null || this.InvoiceNumberWithPrefix === undefined)
    {
      this.loadData();
    }
    else
    {
      this.loadDataForEdit();
    }
    this.InitCustomer();
    this.InitBranch();
    this.InitPackageTypes();
  }

  advanceTableForm:FormGroup = this.fb.group({
      invoiceID:[],
      invoiceType:[],
      listOfDuties:[[]],
      userID:[],
      action: []
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
    const filterValue = value.toLowerCase();
    return this.CustomerList.filter(
      data => 
      {
        return data.customerName.toLowerCase().includes(filterValue);
      }
    );
  }

  onCustomerSelected(customer: string) 
  {
    const selectedCustomer = this.CustomerList.find(
      data => data.customerName === customer);
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

  refresh() 
  {
    this.customerGroup.setValue('');
    this.customer.setValue('');
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
    this.SearchType = '';
    this.PageNumber = 0;
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
    this.invoiceDetachService.getTableData(this.customer.value,this.SearchBranch.value,this.SearchDutySlipID,this.SearchReservationID,this.SearchGSTType,this.SearchDutyFromDate,
      this.SearchDutyToDate,this.SearchPassengerName,this.SearchPassengerMobile,this.SearchPackageType.value,this.SearchPackage.value,
      this.SearchDSStatus,this.SearchBillingStatus,this.PageNumber).subscribe
      (
        data => 
        {
          this.dataSource = data;   
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  SortingData(coloumName: any) 
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
    this.invoiceDetachService.getTableDataSort(this.customer.value,this.SearchBranch.value,this.SearchDutySlipID,this.SearchReservationID,this.SearchGSTType,this.SearchDutyFromDate,
      this.SearchDutyToDate,this.SearchPassengerName,this.SearchPassengerMobile,this.SearchPackageType.value,this.SearchPackage.value,
      this.SearchDSStatus,this.SearchBillingStatus,this.PageNumber, coloumName.active, this.sortType).subscribe
    (
      data => 
        {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }

  //---------- Edit ----------

  public loadDataForEdit() 
  {
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
    this.invoiceDetachService.getTableDataForEdit(this.InvoiceNumberWithPrefix.replace("/","-"),this.customer.value,this.SearchBranch.value,this.SearchDutySlipID,this.SearchReservationID,this.SearchGSTType,this.SearchDutyFromDate,
      this.SearchDutyToDate,this.SearchPassengerName,this.SearchPassengerMobile,this.SearchPackageType.value,this.SearchPackage.value,
      this.SearchDSStatus,this.SearchBillingStatus,this.PageNumber).subscribe
      (
        data => 
        {
          this.dataSource = data;  
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  SortingDataForEdit(coloumName: any) 
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
    this.invoiceDetachService.getTableDataSortForEdit(this.InvoiceNumberWithPrefix.replace("/","-"),this.customer.value,this.SearchBranch.value,this.SearchDutySlipID,this.SearchReservationID,this.SearchGSTType,this.SearchDutyFromDate,
      this.SearchDutyToDate,this.SearchPassengerName,this.SearchPassengerMobile,this.SearchPackageType.value,this.SearchPackage.value,
      this.SearchDSStatus,this.SearchBillingStatus,this.PageNumber, coloumName.active, this.sortType).subscribe
    (
      data => 
        {
        this.dataSource = data;
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

  onContextMenu(event: MouseEvent, item: InvoiceDetachModel) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  NextCall() 
  {
    if (this.dataSource.length > 0) 
    {
      this.PageNumber++;
      this.loadData();
    }
  }

  PreviousCall() 
  {
    if (this.PageNumber > 0) 
    {
      this.PageNumber--;
      this.loadData();
    }
  }

  
  //---------- Check Box ----------
   checkAll(checkBoxValue: boolean) 
   {
    this.dataSource?.forEach((element: any) => {
      if(checkBoxValue) 
      {
        this.selectAll = true;
        element.checked = true;
        this.selectedInvoices.push(element);
      } 
      else 
      {
        this.selectAll = false;
        element.checked = false;
        const index = this.selectedInvoices.findIndex(x => x.dutySlipID === element.dutySlipID);
        this.selectedInvoices.splice(index, 1);
      }
    });
  }

  onCheckBox(checkBoxValue: boolean, data: any) 
  {
    if(checkBoxValue && this.dataSource.includes(data))
    {
      //this.selectedInvoices.push(data);
      const exists = this.selectedInvoices.some(x => x.dutySlipID === data.dutySlipID);
      if (!exists) 
      {
        this.selectedInvoices.push(data);
      }
      data.checked = true;
    } 
    else if(!checkBoxValue && this.dataSource.includes(data)) 
    {
      this.selectAll = false;
      data.checked = false;
      const index = this.selectedInvoices.findIndex(x => x.dutySlipID === data.dutySlipID);
      this.selectedInvoices.splice(index, 1);
    }
  }

  isIndeterminate() 
  {
    const checkedCount = this.dataSource.filter(r => r.checked).length;
    return checkedCount > 0 && checkedCount < this.dataSource.length;
  }

  //---------- Post ----------

  DetachDuty()
  {
    console.log(this.selectedInvoices)
    const duties: number[] = this.selectedInvoices.map(x => x.dutySlipID);
    this.advanceTableForm.patchValue({invoiceType:"InvoiceMultyDuty"});
    this.advanceTableForm.patchValue({invoiceID:this.InvoiceID});
    this.advanceTableForm.patchValue({action:"Detach"});
    this.advanceTableForm.patchValue({listOfDuties:duties});
    this.invoiceDetachService.add(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    { 
      const dutyList = response.result.replace("Success:", "").split(",").map(item => item.split("#")[1]).join(", ");
      Swal.fire({
          title: `Invoice Detached: ${dutyList}...!!!`,
          icon: 'success',
          confirmButtonText: 'Ok'
          }).then(result => {
            if (result.isConfirmed) 
            {
              const url = this.router.serializeUrl(
                this.router.createUrlTree(['/invoiceHome'])
              );
              window.open(this._generalService.FormURL + url, '_blank');
            }
          });
      this.refresh();
    },
    error =>
    {
      const errorMessage = error || 'Operation Failed.....!!!';
      Swal.fire({
          title: errorMessage,
          icon: 'error'
        });
    });
  }


  GenerateSingleInvoiceforSingleDuty()
  {
    const duties: number[] = this.selectedInvoices.map(x => x.dutySlipID);
    this.advanceTableForm.patchValue({invoiceID:0});
    this.advanceTableForm.patchValue({invoiceType:"InvoiceSingleDuty"});
    this.advanceTableForm.patchValue({action:"N/A"});
    this.advanceTableForm.patchValue({listOfDuties:duties});
    this.invoiceDetachService.add(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      const dutyList = response.result.replace("Success:", "").split(",").map(item => item.split("#")[1]).join(", ");
      Swal.fire({
          title: `Invoice Multy Duty Created with Duties: ${dutyList}...!!!`,
          icon: 'success',
          confirmButtonText: 'Ok'
          }).then(result => {
            if (result.isConfirmed) 
            {
              const url = this.router.serializeUrl(
                this.router.createUrlTree(['/invoiceHome'])
              );
              window.open(this._generalService.FormURL + url, '_blank');
            }
          });
      this.refresh();
    },
    error =>
    {
      const errorMessage = error || 'Operation Failed.....!!!';
      Swal.fire({
          title: errorMessage,
          icon: 'error'
        });
    });
  }


  GenerateSingleInvoiceforMultipleDuties()
  {
    const duties: number[] = this.selectedInvoices.map(x => x.dutySlipID);
    this.advanceTableForm.patchValue({invoiceID:0});
    this.advanceTableForm.patchValue({invoiceType:"InvoiceMultyDuty"});
    this.advanceTableForm.patchValue({action:"N/A"});
    this.advanceTableForm.patchValue({listOfDuties:duties});
    this.invoiceDetachService.add(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    { 
      const dutyList = response.result.replace("Success:", "").split(",").map(item => item.split("#")[1]).join(", ");
      Swal.fire({
          title: `Invoice Multy Duty Created with Duties: ${dutyList}...!!!`,
          icon: 'success',
          confirmButtonText: 'Ok'
            }).then(result => {
              if (result.isConfirmed) 
                {
                  const url = this.router.serializeUrl(
                    this.router.createUrlTree(['/invoiceHome'])
                  );
                  window.open(this._generalService.FormURL + url, '_blank');
                }
        });
      this.refresh();
    },
    error =>
    {
      const errorMessage = error || 'Operation Failed.....!!!';
      Swal.fire({
          title: errorMessage,
          icon: 'error'
        });
    });
  }

}




