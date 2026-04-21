// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from './customer.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Customer } from './customer.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { VehicleCategoryDropDown } from '../vehicleCategory/vehicleCategoryDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { SupplierDropDown } from '../supplier/supplierDropDown.model';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleCategory } from '../vehicleCategory/vehicleCategory.model';
import { CustomerTypeDropDown } from '../customerType/customerTypeDropDown.model';
import { CustomerCategoryDropDown } from '../customerCategory/customerCategoryDropDown.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { RoleDropDown } from '../role/roleDropDown.model';
import { RolePageMappingService } from '../rolePageMapping/rolePageMapping.service';
import { FormDialogComponent as CIPlusComponent } from '../customerCorporateIndividual/dialogs/form-dialog/form-dialog.component';

interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}

@Component({
  standalone: false,
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class CustomerComponent implements OnInit {
  @Input() customerID:any;
  @Input() action:any;
  
  displayedColumns = [
    'tallyCustomerID',
    'customerName',
    'customerGroup',
    'customerType',
    'customerCategory',
     'cityName',
     'keyAccountManagerName',
     'salesManagerName',
    'actions'
  ];


  dataSource: Customer[] | null;
  dataSourceForPage:RoleDropDown[] | any;
  //customerID: number;
  advanceTable: Customer | null;
  CustomerID: number = 0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  searchCustomerName:string='';
  searchcustomerGroup:string='';
  searchCustomerType:string='';
  searchCustomerCategory:string='';
  searchCustomerCodeForAPIIntegration:string='';
  //vehicleCategory:FormControl=new FormControl();

  customerName:FormControl=new FormControl('');
  customerGroup:FormControl=new FormControl('');
  customerType:FormControl=new FormControl('');
  customerCategory:FormControl=new FormControl('');
  customerCodeForAPIIntegration:FormControl=new FormControl('');

  supplier:FormControl=new FormControl('');
  
  // regNumber:FormControl=new FormControl();
  public customerGroupList?: CustomerGroupDropDown[] = [];
  public CustomerTypeList?: CustomerTypeDropDown[] = [];
  public customerCategoryList?: CustomerCategoryDropDown[] = [];
  public SupplierList?: SupplierDropDown[] = [];
  filteredOptions: Observable<CustomerGroupDropDown[]>;
  filteredTypeOptions: Observable<CustomerTypeDropDown[]>;
  filteredCategoryOptions: Observable<CustomerCategoryDropDown[]>;
  ActiveStatus: string;
  roleID: string | null = '';
  role: string | null = '';
  sidebarItems: any[] = [];
  accessPages: any[] = [];
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;

  menuItems: any[] = [
    { label: 'Address', tooltip: 'Address', pageName: 'Address' },
    { label:'Customer Billing Cycle',tooltip:'Customer Billing Cycle',pageName:'customerbillingcycle'},
    { label: 'Billing Executive', tooltip: 'Billing Executive', pageName: 'Billing Executive' },
    { label: 'Blocking', tooltip: 'Customer Blocking', pageName: 'Customer Blocking' },
    { label: 'Car And Driver Details SMS EMail', tooltip: 'Car And Driver Details SMS EMail', pageName: 'Car And Driver Details SMS EMail' },
    { label: 'Category Mapping', tooltip: 'Category Mapping', pageName: 'Category Mapping' },
    { label: 'Billing Configuration', tooltip: 'Billing Configuration', pageName: 'Billing Configuration' },
    { label: 'Invoicing Configuration', tooltip: 'Invoicing Configuration', pageName: 'Invoicing Configuration' },
    { label: 'Messaging Configuration', tooltip: 'Messaging Configuration', pageName: 'Messaging Configuration' },
    { label: 'Reservation Configuration', tooltip: 'Reservation Configuration', pageName: 'Reservation Configuration' },
    //{ label: 'SEZ Configuration', tooltip: 'SEZ Configuration', pageName: 'SEZ Configuration' },
    { label: 'Supplier Configuration', tooltip: 'Supplier Configuration', pageName: 'Supplier Configuration' },
    { label: 'Contract Mapping', tooltip: 'Contract Mapping', pageName: 'Contract Mapping' },
    { label: 'Collection Executive', tooltip: 'Collection Executive', pageName: 'Collection Executive' },
    { label: 'Key Account Manager', tooltip: 'Key Account Manager', pageName: 'Key Account Manager' },
    // { label: 'Reservation Alert', tooltip: 'Reservation Alert', pageName: 'Reservation Alert' },
    { label: 'Reservation Alert', tooltip: 'Reservation Alert', pageName: 'customerreservationalert' },
    { label: 'Reservation Field', tooltip: 'Reservation Field', pageName: 'reservationfield' },
    { label: 'Sales Manager', tooltip: 'Sales Manager', pageName: 'Sales Manager' },
    { label: 'Stop Reservation', tooltip: 'Stop Reservation', pageName: 'Stop Reservation' },
    { label: 'Invoice Template', tooltip: 'Invoice Template', pageName: 'Invoice Template' },
    { label: 'Alert Message', tooltip: 'Alert Message', pageName: 'Alert Message' },
    // { label: 'Credit Charges', tooltip: 'Credit Charges', pageName: 'Credit Charges' },
    { label: 'App Based Vehicle', tooltip: 'Customer App Vehicle', pageName: 'Customer App Vehicle' },
    { label: 'App Based Vehicle Category', tooltip: 'Customer App Based Vehicle Category', pageName: 'Customer App Based Vehicle Category' },
    { label: 'Customer QC', tooltip: 'Customer QC', pageName: 'Customer QC' },
    { label: 'Reservation Capping',  tooltip: 'Customer Reservation Capping', pageName: 'Reservation Capping' },
    { label: 'Round UP', tooltip: 'Round UP', pageName: 'Round UP' },
    { label: 'Customer OTP Configuration', tooltip: 'Customer OTP Configuration', pageName: 'Customer OTP Configuration' },
    { label: 'Change KAM for Customers', tooltip: 'Change KAM for Customers', pageName: 'Change KAM for Customers' },
    { label: 'Payment Terms Code', tooltip: 'Customer Payment Terms Code', pageName: 'customerPaymentTermsCode' },
    { label: 'Customer Growth Person', tooltip: 'Customer Growth Person', pageName: 'customerGrowthPerson' },
  ];

  
  constructor(
    
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public customerService: CustomerService,
    private roleMapService: RolePageMappingService,
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
    this.PageNumber = 0;
    this.searchTerm = '';
    this.searchCustomerName = '';
    this.selectedFilter = 'search';
    this.SearchActivationStatus = true;
    this.customerType.setValue('', { emitEvent: false });
    this.customerGroup.setValue('', { emitEvent: false });
    this.customerCategory.setValue('', { emitEvent: false });

    this.loadData();
    this.SubscribeUpdateService();
    //this.InitSupplier();
    this.initCustomerCategory();
    this.initCustomerType();
    this.initCustomerGroup();
    this.roleID = localStorage.getItem('roleID');
    this.role = localStorage.getItem('role');
    this.loadDataforPage(this.roleID);
    // // Fetch accessPages from localStorage
    const accessPagesString = localStorage.getItem('accessPages');
    const accessPages = accessPagesString ? JSON.parse(accessPagesString) : [];
    // Filter and sort menuItems based on accessPages
    const filteredMenuItems = this.menuItems
      .filter(menuItem =>
        accessPages.some(accessPage =>
          (menuItem.pageName || menuItem.page || '').toLowerCase().replace(/\s+/g, '') === accessPage.page.toLowerCase().replace(/\s+/g, '')
        )
      )
      .sort((a, b) => a.label.localeCompare(b.label));

    this.menuItems = filteredMenuItems;
  //   this.roleID = localStorage.getItem('roleID');
  //   this.role = localStorage.getItem('role');

  //   // Fetch role-specific access pages and then filter menu items
  //   this.getPagesAccessRoleWise(Number(this.roleID)).then(() => {
  //     this.filterMenuItems();
  //     this.loadDataforPage(this.roleID);
  //   }).catch(error => {
  //     console.error('Error fetching role-specific access pages:', error);
  //   });
  // }

  // getPagesAccessRoleWise(roleID: number): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.roleMapService.getTableData(null, roleID, true, 0).subscribe(
  //       (data) => {
  //         this.accessPages = [];
  //         data?.forEach(element => {
  //           if (element.activationStatus) {
  //             this.accessPages.push({
  //               pageID: element.pageID,
  //               page: element.page.toLowerCase().replace(/\s+/g, '')
  //             });
  //           }
  //         });

  //         // Saving to local storage
  //         localStorage.setItem('accessPages', JSON.stringify(this.accessPages));

  //         // Update sidebar items
  //         this.sidebarItems?.forEach(menuItem => {
  //           menuItem?.submenu?.forEach(subItem => {
  //             const subItemTitle = subItem.title.toLowerCase().replace(/\s+/g, '');
  //             subItem.isAccess = this.accessPages.some(page => page.page === subItemTitle);
  //           });
  //         });

  //         resolve();
  //       },
        
  //       (error) => {
  //         console.error('Error fetching role-wise access pages:', error);
  //         reject(error);
  //       }
  //     );
  //   });
  }


  CIPlus()
  {
    const dialogRef = this.dialog.open(CIPlusComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
    });
  }

  
  filterMenuItems() {
    // Fetch accessPages from localStorage
    const accessPagesString = localStorage.getItem('accessPages');
    const accessPages = accessPagesString ? JSON.parse(accessPagesString) : [];
  
    // Check if the user is an admin
    const isAdmin = this.role.toLowerCase() === 'admin';
  
    // Filter and sort menuItems based on accessPages
    const filteredMenuItems = this.menuItems
      .filter(menuItem =>
        isAdmin || accessPages.some(accessPage =>
          (menuItem.pageName || menuItem.page || '').toLowerCase().replace(/\s+/g, '') === accessPage.page.toLowerCase().replace(/\s+/g, '')
        )
      )
      .sort((a, b) => a.label.localeCompare(b.label));
  
    // Log the filtered menu items to verify the filtering logic
  
    this.menuItems = filteredMenuItems;
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }
    
  // InitSupplier(){
  //   this._generalService.getSuppliersForCustomer().subscribe(
  //     data=>{
  //       this.SupplierList=data;
  //     }
  //   )
  // }

  refresh() {
    this.searchCustomerName='',
    this.customerType.setValue(''),
    this.customerCategory.setValue(''),
    this.customerGroup.setValue(''),
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
    this.loadDataForSearch
  }

 onSearchClick() {
  if (!this.selectedFilter || this.selectedFilter === 'search') {
    this.selectedFilter = 'name';
  }

  this.searchCustomerName = this.searchTerm; // 🔥 MOST IMPORTANT LINE

  this.loadData(true); // exact match
}
  // initCustomerType(){
  //   this._generalService.getCustomerType().subscribe(
  //     data=>{
  //       this.CustomerTypeList=data;
  //     }
  //   )
  // }

  // initCustomerCategory(){
  //   this._generalService.getCustomerCategory().subscribe(
  //     data=>{
  //       this.customerCategoryList=data;
  //     }
  //   )
  // }

  // initCustomerGroup(){
  //   this._generalService.getCustomerGroup().subscribe(
  //     data=>{
  //       this.customerGroupList=data;``
  //     }
  //   )
  // }

  initCustomerCategory(){
    this._generalService.getCustomerCategory().subscribe(
      data=>{
        this.customerCategoryList=data;
        this.filteredCategoryOptions =  this.customerCategory.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCategory(value || ''))
        );
      }
    )
  }
  private _filterCategory(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.customerCategoryList.filter(
      customer => 
      {
        return customer.customerCategory.toLowerCase().indexOf(filterValue)===0;
      }
    );
    
  };

  initCustomerGroup(){
    this._generalService.getCustomerGroup().subscribe(
      data=>{
        this.customerGroupList=data;
        this.filteredOptions = this.customerGroup.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );

      }
    )
  }
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.customerGroupList.filter(
      customer => 
      {
        return customer.customerGroup.toLowerCase().indexOf(filterValue)===0;
      }
    );
    
  };

  initCustomerType(){
    this._generalService.getCustomerType().subscribe(
      data=>{
        this.CustomerTypeList=data;
        this.filteredTypeOptions = this.customerType.valueChanges.pipe(
          startWith(""),
          map(value => this._filterType(value || ''))
        );
      }
    )
  }
  private _filterType(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.CustomerTypeList.filter(
      customer => 
      {
        return customer.customerType.toLowerCase().indexOf(filterValue)===0;
      }
    );
    
  };
  
  public SearchData()
  {
    this.loadData(); 
    this.loadDataForSearch();   
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
    this.customerID = row.customerID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
        
      }
    });
  }
  deleteItem(row)
  {

    this.customerID = row.id;
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

  public loadData(exactMatch: boolean = false)
  {
    switch (this.selectedFilter)
{
  case 'name':
    this.searchCustomerName = this.searchTerm;
    break;

  case 'customerType':
    this.customerType.setValue(this.searchTerm);
    break;

  case 'customerGroup':
    this.customerGroup.setValue(this.searchTerm);
    break;

  default:
    this.searchCustomerName = this.searchTerm || ''; // ✅ FIX
    break;
}

    this.customerService.getTableData(
      this.searchCustomerName || '',
      this.customerType.value || '',
      this.customerGroup.value || '',
      this.SearchActivationStatus,
      this.PageNumber).subscribe(
      data =>
      {
      let filteredData: any = data;

// ✅ PARTIAL MATCH (Typing time)
if (!exactMatch) {
  if (this.selectedFilter === 'name' && this.searchCustomerName) {
    filteredData = filteredData.filter((row: any) =>
      row.customerName &&
      row.customerName.toLowerCase().includes(this.searchCustomerName.toLowerCase())
    );
  }

  if (this.selectedFilter === 'customerType' && this.customerType.value) {
    filteredData = filteredData.filter((row: any) =>
      row.customerType &&
      row.customerType.toLowerCase().includes(this.customerType.value.toLowerCase())
    );
  }

  if (this.selectedFilter === 'customerGroup' && this.customerGroup.value) {
    filteredData = filteredData.filter((row: any) =>
      row.customerGroup &&
      row.customerGroup.toLowerCase().includes(this.customerGroup.value.toLowerCase())
    );
  }
}

// ✅ EXACT MATCH (Search button / Enter)
if (exactMatch) {
  if (this.selectedFilter === 'name' && this.searchCustomerName) {

    const searchValue = this.searchCustomerName
      .toLowerCase()
      .replace(/\./g, '')
      .replace(/\s+/g, ' ')
      .trim();

    filteredData = filteredData.filter((row: any) => {
      if (!row.customerName) return false;

      const dbValue = row.customerName
        .toLowerCase()
        .replace(/\./g, '')
        .replace(/\s+/g, ' ')
        .trim();

      return dbValue === searchValue; // ✅ STRICT EXACT MATCH
    });
  }


  if (this.selectedFilter === 'customerType' && this.customerType.value) {
    filteredData = filteredData.filter((row: any) =>
      row.customerType &&
      row.customerType.trim().toLowerCase() === this.customerType.value.trim().toLowerCase()
    );
  }

  if (this.selectedFilter === 'customerGroup' && this.customerGroup.value) {
    filteredData = filteredData.filter((row: any) =>
      row.customerGroup &&
      row.customerGroup.trim().toLowerCase() === this.customerGroup.value.trim().toLowerCase()
    );
  }
}

        this.dataSource = filteredData;
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }

  public loadDataForSearch()
  {
    this.PageNumber = 0;
      this.searchCustomerName = this.searchTerm;
    this.loadData(true);
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: Customer) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.roleID = localStorage.getItem('roleID');
    this.role = localStorage.getItem('role');
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
    this.loadDataforPage(this.roleID);
  }

  public loadDataforPage(roleID:any) 
   {
      this._generalService.GetRoleForPage(roleID).subscribe
    (
      data =>   
      {

        this.dataSourceForPage = data; 
      },
      (error: HttpErrorResponse) => { this.dataSourceForPage = null;}
    );
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

  // customerStatus(row) {
  //   this.router.navigate([
  //     '/customerConfigurationSEZ',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerID: row.customerID,
  //       CustomerName: row.customerName,
  //       //vehicleID:row.vehicleID,
  //       //vechicleName: row.vehicle,
  //     }
  //   }); 
  // }

  // customerCityMapping(row) {
  //   this.router.navigate([
  //     '/customerCategoryMapping',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerID: row.customerID,
  //       CustomerName: row.customerName,
  //     }
  //   }); 
  // }

  // driverDetailsSMsEMail(row) {
  //   this.router.navigate([
  //     '/customerCarAndDriverDetailsSMSEMail',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerID: row.customerID,
  //       CustomerName: row.customerName,
  //     }
  //   }); 
  // }

  // customerReservation(row) {
  //   this.router.navigate([
  //     '/customerReservationAlert',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerID: row.customerID,
  //       CustomerName: row.customerName,
  //     }
  //   }); 
  // }

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
          if(this.MessageArray[0]=="CustomerCreate")
          {
            if(this.MessageArray[1]=="CustomerView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Created ..!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerUpdate")
          {
            if(this.MessageArray[1]=="CustomerView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerDelete")
          {
            if(this.MessageArray[1]=="CustomerView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAll")
          {
            if(this.MessageArray[1]=="CustomerView")
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
    this.customerService.getTableDataSort(this.searchCustomerName,
      this.searchCustomerType,
      this.searchcustomerGroup,
      this.SearchActivationStatus, 
      this.PageNumber,
      coloumName.active,
      this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  onKeyUp(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    this.loadData(true);   // ✅ exact match
  } else {
    this.loadData(false);  // ✅ partial match
  }
}
//   CustomerInsurance(row) {
   
//     this.customerID = row.customerID;
//    this.router.navigate([
//      '/customerInsurance',       
    
//    ],{
//      queryParams: {
//        CustomerID: this.customerID,
//        RegNo:row.registrationNumber
//      }
//    });
//   }

openInNewTab(menuItem: any, rowItem: any) {
  let baseUrl = this._generalService.FormURL;
  const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(rowItem.customerID.toString()));
  const encryptedCustomerName = encodeURIComponent(this._generalService.encrypt(rowItem.customerName));
 
  if(menuItem.label.toLowerCase() === 'address') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerAddress'], { queryParams: {
      CustomerID:encryptedCustomerID,
      CustomerName: encryptedCustomerName
    } }));
    window.open(baseUrl + url, '_blank'); 
    // this.router.navigate(['/customerAddress'], {
    //   queryParams: {
    //     CustomerID: rowItem.customerID,
    //     CustomerName: rowItem.customerName
    //   }
    // });
  }
   else if(menuItem.label.toLowerCase() === 'customer billing cycle') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerBillingCycle'], { queryParams: {
      CustomerID: encryptedCustomerID,
      CustomerName: encryptedCustomerName
    } }));
    window.open(baseUrl + url, '_blank'); 
  }  
  else if(menuItem.label.toLowerCase() === 'key account manager') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerKeyAccountManager'], { queryParams: {
      CustomerID: encryptedCustomerID,
      CustomerName: encryptedCustomerName
    } }));
    window.open(baseUrl + url, '_blank'); 
  }

  else if(menuItem.label.toLowerCase() === 'round off') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerDecimalValuesOnInvoice'], { queryParams: {
      CustomerID: encryptedCustomerID,
      CustomerName: encryptedCustomerName
    } }));
    window.open(baseUrl + url, '_blank'); 
  }

  else if(menuItem.label.toLowerCase() === 'round up') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerDecimalValuesOnInvoice'], { queryParams: {
      CustomerID: encryptedCustomerID,
      CustomerName: encryptedCustomerName
    } }));
    window.open(baseUrl + url, '_blank'); 
  }
    else if(menuItem.label.toLowerCase() === 'billing executive') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/customerBillingExecutive'], { queryParams: {
        CustomerID: encryptedCustomerID,
        CustomerName: encryptedCustomerName
      } }));
      window.open(baseUrl + url, '_blank'); 
    
  }
  else if(menuItem.label.toLowerCase() === 'blocking') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerBlocking'], { queryParams: {
      CustomerID: encryptedCustomerID,
      CustomerName: encryptedCustomerName
    } }));
    window.open(baseUrl + url, '_blank'); 
  
}
else if(menuItem.label.toLowerCase() === 'car and driver details sms email') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerCarAndDriverDetailsSMSEMail'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 

}

