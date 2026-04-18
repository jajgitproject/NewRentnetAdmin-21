// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DriverCarChangesMISService } from './driverCarChangesMIS.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DriverCarChangesMISModel } from './driverCarChangesMIS.model';
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
  selector: 'app-driverCarChangesMIS',
  templateUrl: './driverCarChangesMIS.component.html',
  styleUrls: ['./driverCarChangesMIS.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DriverCarChangesMISComponent implements OnInit {
  displayedColumns = [
    'ReservationID',
    'DutySlipID',
    'DispatchLocation',
    'CustomerName',
    'CarNo',
    'DriverName',
    'Status',
    'PickupDate'
  ];
  dataSource: DriverCarChangesMISModel[] | null;
  advanceTable: DriverCarChangesMISModel | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string = '';

  SearchDispatchLocation: FormControl = new FormControl();
  public DispatchLocationList?: CityDropDown[] = [];
  filteredDispatchLocationOptions: Observable<CityDropDown[]>;

  SearchPickupFromDate: string = '';
  SearchPickupToDate: string = '';

  SearchAfterSMSCarChange:FormControl = new FormControl();
  SearchDriverCarChange:FormControl = new FormControl();

  SearchAllotmentStatus:string = 'Cancelled';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutyRegisterService: DriverCarChangesMISService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    this.loadData();
    this.InitDispatchLocation();
    //this.SubscribeUpdateService();
  }

  refresh() 
  {
    this.SearchDispatchLocation.setValue('');
    this.SearchPickupFromDate = '';
    this.SearchPickupToDate = '';
    this.SearchAfterSMSCarChange.setValue('');
    this.SearchDriverCarChange.setValue('');
    this.SearchAllotmentStatus = 'Cancelled';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
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
  
  public loadData() 
  {
    if(this.SearchPickupFromDate!=="")
    {
      this.SearchPickupFromDate=moment(this.SearchPickupFromDate).format('MMM DD yyyy');
    }
    if(this.SearchPickupToDate!=="")
    {
      this.SearchPickupToDate=moment(this.SearchPickupToDate).format('MMM DD yyyy');
    }
    this.dutyRegisterService.getTableData(this.SearchPickupFromDate,this.SearchPickupToDate,this.SearchDispatchLocation.value,this.SearchAfterSMSCarChange.value,this.SearchAllotmentStatus,this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data; 
        console.log(this.dataSource)       
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

  onContextMenu(event: MouseEvent, item: DriverCarChangesMISModel) 
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
    this.dutyRegisterService.getTableDataSort(this.SearchPickupFromDate,this.SearchPickupToDate,this.SearchDispatchLocation.value,this.SearchAfterSMSCarChange.value,this.SearchAllotmentStatus,this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  //---------- Dispatch Location ----------
  InitDispatchLocation()
  {
    this._generalService.GetCitiessAll().subscribe(
    data=>
    {
      this.DispatchLocationList = data;
      this.filteredDispatchLocationOptions = this.SearchDispatchLocation.valueChanges.pipe(
      startWith(""),
      map(value => this._filterDispatchLocation(value || ''))
      ); 
    });
  }
  private _filterDispatchLocation(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3)
    //  {
    //     return [];   
    //   }
    return this.DispatchLocationList.filter(
      data => 
      {
        return data.geoPointName.toLowerCase().includes(filterValue);
      });
  }

}




