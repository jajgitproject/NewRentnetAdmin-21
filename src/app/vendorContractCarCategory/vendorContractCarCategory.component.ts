// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VendorContractCarCategoryService } from './vendorContractCarCategory.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VendorCategoryDropDownModel, VendorContractCarCategoryModel } from './vendorContractCarCategory.model';
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
import { Tooltip } from 'chart.js';
import { VehicleCategoryDropDown } from '../vehicleCategory/vehicleCategoryDropDown.model';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { ImportFromContractComponent } from './dialogs/importFromContract/importFromContract.component';
import { CustomerCategoryDropDown } from '../customerCategory/customerCategoryDropDown.model';

interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}
@Component({
  standalone: false,
  selector: 'app-vendorContractCarCategory',
  templateUrl: './vendorContractCarCategory.component.html',
  styleUrls: ['./vendorContractCarCategory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VendorContractCarCategoryComponent implements OnInit {
  displayedColumns = [
    'vendorContractCarCategory',
    'status',
    'actions'
  ];
  dataSource: VendorContractCarCategoryModel[] | null;
  vehicleCategoryList: VehicleCategoryDropDown[] | null;
  vendorContractCarCategoryID: number;
  advanceTable: VendorContractCarCategoryModel | null;
  advanceTableForm: VendorContractCarCategoryModel[] = [];
  searchvendorContractCarCategory: string = '';
  SearchVendorContractCarCategoryID:number=0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  vendorContractCityTier : FormControl = new FormControl();
  email : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  supplier_ID: any;
  supplier_Name: any;
  public CityList?: CitiesDropDown[] = [];
  public RateList?: SupplierRateCardDropDown[] = [];
  public vendorCategoryList?: VendorCategoryDropDownModel[] = [];
  vendorContractID: any;
  vendorContractName: any;
  VendorContractID:any;
  isLoading = false;
  menuItems: any[] = [
    { label: 'Car Categories Car Mapping', tooltip:'Vendor Contract Car Categories Car Mapping' },
    
  ];

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public router:Router,
    public vendorContractCarCategoryService: VendorContractCarCategoryService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedVendorContractID = paramsData.VendorContractID;
      const encryptedVendorContractName = paramsData.VendorContractName;
        
      this.vendorContractID = this._generalService.decrypt(decodeURIComponent(encryptedVendorContractID));
      this.vendorContractName = this._generalService.decrypt(decodeURIComponent(encryptedVendorContractName));        
      console.log(this.vendorContractID,this.vendorContractName);     
  });
    this.InitVendorCategory();
    this.loadData();
    this.SubscribeUpdateService();
  }

  refresh()
  {
    this.searchvendorContractCarCategory = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  openInNewTab(menuItem: any, rowItem: any) 
  {
    let baseUrl = this._generalService.FormURL;
    if(menuItem.label.toLowerCase() === 'car categories car mapping') {
      // Encrypt the required parameters
      const encryptedVendorContractID = encodeURIComponent(this._generalService.encrypt(this.vendorContractID));
      const encryptedVendorContractName = encodeURIComponent(this._generalService.encrypt(this.vendorContractName));
      const encryptedVendorContractCarCategoryID = encodeURIComponent(this._generalService.encrypt(rowItem.vendorContractCarCategoryID.toString()));
      const encryptedVendorContractCarCategory = encodeURIComponent(this._generalService.encrypt(rowItem.vendorContractCarCategory));      
  
      // Create the URL with encrypted parameters
      const url = this.router.serializeUrl(this.router.createUrlTree(['/vendorContractCarCategoriesCarMapping'], { queryParams: {
        VendorContractID:encryptedVendorContractID,
        VendorContractName: encryptedVendorContractName,
        VendorContractCarCategoryID: encryptedVendorContractCarCategoryID,
        VendorContractCarCategory: encryptedVendorContractCarCategory,        
      }}));
      window.open(baseUrl + url, '_blank'); 
    }
  }
  
  InitVendorCategory()
  {
    this.vendorContractCarCategoryService.getVendorCategory().subscribe(
      data=>{
        this.vendorCategoryList=data;
      }
    )    
  }

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
          vendorContractCarCategoryID: this.vendorContractCarCategoryID,
          vendorContractID: this.vendorContractID,
          vendorContractName :this.vendorContractName,
        }
    });
  }
  
  editCall(row) 
  {
    row.vendorContractID = this.vendorContractID;
    this.vendorContractCarCategoryID = row.vendorContractCarCategoryID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        vendorContractID: this.vendorContractID,
        vendorContractName :this.vendorContractName,
      }
    }); 
  }

  deleteItem(row)
  {
    this.vendorContractCarCategoryID = row.id;
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
          vendorContractID: this.vendorContractID,
          vendorContractName :this.vendorContractName,
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
        this.searchvendorContractCarCategory = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
    this.vendorContractCarCategoryService.getTableData(this.vendorContractID,this.searchvendorContractCarCategory,this.SearchActivationStatus, this.PageNumber).subscribe
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

  onContextMenu(event: MouseEvent, item: VendorContractCarCategoryModel) {
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
      this.loadData();    
    } 
  }



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
          if(this.MessageArray[0]=="VendorContractCarCategoryCreate")
          {
            if(this.MessageArray[1]=="VendorContractCarCategoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Vendor Contract Car Category Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractCarCategoryUpdate")
          {
            if(this.MessageArray[1]=="VendorContractCarCategoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vendor Contract Car Category Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractCarCategoryDelete")
          {
            if(this.MessageArray[1]=="VendorContractCarCategoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vendor Contract Car Category Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractCarCategoryAll")
          {
            if(this.MessageArray[1]=="VendorContractCarCategoryView")
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

  SortingData(coloumName:any) 
  {
    if (this.sortingData == 1) 
    {
      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else 
    {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.vendorContractCarCategoryService.getTableDataSort(this.vendorContractID,this.searchvendorContractCarCategory,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  
  // Function triggered when Import button is clicked
  onImportClick() 
  {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to import vehicle categories?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.isLoading = true;  // Show spinner
        this.getVehicleCategory();  // Fetch the vehicle categories
      } 
      else 
      {
        console.log('Import canceled');
      }
    });
  }

// Fetch vehicle categories from the service
  getVehicleCategory() 
  {
    this._generalService.GetVehicleCategories().subscribe(
        data => {
            this.vehicleCategoryList = data;
            this.advanceTableForm = this.vehicleCategoryList.map(vehicleCategory => 
                new VendorContractCarCategoryModel({
                    vendorContractCarCategoryID: -1, 
                    vendorContractID: this.vendorContractID,
                    vendorContractCarCategory: vehicleCategory.vehicleCategory,
                    activationStatus: true,
                    userID: this._generalService.getUserID(),
                    vehicleCategoryID: vehicleCategory.vehicleCategoryID
                })
            );
            
            // Save the vendor contract car category once the categories are fetched
            this.saveVendorContractCarCategory();
        },
        error => {
            console.error('Error fetching vehicle categories', error);
            this.isLoading = false;  // Hide spinner in case of error
        }
    );
  }

// Save the vendor contract car category
  saveVendorContractCarCategory() 
  {
    this.vendorContractCarCategoryService.SaveVendorContractCarCategory(this.advanceTableForm).subscribe(
        response => {
          if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) 
          {
            this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
            this.isLoading = false;
          } 
          else 
          {
            this._generalService.sendUpdate('VendorContractCarCategoryCreate:VendorContractCarCategoryView:Success');
            this.isLoading = false;
          } 
        },
        error => {
            console.error('Error saving vendor contract car category', error);
            this._generalService.sendUpdate('VendorContractCarCategoryAll:VendorContractCarCategoryView:Failure');
            this.isLoading = false;  // Hide spinner in case of error
        }
      );
  }
}



