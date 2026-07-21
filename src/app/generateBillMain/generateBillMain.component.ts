// @ts-nocheck
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GenerateBillMainService } from './generateBillMain.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GenerateBillMainModel } from './generateBillMain.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../generateBillMain/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import moment from 'moment';

@Component({
  standalone: false,
  selector: 'app-generateBillMain',
  templateUrl: './generateBillMain.component.html',
  styleUrls: ['./generateBillMain.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class GenerateBillMainComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'invoiceNumberWithPrefix',
    'customerName',
    'billDate',
    //'vehicleName',
    'startDate',
    'endDtate',
    'placeOfSupply',
    'invoiceTotalAmount',
    'status',
    'actions'
  ];
  dataSource: GenerateBillMainModel[] | null;
  hasSearched = false;
  isLoading = false;
  advanceTable: GenerateBillMainModel | null;
  SearchCustomer: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  invoiceID: any;
  menuItems: any[] = [
    { label: 'Add Details', tooltip: 'Add Details' },
  ];
  SearchInvoiceNumberWithPrefix: string='';
  SearchBillDate: string = '';

  SearchStartDate: string = '';
  startDate : FormControl = new FormControl();

  SearchEndDate: string = '';
  endDate : FormControl = new FormControl();
  SearchGuset: string='';
    
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public generateBillMainService: GenerateBillMainService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public router:Router,
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  private loadDataSubscription?: Subscription;
  private updateSubscription?: Subscription;

  ngOnInit() 
  {
    this.SubscribeUpdateService();
  }

  ngOnDestroy() {
    this.loadDataSubscription?.unsubscribe();
    this.updateSubscription?.unsubscribe();
  }

  private formatSearchDate(value: string | Date | null | undefined): string {
    if (value === '' || value == null) {
      return '';
    }
    return moment(value).format('YYYY-MM-DD');
  }

  private buildSearchParams() {
    const guest = (this.SearchGuset || '').trim();
    const invoiceNumber = (this.SearchInvoiceNumberWithPrefix || '').replace('/', '-');
    return {
      customer: (this.SearchCustomer || '').trim(),
      invoiceNumber,
      guest,
      billDate: this.SearchBillDate || '',
      startDate: this.formatSearchDate(this.SearchStartDate),
      endDate: this.formatSearchDate(this.SearchEndDate),
      activationStatus: this.SearchActivationStatus
    };
  }

  isIrnGenerated(row: any): boolean {
    if (!row) {
      return false;
    }
    const status = row.irnStatus ?? row.IRNStatus ?? '';
    if (status === 'Generated') {
      return true;
    }
    const irn = row.irn ?? row.IRN ?? '';
    return typeof irn === 'string' && irn.trim().length > 0;
  }

  refresh(reload = false) 
  {
    this.SearchCustomer = '';
    this.SearchInvoiceNumberWithPrefix = '';
    this.SearchGuset = '';
    this.SearchBillDate = '';
    this.SearchStartDate = '';
    this.SearchEndDate = '';
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    if (reload) {
      this.hasSearched = true;
      this.loadData();
    } else {
      this.hasSearched = false;
      this.dataSource = null;
    }
  }

  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      width: '600px',
      hasBackdrop: true,
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
    });
     dialogRef.afterClosed().subscribe((invoiceNo) => {
    if (invoiceNo) {
      this.SearchInvoiceNumberWithPrefix = invoiceNo;
      this.PageNumber = 0;
      this.loadData();
    }
  });

  }

  editCall(row) 
  {
    this.invoiceID = row.id;
    const dialogRef = this.dialog.open(FormDialogComponent, {
    data: 
    {
      advanceTable: row,
      action: 'edit'
    }
    });
  }