else if(menuItem.label.toLowerCase() === 'category mapping') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerCategoryMapping'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'billing configuration') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerConfigurationBilling'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'invoicing configuration') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerConfigurationInvoicing'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'messaging configuration') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerConfigurationMessaging'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 

}

else if(menuItem.label.toLowerCase() === 'reservation configuration') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerConfigurationReservation'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 

}

// else if(menuItem.label.toLowerCase() === 'sez configuration') {
//   const url = this.router.serializeUrl(this.router.createUrlTree([ '/customerConfigurationSEZ'], { queryParams: {
//     CustomerID: encryptedCustomerID,
//     CustomerName: encryptedCustomerName
//   } }));
//   window.open(baseUrl + url, '_blank'); 

// }
else if(menuItem.label.toLowerCase() === 'supplier configuration') {
  const url = this.router.serializeUrl(this.router.createUrlTree([ '/customerConfigurationSupplier'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'contract mapping') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerContractMapping'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'invoice template') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerInvoiceTemplate'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'reservation alert') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerReservationAlert'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'reservation field') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerReservationFields'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'sales manager') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerSalesManager'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'customer otp configuration') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerOTPConfiguration'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'service executive') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerServiceExecutive'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 

}

else if(menuItem.label.toLowerCase() === 'collection executive') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerCollectionExecutive'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 

}

