// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerBlockingService } from './customerBlocking.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerBlocking } from './customerBlocking.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
@Component({
  standalone: false,
  selector: 'app-customerBlocking',
  templateUrl: './customerBlocking.component.html',
  styleUrls: ['./customerBlocking.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerBlockingComponent implements OnInit {
  displayedColumns = [
    'blockDate',
    'reasonofBlocking',
    'blockAttachment',
    'unblockDate',
    'reasonofUnblocking',
    'unblockAttachment',
    'actions'
  ];
  dataSource: CustomerBlocking[] | null;
  customerBlockingID: number;
  CustomerBlockingID: number=0;
  advanceTable: CustomerBlocking | null;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  Customer_ID:any;
  Customer_Name: any;

  SearchBlockDateFrom: string = '';
  fromdate : FormControl = new FormControl();

  SearchBlockDateTo: string = '';
  todate : FormControl = new FormControl();
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerBlockingService: CustomerBlockingService,
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
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedCustomerID = paramsData.CustomerID;
    const encryptedCustomerName = paramsData.CustomerName;
    
    if (encryptedCustomerID && encryptedCustomerName) {
      
        this.Customer_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerID));
        this.Customer_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerName));
      }
      
    });
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.CustomerBlockingID = 0;
    this.PageNumber=0;
    this.SearchBlockDateFrom = '';
    this.SearchBlockDateTo = '';
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
   
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

  public SearchData()
  {
    this.loadData();    
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          CustomerID:this.Customer_ID,
          CustomerName:this.Customer_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerBlockingID = row.customerBlockingID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerID:this.Customer_ID,
        CustomerName:this.Customer_Name
      }
    });

  }
  deleteItem(row)
  {
    this.customerBlockingID = row.id;
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
   public loadData() 
   {
    if(this.SearchBlockDateFrom!==""){
      this.SearchBlockDateFrom=moment(this.SearchBlockDateFrom).format('MMM DD yyyy');
    }
    if(this.SearchBlockDateTo!==""){
      this.SearchBlockDateTo=moment(this.SearchBlockDateTo).format('MMM DD yyyy');
    } 
    switch (this.selectedFilter)
    {
      case 'startDate':
        this.SearchBlockDateFrom = this.searchTerm;
        break;
        case 'endDate':
        this.SearchBlockDateTo = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }   
      this.customerBlockingService.getTableData(this.CustomerBlockingID,this.Customer_ID,this.SearchBlockDateFrom,this.SearchBlockDateTo,this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerBlocking) {
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
  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData();    } 
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
          if(this.MessageArray[0]=="CustomerBlockingCreate")
          {
            if(this.MessageArray[1]=="CustomerBlockingView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Blocking Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerBlockingUpdate")
          {
            if(this.MessageArray[1]=="CustomerBlockingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Blocking Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerBlockingDelete")
          {
            if(this.MessageArray[1]=="CustomerBlockingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Blocking Deleted..!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerBlockingAll")
          {
            if(this.MessageArray[1]=="CustomerBlockingView")
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
    this.customerBlockingService.getTableDataSort(this.CustomerBlockingID,
      this.Customer_ID,
      this.SearchBlockDateFrom,
      this.SearchBlockDateTo,
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




