// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogCIComponent } from './dialogs/form-dialog/form-dialog.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { CancelInvoiceService } from './cancelInvoice.service';
import { CancelInvoice } from './cancelInvoice.model';

@Component({
  standalone: false,
  selector: 'app-cancelInvoice',
  templateUrl: './cancelInvoice.component.html',
  styleUrls: ['./cancelInvoice.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CancelInvoiceComponent implements OnInit {
  displayedColumns = [
    'reservationAllotmentName',
    'reservationAllotmentCode',
    'reservationAllotmentSign',  
    'activationStatus',
    'actions'
  ];
  dataSource: CancelInvoice[] | null;
  reservationAllotmentID: number;
  advanceTable: CancelInvoice | null;
  SearchReservationAllotmentName: string = '';
  SearchReservationAllotmentCode: string = '';
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
    public cancelInvoiceService: CancelInvoiceService,
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
    
    this.SubscribeUpdateService();
  }
  refresh() {
    this.SearchReservationAllotmentName = '';
    this.SearchReservationAllotmentCode = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogCIComponent, 
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
    this.reservationAllotmentID = row.id;
    const dialogRef = this.dialog.open(FormDialogCIComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });

  }
  public Filter()
  {
    this.PageNumber = 0;
  
  }
 
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: CancelInvoice) {
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
      
    }
  }
  public SearchData()
  {
    
  }
  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
          } 
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
          if(this.MessageArray[0]=="ReservationAllotmentCreate")
          {
            if(this.MessageArray[1]=="ReservationAllotmentView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'ReservationAllotment Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ReservationAllotmentUpdate")
          {
            if(this.MessageArray[1]=="ReservationAllotmentView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'ReservationAllotment Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ReservationAllotmentDelete")
          {
            if(this.MessageArray[1]=="ReservationAllotmentView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'ReservationAllotment Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ReservationAllotmentAll")
          {
            if(this.MessageArray[1]=="ReservationAllotmentView")
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
 
}