else if(menuItem.label.toLowerCase() === 'stop reservation') {
  const url = this.router.serializeUrl(this.router.createUrlTree([ '/stopReservation'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 

}
  else if(menuItem.label.toLowerCase() === 'alert message') {
    const url = this.router.serializeUrl(this.router.createUrlTree([ '/customerAlertMessage'], { queryParams: {
      CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
    } }));
    window.open(baseUrl + url, '_blank'); 
  }

  else if(menuItem.label.toLowerCase() === 'credit charges') {
    const url = this.router.serializeUrl(this.router.createUrlTree([ '/customerCreditCharges'], { queryParams: {
      CustomerID: encryptedCustomerID,
      CustomerName: encryptedCustomerName
    } }));
    window.open(baseUrl + url, '_blank'); 
  }
  
 else if(menuItem.label.toLowerCase() === 'app based vehicle') {
  const url = this.router.serializeUrl(this.router.createUrlTree([ '/customerAppBasedVehicle'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 
}
else if(menuItem.label.toLowerCase() === 'app based vehicle category') {
  const url = this.router.serializeUrl(this.router.createUrlTree([ '/customerAppBasedVehicleCategory'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 
}
else if(menuItem.label.toLowerCase() === 'customer qc') {
  const url = this.router.serializeUrl(this.router.createUrlTree([ '/customerQC'], { queryParams: {
    CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
  } }));
  window.open(baseUrl + url, '_blank'); 
}
else if (menuItem.label.toLowerCase() === 'reservation capping') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerReservationCapping'], {
    queryParams: {
      CustomerID: encryptedCustomerID,
    CustomerName: encryptedCustomerName
    }
  }));
  window.open(baseUrl + url, '_blank');
}
else if (menuItem.label.toLowerCase() === 'corporate individual') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerCorporateIndividual'], {
    queryParams: {
      CustomerID: encryptedCustomerID,
      CustomerName: encryptedCustomerName
    }
  }));
  window.open(baseUrl + url, '_blank');
}
else if (menuItem.label.toLowerCase() === 'change kam for customers') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/changeKamForCustomers'], {
    queryParams: {
      CustomerID: encryptedCustomerID,
      CustomerName: encryptedCustomerName
    }
  }));
  window.open(baseUrl + url, '_blank');
}
else if (menuItem.label.toLowerCase() === 'payment terms code') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPaymentTermsCode'], {
    queryParams: {
      CustomerID: encryptedCustomerID,
      CustomerName: encryptedCustomerName
    }
  }));
  window.open(baseUrl + url, '_blank');
}
else if (menuItem.label.toLowerCase() === 'customer growth person') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/customerGrowthPerson'], {
    queryParams: {
      CustomerID: encryptedCustomerID,
      CustomerName: encryptedCustomerName
    }
  }));
  window.open(baseUrl + url, '_blank');
}
}

