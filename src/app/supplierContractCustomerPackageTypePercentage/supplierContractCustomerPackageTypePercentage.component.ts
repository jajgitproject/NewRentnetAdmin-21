// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SupplierContractCustomerPackageTypePercentageService } from './supplierContractCustomerPackageTypePercentagePercentage.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SupplierContractCustomerPackageTypePercentage } from './supplierContractCustomerPackageTypePercentage.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponentHolder } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { PackageTypeDropDown } from '../general/packageTypeDropDown.model';
import { CustomerDropDown } from '../supplierCustomerFixedForAllPercentage/customerDropDown.model';
@Component({
  standalone: false,
  selector: 'app-supplierContractCustomerPackageTypePercentage',
  templateUrl: './supplierContractCustomerPackageTypePercentage.component.html',
  styleUrls: ['./supplierContractCustomerPackageTypePercentage.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SupplierContractCustomerPackageTypePercentageComponent implements OnInit {
  displayedColumns = [
    'customerName',
    'packageType',
    'fromDate',
    'toDate',
   'supplierPercentage',
   
    'activationStatus',
    'actions'
  ];
  SupplierContractID: number = 1;
  dataSource: SupplierContractCustomerPackageTypePercentage[] | null;
  supplierContractCustomerPackageTypePercentageID: number;
  advanceTable: SupplierContractCustomerPackageTypePercentage | null;
  SearchSupplierContractCustomerPackageTypePercentage: string = ''; 
  SearchPercentage:string='';
  SearchSupplierContractCustomer:string='';
  SearchSupplierContractCustomers:string='';
  public CustomerList?: CustomerDropDown[] = [];
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;
  search : FormControl = new FormControl();
  percentage: FormControl = new FormControl();
  searchEntity: FormControl = new FormControl();
  searchCustomer:FormControl = new FormControl();
  SearchEntityType:string='';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;
  ActiveStatus: any;
  employee_ID:any;
  EmployeeID:number=0;
  public PackageTypeList?: PackageTypeDropDown[] = [];
  supplierContract_ID: any;
  Applicable_From: any;
  Applicable_To: any;
  supplier_Name: any;
  supplierContractName:any;
  selectedFilter: string = 'search';
  searchTerm: any = '';
  filterSelected:boolean = true;
  SearchFromDate:string = '';
  SearchToDate:string='';
  // SearchPercentage:string='';
  SearchCustomer:string='';
  SearchCity:string='';
  SearchapplicableTo:string='';
  SearchapplicableFrom:string='';
  constructor(
    public route:ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public supplierContractCustomerPackageTypePercentageService: SupplierContractCustomerPackageTypePercentageService,
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
      //  this.supplier_Name=paramsData.supplierName;
      //  this.supplierContractName=paramsData.supplierContractName;
      const encryptedSupplierContractID = this.route.snapshot.queryParamMap.get('SupplierContractID');
      const encryptedApplicableFrom = this.route.snapshot.queryParamMap.get('ApplicableFrom');
      const encryptedApplicableTo = this.route.snapshot.queryParamMap.get('ApplicableTo');
      const encryptedSupplierName = this.route.snapshot.queryParamMap.get('supplierName');
      const encryptedSupplierContractName = this.route.snapshot.queryParamMap.get('supplierContractName');
      // Check if the parameters exist
      if (encryptedSupplierContractID && encryptedApplicableFrom && encryptedApplicableTo && encryptedSupplierName && encryptedSupplierContractName) {
        // Decrypt and decode the parameters
        this.supplierContract_ID = this._generalService.decrypt(decodeURIComponent(encryptedSupplierContractID));
        this.Applicable_From= this._generalService.decrypt(decodeURIComponent(encryptedApplicableFrom));
        this.Applicable_To= this._generalService.decrypt(decodeURIComponent(encryptedApplicableTo));
        this.supplier_Name= this._generalService.decrypt(decodeURIComponent(encryptedSupplierName));
        this.supplierContractName= this._generalService.decrypt(decodeURIComponent(encryptedSupplierContractName));
        this.supplier_Name = decodeURIComponent(this.supplier_Name);
        this.Applicable_To = decodeURIComponent( this.Applicable_To);
        this.Applicable_From= decodeURIComponent( this.Applicable_From);
      }
    });
    this.InitCustomer();
    this.loadData();
    this.InitPackage();
    this.SubscribeUpdateService();
   
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }
  InitPackage() {
    this._generalService.GetPackageType().subscribe(
      data => {
        ;
        this.PackageTypeList = data;
        this.filteredPackageTypeOptions = this.search.valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackage(value || ''))
        );
        //console.log(this.StateList);
      },
      error => {

      }
    );
  }
 private _filterPackage(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.PackageTypeList.filter(
      customer => 
      {
        return customer.packageType.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  InitCustomer() {
    this._generalService.GetCustomers().subscribe(
      data => {
        ;
        this.CustomerList = data;
        this.filteredCustomerOptions = this.searchCustomer.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomer(value || ''))
        );
        //console.log(this.StateList);
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
  refresh() {
    this.searchCustomer.setValue('');
    this.search.setValue('');
    this.SearchPercentage='';
    this.SearchFromDate='';
    this.SearchToDate='';
    // this.searchsupplierPercentage='';
    this.searchTerm='';
    this.selectedFilter ='search';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }
  addNew()
  {
    
    const dialogRef = this.dialog.open(FormDialogComponentHolder, 
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
    this.supplierContractCustomerPackageTypePercentageID = row.id;
    const dialogRef = this.dialog.open(FormDialogComponentHolder, {
      data: {
        advanceTable: row,
        action: 'edit',
        SupplierContractID:this.supplierContract_ID,
          ApplicableFrom:this.Applicable_From,
          ApplicableTo:this.Applicable_To,
          SupplierName:this.supplier_Name
      }
    });
    //console.log(row);

  }
  public SearchData()
  {
    this.loadData();
    //this.SearchSupplierContractCustomerPackageTypePercentage='';
  }
  
  deleteItem(row)
  {

    this.supplierContractCustomerPackageTypePercentageID = row.id;
  //console.log(row)
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
    // Ensure the selected filter value is correctly set based on the search term
    switch (this.selectedFilter) {
      case 'customer':
        this.searchCustomer.setValue(this.searchTerm);
        break;
      case 'packageType':
        this.search.setValue(this.searchTerm);
        break;
      case 'applicableFrom':
        this.SearchFromDate = this.searchTerm;
        break;
      case 'applicableTo':
        this.SearchToDate = this.searchTerm;
        break;
      case 'supplierPercentage':
        this.SearchPercentage = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
  
    // Call the service to get data based on filters
    this.supplierContractCustomerPackageTypePercentageService.getTableData(
      this.supplierContract_ID,
      this.searchCustomer?.value || '',
      this.search?.value || '',
      this.SearchPercentage || '',
      this.SearchFromDate || '',
      this.SearchToDate || '',
      this.SearchActivationStatus, 
      this.PageNumber
    ).subscribe(
      data => {
        // If data exists, populate dataSource, otherwise set it to null
        this.dataSource = data && data.length > 0 ? data : null;
      },
      (error: HttpErrorResponse) => {
        this.dataSource = null;
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
  onContextMenu(event: MouseEvent, item: SupplierContractCustomerPackageTypePercentage) {
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
        //console.log(this.MessageArray);
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="SupplierContractCustomerPackageTypePercentageCreate")
          {
            if(this.MessageArray[1]=="SupplierContractCustomerPackageTypePercentageView")
            {
              if(this.MessageArray[2]=="Success")
              {
                //debugger;
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Supplier Contract Customer PackageType Percentage Created..!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractCustomerPackageTypePercentageUpdate")
          {
            if(this.MessageArray[1]=="SupplierContractCustomerPackageTypePercentageView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Contract Customer PackageType Percentage Updated..!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractCustomerPackageTypePercentageDelete")
          {
            if(this.MessageArray[1]=="SupplierContractCustomerPackageTypePercentageView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Contract Customer PackageType Percentage Deleted..!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractCustomerPackageTypePercentageAll")
          {
            if(this.MessageArray[1]=="SupplierContractCustomerPackageTypePercentageView")
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
    //debugger;
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.supplierContractCustomerPackageTypePercentageService.getTableDataSort(
      this.supplierContract_ID,
        this.SearchSupplierContractCustomers,
        this.SearchSupplierContractCustomerPackageTypePercentage,
        this.SearchPercentage,
        this.SearchFromDate,
        this.SearchToDate,
        this.SearchActivationStatus, 
        this.PageNumber, coloumName.active,this.sortType).subscribe
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



