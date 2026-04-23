// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerContractCarCategoryService } from './customerContractCarCategory.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerContractCarCategory } from './customerContractCarCategory.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { SupplierRateCardDropDown } from '../supplierRateCard/supplierRateCardDropDown.model';
import { CustomerCategoryDropDown } from '../customerCategory/customerCategoryDropDown.model';
import { Tooltip } from 'chart.js';
import { VehicleCategoryDropDown } from '../vehicleCategory/vehicleCategoryDropDown.model';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { ImportFromContractComponent } from './dialogs/importFromContract/importFromContract.component';

interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}
@Component({
  standalone: false,
  selector: 'app-customerContractCarCategory',
  templateUrl: './customerContractCarCategory.component.html',
  styleUrls: ['./customerContractCarCategory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerContractCarCategoryComponent implements OnInit {
  displayedColumns = [
    'customerContractCarCategory',
    'status',
    'actions'
  ];
  dataSource: CustomerContractCarCategory[] | null;
  vehicleCategoryList: VehicleCategoryDropDown[] | null;
  customerContractCarCategoryID: number;
  advanceTable: CustomerContractCarCategory | null;
  advanceTableForm: CustomerContractCarCategory[] = [];
  searchcustomerContractCarCategory: string = '';
  SearchCustomerContractCarCategoryID:number=0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  customerContractCityTier : FormControl = new FormControl();
  email : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  supplier_ID: any;
  supplier_Name: any;
  public CityList?: CitiesDropDown[] = [];
  public RateList?: SupplierRateCardDropDown[] = [];
  public customerCategoryList?: CustomerCategoryDropDown[] = [];
  customerContractID: any;
  customerContractName: any;
  CustomerContractID:any;
  isLoading = false;
  menuItems: any[] = [
    { label: 'Car Categories Car Mapping', tooltip:'Customer Contract Car Categories Car Mapping' },
    
  ];

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public router:Router,
    public customerContractCarCategoryService: CustomerContractCarCategoryService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      // this.customerContractID   = paramsData.CustomerContractID;
      // this.customerContractName   = paramsData.CustomerContractName;
      const encryptedCustomerContractID = paramsData.CustomerContractID;
      const encryptedCustomerContractName = paramsData.CustomerContractName;
      
      if (encryptedCustomerContractID && encryptedCustomerContractName) {
        
          this.customerContractID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractID));
          this.customerContractName = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractName));
        }
        
      
  });
    this.initCustomerCategory();
    this.initRate();
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.searchcustomerContractCarCategory = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  // openInNewTab(menuItem: any, rowItem: any) {
  //   let baseUrl = this._generalService.FormURL;
  //   if(menuItem.label.toLowerCase() === 'car categories car mapping') {
  //     const url = this.router.serializeUrl(this.router.createUrlTree(['/customerContractCarCategoriesCarMapping',  ], { queryParams: {
  //       CustomerContractCarCategoryID: rowItem.customerContractCarCategoryID,
  //       CustomerContractCarCategory: rowItem.customerContractCarCategory,
  //       CustomerContractName:this.customerContractName,
  //      // CustomerContractName: rowItem.customerContractName,
      
  //     } }));
  //     window.open(baseUrl + url, '_blank'); 
     
  //   } 
  // }
  openInNewTab(menuItem: any, rowItem: any) {
    let baseUrl = this._generalService.FormURL;
    if(menuItem.label.toLowerCase() === 'car categories car mapping') {
      // Encrypt the required parameters
       const encryptedCustomerContractID = encodeURIComponent(this._generalService.encrypt(this.customerContractID));
      const encryptedCustomerContractCarCategoryID = encodeURIComponent(this._generalService.encrypt(rowItem.customerContractCarCategoryID.toString()));
      const encryptedCustomerContractCarCategory = encodeURIComponent(this._generalService.encrypt(rowItem.customerContractCarCategory));
      const encryptedCustomerContractName = encodeURIComponent(this._generalService.encrypt(this.customerContractName));
  
      // Create the URL with encrypted parameters
      const url = this.router.serializeUrl(this.router.createUrlTree(['/customerContractCarCategoriesCarMapping'], { queryParams: {
        CustomerContractID:encryptedCustomerContractID,
        CustomerContractCarCategoryID: encryptedCustomerContractCarCategoryID,
        CustomerContractCarCategory: encryptedCustomerContractCarCategory,
        CustomerContractName: encryptedCustomerContractName
      }}));
  
      // Open the new tab with the encrypted parameters
      window.open(baseUrl + url, '_blank'); 
    }
  }
  
  initCustomerCategory(){
    this._generalService.getCustomerCategory().subscribe(
      data=>{
        this.customerCategoryList=data;
      }
    )
    
  }

  public SearchData()
  {
    this.loadData();    
  }

  // customerContractCarCategoriesCarMapping(row) {
  //   row.customerContractName = this.customerContractName;
  //   this.router.navigate([
  //     '/customerContractCarCategoriesCarMapping',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerContractCarCategoryID: row.customerContractCarCategoryID,
  //       CustomerContractCarCategory: row.customerContractCarCategory,
  //       CustomerContractName: row.customerContractName,
  //     }
  //   }); 
  // }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          customerContractCarCategoryID: this.customerContractCarCategoryID,
          customerContractID: this.customerContractID,
          customerContractName :this.customerContractName,
        }
    });
  }
  editCall(row) {
    row.customerContractID = this.customerContractID;
    this.customerContractCarCategoryID = row.customerContractCarCategoryID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        customerContractID: this.customerContractID,
        customerContractName :this.customerContractName,
      }
    });
    
  }
  deleteItem(row)
  {

    this.customerContractCarCategoryID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }
 importFromContract()
  {
    const dialogRef = this.dialog.open(ImportFromContractComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          customerContractID: this.customerContractID,
          customerContractName :this.customerContractName,
        }
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
  
  onBackPress(event) 
  {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

   public loadData() 
   {
    switch (this.selectedFilter)
    {
      case 'carCategory':
        this.searchcustomerContractCarCategory = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.customerContractCarCategoryService.getTableData(this.customerContractID,this.searchcustomerContractCarCategory,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerContractCarCategory) {
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
          if(this.MessageArray[0]=="CustomerContractCarCategoryCreate")
          {
            if(this.MessageArray[1]=="CustomerContractCarCategoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Contract Car Category Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractCarCategoryUpdate")
          {
            if(this.MessageArray[1]=="CustomerContractCarCategoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Contract Car Category Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractCarCategoryDelete")
          {
            if(this.MessageArray[1]=="CustomerContractCarCategoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Contract Car Category Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractCarCategoryAll")
          {
            if(this.MessageArray[1]=="CustomerContractCarCategoryView")
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
    this.customerContractCarCategoryService.getTableDataSort(this.customerContractID,this.searchcustomerContractCarCategory,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  // onImportClick()
  // {
  //   this.getVehicleCategory();
  // }

  // getVehicleCategory()
  // {
  //   this._generalService.GetVehicleCategories().subscribe(
  //     data =>
  //     {
  //       this.vehicleCategoryList=data;
  //       this.advanceTableForm = this.vehicleCategoryList.map(vehicleCategory => 
  //         new CustomerContractCarCategory({
  //           customerContractCarCategoryID: -1, 
  //           customerContractID: this.customerContractID,
  //           customerContractCarCategory: vehicleCategory.vehicleCategory,
  //           activationStatus: true,
  //           userID: this._generalService.getUserID(),
  //           vehicleCategoryID:vehicleCategory.vehicleCategoryID
  //         })
  //       );
  //       this.saveCustomerContractCarCategory()
  //     }
  //   );
  // }

  // saveCustomerContractCarCategory() {
  //   debugger;
  //   this.customerContractCarCategoryService.SaveCustomerContractCarCategory(this.advanceTableForm).subscribe(
  //     response => {
  //       this._generalService.sendUpdate('CustomerContractCarCategoryCreate:CustomerContractCarCategoryView:Success');
  //     },
  //     error => {
  //       this._generalService.sendUpdate('CustomerContractCarCategoryAll:CustomerContractCarCategoryView:Failure');//To Send Updates  
  //     }
  //   );
  // }
  // Function triggered when Import button is clicked
  onImportClick() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to import vehicle categories?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User clicked Yes - Proceed with import
        this.isLoading = true;  // Show spinner
        this.getVehicleCategory();  // Fetch the vehicle categories
      } else {
        // User clicked No - Do nothing
      }
    });
  }

// Fetch vehicle categories from the service
getVehicleCategory() {
    this._generalService.GetVehicleCategories().subscribe(
        data => {
            this.vehicleCategoryList = data;
            this.advanceTableForm = this.vehicleCategoryList.map(vehicleCategory => 
                new CustomerContractCarCategory({
                    customerContractCarCategoryID: -1, 
                    customerContractID: this.customerContractID,
                    customerContractCarCategory: vehicleCategory.vehicleCategory,
                    activationStatus: true,
                    userID: this._generalService.getUserID(),
                    vehicleCategoryID: vehicleCategory.vehicleCategoryID
                })
            );
            
            // Save the customer contract car category once the categories are fetched
            this.saveCustomerContractCarCategory();
        },
        error => {
            console.error('Error fetching vehicle categories', error);
            this.isLoading = false;  // Hide spinner in case of error
        }
    );
}

// Save the customer contract car category
saveCustomerContractCarCategory() {
    this.customerContractCarCategoryService.SaveCustomerContractCarCategory(this.advanceTableForm).subscribe(
        response => {
          if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) {
            this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
            this.isLoading = false;
        } else {
            this._generalService.sendUpdate('CustomerContractCarCategoryCreate:CustomerContractCarCategoryView:Success');
            this.isLoading = false;
        }
           
        },
        error => {
            console.error('Error saving customer contract car category', error);
            this._generalService.sendUpdate('CustomerContractCarCategoryAll:CustomerContractCarCategoryView:Failure');
            this.isLoading = false;  // Hide spinner in case of error
        }
    );
}
}



