// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SupplierContractService } from './supplierContract.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SupplierContract } from './supplierContract.model';
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
import moment from 'moment';
import { EmployeeDropDown } from '../employee/employeeDropDown.model';
interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}
@Component({
  standalone: false,
  selector: 'app-supplierContract',
  templateUrl: './supplierContract.component.html',
  styleUrls: ['./supplierContract.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SupplierContractComponent implements OnInit {
  displayedColumns = [
    'supplierContractName',
    'validFrom',
    'validTo',
    'approvedBy',
    'status',
    'actions'
  ];
  dataSource: SupplierContract[] | null;
  supplierContractID: number;
  advanceTable: SupplierContract | null;
  SearchContractID: number = 0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  public EmployeeList?: EmployeeDropDown[] = [];

  SearchValidFrom:string='';
  validFrom : FormControl = new FormControl();

  SearchValidTo:string='';
  validTo : FormControl = new FormControl();

  SearchApprovedBy:string='';
  approvedBy : FormControl = new FormControl();
  filteredinstructedByOptionss: Observable<EmployeeDropDown[]>;
  searchinstructedBy: FormControl = new FormControl();
  
  supplierRateCard_ID: any;
  supplierRateCard_Name: any;
  supplierName: any;
  SupplierContractName: string='';
  selectedFilter: string = 'search';
  searchTerm: any = '';
  filterSelected:boolean = true;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public supplierContractService: SupplierContractService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
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
      //this.supplierRateCard_ID = paramsData.SupplierRateCardID;
      //this.supplierRateCard_Name=paramsData.SupplierRateCardName;
      this.supplierName=paramsData.SupplierName;
      //console.log(this.supplierRateCard_ID)
    });
    this.InitEmployee();
    this.loadData();
    this.menuItems.sort((a, b) => a.label.localeCompare(b.label));
    this.SubscribeUpdateService();
  }

  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

  // InitEmployee(){
  //   this._generalService.GetEmployeesForSupplierContract().subscribe
  //   (
  //     data =>   
  //     {
  //       this.EmployeeList = data; 
       
  //     }
  //   );
  // }

  InitEmployee(){
    this._generalService.GetEmployeesForSupplierContract().subscribe(
      data=>
      {
        this.EmployeeList=data;
        this.filteredinstructedByOptionss = this.approvedBy.valueChanges.pipe(
          startWith(""),
          map(value => this._filterNext(value || ''))
        ); 
      });
  }
  
  private _filterNext(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.EmployeeList.filter(
      customer => 
      {
        return customer.firstName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  refresh() {
    this.SupplierContractName='';
    this.SearchValidFrom = '';
    this.SearchValidTo = '',
    this.approvedBy.setValue(''),
    this.searchTerm='';
    this.selectedFilter ='search';
    this.SearchActivationStatus = true;
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
          SUPPLIERRATECARDID:this.supplierRateCard_ID,
          SUPPLIERRATECARDNAME:this.supplierRateCard_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.supplierContractID = row.supplierContractID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });

  }

  deleteItem(row)
  {

    this.supplierContractID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false;
  }

  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
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
      case 'SupplierContractName':
        this.SupplierContractName = this.searchTerm;
        break;
      case 'applicableFrom':
        this.SearchValidFrom = this.searchTerm;
        break;
      case 'applicableTill':
        this.SearchValidTo = this.searchTerm;
        break;
      case 'approvedBy':
        this.approvedBy.setValue(this.searchTerm) ;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.supplierContractService.getTableData(this.SearchContractID,
        this.SupplierContractName,
        this.SearchValidFrom,
        this.SearchValidTo,
        this.approvedBy.value,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {
        // if(data !== null){
        this.dataSource = data;
        console.log(this.dataSource)
        
      // }
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
  onContextMenu(event: MouseEvent, item: SupplierContract) {
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

  menuItems: any[] = [
    { label: 'Customer City Percentage', },
    { label: 'City Percentage', },
    { label: 'Package Type Percentage', tooltip: 'Package Type Percentage'},
    { label: 'Customer Package Type Percentage',tooltip: 'Customer Package Type Percentage'  },
    { label: 'Vehicle Percentage',},
    { label: 'Customer Vehicle Percentage', tooltip: 'Customer Vehicle Percentage' },
    { label: 'Percentage',  },
    { label: 'CDC OutStation Lumpsum Trip',tooltip: 'CDC OutStation Lumpsum Trip'  },
    { label: 'CDC Local On Demand',tooltip: 'CDC Local On Demand'  },
 
    { label: 'CDC Local Transfer', tooltip: 'CDC Local Transfer' },
 
    { label: 'CDC Local',  },
    { label: 'SDC Self Drive Hourly Limited', tooltip: 'SDC Self Drive Hourly Limited' },
    { label: 'SDC Self Drive Hourly Unlimited', tooltip: 'SDC Self Drive Hourly Unlimited' },
    { label: 'CDC Local Lumpsum', tooltip: 'CDC Local Lumpsum' },
    { label: 'CDC OutStation Round Trip',tooltip: 'CDC OutStation Round Trip'  },
    { label: 'CDC OutStation Oneway Trip', tooltip: 'CDC OutStation Oneway Trip' },
    { label: 'SDC Self Drive Limited', tooltip: 'SDC Self Drive Limited' },
    { label: 'SDC Self Drive Unlimited',tooltip: 'SDC Self Drive Unlimited' },
    // { label: 'CDC Local On Demand', tooltip: 'CDC Local On Demand' },
    { label: 'CDC Long Term Rental',  tooltip: 'CDC Long Term Rental' }
  ];

  // openInNewTab(menuItem: any, rowItem: any)
  // {
  //   let baseUrl =  this._generalService.FormURL;
   
  //   if(menuItem.label.toLowerCase() === 'customer city percentage') {
  //     const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractCustomerCityPercentage'], { queryParams: {
  //       SupplierContractID: rowItem.supplierContractID,
  //       //this.supplierContractID = row.supplierContractID;
  //       ApplicableFrom:rowItem.validFrom,
  //       ApplicableTo:rowItem.validTo,
  //       supplierName:this.supplierName,
  //       supplierContractName:rowItem.supplierContractName,
  //     } }));
  //     window.open(baseUrl + url, '_blank'); 
  //     // this.router.navigate(['/customerAddress'], {
  //     //   queryParams: {
  //     //     CustomerID: rowItem.customerID,
  //     //     CustomerName: rowItem.customerName
  //     //   }
  //     // });
  openInNewTab(menuItem: any, rowItem: any) {
    console.log(menuItem);
    console.log(rowItem);
    
    let baseUrl = this._generalService.FormURL;
    const encryptedSupplierContractID = this._generalService.encrypt(encodeURIComponent(rowItem.supplierContractID));
    const encryptedApplicableFrom = this._generalService.encrypt(encodeURIComponent(rowItem.validFrom));
    const encryptedApplicableTo = this._generalService.encrypt(encodeURIComponent(rowItem.validTo));
    const encryptedSupplierName = this._generalService.encrypt(encodeURIComponent(rowItem.supplierName));
    const encryptedSupplierContractName = this._generalService.encrypt(encodeURIComponent(rowItem.supplierContractName));
    const encryptedSupplierRateCardName = this._generalService.encrypt(encodeURIComponent(this.supplierRateCard_Name));
    if (menuItem.label.toLowerCase() === 'customer city percentage') {
      // Encrypt the required values
   
      // Create the URL with the encrypted values
      const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractCustomerCityPercentage'], { queryParams: {
        SupplierContractID: encryptedSupplierContractID,
        ApplicableFrom: encryptedApplicableFrom,
        ApplicableTo: encryptedApplicableTo,
        supplierName: encryptedSupplierName,
        supplierContractName: encryptedSupplierContractName,
      }}));
  
      // Open the new tab with the encrypted URL
      window.open(baseUrl + url, '_blank');
    }
   else if(menuItem.label.toLowerCase() === 'city percentage') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractCityPercentage'], { queryParams: {
        //  SupplierContractID: encryptedSupplierContractID,
        // ApplicableFrom: encryptedApplicableFrom,
        // ApplicableTo: encryptedApplicableTo,
        // supplierName: encryptedSupplierName,
        // supplierContractName: encryptedSupplierContractName,
        SupplierContractID: encryptedSupplierContractID,
        ApplicableFrom: encryptedApplicableFrom,
        ApplicableTo: encryptedApplicableTo,
        supplierName: encryptedSupplierName,
        supplierContractName: encryptedSupplierContractName,
      } }));
      window.open(baseUrl + url, '_blank'); 
    }
  
  else if(menuItem.label.toLowerCase() === 'customer package type percentage') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractCustomerPackageTypePercentage'], { queryParams: {
      // SupplierContractID: rowItem.supplierContractID,
      // ApplicableFrom:rowItem.validFrom,
      // ApplicableTo:rowItem.validTo,
      // supplierName:this.supplierName,
      // supplierContractName:rowItem.supplierContractName,
      SupplierContractID: encryptedSupplierContractID,
      ApplicableFrom: encryptedApplicableFrom,
      ApplicableTo: encryptedApplicableTo,
      supplierName: encryptedSupplierName,
      supplierContractName: encryptedSupplierContractName,
    } }));
    window.open(baseUrl + url, '_blank'); 
  }
  else if(menuItem.label.toLowerCase() === 'package type percentage') {
    const url = this.router.serializeUrl(this.router.createUrlTree([ '/supplierContractPackageTypePercentage'], { queryParams: {
      // SupplierContractID: rowItem.supplierContractID,
      //      ApplicableFrom:rowItem.validFrom,
      //      ApplicableTo:rowItem.validTo,
      //      supplierName:this.supplierName,
      //      supplierContractName:rowItem.supplierContractName,
      SupplierContractID: encryptedSupplierContractID,
      ApplicableFrom: encryptedApplicableFrom,
      ApplicableTo: encryptedApplicableTo,
      supplierName: encryptedSupplierName,
      supplierContractName: encryptedSupplierContractName,

    } }));
    window.open(baseUrl + url, '_blank'); 
  }

  else if(menuItem.label.toLowerCase() === 'package type percentage') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractCustomerPackageTypePercentage'], { queryParams: {
      // SupplierContractID: rowItem.supplierContractID,
      //      ApplicableFrom:rowItem.validFrom,
      //      ApplicableTo:rowItem.validTo,
      //      supplierName:this.supplierName,
      //      supplierContractName:rowItem.supplierContractName,
      SupplierContractID: encryptedSupplierContractID,
      ApplicableFrom: encryptedApplicableFrom,
      ApplicableTo: encryptedApplicableTo,
      supplierName: encryptedSupplierName,
      supplierContractName: encryptedSupplierContractName,

    } }));
    window.open(baseUrl + url, '_blank'); 
  }
  else if(menuItem.label.toLowerCase() === 'customer vehicle percentage') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractCustomerVehiclePercentage' ], { queryParams: {
      // SupplierContractID: rowItem.supplierContractID,
      // ApplicableFrom:rowItem.validFrom,
      // ApplicableTo:rowItem.validTo,
      // supplierName:this.supplierName,
      // supplierContractName:rowItem.supplierContractName,
      // supplierRateCardName:this.supplierRateCard_Name
      SupplierContractID: encryptedSupplierContractID,
      ApplicableFrom: encryptedApplicableFrom,
      ApplicableTo: encryptedApplicableTo,
      supplierName: encryptedSupplierName,
      supplierContractName: encryptedSupplierContractName,

    } }));

    {
      //    queryParams: {
      //      SupplierContractID: this.supplierContractID,
      //      ApplicableFrom:row.validFrom,
      //      ApplicableTo:row.validTo,
      //      supplierName:this.supplierName
      //    }
      //  });
      // }
    window.open(baseUrl + url, '_blank'); 
  }
}

