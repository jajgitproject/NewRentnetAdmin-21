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
import { DriverCarSupplierMIS } from './driverCarSupplierMIS.model';
import { DriverCarSupplierMISService } from './driverCarSupplierMIS.service';

interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}

@Component({
  standalone: false,
  selector: 'app-drivercarsuppliermis',
  templateUrl: './drivercarsuppliermis.component.html',
  styleUrls: ['./drivercarsuppliermis.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DriverCarSupplierMISComponent implements OnInit {

  displayedColumns = [
    'driverName',
    'driverFatherName',
    'bloodGroup',
    'localAddress',
    'mobile1',
    'location',
    'supplierType',
    'supplier',
    'aadharAuthenticationToken',
    // 'actions'
  ];
  columnTitleMap: { [key: string]: string } = {
    driverName: "Driver Name",
    FatherName: "Father Name",
    bloodGroup: "Blood Group",
    localAddress: "Address",
    mobile1: "Mobile No",
    supplierType:"Supplier Type",
    supplier: "Supplier",
    aadharAuthenticationToken: "Aadhar No",
    actions: "Actions"
  }

  carDisplayedColumns: string[] = ['registrationNumber', 'carLocation', 'vehicle', 'ownedSupplied', 'modelYear'];
  carColumnTitleMap: { [key: string]: string } = {
    registrationNumber: 'Car N0',
    carLocation: 'Location',
    vehicle: 'Car Type',
    ownedSupplied: 'Owned',
    modelYear: 'Car Make Year'
  };

  supplierDisplayedColumns: string[] = ['supplierName', 'supplierType', 'city', 'address', 'supplierRegistrationDate',];
supplierColumnTitleMap: { [key: string]: string } = {
  supplierName: 'Supplier Name',
  supplierType: 'Supplier Type',
  city: 'City',
  address: 'Address',
  supplierRegistrationDate: 'Creation Date',
  // closeDate: 'Close Date'
};

  dataSource: DriverCarSupplierMIS[] | null;
  carDataSource: any[] = [];
  driverID: number;
  advanceTable: DriverCarSupplierMIS | null;
  SearchdriverName: string = '';
  searchdriverFatherName: string = '';
  searchdriverGradeName: string = '';
  searchDriverCarSupplierMISOfficialIdentityNumber: string = '';
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
  public DriverCarSupplierMISGradeList?: DriverGradeDropDown[] = [];
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
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    public driverCarSupplierMiService: DriverCarSupplierMISService,
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
  }

  refresh() {
    // // this.driver.setvalue ('');
    // this.driver.setValue('');
    // this.locationHub.setValue('');
    // this.searchdateofjoiningfrom ='';
    // this.searchdateofjoiningto='';
    // this.supplierType.setValue('');
    // this.SearchActivationStatus = true;
    // this.PageNumber=0;
    this.onSearch();
  }

  onSearch(): void {
    if (this.selectedOption === 'driverData') {
      this.displayedColumns = [
        'driverName',
        'driverFatherName',
        'bloodGroup',
        'localAddress',
        'mobile1',
          'location',
          'supplierType',
          'supplier',
          'aadharAuthenticationToken',
      ];
      this.columnTitleMap = {
        driverName: "Driver Name",
        driverFatherName: "Father Name",
        bloodGroup: "Blood Group",
        localAddress: "Address",
        mobile1: "Mobile No",
        supplierType:"Supplier Type",
        supplier: "Supplier",
        aadharAuthenticationToken: "Aadhar No",
        actions: "Actions"
      };
      this.driverCarSupplierMiService.getTableData('', '', '', '', '', true, 0).subscribe(
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
        'carLocation',
        'vehicle',
        'ownedSupplied',
        'modelYear'
      ];
      this.columnTitleMap = {
        registrationNumber: 'Car No',
        carLocation: 'Location',
        vehicle: 'Car Type',
        ownedSupplied: 'Owned',
        modelYear: 'Car Make Year'
      };
      this.driverCarSupplierMiService.getTableData1('','','','','','','',true,0).subscribe(
        (res: any) => {
          this.dataSource = res;
          console.log(this.dataSource)
        },
      
        (error: HttpErrorResponse) => {
          console.error(error);
        }
       
      );
    } else if (this.selectedOption === 'supplierData') {
      this.displayedColumns = [
        'supplierName', 'supplierType', 'city', 'address', 'supplierRegistrationDate'
      ];
      this.columnTitleMap = {
        supplierName: 'Supplier Name',
          supplierType: 'Supplier Type',
          city: 'City',
          address: 'Address',
          supplierRegistrationDate: 'Creation Date',
      };
      this.driverCarSupplierMiService.getTableData3('', '', '', '', '', '', '', '', '', '', 0).subscribe(
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




