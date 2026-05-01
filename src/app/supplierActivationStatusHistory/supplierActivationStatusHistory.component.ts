// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SupplierActivationStatusHistoryService } from './supplierActivationStatusHistory.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SupplierActivationStatusHistory } from './supplierActivationStatusHistory.model';
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
import { ActivatedRoute } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-supplierActivationStatusHistory',
  templateUrl: './supplierActivationStatusHistory.component.html',
  styleUrls: ['./supplierActivationStatusHistory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SupplierActivationStatusHistoryComponent implements OnInit {
  displayedColumns = [
    'supplierName',
    'supplierStatus',
    'supplierStatusReason',
    'statusBy',
    'supplierStatusDate',
    'actions'
  ];
  dataSource: SupplierActivationStatusHistory[] | null;
  supplierActivationStatusHistoryID: number;
  advanceTable: SupplierActivationStatusHistory | null;
  supplierStatus: string = '';
  supplierStatusReason: string = '';
  supplierStatusByEmployeeName: string = '';
  supplierStatusDate: string = '';
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  supplierID: any;
  supplier_ID: any;
  supplier_Name: any;
  selectedFilter: string = 'search';
  searchTerm: any = '';
  filterSelected:boolean = true;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public supplierActivationStatusHistoryService: SupplierActivationStatusHistoryService,
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
      // this.supplier_ID   = paramsData.SupplierID;
      // this.supplier_Name   = paramsData.SupplierName;
      if (paramsData.SupplierID && paramsData.SupplierName) {
        const encryptedSupplierID = decodeURIComponent(paramsData.SupplierID);
        const encryptedSupplierName = decodeURIComponent(paramsData.SupplierName);
      
        if (encryptedSupplierID && encryptedSupplierName) {
          this.supplier_ID = this._generalService.decrypt(encryptedSupplierID);
          this.supplier_Name = decodeURIComponent(this._generalService.decrypt(encryptedSupplierName));  // Decode again after decryption
        }
      }
      
      
    });
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.supplierStatus = '';
    this.supplierStatusReason = '';
  this.supplierStatusByEmployeeName= '';
  this.supplierStatusDate = '';
  this.searchTerm='';
    this.selectedFilter ='search';
    this.PageNumber=0;
    this.loadData();
  }

  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
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
          SUPPLIERID:this.supplier_ID,
          SUPPLIERNAME:this.supplier_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.supplierActivationStatusHistoryID = row.supplierActivationStatusHistoryID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });

  }
  deleteItem(row)
  {

    this.supplierActivationStatusHistoryID = row.id;
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
    
    switch (this.selectedFilter)
    {
      
      case 'supplierStatus':
        this.supplierStatus = this.searchTerm;
        break;
      case 'supplierStatusReason':
        this.supplierStatusReason = this.searchTerm;
        break;
      case 'supplierStatusByEmployeeName':
        this.supplierStatusByEmployeeName = this.searchTerm;
        break;
      case 'supplierStatusDate':
        this.supplierStatusDate = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }

      this.supplierActivationStatusHistoryService.getTableData(this.supplierStatus,this.supplier_ID,this.supplierStatusReason,this.supplierStatusByEmployeeName,this.supplierStatusDate,this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: SupplierActivationStatusHistory) {
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
          if(this.MessageArray[0]=="SupplierActivationStatusHistoryCreate")
          {
            if(this.MessageArray[1]=="SupplierActivationStatusHistoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Supplier Activation Status History Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierActivationStatusHistoryUpdate")
          {
            if(this.MessageArray[1]=="SupplierActivationStatusHistoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Activation Status History Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierActivationStatusHistoryDelete")
          {
            if(this.MessageArray[1]=="SupplierActivationStatusHistoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Activation Status History Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierActivationStatusHistoryAll")
          {
            if(this.MessageArray[1]=="SupplierActivationStatusHistoryView")
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
    this.supplierActivationStatusHistoryService.getTableDataSort(this.supplierStatus,this.supplier_ID,this.supplierStatusReason,this.supplierStatusByEmployeeName,this.supplierStatusDate, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



