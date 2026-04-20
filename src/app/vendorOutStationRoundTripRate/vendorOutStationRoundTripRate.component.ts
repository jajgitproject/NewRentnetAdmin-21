// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VendorOutStationRoundTripRateService } from './vendorOutStationRoundTripRate.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VendorOutStationRoundTripRate } from './vendorOutStationRoundTripRate.model';
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
import { PackageDropDown } from '../package/packageDropDown.model';
import { CustomerContractCarCategoryDropDown } from '../customerContractCarCategory/customerContractCarCategoryDropDown.model';
import { CustomerContractCityTiersDropDown } from '../customerContractCDCLocalRate/customerContractCityTiersDropDown.model';
import { VendorContractCarCategoryDropDown } from './vendorContractCarCategoryDropDown.model';
import { VendorContractCityTiersDropDown } from './vendorContractCityTiersDropDown.model';

@Component({
  standalone: false,
  selector: 'app-vendorOutStationRoundTripRate',
  templateUrl: './vendorOutStationRoundTripRate.component.html',
  styleUrls: ['./vendorOutStationRoundTripRate.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VendorOutStationRoundTripRateComponent implements OnInit {
  displayedColumns = [
    'VendorContractCarCategory',
    'VendorContractCityTier',
    'package',
    'minimumKmsPerDay',
    'extraKmsRate',
    'NightCharge',
    'DriverAllowance',
    'BillFromTo',
    'status',
    'actions'
  ];
  dataSource: VendorOutStationRoundTripRate[] | null;
  vendorOutStationRoundTripRateID: number;
  VendorOutStationRoundTripRateID: number=0;
  advanceTable: VendorOutStationRoundTripRate | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  supplierRateCard_Name: any;
  Applicable_To: any;
  Applicable_From: any;
  vendorContract_ID: any;
  vendorContract_Name: any;

  vehicleCategory : FormControl = new FormControl();
  SearchVehicleCategory:string='';
  
  cityTier : FormControl = new FormControl();
  SearchCityTier:string='';
  
  package: FormControl = new FormControl();
  SearchPackage:string='';
  
  baseRate : FormControl = new FormControl();
  SearchBaseRate:string='';
  
  public VehicleCategoryList?: VendorContractCarCategoryDropDown[] = [];
  public PackageList?: PackageDropDown[] = [];
  public CityTierList?: VendorContractCityTiersDropDown[] = [];
  filteredCategoryOptions: Observable<VendorContractCarCategoryDropDown[]>;
  searchCategoryBy: FormControl = new FormControl();

  filteredTierOptions: Observable<CustomerContractCityTiersDropDown[]>;
  searchTierBy: FormControl = new FormControl();

  filteredPackageOptions: Observable<CustomerContractCityTiersDropDown[]>;
  searchPackageBy: FormControl = new FormControl();

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public vendorOutStationRoundTripRateService: VendorOutStationRoundTripRateService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public router:Router
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      // this.customerContract_ID   = paramsData.CustomerContractID;
      //  this.Applicable_From   = paramsData.StartDate;
      //  this.Applicable_To   = paramsData.EndDate;
      //  this.customerContract_Name=paramsData.CustomerContractName;
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
       }
    });
    this.InitVehicleCategory();
    this.InitCityTier();
    this.InitPackage();
    this.loadData();
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

  // InitVehicleCategory(){
  //   this._generalService.GetCarCategories().subscribe(
  //     data=>{
  //       this.VehicleCategoryList=data;
  //     }
  //   )
  // }

  // InitPackage(){
  //   this._generalService.GetPackages().subscribe(
  //     data=>{
  //       this.PackageList=data;
  //     }
  //   )
  // }

  // InitCityTier(){
  //   this._generalService.GetCCCityTiers().subscribe(
  //     data=>{
  //       this.CityTierList=data;
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
    if (!this.vendorContract_ID) {
      console.warn('vendorContract_ID is not set');
      this.VehicleCategoryList = [];
      return;
    }
    this._generalService.getVendorCarCategory(this.vendorContract_ID).subscribe(
      data=>{
        this.VehicleCategoryList=data || [];
        this.filteredCategoryOptions =this.vehicleCategory.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCategory(value || ''))
        ); 

      },
      (error: HttpErrorResponse) => {
        console.error('Error loading vehicle categories:', error);
        this.VehicleCategoryList = [];
      }
    )
  }
  private _filterCategory(value: string): any {
    if (!this.VehicleCategoryList || this.VehicleCategoryList.length === 0) {
      return [];
    }
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.VehicleCategoryList.filter(
      customer => 
      {
        return customer.vendorContractCarCategory.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  refresh() {
    this.SearchActivationStatus = true;
    this.VendorOutStationRoundTripRateID=0;
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
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          vendorContractID:this.vendorContract_ID,
          ApplicableFrom:this.Applicable_From,
          ApplicableTo:this.Applicable_To,
          VendorContractName:this.vendorContract_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.vendorOutStationRoundTripRateID = row.vendorOutStationRoundTripRateID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        vendorContractID:this.vendorContract_ID,
        ApplicableFrom:this.Applicable_From,
        ApplicableTo:this.Applicable_To,
        VendorContractName:this.vendorContract_Name
      }
    });

  }
  deleteItem(row)
  {

    this.vendorOutStationRoundTripRateID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }

  duplicateCall(row) 
  {
    this.vendorOutStationRoundTripRateID = row.vendorOutStationRoundTripRateID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'duplicate',
        vendorContractID:this.vendorContract_ID,
        ApplicableFrom:this.Applicable_From,
        ApplicableTo:this.Applicable_To,
        VendorContractName:this.vendorContract_Name
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
      this.vendorOutStationRoundTripRateService.getTableData(
        this.VendorOutStationRoundTripRateID,
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
  onContextMenu(event: MouseEvent, item: VendorOutStationRoundTripRate) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  
  NextCall()
  {
    //console.log(this.dataSource.length>0)
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
          if(this.MessageArray[0]=="VendorOutStationRoundTripRateCreate")
          {
            if(this.MessageArray[1]=="VendorOutStationRoundTripRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Vendor Contract OutStation Round Trip Rate  Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorOutStationRoundTripRateUpdate")
          {
            if(this.MessageArray[1]=="VendorOutStationRoundTripRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vendor Contract OutStation Round Trip Rate Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorOutStationRoundTripRateDelete")
          {
            if(this.MessageArray[1]=="VendorOutStationRoundTripRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vendor Contract OutStation Round Trip Rate  Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorOutStationRoundTripRateAll")
          {
            if(this.MessageArray[1]=="VendorOutStationRoundTripRateView")
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
    this.vendorOutStationRoundTripRateService.getTableDataSort(
      this.VendorOutStationRoundTripRateID,
      this.vendorContract_ID,
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
      ['/rateViewForOutstationRoundTripVendorContract'],
      {
        queryParams: {
                      vendorContractID: encryptedVendorContractID
                    }
      }
    ));
    window.open(this._generalService.FormURL + url, '_blank');
  }
}



