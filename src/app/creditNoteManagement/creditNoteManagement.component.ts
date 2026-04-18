// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
import { FormControl } from '@angular/forms';
import { ModeOfPaymentDropDown } from '../supplierContract/modeOfPaymentDropDown.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { CustomerDropDown } from '../supplierCustomerFixedForAllPercentage/customerDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import moment from 'moment';
import { CustomerPersonDetailsDropDown } from '../passengerDetails/customerPersonDetailsDropDown.model';
import { GeoPointTypeDropDown } from '../geoPointType/geoPointTypeDropDown.model';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';
import { CreditNoteManagementService } from './creditNoteManagement.service';
import { CreditNoteManagementModel } from './creditNoteManagement.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { FormDialogCreditVerificationsComponent } from '../creditNoteApproval/dialogs/form-dialog-verifications/form-dialog-verifications.component';

@Component({
  standalone: false,
  selector: 'app-creditNoteManagement',
  templateUrl: './creditNoteManagement.component.html',
  styleUrls: ['./creditNoteManagement.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CreditNoteManagementComponent implements OnInit {
  displayedColumns = [
    'Approval',
      'CreditNoteNumberWithPrefix',
      'CustomerName',
      'CreditNoteAmount',
      'DateTimeOfGeneration',
      'InvoiceNumberWithPrefix',
      'CreditNoteType',
      'ApprovalStatus'
  ];

  dataSource: CreditNoteManagementModel[] | null;
  employeeID: number;
  row: CreditNoteManagementModel | null;
  SearchName: string = '';
  IsLockedOut:boolean=true;
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  userType:string='Employee';
  dialogRef: MatDialogRef<any>;
  ActiveStatus: any;
  last: any;
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  customerName : FormControl=new FormControl();
   public CustomerList?:CustomerDropDown[]=[];
   filteredOptions: Observable<CustomerGroupDropDown[]>;
   public customerGroupList?: CustomerGroupDropDown[] = [];

  searchTerm: any = '';
  selectedFilter: string = 'search';
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

  SearchFromDate: string = '';
  startDate : FormControl = new FormControl();

  SearchToDate: string = '';
  endDate : FormControl = new FormControl();
  SearchType: string = '';
  searchApprovalStatus: string = '';
  invoiceCreditNoteID: any;
  creditNoteNumber: any;
  invoiceNumberWithPrefix: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public creditNoteManagementService: CreditNoteManagementService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    private cdr: ChangeDetectorRef
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    this.loadData();
    this.InitCustomerGroup();
    this.initCustomer();
    this.InitBranch();
  }

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
    if (!value || value.length < 3) {
      return [];   
    }
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
    // this.InitCustomer();
  }
  //-------------Mode of Payment ------------------
   initCustomer(){
    this._generalService.GetCustomers().subscribe(
      data=>
      {                
        this.CustomerList=data;
        this.filteredCustomerOptions = this.customerName.valueChanges.pipe(
         startWith(""),
         map(value => this._filterCustomer(value || ''))
          );
      });
  }
  
  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    // if(filterValue.length === 0) {
    //   return [];
    // }
    if (!value || value.length < 3) {
      return [];   
    }
    return this.CustomerList?.filter(
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
    // if (!value || value.length < 3) {
    //   return [];   
    // }
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

  refresh() 
  {
    this.customerGroup.setValue('');
    this.customerName.setValue('');
    this.SearchCreditNoteNumber = '';
    this.SearchBranch.setValue('');
    this.SearchFromDate = '';
    this.SearchToDate = '';
    this.searchApprovalStatus = '';
    this.SearchType = '';
    this.PageNumber = 0;
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
    if(this.SearchFromDate!=="")
    {
      this.SearchFromDate=moment(this.SearchFromDate).format('yyyy-MM-DD');
    }
    if(this.SearchToDate!=="")
    {
      this.SearchToDate=moment(this.SearchToDate).format('yyyy-MM-DD');
    }
    this.creditNoteManagementService.getTableData(this.customerName.value,this.customerGroup.value,this.searchApprovalStatus,this.SearchCreditNoteNumber,this.SearchBranch.value,this.SearchFromDate,this.SearchToDate,this.SearchType,this.PageNumber).subscribe
      (
        data => {
          this.dataSource = data;  
          console.log(this.dataSource);
          
          // Force apply table styling after data load
          this.forceTableStyling();
        },
        (error: HttpErrorResponse) => { 
          this.dataSource = null; 
        }
      );
  }

  // Method to force table styling after data loads
  private forceTableStyling(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
      
      // Force reapply styles using direct DOM manipulation as fallback
      setTimeout(() => {
        const approvalCells = document.querySelectorAll('.mat-column-Approval');
        const numberCells = document.querySelectorAll('.mat-column-CreditNoteNumber');
        
        approvalCells.forEach(cell => {
          (cell as HTMLElement).style.paddingRight = '35px';
          (cell as HTMLElement).style.minWidth = '130px';
        });
        
        numberCells.forEach(cell => {
          (cell as HTMLElement).style.paddingLeft = '20px';
          (cell as HTMLElement).style.minWidth = '110px';
        });
      }, 50);
    }, 100);
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  onContextMenu(event: MouseEvent, item: CreditNoteManagementModel) {
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
    this.creditNoteManagementService.getTableDataSort(this.customerName.value,this.customerGroup.value,this.searchApprovalStatus,this.SearchCreditNoteNumber,this.SearchBranch.value,this.SearchFromDate,this.SearchToDate,this.SearchType,this.PageNumber, coloumName.active, this.sortType).subscribe
    (
      data => {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }
  openApprovalForm(row: any): void {
  const dialogRef = this.dialog.open(FormDialogCreditVerificationsComponent, {
    width: '600px',
    data: {
      advanceTable: row,
      invoiceCreditNoteID: this.invoiceCreditNoteID,
       invoiceNumberWithPrefix: this.invoiceNumberWithPrefix

    }
  });

  dialogRef.afterClosed().subscribe((result) => {
    console.log('Dialog result:', result);
    if (result === 'success') {
      this.loadData(); // reload after closing form - this will call forceTableStyling()
    } else {
      // Even if dialog is just closed without changes, ensure styles are maintained
      this.forceTableStyling();
    }
  });
}

}



