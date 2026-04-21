// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SupplierContractCustomerCityPercentageService } from './supplierContractCustomerCityPercentage.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SupplierContractCustomerCityPercentage } from './supplierContractCustomerCityPercentage.model';
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
import { Form, FormControl } from '@angular/forms';
import moment from 'moment';
import { CustomerDropDown } from '../supplierCustomerFixedForAllPercentage/customerDropDown.model';
import { ActivatedRoute } from '@angular/router';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
@Component({
  standalone: false,
  selector: 'app-supplierContractCustomerCityPercentage',
  templateUrl: './supplierContractCustomerCityPercentage.component.html',
  styleUrls: ['./supplierContractCustomerCityPercentage.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SupplierContractCustomerCityPercentageComponent implements OnInit {
  displayedColumns = [
    'customerName',
    'Geopoint.GeoPointName',
    'fromDate',
    'toDate',
    'supplierPercentage',
    'status',
    'actions'
  ];
  dataSource: SupplierContractCustomerCityPercentage[] | null;
  supplierCustomerFixedPercentageForAllID: number;
  advanceTable: SupplierContractCustomerCityPercentage | null;
  supplierContractCustomerCityPercentageID: number = 0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;

  SearchFromDate:string = '';
  SearchToDate:string='';
  searchsupplierPercentage:string='';
  SearchCustomer:string='';
  SearchCity:string='';
  SearchapplicableTo:string='';
  SearchapplicableFrom:string='';

  fromDate : FormControl = new FormControl();
  toDate : FormControl = new FormControl();
  customer:FormControl= new FormControl();
  city:FormControl=new FormControl();

  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  public CityList?: CitiesDropDown[] = [];
  public CustomerList?: CustomerDropDown[] = [];
 
  filteredCityOptions: Observable<CitiesDropDown[]>;
  searchCustomer:FormControl = new FormControl();
  filteredCustomerOptions: Observable<CustomerDropDown[]>;

  supplierContract_ID: any;
  supplier_Name: any;
  Applicable_From: any;
  Applicable_To: any;
  supplierContractName: any;
  selectedFilter: string = 'search';
  searchTerm: any = '';
  filterSelected:boolean = true;
  noRecordsFound: boolean;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public supplierContractCustomerCityPercentageService: SupplierContractCustomerCityPercentageService,
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
      const encryptedSupplierContractID = this.route.snapshot.queryParamMap.get('SupplierContractID');
      const encryptedApplicableFrom = this.route.snapshot.queryParamMap.get('ApplicableFrom');
      const encryptedApplicableTo = this.route.snapshot.queryParamMap.get('ApplicableTo');
      const encryptedSupplierName = this.route.snapshot.queryParamMap.get('supplierName');
      const encryptedSupplierContractName = this.route.snapshot.queryParamMap.get('supplierContractName');
  
      // Check if the parameters exist
      if (encryptedSupplierContractID && encryptedApplicableFrom && encryptedSupplierName && encryptedSupplierContractName) {
        // Decrypt and decode the parameters
        this.supplierContract_ID = this._generalService.decrypt(decodeURIComponent(encryptedSupplierContractID));
        this.Applicable_From = this._generalService.decrypt(decodeURIComponent(encryptedApplicableFrom));
        this.Applicable_To = this._generalService.decrypt(decodeURIComponent(encryptedApplicableTo));
        this.supplier_Name = this._generalService.decrypt(decodeURIComponent(encryptedSupplierName));
        this.supplier_Name = decodeURIComponent(this.supplier_Name);
        this.Applicable_To = decodeURIComponent( this.Applicable_To);
        this.Applicable_From= decodeURIComponent( this.Applicable_From);
        // Decrypt other parameters
        // this.supplier_Name = this._generalService.decrypt(decodeURIComponent(encryptedSupplierName));
        this.supplierContractName = this._generalService.decrypt(decodeURIComponent(encryptedSupplierContractName));
  
        // Log the decrypted values
      }
    }
    );
    this.InitCustomer();
    this.InitCities();
    this.loadData();
    this.SubscribeUpdateService();
  }

  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }
  refresh() {
    //this.SearchSupplierCustomerPercentageForAllID = '';
    this.SearchActivationStatus = true;
    this.supplierContractCustomerCityPercentageID=0,
    this.customer.setValue('');
    this.city.setValue('');
    this.SearchFromDate='';
    this.SearchToDate='';
    this.searchsupplierPercentage='';
    this.searchTerm='';
    this.selectedFilter ='search';
    this.PageNumber=0;
    this.loadData();
  }

  public SearchData()
  {
    this.loadData();    
  }

  InitCustomer() {
    this._generalService.GetCustomers().subscribe(
      data => {
        ;
        this.CustomerList = data;
        this.filteredCustomerOptions = this.customer.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomer(value || ''))
        );
      },
      error => {

      }
    );
  }
 private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.CustomerList.filter(
      customer => 
      {
        return customer.customerName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  InitCities() {
    this._generalService.GetCitiessAll().subscribe(
      data => {
        ;
        this.CityList = data;
        this.filteredCityOptions = this.city.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        );
      },
      error => {

      }
    );
  }
 private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.CityList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
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
          SupplierName:this.supplier_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.supplierCustomerFixedPercentageForAllID = row.supplierCustomerFixedPercentageForAllID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        SupplierContractID:this.supplierContract_ID,
          ApplicableFrom:this.Applicable_From,
          ApplicableTo:this.Applicable_To,
          SupplierName:this.supplier_Name
      }
    });

  }
  deleteItem(row)
  {

    this.supplierCustomerFixedPercentageForAllID = row.id;
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
  public loadData() {
    // Format the dates if they are not empty
    let formattedFromDate = this.SearchFromDate ? moment(this.SearchFromDate).format('MMM DD yyyy') : '';
    let formattedToDate = this.SearchToDate ? moment(this.SearchToDate).format('MMM DD yyyy') : '';

    // Set the appropriate values based on the selected filter
    switch (this.selectedFilter) {
        case 'customer':
            this.customer.setValue(this.searchTerm);
            break;
        case 'city':
            this.city.setValue(this.searchTerm);
            break;
        case 'applicableFrom':
            formattedFromDate = this.searchTerm;
            break;
        case 'applicableTo':
            formattedToDate = this.searchTerm;
            break;
        case 'supplierPercentage':
            this.searchsupplierPercentage = this.searchTerm;
            break;
        default:
            this.searchTerm = '';
            break;
    }

    // Call the service to fetch the filtered data
    this.supplierContractCustomerCityPercentageService.getTableData(
        this.supplierContractCustomerCityPercentageID,
        this.supplierContract_ID,
        this.customer.value,
        this.city.value,
        formattedFromDate,
        formattedToDate,
        this.searchsupplierPercentage,
        this.SearchActivationStatus,
        this.PageNumber
    ).subscribe(
        data => {
            if (data && data.length > 0) {
                this.dataSource = data;
                this.noRecordsFound = false;
            } else {
                this.dataSource = null;
                this.noRecordsFound = true; // Flag to indicate no records found
            }
        },
        (error: HttpErrorResponse) => {
            this.dataSource = null;
            this.noRecordsFound = true; // Handle error by showing no records found
        }
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
  onContextMenu(event: MouseEvent, item: SupplierContractCustomerCityPercentage) {
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
          if(this.MessageArray[0]=="SupplierContractCustomerCityPercentageCreate")
          {
            if(this.MessageArray[1]=="SupplierContractCustomerCityPercentageView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Supplier Contract Customer City Percentage Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractCustomerCityPercentageUpdate")
          {
            if(this.MessageArray[1]=="SupplierContractCustomerCityPercentageView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Contract Customer City Percentage Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractCustomerCityPercentageDelete")
          {
            if(this.MessageArray[1]=="SupplierContractCustomerCityPercentageView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Contract Customer City Percentage Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractCustomerCityPercentageAll")
          {
            if(this.MessageArray[1]=="SupplierContractCustomerCityPercentageView")
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
    this.supplierContractCustomerCityPercentageService.getTableDataSort(
      this.supplierContractCustomerCityPercentageID,
      this.supplierContract_ID,
      this.SearchCustomer,
      this.SearchCity,
      this.SearchFromDate,
      this.SearchToDate,
      this.searchsupplierPercentage,
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
}




