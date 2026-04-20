// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MonthlyBusinessReportService } from './monthlyBusinessReport.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MonthlyBusinessReport } from './monthlyBusinessReport.model';
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
import moment from 'moment';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MonthlyBusinessReportDropDown } from './monthlyBusinessReportDropDown.model';

//import { MessageTypeDropDown } from './messageTypeDropDown.model';
@Component({
  standalone: false,
  selector: 'app-monthlyBusinessReport',
  templateUrl: './monthlyBusinessReport.component.html',
  styleUrls: ['./monthlyBusinessReport.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class MonthlyBusinessReportComponent implements OnInit {
  displayedColumns = [
    'registrationNumber',
    'monthName',
    'numberOfDuties',
    'monthlyTarget',
    'monthlyAchievedTargetAmount',
    'achievementPercentage',
    'actions'
  ];
  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  public VehicleList?: VehicleDropDown[] = [];
  dataSource: MonthlyBusinessReport[] | null;
  monthlyBusinessReportID: number;
  advanceTable: MonthlyBusinessReport | null;
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;

  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  IC: any;
  inventory: FormControl = new FormControl();
  monthName: FormControl = new FormControl();
  selectedMonthYear: FormControl = new FormControl();
  SearchName: string = '';
  search: FormControl = new FormControl();

  SearchMessageType: string = '';
  messageType: FormControl = new FormControl();

  SearchRegistration: string = '';
  message: FormControl = new FormControl();

  SearchStartDate: string = '';
  startDate: FormControl = new FormControl();

  SearchEndDate: string = '';
  endDate: FormControl = new FormControl();
  inventoryMonthlyTargetAchievementID: any;
  inventoryID: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  regNo: any;
  searchSelectedMonth: number = 0;
   year: number = 0;
  monthYearList: { monthID:number, monthName: string; year: string }[] = [];
  filteredMonthYearOptions: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public route:ActivatedRoute,
    public monthlyBusinessReportService: MonthlyBusinessReportService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  @ViewChild('searchDialog') searchDialog: TemplateRef<any>;
@ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      // this.inventoryID=paramsData.InventoryID;
      // this.regNo=paramsData.RegNo;
      const encryptedInventoryID = paramsData.InventoryID;
      const encryptedRegNo = paramsData.RegNo;
      
      if (encryptedInventoryID && encryptedRegNo) {
        this.inventoryID = this._generalService.decrypt(decodeURIComponent(encryptedInventoryID));
        this.regNo = this._generalService.decrypt(decodeURIComponent(encryptedRegNo));
      }
      
      console.log(this.inventoryID, this.regNo);
      
    console.log(this.regNo)
    });
    this.initMonthYear();
    this.loadData();
  }

  refresh() {
    this.monthName.setValue(''),
    this.selectedMonthYear.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  public SearchData() {
    this.loadData();
  }

  public Filter() {
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

  public loadData() {
    if (!this.monthName || !this.monthName.value) {
      this.monthlyBusinessReportService.getTableData(
        this.inventoryID,
        0, // Default month
        0, // Default year
        this.SearchActivationStatus,
        this.PageNumber
      ).subscribe(
        data => {
          console.log(this.dataSource);
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching table data:', error);
          this.dataSource = null;
        }
      );
      return;
    }
  
    // Extract month and year from the monthName.value
    const [monthID, monthName, year] = this.monthName.value.split('-');
  
    // Convert month name to month number (1 to 12)
    const monthMap: { [key: string]: number } = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12
    };
    console.log(monthID);
    const monthNumber = monthMap[monthName] || 0; // Default to 0 if monthName is invalid
    const numericYear = +year || 0; // Default to 0 if year is invalid
  
    if (monthID === 0 || monthNumber === 0 || numericYear === 0) {
      console.warn('Invalid or missing month or year. Setting defaults:', { monthNumber, year: numericYear });
    }
  
    // Call the service with updated month and year values
    this.monthlyBusinessReportService.getTableData(
      this.inventoryID,
      monthID,
      numericYear,
      this.SearchActivationStatus,
      this.PageNumber
    ).subscribe(
      data => {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching table data:', error);
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
  onContextMenu(event: MouseEvent, item: MonthlyBusinessReport) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  // initmonthYear() {
  //   this._generalService.getMonthYear().subscribe(
  //     data => {
  //       this.monthYearList = data;
  //       this.filteredMonthYearOptions = this.monthName.valueChanges.pipe(
  //         startWith(""),
  //         map(value => this._filterVehicle(value || ''))
  //       );
  //     });
  // }
  // private _filterVehicle(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.monthYearList.filter(
  //     customer => {
  //       return customer.monthName.toLowerCase().includes(filterValue);
  //     }
  //   );
  // }

  initMonthYear() {
    this._generalService.getMonthYear().subscribe((data) => {
      this.monthYearList = data;
      this.filteredMonthYearOptions = this.selectedMonthYear.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterMonthYear(value || ''))
      );
    });
  }
  
  private _filterMonthYear(value: string): { monthID:number, monthName: string; year: string }[] {
    const filterValue = value.toLowerCase();
    return this.monthYearList.filter((option) => 
      option.monthName.toLowerCase().includes(filterValue) || 
      option.year.includes(filterValue)
    );
  }
  
  onSelectMonthYear(option: { monthID:number, monthName: string; year: string }) {
    this.monthName.setValue(`${option.monthID}-${option.monthName}-${option.year}`);
    this.selectedMonthYear.setValue(`${option.monthName}-${option.year}`);
  }
  
  NextCall() {
    if (this.dataSource.length > 0) {

      this.PageNumber++;
      //alert(this.PageNumber + 'mohit')
      this.loadData();
    }
    //alert([this.PageNumber])
  }
  PreviousCall() {

    if (this.PageNumber > 0) {
      this.PageNumber--;
      this.loadData();
    }
  }

  DailyBusinessReport(row) {
   this.inventoryID = row.inventoryID;
   this.router.navigate([
     '/dailyReport',       
    
   ],{
     queryParams: {
       InventoryID: this.inventoryID,
       RegNo:row.registrationNumber
     }
   });
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
  MessageArray: string[] = [];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe
      (
        message => {
          //message contains the data sent from service
          this.messageReceived = message.text;
          this.MessageArray = this.messageReceived.split(":");
          if (this.MessageArray.length == 3) {
            if (this.MessageArray[0] == "MonthlyBusinessReportCreate") {
              if (this.MessageArray[1] == "MonthlyBusinessReportView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Organizational Entity Message Created...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "MonthlyBusinessReportUpdate") {
              if (this.MessageArray[1] == "MonthlyBusinessReportView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Organizational Entity Message Updated...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "MonthlyBusinessReportDelete") {
              if (this.MessageArray[1] == "MonthlyBusinessReportView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Organizational Entity Message Deleted...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "MonthlyBusinessReportAll") {
              if (this.MessageArray[1] == "MonthlyBusinessReportView") {
                if (this.MessageArray[2] == "Failure") {
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
            else if (this.MessageArray[0] == "DataNotFound") {
              if (this.MessageArray[1] == "DuplicacyError") {
                if (this.MessageArray[2] == "Failure") {
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

  SortingData(coloumName: any) {
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    // if(this.SearchStartDate!==""){
    //   this.SearchStartDate=moment(this.SearchStartDate).format('MMM DD yyyy');
    // }
    // if(this.SearchEndDate!==""){
    //   this.SearchEndDate=moment(this.SearchEndDate).format('MMM DD yyyy');
    // } 
    this.monthlyBusinessReportService.getTableDataSort(
      this.inventoryID,
      this.monthName.value,
      this.year,
      this.SearchActivationStatus,
      this.PageNumber,
      coloumName.active,
      this.sortType).subscribe
      (
        data => {
          console.log(this.dataSource)
          this.dataSource = data;
        },
       
        (error: HttpErrorResponse) => { this.dataSource = null; }
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




