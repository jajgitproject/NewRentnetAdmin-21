// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';

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
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
//import { VendorContractCarCategoryDropDown } from './vendorContractCarCategoryDropDown.model';

import { VendorContractCarCategoryDropDown } from '../vendorOutStationRoundTripRate/vendorContractCarCategoryDropDown.model';
import { VendorLocalLumpsumRateService } from './vendorLocalLumpsumRate.service';
import { VendorLocalLumpsumRate } from './vendorLocalLumpsumRate.model';
import { VendorContractCityTiersDropDown } from '../vendorOutStationRoundTripRate/vendorContractCityTiersDropDown.model';
import { CustomerContractCityTiersDropDown } from '../customerContractCDCLocalRate/customerContractCityTiersDropDown.model';

@Component({
  standalone: false,
  selector: 'app-vendorLocalLumpsumRate',
  templateUrl: './vendorLocalLumpsumRate.component.html',
  styleUrls: ['./vendorLocalLumpsumRate.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VendorLocalLumpsumRateComponent implements OnInit {
  displayedColumns = [
    'vendorContractCarCategory',
   'vendorContractCityTier',
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
  dataSource:VendorLocalLumpsumRate[] | null;
   vendorLocalLumpsumRateID: number;
  advanceTable: VendorLocalLumpsumRate | null;
  searchVendorLocalLumpsumRateID: number=0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  supplierRateCard_Name: any;
  Applicable_To: any;
  Applicable_From: any;
  customerContractID: any;
  customerContractName: any;

  vehicleCategory : FormControl = new FormControl();
  SearchVehicleCategory:string='';
  
  vendorContractCityTier : FormControl = new FormControl();
  SearchCityTier:string='';
  
  package: FormControl = new FormControl();
  SearchPackage:string='';
  
  baseRate : FormControl = new FormControl();
  SearchBaseRate:string='';
  
  public VehicleCategoryList?: VendorContractCarCategoryDropDown[] = [];
  public PackageList?: PackageDropDown[] = [];
  public CityList?: CitiesDropDown[] = [];
  filteredCategoryOptions: Observable<VendorContractCarCategoryDropDown[]>;
  searchCategoryBy: FormControl = new FormControl();

  filteredPackageOptions: Observable<PackageDropDown[]>;
  searchPackageBy: FormControl = new FormControl();
  cityTier : FormControl = new FormControl();
 // filteredTierOptions: Observable<CitiesDropDown[]>;
  public CityTierList?: VendorContractCityTiersDropDown[] = [];
    filteredTierOptions: Observable<CustomerContractCityTiersDropDown[]>;
  searchTierBy: FormControl = new FormControl();
  customerContractValidFrom: any;
  customerContractValidTo: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  vendorContractID: number;
  vendorContract_Name: any;
    vendorContract_ID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public  vendorLocalLumpsumRateService:VendorLocalLumpsumRateService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public router:Router
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  @ViewChild('searchDialog') searchDialog: TemplateRef<any>;
@ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      // this.customerContractID   = paramsData.CustomerContractID;
      // this.customerContractName   = paramsData.CustomerContractName;
      // this.customerContractValidTo=paramsData.customerContractValidTo,
      //   this.customerContractValidFrom=paramsData.customerContractValidFrom,
       //this.supplierContract_Name=paramsData.supplierContractName
       const encryptedVendorContractID = paramsData.VendorContractID;
       const encryptedStartDate = paramsData.StartDate;
       const encryptedEndDate = paramsData.EndDate;
       const encryptedVendorContractName = paramsData.VendorContractName;
     
       // Decrypt the parameters if they exist
       if (encryptedVendorContractID && encryptedStartDate && encryptedEndDate && encryptedVendorContractName) {
         this.vendorContract_ID = this._generalService.decrypt(decodeURIComponent(encryptedVendorContractID));
         this.Applicable_From = this._generalService.decrypt(decodeURIComponent(encryptedStartDate));
         this.Applicable_To = this._generalService.decrypt(decodeURIComponent(encryptedEndDate));
         this.vendorContract_Name = this._generalService.decrypt(decodeURIComponent(encryptedVendorContractName));
     
         // Log the decrypted values to the console for verification
         console.log("Decrypted VendorContractID:", this.vendorContract_ID);
         console.log("Decrypted StartDate:", this.Applicable_From);
         console.log("Decrypted EndDate:", this.Applicable_To);
         console.log("Decrypted VendorContractName:", this.vendorContract_Name);
         
         // Initialize dropdowns and load data after vendorContract_ID is set
         this.InitVehicleCategory();
         this.InitCityTier();
         this.InitPackage();
         this.loadData();
       } else {
         console.error("Missing query parameters in URL");
       }

    });
    this.SubscribeUpdateService();
  }

  keyPressNumbersDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // InitPackage(){
  //   this._generalService.GetPackages().subscribe(
  //     data=>{
  //       this.PackageList=data;
  //     }
  //   )
  // }

  // InitCities(){
  //   this._generalService.GetCitiessAll().subscribe(
  //     data=>
  //     {
  //       this.CityList=data;
  //     });
  // }

  // InitVehicleCategory(){
  //   this._generalService.getVehicleCategories().subscribe(
  //     data=>{
  //       this.VehicleCategoryList=data;
  //     }
  //   )
  // }

  
  InitCityTier(){
    if (!this.vendorContract_ID) {
      console.warn('vendorContract_ID is not set');
      this.CityTierList = [];
      return;
    }
    this._generalService.GetVendorCityTiersForCD(this.vendorContract_ID).subscribe(
      data=>{
        this.CityTierList=data || [];
        this.filteredTierOptions = this.cityTier.valueChanges.pipe(
          startWith(""),
          map(value => this._filterTier(value || ''))
        ); 
      },
      (error: HttpErrorResponse) => {
        console.error('Error loading city tiers:', error);
        this.CityTierList = [];
      }
    )
  }
  private _filterTier(value: string): any {
    if (!this.CityTierList || this.CityTierList.length === 0) {
      return [];
    }
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CityTierList.filter(
      customer => 
      {
        return customer.vendorContractCityTier.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }


InitPackage(){
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
    return this.PackageList.filter(
      customer => 
      {
        return customer.package.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

InitVehicleCategory(){
    this._generalService.getVendorCarCategory(this.vendorContract_ID).subscribe(
      data=>{
        this.VehicleCategoryList=data;
        this.filteredCategoryOptions =this.vehicleCategory.valueChanges.pipe(
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
      customer => 
      {
        return customer.vendorContractCarCategory.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  refresh() {
    this.SearchActivationStatus = true;
    this.searchVendorLocalLumpsumRateID=0;
    this.vehicleCategory.setValue('');
    this.cityTier.setValue('');
    this.package.setValue('');
    this.SearchBaseRate='';
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  public SearchData()
  {
    this.loadData();    
  }
  addNew() {
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: this.advanceTable,
      action: 'add',
      vendorContractID: this.vendorContract_ID,
      applicableFrom: this.Applicable_From,
      applicableTo: this.Applicable_To,
      vendorContract_Name: this.vendorContract_Name
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'success') {
      this.refresh();   // or this.loadData();
    }
  });
}

 editCall(row) {
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit',
      vendorContractID: this.vendorContract_ID,
      applicableFrom: this.Applicable_From,
      applicableTo: this.Applicable_To,
      vendorContract_Name: this.vendorContract_Name
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'success') {
      this.refresh();
    }
  });
}

  deleteItem(row)
{
  this.vendorLocalLumpsumRateID = row.vendorLocalLumpsumRateID;

  this.dialog.open(DeleteDialogComponent, {
    data: row
  });
}


  duplicateCall(row) {
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'duplicate',
      vendorContractID: this.vendorContract_ID,
      vendorLocalLumpsumRateID: row.vendorLocalLumpsumRateID,
      applicableFrom: this.Applicable_From,
      applicableTo: this.Applicable_To,
      vendorContract_Name: this.vendorContract_Name
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'success') {
      this.refresh();
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
      this. vendorLocalLumpsumRateService.getTableData(
        this.searchVendorLocalLumpsumRateID,
        this.vendorContract_ID,
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
 
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item:  VendorLocalLumpsumRate) {
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
          if(this.MessageArray[0]=="VendorLocalLumpsumRateCreate")
          {
            if(this.MessageArray[1]=="VendorLocalLumpsumRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Vendor Contract Local Lumpsum Rate Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorLocalLumpsumRateUpdate")
          {
            if(this.MessageArray[1]=="VendorLocalLumpsumRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vendor Contract Local Lumpsum Rate Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
         else if(this.MessageArray[0]=="VendorLocalLumpsumRateDelete")
{
  if(this.MessageArray[1]=="VendorLocalLumpsumRateView")
  {
    if(this.MessageArray[2]=="Success")
    {
      this.refresh();
      this.showNotification(
        'snackbar-success',
        'Vendor Contract Local Lumpsum Rate Deleted ...!!!',
        'bottom',
        'center'
      );
    }
  }
}

          else if(this.MessageArray[0]==" VendorLocalLumpsumRateAll")
          {
            if(this.MessageArray[1]==" VendorLocalLumpsumRateView")
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
    this.vendorLocalLumpsumRateService.getTableDataSort(
      this.searchVendorLocalLumpsumRateID,
      this.vendorContractID,
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
    const encryptedVendorContractID = encodeURIComponent(this._generalService.encrypt(this.vendorContract_ID.toString()));
    const url = this.router.serializeUrl(this.router.createUrlTree(
      ['/rateViewForVendorLocalLumpsumRate'],
      {
        queryParams: {
                      vendorContractID: encryptedVendorContractID
                    }
      }
    ));
    window.open(this._generalService.FormURL + url, '_blank');
  }

  


  openSearchDialog() {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any) {
    SearchData();
    dialogRef.close();
  }

}






