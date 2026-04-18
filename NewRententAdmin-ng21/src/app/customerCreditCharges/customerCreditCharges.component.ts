// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerCreditChargesService } from './customerCreditCharges.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerCreditChargesModel } from './customerCreditCharges.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../customerCreditCharges/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-customerCreditCharges',
  templateUrl: './customerCreditCharges.component.html',
  styleUrls: ['./customerCreditCharges.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerCreditChargesComponent implements OnInit {
  displayedColumns = [
    'customerCreditCardCharges',
    'igst',
    'cgst',
    'sgst',
    'cess',
    'startDate',
    'endDate',
    'status',
    'actions'
  ];
  dataSource: CustomerCreditChargesModel[] | null;
  bankID: number;
  advanceTable: CustomerCreditChargesModel | null;
  SearchCustomerCreditCharges: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  customerCreditCardChargesID: number;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;

  customer_ID: any;
  customer_Name: any;
  SearchIGSTPercentage : string = '';
  SearchCGSTPercentage : string = '';
  SearchSGStPercentage : string = '';
  SearchCessPercentage : string = '';
  SearchStartDate : string = '';
  SearchEndDate : string = '';

  constructor(
    public route:ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public customerCreditChargesService: CustomerCreditChargesService,
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
      console.log(this.customer_ID,this.customer_Name)      
    });
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.SearchCustomerCreditCharges = '';
    this.SearchIGSTPercentage = '';
    this.SearchCGSTPercentage = '';
    this.SearchSGStPercentage = '';
    this.SearchCessPercentage = '';
    this.SearchStartDate = '';
    this.SearchEndDate = '';
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
          CustomerID:this.customer_ID,
          CustomerName:this.customer_Name,
          action: 'add'
        }
    });
  }

  editCall(row) {
  this.customerCreditCardChargesID = row.id;
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      CustomerID:this.customer_ID,
      CustomerName:this.customer_Name,
      action: 'edit'
    }
  });

}

deleteItem(row)
{
  this.customerCreditCardChargesID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: row
  });
}

shouldShowDeleteButton(item: any): boolean {
  return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
}

onBackPress(event) 
{
  if (event.keyCode === 8) 
  {
    this.loadData();
  }
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
      case 'customerCreditCardCharges':
        this.SearchCustomerCreditCharges = this.searchTerm;
        break;
      case 'igst':
        this.SearchIGSTPercentage = this.searchTerm;
        break;
      case 'cgst':
        this.SearchCGSTPercentage = this.searchTerm;
        break;
      case 'sgst':
        this.SearchIGSTPercentage = this.searchTerm;
        break;
      case 'cess':
        this.SearchCessPercentage = this.searchTerm;
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
    this.customerCreditChargesService.getTableData(this.customer_ID,this.SearchCustomerCreditCharges,this.SearchIGSTPercentage,this.SearchCGSTPercentage,this.SearchIGSTPercentage,this.SearchCessPercentage,this.SearchStartDate,this.SearchEndDate,this.SearchActivationStatus, this.PageNumber).subscribe
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

  onContextMenu(event: MouseEvent, item: CustomerCreditChargesModel) {
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
    //this.SearchCustomerCreditCharges='';
    
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
          if(this.MessageArray[0]=="CustomerCreditChargesCreate")
          {
            if(this.MessageArray[1]=="CustomerCreditChargesView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Credit Charges Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerCreditChargesUpdate")
          {
            if(this.MessageArray[1]=="CustomerCreditChargesView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Credit Charges Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerCreditChargesDelete")
          {
            if(this.MessageArray[1]=="CustomerCreditChargesView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Credit Charges Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerCreditChargesAll")
          {
            if(this.MessageArray[1]=="CustomerCreditChargesView")
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
    this.customerCreditChargesService.getTableDataSort(this.customer_ID,this.SearchCustomerCreditCharges,this.SearchIGSTPercentage,this.SearchCGSTPercentage,this.SearchIGSTPercentage,this.SearchCessPercentage,this.SearchStartDate,this.SearchEndDate,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;      
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



