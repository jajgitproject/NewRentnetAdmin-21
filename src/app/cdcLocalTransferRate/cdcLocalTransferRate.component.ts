// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CDCLocalTransferRateService } from './cdcLocalTransferRate.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CDCLocalTransferRate } from './cdcLocalTransferRate.model';
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
import { CustomerContractCarCategoryDropDown } from '../customerContractCarCategory/customerContractCarCategoryDropDown.model';
@Component({
  standalone: false,
  selector: 'app-cdcLocalTransferRate',
  templateUrl: './cdcLocalTransferRate.component.html',
  styleUrls: ['./cdcLocalTransferRate.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CDCLocalTransferRateComponent implements OnInit {
  displayedColumns = [
    'customerContractCarCategory',
    'GeoPoint.GeoPointName',
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
  dataSource: CDCLocalTransferRate[] | null;
  cdcLocalTransferRateID: number;
  advanceTable: CDCLocalTransferRate | null;
  searchCDCLocalTransferRateID: number=0;
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
  
  cityTier : FormControl = new FormControl();
  SearchCityTier:string='';
  
  package: FormControl = new FormControl();
  SearchPackage:string='';
  
  baseRate : FormControl = new FormControl();
  SearchBaseRate:string='';
  
  public VehicleCategoryList?: CustomerContractCarCategoryDropDown[] = [];
  public PackageList?: PackageDropDown[] = [];
  public CityList?: CitiesDropDown[] = [];
  filteredCategoryOptions: Observable<CustomerContractCarCategoryDropDown[]>;
  searchCategoryBy: FormControl = new FormControl();

  filteredPackageOptions: Observable<PackageDropDown[]>;
  searchPackageBy: FormControl = new FormControl();

  filteredTierOptions: Observable<CitiesDropDown[]>;
  searchTierBy: FormControl = new FormControl();
  customerContractValidFrom: any;
  customerContractValidTo: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public cdcLocalTransferRateService: CDCLocalTransferRateService,
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
      // this.customerContractID   = paramsData.CustomerContractID;
      // this.customerContractName   = paramsData.CustomerContractName;
      // this.customerContractValidTo=paramsData.customerContractValidTo,
      //   this.customerContractValidFrom=paramsData.customerContractValidFrom,
       //this.supplierContract_Name=paramsData.supplierContractName
       this.supplierRateCard_Name=paramsData.supplierRateCardName;
       const encryptedCustomerContractID = paramsData.CustomerContractID;
  const encryptedCustomerContractName = paramsData.CustomerContractName;
  const encryptedStartDate = paramsData.StartDate;
  const encryptedEndDate = paramsData.EndDate;

  if (encryptedCustomerContractID && encryptedCustomerContractName) {
    this.customerContractID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractID));
    this.customerContractName = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractName));
    console.log("Decrypted CustomerContractID:", this.customerContractID);
    console.log("Decrypted CustomerContractName:", this.customerContractName);
  }

  if (encryptedStartDate && encryptedEndDate) {
    this.customerContractValidTo = this._generalService.decrypt(decodeURIComponent(encryptedStartDate));
    this.customerContractValidFrom = this._generalService.decrypt(decodeURIComponent(encryptedEndDate));
    console.log("Decrypted StartDate:", this.customerContractValidTo);
    console.log("Decrypted EndDate:", this.customerContractValidFrom);
  }

    });
    this.InitVehicleCategory();
    this.InitCities();
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

  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>{
        this.CityList=data;
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
    return this.CityList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
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
    this._generalService.GetCarCategory(this.customerContractID).subscribe(
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
        return customer.customerContractCarCategory.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  refresh() {
    this.SearchActivationStatus = true;
    this.searchCDCLocalTransferRateID=0;
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
          customerContractID: this.customerContractID,
          customerContractName :this.customerContractName,
          customerContractValidFrom:this.customerContractValidFrom,
          customerContractValidTo:this.customerContractValidTo,
        }
    });
  }
  editCall(row) {
    
    this.cdcLocalTransferRateID = row.cdcLocalTransferRateID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        customerContractID: this.customerContractID,
        customerContractName :this.customerContractName,
        customerContractValidFrom:this.customerContractValidFrom,
         customerContractValidTo:this.customerContractValidTo,

      }
    });

  }
  deleteItem(row)
  {

    this.cdcLocalTransferRateID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }

  duplicateCall(row) 
  {
    this.cdcLocalTransferRateID = row.cdcLocalRateID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'duplicate',
        CustomerContractID:this.customerContractID,
        ApplicableFrom:this.Applicable_From,
        ApplicableTo:this.Applicable_To,
        CustomerContractName:this.customerContractName
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
      case 'city':
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
      this.cdcLocalTransferRateService.getTableData(
        this.searchCDCLocalTransferRateID,
        this.customerContractID,
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
  onContextMenu(event: MouseEvent, item: CDCLocalTransferRate) {
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
          if(this.MessageArray[0]=="CDCLocalTransferRateCreate")
          {
            if(this.MessageArray[1]=="CDCLocalTransferRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'CDC Local Transfer Rate Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CDCLocalTransferRateUpdate")
          {
            if(this.MessageArray[1]=="CDCLocalTransferRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'CDC Local Transfer Rate Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CDCLocalTransferRateDelete")
          {
            if(this.MessageArray[1]=="CDCLocalTransferRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'CDC Local Transfer Rate Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CDCLocalTransferRateAll")
          {
            if(this.MessageArray[1]=="CDCLocalTransferRateView")
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
    this.cdcLocalTransferRateService.getTableDataSort(
      this.searchCDCLocalTransferRateID,
      this.customerContractID,
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
    const encryptedCustomerContractID = encodeURIComponent(this._generalService.encrypt(this.customerContractID.toString()));
    const url = this.router.serializeUrl(this.router.createUrlTree(
      ['/rateViewForLocalTransferContract'],
      {
        queryParams: {
                      customerContractID: encryptedCustomerContractID
                    }
      }
    ));
    window.open(this._generalService.FormURL + url, '_blank');
  }
}



