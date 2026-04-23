// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CustomerContractService } from './customerContract.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerContract } from './customerContract.model';
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
import { CurrencyDropDown } from '../general/currencyDropDown.model';
import moment from 'moment';
import { Router } from '@angular/router';
import { CustomerContractDropDown } from './customerContractDropDown.model';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}
@Component({
  standalone: false,
  selector: 'app-customerContract',
  templateUrl: './customerContract.component.html',
  styleUrls: ['./customerContract.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerContractComponent implements OnInit {
  @Input() action:any;
  
  displayedColumns = [
    'customerContractName',
    'copiedFrom',
    'customerContractValidFrom',
    //'currencyName',
    'status',
    'actions'
  ];
  dataSource: CustomerContract[] | null;
  customerContractID: number;
  advanceTable: CustomerContract | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  copiedFromData: string;
  public CurrencyList?: CurrencyDropDown[] = [];
  public CustomerContractList?: CustomerContractDropDown[] = [];
  filteredOptionss: Observable<CustomerContractDropDown[]>;
  // filteredOptions: Observable<CurrencyDropDown[]>;
  filteredCurrencyOptions: Observable<CurrencyDropDown[]>;

  SearchName: string = '';
  search : FormControl = new FormControl();

  SearchValidFrom: string = '';
  validFrom : FormControl = new FormControl();

  SearchValidTo: string = '';
  validTo : FormControl = new FormControl();

  SearchCurrency: string = '';
  currency : FormControl = new FormControl();

  searchTerm: any = '';
  selectedFilter: string = 'search';

  menuItems: any[] = [
    { label: 'Car Category Mapping', },
    { label: 'City Tiers Mapping',  },
    { label: 'Contract Payment Mapping', },
    { label: 'Contract Package Type Mapping',  },
    { label: 'Local Lumpsum Rate',  },
    { label: 'Local On Demand Rate',  },
    { label: 'Local Rate',  },
    { label: 'Local Transfer Rate',  },
    { label: 'Long Term Rental Rate',  tooltip: 'Long Term Rental Rate' },
    { label: 'Outstation Lumpsum Rate', tooltip: 'Outstation Lumpsum Rate' },
    { label: 'Outstation OneWay Trip Rate',  tooltip: 'Outstation OneWay Trip Rate' },
    { label: 'Outstation Round Trip Rate',  },
    // { label: 'SD Limited Rate', },
    // { label: 'SD Unlimited Rate', },
    
  ];
  visibleMenuItems: any[] = [];
  public packageType?: PackageTypeDropDown[] = [];
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public customerContractService: CustomerContractService,
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
    this.loadData();
    this.SubscribeUpdateService();
    this.InitCurrencies();
    this.InitCustomerContract();
    this.menuItems.sort((a, b) => a.label.localeCompare(b.label));
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.CustomerContractList.filter(
      customer => 
      {
        return customer.customerContractName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  InitCustomerContract(){
    this._generalService.GetCustomerContract().subscribe
    (
      data =>   
      {
        this.CustomerContractList = data; 
        this.filteredOptionss = this.search.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );      
      }
    );
  }

  // InitCurrency(){
  //   this._generalService.GetCurrency().subscribe
  //   (
  //     data =>   
  //     {
  //       this.CurrencyList = data; 
       
  //     }
  //   );
  // }
  // InitCurrency() {
  //   this._generalService.GetCurrency().subscribe(
  //     data =>
  //     {
  //        ;
  //       this.CurrencyList = data;
  //       this.filteredOptions = this.currency.valueChanges.pipe(
  //        startWith(""),
  //        map(value => this._filtercurrency(value || ''))
  //      );
  //     },
  //     error =>
  //     {
       
  //     }
  //   );
  //  }
  //  private _filtercurrency(value: string): any {
  //    const filterValue = value.toLowerCase();
  //    return this.CurrencyList.filter(
  //      customer => 
  //      {
  //        return customer.currencyName.toLowerCase().indexOf(filterValue)===0;
  //      }
  //    );
     
  //  };
  InitCurrencies() {
    this._generalService.GetCurrency().subscribe(
      data =>
      {
         ;
        this.CurrencyList = data;
        this.filteredCurrencyOptions = this.currency.valueChanges.pipe(
               startWith(""),
                map(value => this._filtercurrency(value || ''))
            );
      },
      error =>
      {
       
      }
    );
   }
   private _filtercurrency(value: string): any {
     const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
     return this.CurrencyList.filter(
       customer => 
       {
         return customer.currencyName.toLowerCase().indexOf(filterValue)===0;
       }
     );
     
   };
  //  getTierID(currencyID: any) {
  //    this.currencyID=currencyID;
  //  }
  refresh() {
    this.search.setValue('');
    this.SearchValidFrom='';
    this.SearchValidTo='';
    this.currency.setValue('');
    this.SearchActivationStatus = true;
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
          action: 'add'
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerContractID = row.customerContractID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });

  }
  deleteItem(row)
  {

    this.customerContractID = row.id;
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
    if(this.SearchValidFrom!==""){
      this.SearchValidFrom=moment(this.SearchValidFrom).format('MMM DD yyyy');
    }
    if(this.SearchValidTo!==""){
      this.SearchValidTo=moment(this.SearchValidTo).format('MMM DD yyyy');
    }
    switch (this.selectedFilter)
    {
      case 'contractName':
        this.search.setValue(this.searchTerm);
        break;
      case 'validFrom':
        this.SearchValidFrom = this.searchTerm;
        break;
      case 'validTo':
        this.SearchValidTo = this.searchTerm;
        break;
      // case 'currency':
      //   this.SearchValidTo = this.searchTerm;
      //   break;
      default:
        this.searchTerm = '';
        break;
    }  
      this.customerContractService.getTableData(this.search.value,
        this.SearchValidFrom,
        this.SearchValidTo,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
        this.InitCustomerContract();
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  // public getPackageType(item:any) 
  //  {
  //   this._generalService.getPackageTypeByContractID(item.customerContractID).subscribe
  //   (
  //     data =>   
  //     {
  //       this.packageType = data;
  //       this.updateMenuItems();
  //     },
  //     (error: HttpErrorResponse) => { this.dataSource = null;}
  //   );
  // }

  getPackageType(item: any): Promise<void> {
    return new Promise((resolve) => {
        this._generalService.getPackageTypeByContractID(item.customerContractID).subscribe(
            data => {
                this.packageType = data;
                this.updateMenuItems();
                resolve();
            },
            (error: HttpErrorResponse) => {
                this.dataSource = null;
                resolve();
            });
          });
        }

  private updateMenuItems() {
    const alwaysVisibleItems = this.getAlwaysVisibleItems();
    if(this.packageType)
    {
      const conditionalItems = this.menuItems.filter(menuItem => 
        this.packageType.some(pkg => pkg.packageType === menuItem.label)
      );
      this.visibleMenuItems = [...alwaysVisibleItems, ...conditionalItems];
    }
    else{
      this.visibleMenuItems = [...alwaysVisibleItems];
    }
    this.sortMenuItems();
  }

  private getAlwaysVisibleItems() {
    return this.menuItems.filter(item => 
      ['City Tiers Mapping', 'Contract Package Type Mapping', 'Car Category Mapping','Contract Payment Mapping', 'SD Limited Rate', 'SD Unlimited Rate'].includes(item.label)
    );
  }

  private sortMenuItems() {
    this.visibleMenuItems.sort((a, b) => a.label.localeCompare(b.label));
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  // onContextMenu(event: MouseEvent, item: CustomerContract) {
  //   event.preventDefault();
  //   this.contextMenuPosition.x = event.clientX + 'px';
  //   this.contextMenuPosition.y = event.clientY + 'px';
  //   this.contextMenu.menuData = { item: item };
  //   this.contextMenu.menu.focusFirstItem('mouse');
  //   this.contextMenu.openMenu();
  //   this.getPackageType(item);
  // }

  onContextMenu(event: MouseEvent, item: CustomerContract) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    
    this.contextMenu.menuData = { item: item };

    // Fetch package type and then open the menu
    this.getPackageType(item).then(() => {
        this.contextMenu.menu.focusFirstItem('mouse');
        this.contextMenu.openMenu();
    });
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

  // customerContractCityTiers(row) {
  //   this.router.navigate([
  //     '/customerContractCityTiers',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerContractID: row.customerContractID,
  //       CustomerContractName: row.customerContractName,
  //     }
  //   }); 
  // }

  // CDCLocalRate(row) {
  //   this.router.navigate([
  //     '/customerContractCDCLocalRate',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerContractID: row.customerContractID,
  //       CustomerContractName: row.customerContractName,
  //       StartDate:row.customerContractValidFrom,
  //       EndDate:row.customerContractValidTo,
       
  //     }
  //   }); 
  // }

  // CDCLocalLumpsumRate(row) {
  //   this.router.navigate([
  //     '/cdcLocalLumpsumRate',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerContractID: row.customerContractID,
  //       CustomerContractName: row.customerContractName,
  //       StartDate:row.customerContractValidFrom,
  //       EndDate:row.customerContractValidTo,
       
  //     }
  //   }); 
  // }

  // CDCOutstationRoundTripRate(row) {
  //   this.router.navigate([
  //     '/cdcOutStationRoundTripRate',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerContractID: row.customerContractID,
  //       CustomerContractName: row.customerContractName,
  //       StartDate:row.customerContractValidFrom,
  //       EndDate:row.customerContractValidTo,
       
  //     }
  //   }); 
  // }

  // CDCOutStationLumpsumRate(row) {
  //   this.router.navigate([
  //     '/cdcOutStationLumpsumRate',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerContractID: row.customerContractID,
  //       CustomerContractName: row.customerContractName,
  //       StartDate:row.customerContractValidFrom,
  //       EndDate:row.customerContractValidTo,
       
  //     }
  //   }); 
  // }

  // CDCLocalOnDemandRate(row) {
  //   this.router.navigate([
  //     '/cdcLocalOnDemandRate',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerContractID: row.customerContractID,
  //       CustomerContractName: row.customerContractName,
  //       StartDate:row.customerContractValidFrom,
  //       EndDate:row.customerContractValidTo,
       
  //     }
  //   }); 
  // }
  // CDCLongTermRentalRate(row) {
  //   this.router.navigate([
  //     '/cdcLongTermRentalRate',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerContractID: row.customerContractID,
  //       CustomerContractName: row.customerContractName,
  //       StartDate:row.customerContractValidFrom,
  //       EndDate:row.customerContractValidTo,
       
  //     }
  //   }); 
  // }

  // CDCOutStationOneWayTripRate(row) {
  //   this.router.navigate([
  //     '/cdcOutStationOneWayTripRate',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerContractID: row.customerContractID,
  //       CustomerContractName: row.customerContractName,
  //       StartDate:row.customerContractValidFrom,
  //       EndDate:row.customerContractValidTo,
       
  //     }
  //   }); 
  // }
  
  // sdlimitedRate(row) {
  //   this.router.navigate([
  //     '/sdlimitedRate',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerContractID: row.customerContractID,
  //       CustomerContractName: row.customerContractName,
  //       customerContractValidFrom:row.customerContractValidFrom,
  //       customerContractValidTo:row.customerContractValidTo,
  //     }
  //   }); 
  // }

  // sdUnLimitedRate(row) {
  //   this.router.navigate([
  //     '/sdUnLimitedRate',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerContractID: row.customerContractID,
  //       CustomerContractName: row.customerContractName,
  //       customerContractValidFrom:row.customerContractValidFrom,
  //       customerContractValidTo:row.customerContractValidTo,
  //     }
  //   }); 
  // }

  // customerContractCarCategory(row) {
  //   this.router.navigate([
  //     '/customerContractCarCategory',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerContractID: row.customerContractID,
  //       CustomerContractName: row.customerContractName,
  //     }
  //   }); 
  // }

  // cdcLocalTransferRate(row) {
  //   this.router.navigate([
  //     '/cdcLocalTransferRate',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerContractID: row.customerContractID,
  //       CustomerContractName: row.customerContractName,
  //       customerContractValidFrom:row.customerContractValidFrom,
  //       customerContractValidTo:row.customerContractValidTo,
  //     }
  //   }); 
  // }

  openInNewTab(menuItem: any, rowItem: any) {
    let baseUrl =  this._generalService.FormURL;
    const encryptedCustomerContractID = encodeURIComponent(this._generalService.encrypt(rowItem.customerContractID.toString()));
  const encryptedCustomerContractName = encodeURIComponent(this._generalService.encrypt(rowItem.customerContractName));
  const encryptedStartDate = encodeURIComponent(this._generalService.encrypt(rowItem.customerContractValidFrom));
  const encryptedEndDate = encodeURIComponent(this._generalService.encrypt(rowItem.customerContractValidTo));

    if(menuItem.label.toLowerCase() === 'city tiers mapping') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/customerContractCityTiers'], { queryParams: {
        // CustomerContractID: rowItem.customerContractID,
        // CustomerContractName: rowItem.customerContractName,
        CustomerContractID:encryptedCustomerContractID,
        CustomerContractName: encryptedCustomerContractName

      } }));
      window.open(baseUrl + url, '_blank'); 
      // this.router.navigate(['/customerAddress'], {
      //   queryParams: {
      //     CustomerID: rowItem.customerID,
      //     CustomerName: rowItem.customerName
      //   }
      // });
    }
   
    else if(menuItem.label.toLowerCase() === 'local rate') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/customerContractCDCLocalRate'], { queryParams: {
        // CustomerContractID: rowItem.customerContractID,
        // CustomerContractName: rowItem.customerContractName,
        // CustomerContractID:encryptedCustomerContractID,
        // CustomerContractName: encryptedCustomerContractName,
        // StartDate:rowItem.customerContractValidFrom,
        // EndDate:rowItem.customerContractValidTo,
        CustomerContractID: encryptedCustomerContractID,
        CustomerContractName: encryptedCustomerContractName,
        StartDate: encryptedStartDate,
        EndDate: encryptedEndDate

      } }));
      window.open(baseUrl + url, '_blank'); 
    }
      else if(menuItem.label.toLowerCase() === 'local lumpsum rate') {
        const url = this.router.serializeUrl(this.router.createUrlTree(['/cdcLocalLumpsumRate'], { queryParams: {
          // CustomerContractID: rowItem.customerContractID,
          // CustomerContractName: rowItem.customerContractName,
          // StartDate:rowItem.customerContractValidFrom,
          // EndDate:rowItem.customerContractValidTo,
          CustomerContractID: encryptedCustomerContractID,
          CustomerContractName: encryptedCustomerContractName,
          StartDate: encryptedStartDate,
          EndDate: encryptedEndDate
  
        } }));
        window.open(baseUrl + url, '_blank'); 
      
    }

    else if(menuItem.label.toLowerCase() === 'outstation lumpsum rate') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/cdcOutStationLumpsumRate'], { queryParams: {
        // CustomerContractID: rowItem.customerContractID,
        //   CustomerContractName: rowItem.customerContractName,
        //   StartDate:rowItem.customerContractValidFrom,
        //   EndDate:rowItem.customerContractValidTo,
        CustomerContractID: encryptedCustomerContractID,
        CustomerContractName: encryptedCustomerContractName,
        StartDate: encryptedStartDate,
        EndDate: encryptedEndDate
    
      } }));
      window.open(baseUrl + url, '_blank'); 
    
    }

    else if(menuItem.label.toLowerCase() === 'outstation round trip rate') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/cdcOutStationRoundTripRate'], { queryParams: {
        // CustomerContractID: rowItem.customerContractID,
        //   CustomerContractName: rowItem.customerContractName,
        //   StartDate:rowItem.customerContractValidFrom,
        //   EndDate:rowItem.customerContractValidTo,
        CustomerContractID: encryptedCustomerContractID,
        CustomerContractName: encryptedCustomerContractName,
        StartDate: encryptedStartDate,
        EndDate: encryptedEndDate

      } }));
      window.open(baseUrl + url, '_blank'); 
    
  }

  else if(menuItem.label.toLowerCase() === 'local on demand rate') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/cdcLocalOnDemandRate'], { queryParams: {
      // CustomerContractID: rowItem.customerContractID,
      //   CustomerContractName: rowItem.customerContractName,
      //   StartDate:rowItem.customerContractValidFrom,
      //   EndDate:rowItem.customerContractValidTo,
      CustomerContractID: encryptedCustomerContractID,
      CustomerContractName: encryptedCustomerContractName,
      StartDate: encryptedStartDate,
      EndDate: encryptedEndDate

    } }));
    window.open(baseUrl + url, '_blank'); 
  
}

