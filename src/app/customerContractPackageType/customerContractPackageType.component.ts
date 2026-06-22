// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerContractPackageTypeService } from './customerContractPackageType.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerContractPackageType } from './customerContractPackageType.model';
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
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
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
  selector: 'app-customerContractPackageType',
  templateUrl: './customerContractPackageType.component.html',
  styleUrls: ['./customerContractPackageType.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerContractPackageTypeComponent implements OnInit {
  displayedColumns = [
    'customerContractPackageType',
    'status',
    'actions'
  ];
  dataSource: CustomerContractPackageType[] | null;
  packageTypeList: PackageTypeDropDown[] | null;
  customerContractPackageTypeID: number;
  advanceTable: CustomerContractPackageType | null;
  advanceTableForm: CustomerContractPackageType[] = [];
  searchcustomerContractPackageType: string = '';
  SearchCustomerContractPackageTypeID:number=0;
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
    { label: 'Package Type Package Mapping', tooltip:'Customer Contract Package Type Package Mapping' },
    
  ];

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public router:Router,
    public customerContractPackageTypeService: CustomerContractPackageTypeService,
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
    this.searchcustomerContractPackageType = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  // openInNewTab(menuItem: any, rowItem: any) {
  //   let baseUrl = this._generalService.FormURL;
  //   if(menuItem.label.toLowerCase() === 'Package Type Package Mapping') {
  //     const url = this.router.serializeUrl(this.router.createUrlTree(['/customerContractCarCategoriesCarMapping',  ], { queryParams: {
  //       CustomerContractPackageTypeID: rowItem.customerContractPackageTypeID,
  //       CustomerContractPackageType: rowItem.customerContractPackageType,
  //       CustomerContractName:this.customerContractName,
  //      // CustomerContractName: rowItem.customerContractName,
      
  //     } }));
  //     window.open(baseUrl + url, '_blank'); 
     
  //   } 
  // }
  openInNewTab(menuItem: any, rowItem: any) {
    let baseUrl = this._generalService.FormURL;
    if(menuItem.label.toLowerCase() === 'package type package mapping') {
      // Encrypt the required parameters
       const encryptedCustomerContractID = encodeURIComponent(this._generalService.encrypt(this.customerContractID));
      const encryptedCustomerContractPackageTypeID = encodeURIComponent(this._generalService.encrypt(rowItem.customerContractPackageTypeID.toString()));
      const encryptedCustomerContractPackageType = encodeURIComponent(this._generalService.encrypt(rowItem.customerContractPackageType));
      const encryptedCustomerContractName = encodeURIComponent(this._generalService.encrypt(this.customerContractName));
  
      // Create the URL with encrypted parameters
      const url = this.router.serializeUrl(this.router.createUrlTree(['/customerContractPackageTypePackageMapping'], { queryParams: {
        CustomerContractID:encryptedCustomerContractID,
        CustomerContractPackageTypeID: encryptedCustomerContractPackageTypeID,
        CustomerContractPackageType: encryptedCustomerContractPackageType,
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
  //       CustomerContractPackageTypeID: row.customerContractPackageTypeID,
  //       CustomerContractPackageType: row.CustomerContractPackageType,
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
          CustomerContractPackageTypeID: this.customerContractPackageTypeID,
          customerContractID: this.customerContractID,
          customerContractName :this.customerContractName,
        }
    });
  }
  editCall(row) {
    row.customerContractID = this.customerContractID;
    this.customerContractPackageTypeID = row.customerContractPackageTypeID;
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

    this.customerContractPackageTypeID = row.id;
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
      case 'packageType':
        this.searchcustomerContractPackageType = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.customerContractPackageTypeService.getTableData(this.customerContractID,this.searchcustomerContractPackageType,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerContractPackageType) {
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
          if(this.MessageArray[0]=="CustomerContractPackageTypeCreate")
          {
            if(this.MessageArray[1]=="CustomerContractPackageTypeView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Contract Package Type Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractPackageTypeUpdate")
          {
            if(this.MessageArray[1]=="CustomerContractPackageTypeView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Contract Package Type Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractPackageTypeDelete")
          {
            if(this.MessageArray[1]=="CustomerContractPackageTypeView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Contract Package Type Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractPackageTypeAll")
          {
            if(this.MessageArray[1]=="CustomerContractPackageTypeView")
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
    this.customerContractPackageTypeService.getTableDataSort(this.customerContractID,this.searchcustomerContractPackageType,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
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
  //   this.getPackageType();
  // }

  // getPackageType()
  // {
  //   this._generalService.GetPackageTypes().subscribe(
  //     data =>
  //     {
  //       this.packageTypeList=data;
  //       this.advanceTableForm = this.packageTypeList.map(PackageType => 
  //         new CustomerContractPackageType({
  //           CustomerContractPackageTypeID: -1, 
  //           customerContractID: this.customerContractID,
  //           CustomerContractPackageType: PackageType.PackageType,
  //           activationStatus: true,
  //           userID: this._generalService.getUserID(),
  //           PackageTypeID:PackageType.PackageTypeID
  //         })
  //       );
  //       this.saveCustomerContractPackageType()
  //     }
  //   );
  // }

  // saveCustomerContractPackageType() {
  //   
  //   this.customerContractPackageTypeService.SaveCustomerContractPackageType(this.advanceTableForm).subscribe(
  //     response => {
  //       this._generalService.sendUpdate('CustomerContractPackageTypeCreate:CustomerContractPackageTypeView:Success');
  //     },
  //     error => {
  //       this._generalService.sendUpdate('CustomerContractPackageTypeAll:CustomerContractPackageTypeView:Failure');//To Send Updates  
  //     }
  //   );
  // }
  // Function triggered when Import button is clicked
  onImportClick() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to import package types?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User clicked Yes - Proceed with import
        this.isLoading = true;  // Show spinner
        this.getPackageType();  // Fetch the package types
      } else {
        // User clicked No - Do nothing
      }
    });
  }

// Fetch package types from the service
getPackageType() {
    this._generalService.GetPackageTypes().subscribe(
        data => {
            this.packageTypeList = data;
            this.advanceTableForm = this.packageTypeList.map(packageType => 
                new CustomerContractPackageType({
                    customerContractPackageTypeID: -1, 
                    customerContractID: this.customerContractID,
                    customerContractPackageType: packageType.packageType,
                    activationStatus: true,
                    userID: this._generalService.getUserID(),
                    packageTypeID: packageType.packageTypeID
                })
            );
            
            // Save the customer contract Package Type once the categories are fetched
            this.saveCustomerContractPackageType();
        },
        error => {
            console.error('Error fetching package types', error);
            this.isLoading = false;  // Hide spinner in case of error
        }
    );
}

// Save the customer contract Package Type
saveCustomerContractPackageType() {
    this.customerContractPackageTypeService.SaveCustomerContractPackageType(this.advanceTableForm).subscribe(
        response => {
          if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) {
            this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
            this.isLoading = false;
        } else {
            this._generalService.sendUpdate('CustomerContractPackageTypeCreate:CustomerContractPackageTypeView:Success');
            this.isLoading = false;
        }
           
        },
        error => {
            console.error('Error saving customer contract Package Type', error);
            this._generalService.sendUpdate('CustomerContractPackageTypeAll:CustomerContractPackageTypeView:Failure');
            this.isLoading = false;  // Hide spinner in case of error
        }
    );
}
}