else if(menuItem.label.toLowerCase() === 'vehicle percentage') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractVehiclePercentage'], { queryParams: {
    // SupplierContractID: rowItem.supplierContractID,
    //     ApplicableFrom:rowItem.validFrom,
    //     ApplicableTo:rowItem.validTo,
    //     supplierName:this.supplierName,
    //     supplierContractName:rowItem.supplierContractName,
    SupplierContractID: encryptedSupplierContractID,
    ApplicableFrom: encryptedApplicableFrom,
    ApplicableTo: encryptedApplicableTo,
    supplierName: encryptedSupplierName,
    supplierContractName: encryptedSupplierContractName,

  } }));
  window.open(baseUrl + url, '_blank'); 
}
else if(menuItem.label.toLowerCase() === 'percentage') {
  const url = this.router.serializeUrl(this.router.createUrlTree([ '/supplierContractPercentage'], { queryParams: {
    // SupplierContractID: rowItem.supplierContractID,
    // ApplicableFrom:rowItem.validFrom,
    // ApplicableTo:rowItem.validTo,
    // supplierName:this.supplierName,
    // supplierContractName:rowItem.supplierContractName,
    SupplierContractID: encryptedSupplierContractID,
    ApplicableFrom: encryptedApplicableFrom,
    ApplicableTo: encryptedApplicableTo,
    supplierName: encryptedSupplierName,
    supplierContractName: encryptedSupplierContractName,

  } }));
  window.open(baseUrl + url, '_blank'); 
}