// openInNewTab(menuItem: any, rowItem: any) {
//   debugger;
//   let baseUrl = this._generalService.FormURL;
//   const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(rowItem.customerID.toString()));
//   const encryptedCustomerName = encodeURIComponent(this._generalService.encrypt(rowItem.customerName));

//   let path = '';
//   switch (menuItem.label.toLowerCase()) {
//     case 'address':
//       path = '/customerAddress';
//       break;
//     case 'key account manager':
//       path = '/customerKeyAccountManager';
//       break;
//     case 'billing executive':
//       path = '/customerBillingExecutive';
//       break;
//     case 'blocking':
//       path = '/customerBlocking';
//       break;
//     case 'car and driver details sms email':
//       path = '/customerCarAndDriverDetailsSMSEMail';
//       break;
//     case 'category mapping':
//       path = '/customerCategoryMapping';
//       break;
//     case 'billing configuration':
//       path = '/customerConfigurationBilling';
//       break;
//     case 'invoicing configuration':
//       path = '/customerConfigurationInvoicing';
//       break;
//     case 'messaging configuration':
//       path = '/customerConfigurationMessaging';
//       break;
//     case 'reservation configuration':
//       path = '/customerConfigurationReservation';
//       break;
//     case 'sez configuration':
//       path = '/customerConfigurationSEZ';
//       break;
//     case 'supplier configuration':
//       path = '/customerConfigurationSupplier';
//       break;
//     case 'contract mapping':
//       path = '/customerContractMapping';
//       break;
//     case 'invoice template':
//       path = '/customerInvoiceTemplate';
//       break;
//     case 'reservation alert':
//       path = '/customerReservationAlert';
//       break;
//     case 'reservation field':
//       path = '/customerReservationFields';
//       break;
//     case 'sales manager':
//       path = '/customerSalesManager';
//       break;
//     case 'service executive':
//       path = '/customerServiceExecutive';
//       break;
//     case 'collection executive':
//       path = '/customerCollectionExecutive';
//       break;
//     case 'stop reservation':
//       path = '/stopReservation';
//       break;
//     case 'alert message':
//       path = '/customerAlertMessage';
//       break;
//     default:
//       return;
//   }

