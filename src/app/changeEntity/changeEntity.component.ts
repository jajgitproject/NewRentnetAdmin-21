// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ChangeEntityService } from './changeEntity.service';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import moment from 'moment';
import { Router } from '@angular/router';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { RegistrationDropDown } from '../carPaidTaxMIS/registrationDropDown.model';
import { CreditNoteHistoryComponent } from '../creditnotehistory/creditnotehistory.component';
import { InvoiceBillingHistoryComponent } from '../invoiceBillingHistory/invoiceBillingHistory.component';
import { FormDialogCIComponent } from '../cancelInvoice/dialogs/form-dialog/form-dialog.component';
import Swal from 'sweetalert2';
import { ChangeEntityModel } from './changeEntity.model';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { PackageDropDown } from '../general/packageDropDown.model';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
import { MessageBoxFormDialogComponent } from './dialogs/form-dialog/form-dialog/form-dialog.component';
import { ChangePassengerDetailsComponent } from '../changePassenger/dialogs/changePassengerDetails/changePassengerDetails.component';
import { forkJoin } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-changeEntity',
  templateUrl: './changeEntity.component.html',
  styleUrls: ['./changeEntity.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ChangeEntityComponent implements OnInit {
  displayedColumns = [
    //'check',
    'actions',
    'ReservationID',
    'DutySlipID',
    'CustomerName',
    'CustomerGroup',
    'PackageType',
    'Package',
    'PickupCity',
    'VehicleCategory',
    'Vehicle',
    'PickupDate',
    'PickupTime',
    'PrimaryPassenger',
    'PrimaryBooker',
    'PickupAddress'
  ];

  dataSource: ChangeEntityModel[] | null;
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  dialogRef: MatDialogRef<any>;


  searchActivationStatus : boolean=true;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  advanceTableForm: any;
  

  searchCustomerGroup:string='';
  customerGroupID: any;
  public customerGroupList?: CustomerGroupDropDown[] = [];
  filteredOptions: Observable<CustomerGroupDropDown[]>;
  customerGroup : FormControl=new FormControl();

  searchCustomerName:string='';
  public CustomerList?:CustomerDropDown[]=[];
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  customer : FormControl=new FormControl();

  SearchFromDate: string = '';
  startDate : FormControl = new FormControl();

  SearchToDate: string = '';
  endDate : FormControl = new FormControl();

  SearchCity: string = '';
  public CityList?: CitiesDropDown[] = [];
  filteredCityOptions: Observable<CitiesDropDown[]>;
  city : FormControl=new FormControl();

  SearchVehicle: string = '';
  public VehicleList?: VehicleDropDown[] = [];
  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  vehicle : FormControl=new FormControl();

  SearchPackageType: string = '';
  public PackageTypeList?:PackageTypeDropDown[]=[]; 
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;
  packageType : FormControl=new FormControl();

  SearchPakcage: string = '';
  public PackageList?:PackageDropDown[]=[];
  filteredPackageOptions: Observable<PackageDropDown[]>;
  package : FormControl=new FormControl();

  searchReservationID:string = '';
  searchDutySlipID:string = '';
  
  selectAll:boolean=false;
  selectedEntity: any[] = [];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public invoiceHomeService: ChangeEntityService,
    private snackBar: MatSnackBar,
    public router:Router,
    public _generalService: GeneralService,
    public route: Router,
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    this.filteredCustomerOptions = of([]);
    //this.loadData();
    this.InitCustomerGroup();
    this.InitCities();
    this.InitVehicle();
    this.InitPackageType();
    this.InitPackage();
  }

  refresh() 
  {
    this.searchActivationStatus = true;
    this.PageNumber = 0;
    this.customerGroup.setValue('');
    this.customer.setValue('');
    this.city.setValue('');
    this.vehicle.setValue('');
    this.packageType.setValue('');
    this.package.setValue('');
    this.SearchFromDate = '';
    this.SearchToDate = '';
    this.searchReservationID = '';
    this.searchDutySlipID = '';    
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.customerGroupID = null;
    this.CustomerList = [];
    this.filteredCustomerOptions = of([]);
   // this.loadData();
  }

  public SearchData() 
  {
    this.PageNumber = 0;
    this.loadData();
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

  private buildSearchParams() {
    let searchFromDate = this.SearchFromDate;
    let searchToDate = this.SearchToDate;

    if (searchFromDate) {
      searchFromDate = moment(searchFromDate).format('YYYY-MM-DD');
      this.SearchFromDate = searchFromDate;
    } else {
      searchFromDate = null;
      this.SearchFromDate = '';
    }

    if (searchToDate) {
      searchToDate = moment(searchToDate).format('YYYY-MM-DD');
      this.SearchToDate = searchToDate;
    } else {
      searchToDate = null;
      this.SearchToDate = '';
    }

    let reservationIDs = null;
    if (this.searchReservationID && this.searchReservationID.trim() !== '') {
      reservationIDs = this.searchReservationID.split(/[\s,]+/).filter(x => x.trim() !== '').join(',');
    }

    let dutySlipIDs = null;
    if (this.searchDutySlipID && this.searchDutySlipID.trim() !== '') {
      dutySlipIDs = this.searchDutySlipID.split(/[\s,]+/).filter(x => x.trim() !== '').join(',');
    }

    const packageValue = this.package.value
      ? String(this.package.value).replace(/\//g, '-')
      : null;

    this.searchCustomerGroup = this.customerGroup.value || '';
    this.searchCustomerName = this.customer.value || '';
    this.SearchCity = this.city.value || '';
    this.SearchVehicle = this.vehicle.value || '';
    this.SearchPackageType = this.packageType.value || '';
    this.SearchPakcage = packageValue || '';

    return {
      customerGroup: this.customerGroup.value || null,
      customerName: this.customer.value || null,
      city: this.city.value || null,
      vehicle: this.vehicle.value || null,
      packageType: this.packageType.value || null,
      packageValue,
      searchFromDate,
      searchToDate,
      reservationIDs,
      dutySlipIDs,
    };
  }

  public loadData() 
  {
    const params = this.buildSearchParams();
    this.invoiceHomeService.getTableData(
      params.customerGroup,
      params.customerName,
      params.city,
      params.vehicle,
      params.packageType,
      params.packageValue,
      params.searchFromDate,
      params.searchToDate,
      params.reservationIDs,
      params.dutySlipIDs,
      this.searchActivationStatus,
      this.PageNumber
    ).subscribe(
    data => 
    {
      this.dataSource = data;
    },
    (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }

  SortingData(coloumName:any) 
  {
    if (this.sortingData == 1) 
    {
      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else 
    {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    const params = this.buildSearchParams();
    this.invoiceHomeService.getTableDataSort(
      params.customerGroup,
      params.customerName,
      params.city,
      params.vehicle,
      params.packageType,
      params.packageValue,
      params.searchFromDate,
      params.searchToDate,
      params.reservationIDs,
      params.dutySlipIDs,
      this.searchActivationStatus,
      this.PageNumber,
      coloumName.active,
      this.sortType
    ).subscribe
    (
      data =>   
      {
        this.dataSource = data;       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

    showNotification(colorName, text, placementFrom, placementAlign) 
    {
      this.snackBar.open(text, '', {
        duration: 2000,
        verticalPosition: placementFrom,
        horizontalPosition: placementAlign,
        panelClass: colorName
      });
    }

    onContextMenu(event: MouseEvent, item: ChangeEntityModel) 
    {
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }

    NextCall() 
    {
      if (this.dataSource.length > 0) 
      {
        this.PageNumber++;
        this.loadData();
      }
    }

    PreviousCall() 
    {
      if (this.PageNumber > 0) 
      {
        this.PageNumber--;
        this.loadData();
      }
    } 

  

    //---------- Customer Group ----------
    InitCustomerGroup()
    {
      this._generalService.getCustomerGroup().subscribe(
      data=>{
        this.customerGroupList=data;
        this.filteredOptions = this.customerGroup.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomerGroup(value || ''))
        );
      })
    }
    private _filterCustomerGroup(value: string): any {
      const filterValue = value.toLowerCase();
      if (!value || value.length < 3)
      {
          return [];   
        }
      return this.customerGroupList.filter(
        data => 
        {
          return data.customerGroup.toLowerCase().includes(filterValue);
        }
      );    
    };

    onCustomerGroupSelected(customerGroup: string) 
    {
      const selectedCustomerGroup = this.customerGroupList?.find(
        data => data.customerGroup === customerGroup
      );
      this.customer.setValue('');
      this.customerGroupID = selectedCustomerGroup?.customerGroupID ?? null;
      if (this.customerGroupID) {
        this.InitCustomer(this.customerGroupID);
      } else {
        this.CustomerList = [];
        this.filteredCustomerOptions = of([]);
      }
    }


    //---------- Customer ----------
    onKeyupCustomerName(event?: any) {
      if (this.customerGroupID) {
        return;
      }

      const prefix = ((event?.target?.value ?? this.customer?.value) || '').toString().trim();
      if (prefix.length < 3) {
        this.CustomerList = [];
        this.filteredCustomerOptions = of([]);
        return;
      }

      this._generalService.getCustomerForInvoice(prefix).subscribe(data => {
        this.CustomerList = data || [];
        this.filteredCustomerOptions = merge(of(prefix), this.customer.valueChanges).pipe(
          map(value => this._filterCustomer((value || '').toString()))
        );
      });
    }

    InitCustomer(customerGroupID?: number)
    {
      if (!customerGroupID) {
        this.CustomerList = [];
        this.filteredCustomerOptions = of([]);
        return;
      }

      this.customerGroupID = customerGroupID;
      this._generalService.GetCustomersForCP(customerGroupID).subscribe(
      data=>
      {
        this.CustomerList = data || [];
        this.filteredCustomerOptions = this.customer.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCustomer((value || '').toString()))
        ); 
      });
    }
    private _filterCustomer(value: string): any {
      const filterValue = value.toLowerCase();
      if (!this.customerGroupID && (!value || value.length < 3)) {
        return [];
      }
      if (!value) {
        return this.CustomerList || [];
      }
      return (this.CustomerList || []).filter(
        data => 
        {
          return data.customerName?.toLowerCase().includes(filterValue);
        }
      );
    }
    onCustomerSelected(customer: string) 
    {
      const selectedCustomer = this.CustomerList.find(
        data => data.customerName === customer);
    }
  

    //---------- City ----------
    InitCities()
    {
      this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList = data;
        this.filteredCityOptions = this.city.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        ); 
      });
    }
    private _filterCity(value: string): any {
      const filterValue = value.toLowerCase();
      return this.CityList.filter(
        data => 
        {
          return data.geoPointName.toLowerCase().includes(filterValue);
        }
      );
    }
    onCitySelected(CityName: string) 
    {
      const selectedCityName = this.CityList.find(
        data => data.geoPointName === CityName
      ); 
    }


    //---------- Vehicle ----------
    InitVehicle() 
    {
      this._generalService.GetVehicle().subscribe(
      data => 
      {
        this.VehicleList = data;
        this.filteredVehicleOptions = this.vehicle.valueChanges.pipe(
          startWith(''),
          map(value => this._filterVehicle(value || ''))
        );
      });
    }  
    private _filterVehicle(value: string): any {
      const filterValue = value.toLowerCase();
      return this.VehicleList.filter(
        data => 
        {
          return data.vehicle.toLowerCase().includes(filterValue);
        }
      );
    }
    onVehicleSelected(VehicleName: string) 
    {
      const selectedVehicleName = this.VehicleList.find(
        data => data.vehicle === VehicleName
      ); 
    }


    //---------- Package Type ----------
    InitPackageType()
    {
      this._generalService.GetPackgeType().subscribe(
      data=>
      {
        this.PackageTypeList=data;
        this.filteredPackageTypeOptions = this.packageType.valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackageType(value || ''))
        ); 
      });
    }
    private _filterPackageType(value: string): any {
      const filterValue = value.toLowerCase();
      return this.PackageTypeList?.filter(
        data => 
        {
          return data.packageType.toLowerCase().indexOf(filterValue)===0;
        }
      );
    }
    onPackageTypeSelected(PackageTypeName: string) 
    {
      const selectedPackageTypeName = this.PackageTypeList.find(
        data => data.packageType === PackageTypeName
      ); 
    }


    //---------- Package ----------
    InitPackage()
    { 
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
      return this.PackageList?.filter(
        data => 
        {
          return data.package.toLowerCase().indexOf(filterValue)===0;
        }
      );
    }
    onPackageSelected(PackageName: string) 
    {
      const selectedPackageName = this.PackageList.find(
        data => data.package === PackageName
      ); 
    }


