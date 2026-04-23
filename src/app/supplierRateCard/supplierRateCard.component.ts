// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SupplierRateCardService } from './supplierRateCard.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SupplierRateCard } from './supplierRateCard.model';
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
import { ActivatedRoute, Route, Router } from '@angular/router';
interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}

@Component({
  standalone: false,
  selector: 'app-supplierRateCard',
  templateUrl: './supplierRateCard.component.html',
  styleUrls: ['./supplierRateCard.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SupplierRateCardComponent implements OnInit {
  displayedColumns = [
    'supplierRateCardName',
    'status',
    'actions'
  ];
  dataSource: SupplierRateCard[] | null;
  supplierRateCardID: number;
  advanceTable: SupplierRateCard | null;
  SearchName: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  supplier_ID: any;
  supplier_Name: any;
  supplierRateCardName: any;
  supplierID: any;
  supplierName: any;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public router:Router,
    public supplierRateCardService: SupplierRateCardService,
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
      this.supplier_ID   = paramsData.SupplierID;
      this.supplier_Name   = paramsData.SupplierName;
    });
    this.loadData();
    
 this.menuItems.sort((a, b) => a.label.localeCompare(b.label));
    this.SubscribeUpdateService();
  }
  refresh() {
    this.SearchName = '';
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
          action: 'add'
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.supplierRateCardID = row.supplierRateCardID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });

  }
  deleteItem(row)
  {

    this.supplierRateCardID = row.id;
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
      this.supplierRateCardService.getTableData(this.SearchName,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: SupplierRateCard) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  menuItems: any[] = [ 
    { label: 'Supplier Contract', route: '/supplierContract', tooltip: 'Supplier Contract' },
    { label: 'Supplier Rate Card Supplier Mapping', route: '/supplierRateCardSupplierMapping', tooltip: 'Supplier Rate Card Supplier Mapping' }
  ];
  
  openInNewTab(menuItem: any, rowItem: any) {
    let baseUrl = this._generalService.FormURL;
    if(menuItem.label.toLowerCase() === 'supplier contract') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContract'], { queryParams: {
        SupplierRateCardID: rowItem.supplierRateCardID,
              SupplierRateCardName:rowItem.supplierRateCardName,
              SupplierName:this.supplier_Name
      } }));
      window.open(baseUrl + url, '_blank'); 
    } else if(menuItem.label.toLowerCase() === 'supplier rate card supplier mapping') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierRateCardSupplierMapping'], { queryParams: {
        SupplierID: this.supplier_ID ,
      SupplierName:this.supplier_Name

      } }));
      window.open(baseUrl + url, '_blank'); 
    }
  }
  
  // supplierContract(row) {
   
  //   this.supplierRateCardID = row.supplierRateCardID;
  //   this.supplierRateCardName=row.supplierRateCardName;
  //   this.router.navigate([
  //     '/supplierContract',       
     
  //   ],{
  //     queryParams: {
  //       SupplierRateCardID: this.supplierRateCardID,
  //       SupplierRateCardName:this.supplierRateCardName,
  //       SupplierName:this.supplier_Name
  //     }
  //   });
  // }
  // supplierMapping(row) {
   
  //   alert(row.vendorID);
  //   this.router.navigate([
  //     '/supplierRateCardSupplierMapping',     
      
  //   ],
  //   {
  //     queryParams: {
  //       SupplierID: this.supplier_ID ,
  //       SupplierName:this.supplier_Name
  //     }
  //   });  
  // }
  
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
          if(this.MessageArray[0]=="SupplierRateCardCreate")
          {
            if(this.MessageArray[1]=="SupplierRateCardView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Supplier Rate Card Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierRateCardUpdate")
          {
            if(this.MessageArray[1]=="SupplierRateCardView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Rate Card Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierRateCardDelete")
          {
            if(this.MessageArray[1]=="SupplierRateCardView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Rate Card Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierRateCardAll")
          {
            if(this.MessageArray[1]=="SupplierRateCardView")
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
    this.supplierRateCardService.getTableDataSort(this.SearchName,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



