// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ReservationGroupService } from './reservationGroup.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReservationGroup } from './reservationGroup.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../reservationGroup/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
@Component({
  standalone: false,
  selector: 'app-reservationGroup',
  templateUrl: './reservationGroup.component.html',
  styleUrls: ['./reservationGroup.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ReservationGroupComponent implements OnInit {
  displayedColumns = [
    'reservationGroupID',
    'customerName',
    'customerGroup',
    'customerpersonName',
    'employee.firstName',
    'numberOfBookings',
   
    // 'reservationStartDate',
    // 'reservationEndDate',
    'status',
    'actions'
  ];
  dataSource: ReservationGroup[] | null;
  reservationGroupID: number;
  advanceTable: ReservationGroup | null;
  searchStartDate: string = '';
  searchEndDate: string = '';
  SearchReservationGroup: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public reservationGroupService: ReservationGroupService,
    private snackBar: MatSnackBar,
    public router:Router,
      public route:ActivatedRoute,
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
    
  this.route.queryParams.subscribe(paramsData => {
    if (paramsData['reservationGroupID']) {
      const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(paramsData['reservationGroupID']));
      this.reservationGroupID = Number(this._generalService.decrypt(decodeURIComponent(encryptedReservationGroupID)));
    }
  });
 
    console.log(this.reservationGroupID);
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.searchStartDate = '';
    this.searchEndDate = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  addNew() {
    console.log( this.reservationGroupID);
    // this.reservationGroupID = 0; // Initialize reservationGroupID for new entry
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width:'1000px',
      data: {
        advanceTable: this.advanceTable,
        action: 'add',
         reservationGroupID: this.reservationGroupID
      }
    });
  }

  editCall(row: ReservationGroup) {
    this.reservationGroupID = row.reservationGroupID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width:'1000px',
      data: {
        advanceTable: row,
        action: 'edit',
         reservationGroupID: this.reservationGroupID
      }
    });
  }
deleteItem(row)
{
  this.reservationGroupID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: row
  });
}

shouldShowDeleteButton(item: any): boolean {
  return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
}
onBackPress(event) {
  if (event.keyCode === 8) 
  {
    this.loadData();
  }
}

  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }
   public loadData() 
   {
    if(this.searchStartDate!==""){
      this.searchStartDate=moment(this.searchStartDate).format('MMM DD yyyy');
    }
    if(this.searchEndDate!==""){
      this.searchEndDate=moment(this.searchEndDate).format('MMM DD yyyy');
    } 
    switch (this.selectedFilter)
    {
      case 'startDate':
        this.searchStartDate = this.searchTerm;
        break;
        case 'endDate':
        this.searchEndDate = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }  
      this.reservationGroupService.getTableData(this.searchStartDate, this.searchEndDate,this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data =>   
        {
          console.log(data);
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null;}
      );
  }

  groupDetails(row) 
  { 
    //this.reservationGroupID = row.reservationGroupID;
    const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(row.reservationGroupID.toString()));
    this.router.navigate(['/reservationGroupDetails'],{queryParams: {
      reservationGroupID: encryptedReservationGroupID,
      type: 'edit'
    
     }
   });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: ReservationGroup) {
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
    //this.SearchReservationGroup='';
    
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
          if(this.MessageArray[0]=="ReservationGroupCreate")
          {
            if(this.MessageArray[1]=="ReservationGroupView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Reservation Group Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ReservationGroupUpdate")
          {
            if(this.MessageArray[1]=="ReservationGroupView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Reservation Group Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ReservationGroupDelete")
          {
            if(this.MessageArray[1]=="ReservationGroupView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Reservation Group Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ReservationGroupAll")
          {
            if(this.MessageArray[1]=="ReservationGroupView")
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
    this.reservationGroupService.getTableDataSort(this.searchStartDate, this.searchEndDate,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      
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




