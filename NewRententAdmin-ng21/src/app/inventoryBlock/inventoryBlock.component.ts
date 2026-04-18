// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InventoryBlockService } from './inventoryBlock.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InventoryBlock } from './inventoryBlock.model';
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
import { CurrencyDropDown } from '../general/currencyDropDown.model';
import { ActivatedRoute } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-inventoryBlock',
  templateUrl: './inventoryBlock.component.html',
  styleUrls: ['./inventoryBlock.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class InventoryBlockComponent implements OnInit {
  displayedColumns = [
   
    'inventoryBlockStartDate',
    //'exchangeDate',
    'inventoryBlockEndDate',
    'inventoryBlockReason',
    'reasonReference',
    'status',
    'actions'
  ];
  SearchStartDate: string = '';
  startDate : FormControl = new FormControl();

  SearchEndDate: string = '';
  endDate : FormControl = new FormControl();

  dataSource: InventoryBlock[] | null;
  inventoryBlockID: number;
  advanceTable: InventoryBlock | null;
  SearchName: string = '';
  CurrencyName :string='';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  ActiveStatus:any;
  inventoryID: any;
  regNo: any;
  public CurrencyList?: CurrencyDropDown[] = [];
  SearchMessage: string = '';
  exchangeRate : FormControl = new FormControl();

  SearchApplicableFrom: string = '';
  applicableFrom : FormControl = new FormControl();

  SearchApplicableTo: string = '';
  applicableTo : FormControl = new FormControl();

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public inventoryBlockService: InventoryBlockService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
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
      // this.inventoryID=paramsData.InventoryID;
      // this.regNo=paramsData.RegNo;
      const encryptedInventoryID = paramsData.InventoryID;
const encryptedRegNo = paramsData.RegNo;

if (encryptedInventoryID && encryptedRegNo) {
  this.inventoryID = this._generalService.decrypt(decodeURIComponent(encryptedInventoryID));
  this.regNo = this._generalService.decrypt(decodeURIComponent(encryptedRegNo));
}

console.log(this.inventoryID, this.regNo);

    });
    this.loadData();
    this.SubscribeUpdateService();
   
  }
  refresh() {
    this.SearchStartDate='',
    this.SearchEndDate='',
    this.SearchName='',
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  public SearchData()
  {
    this.loadData();
    //this.CurrencyName='';
    
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          InventoryID:this.inventoryID,
          RegNo:this.regNo
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.inventoryBlockID = row.inventoryBlockID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        InventoryID:this.inventoryID,
        RegNo:this.regNo
      }
    });
   
  }
  deleteItem(row)
  {

    this.inventoryBlockID = row.id;
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
      this.inventoryBlockService.getTableData(this.inventoryID,
         this.SearchStartDate,
        this.SearchEndDate,
        this.SearchName,
        this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
        this.dataSource.forEach((element)=>{
          if(element.activationStatus===true){
            this.ActiveStatus="Active"
          }
          else{
            this.ActiveStatus="Deleted"
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
  onContextMenu(event: MouseEvent, item: InventoryBlock) {
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
          if(this.MessageArray[0]=="InventoryBlockCreate")
          {
            if(this.MessageArray[1]=="InventoryBlockView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Inventory Block Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InventoryBlockUpdate")
          {
            if(this.MessageArray[1]=="InventoryBlockView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Inventory Block Updated Successfully...!!!',
                'bottom', 
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InventoryBlockDelete")
          {
            if(this.MessageArray[1]=="InventoryBlockView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Inventory Block Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InventoryBlockAll")
          {
            if(this.MessageArray[1]=="InventoryBlockView")
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
    debugger;
    if (this.sortingData == 1) {
     
      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.inventoryBlockService.getTableDataSort(this.inventoryID, this.SearchStartDate,
      this.SearchEndDate,this.SearchName,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {

        this.dataSource = data;
        this.dataSource.forEach((element)=>{
          if(element.activationStatus===true){
            this.ActiveStatus="Active"
          }
          else{
            this.ActiveStatus="Deleted"
          }
        })
      
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




