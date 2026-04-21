// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router'
import { QualificationDropDown } from '../general/qualificationDropDown.model';
import { DriverGradeDropDown } from '../driverGrade/driverGradeDropDown.model';
import { SupplierTypeDropDownModel } from '../supplierType/supplierType.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import moment from 'moment';
import { DriverCarWithoutDutyMIS } from './driverCarWithoutDutyMIS.model';
import { DriverCarWithoutDutyMISService } from './driverCarWithoutDutyMIS.service';

interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}

@Component({
  standalone: false,
  selector: 'app-driverCarWithoutDutyMIS',
  templateUrl: './driverCarWithoutDutyMIS.component.html',
  styleUrls: ['./driverCarWithoutDutyMIS.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DriverCarWithoutDutyMISComponent implements OnInit {

  displayedColumns = [
    'driverName',
    'driverID',
    'location',
    'driverSupplierName',
    'driverOwnedSupplier'
  ];
  
  columnTitleMap: { [key: string]: string } = {
    driverName: "Driver Name",
    driverID: "Driver ID",
    location: "Location",
    driverSupplierName: "Supplier",
    driverOwnedSupplier: "Owned Supplier",
    actions: "Actions"
  }

  carDisplayedColumns: string[] = ['registrationNumber', 'vehicleCategory', 'location', 'vehicle', 'ownedSupplied', 'supplierName'];
  carColumnTitleMap: { [key: string]: string } = {
    registrationNumber: 'Car No',
    vehicleCategory: 'Category',
    location: 'Location',
    vehicle: 'Car Type',
    ownedSupplied: 'Owned',
    supplierName: 'Supplier Name'
  };

  dataSource: DriverCarWithoutDutyMIS[] | null;
  carDataSource: any[] = [];
  driverID: number;
  advanceTable: DriverCarWithoutDutyMIS | null;
  SearchdriverName: string = '';
  searchdriverFatherName: string = '';
  searchdriverGradeName: string = '';
  searchDriverCarWithoutDutyMISOfficialIdentityNumber: string = '';
  searchhighestQualification: string = '';
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  driverFatherName: FormControl = new FormControl();
  driverGrade: FormControl = new FormControl();
  idMark: FormControl = new FormControl();
  highestQualification: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  selectedOption: string = '';
  public DriverCarWithoutDutyMISGradeList?: DriverGradeDropDown[] = [];
  filteredGradeOptions: Observable<DriverGradeDropDown[]>;
  public QualificationList?: QualificationDropDown[] = [];

  public SupplierTypeList?: SupplierTypeDropDownModel[] = [];
  filteredSupplierTypeOptions: Observable<SupplierTypeDropDownModel[]>;
  filteredDriverOptions: Observable<DriverDropDown[]>;
  public DriverList?: DriverDropDown[] = [];
  searchDriverName: string = '';
  searchSupplierType: string = '';
  driver: FormControl = new FormControl();
  supplierType: FormControl = new FormControl();

  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
  locationHub: FormControl = new FormControl();
  searchdateofjoiningfrom: string = '';
  searchdateofjoiningto: string = '';
  searchPickupFromDate: string = '';
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    public driverCarWithoutDutyMISService: DriverCarWithoutDutyMISService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.onSearch();
    this.InitLocationHub();
  }

  refresh() {
    // // this.driver.setvalue ('');
    // this.driver.setValue('');
    this.searchPickupFromDate ='';
     this.locationHub.setValue('');
    // this.searchdateofjoiningto='';
    // this.supplierType.setValue('');
    // this.SearchActivationStatus = true;
    // this.PageNumber=0;
    this.onSearch();
  }

  InitLocationHub(){
    this._generalService.GetLocation().subscribe(
      data=>
      {
        this.OrganizationalEntitiesList=data;
      
        this.filteredOrganizationalEntityOptions = this.locationHub.valueChanges.pipe(
          startWith(""),
          map(value => this._filterOrganizationalsEntity(value || ''))
        ); 
      });
  }
  private _filterOrganizationalsEntity(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3)
    //  {
    //     return [];   
    //   }
    return this.OrganizationalEntitiesList.filter(
      customer => 
      {
        return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  onSearch(): void {
    if (this.searchPickupFromDate !== "") {
      this.searchPickupFromDate = moment(this.searchPickupFromDate).format('MMM DD yyyy');
    }
    
    if (this.selectedOption === 'driverData') {
      this.displayedColumns = [
        'driverName',
        'driverID',
        'location',
        'driverSupplierName',
        'driverOwnedSupplier'
      ];
      this.columnTitleMap = {
        driverName: "Driver Name",
        driverID: "Driver ID",
        location: "Location",
        driverSupplierName: "Supplier Name",
        driverOwnedSupplier: "Owned Supplier"
      };
      this.driverCarWithoutDutyMISService.getTableData1(this.searchPickupFromDate, this.locationHub.value, true, 0).subscribe(
        (res: any) => {
          this.dataSource = res;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    } else if (this.selectedOption === 'carData') {
      this.displayedColumns = [
        'registrationNumber',
        'vehicleCategory',
        'location',
        'vehicle',
        'ownedSupplied',
        'supplierName'
      ];
      this.columnTitleMap = {
        registrationNumber: 'Car No',
        vehicleCategory: 'Category',
        Location: 'Location',
        vehicle: 'Car Type',
        ownedSupplied: 'Owned',
        supplierName: 'Supplier Name'
      };
      this.driverCarWithoutDutyMISService.getTableData(this.searchPickupFromDate, this.locationHub.value, true, 0).subscribe(
        (res: any) => {
          this.dataSource = res;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    } else {
      console.warn('No option selected!');
    }
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
    
  }
  
}