//   const url = this.router.serializeUrl(this.router.createUrlTree([path], {
//     queryParams: {
//       CustomerID: encryptedCustomerID,
//       CustomerName: encryptedCustomerName
//     }
//   }));
//   window.open(baseUrl + url, '_blank');
// }

//   customerConfigurationBilling(row) {
   
//   this.customerID = row.customerID;
//  this.router.navigate([
//    '/customerConfigurationBilling',       
  
//  ],{
//    queryParams: {
//      CustomerID: this.customerID,
//      CustomerName:row.customerName
//    }
//  });
// }

// customerConfigurationReservation(row) {
   
//   this.customerID = row.customerID;
//  this.router.navigate([
//    '/customerConfigurationReservation',       
  
//  ],{
//    queryParams: {
//      CustomerID: this.customerID,
//      CustomerName:row.customerName
//    }
//  });
// }

// reservationAlert(row) {
   
//   this.customerID = row.customerID;
//  this.router.navigate([
//    '/reservationAlert',       
  
//  ],{
//    queryParams: {
//      CustomerID: this.customerID,
//      CustomerName:row.customerName
//    }
//  });
// }

// customerConfigurationSupplier(row) {
   
//   this.customerID = row.customerID;
//  this.router.navigate([
//    '/customerConfigurationSupplier',       
  