// UpdateEntity() {

//   if (!this.selectedEntity.length) {
//     Swal.fire({
//       title: 'Warning',
//       text: 'Please select at least one duty.',
//       icon: 'warning'
//     });
//     return;
//   }

//   const apiCalls = this.selectedEntity.map(row =>
//     this.invoiceHomeService.GetInvoiceGenerated(row.dutySlipID)
//   );

//   forkJoin(apiCalls).subscribe((responses: any[]) => {

//     // Collect duty slips where invoice generated
//     const generatedDutySlips = this.selectedEntity
//       .filter((row, index) => responses[index]?.result)
//       .map(row => row.dutySlipID);

//     // If any invoice generated found
//     if (generatedDutySlips.length > 0) {

//       Swal.fire({
//         title: 'Not Allowed',
//         html: `
//           Invoice already generated for Duty Slip(s): 
//           <b>${generatedDutySlips.join(', ')}</b>
//           <br><br>
//           Please deselect these duties and try again.
//         `,
//         icon: 'warning',
//         confirmButtonText: 'OK'
//       });

//       return;
//     }

//     // Existing process
//     Swal.fire({
//       title: 'Are you sure?',
//       text: 'Do you really want to update entities of all the selected duties?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes',
//       cancelButtonText: 'No'
//     }).then((result) => {

