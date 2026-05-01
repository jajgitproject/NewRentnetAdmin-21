// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FetchDataFromAppService } from './fetchDataFromApp.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FetchDataFromApp } from './fetchDataFromApp.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
//import { FormDialogPickupExecutiveComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { FormDialogPickupExecutiveComponent } from './dialogs/form-dialog/form-dialog.component';
@Component({
  standalone: false,
  selector: 'app-fetchDataFromApp',
  templateUrl: './fetchDataFromApp.component.html',
  styleUrls: ['./fetchDataFromApp.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FetchDataFromAppComponent implements OnInit {
  displayedColumns = [
    'pickupDate',
    'pickupTime',
    'pickupAddressString',
    'pickupKM',
    'pickupLongitude',
    'pickupLatitude',
    'actions'
  ];
  dataSource: FetchDataFromApp[] | null;
  fetchDataFromAppDetailsID: number;
  advanceTable: FetchDataFromApp | null;
  SearchFetchDataFromAppType: string = '';
  SearchFetchDataFromApp: string = '';
  SearchFetchDataFromAppValue: string = '';
  // SearchFetchDataFromAppValue: string = '';
  // SearchFetchDataFromApp: number = 0;
  SearchActivationStatus :boolean=true;
  PageNumber: number = 0;
  sortingData: number;
  sortType: string;
  activation:string;
  search : FormControl = new FormControl();
  fetchDataFromApp: FormControl = new FormControl();
  fetchDataFromAppValue: FormControl = new FormControl();
  searchpickupDate: string;
  searchpickupTime: string;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public fetchDataFromAppService: FetchDataFromAppService,
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
    this.SubscribeUpdateService();
  }
  refresh() {
    this.SearchFetchDataFromAppType = '';
    this.SearchFetchDataFromApp = '';
    this.SearchFetchDataFromAppValue = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogPickupExecutiveComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.fetchDataFromAppDetailsID
 = row.id;
    const dialogRef = this.dialog.open(FormDialogPickupExecutiveComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });

  }
  deleteItem(row)
  {

    this.fetchDataFromAppDetailsID
 = row.id;
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
      this.fetchDataFromAppService.getTableData(this.searchpickupDate,this.searchpickupTime).subscribe
    (
      data =>   
      {
        this.dataSource = data;
        this.dataSource.forEach((ele)=>{
          // if(ele.activationStatus===true){
          //  this.activation="Active"
          // }
          
          // if(ele.activationStatus===false){
          //   this.activation="Deleted"
          //  }
          
        })
       
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
  onContextMenu(event: MouseEvent, item: FetchDataFromApp) {
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
      this.loadData();
    }
  }
  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData();    } 
  }

  public SearchData()
  {
    this.loadData();
    
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
          if(this.MessageArray[0]=="FetchDataFromAppCreate")
          {
            if(this.MessageArray[1]=="FetchDataFromAppView")
            {
              if(this.MessageArray[2]=="Success")
              {
                
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'ACRISS Code Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="FetchDataFromAppUpdate")
          {
            if(this.MessageArray[1]=="FetchDataFromAppView")
            {
              if(this.MessageArray[2]=="Success")
              {
                
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'ACRISS Code Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="FetchDataFromAppDelete")
          {
            if(this.MessageArray[1]=="FetchDataFromAppView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'ACRISS Code Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="FetchDataFromAppAll")
          {
            if(this.MessageArray[1]=="FetchDataFromAppView")
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
  //   
  //   if (this.sortingData == 1) {

  //     this.sortingData = 0;
  //     this.sortType = "Ascending"
  //   }
  //   else {
  //     this.sortingData = 1;
  //     this.sortType = "Descending";
  //   }
  //   this.fetchDataFromAppService.getTableDataSort(this.searchpickupDate,this.searchpickupTime,this.SearchFetchDataFromAppValue, coloumName.active,this.sortType).subscribe
  //   (
  //     data =>   
  //     {
  //       this.dataSource = data;
       
  //     },
  //     (error: HttpErrorResponse) => { this.dataSource = null;}
  //   );
  // }
}



