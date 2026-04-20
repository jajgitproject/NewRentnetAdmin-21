// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerFuelSurchargeService } from './customerFuelSurcharge.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerFuelSurcharge } from './customerFuelSurcharge.model';
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
@Component({
  standalone: false,
  selector: 'app-customerFuelSurcharge',
  templateUrl: './customerFuelSurcharge.component.html',
  styleUrls: ['./customerFuelSurcharge.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerFuelSurchargeComponent implements OnInit {
  displayedColumns = [
    'fuelSurchargePercentageStartDate',
    'fuelSurchargePercentageEndDate',
    'fuelSurchargePercentageOnPackage',
    'fuelSurchargePercentageOnExtraKM',
    'fuelSurchargePercentageOnExtraHour',
    'status',
    'actions'
  ];
  dataSource: CustomerFuelSurcharge[] | null;
  customerFuelSurchargeID: number;
  CustomerFuelSurchargeID: number=0;
  advanceTable: CustomerFuelSurcharge | null; 
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  customerContractMapping_ID:number;

  SearchStartDate: string = '';
  startDate : FormControl = new FormControl();

  SearchEndDate: string = '';
  endDate : FormControl = new FormControl();
  customer_Name: any;
  start_Date: any;
  end_Date: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerFuelSurchargeService: CustomerFuelSurchargeService,
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
      this.customerContractMapping_ID   = paramsData.CustomerContractMappingID;
       this.customer_Name=paramsData.CustomerName;
       this.start_Date=paramsData.StartDate;
       this.end_Date=paramsData.EndDate;
    });
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.SearchStartDate = '';
    this.SearchEndDate = '';
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
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          CustomerContractMappingID:this.customerContractMapping_ID,
          CustomerName:this.customer_Name,
          StartDate:this.start_Date,
          EndDate:this.end_Date
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerFuelSurchargeID = row.customerFuelSurchargeID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerContractMappingID:this.customerContractMapping_ID,
        CustomerName:this.customer_Name,
        StartDate:this.start_Date,
        EndDate:this.end_Date
      }
    });

  }
  deleteItem(row)
  {

    this.customerFuelSurchargeID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }
  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
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
      this.customerFuelSurchargeService.getTableData(this.CustomerFuelSurchargeID,this.customerContractMapping_ID,this.SearchStartDate,this.SearchEndDate,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerFuelSurcharge) {
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
          if(this.MessageArray[0]=="CustomerFuelSurchargeCreate")
          {
            if(this.MessageArray[1]=="CustomerFuelSurchargeView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Fuel Surcharge Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerFuelSurchargeUpdate")
          {
            if(this.MessageArray[1]=="CustomerFuelSurchargeView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Fuel Surcharge Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerFuelSurchargeDelete")
          {
            if(this.MessageArray[1]=="CustomerFuelSurchargeView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Fuel Surcharge Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerFuelSurchargeAll")
          {
            if(this.MessageArray[1]=="CustomerFuelSurchargeView")
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
    this.customerFuelSurchargeService.getTableDataSort(this.CustomerFuelSurchargeID,this.customerContractMapping_ID,this.SearchStartDate,this.SearchEndDate,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}