//       if (result.isConfirmed) {

//         const dialogRef = this.dialog.open(
//           MessageBoxFormDialogComponent,
//           {
//             width: '600px',
//             data: {
//               advanceTable: this.selectedEntity,
//               userID: this._generalService.getUserID()
//             }
//           }
//         );

//         dialogRef.afterClosed().subscribe((res: any) => {
//           if (res) {
//             this.loadData();
//           }
//         });
//       }
//     });

//   });
// }

// onCheckBox(isChecked: boolean, row: any) {

//   row.checked = isChecked;

//   if (isChecked) {
//     this.selectedEntity.push(row);
//   } else {
//     this.selectedEntity = this.selectedEntity.filter(
//       x => x.dutySlipID !== row.dutySlipID
//     );
//   }

//   console.log('selectedEntity', this.selectedEntity);
// }

// checkAll(isChecked: boolean) {

//   this.selectAll = isChecked;
//   this.selectedEntity = [];

//   this.dataSource.forEach(row => {
//     row.checked = isChecked;

//     if (isChecked) {
//       this.selectedEntity.push(row);
//     }
//   });

//   console.log('selectedEntity', this.selectedEntity);
// }
  // isIndeterminate() 
  // {
  //   const checkedCount = this.dataSource.filter(r => r.checked).length;
  //   return checkedCount > 0 && checkedCount < this.dataSource.length;
  // }
  
 OpenPassengerDetails(row:any) 
    {
      const dialogRef = this.dialog.open(ChangePassengerDetailsComponent, {
      width: '600px',
      data: 
        {         
          reservationID : row.reservationID,
        }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
      if (res) 
        {
          this.loadData();
        }
      });  
    }

    //--------------------------------------------------------------------

    changeEntity(row: any) {

  this.invoiceHomeService.GetInvoiceGenerated(row.dutySlipID)
    .subscribe((response: any) => {

      if (response.result) {

        Swal.fire({
          title: 'Not Allowed',
          text: `Invoice already generated for Duty Slip ${row.dutySlipID}`,
          icon: 'warning'
        });

        return;
      }

      Swal.fire({
        title: 'Confirmation',
        text: 'Do you really want to Change entity of the selected duty?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then(result => {

        if (!result.isConfirmed) {
          return;
        }

        this.openEntityDialog(row);

      });

    });

}
openEntityDialog(row: any) {

    const dialogRef = this.dialog.open(
      MessageBoxFormDialogComponent,
      {
        width: '600px',
        data: {
          advanceTable: [row],
          userID: this._generalService.getUserID()
        }
      });

    dialogRef.afterClosed().subscribe(res => {

      if (res) {
        this.loadData();
      }

    });

}

}




