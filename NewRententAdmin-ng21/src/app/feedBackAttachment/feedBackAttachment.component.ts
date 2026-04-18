// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FeedBackAttachmentService } from './feedBackAttachment.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FeedBackAttachment } from './feedBackAttachment.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
// import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { AdditionalServiceDropDown } from '../general/additionalServiceDropDown.model';
import { FormDialogComponent } from '../tripFeedBack/dialogs/form-dialog/form-dialog.component';
import { tripFeedBackAttachmentFormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
//import { AdditionalServiceDropDown } from '../additionalService/additionalServiceDropDown.model';
@Component({
  standalone: false,
  selector: 'app-feedBackAttachment',
  templateUrl: './feedBackAttachment.component.html',
  styleUrls: ['./feedBackAttachment.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FeedBackAttachmentComponent implements OnInit {
  displayedColumns = [
    'reservationID',
    'dutySlipID',
    'tripFeedBackAttachment',
    'status',
    'actions'
    
  ];
  dataSource: FeedBackAttachment[] | null;
  feedBackAttachmentID: number;
  advanceTable: FeedBackAttachment | null;
  SearchRate:string='';
  FeedBackAttachmentID: number=0;
  CurrencyName :string='';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  ActiveStatus:string;
  activation: string;
  
  startEndDate: any;
  uom_ID: any;
  service_ID: any;
  ServiceID: any;
  service: string;
  public additionalList?: AdditionalServiceDropDown[] = [];
  tripFeedBack_ID: any;
  dutySlipID: any;
  tripFeedBackID: any;
  constructor(
    public httpClient: HttpClient,
    public route:ActivatedRoute,
    public dialog: MatDialog,
    public feedBackAttachmentService: FeedBackAttachmentService,
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
      this.tripFeedBackID   = paramsData.tripFeedBackID;
      this.dutySlipID  = paramsData. dutySlipID
      ;
      console.log(this.tripFeedBackID);
      console.log(this.dutySlipID);
    });
    this.tripBackAttachmentloadData();
    this.SubscribeUpdateService();
    this.getseviceName();
  }
  refresh() {
    this.CurrencyName='';
    this.SearchRate=''; 
    this.FeedBackAttachmentID=0; 
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.tripBackAttachmentloadData();
  }

  public SearchData()
  {
    this.tripBackAttachmentloadData();
    //this.SearchRate='';
    
  }
  addNew()
  {
    console.log(this.dutySlipID)
    const dialogRef = this.dialog.open(tripFeedBackAttachmentFormDialogComponent, 
    {
      
      data: 
        {
          
          advanceTable: this.advanceTable,
          action: 'add',
          tripFeedBackID:this.tripFeedBackID,
          dutySlipID: this.dutySlipID 
        }
      
    });
    console.log(this.dutySlipID )
  
  }
  editCall(row) {
    // console.log(row);
    //    alert(row.id);
    this.feedBackAttachmentID = row.feedBackAttachmentID;
    const dialogRef = this.dialog.open(tripFeedBackAttachmentFormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        tripFeedBackID:this.tripFeedBackID,
        dutySlipID:row.dutySlipID
  
      }
    });
    dialogRef.afterClosed().subscribe((res:any) => {
      this.tripBackAttachmentloadData();
    });

  }
  deleteItem(row)
  {

    this.feedBackAttachmentID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }
  public Filter()
  {
    this.PageNumber = 0;
    this.tripBackAttachmentloadData();
  }
  public tripBackAttachmentloadData() 
  {
     this.feedBackAttachmentService.getTableData(this.tripFeedBackID,this.SearchActivationStatus, this.PageNumber).subscribe
     (
       data =>   
       {
         this.dataSource = data;
         console.log(this.dataSource)
        //  this.dataSource.forEach((ele)=>{
        //    if(ele.activationStatus===true){
        //     this.activation="Active";

        //    }
        //    if(ele.activationStatus===false){
        //     this.activation="Deleted"
        //    }
        //  })
        
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
  onContextMenu(event: MouseEvent, item: FeedBackAttachment) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  
  NextCall()
  {
    //console.log(this.dataSource.length>0)
    if (this.dataSource.length>0) 
    {
     
      this.PageNumber++;
      //alert(this.PageNumber + 'mohit')
      this.tripBackAttachmentloadData();
    }
    //alert([this.PageNumber])
  }
  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.tripBackAttachmentloadData();    } 
  }

/////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string;
  public uploadFinished = (event) => {
  this.response = event;
  this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
  }

  getseviceName(){
    console.log('getseviceName')
    this._generalService.getSeviceName(this.service_ID).subscribe(
      data=>{
       this.additionalList=data;
       this.service = this.additionalList[0].additionalService;
       console.log(this.service)
      }
    )
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
          if(this.MessageArray[0]=="FeedBackAttachmentCreate")
          {
            if(this.MessageArray[1]=="FeedBackAttachmentView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'TripFeedBackAttactment Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="FeedBackAttachmentUpdate")
          {
            if(this.MessageArray[1]=="FeedBackAttachmentView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'TripFeedBackAttactment Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="FeedBackAttachmentDelete")
          {
            if(this.MessageArray[1]=="FeedBackAttachmentView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'TripFeedBackAttactment Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="FeedBackAttachmentAll")
          {
            if(this.MessageArray[1]=="FeedBackAttachmentView")
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
    this.feedBackAttachmentService.getTableDataSort(this.SearchRate,this.service_ID,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       console.log(this.dataSource);
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




