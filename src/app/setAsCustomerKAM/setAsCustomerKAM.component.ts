// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
import { SetAsCustomerKAM } from './setAsCustomerKAM.model';
import { SetAsCustomerKAMService } from './setAsCustomerKAM.service';
import Swal from 'sweetalert2';

interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}

@Component({
  standalone: false,
  selector: 'app-setAsCustomerKAM',
  templateUrl: './setAsCustomerKAM.component.html',
  styleUrls: ['./setAsCustomerKAM.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class SetAsCustomerKAMComponent implements OnInit {
  @Input() customerID:any;
  @Input() action:any;
  
  displayedColumns = [
    'check',
    'customerName',
    'customerGroup',
    'customerType',
    //'customerCategory',
    //'actions'
  ];
  dataSource: SetAsCustomerKAM[] | null;
  dataSourceForPage:RoleDropDown[] | any;
  //customerID: number;
  advanceTable: SetAsCustomerKAM | null;
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

  customerName:FormControl=new FormControl();
  customerGroup:FormControl=new FormControl();
  customerType:FormControl=new FormControl();
  customerCategory:FormControl=new FormControl();
  customerCodeForAPIIntegration:FormControl=new FormControl();

  supplier:FormControl=new FormControl();
  
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
  EmployeeID: any;
  selectAll:boolean=false;
   public setAsCustomerKAMDataSource:SetAsCustomerKAM[] | null;
    selectedKAM = [];
  EmployeeName: any;
 

  constructor(
    
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public customerService: SetAsCustomerKAMService,
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
   
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedEmployeeID = paramsData.EmployeeID;
    const encryptedEmployeeName = paramsData.EmployeeName;
    
    if (encryptedEmployeeID && encryptedEmployeeName) {
      
        this.EmployeeID = this._generalService.decrypt(decodeURIComponent(encryptedEmployeeID));
        this.EmployeeName = this._generalService.decrypt(decodeURIComponent(encryptedEmployeeName));
      }
     
    });
     this.loadData();
      //this.InitSupplier();
    this.initCustomerCategory();
    this.initCustomerType();
    this.initCustomerGroup();
    this.roleID = localStorage.getItem('roleID');
    this.role = localStorage.getItem('role');
    this.loadDataforPage(this.roleID);
  
 
  
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
    this.selectedKAM=[];
    this.loadData();

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
  }
  addNew()
  {
    // const dialogRef = this.dialog.open(FormDialogComponent, 
    // {
    //   data: 
    //     {
    //       advanceTable: this.advanceTable,
    //       action: 'add'
    //     }
    // });
  }
  editCall(row) {
      //  alert(row.id);
    // this.customerID = row.customerID;
    // const dialogRef = this.dialog.open(FormDialogComponent, {
    //   data: {
    //     advanceTable: row,
    //     action: 'edit'
        
    //   }
    // });
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
        this.searchTerm = '';
        break;
    }
      this.customerService.getTableData(
        this.EmployeeID,
        this.searchCustomerName,
        this.customerType.value,
        this.customerGroup.value,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: SetAsCustomerKAM) {
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
        console.log(this.dataSourceForPage)      
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

  

  SortingData(coloumName:any) {
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.customerService.getTableDataSort(
      this.EmployeeID,
      this.searchCustomerName,
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



 checkAll(checkBoxValue: boolean) {
  this.selectAll = checkBoxValue;

  if (checkBoxValue) {
    this.selectedKAM = [...this.dataSource];
    this.dataSource.forEach((element: any) => {
      element.checked = true;
    });
  } else {
    this.selectedKAM = [];
    this.dataSource.forEach((element: any) => {
      element.checked = false;
    });
  }
}
onCheckBox(checkBoxValue: boolean, data: any) {
  console.log(data);
  data.employeeID = this.EmployeeID;
  if (checkBoxValue) {
    data.checked = true;

    if (!this.selectedKAM.some(x => x.customerID === data.customerID)) {
      this.selectedKAM.push(data);
    }

  } else {
    data.checked = false;
    this.selectAll = false;

    this.selectedKAM = this.selectedKAM
      .filter(x => x.customerID !== data.customerID);
  }

  // Auto check header if all selected
  this.selectAll =
    this.selectedKAM.length === this.dataSource.length;
}
confirmAddKAM() {

  if (this.selectedKAM.length === 0) return;

  Swal.fire({
    title: 'Are you sure?',
    text: `You are about to add ${this.selectedKAM.length} record(s).`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Add'
  }).then((result) => {

    if (result.isConfirmed) {
      this.addKAMList();
    }

  });
}
addKAMList() {

  this.customerService.addList([...this.selectedKAM])
  .subscribe(
      response => 
      { 
        this.showNotification(
          'snackbar-success',
          'KAM Added Successfully...!!!',
          'bottom',
          'center'
        );
      //this.showConfirmButton = false;
      this.refresh();
    },
      error =>
      {
        this.showNotification(
          'snackbar-danger',
          'Operation Failed...!!!',
          'bottom',
          'center'
        );
      }
    );
 

}
}



