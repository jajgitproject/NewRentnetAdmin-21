// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { DutyStateCustomerFormDialogComponent, } from '../dutyStateCustomer/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { DutyStateCustomer } from './dutyStateCustomer.model';
import { DutyStateCustomerService } from './dutyStateCustomer.service';
import { Customer } from '../customer/customer.model';
@Component({
  standalone: false,
  selector: 'app-dutyStateCustomer',
  templateUrl: './dutyStateCustomer.component.html',
  styleUrls: ['./dutyStateCustomer.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutyStateCustomerComponent implements OnInit {
  @Input() advanceTableDutyStateCustomer;
  @Input() dutySlipID;
  @Input() verifyDutyStatusAndCacellationStatus;
  @Input() CustomerID;
  displayedColumns = [
    'state',
    'changeDateTime',
    'reasonOfChange',
    'changedBy',
    'actions'
  ];
  dataSource: DutyStateCustomer[] | null;
  advanceTable: DutyStateCustomer | null;
  SearchDutyStateCustomer: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  dutyStateCustomerID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutyStateCustomerService: DutyStateCustomerService,
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
    this.loadDataCustomerClosing();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.SearchDutyStateCustomer = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  addNew()
  {
    const dialogRef = this.dialog.open(DutyStateCustomerFormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
    }); 
  }

  editCall(row) {
    this.dutyStateCustomerID = row.id;
    const dialogRef = this.dialog.open(DutyStateCustomerFormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus,
        CustomerID:this.CustomerID
      }
    });
  }

deleteItem(row)
{
  this.dutyStateCustomerID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: row
  });
}

  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }

   public loadData() 
   {
      this.dutyStateCustomerService.getTableDataforClosing(this.dutySlipID).subscribe
      (
        data =>   
        {
          this.advanceTableDutyStateCustomer = data;
         
        },
        (error: HttpErrorResponse) => { this.advanceTableDutyStateCustomer = null;}
      );
  }
    public loadDataCustomerClosing() 
   {
      this.dutyStateCustomerService.getTableDataCustomerClosing(this.dutySlipID).subscribe
      (
        data =>   
        {
          this.advanceTableDutyStateCustomer = data;
         
        },
        (error: HttpErrorResponse) => { this.advanceTableDutyStateCustomer = null;}
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
  onContextMenu(event: MouseEvent, item: DutyStateCustomer) {
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
    //this.SearchDutyStateCustomer='';
    
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
          if(this.MessageArray[0]=="DutyStateCustomerCreate")
          {
            if(this.MessageArray[1]=="DutyStateCustomerView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Duty State Customer Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyStateCustomerUpdate")
          {
            if(this.MessageArray[1]=="DutyStateCustomerView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Duty State Customer Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyStateCustomerDelete")
          {
            if(this.MessageArray[1]=="DutyStateCustomerView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Duty State Customer Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyStateCustomerAll")
          {
            if(this.MessageArray[1]=="DutyStateCustomerView")
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

  // SortingData(coloumName:any) {
   
  //   if (this.sortingData == 1) {

  //     this.sortingData = 0;
  //     this.sortType = "Ascending"
  //   }
  //   else {
  //     this.sortingData = 1;
  //     this.sortType = "Descending";
  //   }
  //   this.dutyStateCustomerService.getTableDataSort(this.SearchDutyStateCustomer,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
  //   (
  //     data =>   
  //     {
  //       this.dataSource = data;
      
  //     },
  //     (error: HttpErrorResponse) => { this.dataSource = null;}
  //   );
  // }
}



