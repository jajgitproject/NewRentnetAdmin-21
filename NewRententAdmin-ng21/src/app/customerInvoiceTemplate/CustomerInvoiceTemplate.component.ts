// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../customerInvoiceTemplate/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { CustomerInvoiceTemplate } from './CustomerInvoiceTemplate.model';
import { CustomerInvoiceTemplateService } from './CustomerInvoiceTemplate.service';
import { ActivatedRoute } from '@angular/router';
import { InvoiceTemplateDropDown } from '../invoiceTemplate/invoiceTemplateDropDown.model';

@Component({
  standalone: false,
  selector: 'app-customerInvoiceTemplate',
  templateUrl: './customerInvoiceTemplate.component.html',
  styleUrls: ['./customerInvoiceTemplate.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerInvoiceTemplateComponent implements OnInit {
  displayedColumns = [
    'invoiceTemplateName',
    'startDate',
    'endDate',
    'status',
    'actions'
  ];
  dataSource: CustomerInvoiceTemplate[] | null;
  invoiceTemplateID: number;
  advanceTable: CustomerInvoiceTemplate | null;
  SearchInvoiceTemplateName: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  customer_Name: any;
  customer_ID: any;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;
  customerInvoiceTemplateID: any;
  filteredInvoiceTemplateOptions:Observable<InvoiceTemplateDropDown[]>;
  public InvoiceTemplateList?:InvoiceTemplateDropDown[]=[];
  invoiceTemplateName = new FormControl();

  constructor(
    public route:ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public customerInvoiceTemplateService: CustomerInvoiceTemplateService,
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
      const encryptedCustomerID = paramsData.CustomerID;
    const encryptedCustomerName = paramsData.CustomerName;
    
    if (encryptedCustomerID && encryptedCustomerName) {
      
        this.customer_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerID));
        this.customer_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerName));
      }
     
    });
    this.InitInvoice();
    this.loadData();
    this.SubscribeUpdateService();
  }

  InitInvoice(){
    this._generalService.getInvoice().subscribe(
      data=>
      {
        this.InvoiceTemplateList=data;
        this.filteredInvoiceTemplateOptions = this.invoiceTemplateName.valueChanges.pipe(
          startWith(""),
          map(value => this._filterInvoice(value || ''))
        ); 
      });
  }
  private _filterInvoice(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.InvoiceTemplateList.filter(
      customer => 
      {
        return customer.invoiceTemplateName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  
refresh() {
  this.invoiceTemplateName.setValue('');
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
          action: 'add',
          CustomerID:this.customer_ID,
          CustomerName:this.customer_Name
        }
    });
  }

  editCall(row) {
    //  alert(row.id);
  this.customerInvoiceTemplateID = row.id;
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit',
      CustomerID:this.customer_ID,
      CustomerName:this.customer_Name
    }
  });

}
deleteItem(row)
{
  this.customerInvoiceTemplateID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: row
  });
}
onBackPress(event) {
  if (event.keyCode === 8) 
  {
    this.loadData();
  }
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

    switch (this.selectedFilter)
    {
     
      case 'invoiceTemplateName':
        this.invoiceTemplateName.setValue(this.searchTerm);
        break;
       
      default:
        this.searchTerm = '';
        break;
    }
      this.customerInvoiceTemplateService.getTableData(this.customer_ID,this.invoiceTemplateName.value,this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data =>   
        {
          this.dataSource = data;
         
          // this.dataSource.forEach((ele)=>{
          //   if(ele.activationStatus===true){
          //    this.activation="Active"
          //   }
          //   if(ele.activationStatus===false){
          //     this.activation="Deleted"
          //    }
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
  onContextMenu(event: MouseEvent, item: CustomerInvoiceTemplate) {
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
    //this.SearchInvoiceTemplate='';
    
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
          if(this.MessageArray[0]=="InvoiceTemplateCreate")
          {
            if(this.MessageArray[1]=="InvoiceTemplateView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'InvoiceTemplate Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InvoiceTemplateUpdate")
          {
            if(this.MessageArray[1]=="InvoiceTemplateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'InvoiceTemplate Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InvoiceTemplateDelete")
          {
            if(this.MessageArray[1]=="InvoiceTemplateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'InvoiceTemplate Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InvoiceTemplateAll")
          {
            if(this.MessageArray[1]=="InvoiceTemplateView")
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
    this.customerInvoiceTemplateService.getTableDataSort(this.customer_ID,this.invoiceTemplateName.value,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



