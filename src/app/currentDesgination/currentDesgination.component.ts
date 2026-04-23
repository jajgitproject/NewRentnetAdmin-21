// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CurrentDesginationService } from './currentDesgination.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CurrentDesgination } from './currentDesgination.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
@Component({
  standalone: false,
  selector: 'app-currentDesgination',
  templateUrl: './currentDesgination.component.html',
  styleUrls: ['./currentDesgination.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CurrentDesginationComponent implements OnInit {
  displayedColumns = [
    'organizationalEntityName',
    'department',
    'designation',
    'startDate',
   'endDate',
    'actions'
  ];
  dataSource: CurrentDesgination[] | null;
  currentDesginationID: number;
  advanceTable: CurrentDesgination | null;
  SearchOrganizationalEntityStakeHolders: string = ''; 
  SearchEntityType:string='';
  search : FormControl = new FormControl();
  SearchActivationStatus : string='true';
  PageNumber: number = 0;
  EmployeeID:number=0;
  sortType: string;
  sortingData: number;
  ActiveStatus: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public currentDesginationService: CurrentDesginationService,
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
    //this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.SearchOrganizationalEntityStakeHolders = '';
    this.SearchActivationStatus = 'true';
    this.PageNumber=0;
    this.loadData();
  }
  // addNew()
  // {
    
  //   const dialogRef = this.dialog.open(FormDialogComponent, 
  //   {
  //     data: 
  //       {
  //         advanceTable: this.advanceTable,
  //         action: 'add'
  //       }
  //   });
  // }
  // editCall(row) {
  //     //  alert(row.id);
  //   this.currentDesginationID = row.id;
  //   const dialogRef = this.dialog.open(FormDialogComponent, {
  //     data: {
  //       advanceTable: row,
  //       action: 'edit'
  //     }
  //   });
  // }

  public SearchData()
  {
    this.loadData();
    this.SearchOrganizationalEntityStakeHolders='';
  }
  
  // deleteItem(row)
  // {

  //   this.currentDesginationID = row.id;
  //   const dialogRef = this.dialog.open(DeleteDialogComponent, 
  //   {
  //     data: row
  //   });
  // }
  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }
   public loadData() 
   {
      this.currentDesginationService.getTableData(this.SearchEntityType,this.SearchOrganizationalEntityStakeHolders,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CurrentDesgination) {
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
          if(this.MessageArray[0]=="CurrentDesginationCreate")
          {
            if(this.MessageArray[1]=="CurrentDesginationView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'CurrentDesgination Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CurrentDesginationUpdate")
          {
            if(this.MessageArray[1]=="CurrentDesginationView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'CurrentDesgination Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CurrentDesginationDelete")
          {
            if(this.MessageArray[1]=="CurrentDesginationView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'CurrentDesgination Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CurrentDesginationAll")
          {
            if(this.MessageArray[1]=="CurrentDesginationView")
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
    this.currentDesginationService.getTableDataSort(this.SearchOrganizationalEntityStakeHolders,this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}

export { CurrentDesgination };



