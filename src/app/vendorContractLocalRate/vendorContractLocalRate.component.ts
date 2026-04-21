// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VendorContractLocalRateService } from './vendorContractLocalRate.service';
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
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleCategoryDropDown } from '../vehicleCategory/vehicleCategoryDropDown.model';
import { PackageDropDown } from '../package/packageDropDown.model';
import { CityTierDropDown } from '../cityTier/cityTierDropDown.model';
import { CustomerContractCarCategoryDropDown } from './customerContractCarCategoryDropDown.model';
import { CustomerContractCityTiersDropDown } from './customerContractCityTiersDropDown.model';
import { VendorContractCityTiersDropDownModel, VendorContractLocalRateModel, VendorLocalFixedDetailsModel } from './vendorContractLocalRate.model';
import { VendorContractCarCategoryDropDownModel } from '../vendorContractCarCategory/vendorContractCarCategory.model';
import { VendorLocalFixedDetails } from './dialogs/vendorFixedDetails/vendorFixedDetails.component';

interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}
@Component({
  standalone: false,
  selector: 'app-vendorContractLocalRate',
  templateUrl: './vendorContractLocalRate.component.html',
  styleUrls: ['./vendorContractLocalRate.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VendorContractLocalRateComponent implements OnInit {
  displayedColumns = [
    'VendorContractCarCategory',
    'VendorContractCityTier',
    'package',
    'MinimumHours',
    'MinimumKM',
    'baseRate',
    'NightCharge',
    'DriverAllowance',
    'BillFromTo',
    'FKMP2P',
    'FixedP2PAmount',
    'status',
    'actions'
  ];

  displayColumnsOfFRD = [
    'BillFromTo',
    'PackageGraceKms',
    'PackageGraceMinutes',
    'PackageJumpCriteria',
    'NextPackageSelectionCriteria',
    //'AddtionalKms',
    //'AddtionalMinutes',
    'ShowAddtionalKMAndHours'
  ];

  dataSource: VendorContractLocalRateModel[] | null;
  cdcLocalRateID: number;
  CDCLocalRateID: number=0;
  advanceTable: VendorContractLocalRateModel | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  supplierRateCard_Name: any;
  Applicable_To: any;
  Applicable_From: any;
  customerContract_ID: any;
  customerContract_Name: any;

  vehicleCategory : FormControl = new FormControl();
  SearchVehicleCategory:string='';
  
  cityTier : FormControl = new FormControl();
  SearchCityTier:string='';
  
  package: FormControl = new FormControl();
  SearchPackage:string='';
  
  baseRate : FormControl = new FormControl();
  SearchBaseRate:string='';
  
  public VehicleCategoryList?: VendorContractCarCategoryDropDownModel[] = [];
  filteredCategoryOptions: Observable<VendorContractCarCategoryDropDownModel[]>;
  
  public PackageList?: PackageDropDown[] = [];
  public CityTierList?: VendorContractCityTiersDropDownModel[] = [];
  filteredTierOptions: Observable<VendorContractCityTiersDropDownModel[]>;

  searchCategoryBy: FormControl = new FormControl();
  
  searchTierBy: FormControl = new FormControl();
  filteredPackageOptions: Observable<CustomerContractCityTiersDropDown[]>;
  searchPackageBy: FormControl = new FormControl();

  SearchBillFromTo: string='';
  SearchPackageJumpCriteria: string='';
  SearchNextPackageCriteria:string='';
  advanceTableForFRD: VendorLocalFixedDetailsModel | null;

  searchTerm: any = '';
  selectedFilter: string = 'search';

menuItems: any[] = [
  { label: 'CDC Local Fixed Rate',  },
  
];
  cdcLocalFixedDetailsID: any;
  VendorContract_ID: any;
  VendorContract_Name: any;
  VendorLocalRateID: number;

openInNewTab(menuItem: any, rowItem: any) {
  let baseUrl = this._generalService.FormURL;
  if(menuItem.label.toLowerCase() === 'cdc local fixed rate') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/cdcLocalFixedDetails', ], { queryParams: {
      CustomerContractID: rowItem.customerContractID,
    } }));
    window.open(baseUrl + url, '_blank'); 
   
  } 
}

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public router:Router,
    public vendorContractLocalRateService: VendorContractLocalRateService,
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
      const encryptedVendorContractID = paramsData.VendorContractID;
      const encryptedStartDate = paramsData.StartDate;
      const encryptedEndDate = paramsData.EndDate;
      const encryptedVendorContractName = paramsData.VendorContractName;

      this.VendorContract_ID = this._generalService.decrypt(decodeURIComponent(encryptedVendorContractID));
      this.VendorContract_Name = this._generalService.decrypt(decodeURIComponent(encryptedVendorContractName));
      this.Applicable_From = this._generalService.decrypt(decodeURIComponent(encryptedStartDate));
      this.Applicable_To = this._generalService.decrypt(decodeURIComponent(encryptedEndDate));      
    });
    this.InitVehicleCategory();
    this.InitCityTier();
    this.InitPackage();
    this.menuItems.sort((a, b) => a.label.localeCompare(b.label));
    this.loadData();
    this.SubscribeUpdateService();
    this.loadDataForFixedDetails();
  }

  keyPressNumbersDecimal(event) 
  {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }


  public loadDataForFixedDetails() 
   {
    this.vendorContractLocalRateService.getTableDataForFixedRate(this.VendorContract_ID,this.SearchBillFromTo,this.SearchPackageJumpCriteria,this.SearchNextPackageCriteria, this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {
        this.advanceTableForFRD = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  AddFixedRate()
  {
    const dialogRef = this.dialog.open(VendorLocalFixedDetails, 
    {
      data: 
      {
        action: 'add',
        advanceTableForFRD: this.advanceTableForFRD,        
        VendorContractID:this.VendorContract_ID,
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.refresh();
    });
  }

  EditFixedRate(row) 
  {
    this.cdcLocalFixedDetailsID= row.cdcLocalFixedDetailsID;
    const dialogRef = this.dialog.open(VendorLocalFixedDetails, 
    {
      data: 
      {
        action: 'edit',
        advanceTable: row,        
        VendorContractID:this.VendorContract_ID,
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.refresh();
    });
  }


  InitVehicleCategory()
  {
    this.vendorContractLocalRateService.GetCarCategory(this.VendorContract_ID).subscribe(
      data=>{
        this.VehicleCategoryList=data;
        this.filteredCategoryOptions = this.vehicleCategory.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCategory(value || ''))
        ); 
      }
    )
  }

  private _filterCategory(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.VehicleCategoryList?.filter(
      data => 
      {
        return data.vendorContractCarCategory.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }


  InitPackage()
  {
    this._generalService.GetPackages().subscribe(
      data=>{
        this.PackageList=data;
        this.filteredPackageOptions = this.package.valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackage(value || ''))
        ); 
      }
    )
  }
  private _filterPackage(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.PackageList?.filter(
      data => 
      {
        return data.package.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }


  InitCityTier()
  {
    this.vendorContractLocalRateService.GetCityTiersForCV(this.VendorContract_ID).subscribe(
      data=>{
        this.CityTierList=data;
        this.filteredTierOptions = this.cityTier.valueChanges.pipe(
          startWith(""),
          map(value => this._filterTier(value || ''))
        ); 
      }
    )
  }
  private _filterTier(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CityTierList?.filter(
      data => 
      {
        return data.vendorContractCityTier.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  refresh() 
  {
    this.SearchActivationStatus = true;
    this.CDCLocalRateID=0;
    this.vehicleCategory.setValue('');
    this.cityTier.setValue('');
    this.package.setValue('');
    this.SearchBaseRate='';
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
    this.loadDataForFixedDetails();
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
          VendorContractID:this.VendorContract_ID,
          ApplicableFrom:this.Applicable_From,
          ApplicableTo:this.Applicable_To,
          VendorContractName:this.VendorContract_Name
        }
    });
  }


  editCall(row) 
  {
    this.cdcLocalRateID = row.cdcLocalRateID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        VendorContractID:this.VendorContract_ID,
        ApplicableFrom:this.Applicable_From,
        ApplicableTo:this.Applicable_To,
        VendorContractName:this.VendorContract_Name
      }
    });
  }

  duplicateCall(row) 
  {
    this.cdcLocalRateID = row.cdcLocalRateID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'duplicate',
        VendorContractID:this.VendorContract_ID,
        ApplicableFrom:this.Applicable_From,
        ApplicableTo:this.Applicable_To,
        VendorContractName:this.VendorContract_Name
      }
    });
  }

  deleteItem(row)
  {
    this.cdcLocalRateID = row.id;
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
      case 'vehicleCategory':
        this.vehicleCategory.setValue(this.searchTerm);
        break;
      case 'cityTier':
        this.cityTier.setValue(this.searchTerm);
        break;
      case 'package':
        this.package.setValue(this.searchTerm);
        break;
      case 'baseRate':
        this.SearchBaseRate = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.vendorContractLocalRateService.getTableData(
        this.VendorContract_ID,
        this.vehicleCategory.value,
        this.cityTier.value,
        this.package.value,
        this.SearchBaseRate,
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


  showNotification(colorName, text, placementFrom, placementAlign) 
  {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }


  onContextMenu(event: MouseEvent, item: VendorContractLocalRateModel) 
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
          if(this.MessageArray[0]=="VendorContractLocalRateCreate")
          {
            if(this.MessageArray[1]=="VendorContractLocalRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Vendor Local Rate Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractLocalRateUpdate")
          {
            if(this.MessageArray[1]=="VendorContractLocalRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vendor Local Rate Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractLocalRateDelete")
          {
            if(this.MessageArray[1]=="VendorContractLocalRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vendor Local Rate Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractLocalRateAll")
          {
            if(this.MessageArray[1]=="VendorContractLocalRateView")
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
    this.vendorContractLocalRateService.getTableDataSort(
      this.VendorContract_ID,
      this.SearchVehicleCategory,
      this.SearchCityTier,
      this.SearchPackage,
      this.SearchBaseRate,
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



  RateView()
  {
    const encryptedVendorContractID = encodeURIComponent(this._generalService.encrypt(this.VendorContract_ID.toString()));
    const url = this.router.serializeUrl(this.router.createUrlTree(
      ['/rateViewForVendorLocal'],
      {
        queryParams: {
                      vendorContractID: encryptedVendorContractID
                    }
      }
    ));
    window.open(this._generalService.FormURL + url, '_blank');
  }

}



