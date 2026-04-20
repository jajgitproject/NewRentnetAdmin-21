// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { InventoryTargetService } from './inventoryTarget.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InventoryTarget } from './inventoryTarget.model';
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
import { InventoryTargetDropDown } from './inventoryTargetDropDown.model';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
@Component({
  standalone: false,
  selector: 'app-inventoryTarget',
  templateUrl: './inventoryTarget.component.html',
  styleUrls: ['./inventoryTarget.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class InventoryTargetComponent implements OnInit {
  displayedColumns = [
    'registrationNumber',
    'monthlyTarget',
    'dailyTarget',
    'startDate',
    'endDate',
    'activationStatus',
    'actions'
  ];
  dataSource: InventoryTarget[] | null;
  inventoryTargetID: number;
  advanceTable: InventoryTarget | null;
  SearchActivationStatus : boolean = true;
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;
  activeData: string;
  public InventoryTargetList?: InventoryTargetDropDown[] = [];

  SearchdailyTarget: string = '';
  Search : FormControl = new FormControl();

  SearchmonthlyTarget: string = '';
  monthlyTarget : FormControl = new FormControl();

  SearchStartDate: string = '';
  startDate : FormControl = new FormControl();

  SearchEndDate: string = '';
  endDate : FormControl = new FormControl();
  vehicleCategoryID: any;
  vehicleCategory: any;
  SearchinventoryTargetID!: number;
  inventoryID: any;
  registrationNumber: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public inventoryTargetService: InventoryTargetService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
    public router:Router,
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
      // this.inventoryID = paramsData.InventoryID;
      // this.registrationNumber = paramsData.RegNo;
      const encryptedInventoryID = paramsData.InventoryID;
const encryptedRegNo = paramsData.RegNo;

if (encryptedInventoryID && encryptedRegNo) {
  this.inventoryID = this._generalService.decrypt(decodeURIComponent(encryptedInventoryID));
  this.registrationNumber = this._generalService.decrypt(decodeURIComponent(encryptedRegNo));
}

console.log(this.inventoryID, this.registrationNumber);

    })
    this.loadData();
    this.SubscribeUpdateService();
  }

  refresh() {
    this.SearchdailyTarget = '';
    this.SearchmonthlyTarget = '';
    this.SearchStartDate='';
    this.SearchEndDate='';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          inventoryID: this.inventoryID,
          registrationNumber: this.registrationNumber,
          action: 'add',
        
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.inventoryTargetID = row.id;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        inventoryID: this.inventoryID,
        registrationNumber: this.registrationNumber,
        action: 'edit'
      }
    });

  }
  deleteItem(row)
  {

    this.inventoryTargetID = row.id;
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

  onBackPress(event) 
  {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
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
      case 'monthlyTarget':
        this.SearchmonthlyTarget = this.searchTerm;
        break;
      case 'dailyTarget':
        this.SearchdailyTarget = this.searchTerm;
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
      this.inventoryTargetService.getTableData(this.inventoryID,
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
        this.dataSource.forEach((ele)=>{
          if(ele.activationStatus===true){
            this.activeData="Active";
          }
          if(ele.activationStatus===false){
            this.activeData="Deleted";
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
  onContextMenu(event: MouseEvent, item: InventoryTarget) {
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
          if(this.MessageArray[0]=="InventoryTargetCreate")
          {
            if(this.MessageArray[1]=="InventoryTargetView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Inventory Target Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InventoryTargetUpdate")
          {
            if(this.MessageArray[1]=="InventoryTargetView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Inventory Target Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InventoryTargetDelete")
          {
            if(this.MessageArray[1]=="InventoryTargetView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Inventory Target Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InventoryTargetAll")
          {
            if(this.MessageArray[1]=="InventoryTargetView")
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
    this.inventoryTargetService.getTableDataSort(this.inventoryID,
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




