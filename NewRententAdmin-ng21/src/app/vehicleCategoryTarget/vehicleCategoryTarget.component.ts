// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VehicleCategoryTargetService } from './vehicleCategoryTarget.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VehicleCategoryTarget } from './vehicleCategoryTarget.model';
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
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { VehicleCategoryTargetDropDown } from './vehicleCategoryTargetDropDown.model';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
@Component({
  standalone: false,
  selector: 'app-vehicleCategoryTarget',
  templateUrl: './vehicleCategoryTarget.component.html',
  styleUrls: ['./vehicleCategoryTarget.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VehicleCategoryTargetComponent implements OnInit {
  displayedColumns = [
    'vehicleCategory',
    'monthlyTarget',
    'dailyTarget',
    'startDate',
    'endDate',
    'activationStatus',
    'actions'
  ];
  dataSource: VehicleCategoryTarget[] | null;
  vehicleCategoryTargetID: number;
  advanceTable: VehicleCategoryTarget | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;
  activeData: string;
  public VehicleCategoryTargetList?: VehicleCategoryTargetDropDown[] = [];

  SearchdailyTarget: string = '';
  SearchvehicleCategory: string = '';
  Search : FormControl = new FormControl();

  SearchmonthlyTarget: string = '';
  monthlyTarget : FormControl = new FormControl();
  SearchStartDate: string = '';
  startDate : FormControl = new FormControl();

  SearchEndDate: string = '';
  endDate : FormControl = new FormControl();
  vehicleCategoryID: any;
  vehicleCategory: any;
  SearchvehicleCategoryTargetID!: number;
  selectedFilter: string = 'search';
  searchTerm: any = '';
  filterSelected:boolean = true;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public vehicleCategoryTargetService: VehicleCategoryTargetService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
    public router:Router,
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
      // this.vehicleCategoryID = paramsData.VehicleCategoryID;
      // this.vehicleCategory = paramsData.VehicleCategory;
      const encryptedVehicleCategoryID = this.route.snapshot.queryParamMap.get('VehicleCategoryID');
  const encryptedVehicleCategory = this.route.snapshot.queryParamMap.get('VehicleCategory');

  // Check if the parameters exist
  if (encryptedVehicleCategoryID && encryptedVehicleCategory) {
    // Decrypt and decode the parameters
    this.vehicleCategoryID = this._generalService.decrypt(decodeURIComponent(encryptedVehicleCategoryID));
    this.vehicleCategory = decodeURIComponent(this._generalService.decrypt(encryptedVehicleCategory));

    // Log the decrypted values
    console.log("Decrypted Vehicle Category ID: ", this.vehicleCategoryID);
    console.log("Decrypted Vehicle Category: ", this.vehicleCategory);
  }

    })
    this.loadData();
    this.SubscribeUpdateService();
  }

  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

  refresh() {
    this.SearchdailyTarget = '';
    this.SearchmonthlyTarget = '';
    this.SearchStartDate='';
    this.SearchEndDate='';
    this.searchTerm='';
    this.selectedFilter ='search';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          vehicleCategoryID: this.vehicleCategoryID,
          vehicleCategory: this.vehicleCategory,
          action: 'add',
        
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.vehicleCategoryTargetID = row.id;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        vehicleCategoryID: this.vehicleCategoryID,
          vehicleCategory: this.vehicleCategory,
        action: 'edit'
      }
    });

  }
  deleteItem(row)
  {

    this.vehicleCategoryTargetID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
  }

  public SearchData()
  {
    this.loadData();    
  }
  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }
   public loadData() 
   {
      if(this.SearchStartDate!==""){
        this.SearchStartDate=moment(this.SearchStartDate).format('MMM DD yyyy');
      }
      if(this.SearchEndDate!==""){
        this.SearchEndDate=moment(this.SearchEndDate).format('MMM DD yyyy');
      } 

      switch (this.selectedFilter)
      {
        case 'vehicleCategory':
          this.SearchvehicleCategory = this.searchTerm;
          break;
        case 'dailyTarget':
          this.SearchdailyTarget = this.searchTerm;
          break;
        case 'monthlyTarget':
          this.SearchmonthlyTarget = this.searchTerm;
          break;
        case 'startDate':
          this.SearchStartDate = this.searchTerm;
          break;
        case 'endDate':
          this.SearchEndDate = this.searchTerm;
          break;
        default:
          this.searchTerm = '';
          break;
      }
      this.vehicleCategoryTargetService.getTableData( this.vehicleCategoryID,
        this.SearchvehicleCategory,
        this.SearchmonthlyTarget,
        this.SearchdailyTarget,
        this.SearchStartDate,
        this.SearchEndDate,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {      
        this.dataSource = data;
        //console.log(this.dataSource);
        // this.dataSource.forEach((ele)=>{
        //   if(ele.activationStatus===true){
        //     this.activeData="Active";
        //   }
        //   if(ele.activationStatus===false){
        //     this.activeData="Deleted";
        //   }
        // })
       
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
  onContextMenu(event: MouseEvent, item: VehicleCategoryTarget) {
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
  // public response: { dbPath: '' };
  // public ImagePath: string;
  // public uploadFinished = (event) => {
  // this.response = event;
  // this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
  // }
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
          if(this.MessageArray[0]=="VehicleCategoryTargetCreate")
          {
            if(this.MessageArray[1]=="VehicleCategoryTargetView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Vehicle Category Target Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VehicleCategoryTargetUpdate")
          {
            if(this.MessageArray[1]=="VehicleCategoryTargetView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vehicle Category Target Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VehicleCategoryTargetDelete")
          {
            if(this.MessageArray[1]=="VehicleCategoryTargetView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vehicle Category Target Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VehicleCategoryTargetAll")
          {
            if(this.MessageArray[1]=="VehicleCategoryTargetView")
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
    this.vehicleCategoryTargetService.getTableDataSort(this.vehicleCategoryID,this.SearchvehicleCategory,
      this.SearchmonthlyTarget,
      this.SearchdailyTarget,
      this.SearchStartDate,
      this.SearchEndDate,
      this.SearchActivationStatus, 
      this.PageNumber, 
      coloumName.active,
      this.sortType).subscribe
    (
      data =>   
      {
        //console.log(this.dataSource);
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




