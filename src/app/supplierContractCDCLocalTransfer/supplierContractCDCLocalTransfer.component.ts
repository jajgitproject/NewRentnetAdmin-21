// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SupplierContractCDCLocalTransferService } from './supplierContractCDCLocalTransfer.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SupplierContractCDCLocalTransfer } from './supplierContractCDCLocalTransfer.model';
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
import { ActivatedRoute } from '@angular/router';
import { VehicleCategoryDropDown } from '../vehicleCategory/vehicleCategoryDropDown.model';
import { PackageDropDown } from '../package/packageDropDown.model';
import { CityTierDropDown } from '../cityTier/cityTierDropDown.model';
@Component({
  standalone: false,
  selector: 'app-supplierContractCDCLocalTransfer',
  templateUrl: './supplierContractCDCLocalTransfer.component.html',
  styleUrls: ['./supplierContractCDCLocalTransfer.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SupplierContractCDCLocalTransferComponent implements OnInit {
  displayedColumns = [
    'vehicleCategory',
    'cityTierName',
    'package',
    'baseRate',
    'status',
    'actions'
  ];
  dataSource: SupplierContractCDCLocalTransfer[] | null;
  supplierContractCDCLocalTransferID: number;
  advanceTable: SupplierContractCDCLocalTransfer | null;
  searchSupplierContractCDCLocalTransferID: number=0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  supplierRateCard_Name: any;
  Applicable_To: any;
  Applicable_From: any;
  supplierContract_ID: any;
  supplierContract_Name: any;

  vehicleCategory : FormControl = new FormControl();
  SearchVehicleCategory:string='';
  
  cityTier : FormControl = new FormControl();
  SearchCityTier:string='';
  
  package: FormControl = new FormControl();
  SearchPackage:string='';
  
  baseRate : FormControl = new FormControl();
  SearchBaseRate:string='';
  selectedFilter: string = 'search';
  searchTerm: any = '';
  filterSelected:boolean = true;
  
  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  public PackageList?: PackageDropDown[] = [];
  public CityTierList?: CityTierDropDown[] = [];
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  filteredCityTierOptions: Observable<CityTierDropDown[]>;
  filteredPackageOptions: Observable<PackageDropDown[]>;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public supplierContractCDCLocalTransferService: SupplierContractCDCLocalTransferService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
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
      // this.supplierContract_ID   = paramsData.SupplierContractID;
      //  this.Applicable_From   = paramsData.ApplicableFrom;
      //  this.Applicable_To   = paramsData.ApplicableTo;
      //  this.supplierContract_Name=paramsData.supplierContractName
      //  this.supplierRateCard_Name=paramsData.supplierRateCardName;
      const encryptedSupplierContractID = this.route.snapshot.queryParamMap.get('SupplierContractID');
      const encryptedApplicableFrom = this.route.snapshot.queryParamMap.get('ApplicableFrom');
      const encryptedApplicableTo = this.route.snapshot.queryParamMap.get('ApplicableTo');
      const encryptedSupplierRateCardName = this.route.snapshot.queryParamMap.get('supplierRateCardName');
      const encryptedSupplierContractName = this.route.snapshot.queryParamMap.get('supplierContractName');
      // Check if the parameters exist
      if (encryptedSupplierContractID && encryptedApplicableFrom && encryptedApplicableTo && encryptedSupplierRateCardName && encryptedSupplierContractName) {
        // Decrypt and decode the parameters
        this.supplierContract_ID = this._generalService.decrypt(decodeURIComponent(encryptedSupplierContractID));
        this.Applicable_From= this._generalService.decrypt(decodeURIComponent(encryptedApplicableFrom));
        this.Applicable_To= this._generalService.decrypt(decodeURIComponent(encryptedApplicableTo));
        this.supplierRateCard_Name= this._generalService.decrypt(decodeURIComponent(encryptedSupplierRateCardName));
        this.supplierContract_Name= this._generalService.decrypt(decodeURIComponent(encryptedSupplierContractName));
        this.supplierRateCard_Name = decodeURIComponent(this.supplierRateCard_Name);
        this.Applicable_To = decodeURIComponent( this.Applicable_To);
        this.Applicable_From= decodeURIComponent( this.Applicable_From);
      }
    });
    this.InitVehicleCategory();
    this.InitCityTier();
    this.InitPackage();
    this.loadData();
    this.SubscribeUpdateService();
  }

  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
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

  InitVehicleCategory(){
    this._generalService.GetVehicleCategories().subscribe(
      data=>
      {
        this.VehicleCategoryList=data;
        this.filteredVehicleCategoryOptions = this.vehicleCategory.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.VehicleCategoryList.filter(
      customer => 
      {
        return customer.vehicleCategory.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  InitCityTier(){
    this._generalService.GetCityTiers().subscribe(
      data=>
      {
        this.CityTierList=data;
        this.filteredCityTierOptions = this.cityTier.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCityTier(value || ''))
        ); 
      });
  }
  
  private _filterCityTier(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.CityTierList.filter(
      customer => 
      {
        return customer.cityTierName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  InitPackage(){
    this._generalService.GetPackages().subscribe(
      data=>
      {
        this.PackageList=data;
        this.filteredPackageOptions = this.package.valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackage(value || ''))
        ); 
      });
  }
  
  private _filterPackage(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.PackageList.filter(
      customer => 
      {
        return customer.package.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  refresh() {
    this.SearchActivationStatus = true;
    this.searchSupplierContractCDCLocalTransferID=0;
    this.vehicleCategory.setValue('');
    this.cityTier.setValue('');
    this.package.setValue('');
    this.SearchBaseRate='';
    this.searchTerm='';
    this.selectedFilter ='search';
    this.PageNumber=0;
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
          SupplierContractID:this.supplierContract_ID,
          ApplicableFrom:this.Applicable_From,
          ApplicableTo:this.Applicable_To,
          SupplierContractName:this.supplierContract_Name,
          SupplierRateCardName:this.supplierRateCard_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.supplierContractCDCLocalTransferID = row.supplierContractCDCLocalTransferID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        SupplierContractID:this.supplierContract_ID,
          ApplicableFrom:this.Applicable_From,
          ApplicableTo:this.Applicable_To,
          SupplierContractName:this.supplierContract_Name,
          SupplierRateCardName:this.supplierRateCard_Name
      }
    });

  }
  deleteItem(row)
  {

    this.supplierContractCDCLocalTransferID = row.id;
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
   public loadData() 
   {
    
      switch (this.selectedFilter)
      {
        case 'vehicleCategory':
          this.vehicleCategory.setValue(this.searchTerm) ;
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
  
      this.supplierContractCDCLocalTransferService.getTableData(
        this.searchSupplierContractCDCLocalTransferID,
        this.supplierContract_ID,
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
  onContextMenu(event: MouseEvent, item: SupplierContractCDCLocalTransfer) {
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
          if(this.MessageArray[0]=="SupplierContractCDCLocalTransferCreate")
          {
            if(this.MessageArray[1]=="SupplierContractCDCLocalTransferView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Supplier Contract CDC Local Transfer Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractCDCLocalTransferUpdate")
          {
            if(this.MessageArray[1]=="SupplierContractCDCLocalTransferView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Contract CDC Local Transfer Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractCDCLocalTransferDelete")
          {
            if(this.MessageArray[1]=="SupplierContractCDCLocalTransferView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Contract Local Transfer Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractCDCLocalTransferAll")
          {
            if(this.MessageArray[1]=="SupplierContractCDCLocalTransferView")
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
    this.supplierContractCDCLocalTransferService.getTableDataSort(
      this.searchSupplierContractCDCLocalTransferID,
      this.supplierContract_ID,
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


  openSearchDialog() {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any) {
    SearchData();
    dialogRef.close();
  }

}



