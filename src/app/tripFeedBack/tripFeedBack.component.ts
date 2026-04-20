// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TripFeedBackService } from './tripFeedBack.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TripFeedBack } from './tripFeedBack.model';
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
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { AdditionalServiceDropDown } from '../general/additionalServiceDropDown.model';
//import { AdditionalServiceDropDown } from '../additionalService/additionalServiceDropDown.model';
@Component({
  standalone: false,
  selector: 'app-tripFeedBack',
  templateUrl: './tripFeedBack.component.html',
  styleUrls: ['./tripFeedBack.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class TripFeedBackComponent implements OnInit {
  displayedColumns = [
   
    // 'additionalService',
    'reservationID',
    'status',
    'actions'
    
  ];
  dataSource: TripFeedBack[] | null;
  tripFeedBackID: number;
  advanceTable: TripFeedBack | null;
  SearchRate:string='';
  TripFeedBackID: number=0;
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
  constructor(
    public httpClient: HttpClient,
    public route:ActivatedRoute,
    public dialog: MatDialog,
    public tripFeedBackService: TripFeedBackService,
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
      this.uom_ID   = paramsData.uomid;
      this.service_ID   = paramsData.tripFeedBackID;
      console.log(this.service_ID);
    });
    this.loadData();
    this.SubscribeUpdateService();
    this.getseviceName();
  }
  refresh() {
    this.CurrencyName='';
    this.SearchRate=''; 
    this.TripFeedBackID=0; 
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  public SearchData()
  {
    this.loadData();
    //this.SearchRate='';
    
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          uomID:this.uom_ID,
          serviceTypeID:this.service_ID
        }
    });
  }
  editCall(row) {
    console.log(row);
      //  alert(row.id);
    this.tripFeedBackID = row.tripFeedBackID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        uomID:this.uom_ID,
        serviceTypeID:this.service_ID
      }
    });
   
  }
  deleteItem(row)
  {

    this.tripFeedBackID = row.id;
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
     this.tripFeedBackService.getTableData(this.SearchRate,this.service_ID,this.SearchActivationStatus, this.PageNumber).subscribe
     (
       data =>   
       {
         this.dataSource = data;
         console.log(this.dataSource)
         this.dataSource.forEach((ele)=>{
           if(ele.activationStatus===true){
            this.activation="Active";

           }
           if(ele.activationStatus===false){
            this.activation="Deleted"
           }
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
  onContextMenu(event: MouseEvent, item: TripFeedBack) {
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
          if(this.MessageArray[0]=="TripFeedBackCreate")
          {
            if(this.MessageArray[1]=="TripFeedBackView")
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
          else if(this.MessageArray[0]=="TripFeedBackUpdate")
          {
            if(this.MessageArray[1]=="TripFeedBackView")
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
          else if(this.MessageArray[0]=="TripFeedBackDelete")
          {
            if(this.MessageArray[1]=="TripFeedBackView")
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
          else if(this.MessageArray[0]=="TripFeedBackAll")
          {
            if(this.MessageArray[1]=="TripFeedBackView")
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
    this.tripFeedBackService.getTableDataSort(this.SearchRate,this.service_ID,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
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