else if(menuItem.label.toLowerCase() === 'cdc local transfer') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractCDCLocalTransfer'], { queryParams: {
   
    SupplierContractID: encryptedSupplierContractID,
    ApplicableFrom: encryptedApplicableFrom,
    ApplicableTo: encryptedApplicableTo,
    supplierName: encryptedSupplierName,
    supplierContractName: encryptedSupplierContractName,
    supplierRateCardName: encryptedSupplierRateCardName

  } }));
  window.open(baseUrl + url, '_blank'); 
}

else if(menuItem.label.toLowerCase() === 'cdc local on demand') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractCDCLocalOnDemand'], { queryParams: {
    // SupplierContractID: rowItem.supplierContractID,
    // ApplicableFrom:rowItem.validFrom,
    // ApplicableTo:rowItem.validTo,
    // supplierContractName:rowItem.supplierContractName,
    // supplierRateCardName: encryptedSupplierRateCardName
    SupplierContractID: encryptedSupplierContractID,
    ApplicableFrom: encryptedApplicableFrom,
    ApplicableTo: encryptedApplicableTo,
    supplierName: encryptedSupplierName,
    supplierContractName: encryptedSupplierContractName,
    supplierRateCardName: encryptedSupplierRateCardName

  } }));
  window.open(baseUrl + url, '_blank'); 
}
else if(menuItem.label.toLowerCase() === 'cdc long term rental') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractCDCLongTermRental'], { queryParams: {
    // SupplierContractID: rowItem.supplierContractID,
    // ApplicableFrom:rowItem.validFrom,
    // ApplicableTo:rowItem.validTo,
    // supplierContractName:rowItem.supplierContractName,
    // supplierRateCardName:this.supplierRateCard_Name
    SupplierContractID: encryptedSupplierContractID,
    ApplicableFrom: encryptedApplicableFrom,
    ApplicableTo: encryptedApplicableTo,
    supplierName: encryptedSupplierName,
    supplierContractName: encryptedSupplierContractName,
    supplierRateCardName: encryptedSupplierRateCardName

  } }));
  window.open(baseUrl + url, '_blank'); 
}
else if(menuItem.label.toLowerCase() === 'cdc outstation lumpsum trip') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractCDCOutStationLumpsumTrip'], { queryParams: {
    // SupplierContractID: rowItem.supplierContractID,
    //  ApplicableFrom:rowItem.validFrom,
    //  ApplicableTo:rowItem.validTo,
    //  supplierContractName:rowItem.supplierContractName,
    //  supplierRateCardName:this.supplierRateCard_Name
    SupplierContractID: encryptedSupplierContractID,
    ApplicableFrom: encryptedApplicableFrom,
    ApplicableTo: encryptedApplicableTo,
    supplierName: encryptedSupplierName,
    supplierContractName: encryptedSupplierContractName,
    supplierRateCardName: encryptedSupplierRateCardName

  } }));
  window.open(baseUrl + url, '_blank'); 
}
else if(menuItem.label.toLowerCase() === 'cdc local') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractCDCLocal'], { queryParams: {
    // SupplierContractID: rowItem.supplierContractID,
    //  ApplicableFrom:rowItem.validFrom,
    //  ApplicableTo:rowItem.validTo,
    //  supplierContractName:rowItem.supplierContractName,
    //  supplierRateCardName:this.supplierRateCard_Name
    SupplierContractID: encryptedSupplierContractID,
    ApplicableFrom: encryptedApplicableFrom,
    ApplicableTo: encryptedApplicableTo,
    supplierName: encryptedSupplierName,
    supplierContractName: encryptedSupplierContractName,
    supplierRateCardName: encryptedSupplierRateCardName
  } }));
  window.open(baseUrl + url, '_blank'); 
}
else if(menuItem.label.toLowerCase() === 'sdc self drive hourly limited') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractSDCSelfDriveHourlyLimited'], { queryParams: {
    // SupplierContractID: rowItem.supplierContractID,
    //  ApplicableFrom:rowItem.validFrom,
    //  ApplicableTo:rowItem.validTo,
    //  supplierContractName:rowItem.supplierContractName,
    //  supplierRateCardName:this.supplierRateCard_Name
    SupplierContractID: encryptedSupplierContractID,
    ApplicableFrom: encryptedApplicableFrom,
    ApplicableTo: encryptedApplicableTo,
    supplierName: encryptedSupplierName,
    supplierContractName: encryptedSupplierContractName,
    supplierRateCardName: encryptedSupplierRateCardName

  } }));
  window.open(baseUrl + url, '_blank'); 
}
else if(menuItem.label.toLowerCase() === 'sdc self drive hourly unlimited') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractSDCSelfDriveHourlyUnlimited'], { queryParams: {
    // SupplierContractID: rowItem.supplierContractID,
    //  ApplicableFrom:rowItem.validFrom,
    //  ApplicableTo:rowItem.validTo,
    //  supplierContractName:rowItem.supplierContractName,
    //  supplierRateCardName:this.supplierRateCard_Name
    SupplierContractID: encryptedSupplierContractID,
    ApplicableFrom: encryptedApplicableFrom,
    ApplicableTo: encryptedApplicableTo,
    supplierName: encryptedSupplierName,
    supplierContractName: encryptedSupplierContractName,
    supplierRateCardName: encryptedSupplierRateCardName

  } }));
  window.open(baseUrl + url, '_blank'); 
}
else if(menuItem.label.toLowerCase() === 'cdc local lumpsum') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractCDCLocalLumpsum'], { queryParams: {
    // SupplierContractID: rowItem.supplierContractID,
    //  ApplicableFrom:rowItem.validFrom,
    //  ApplicableTo:rowItem.validTo,
    //  supplierContractName:rowItem.supplierContractName,
    //  supplierRateCardName:this.supplierRateCard_Name
    SupplierContractID: encryptedSupplierContractID,
    ApplicableFrom: encryptedApplicableFrom,
    ApplicableTo: encryptedApplicableTo,
    supplierName: encryptedSupplierName,
    supplierContractName: encryptedSupplierContractName,
    supplierRateCardName: encryptedSupplierRateCardName

  } }));
  window.open(baseUrl + url, '_blank'); 
}
else if(menuItem.label.toLowerCase() === 'cdc outstation round trip') {
  const url = this.router.serializeUrl(this.router.createUrlTree([ '/supplierContractCDCOutStationRoundTrip'], { queryParams: {
    // SupplierContractID: rowItem.supplierContractID,
    //  ApplicableFrom:rowItem.validFrom,
    //  ApplicableTo:rowItem.validTo,
    //  supplierContractName:rowItem.supplierContractName,
    //  supplierRateCardName:this.supplierRateCard_Name
    SupplierContractID: encryptedSupplierContractID,
    ApplicableFrom: encryptedApplicableFrom,
    ApplicableTo: encryptedApplicableTo,
    supplierName: encryptedSupplierName,
    supplierContractName: encryptedSupplierContractName,
    supplierRateCardName: encryptedSupplierRateCardName

  } }));
  window.open(baseUrl + url, '_blank'); 
}
else if(menuItem.label.toLowerCase() === 'sdc self drive limited') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractSDCSelfDriveLimited'], { queryParams: {
    // SupplierContractID: rowItem.supplierContractID,
    //  ApplicableFrom:rowItem.validFrom,
    //  ApplicableTo:rowItem.validTo,
    //  supplierContractName:rowItem.supplierContractName,
    //  supplierRateCardName:this.supplierRateCard_Name
    SupplierContractID: encryptedSupplierContractID,
    ApplicableFrom: encryptedApplicableFrom,
    ApplicableTo: encryptedApplicableTo,
    supplierName: encryptedSupplierName,
    supplierContractName: encryptedSupplierContractName,
    supplierRateCardName: encryptedSupplierRateCardName

  } }));
  window.open(baseUrl + url, '_blank'); 
}
else if(menuItem.label.toLowerCase() === 'sdc self drive unlimited') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractSDCSelfDriveUnLimited'], { queryParams: {
    // SupplierContractID: rowItem.supplierContractID,
    //  ApplicableFrom:rowItem.validFrom,
    //  ApplicableTo:rowItem.validTo,
    //  supplierContractName:rowItem.supplierContractName,
    //  supplierRateCardName:this.supplierRateCard_Name
    SupplierContractID: encryptedSupplierContractID,
    ApplicableFrom: encryptedApplicableFrom,
    ApplicableTo: encryptedApplicableTo,
    supplierName: encryptedSupplierName,
    supplierContractName: encryptedSupplierContractName,
    supplierRateCardName: encryptedSupplierRateCardName
  } }));
  window.open(baseUrl + url, '_blank'); 
}
else if(menuItem.label.toLowerCase() === 'cdc outstation oneway trip') {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/supplierContractCDCOutStationOnewayTrip'], { queryParams: {
    // SupplierContractID: rowItem.supplierContractID,
    //  ApplicableFrom:rowItem.validFrom,
    //  ApplicableTo:rowItem.validTo,
    //  supplierContractName:rowItem.supplierContractName,
    //  supplierRateCardName:this.supplierRateCard_Name
    SupplierContractID: encryptedSupplierContractID,
    ApplicableFrom: encryptedApplicableFrom,
    ApplicableTo: encryptedApplicableTo,
    supplierName: encryptedSupplierName,
    supplierContractName: encryptedSupplierContractName,
    supplierRateCardName: encryptedSupplierRateCardName

  } }));
  window.open(baseUrl + url, '_blank'); 
}

}

