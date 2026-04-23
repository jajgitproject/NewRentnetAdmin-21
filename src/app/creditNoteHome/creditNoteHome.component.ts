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
import { CreditNoteHomeService } from './creditNoteHome.service';
import { CreditNoteHomeModel } from './creditNoteHome.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { Router } from '@angular/router';
import { FormDialogComponent as CreateNote } from '../createCreditNote/dialogs/form-dialog/form-dialog.component';
import Swal from 'sweetalert2';
import { FormDialogComponent } from '../creditNoteHome/dialogs/form-dialog/form-dialog.component';

@Component({
  standalone: false,
  selector: 'app-creditNoteHome',
  templateUrl: './creditNoteHome.component.html',
  styleUrls: ['./creditNoteHome.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CreditNoteHomeComponent implements OnInit {
  displayedColumns = [
      'CreditNoteNumberWithPrefix',
      'CustomerName',
      'CreditNoteAmount',
      'DateTimeOfGeneration',
      'InvoiceNumberWithPrefix',
      'CreditNoteType',
      'ApprovalStatus',
      'CreditNoteIRN',
      'IsEinvoiceGenerated',
      'CancellationDate',
      'CancellationStatus',
      'actions'
  ];

  dataSource: CreditNoteHomeModel[] | null;
  employeeID: number;
  row: CreditNoteHomeModel | null;
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

  SearchBillNo:string='';
  SearchCreditNoteNo:string='';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public creditNoteHomeService: CreditNoteHomeService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public router:Router,
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
    // if (!value || value.length < 3) {
    //   return [];   
    // }
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
    this.customer.setValue('');
    this.SearchCreditNoteNumber = '';
    this.SearchBranch.setValue('');
    this.SearchBillNo = '';
    this.SearchFromDate = '';
    this.SearchToDate = '';
    this.SearchType = '';
    this.PageNumber = 0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.searchApprovalStatus = '';
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
    switch (this.selectedFilter)
    {
      case 'CustomerName':
        this.customer.setValue(this.searchTerm);
        break;
      case 'BillNo':
        this.SearchBillNo = this.searchTerm;
        break;
      case 'CreditNoteNo':
        this.SearchCreditNoteNumber = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
    this.creditNoteHomeService.getTableData(this.customer.value,this.customerGroup.value,this.SearchBillNo.replace("/","-"),
    this.searchApprovalStatus,this.SearchCreditNoteNumber.replace(/\//g, '-'),this.SearchBranch.value,this.SearchFromDate,
    this.SearchToDate,this.SearchType,this.PageNumber).subscribe
      (
        data => {
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
    this.creditNoteHomeService.getTableDataSort(this.customer.value,this.customerGroup.value,this.SearchBillNo,this.searchApprovalStatus,this.SearchCreditNoteNumber,this.SearchBranch.value,this.SearchFromDate,this.SearchToDate,this.SearchType,this.PageNumber, coloumName.active, this.sortType).subscribe
    (
      data => {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }
  
 editCall(row) {
    if(row.approvalStatus!='Approved')
    {
       const dialogRef = this.dialog.open(CreateNote, {
        data: {
          advanceTable: row,
          action: 'edit'
          
        }        
      });
    dialogRef.afterClosed().subscribe((res: any) => {
        if (res === true) 
      {
    this.loadData();
        
      }
      });
    }
    else
    {
     Swal.fire({
                      title: '',
                      icon: 'warning',
                      html: `<b>Edit is not available Credit Note Status Already Approved..</b>`
                      })
                     return;
        }
      
    }


addCreditNote() {          
      // Create URL with encrypted query parameters
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/createCreditNote']));
      window.open(this._generalService.FormURL + url, '_blank');
    }

  DutyAdjust(item:any) 
  { 
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/creditNoteDutyAdjustment'],{ queryParams: {
        invoiceCreditNoteID:item.invoiceCreditNoteID,
        creditNoteNumber:item.creditNoteNumber,
        invoiceID:item.invoiceID
      }}));
    window.open(this._generalService.FormURL + url, '_blank');
  }

  GenerateECreditNote(row:any)
  {
    if(row.approvalStatus === "Approved")
    {
      let requestPayload = new CreditNoteHomeModel;
      requestPayload.creditNoteNumber   = row.creditNoteNumberWithPrefix;
      requestPayload.invoiceType = row.invoiceType === 'InvoiceGeneral' ? 'General' : 'Corporate';
      this.creditNoteHomeService.generateECreditNote(requestPayload).subscribe(
      response => 
              {
                if (response?.result) 
                {
                  Swal.fire({
                              title: response.result,
                              //icon: 'error'
                            });
                } 
                else
                {
                  this.dialogRef.close(true);
                  this.showNotification(
                    'snackbar-success',
                    'E - Credite Note Generated Successfully...!!!',
                    'bottom',
                    'center'
                  );
                }
                this.loadData();
              },
      error => {
                this.showNotification(
                  'snackbar-danger',
                  'Operation Failed...!!!',
                  'bottom',
                  'center'
                );
              }
            );
    }
    else
    {
      Swal.fire({
                  title: "First Approved the status"
                });
    }
  }

  CancelECreditNote(row:any)
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: row
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res === true) 
      {
        this.loadData();
      }
    });
  }

}




