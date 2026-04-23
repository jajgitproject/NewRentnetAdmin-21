// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerContractCityTiersService } from './customerContractCityTiers.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerContractCityTiers } from './customerContractCityTiers.model';
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
import { CityTierDropDown } from '../cityTier/cityTierDropDown.model';
import { ConfirmationDialogComponent } from '../customerContractCarCategory/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ImportFromContractComponent } from './dialogs/importFromContract/importFromContract.component';
interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}
@Component({
  standalone: false,
  selector: 'app-customerContractCityTiers',
  templateUrl: './customerContractCityTiers.component.html',
  styleUrls: ['./customerContractCityTiers.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerContractCityTiersComponent implements OnInit {
  displayedColumns = [
    'customerContractCityTier',
    'status',
    'actions'
  ];
  dataSource: CustomerContractCityTiers[] | null;
  customerContractCityTiersID: number;
  advanceTable: CustomerContractCityTiers | null;
  advanceTableForm: CustomerContractCityTiers[] = [];
  searchCustomerContractCityTier: string = '';
  SearchCustomerContractCityTiersID:number=0;
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
  public cityTiersList?: CityTierDropDown[]=[]; 
  customerContractID: any;
  customerContractName: any;
  CustomerContractID:any;
  isLoading: boolean = false;
  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public router:Router,
    public customerContractCityTiersService: CustomerContractCityTiersService,
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
      const encryptedCustomerContractID = paramsData.CustomerContractID;
      const encryptedCustomerContractName = paramsData.CustomerContractName;
      
      if (encryptedCustomerContractID && encryptedCustomerContractName) {
        
          this.customerContractID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractID));
          this.customerContractName = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractName));
        }
        
      // this.customerContractID   = paramsData.CustomerContractID;
      // this.customerContractName   = paramsData.CustomerContractName;
  });
 
    this.initCustomerCategory();
    this.initRate();
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.searchCustomerContractCityTier = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
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
  // onImportClick()
  // {
  //   this.isLoading=true;
  //   this.getCityTier();
  // }
  onImportClick() {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message: 'Are you sure you want to import All Tiers And City categories?'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // User clicked Yes - Proceed with import
          this.isLoading = true;  // Show spinner
          this.getCityTier();  // Fetch the vehicle categories
        } else {
          // User clicked No - Do nothing
        }
      });
    }

  getCityTier()
  {
    this._generalService.getCityTier().subscribe(
      data =>
      {
        this.cityTiersList=data;
        this.advanceTableForm = this.cityTiersList.map(cityTiers => 
          new CustomerContractCityTiers({
            customerContractCityTiersID: -1, 
            customerContractID: this.customerContractID,
            customerContractCityTier: cityTiers.cityTierName,
            activationStatus: true,
            userID: this._generalService.getUserID(),
            cityTierID:cityTiers.cityTierID
          })
        );
        this.saveCustomerContractCityTiers()
      }
    );
  }
  saveCustomerContractCityTiers() {
    this.customerContractCityTiersService.SaveCustomerContractCityTiers(this.advanceTableForm).subscribe(
      response => {
        if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
          this.isLoading = false;
      } else {
          this._generalService.sendUpdate('CustomerContractCityTiersCreate:CustomerContractCityTiersView:Success');
          this.isLoading = false;
      }
         
      },
      error => {
          console.error('Error saving customer contract city tier', error);
          this._generalService.sendUpdate('CustomerContractCityTiersAll:CustomerContractCityTiersView:Failure');
          this.isLoading = false;  // Hide spinner in case of error
      }
  );
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
  menuItems: any[] = [
    { label: 'City Tiers City Mapping', tooltip:'City Tiers City Mapping' },
    
  ];
  // openInNewTab(menuItem: any, rowItem: any) {
  //   let baseUrl = this._generalService.FormURL;
  //   if(menuItem.label.toLowerCase() === 'city tiers city mapping') {
  //     const url = this.router.serializeUrl(this.router.createUrlTree(['/customerContractCityTiersCityMapping',  ], { queryParams: {
  //       CustomerContractCityTiersID: rowItem.customerContractCityTiersID,
  //        CustomerContractCityTier: rowItem.customerContractCityTier,
  //        CustomerContractName: this.customerContractName,
      
  //     } }));
  //     window.open(baseUrl + url, '_blank'); 
     
  //   } 
  // }

  // customerContractCityTiersCityMapping(row) {
  //   row.customerContractName = this.customerContractName;
  //   this.router.navigate([
  //     '/customerContractCityTiersCityMapping',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerContractCityTiersID: row.customerContractCityTiersID,
  //       CustomerContractCityTier: row.customerContractCityTier,
  //       CustomerContractName: row.customerContractName,
  //     }
  //   }); 
  // }

  openInNewTab(menuItem: any, rowItem: any) {
    let baseUrl = this._generalService.FormURL;
  
    // Encrypt the required parameters
    const encryptedCustomerContractCityTiersID = encodeURIComponent(this._generalService.encrypt(rowItem.customerContractCityTiersID.toString()));
    const encryptedCustomerContractCityTier = encodeURIComponent(this._generalService.encrypt(rowItem.customerContractCityTier));
    const encryptedCustomerContractName = encodeURIComponent(this._generalService.encrypt(this.customerContractName));
  
    if (menuItem.label.toLowerCase() === 'city tiers city mapping') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/customerContractCityTiersCityMapping'], { queryParams: {
        CustomerContractCityTiersID: encryptedCustomerContractCityTiersID,
        CustomerContractCityTier: encryptedCustomerContractCityTier,
        CustomerContractName: encryptedCustomerContractName
      }}));
      window.open(baseUrl + url, '_blank'); 
    }
  }
  
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
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
  editCall(row) {
    row.customerContractID = this.customerContractID;
    this.customerContractCityTiersID = row.customerContractCityTiersID;
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

    this.customerContractCityTiersID = row.id;
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
      case 'cityTiers':
        this.searchCustomerContractCityTier = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.customerContractCityTiersService.getTableData(this.customerContractID,this.searchCustomerContractCityTier,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerContractCityTiers) {
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
          if(this.MessageArray[0]=="CustomerContractCityTiersCreate")
          {
            if(this.MessageArray[1]=="CustomerContractCityTiersView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Contract City Tiers Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractCityTiersUpdate")
          {
            if(this.MessageArray[1]=="CustomerContractCityTiersView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Contract City Tiers Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractCityTiersDelete")
          {
            if(this.MessageArray[1]=="CustomerContractCityTiersView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Contract City Tiers Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractCityTiersAll")
          {
            if(this.MessageArray[1]=="CustomerContractCityTiersView")
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
    this.customerContractCityTiersService.getTableDataSort(this.customerContractID,this.searchCustomerContractCityTier,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