//   supplierContractCustomerCityPercentage(row) {
   
//     this.supplierContractID = row.supplierContractID;
//    this.router.navigate([
//      '/supplierContractCustomerCityPercentage',       
    
//    ],{
//      queryParams: {
//        SupplierContractID: this.supplierContractID,
//        ApplicableFrom:row.validFrom,
//        ApplicableTo:row.validTo,
//        supplierName:this.supplierName
//      }
//    });
//  }

//  supplierContractCityPercentage(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractCityPercentage',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierName:this.supplierName
//    }
//  });
// }

// supplierConCusPackageTypePercentage(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractCustomerPackageTypePercentage',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierName:this.supplierName
//    }
//  });
// }

// supplierConPackageTypePercentage(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractPackageTypePercentage',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierName:this.supplierName
//    }
//  });
// }

// supplierConCusVehiclePercentage(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractCustomerVehiclePercentage',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierName:this.supplierName
//    }
//  });
// }

// supplierConVehiclePercentage(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractVehiclePercentage',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierName:this.supplierName
//    }
//  });
// }

// supplierContractPercentage(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractPercentage',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierName:this.supplierName
//    }
//  });
// }

// CDCOutStationLumpsumTrip(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractCDCOutStationLumpsumTrip',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierContractName:row.supplierContractName,
//      supplierRateCardName:this.supplierRateCard_Name
//    }
//  });
// }

