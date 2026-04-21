// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerContractMappingService } from './customerContractMapping.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerContractMapping } from './customerContractMapping.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponentHolder } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import moment from 'moment';
import { EmployeeDropDown } from '../employee/employeeDropDown.model';
import { CustomerContractDropDown } from '../customerContract/customerContractDropDown.model';

interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}

@Component({
  standalone: false,
  selector: 'app-customerContractMapping',
  templateUrl: './customerContractMapping.component.html',
  styleUrls: ['./customerContractMapping.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerContractMappingComponent implements OnInit {
  displayedColumns = [
    'customerContractName',
    'validFrom',
    'negotiatedBy',

  //'GeoPoint.GeoPointName',
    'approvedBy',
    'actions'
  ];
  dataSource: CustomerContractMapping[] | null;
  customerContractMappingID: number;
  advanceTable: CustomerContractMapping | null;
  SearchCustomerContractMapping: string = ''; 
  SearchGstNumber: string='';
  SearchPercentage:string='';
  SearchbillingName:string='';
  gstNumber : FormControl = new FormControl();
  billingName : FormControl = new FormControl();
  percentage: FormControl = new FormControl();
  searchEntity: FormControl = new FormControl();
  SearchEntityType:string='';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;
  ActiveStatus: any;
  employee_ID:any;
  EmployeeID:number=0;
  SupplierContractID:number=1;
  public CityList?: CityDropDown[] = [];
  customer_ID: any;
  customer_Name: any;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;

  SearchEmployeeName: string = '';
  next : FormControl = new FormControl();

  customerContractID: string = '';
  search: FormControl = new FormControl();

  public CustomerList?: CustomerContractDropDown[] = [];
  filteredOptions: Observable<CustomerContractDropDown[]>;
  SearchEndDate: string = '';
  endingDate : FormControl = new FormControl();
  public EmployeeList?: EmployeeDropDown[] = [];
  dialogCustomerContractData: any;

  // menuItems: any[] = [
  //   { label: ' Customer Fuel Surcharge',  },
  //   { label: ' Customer Discount',},
  //   { label: ' CustomeCredit',  },
    
  // ];
  constructor(
    public route:ActivatedRoute,
    public router:Router,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    
    public customerContractMappingService: CustomerContractMappingService,
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
    this.loadData();

    this.InitEmployee();
    this. InitCustomerContract();
    this.menuItems.sort((a, b) => a.label.localeCompare(b.label));
    this.SubscribeUpdateService();
  }
  refresh() {
     
    this.SearchCustomerContractMapping = '';
    this.SearchEmployeeName='';
    this.search.setValue('');
    this.SearchEndDate='';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }
  InitCustomerContract(){
    this._generalService.GetCustomerContract().subscribe
    (
      data =>   
      {
        this.CustomerList = data; 
        this.filteredOptions = this.search.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );      
      }
     
    );

  }
  private _filter(value: any): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.CustomerList.filter(
      customer =>
      {
        return customer.customerContractName.toLowerCase().includes(filterValue);
      }
    );
  }
  addNew()
  {
    
    const dialogRef = this.dialog.open(FormDialogComponentHolder, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          customerID:this.customer_ID,
          CustomerName:this.customer_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerContractMappingID = row.id;
    const dialogRef = this.dialog.open(FormDialogComponentHolder, {
      data: {
        advanceTable: row,
        action: 'edit',
        customerID:this.customer_ID,
        CustomerName:this.customer_Name
        //customerContractID: this.dialogCustomerContractData.customerContractName
      }
    });
    
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
    //this.SearchCustomerContractMapping='';
  }
  
  deleteItem(row)
  {

    this.customerContractMappingID = row.id;
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
    switch (this.selectedFilter)
    {
      case 'contractName':
        this.search.setValue(this.searchTerm);
        break;
        default:
        this.searchTerm = '';
        break;
    }
    
      this.customerContractMappingService.getTableData(this.customer_ID,this.SearchCustomerContractMapping,this.SearchEmployeeName,this.search.value,this.SearchEndDate,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerContractMapping) {
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
          if(this.MessageArray[0]=="CustomerContractMappingCreate")
          {
            if(this.MessageArray[1]=="CustomerContractMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
                 
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Contract Mapping Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractMappingUpdate")
          {
            if(this.MessageArray[1]=="CustomerContractMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Contract Mapping Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractMappingDelete")
          {
            if(this.MessageArray[1]=="CustomerContractMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Contract Mapping Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractMappingAll")
          {
            if(this.MessageArray[1]=="CustomerContractMappingView")
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
  InitEmployee(){
    this._generalService.GetEmployeesForVehicleCategory().subscribe
    (
      data =>   
      {
        this.EmployeeList = data; 
       
      }
    );
  }

  menuItems: any[] = [
    //{ label: 'Fuel Surcharge' },
    { label: 'Discount' },
    { label: 'Credit' }
  ];
  
  openInNewTab(menuItem: any, rowItem: any) {
    let baseUrl = this._generalService.FormURL;
  
    if (menuItem.label.toLowerCase() === 'fuel surcharge') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/customerFuelSurcharge'], {
        queryParams: {
          CustomerContractMappingID: rowItem.customerContractMappingID,
          CustomerName: this.customer_Name,
          StartDate: rowItem.startDate,
          EndDate: rowItem.endDate,
        }
      }));
      window.open(baseUrl + url, '_blank');
    } else if (menuItem.label.toLowerCase() === 'discount') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/customerDiscount'], {
        queryParams: {
          CustomerContractMappingID: rowItem.customerContractMappingID,
       CustomerName: rowItem.customerName,
         StartDate:rowItem.startDate,
         EndDate:rowItem.endDate,
        }
      }));
      window.open(baseUrl + url, '_blank');
    } else if (menuItem.label.toLowerCase() === 'credit') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/customerCredit'], {
        queryParams: {
          customerContractMappingID: rowItem.customerContractMappingID,
          CustomerName: rowItem.customerName,
          ApplicableFrom: rowItem.startDate,
          ApplicableTo: rowItem.endDate,
        }
      }));
      window.open(baseUrl + url, '_blank');
    }
  }
  
  // customerCredit(row) {
  //   this.router.navigate([
  //     '/customerCredit',  
  //   ],
  //   {
  //     queryParams: {
  //       customerContractMappingID: row.customerContractMappingID,
  //       CustomerName: row.customerName,
  //       ApplicableFrom:row.startDate,
  //       ApplicableTo:row.endDate,
       
  //     }
  //   }); 
  // }

  // customerFuelSurcharge(row) {
  //   this.router.navigate([
  //     '/customerFuelSurcharge',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerContractMappingID: row.customerContractMappingID,
  //       CustomerName: this.customer_Name,
  //       StartDate:row.startDate,
  //       EndDate:row.endDate,
       
  //     }
  //   }); 
  // }

  // customerDiscount(row) {
  //   this.router.navigate([
  //     '/customerDiscount',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerContractMappingID: row.customerContractMappingID,
  //       CustomerName: row.customerName,
  //       StartDate:row.startDate,
  //       EndDate:row.endDate,
       
  //     }
  //   }); 
  // }
  SortingData(coloumName:any) {
     
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.customerContractMappingService.getTableDataSort(this.customer_ID,this.SearchCustomerContractMapping,this.SearchEmployeeName,this.customerContractID,this.SearchEndDate,this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




