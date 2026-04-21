// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DailyReportService } from './dailyReport.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DailyReport } from './dailyReport.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
@Component({
  standalone: false,
  selector: 'app-dailyReport',
  templateUrl: './dailyReport.component.html',
  styleUrls: ['./dailyReport.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DailyReportComponent implements OnInit {
  displayedColumns = [
     'registrationNumber',
    'monthName',
    //'year',
    'reservationID',
    'numberOfDuties',
    'dateInDutySlip',
    'driverName',
    'AchievedTargetAmount',
    'activationStatus',
    'actions'
  ];
  dataSource: DailyReport[] | null;
  dailyReportDetailsID: number;
  advanceTable: DailyReport | null;
  SearchDailyReportType: string = '';
  SearchDailyReport: string = '';
  SearchDailyReportValue: string = '';
  searchReservationNo:string='';
  inventory : FormControl=new FormControl();
  // SearchDailyReportValue: string = '';
  // SearchDailyReport: number = 0;
  public VehicleList?: VehicleDropDown[] = [];
  SearchActivationStatus :boolean=true;
  PageNumber: number = 0;
  sortingData: number;
  sortType: string;
  activation:string;
  search : FormControl = new FormControl();
  searchcustomerConfigurationSEZStartDate: string = '';
  SearchDateInDutySlip: string = ''
  SearchDateInDutySlips: string = ''
  startDate : FormControl = new FormControl();
  endDate : FormControl = new FormControl();
  dailyReport: FormControl = new FormControl();
  dailyReportValue: FormControl = new FormControl();
  SearchregistrationNo: string ="";
  SearchMonthName: string;
  SearchYear: string;
  SearchReservationNo: string;
  SearchNumberOfDuties: string;
  S//earchDateInDutySlip: string;
  SearchDriverName: string;
  SearchAchievementTargetAmout: string;
  filteredVehicleOptions: Observable<any>;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dailyReportService: DailyReportService,
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
    this.initVehicle();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.SearchDateInDutySlip = '';
    this.SearchDateInDutySlips = '';
    this.SearchregistrationNo = '';
    this.SearchActivationStatus = true;
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
  editCall(row) {
      //  alert(row.id);
    this.dailyReportDetailsID
 = row.id;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });

  }
  deleteItem(row)
  {

    this.dailyReportDetailsID
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
    
      if(this.SearchDateInDutySlip!==""){
        this.SearchDateInDutySlip=moment(this.SearchDateInDutySlip).format('MMM DD yyyy');
      }
      if(this.SearchDateInDutySlips!==""){
        this.SearchDateInDutySlips=moment(this.SearchDateInDutySlips).format('MMM DD yyyy');
      } 
      if(this.SearchregistrationNo!==""){
        this.SearchregistrationNo = this.SearchregistrationNo.split('-')[0]
  
      }
      
      this.dailyReportService.getTableData(this.SearchDateInDutySlip, this.SearchDateInDutySlips,this.SearchregistrationNo, this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;
        this.dataSource.forEach((ele)=>{
          if(ele.activationStatus===true){
           this.activation="Active"
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
  onContextMenu(event: MouseEvent, item: DailyReport) {
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

  initVehicle(){
    this._generalService.GetVehicleAsInventory().subscribe(
      data=>
      {
        this.VehicleList=data;
        this.filteredVehicleOptions = this.inventory.valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicle(value || ''))
        ); 
      });
  }
  private _filterVehicle(value: string): any {
    const filterValue = value.toLowerCase();
    return this.VehicleList.filter(
      customer => 
      {
        return customer.vehicle.toLowerCase().indexOf(filterValue)===0;
      }
    );
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
          if(this.MessageArray[0]=="DailyReportCreate")
          {
            if(this.MessageArray[1]=="DailyReportView")
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
          else if(this.MessageArray[0]=="DailyReportUpdate")
          {
            if(this.MessageArray[1]=="DailyReportView")
            {
              if(this.MessageArray[2]=="Success")
              {
                debugger;
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
          else if(this.MessageArray[0]=="DailyReportDelete")
          {
            if(this.MessageArray[1]=="DailyReportView")
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
          else if(this.MessageArray[0]=="DailyReportAll")
          {
            if(this.MessageArray[1]=="DailyReportView")
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
    this.dailyReportService.getTableDataSort(this.SearchDateInDutySlip, this.SearchDateInDutySlips,this.SearchregistrationNo, this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




