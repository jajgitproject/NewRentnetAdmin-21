// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
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
import { CustomerTypeDropDown } from '../customerType/customerTypeDropDown.model';
import { CustomerCategoryDropDown } from '../customerCategory/customerCategoryDropDown.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { RoleDropDown } from '../role/roleDropDown.model';
import { RolePageMappingService } from '../rolePageMapping/rolePageMapping.service';
import { CreateCreditNote } from './createCreditNote.model';
import { CreateCreditNoteService } from './createCreditNote.service';
import { CustomerDropDown } from '../supplierCustomerFixedForAllPercentage/customerDropDown.model';
import moment from 'moment';
import Swal from 'sweetalert2';

interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}

@Component({
  standalone: false,
  selector: 'app-createCreditNote',
  templateUrl: './createCreditNote.component.html',
  styleUrls: ['./createCreditNote.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class CreateCreditNoteComponent implements OnInit {
  @Input() customerID:any;
  @Input() action:any;
  
  displayedColumns = [
    'actions',
    'invoiceNumberWithPrefix',
    'invoiceTotalAmountAfterGST',
    'customerName',
    'organizationalEntityName',
    'invoiceFinancialYearName',
    'totalCreditNoteAmount',
    'pendingAmount',
    'details'
  ];
  dataSource: CreateCreditNote[] | null;
  dataSourceForPage:RoleDropDown[] | any;
  //customerID: number;
  advanceTable: CreateCreditNote | null;
  CustomerID: number = 0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  searchCustomerName:string='';
  searchBillNo:string='';
  searchFromDate:string='';
  searchToDate:string='';

  customerName:FormControl=new FormControl();
  billNo:FormControl=new FormControl();
  fromDate:FormControl=new FormControl();
  toDate:FormControl=new FormControl();
  ActiveStatus: string;
  roleID: string | null = '';
  role: string | null = '';
  sidebarItems: any[] = [];
  accessPages: any[] = [];
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;
  public CustomerList?: CustomerDropDown[] = [];
  filteredCustomerOptions: Observable<CustomerDropDown[]>;

  
  constructor(
    
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public createCreditNoteService: CreateCreditNoteService,
    private roleMapService: RolePageMappingService,
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
    this.loadData();
    this.SubscribeUpdateService();
    this.roleID = localStorage.getItem('roleID');
    this.role = localStorage.getItem('role');
    this.loadDataforPage(this.roleID);
    this.InitCustomer();
   
  }
  
 
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }
    
  

  refresh() {
    this.customerName.setValue(''),
    this.searchBillNo='',
    this.searchToDate='',
    this.searchFromDate='',
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }
 
 
 
  public SearchData()
  {
    this.loadData();    
  }
  addNew(row)
  {
    if(row.branchID!=0)
    {
      const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: row,
          action: 'add'
        }
    });

    }
    else
    {
      Swal.fire({
                            title: '',
                            icon: 'warning',
                            html: `<b>Branch not found in this invoice Invalid Record..</b>`,
                            customClass: {
                              container: 'swal2-popup-high-zindex'
                            }
                            })
                           return;
    }
    
  }
  editCall(row) {
      //  alert(row.id);
    this.customerID = row.customerID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
        
      }
    });
  }
 
  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
  }
  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }
   public loadData() 
   {
    if(this.searchFromDate!=="")
    {
      this.searchFromDate=moment(this.searchFromDate).format('MMM DD yyyy');
    }
    if(this.searchToDate!=="")
    {
      this.searchToDate=moment(this.searchToDate).format('MMM DD yyyy');
    }
    switch (this.selectedFilter)
    {
      case 'CustomerName':
        this.customerName.setValue(this.searchTerm);
        break;
      case 'BillNo':
        this.searchBillNo = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.createCreditNoteService.getTableData(
        this.customerName.value,
        this.searchBillNo.replace("/","-"),
        this.searchFromDate,
        this.searchToDate,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;    
        console.log(this.dataSource)  
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
  onContextMenu(event: MouseEvent, item: CreateCreditNote) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.roleID = localStorage.getItem('roleID');
    this.role = localStorage.getItem('role');
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
    this.loadDataforPage(this.roleID);
  }

  public loadDataforPage(roleID:any) 
   {
      this._generalService.GetRoleForPage(roleID).subscribe
    (
      data =>   
      {

        this.dataSourceForPage = data; 
        console.log(this.dataSourceForPage)      
      },
      (error: HttpErrorResponse) => { this.dataSourceForPage = null;}
    );
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
  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData();    } 
  }

  //-------Customer-------
  InitCustomer()
  {
    this._generalService.getCustomers().subscribe(
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
          if(this.MessageArray[0]=="CreateCreditNoteCreate")
          {
            if(this.MessageArray[1]=="CreateCreditNoteView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Create Credit Note Created ..!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CreateCreditNoteUpdate")
          {
            if(this.MessageArray[1]=="CreateCreditNoteView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Create Credit Note Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CreateCreditNoteDelete")
          {
            if(this.MessageArray[1]=="CreateCreditNoteView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Create Credit Note Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CreateCreditNoteAll")
          {
            if(this.MessageArray[1]=="CreateCreditNoteView")
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
    this.createCreditNoteService.getTableDataSort(
      this.customerName.value,
      this.searchBillNo,
      this.searchFromDate,
      this.searchToDate,
      this.SearchActivationStatus, 
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