//  ],{
//    queryParams: {
//      CustomerID: this.customerID,
//      CustomerName:row.customerName
//    }
//  });
// }

// customerBlocking(row) {
   
//   this.customerID = row.customerID;
//  this.router.navigate([
//    '/customerBlocking',       
  
//  ],{
//    queryParams: {
//      CustomerID: this.customerID,
//      CustomerName:row.customerName
//    }
//  });
// }
										  
// customerConfigurationInvoicing(row) {
//   this.router.navigate([
//     '/customerConfigurationInvoicing',  
//   ],
//   {
//     queryParams: {
//       CustomerID: row.customerID,
//       CustomerName: row.customerName,
     
//     }
//   }); 
// }

// stopReservation(row) {
//   this.router.navigate([
//     '/stopReservation',  
//   ],
//   {
//     queryParams: {
//       CustomerID: row.customerID,
//       CustomerName: row.customerName,
     
//     }
//   }); 
// }
// customerServiceExecutive(row) {
//   this.router.navigate([
//     '/customerServiceExecutive',  
//   ],
//   {
//     queryParams: {
//       CustomerID: row.customerID,
//       CustomerName: row.customerName,
     
//     }
//   }); 
// }
// customerBillingExecutive(row) {
//   this.router.navigate([
//     '/customerBillingExecutive',  
//   ],
//   {
//     queryParams: {
//       CustomerID: row.customerID,
//       CustomerName: row.customerName,
     
