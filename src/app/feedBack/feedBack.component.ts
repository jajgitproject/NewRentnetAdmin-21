// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FeedBackService } from './feedBack.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FeedBack } from './feedBack.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DeleteDialogComponent as DeleteDialogComponentForfeedBackAttachment } from '../feedBackAttachment/dialogs/delete/delete.component';
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
import { tripFeedBackAttachmentFormDialogComponent } from '../feedBackAttachment/dialogs/form-dialog/form-dialog.component';
// import { tripFeedBackAttachmentFormDialogComponent } from '../feedBackAttachment/dialogs/form-dialog/form-dialog.component';
//import { AdditionalServiceDropDown } from '../additionalService/additionalServiceDropDown.model';
@Component({
  standalone: false,
  selector: 'app-feedBack',
  templateUrl: './feedBack.component.html',
  styleUrls: ['./feedBack.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FeedBackComponent implements OnInit {
  displayedColumns = [
   
    // 'additionalService',
    'uom',
    'GeoPoint.GeoPointName',
    'startDate',
    // 'dateTo',
     'rate',
    'status',
    'actions'
    
  ];
  dataSource: FeedBack[] | null;
  feedBackID: number;
  advanceTable: FeedBack | null;
  SearchRate:string='';
  FeedBackID: number=0;
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
  driverName: string;
  ReservationID: number;
  customerPersonName: any;
  primaryPassengerID: any;
  customerPersonID: any;
  CustomerPersonID: any;
  feedBackAttachmentID: any;
  constructor(
    public httpClient: HttpClient,
    public route:ActivatedRoute,
    public dialog: MatDialog,
    public feedBackService: FeedBackService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  @ViewChild('searchDialog') searchDialog: TemplateRef<any>;
@ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      this.customerPersonName  = paramsData.customerPersonName;
      this.CustomerPersonID   = paramsData.CustomerPersonID;
      console.log(this.customerPersonName);
      console.log(this.CustomerPersonID );
    });
    //this.loadData();
    this.SubscribeUpdateService();
    this.getseviceName();
  }
  refresh() {
    this.CurrencyName='';
    this.SearchRate=''; 
    this.FeedBackID=0; 
    this.SearchActivationStatus = true;
    this.PageNumber=0;
   // this.loadData();
  }

  public SearchData()
  {
   // this.loadData();
    //this.SearchRate='';
    
  }
  addNew()
  {
    console.log(this.customerPersonName)
    const dialogRef = this.dialog.open(tripFeedBackAttachmentFormDialogComponent, 
    {
      
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          customerPersonName:this.customerPersonName,
          CustomerPersonID:this.CustomerPersonID
        }
    });
  }
  editCall(row) {
    console.log(row);
      //  alert(row.id);
    this.feedBackID = row.feedBackID;
    const dialogRef = this.dialog.open(tripFeedBackAttachmentFormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        customerPersonName:this.customerPersonName,
        CustomerPersonID:this.CustomerPersonID
      }
    });
    
  }
  deleteItem(row)
  {

    this.feedBackID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
   
  }

  deleteItemfeedBackAttachment(row)
  {

    this.feedBackAttachmentID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponentForfeedBackAttachment, 
    {
      data: row
    });
  }
  public Filter()
  {
    this.PageNumber = 0;
    //this.loadData();
  }
//   public loadData() 
//   {
//      this.feedBackService.getTableData(this.SearchRate,this.SearchActivationStatus, this.PageNumber).subscribe
//      (
//        data =>   
//        {
//          this.dataSource = data;
//          console.log(this.dataSource)
//          this.dataSource.forEach((ele)=>{
//            if(ele.activationStatus===true){
//             this.activation="Active";

//            }
//            if(ele.activationStatus===false){
//             this.activation="Deleted"
//            }
//          })
        
//        },
//        (error: HttpErrorResponse) => { this.dataSource = null;}
//      );
//  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: FeedBack) {
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
      //this.loadData();
    }
    //alert([this.PageNumber])
  }
  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      //this.loadData();   
     } 
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
          if(this.MessageArray[0]=="FeedBackCreate")
          {
            if(this.MessageArray[1]=="FeedBackView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Additional Service Rate Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="FeedBackUpdate")
          {
            if(this.MessageArray[1]=="FeedBackView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Additional Service Rate Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="FeedBackDelete")
          {
            if(this.MessageArray[1]=="FeedBackView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Additional Service Rate Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="FeedBackAll")
          {
            if(this.MessageArray[1]=="FeedBackView")
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
    this.feedBackService.getTableDataSort(this.ReservationID,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       console.log(this.dataSource);
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }


  openSearchDialog() {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any) {
    SearchData();
    dialogRef.close();
  }

}




