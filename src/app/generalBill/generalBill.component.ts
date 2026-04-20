// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { GeneralBillService } from './generalBill.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GeneralBillModel } from './generalBill.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../generalBill/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-generalBill',
  templateUrl: './generalBill.component.html',
  styleUrls: ['./generalBill.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class GeneralBillComponent implements OnInit {
  displayedColumns = [
    'narration',
    'rate',
    'quantity',
    'baseAmount',
    'uom',
    'sgstRate',
    'sgstAmount',
    'cgstRate',
    'cgstAmount',
    'igstRate',
    'igstAmount',
    'totalAmount',
    'status',
    'actions'
  ];
  dataSource: GeneralBillModel[] | null;
  generalBillID: number;
  advanceTable: GeneralBillModel | null;
  
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  selectedFilter: string = 'search';
  searchTerm: any = '';
  SearchNarration: string = '';
  SearchRate: string = '';
  SearchQuantity: string = '';
  SearchBaseAmount: string = '';
  SearchUOM: string = '';

  invoiceGeneralLineItemsID: any;
  invoiceID: any;
  cgstRate: any;
  cgstAmount: any;
  sgstRate: any;
  sgstAmount: any;
  igstRate: any;
  igstAmount: any;
  

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public generalBillService: GeneralBillService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public route:ActivatedRoute,
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  @ViewChild('searchDialog') searchDialog: TemplateRef<any>;
@ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    this.route.queryParams.subscribe(paramsData =>{
      this.invoiceID = paramsData.invoiceID;
      this.cgstRate = paramsData.cgstRate;
      this.cgstAmount = paramsData.cgstAmount;
      this.sgstRate = paramsData.sgstRate;
      this.sgstAmount = paramsData.sgstAmount;
      this.igstRate = paramsData.igstRate;
      this.igstAmount = paramsData.igstAmount;
     });
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.selectedFilter='search';
    this.searchTerm='';
    this.SearchNarration = '';
    this.SearchRate='';
    this.SearchQuantity='';
    this.SearchBaseAmount='';
    this.SearchUOM='';
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
          action: 'add',
          invoiceID:this.invoiceID,
          cgstRate:this.cgstRate,
          cgstAmount:this.cgstAmount,
          sgstRate:this.sgstRate,
          sgstAmount:this.sgstAmount,
          igstRate:this.igstRate,
          igstAmount:this.igstAmount
        }
    });
  }

  editCall(row) 
  {
    this.invoiceGeneralLineItemsID = row.id;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: 
      {
        advanceTable: row,
        action: 'edit',
        invoiceID:this.invoiceID,
        cgstRate:this.cgstRate,
        cgstAmount:this.cgstAmount,
        sgstRate:this.sgstRate,
        sgstAmount:this.sgstAmount,
        igstRate:this.igstRate,
        igstAmount:this.igstAmount
      }
    });
}

deleteItem(row)
{
  this.invoiceGeneralLineItemsID = row.id;
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

  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

  
   public loadData() 
   {
    if(this.invoiceID === undefined)
    {
      this.invoiceID = 0;
    }
    switch (this.selectedFilter)
    {
      case 'narration':
        this.SearchNarration = this.searchTerm;
        break;
      case 'rate':
        this.SearchRate = this.searchTerm;
        break;
      case 'quantity':
        this.SearchQuantity = this.searchTerm;
        break;
      case 'baseAmount':
        this.SearchBaseAmount = this.searchTerm;
        break;
      case 'uom':
        this.SearchUOM = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.generalBillService.getTableData(this.invoiceID,this.SearchNarration,this.SearchRate,this.SearchQuantity,this.SearchBaseAmount,this.SearchUOM,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: GeneralBillModel) {
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
    //this.SearchGeneralBill='';
    
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
          if(this.MessageArray[0]=="GeneralBillCreate")
          {
            if(this.MessageArray[1]=="GeneralBillView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'General Bill Line Item Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="GeneralBillUpdate")
          {
            if(this.MessageArray[1]=="GeneralBillView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'General Bill Line Item Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="GeneralBillDelete")
          {
            if(this.MessageArray[1]=="GeneralBillView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'General Bill Line Item Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="GeneralBillAll")
          {
            if(this.MessageArray[1]=="GeneralBillView")
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

  SortingData(coloumName:any) 
  {
    if(this.invoiceID === undefined)
    {
      this.invoiceID = 0;
    }
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.generalBillService.getTableDataSort(this.invoiceID,this.SearchNarration,this.SearchRate,this.SearchQuantity,this.SearchBaseAmount,this.SearchUOM,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
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