else if(menuItem.label.toLowerCase() === 'long term rental rate') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/cdcLongTermRentalRate'], { queryParams: {
    // CustomerContractID: rowItem.customerContractID,
    //   CustomerContractName: rowItem.customerContractName,
    //   StartDate:rowItem.customerContractValidFrom,
    //   EndDate:rowItem.customerContractValidTo,
    CustomerContractID: encryptedCustomerContractID,
    CustomerContractName: encryptedCustomerContractName,
    StartDate: encryptedStartDate,
    EndDate: encryptedEndDate

  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'outstation oneway trip rate') {
  const url = this.router.serializeUrl(this.router.createUrlTree([ '/cdcOutStationOneWayTripRate'], { queryParams: {
    // CustomerContractID: rowItem.customerContractID,
    //   CustomerContractName: rowItem.customerContractName,
    //   StartDate:rowItem.customerContractValidFrom,
    //   EndDate:rowItem.customerContractValidTo,

    CustomerContractID: encryptedCustomerContractID,
    CustomerContractName: encryptedCustomerContractName,
    StartDate: encryptedStartDate,
    EndDate: encryptedEndDate
  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'car category mapping') {
  const url = this.router.serializeUrl(this.router.createUrlTree([ '/customerContractCarCategory'], { queryParams: {
    // CustomerContractID: rowItem.customerContractID,
    //   CustomerContractName: rowItem.customerContractName,
    //   StartDate:rowItem.customerContractValidFrom,
    //   EndDate:rowItem.customerContractValidTo,
    CustomerContractID: encryptedCustomerContractID,
    CustomerContractName: encryptedCustomerContractName,
    StartDate: encryptedStartDate,
    EndDate: encryptedEndDate
  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'contract payment mapping') {
  const url = this.router.serializeUrl(this.router.createUrlTree([ '/contractPaymentMapping'], { queryParams: {
    // CustomerContractID: rowItem.customerContractID,
    //   CustomerContractName: rowItem.customerContractName,
    //   StartDate:rowItem.customerContractValidFrom,
    //   EndDate:rowItem.customerContractValidTo,
    CustomerContractID: encryptedCustomerContractID,
    CustomerContractName: encryptedCustomerContractName,
    StartDate: encryptedStartDate,
    EndDate: encryptedEndDate

  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'local transfer rate') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/cdcLocalTransferRate'], { queryParams: {
    // CustomerContractID: rowItem.customerContractID,
    //   CustomerContractName: rowItem.customerContractName,
    //   StartDate:rowItem.customerContractValidFrom,
    //   EndDate:rowItem.customerContractValidTo,
    CustomerContractID: encryptedCustomerContractID,
    CustomerContractName: encryptedCustomerContractName,
    StartDate: encryptedStartDate,
    EndDate: encryptedEndDate
  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'contract package type mapping') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/contractPackageTypeMapping'], { queryParams: {
    // CustomerContractID: rowItem.customerContractID,
    //   CustomerContractName: rowItem.customerContractName,
    //   StartDate:rowItem.customerContractValidFrom,
    //   EndDate:rowItem.customerContractValidTo,

    CustomerContractID: encryptedCustomerContractID,
    CustomerContractName: encryptedCustomerContractName,
    StartDate: encryptedStartDate,
    EndDate: encryptedEndDate
  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'sd limited rate') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/sdlimitedRate'], { queryParams: {
    // CustomerContractID: rowItem.customerContractID,
    //   CustomerContractName: rowItem.customerContractName,
    //   StartDate:rowItem.customerContractValidFrom,
    //   EndDate:rowItem.customerContractValidTo,
    CustomerContractID: encryptedCustomerContractID,
    CustomerContractName: encryptedCustomerContractName,
    StartDate: encryptedStartDate,
    EndDate: encryptedEndDate

  } }));
  window.open(baseUrl + url, '_blank'); 

}
else if(menuItem.label.toLowerCase() === 'sd unlimited rate') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/sdUnLimitedRate'], { queryParams: {
    // CustomerContractID: rowItem.customerContractID,
    //   CustomerContractName: rowItem.customerContractName,
    //   StartDate:rowItem.customerContractValidFrom,
    //   EndDate:rowItem.customerContractValidTo,
    CustomerContractID: encryptedCustomerContractID,
    CustomerContractName: encryptedCustomerContractName,
    StartDate: encryptedStartDate,
    EndDate: encryptedEndDate

  } }));
  window.open(baseUrl + url, '_blank'); 

}
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
          if(this.MessageArray[0]=="CustomerContractCreate")
          {
            if(this.MessageArray[1]=="CustomerContractView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Contract Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractUpdate")
          {
            if(this.MessageArray[1]=="CustomerContractView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Contract Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractDelete")
          {
            if(this.MessageArray[1]=="CustomerContractView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Contract Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractAll")
          {
            if(this.MessageArray[1]=="CustomerContractView")
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
    this.customerContractService.getTableDataSort(this.SearchName,
      this.SearchValidFrom,
      this.SearchValidTo,
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