//     }
//   }); 
// }
// customerCollectionExecutive(row) {
//   this.router.navigate([
//     '/customerCollectionExecutive',  
//   ],
//   {
//     queryParams: {
//       CustomerID: row.customerID,
//       CustomerName: row.customerName,
     
//     }
//   }); 
// }
// customerReservationExecutive(row) {
//   this.router.navigate([
//     '/customerReservationExecutive',  
//   ],
//   {
//     queryParams: {
//       CustomerID: row.customerID,
//       CustomerName: row.customerName,
     
//     }
//   }); 
// }
// customerSalesManager(row) {
//   this.router.navigate([
//     '/customerSalesManager',  
//   ],
//   {
//     queryParams: {
//       CustomerID: row.customerID,
//       CustomerName: row.customerName,
     
//     }
//   }); 
// }
// customerReservationFields(row) {
//   this.router.navigate([
//     '/customerReservationFields',  
//   ],
//   {
//     queryParams: {
//       CustomerID: row.customerID,
//       CustomerName: row.customerName,
     
//     }
//   }); 
// }

// customerInvoiceTemplate(row) {
//   this.router.navigate([
//     '/customerInvoiceTemplate',  
//   ],
//   {
//     queryParams: {
//       CustomerID: row.customerID,
//       CustomerName: row.customerName,
     
//     }
//   }); 
// }

// customerConfigurationMessaging(row) {
//   this.router.navigate([
//     '/customerConfigurationMessaging',  
//   ],
//   {
//     queryParams: {
//       CustomerID: row.customerID,
//       CustomerName: row.customerName,
     
//     }
//   }); 
// }
// customerContractMapping(row) {
//   this.router.navigate([
//     '/customerContractMapping',  
//   ],
//   {
//     queryParams: {
//       CustomerID: row.customerID,
//       CustomerName: row.customerName,
     
//     }
//   }); 
// }

}