// CDCLongTermRental(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractCDCLongTermRental',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierContractName:row.supplierContractName,
//      supplierRateCardName:this.supplierRateCard_Name
//    }
//  });
// }

// CDCLocalOnDemand(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractCDCLocalOnDemand',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierContractName:row.supplierContractName,
//      supplierRateCardName:this.supplierRateCard_Name
//    }
//  });
// }

// CDCLocalTransfer(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractCDCLocalTransfer',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierContractName:row.supplierContractName,
//      supplierRateCardName:this.supplierRateCard_Name
//    }
//  });
// }

// CDCLocal(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractCDCLocal',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierContractName:row.supplierContractName,
//      supplierRateCardName:this.supplierRateCard_Name
//    }
//  });
// }

// SDCSelfDriveHourlyLimited(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractSDCSelfDriveHourlyLimited',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierContractName:row.supplierContractName,
//      supplierRateCardName:this.supplierRateCard_Name
//    }
//  });
// }

// SDCSelfDriveHourlyUnlimited(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractSDCSelfDriveHourlyUnlimited',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierContractName:row.supplierContractName,
//      supplierRateCardName:this.supplierRateCard_Name
//    }
//  });
// }

// CDCOutstationRoundTrip(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractCDCOutStationRoundTrip',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierContractName:row.supplierContractName,
//      supplierRateCardName:this.supplierRateCard_Name
//    }
//  });
// }