deleteItem(row)
{
  this.invoiceID = row.id;
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
    if (this.isLoading) {
      return;
    }
    this.PageNumber = 0;
    this.loadData();
  }

  openInNewTab(menuItem: any, rowItem: any) 
  {
    let baseUrl = this._generalService.FormURL;   
    if(menuItem.label.toLowerCase() === 'add details') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/generalBill'], { queryParams: {
        invoiceID: rowItem.invoiceID,
        invoiceNumberWithPrefix: rowItem.invoiceNumberWithPrefix,
        cgstRate: rowItem.cgstRate,
        cgstAmount: rowItem.cgstAmount,
        sgstRate: rowItem.sgstRate,
        sgstAmount: rowItem.sgstAmount,
        igstRate: rowItem.igstRate,
        igstAmount: rowItem.igstAmount
      } }));
      window.open(baseUrl + url, '_blank'); 
    }  
  }

  ViewBill(item) {
    const baseUrl = this._generalService.FormURL;
    const url = this.router.serializeUrl(this.router.createUrlTree(['/generalBillDetails'], {
      queryParams: {
        invoiceID: item.invoiceID
      }
    }));
    window.open(baseUrl + url, '_blank');
  }

  openAttachDetachForEdit(item: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/invoiceAttachDetach'], {
        queryParams: {
          invoiceNumberWithPrefix: item.invoiceNumberWithPrefix,
          invoiceID: item.invoiceID
        }
      })
    );
    window.open(this._generalService.FormURL + url, '_blank');
  }

   public loadData() 
   {
    if (this.isLoading) {
      return;
    }
    this.hasSearched = true;
    this.isLoading = true;
    const params = this.buildSearchParams();
    this.loadDataSubscription?.unsubscribe();
    this.loadDataSubscription = this.generateBillMainService
      .getTableData(
        params.customer,
        params.invoiceNumber,
        params.guest,
        params.billDate,
        params.startDate,
        params.endDate,
        params.activationStatus,
        this.PageNumber
      )
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe(
        data => {
          this.dataSource = data;
        },
        (_error: HttpErrorResponse) => {
          this.dataSource = null;
        }
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
  onContextMenu(event: MouseEvent, item: GenerateBillMainModel) {
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

  SubscribeUpdateService()
  {
    this.updateSubscription=this._generalService.getUpdate().subscribe
    (
      message => 
      { 
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="GenerateBillMainCreate")
          {
            if(this.MessageArray[1]=="GenerateBillMainView")
            {
              if(this.MessageArray[2]=="Success")
              {
                if (this.hasSearched) {
                  this.loadData();
                }
                this.showNotification(
                'snackbar-success',
                'Generate Bill Main Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="GenerateBillMainUpdate")
          {
            if(this.MessageArray[1]=="GenerateBillMainView")
            {
              if(this.MessageArray[2]=="Success")
              {
               if (this.hasSearched) {
                 this.loadData();
               }
               this.showNotification(
                'snackbar-success',
                'Generate Bill Main Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="GenerateBillMainDelete")
          {
            if(this.MessageArray[1]=="GenerateBillMainView")
            {
              if(this.MessageArray[2]=="Success")
              {
               if (this.hasSearched) {
                 this.loadData();
               }
               this.showNotification(
                'snackbar-success',
                'Generate Bill Main Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="GenerateBillMainAll")
          {
            if(this.MessageArray[1]=="GenerateBillMainView")
            {
              if(this.MessageArray[2]=="Failure")
              {
               if (this.hasSearched) {
                 this.loadData();
               }
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
               if (this.hasSearched) {
                 this.loadData();
               }
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
    if (!this.hasSearched || this.isLoading) {
      return;
    }
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    const params = this.buildSearchParams();
    this.isLoading = true;
    this.loadDataSubscription?.unsubscribe();
    this.loadDataSubscription = this.generateBillMainService
      .getTableDataSort(
        params.customer,
        params.invoiceNumber,
        params.guest,
        params.billDate,
        params.startDate,
        params.endDate,
        params.activationStatus,
        this.PageNumber,
        coloumName.active,
        this.sortType
      )
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe(
        data => {
          this.dataSource = data;
        },
        (_error: HttpErrorResponse) => {
          this.dataSource = null;
        }
      );
  }
}




