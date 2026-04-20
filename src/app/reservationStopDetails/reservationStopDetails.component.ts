// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ReservationStopDetailsService } from './reservationStopDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReservationStopDetails } from './reservationStopDetails.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogReservationStopDetailsComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-reservationStopDetails',
  templateUrl: './reservationStopDetails.component.html',
  styleUrls: ['./reservationStopDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ReservationStopDetailsComponent implements OnInit {
  displayedColumns = [
    'reservationStopDetailsName',
    'gender',
    'importance',
    'isContactPerson',
    'isBooker',
    'isPassenger',
    'status',
    'actions'
  ];
  dataSource: ReservationStopDetails[] | null;
  reservationStopDetailsID: number;
  advanceTable: ReservationStopDetails | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  customerGroup_ID: any;
  customerGroup_Name: any;

  SearchName: string = '';
  search : FormControl = new FormControl();

  SearchPrimary: string = '';
  primaryEmail : FormControl = new FormControl();

  SearchBilling: string = '';
  billingEmail : FormControl = new FormControl();

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public route:ActivatedRoute,
    public reservationStopDetailsService: ReservationStopDetailsService,
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
      this.customerGroup_ID   = paramsData.CustomerGroupID;
       this.customerGroup_Name=paramsData.CustomerGroupName;
    });
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.SearchName = '';
    this.SearchPrimary='';
    this.SearchBilling='';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  public SearchData()
  {
    this.loadData();    
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogReservationStopDetailsComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          CustomerGroupID:this.customerGroup_ID,
          CustomerGroupName:this.customerGroup_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.reservationStopDetailsID = row.reservationStopDetailsID;
    const dialogRef = this.dialog.open(FormDialogReservationStopDetailsComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerGroupID:this.customerGroup_ID,
        CustomerGroupName:this.customerGroup_Name
      }
    });

  }
  deleteItem(row)
  {

    this.reservationStopDetailsID = row.id;
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
      this.reservationStopDetailsService.getTableData(this.SearchName,
        this.SearchPrimary,
        this.SearchBilling,
        this.customerGroup_ID,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
        //console.log(this.dataSource)
        this.dataSource.forEach((ele)=>{
          if(ele.activationStatus===true){
            this.activeData="Active";
          }
          else{
            this.activeData="Deleted"
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
  onContextMenu(event: MouseEvent, item: ReservationStopDetails) {
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
      this.loadData();   
     } 
  }

  ReservationStopDetailsDriverRestriction(row) {
    this.router.navigate([
      '/reservationStopDetailsDriverRestriction',  
    ],
    {
      queryParams: {
        ReservationStopDetailsID: row.reservationStopDetailsID,
        ReservationStopDetailsName: row.reservationStopDetailsName,       
      }
    }); 
  }

  ReservationStopDetailsDrivingLicense(row) {
    this.router.navigate([
      '/reservationStopDetailsDrivingLicense',  
    ],
    {
      queryParams: {
        ReservationStopDetailsID: row.reservationStopDetailsID,
        ReservationStopDetailsName: row.reservationStopDetailsName,       
      }
    }); 
  }

  ReservationStopDetailsAddress(row) {
    this.router.navigate([
      '/reservationStopDetailsAddress',  
    ],
    {
      queryParams: {
        ReservationStopDetailsID: row.reservationStopDetailsID,
        ReservationStopDetailsName: row.reservationStopDetailsName,       
      }
    });
  }

  ReservationStopDetailsInstruction(row) {
    this.router.navigate([
      '/reservationStopDetailsInstruction',  
    ],
    {
      queryParams: {
        ReservationStopDetailsID: row.reservationStopDetailsID,
        ReservationStopDetailsName: row.reservationStopDetailsName,       
      }
    }); 
  }

  reservationStopDetailsPreferedDriver(row) {
    this.router.navigate([
      '/reservationStopDetailsPreferedDriver',  
    ],
    {
      queryParams: {
        ReservationStopDetailsID: row.reservationStopDetailsID,
        ReservationStopDetailsName: row.reservationStopDetailsName,       
      }
    }); 
  }

  reservationStopDetailsTempVIP(row) {
    this.router.navigate([
      '/reservationStopDetailsTempVIP',  
    ],
    {
      queryParams: {
        ReservationStopDetailsID: row.reservationStopDetailsID,
        ReservationStopDetailsName: row.reservationStopDetailsName,   
            
      }
    }); 
  }

  // ReservationStopDetailsDrivingLicense(row) {
  //   this.router.navigate([
  //     '/reservationStopDetailsDrivingLicense',  
  //   ],
  //   {
  //     queryParams: {
  //       ReservationStopDetailsID: row.reservationStopDetailsID,
  //       ReservationStopDetailsName: row.reservationStopDetailsName,       
  //     }
  //   }); 
  // }

  reservationStopDetailsAlertMessages(row) {
    this.router.navigate([
      '/reservationStopDetailsAlertMessages',  
    ],
    {
      queryParams: {
        ReservationStopDetailsID: row.reservationStopDetailsID,
        ReservationStopDetailsName: row.reservationStopDetailsName,   
            
      }
    }); 
  }

  ReservationStopDetailsDocument(row) {
    this.router.navigate([
      '/reservationStopDetailsDocument',  
    ],
    {
      queryParams: {
        ReservationStopDetailsID: row.reservationStopDetailsID,
        ReservationStopDetailsName: row.reservationStopDetailsName,       
      }
    }); 
	
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
          if(this.MessageArray[0]=="ReservationStopDetailsCreate")
          {
            if(this.MessageArray[1]=="ReservationStopDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Person Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ReservationStopDetailsUpdate")
          {
            if(this.MessageArray[1]=="ReservationStopDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Person Updated ..!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ReservationStopDetailsDelete")
          {
            if(this.MessageArray[1]=="ReservationStopDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Person Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ReservationStopDetailsAll")
          {
            if(this.MessageArray[1]=="ReservationStopDetailsView")
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
    // this.reservationStopDetailsService.getTableDataSort(this.SearchName,
    //   this.SearchPrimary,
    //   this.SearchBilling,
    //   this.customerGroup_ID,
    //   this.SearchActivationStatus, 
    //   this.PageNumber,
    //   coloumName.active,
    //   this.sortType).subscribe
    // (
    //   data =>   
    //   {
    //     this.dataSource = data;
    //   },
    //   (error: HttpErrorResponse) => { this.dataSource = null;}
    // );
  }


  openSearchDialog() {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any) {
    SearchData();
    dialogRef.close();
  }

}