// CDCOutstationOnewayTrip(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractCDCOutStationOnewayTrip',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierContractName:row.supplierContractName,
//      supplierRateCardName:this.supplierRateCard_Name
//    }
//  });
// }

// CDCLocalLumpsum(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractCDCLocalLumpsum',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierContractName:row.supplierContractName,
//      supplierRateCardName:this.supplierRateCard_Name
//    }
//  });
// }

// SDCSelfDriveLimited(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractSDCSelfDriveLimited',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierContractName:row.supplierContractName,
//      supplierRateCardName:this.supplierRateCard_Name
//    }
//  });
// }

// SDCSelfDriveUnlimited(row) {
   
//   this.supplierContractID = row.supplierContractID;
//  this.router.navigate([
//    '/supplierContractSDCSelfDriveUnLimited',       
  
//  ],{
//    queryParams: {
//      SupplierContractID: this.supplierContractID,
//      ApplicableFrom:row.validFrom,
//      ApplicableTo:row.validTo,
//      supplierContractName:row.supplierContractName,
//      supplierRateCardName:this.supplierRateCard_Name
//    }
//  });
// }

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
          if(this.MessageArray[0]=="SupplierContractCreate")
          {
            if(this.MessageArray[1]=="SupplierContractView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Supplier Contract Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractUpdate")
          {
            if(this.MessageArray[1]=="SupplierContractView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Contract Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractDelete")
          {
            if(this.MessageArray[1]=="SupplierContractView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Contract Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractAll")
          {
            if(this.MessageArray[1]=="SupplierContractView")
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
    this.supplierContractService.getTableDataSort(this.SearchContractID,
      this.SupplierContractName,
      this.SearchValidFrom,
      this.SearchValidTo,
      this.SearchApprovedBy,
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




