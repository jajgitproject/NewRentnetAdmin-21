// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CancelAttotmentService } from './cancelAttotment.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CancelAttotment } from './cancelAttotment.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogCAComponent } from './dialogs/form-dialog/form-dialog.component';
//import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
@Component({
  standalone: false,
  selector: 'app-CancelAttotment',
  templateUrl: './CancelAttotment.component.html',
  styleUrls: ['./CancelAttotment.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CancelAttotmentComponent implements OnInit {
  displayedColumns = [
    'cancelAttotmentName',
    'cancelAttotmentCode',
    'cancelAttotmentSign',  
    'activationStatus',
    'actions'
  ];
  dataSource: CancelAttotment[] | null;
  cancelAttotmentID: number;
  advanceTable: CancelAttotment | null;
  SearchCancelAttotmentName: string = '';
  SearchCancelAttotmentCode: string = '';
  search : FormControl = new FormControl();
  code : FormControl = new FormControl();
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  sortingData: number;
  sortType: string;
  activation:any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public cancelAttotmentService: CancelAttotmentService,
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
    this.SearchCancelAttotmentName = '';
    this.SearchCancelAttotmentCode = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogCAComponent, 
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
    this.cancelAttotmentID = row.id;
    const dialogRef = this.dialog.open(FormDialogCAComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });

  }
  // deleteItem(row)
  // {
  //   this.cancelAttotmentID = row.id;
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
      this.cancelAttotmentService.getTableData(this.SearchCancelAttotmentName,this.SearchCancelAttotmentCode,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CancelAttotment) {
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
  public SearchData()
  {
    this.loadData();
    //this.SearchCancelAttotmentName='';
    //this.SearchCancelAttotmentCode='';
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
          if(this.MessageArray[0]=="CancelAttotmentCreate")
          {
            if(this.MessageArray[1]=="CancelAttotmentView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'CancelAttotment Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CancelAttotmentUpdate")
          {
            if(this.MessageArray[1]=="CancelAttotmentView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'CancelAttotment Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CancelAttotmentDelete")
          {
            if(this.MessageArray[1]=="CancelAttotmentView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'CancelAttotment Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CancelAttotmentAll")
          {
            if(this.MessageArray[1]=="CancelAttotmentView")
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
    debugger;
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.cancelAttotmentService.getTableDataSort(this.SearchCancelAttotmentName,this.SearchCancelAttotmentCode,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  } 
}




