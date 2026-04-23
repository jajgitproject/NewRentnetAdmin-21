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
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { SupplierRateCardDropDown } from '../supplierRateCard/supplierRateCardDropDown.model';
import { CustomerCategoryDropDown } from '../customerCategory/customerCategoryDropDown.model';
import { CustomerAppBasedVehicleCategory } from './customerAppBasedVehicleCategory.model';
import { CustomerAppBasedVehicleCategoryService } from './customerAppBasedVehicleCategory.service';
import { VehicleCategoryDropDown } from 'src/app/general/vehicleCategoryDropDown.model';
@Component({
  standalone: false,
  selector: 'app-customerAppBasedVehicleCategory',
  templateUrl: './customerAppBasedVehicleCategory.component.html',
  styleUrls: ['./customerAppBasedVehicleCategory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerAppBasedVehicleCategoryComponent implements OnInit {
  displayedColumns = [
    'vehicleCategory',
    'status',
    'actions'
  ];
  dataSource: CustomerAppBasedVehicleCategory[] | null;
  customerAppVehicleCategoryMappingID: number;
  advanceTable: CustomerAppBasedVehicleCategory | null;
  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
 filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  supplier_ID: any;
  supplier_Name: any;
  public CityList?: CitiesDropDown[] = [];
  public RateList?: SupplierRateCardDropDown[] = [];
  searchCategoryBy: FormControl = new FormControl();
  customerID: any;
  
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true; 
  customerName: any;
  vehicleCategory: FormControl = new FormControl();
  searchVehicleCategory: any = '';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerAppBasedVehicleCategoryService: CustomerAppBasedVehicleCategoryService,
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
      
        this.customerID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerID));
        this.customerName = this._generalService.decrypt(decodeURIComponent(encryptedCustomerName));
      }
      
    });
    
    this.initVehicleCategories();
    this.initRate();
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.vehicleCategory.setValue('');
    this.SearchActivationStatus = true;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.PageNumber=0;
    this.loadData();
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }
  initVehicleCategories(){
    this._generalService.GetVehicleCategories().subscribe(
      data=>
      {
        this.VehicleCategoryList=data;
        this.filteredVehicleCategoryOptions = this.vehicleCategory.valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicleCategories(value || ''))
        ); 
      });
  }
  
  
  private _filterVehicleCategories(value: string): any {
    const filterValue = value.toLowerCase();
    // if(filterValue.length === 0) {
    //   return [];
    // }
    return this.VehicleCategoryList.filter(
      customer => 
      {
        return customer.vehicleCategory.toLowerCase().includes(filterValue);
      });
  }

  // initCustomerCategory(){
  //   this._generalService.getCustomerCategory().subscribe(
  //     data=>{
  //       this.customerCategoryList=data;
  //     }
  //   )
  //   //console.log(this.customerCategoryList)
  // }
  
  // initCustomerCategory(){
  //   this._generalService.getCustomerCategory().subscribe(
  //     data=>{
  //       this.customerCategoryList=data;
  //       this.filteredCategoryOptionss = this.search.valueChanges.pipe(
  //         startWith(""),
  //         map(value => this._filterCategory(value || ''))
  //       ); 

  //     }
  //   )
  
  // }
  // private _filterCategory(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.customerCategoryList.filter(
  //     customer => 
  //     {
  //       return customer.customerCategory.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
  // }

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
          action: 'add',
          customerID: this.customerID,
          customerName :this.customerName,
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerAppVehicleCategoryMappingID = row.customerAppVehicleCategoryMappingID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        customerID: this.customerID,
        customerName :this.customerName,
      }
    });

  }
  deleteItem(row)
  {

    this.customerAppVehicleCategoryMappingID = row.id;
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
     
      case 'vehicleCategory':
        this.vehicleCategory.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
 
    
      this.customerAppBasedVehicleCategoryService.getTableData(this.customerID,this.vehicleCategory.value,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerAppBasedVehicleCategory) {
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

  initRate(){
    this._generalService.GetRateList().subscribe(
      data=>
      {
        this.RateList=data;
      });
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
          if(this.MessageArray[0]=="CustomerAppBasedVehicleCategoryCreate")
          {
            if(this.MessageArray[1]=="CustomerAppBasedVehicleCategoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer App Based Vehicle Category Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAppBasedVehicleCategoryUpdate")
          {
            if(this.MessageArray[1]=="CustomerAppBasedVehicleCategoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer App Based Vehicle Category Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAppBasedVehicleCategoryDelete")
          {
            if(this.MessageArray[1]=="CustomerAppBasedVehicleCategoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer App Based Vehicle Category Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAppBasedVehicleCategoryAll")
          {
            if(this.MessageArray[1]=="CustomerAppBasedVehicleCategoryView")
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
    this.customerAppBasedVehicleCategoryService.getTableDataSort(this.customerID,this.searchVehicleCategory,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



