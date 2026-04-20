// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CDCLocalLumpsumRateService } from './cdcLocalLumpsumRate.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CDCLocalLumpsumRate } from './cdcLocalLumpsumRate.model';
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
import { CustomerContractCarCategoryDropDown } from '../customerContractCDCLocalRate/customerContractCarCategoryDropDown.model';
import { CustomerContractCityTiersDropDown } from '../customerContractCDCLocalRate/customerContractCityTiersDropDown.model';

@Component({
  standalone: false,
  selector: 'app-cdcLocalLumpsumRate',
  templateUrl: './cdcLocalLumpsumRate.component.html',
  styleUrls: ['./cdcLocalLumpsumRate.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CDCLocalLumpsumRateComponent implements OnInit {
  displayedColumns = [
    'CustomerContractCarCategory',
    'CustomerContractCityTier',
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
  dataSource: CDCLocalLumpsumRate[] | null;
  cdcLocalLumpsumRateID: number;
  CDCLocalLumpsumRateID: number=0;
  advanceTable: CDCLocalLumpsumRate | null;
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
  
  public VehicleCategoryList?: CustomerContractCarCategoryDropDown[] = [];
  filteredCategoryOptions: Observable<CustomerContractCarCategoryDropDown[]>;
  searchCategoryBy: FormControl = new FormControl();

  public PackageList?: PackageDropDown[] = [];
  filteredTierOptions: Observable<CustomerContractCityTiersDropDown[]>;
  searchTierBy: FormControl = new FormControl();

  public CityTierList?: CustomerContractCityTiersDropDown[] = [];
  filteredPackageOptions: Observable<CustomerContractCityTiersDropDown[]>;
  searchPackageBy: FormControl = new FormControl();

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public cdcLocalLumpsumRateService: CDCLocalLumpsumRateService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public router:Router,
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
      //this.customerContract_ID   = paramsData.CustomerContractID;
       //this.Applicable_From   = paramsData.StartDate;
       //this.Applicable_To   = paramsData.EndDate;
       //this.customerContract_Name=paramsData.CustomerContractName;
       const encryptedCustomerContractID = paramsData.CustomerContractID;
       const encryptedStartDate = paramsData.StartDate;
       const encryptedEndDate = paramsData.EndDate;
       const encryptedCustomerContractName = paramsData.CustomerContractName;
     
       // Decrypt the parameters if they exist
       if (encryptedCustomerContractID && encryptedStartDate && encryptedEndDate && encryptedCustomerContractName) {
         this.customerContract_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractID));
         this.Applicable_From = this._generalService.decrypt(decodeURIComponent(encryptedStartDate));
         this.Applicable_To = this._generalService.decrypt(decodeURIComponent(encryptedEndDate));
         this.customerContract_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractName));
     
         // Log the decrypted values to the console for verification
         console.log("Decrypted CustomerContractID:", this.customerContract_ID);
         console.log("Decrypted StartDate:", this.Applicable_From);
         console.log("Decrypted EndDate:", this.Applicable_To);
         console.log("Decrypted CustomerContractName:", this.customerContract_Name);
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

  InitVehicleCategory(){
    this._generalService.GetCarCategory(this.customerContract_ID).subscribe(
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
    return this.VehicleCategoryList.filter(
      customer => 
      {
        return customer.customerContractCarCategory.toLowerCase().indexOf(filterValue)===0;
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

  InitCityTier(){
    this._generalService.GetCCCityTiersForCD(this.customerContract_ID).subscribe(
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
    return this.CityTierList.filter(
      customer => 
      {
        return customer.customerContractCityTier.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  refresh() {
    this.SearchActivationStatus = true;
    this.CDCLocalLumpsumRateID=0;
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
          CustomerContractID:this.customerContract_ID,
          ApplicableFrom:this.Applicable_From,
          ApplicableTo:this.Applicable_To,
          CustomerContractName:this.customerContract_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.cdcLocalLumpsumRateID = row.cdcLocalRateID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerContractID:this.customerContract_ID,
        ApplicableFrom:this.Applicable_From,
        ApplicableTo:this.Applicable_To,
        CustomerContractName:this.customerContract_Name
      }
    });

  }
  deleteItem(row)
  {

    this.cdcLocalLumpsumRateID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }

  duplicateCall(row) 
  {
    this.cdcLocalLumpsumRateID = row.cdcLocalRateID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'duplicate',
        CustomerContractID:this.customerContract_ID,
        ApplicableFrom:this.Applicable_From,
        ApplicableTo:this.Applicable_To,
        CustomerContractName:this.customerContract_Name
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
      this.cdcLocalLumpsumRateService.getTableData(
        this.CDCLocalLumpsumRateID,
        this.customerContract_ID,
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
  onContextMenu(event: MouseEvent, item: CDCLocalLumpsumRate) {
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
          if(this.MessageArray[0]=="CDCLocalLumpsumRateCreate")
          {
            if(this.MessageArray[1]=="CDCLocalLumpsumRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'CDC Local Lumpsum Rate Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CDCLocalLumpsumRateUpdate")
          {
            if(this.MessageArray[1]=="CDCLocalLumpsumRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'CDC Local Lumpsum Rate Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CDCLocalLumpsumRateDelete")
          {
            if(this.MessageArray[1]=="CDCLocalLumpsumRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'CDC Local Lumpsum Rate Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CDCLocalLumpsumRateAll")
          {
            if(this.MessageArray[1]=="CDCLocalLumpsumRateView")
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
    this.cdcLocalLumpsumRateService.getTableDataSort(
      this.CDCLocalLumpsumRateID,
      this.customerContract_ID,
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
    const encryptedCustomerContractID = encodeURIComponent(this._generalService.encrypt(this.customerContract_ID.toString()));
    const url = this.router.serializeUrl(this.router.createUrlTree(
      ['/rateViewForLocalLumpsumContract'],
      {
        queryParams: {
                      customerContractID: encryptedCustomerContractID
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



