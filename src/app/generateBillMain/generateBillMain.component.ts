// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GenerateBillMainService } from './generateBillMain.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GenerateBillMainModel } from './generateBillMain.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../generateBillMain/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import moment from 'moment';
import { CustomerPersonDropDown } from '../customerPerson/customerPersonDropDown.model';
import { CustomerDropDown } from '../customer/customerDropDown.model';

@Component({
  standalone: false,
  selector: 'app-generateBillMain',
  templateUrl: './generateBillMain.component.html',
  styleUrls: ['./generateBillMain.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class GenerateBillMainComponent implements OnInit {
  displayedColumns = [
    'invoiceNumberWithPrefix',
    'customerName',
    'billDate',
    //'vehicleName',
    'startDate',
    'endDtate',
    'placeOfSupply',
    'invoiceTotalAmount',
    'status',
    'actions'
  ];
  dataSource: GenerateBillMainModel[] | null;
  advanceTable: GenerateBillMainModel | null;
  SearchCustomer: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
    public CustomerPersonList?:CustomerPersonDropDown[] = [];
    filteredCustomerPersonOptions:Observable<CustomerPersonDropDown[]>;
  selectedFilter: string = 'search';
  searchTerm: any = '';
  invoiceID: any;
  menuItems: any[] = [
    { label: 'Add Details', tooltip: 'Add Details' },
  ];
  SearchInvoiceNumberWithPrefix: string='';
  SearchBillDate: string = '';

  SearchStartDate: string = '';
  startDate : FormControl = new FormControl();

  SearchEndDate: string = '';
  endDate : FormControl = new FormControl();
  SearchGuset: string='';
  customerPersonName : FormControl = new FormControl();
   public CustomerList?: CustomerDropDown[] = [];
    filteredCustomerOptions: Observable<CustomerDropDown[]>;
    
      CustomerName : FormControl = new FormControl();
    
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public generateBillMainService: GenerateBillMainService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public router:Router,
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    this.loadData();
    this.InitGuest();
    this.SubscribeUpdateService();
  }

  refresh() 
  {
    this.selectedFilter='search';
    this.SearchStartDate='';
    this.SearchEndDate='';
    this.searchTerm='';
    this.SearchCustomer = '';
     this.SearchGuset='';
    this.SearchBillDate='';
    this.SearchInvoiceNumberWithPrefix='';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      width: '600px',
      hasBackdrop: true,
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
    });
  }

  editCall(row) 
  {
    this.invoiceID = row.id;
    const dialogRef = this.dialog.open(FormDialogComponent, {
    data: 
    {
      advanceTable: row,
      action: 'edit'
    }
    });
  }

deleteItem(row)
{
  this.invoiceID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: row
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

  onBackPress(event) 
  {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

  openInNewTab(menuItem: any, rowItem: any) 
  {
    let baseUrl = this._generalService.FormURL;   
    if(menuItem.label.toLowerCase() === 'add details') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/generalBill'], { queryParams: {
        invoiceID: rowItem.invoiceID,
        cgstRate: rowItem.cgstRate,
        cgstAmount: rowItem.cgstAmount,
        sgstRate: rowItem.sgstRate,
        sgstAmount: rowItem.sgstAmount,
        igstRate: rowItem.igstRate,
        igstAmount: rowItem.igstAmount
      } }));
      window.open(baseUrl + url, '_blank'); 
    }  
  }

   public loadData() 
   {
    if(this.SearchStartDate!=="")
    {
      this.SearchStartDate=moment(this.SearchStartDate).format('YYYY-MM-DD');
    }
    if(this.SearchEndDate!=="")
    {
      this.SearchEndDate=moment(this.SearchEndDate).format('YYYY-MM-DD');
    }
    switch (this.selectedFilter)
    {
      case 'customer':
        this.SearchCustomer = this.searchTerm;
        break;
        case 'guest':
        this.SearchGuset = this.searchTerm;
        break;
      case 'invoiceNumber':
        this.SearchInvoiceNumberWithPrefix = this.searchTerm;
        break;
      case 'billDate':
        this.SearchBillDate = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.generateBillMainService.getTableData(this.SearchCustomer,this.SearchInvoiceNumberWithPrefix.replace("/","-"),this.SearchGuset,this.SearchBillDate,this.SearchStartDate,this.SearchEndDate,this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data =>   
        {
          this.dataSource = data;
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
  onContextMenu(event: MouseEvent, item: GenerateBillMainModel) {
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
    this.loadData();
    //this.SearchGenerateBillMain='';
    
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
          if(this.MessageArray[0]=="GenerateBillMainCreate")
          {
            if(this.MessageArray[1]=="GenerateBillMainView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Generate Bill Main Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="GenerateBillMainUpdate")
          {
            if(this.MessageArray[1]=="GenerateBillMainView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Generate Bill Main Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="GenerateBillMainDelete")
          {
            if(this.MessageArray[1]=="GenerateBillMainView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Generate Bill Main Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="GenerateBillMainAll")
          {
            if(this.MessageArray[1]=="GenerateBillMainView")
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

   InitGuest(){
      this._generalService.getCustomerPerson().subscribe(
        data=>{
          this.CustomerPersonList=data;
          this.filteredCustomerPersonOptions = this.customerPersonName.valueChanges.pipe(
            startWith(""),
            map(value => this._filterCustomerPerson(value || ''))
          ); 
        }
      )
    }
    private _filterCustomerPerson(value: string): any {
      const filterValue = value.toLowerCase();
    //   if (!value || value.length < 3) {
    //   return [];   
    // }
      return this.CustomerPersonList?.filter(
        customer => 
        {
          return customer.customerPersonName.toLowerCase().indexOf(filterValue)===0;
        }
      );
    }

  SortingData(coloumName:any) 
  {
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.generateBillMainService.getTableDataSort(this.SearchCustomer,this.SearchInvoiceNumberWithPrefix,this.SearchGuset,this.SearchBillDate,this.SearchStartDate,this.SearchEndDate,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




