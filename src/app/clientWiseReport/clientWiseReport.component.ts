// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ClientWiseReportService } from './clientWiseReport.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClientWiseReportModel } from './clientWiseReport.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { Form, FormControl } from '@angular/forms';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
import moment from 'moment';
import { ModeOfPaymentDropDown } from '../modeOfPayment/modeOfPaymentDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntity/organizationalEntityDropDown.model';
import { SupplierTypeDropDownModel } from '../supplierType/supplierType.model';
import { SupplierDropDown } from '../supplier/supplierDropDown.model';
import { VehicleVehicleCategoryDropDown } from '../vehicle/vehicleVehicleCategoryDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
import { CustomerTypeDropDown } from '../customerType/customerTypeDropDown.model';
import { CustomerCustomerGroupDropDown } from '../customer/customerCustomerGroupDropDown.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { CustomerPersonDetailsDropDown } from '../passengerDetails/customerPersonDetailsDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import { VehicleCategoryDropDown } from '../vehicleCategory/vehicleCategoryDropDown.model';
import { MonthlyBusinessReportDropDown } from '../monthlyBusinessReport/monthlyBusinessReportDropDown.model';
import { MatRadioButton } from '@angular/material/radio';
@Component({
  standalone: false,
  selector: 'app-clientWiseReport',
  templateUrl: './clientWiseReport.component.html',
  styleUrls: ['./clientWiseReport.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ClientWiseReportComponent implements OnInit {
  displayedColumns = [
    'CustomerName',
    'VehicleCategory',
    'NumberOfCar',
    'FromDate',
    'City',
    'CustomerLocation',
  ];
  dataSource: ClientWiseReportModel[] | null;
  advanceTable: ClientWiseReportModel | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string = '';

  SearchYear = new FormControl({ value: '', disabled: true });
  showYear:boolean = false;

  SearchMonth = new FormControl({ value: '', disabled: true });
  showMonth:boolean = false;
  //SearchMonth: FormControl = new FormControl();
  public MonthNameList?: MonthlyBusinessReportDropDown[] = [];
  filteredMonthNameOptions: Observable<MonthlyBusinessReportDropDown[]>;

  SearchCustomerName: FormControl = new FormControl();
  public CustomerNameList?: CustomerDropDown[] = [];
  filteredCustomerNameOptions: Observable<CustomerDropDown[]>;

  SearchCity: FormControl = new FormControl();
  public CityList?: CityDropDown[] = [];
  filteredCityOptions: Observable<CityDropDown[]>;

  SearchLocation : FormControl = new FormControl();
  public LocationList?: OrganizationalEntityDropDown[] = [];
  filteredLocationOptions: Observable<OrganizationalEntityDropDown[]>;

  SearchCarCategory: FormControl = new FormControl();
  public CarCategoryList?: VehicleCategoryDropDown[] = [];
  filteredCarCategoryOptions: Observable<VehicleCategoryDropDown[]>;

  SearchFromDate: string = '';
  SearchToDate: string = '';


  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutyRegisterService: ClientWiseReportService,
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
  ngOnInit() 
  {
    //this.loadData();
    this.InitMonth();
    this.InitCustomer();
    this.InitCities();
    this.InitLocation();
    this.InitCarCategory();
    //this.SubscribeUpdateService();
  }

  refresh() 
  {
    this.SearchCustomerName.setValue('');
    this.SearchCity.setValue('');
    this.SearchLocation.setValue('');
    this.SearchCarCategory.setValue('');
    this.SearchFromDate = '';
    this.SearchToDate = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    //this.loadData();
  }

  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }

  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

  onRadioChange(selectedValue: string)
  {
    if (selectedValue === 'year') 
    {
      this.SearchYear.enable();
      this.SearchMonth.disable();
      this.showYear = true;
      this.showMonth = false;
    } 
    else if (selectedValue === 'month') 
    {
      this.SearchMonth.enable();
      this.SearchYear.disable();
      this.showYear = false;
      this.showMonth = true;
      
    }
  }

  
  public loadData() 
  {
    if(this.SearchFromDate!=="")
    {
      this.SearchFromDate=moment(this.SearchFromDate).format('MMM DD yyyy');
    }
    if(this.SearchToDate!=="")
    {
      this.SearchToDate=moment(this.SearchToDate).format('MMM DD yyyy');
    }
    this.dutyRegisterService.getTableData(this.SearchYear.value,this.SearchMonth.value,this.SearchCustomerName.value,this.SearchCity.value,this.SearchLocation.value,
                          this.SearchCarCategory.value,this.SearchFromDate,this.SearchToDate,this.PageNumber).subscribe
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

  onContextMenu(event: MouseEvent, item: ClientWiseReportModel) 
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
    if (this.dataSource?.length>0) 
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
      this.loadData(); 
    } 
  }

  public SearchData()
  {
    this.loadData();    
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
    this.dutyRegisterService.getTableDataSort(this.SearchYear.value,this.SearchMonth.value,this.SearchCustomerName.value,this.SearchCity.value,this.SearchLocation.value,
                                  this.SearchCarCategory.value,this.SearchFromDate,this.SearchToDate,this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  //---------- Month ----------
  InitMonth()
  {
    this._generalService.getMonthYear().subscribe(
    data=>
    {
      this.MonthNameList = data;
      this.filteredMonthNameOptions = this.SearchMonth.valueChanges.pipe(
      startWith(""),
      map(value => this._filterMonth(value || ''))
      ); 
    });
  }
  private _filterMonth(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.MonthNameList.filter(
      data => 
      {
        return data.monthName.toLowerCase().includes(filterValue);
      });
  }

  //---------- Customer ----------
  InitCustomer()
  {
    this._generalService.getCustomer().subscribe(
    data=>
    {
      this.CustomerNameList = data;
      this.filteredCustomerNameOptions = this.SearchCustomerName.valueChanges.pipe(
      startWith(""),
      map(value => this._filterCustomer(value || ''))
      ); 
    });
  }
  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CustomerNameList.filter(
      data => 
      {
        return data.customerName.toLowerCase().includes(filterValue);
      });
  }

  //---------- City ----------
  InitCities()
  {
    this._generalService.GetCitiessAll().subscribe(
    data=>
    {
      this.CityList = data;
      this.filteredCityOptions = this.SearchCity.valueChanges.pipe(
      startWith(""),
      map(value => this._filterCity(value || ''))
      ); 
    });
  }
  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CityList.filter(
      data => 
      {
        return data.geoPointName.toLowerCase().includes(filterValue);
      });
  }

  //---------- Location ----------
  InitLocation()
  {
    this._generalService.GetLocationHub().subscribe(
    data=>
    {
      this.LocationList=data;
      this.filteredLocationOptions = this.SearchLocation.valueChanges.pipe(
      startWith(""),
      map(value => this._filterOrganizationalsEntity(value || ''))
      ); 
    });
  }
  private _filterOrganizationalsEntity(value: string): any {
  const filterValue = value.toLowerCase();
  if (!value || value.length < 3) {
      return [];   
    }
    return this.LocationList.filter(
    data => 
    {
      return data.organizationalEntityName.toLowerCase().includes(filterValue);
    });
  }

  //---------- Car Category ----------
  InitCarCategory()
  {
    this._generalService.GetVehicleCategories().subscribe(
    data=>
    {
      this.CarCategoryList = data;
      this.filteredCarCategoryOptions = this.SearchCarCategory.valueChanges.pipe(
      startWith(""),
      map(value => this._filterCarCategory(value || ''))
      ); 
    });
  }
  private _filterCarCategory(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.CarCategoryList.filter(
      data => 
      {
        return data.vehicleCategory.toLowerCase().includes(filterValue);
      });
  }  



  openSearchDialog() {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any) {
    SearchData();
    dialogRef.close();
  }

}




