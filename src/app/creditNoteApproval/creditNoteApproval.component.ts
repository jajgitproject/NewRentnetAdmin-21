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

import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { CreditNoteHomeModel } from '../creditNoteHome/creditNoteHome.model';
import { CreditNoteApprovalService } from './creditNoteApproval.service';
import { FormDialogCreditVerificationsComponent } from './dialogs/form-dialog-verifications/form-dialog-verifications.component';
import { FormDialogVerificationsComponent } from '../driverDocumentVerification/dialogs/form-dialog-verifications/form-dialog-verifications.component';
import { CreditNoteApproval } from './creditNoteApproval.model';

@Component({
  standalone: false,
  selector: 'app-creditNoteApproval',
  templateUrl: './creditNoteApproval.component.html',
  styleUrls: ['./creditNoteApproval.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CreditNoteApprovalComponent implements OnInit {
  displayedColumns = [
      'CreditNoteNumber',
      'CustomerName',
      'CreditNoteAmount',
      'DateTimeOfGeneration',
      'InvoiceNumber',
      'CreditNoteType',
      'ApprovalStatus'
  ];

  dataSource: CreditNoteHomeModel[] | null;
  employeeID: number;
 advanceTable: CreditNoteApproval | null;
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
   filteredCustomerOptions:Observable<CustomerDropDown[]>;
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

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public creditNoteApprovalService: CreditNoteApprovalService,
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
    this._generalService.GetCustomersForCP(this.customerGroupID).subscribe(
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

  refresh() 
  {
    this.customerGroup.setValue('');
    this.customer.setValue('');
    this.SearchCreditNoteNumber = '';
    this.SearchBranch.setValue('');
    this.SearchFromDate = '';
    this.SearchToDate = '';
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
    this.creditNoteApprovalService.getTableData(this.customer.value,this.customerGroup.value,this.searchApprovalStatus,this.SearchCreditNoteNumber,this.SearchBranch.value,this.SearchFromDate,this.SearchToDate,this.SearchType,this.PageNumber).subscribe
      (
        data => {
          this.dataSource = data;
          
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
        const actionsCells = document.querySelectorAll('.mat-column-actions');
        const numberCells = document.querySelectorAll('.mat-column-CreditNoteNumber');
        
        actionsCells.forEach(cell => {
          (cell as HTMLElement).style.paddingRight = '40px';
          (cell as HTMLElement).style.minWidth = '140px';
        });
        
        numberCells.forEach(cell => {
          (cell as HTMLElement).style.paddingLeft = '25px';
          (cell as HTMLElement).style.minWidth = '120px';
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

  onContextMenu(event: MouseEvent, item: CreditNoteHomeModel) {
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
    this.creditNoteApprovalService.getTableDataSort(this.customer.value,this.customerGroup.value,this.searchApprovalStatus,this.SearchCreditNoteNumber,this.SearchBranch.value,this.SearchFromDate,this.SearchToDate,this.SearchType,this.PageNumber, coloumName.active, this.sortType).subscribe
    (
      data => {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }

    addNew()
    {
      const dialogRef = this.dialog.open(FormDialogVerificationsComponent, 
      {
        
        data: 
          {
            
            advanceTable: this.advanceTable,
            action: 'add',
            invoiceCreditNoteID: this.advanceTable.invoiceCreditNoteID,
            creditNoteNumber: this.advanceTable.creditNoteNumber

          }
      });
    }

  // Method to open credit note approval dialog
  editCall(row: CreditNoteHomeModel): void {
    
    const dialogRef = this.dialog.open(FormDialogCreditVerificationsComponent, {
      width: '800px',
      data: {
        advanceTable: row,
        action: 'edit',
        creditNoteNumber: row.creditNoteNumber,
        invoiceCreditNoteID: row.invoiceCreditNoteID
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadData(); // Refresh the data after successful update - this will call forceTableStyling()
        
        this.showNotification(
          'snackbar-success',
          'Credit Note Approval updated successfully!',
          'bottom',
          'center'
        );
      } else {
        // Even if dialog is just closed without changes, ensure styles are maintained
        this.forceTableStyling();
      }
    });
  }
  // // Method to open credit note approval dialog
  // editCall(row: CreditNoteHomeModel): void {
    
  //   const dialogRef = this.dialog.open(FormDialogCreditVerificationsComponent, {
  //     width: '800px',
  //     data: {
  //       advanceTable: row,
  //       action: 'edit'
  //     },
  //     disableClose: true
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === 'success') {
  //       this.loadData(); // Refresh the data after successful update
  //       this.showNotification(
  //         'snackbar-success',
  //         'Credit Note Approval updated successfully!',
  //         'bottom',
  //         'center'
  //       );
  //     }
  //   });
  // }

  // Method to handle delete operations (if needed)
  deleteItem(row: CreditNoteHomeModel): void {
    this.showNotification(
      'snackbar-warning',
      'Delete functionality is not available for credit note approvals',
      'bottom',
      'center'
    );
  }
}




