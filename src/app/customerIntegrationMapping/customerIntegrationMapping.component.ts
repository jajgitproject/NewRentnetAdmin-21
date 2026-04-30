//ts nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerIntegrationMappingService } from './customerIntegrationMapping.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerIntegrationMapping, CustomerIntegrationMappingForDropDown } from './customerIntegrationMapping.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../customerIntegrationMapping/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
@Component({
  standalone: false,
  selector: 'app-customerIntegrationMapping',
  templateUrl: './customerIntegrationMapping.component.html',
  styleUrls: ['./customerIntegrationMapping.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerIntegrationMappingComponent implements OnInit {
  displayedColumns = [
    'CustomerName',
    'TallyCode',
    'status',
    'actions'
  ];
  dataSource: CustomerIntegrationMapping[] | null;
  customerIntegrationMappingID: number;
  advanceTable: CustomerIntegrationMapping | null;
  SearchActivationStatus : boolean=true;
  
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  selectedFilter: string = 'search';
  searchTerm: any = '';
  private searchTerm$ = new Subject<string>();
  tallyCode:FormControl=new FormControl('');

  SearchTallyCode: string = '';
  SearchCustomer:string="";

  public CustomerList?: CustomerIntegrationMappingForDropDown[] = [];
  filteredCustomerOptions: Observable<CustomerIntegrationMappingForDropDown[]>;
  SearchCity: string = '';
  customer : FormControl = new FormControl();

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public customerIntegrationMappingService: CustomerIntegrationMappingService,
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
    this.loadData();
    this.InitCustomerAndTallyCode();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.selectedFilter='search';
    this.customer.setValue('');
    this.SearchCustomer='';
    this.SearchTallyCode='';
    this.searchTerm='';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  InitCustomerAndTallyCode(){
      this.customerIntegrationMappingService.GetCustomerAndTallyCode().subscribe(
        data=>
        {
          this.CustomerList=data;
          this.filteredCustomerOptions = this.customer.valueChanges.pipe(
            startWith(""),
            map(value => this._filterCustomer(value || ''))
          ); 
        });
    }
    private _filterCustomer(value: string): any {
      const filterValue = value.toLowerCase();
      // if (filterValue.length < 3) {
      //   return [];
      // }
      return this.CustomerList.filter(
        customer =>
        {
          return customer.customerName.toLowerCase().indexOf(filterValue)===0;
        }
      );
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
  this.customerIntegrationMappingID = row.id;
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit'
    }
  });

}
deleteItem(row)
{
  this.customerIntegrationMappingID = row.id;
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
    const typedSearch = this.normalizeText(this.searchTerm);
    switch (this.selectedFilter)
    {
      case 'customer':
        this.SearchCustomer = typedSearch;
        this.SearchTallyCode = '';
        break;


      case 'TallyCode':
        this.SearchTallyCode = typedSearch;
        this.SearchCustomer = '';
        break;

      default:
        if (typedSearch) {
          this.SearchCustomer = typedSearch;
          this.SearchTallyCode = '';
        }
        break;
    }
      this.customerIntegrationMappingService.getTableData(this.SearchCustomer,this.SearchTallyCode,this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data =>   
        {
          this.dataSource = data;
          console.log(this.dataSource);
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
  onContextMenu(event: MouseEvent, item: CustomerIntegrationMapping) {
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
    this.PageNumber = 0;
    this.selectedFilter = 'search';
    this.SearchCustomer = this.normalizeText(this.customer.value);
    this.SearchTallyCode = this.normalizeText(this.SearchTallyCode);
    this.searchTerm = '';
    this.loadData();
    //this.SearchCustomerIntegrationMapping='';
    
  }

  private normalizeText(value: any): string {
    return (value ?? '').toString().trim();
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
          if(this.MessageArray[0]=="CustomerIntegrationMappingCreate")
          {
            if(this.MessageArray[1]=="CustomerIntegrationMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'CustomerIntegrationMapping Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerIntegrationMappingUpdate")
          {
            if(this.MessageArray[1]=="CustomerIntegrationMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'CustomerIntegrationMapping Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerIntegrationMappingDelete")
          {
            if(this.MessageArray[1]=="CustomerIntegrationMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'CustomerIntegrationMapping Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerIntegrationMappingAll")
          {
            if(this.MessageArray[1]=="CustomerIntegrationMappingView")
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
    this.customerIntegrationMappingService.getTableDataSort(this.SearchCustomer,this.SearchTallyCode,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



