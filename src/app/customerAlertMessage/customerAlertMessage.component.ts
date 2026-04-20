// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomerAlertMessageService } from './customerAlertMessage.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerAlertMessage, CustomerAlertMessageTypeForDropDown } from './customerAlertMessage.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../customerAlertMessage/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-customerAlertMessage',
  templateUrl: './customerAlertMessage.component.html',
  styleUrls: ['./customerAlertMessage.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerAlertMessageComponent implements OnInit {
  displayedColumns = [
    'customer',
     'CustomerAlertMessage',
    'CustomerAlertMessageType',
    'customerAlertMessageDocument',
    'EmployeeName',
    'StartDate',
    'EndDate',
    'status',
    'actions'
  ];
  dataSource: CustomerAlertMessage[] | null;
  customerAlertMessageID: number;
  advanceTable: CustomerAlertMessage | null;
  SearchCustomerAlertMessageType: FormControl = new FormControl();
  SearchEmployeeName: FormControl = new FormControl();
  SearchCustomerAlertMessage:string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  customer_ID: any;
  customer_Name: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;

  public CustomerAlertMessageTypeList?: CustomerAlertMessageTypeForDropDown[] = [];
  filteredCustomerAlertMessageTypeOptions: Observable<CustomerAlertMessageTypeForDropDown[]>;
  CustomerName: any;

  constructor(
    public route:ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public customerAlertMessageService: CustomerAlertMessageService,
    private snackBar: MatSnackBar,
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
      const encryptedCustomerID = paramsData.CustomerID;
    const encryptedCustomerName = paramsData.CustomerName;
    
    if (encryptedCustomerID && encryptedCustomerName) {
      
        this.customer_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerID));
        this.customer_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerName));
      }
      this.CustomerName = this.customer_Name.split("##")[0];
      console.log(this.CustomerName)      
    });
    this.loadData();
    this.SubscribeUpdateService();
    this.InitCustomerAlertMessageType();
  }

  refresh()
  {
    this.SearchCustomerAlertMessage = '';
    this.SearchCustomerAlertMessageType.setValue('');
    this.SearchEmployeeName.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  InitCustomerAlertMessageType(){
    this._generalService.getCustomerAlertMessgaeType().subscribe(
      data=>
      {
        this.CustomerAlertMessageTypeList=data;
        this.filteredCustomerAlertMessageTypeOptions =this.SearchCustomerAlertMessageType.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomerAlertMessageType(value || ''))
        ); 
      });
  }
  
  private _filterCustomerAlertMessageType(value: string): any {
  const filterValue = value.toLowerCase();
  return this.CustomerAlertMessageTypeList.filter(
    data => 
    {
      return data.customerAlertMessageType.toLowerCase().indexOf(filterValue)===0;
    });
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
  this.customerAlertMessageID = row.id;
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
  this.customerAlertMessageID = row.id;
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
      case 'alertMessage':
        this.SearchCustomerAlertMessage = this.searchTerm;
        break;
      case 'alertMessageType':
        this.SearchCustomerAlertMessageType.setValue(this.searchTerm);
        break;
        case 'employeeName':
        this.SearchEmployeeName.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.customerAlertMessageService.getTableData(this.customer_ID,this.CustomerName,this.SearchEmployeeName.value,this.SearchCustomerAlertMessageType.value,this.SearchCustomerAlertMessage,this.SearchActivationStatus, this.PageNumber).subscribe
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

  onContextMenu(event: MouseEvent, item: CustomerAlertMessage) {
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
    //this.SearchCustomerAlertMessage='';
    
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
          if(this.MessageArray[0]=="CustomerAlertMessageCreate")
          {
            if(this.MessageArray[1]=="CustomerAlertMessageView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Alert Message Type Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAlertMessageUpdate")
          {
            if(this.MessageArray[1]=="CustomerAlertMessageView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Alert Message Type Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAlertMessageDelete")
          {
            if(this.MessageArray[1]=="CustomerAlertMessageView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Alert Message Type Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAlertMessageAll")
          {
            if(this.MessageArray[1]=="CustomerAlertMessageView")
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
    this.customerAlertMessageService.getTableDataSort(this.customer_ID,this.customer_Name,this.SearchEmployeeName.value,this.SearchCustomerAlertMessageType.value,this.SearchCustomerAlertMessage,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
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



