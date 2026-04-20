// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VendorContractCityTiersService } from './vendorContractCityTiers.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VendorContractCityTiersModel } from './vendorContractCityTiers.model';
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
import { CityTierDropDown } from '../cityTier/cityTierDropDown.model';
import { ConfirmationDialogComponent } from '../vendorContractCarCategory/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ImportFromContractComponent } from './dialogs/importFromContract/importFromContract.component';
import { VendorCategoryDropDownModel } from '../vendorContractCarCategory/vendorContractCarCategory.model';
import { VendorContractCarCategoryService } from '../vendorContractCarCategory/vendorContractCarCategory.service';
interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}
@Component({
  standalone: false,
  selector: 'app-vendorContractCityTiers',
  templateUrl: './vendorContractCityTiers.component.html',
  styleUrls: ['./vendorContractCityTiers.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VendorContractCityTiersComponent implements OnInit {
  displayedColumns = [
    'vendorContractCityTier',
    'status',
    'actions'
  ];
  dataSource: VendorContractCityTiersModel[] | null;
  vendorContractCityTiersID: number;
  advanceTable: VendorContractCityTiersModel | null;
  advanceTableForm: VendorContractCityTiersModel[] = [];
  searchVendorContractCityTier: string = '';
  SearchVendorContractCityTiersID:number=0;
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
  public cityTiersList?: CityTierDropDown[]=[]; 
  vendorContractID: any;
  vendorContractName: any;
  VendorContractID:any;
  isLoading: boolean = false;
  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public router:Router,
    public vendorContractCityTiersService: VendorContractCityTiersService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public vendorContractCarCategoryService: VendorContractCarCategoryService,
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
    this.searchVendorContractCityTier = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
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
  
  
  onImportClick() 
  {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to import All Tiers And City categories?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) 
      {
        this.isLoading = true;  // Show spinner
        this.getCityTier();  // Fetch the vehicle categories
        }
        else 
        {
          // User clicked No - Do nothing
          console.log('Import canceled');
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
          new VendorContractCityTiersModel({
            vendorContractCityTiersID: -1, 
            vendorContractID: this.vendorContractID,
            vendorContractCityTier: cityTiers.cityTierName,
            activationStatus: true,
            userID: this._generalService.getUserID(),
            cityTierID:cityTiers.cityTierID
          })
        );
        console.log(this.advanceTableForm);
        this.saveVendorContractCityTiers()
      }
    );
  }


  saveVendorContractCityTiers() 
  {
    this.vendorContractCityTiersService.SaveVendorContractCityTiers(this.advanceTableForm).subscribe(
      response => {
      if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) 
      {
        this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
        this.isLoading = false;
      } 
      else 
      {
        this._generalService.sendUpdate('VendorContractCityTiersCreate:VendorContractCityTiersView:Success');
        this.isLoading = false;
      }
         
      },
      error => 
      {
        this._generalService.sendUpdate('VendorContractCityTiersAll:VendorContractCityTiersView:Failure');
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
          vendorContractID: this.vendorContractID,
          vendorContractName :this.vendorContractName,
        }
    });
  }

  menuItems: any[] = [
    { label: 'City Tiers City Mapping', tooltip:'City Tiers City Mapping' },
  ];
  

  openInNewTab(menuItem: any, rowItem: any) 
  {
    let baseUrl = this._generalService.FormURL;
    const encryptedVendorContractCityTiersID = encodeURIComponent(this._generalService.encrypt(rowItem.vendorContractCityTiersID.toString()));
    const encryptedVendorContractCityTier = encodeURIComponent(this._generalService.encrypt(rowItem.vendorContractCityTier));
    const encryptedVendorContractName = encodeURIComponent(this._generalService.encrypt(this.vendorContractName));
  
    if (menuItem.label.toLowerCase() === 'city tiers city mapping') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/vendorContractCityTiersCityMapping'], { queryParams: {
        VendorContractCityTiersID: encryptedVendorContractCityTiersID,
        VendorContractCityTier: encryptedVendorContractCityTier,
        VendorContractName: encryptedVendorContractName
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
          vendorContractID: this.vendorContractID,
          vendorContractName :this.vendorContractName,
        }
    });
  }


  editCall(row) 
  {
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
    this.vendorContractCityTiersID = row.id;
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
        this.searchVendorContractCityTier = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.vendorContractCityTiersService.getTableData(this.vendorContractID,this.searchVendorContractCityTier,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }


  showNotification(colorName, text, placementFrom, placementAlign) 
  {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  onContextMenu(event: MouseEvent, item: VendorContractCityTiersModel) 
  {
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
          if(this.MessageArray[0]=="VendorContractCityTiersCreate")
          {
            if(this.MessageArray[1]=="VendorContractCityTiersView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Vendor Contract City Tiers Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractCityTiersUpdate")
          {
            if(this.MessageArray[1]=="VendorContractCityTiersView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vendor Contract City Tiers Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractCityTiersDelete")
          {
            if(this.MessageArray[1]=="VendorContractCityTiersView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vendor Contract City Tiers Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractCityTiersAll")
          {
            if(this.MessageArray[1]=="VendorContractCityTiersView")
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
    this.vendorContractCityTiersService.getTableDataSort(this.vendorContractID,this.searchVendorContractCityTier,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



