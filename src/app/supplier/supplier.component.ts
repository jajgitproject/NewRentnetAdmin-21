// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SupplierService } from './supplier.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Supplier } from './supplier.model';
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
import { Router } from '@angular/router';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}
@Component({
  standalone: false,
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SupplierComponent implements OnInit {
  displayedColumns = [
    'supplierName',
    'city',
    'supplierOfficialIdentityNumber',
    'phone',
    'email',
    'supplierStatus',
    'supplierVerificationStatus',
    'supplierRegistrationDate',
    'actions'
  ];
  dataSource: Supplier[] | null;
  supplierID: number;
  advanceTable: Supplier | null; 
  PageNumber: number = 0; 
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;

  SearchName: string = '';
  search : FormControl = new FormControl();

  SearchCity: string = '';
  city : FormControl = new FormControl();

  SearchAddress: string = '';
  address : FormControl = new FormControl();

  SearchPin: string = '';
  pin : FormControl = new FormControl();

  SearchPhone: string = '';
  phone : FormControl = new FormControl();

  SearchFax: string = '';
  SearchEmail: string = '';
  SearchSupplierStatus: string = '';
  SearchSupplierVerificationStatus: string = '';
  SearchSupplierRegistrationDate: string = '';
  fax : FormControl = new FormControl();
  supplierName: any;

  public CityList?: CitiesDropDown[] = [];
  filteredCityOptions: Observable<CitiesDropDown[]>;
  supplierDate: any;
  
 selectedFilter: string = 'search';
 searchTerm: any = '';
 filterSelected:boolean = true;

  // supplierMenuItems: any[] = [
  //   //{ label: 'Rate Card', route: '/supplierRateCard', tooltip: 'Rate Card' },
  //   { label: 'City Mapping', route: '/supplierCityMapping', tooltip: 'City Mapping' },
  //   { label: 'Activation Status History', route: '/supplierActivationStatusHistory', tooltip: 'Activation Status History' },
  //   { label: 'Upload Documents', route: '/supplierVerificationDocuments', tooltip: 'Upload Documents' },
  //   { label: 'History', route: '/supplierVerificationStatusHistory', tooltip: 'Supplier History' },
  //   { label: 'Contract Mapping', route: '/supplierRateCardSupplierMapping', tooltip: 'Contract Mapping' }
  // ];
  
  // openSupplierTab(menuItem: any, rowItem: any) {
  //   const baseUrl = this._generalService.FormURL;
  //   const queryParams: any = {
  //     SupplierID: rowItem.supplierID,
  //     SupplierName: rowItem.supplierName
  //   };
  
  //   // Add EmployeeID only if route is supplierVerificationDocuments
  //   if (menuItem.route === '/supplierVerificationDocuments') {
  //     queryParams.EmployeeID = rowItem.supplierCreatedByEmployeeID;
  //   }
  
  //   const url = this.router.serializeUrl(this.router.createUrlTree([menuItem.route], { queryParams }));
  
  //   window.open(baseUrl + url, '_blank');
  // }
  
  supplierMenuItems: any[] = [
    { label: 'City Mapping', route: '/supplierCityMapping', tooltip: 'City Mapping' },
    { label: 'Activation Status History', route: '/supplierActivationStatusHistory', tooltip: 'Activation Status History' },
    { label: 'Upload Documents', route: '/supplierVerificationDocuments', tooltip: 'Upload Documents' },
    { label: 'Verification', route: '/supplierVerificationStatusHistory', tooltip: 'Supplier History' },
    { label: 'Contract Mapping', route: '/supplierRateCardSupplierMapping', tooltip: 'Contract Mapping' }
  ];
  
  openSupplierTab(menuItem: any, rowItem: any) {
  
    const baseUrl = this._generalService.FormURL;
  
    // Encrypt the Supplier ID and Name
    const encryptedSupplierID = this._generalService.encrypt(encodeURIComponent(rowItem.supplierID));
    const encryptedSupplierName = this._generalService.encrypt(encodeURIComponent(rowItem.supplierName));
  
    const queryParams: any = {
      SupplierID: encryptedSupplierID,
      SupplierName: encryptedSupplierName
    };
  
    // Encrypt EmployeeID only if the selected menu item is 'Upload Documents'
    if (menuItem.route === '/supplierVerificationDocuments') {
      queryParams.EmployeeID = this._generalService.encrypt(encodeURIComponent(rowItem.supplierCreatedByEmployeeID));
    }
  
    const url = this.router.serializeUrl(this.router.createUrlTree([menuItem.route], { queryParams }));
  
    window.open(baseUrl + url, '_blank');
  }
  
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public supplierService: SupplierService,
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
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.filteredCityOptions = this.city.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        ); 
      });
    this.loadData();
    this.SubscribeUpdateService();
    
 this.supplierMenuItems.sort((a, b) => a.label.localeCompare(b.label));
  }
  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
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
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }
  refresh() {
    this.SearchName = '';
    this.city.setValue(''),
    this.SearchAddress = '',
    this.SearchPin = '',
    this.SearchPhone = '',
    this.SearchFax= '',
    this.SearchEmail= '',
    this.SearchSupplierStatus= '',
    this.SearchSupplierVerificationStatus= '',
    this.SearchSupplierRegistrationDate= '',
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
          action: 'add'
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.supplierID = row.supplierID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });

  }
  deleteItem(row)
  {

    this.supplierID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }
  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }
   public loadData() 
   {
    debugger;
    switch (this.selectedFilter)
    {
      case 'SupplierName':
        this.SearchName = this.searchTerm;
        break;
      case 'city':
        this.city.setValue(this.searchTerm);
        break;
        case 'phone':
          this.SearchPhone = this.searchTerm;
          break;
          case 'email':
            this.SearchEmail = this.searchTerm;
            break;
            case 'supplierStatus':
              this.SearchSupplierStatus = this.searchTerm;
              break;

          case 'verificationStatus':
            this.SearchSupplierVerificationStatus = this.searchTerm;
            break;
            case 'supplierRegistrationDate':
            this.SearchSupplierRegistrationDate = this.searchTerm;
            break;
      default:
        this.searchTerm = '';
        break;
    }

      this.supplierService.getTableData(this.SearchName,
        this.city.value,
        this.SearchAddress,
        this.SearchPin,
        this.SearchPhone,
        this.SearchFax,
        this.SearchEmail,
        this.SearchSupplierStatus,
        this.SearchSupplierVerificationStatus,
        this.SearchSupplierRegistrationDate,
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
  onContextMenu(event: MouseEvent, item: Supplier) {
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
          if(this.MessageArray[0]=="SupplierCreate")
          {
            if(this.MessageArray[1]=="SupplierView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Supplier Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierUpdate")
          {
            if(this.MessageArray[1]=="SupplierView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierDelete")
          {
            if(this.MessageArray[1]=="SupplierView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierAll")
          {
            if(this.MessageArray[1]=="SupplierView")
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
                'Supplier Official Identity Number already exists.....!!!',
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

  // supplierRateCard(row) {
   
  //   this.supplierID = row.supplierID;
  //   this.supplierName=row.supplierName;
  //   this.router.navigate([
  //     '/supplierRateCard',       
     
  //   ],{
  //     queryParams: {
  //       SupplierID: this.supplierID,
  //       SupplierName:this.supplierName
  //     }
  //   });
  // }

  // supplierActivation(row) {
   
  //   this.supplierID = row.supplierID;
  //   this.supplierName=row.supplierName;
  //   //console.log(this.supplierName)
  //   //alert(row.vendorID);
  //   this.router.navigate([
  //     '/supplierActivationStatusHistory',       
     
  //   ],{
  //     queryParams: {
  //       SupplierID: this.supplierID,
  //       SupplierName:this.supplierName
  //     }
  //   });
  // }

  // supplierCityMapping(row) {
   
  //   this.supplierID = row.supplierID;
  //   this.supplierName=row.supplierName;
  //   this.router.navigate([
  //     '/supplierCityMapping',       
     
  //   ],{
  //     queryParams: {
  //       SupplierID: this.supplierID,
  //       SupplierName:this.supplierName
  //     }
  //   });
  // }

  // supplierVerificationDocuments(row) {
   
  //   this.supplierID = row.supplierID;
  //   this.supplierName=row.supplierName;
  //   //console.log(this.supplierName)
  //   //alert(row.vendorID);
  //   this.router.navigate([
  //     '/supplierVerificationDocuments',       
     
  //   ],{
  //     queryParams: {
  //       SupplierID: this.supplierID,
  //       SupplierName:this.supplierName,
  //     EmployeeID:row.supplierCreatedByEmployeeID
  //     }
  //   });
  // }
  // supplierVerificationStatusHistory(row) {
   
  //   this.supplierID = row.supplierID;
  //   this.supplierName=row.supplierName;
  //   //console.log(this.supplierName)
  //   //alert(row.vendorID);
  //   this.router.navigate([
  //     '/supplierVerificationStatusHistory',       
     
  //   ],{
  //     queryParams: {
  //       SupplierID: this.supplierID,
  //       SupplierName:this.supplierName
  //     }
  //   });
  // }
  SortingData(coloumName:any) {
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.supplierService.getTableDataSort(this.SearchName,
      this.SearchCity,
      this.SearchAddress,
      this.SearchPin,
      this.SearchPhone,
      this.SearchFax,
      this.SearchEmail,
      this.SearchSupplierStatus,
      this.SearchSupplierVerificationStatus,
      this.SearchSupplierRegistrationDate,
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



