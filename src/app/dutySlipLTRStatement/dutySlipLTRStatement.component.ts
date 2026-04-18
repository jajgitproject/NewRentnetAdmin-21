// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { MyUploadComponent } from '../myupload/myupload.component';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DutySlipLTRStatementModel, LTRDetailsModel } from './dutySlipLTRStatement.model';
import { DutySlipLTRStatementService } from './dutySlipLTRStatement.service';
import { ActivatedRoute } from '@angular/router';
import { TollParkingISTImagesComponent } from '../TollParkingISTImages/TollParkingISTImages.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { CityDropDown } from '../city/cityDropDown.model';
import moment from 'moment';
@Component({
  standalone: false,
  selector: 'app-dutySlipLTRStatement',
  templateUrl: './dutySlipLTRStatement.component.html',
  styleUrls: ['./dutySlipLTRStatement.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutySlipLTRStatementComponent implements OnInit {
  displayedColumns = [
    'EmployeeEntityName',
    'EmployeeEntityPhone',
    'EmployeeEntityEmail',
    'unlock'
  ];
  dataSource: DutySlipLTRStatementModel | null;
  dataSourceLoadData: DutySlipLTRStatementModel[] =[];
  dataSourceData: LTRDetailsModel[] =[];
  employeeID: number;
  row: DutySlipLTRStatementModel | null;
  SearchName: string = '';
  IsLockedOut:boolean=true;
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  userType:string='Employee';
  dialogRef: MatDialogRef<any>;
  ActiveStatus: any;
  last: any;
  employeeEntityPasswordID: number;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  DutySlipID: any;
  ReservationID: any;
  public dayDifferences: number[] = [];
  CustomerID: any;
  distanceDifference: number;
  hours: number;
  totalAmt: any;
  totalAmountControlName: string;
  advanceTable: DutySlipLTRStatementModel | null;
  advanceTableArray : DutySlipLTRStatementModel[] = [];
  holiday: boolean = false;
  uncheckedControls: { index: number, controls: { controlName: string, value: any }[] }[] = [];
  holidays: boolean[] = [];
  guestName: string;
  dataSaved: boolean = false;
  dataUpdated: boolean = false;
  ltrStatementID: any;
  changedControls: boolean[] = [false];
  editControls:boolean[]=[false];

  public CityList?: CityDropDown[] = [];
  filteredStartCityOptions: { [key: number]: Observable<CityDropDown[]> } = {};
  public CityEndList?: CityDropDown[] = [];
  filteredEndCityOptions: { [key: number]: Observable<CityDropDown[]> } = {};
  geoPointCityID: any;
  cityID: any;
  nightChargeable: boolean;
  additionalMinutes: number;
  nightChargeStartTime: Date;
  nightChargeEndTime: Date;
  graceMinutesForNightCharge: number;
  graceMinutesNightChargeAmount: number;
  PickupDate: any;
  PackageID: any;
  dutySlipLTRStatementID: any;
  public dayDifferences_1: number[] = [];
  GuestName: any;
  
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutySlipLTRStatementService: DutySlipLTRStatementService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    private fb: FormBuilder,
    public route:ActivatedRoute,
  ) 
  {
    this.advanceTableForm = this.createContactForm();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      this.DutySlipID   = paramsData.dutySlipID;
      this.ReservationID = paramsData.reservationID;
      this.CustomerID = paramsData.customerID;
      this.PickupDate = paramsData.pickupDate;
      this.PackageID = paramsData.packageID;
      this.GuestName = paramsData.guestName; 
    });
    this.loadDataForLTRAfterSave();
    this.SubscribeUpdateService();
    //this.loadDatesDiff();
    //this.loadTotalAmount();
    this.InitCitiesForStartCity();
    this.InitCitiesForEndCity();
    //this.loadDataForLTRAfterSave();
  }

  refresh() 
  {
    this.SearchName = '';
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadDataForLTRAfterSave();
    // this.loadData();
    // this.loadDatesDiff();
    // this.loadDateTimeKM();
    // this.loadKMHR();
    // this.loadTotalAmount();
  }

  showSaveButton(i:any)
  {
    if(this.dataSaved===true)
    {
      this.editControls[i]=true;
    }
    else{
      this.changedControls[i]=true;
    }
    
  }
  public SearchData() {
    //this.loadData();
    //this.SearchName = '';

  }
 
  public Filter() {
    this.PageNumber = 0;
    //this.loadData();
  }


  //---------- Duty Start Date ----------
  onStartDateChange(event: any,index:any): void {
    const inputElement = event.targetElement;
    if (inputElement)
    {
      this.onBlurStartDateUpdateDate({ target: inputElement,index});
    }
  }

  onBlurStartDateUpdateDate(event: { target: any; index: number }): void {
    //let value= this._generalService.resetDateiflessthan12(event.target.value);
    //let value = event.target.value;
    const { target, index } = event;
    const value = target.value;
    const controlName = `dutyStartDate${index}`;
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get(controlName)?.setValue(formattedDate);
    } 
    else 
    {
      this.advanceTableForm.get(controlName)?.setErrors({ invalidDate: true });
    }
    this.getDateTime(index);
  }

  //---------- End Start Date ----------
  onEndDateChange(event: any,index:any): void {
    const inputElement = event.targetElement;
    if (inputElement)
    {
      this.onBlurEndDateUpdateDate({ target: inputElement,index});
    }
  }

  onBlurEndDateUpdateDate(event: { target: any; index: number }): void {
    //let value= this._generalService.resetDateiflessthan12(event.target.value);
    //let value = event.target.value;
    const { target, index } = event;
    const value = target.value;
    const controlName = `dutyEndDate${index}`;
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get(controlName)?.setValue(formattedDate);
    } 
    else 
    {
      this.advanceTableForm.get(controlName)?.setErrors({ invalidDate: true });
    }
    this.getDateTime(index);
  }


  advanceTableForm:FormGroup = this.fb.group({
    dutySlipLTRStatementID:[],
    dutySlipID:[],
    reservationID:[],
    guestName:[],
    dutyStartCityID: [],
    dutyStartCity: [],
    dutyStartAddress: [],
    dutyStartDate:[],
    dutyStartTime:[],
    dutyStartKM:[],
    dutyEndCityID:[],
    dutyEndCity:[],
    dutyEndAddress:[],
    dutyEndDate:[],
    dutyEndTime:[],
    dutyEndKM:[],
    fkmP2P:[],
    additionalKM:[],
    totalKm:[],
    additionalMinutes:[],
    totalHours:[],
    packageKM:[],
    packageHours:[],
    packageBaseRate:[],
    extraKM:[],
    extraKMRate:[],
    extraKMAmount:[],
    extraHour:[],
    extraHourRate:[],
    fixedP2PAmount:[],
    extraHourAmount:[],
    totalToll:[],
    tollImages:[],
    totalParking:[],
    parkingImages:[],
    totalInterStateTax:[],
    interStateTaxImages:[],
    driverAllowanceRate:[],
    driverAllowanceAmount:[],
    nightChargeRate:[],
    nightChargeAmount:[],
    totalAmount:[],
    activationStatus:[],
    numberOfNights:[],
    numberOfDays:[],
    holiday:[],
    serialNumber:[]
  })

  onBackPress(event) 
  {
    if (event.keyCode === 8) 
    {
      ///this.loadData();
    }
  }

  onHolidayChange(index: number) {
    const isChecked = this.advanceTableForm.get('holiday' + index)?.value;
    const controlsToDisable = [
      `dutyStartCity${index}`, `dutyStartAddress${index}`, `dutyStartDate${index}`, `dutyStartTime${index}`, `dutyStartKM${index}`,
    `dutyEndCity${index}`, `dutyEndAddress${index}`, `dutyEndDate${index}`, `dutyEndTime${index}`, `dutyEndKM${index}`,`fkmP2P${index}`,`additionalKM${index}`,
    `totalKm${index}`, `additionalMinutes${index}`, `totalHours${index}`, `packageKM${index}`, `packageHours${index}`, `packageBaseRate${index}`,
    `extraKM${index}`, `extraKMRate${index}`, `fixedP2PAmount${index}`,`extraKMAmount${index}`, `extraHour${index}`, `extraHourRate${index}`,
    `extraHourAmount${index}`, `totalToll${index}`, `totalParking${index}`, `totalInterStateTax${index}`,
    `numberOfDays${index}`, `driverAllowanceRate${index}`,`driverAllowanceAmount${index}`,
    `numberOfNights${index}`,`nightChargeRate${index}`,`nightChargeAmount${index}`, `totalAmount${index}`, 
    `activationStatus${index}`, `tollImage${index}`,
    `parkingImages${index}`, `interStateTaxImages${index}`
    ];

    controlsToDisable.forEach(controlName => {
      if (isChecked) {
        this.advanceTableForm.get(controlName)?.disable();
      } else {
        this.advanceTableForm.get(controlName)?.enable();
      }
    });
  }


//   saveData() {
    
//     const formData = []; 
//     for (let i = 0; i < this.dayDifferences.length; i++) {
//         if (!this.advanceTableForm.get('holiday' + i)?.value) {
//           console.log(this.advanceTableForm.get(`dutyStartCityID${i}`)?.value,)
//             const rowData = {
//               dutySlipID: this.DutySlipID,
//               reservationID: this.ReservationID,
//               guestName: this.advanceTableForm.get(`guestName${i}`)?.value,
//               dutyStartCityID: this.advanceTableForm.get(`dutyStartCityID${i}`)?.value,
//               dutyStartCity: this.advanceTableForm.get(`dutyStartCity${i}`)?.value,
//               dutyStartAddress: this.advanceTableForm.get(`dutyStartAddress${i}`)?.value,
//               dutyStartDate: this.advanceTableForm.get(`dutyStartDate${i}`)?.value,
//               dutyStartTime: this.advanceTableForm.get(`dutyStartTime${i}`)?.value,
//               dutyStartKM: this.advanceTableForm.get(`dutyStartKM${i}`)?.value,
//               dutyEndCityID: this.advanceTableForm.get(`dutyEndCityID${i}`)?.value,
//               dutyEndCity: this.advanceTableForm.get(`dutyEndCity${i}`)?.value,
//               dutyEndAddress: this.advanceTableForm.get(`dutyEndAddress${i}`)?.value,
//               dutyEndDate: this.advanceTableForm.get(`dutyEndDate${i}`)?.value,
//               dutyEndTime: this.advanceTableForm.get(`dutyEndTime${i}`)?.value,
//               dutyEndKM: this.advanceTableForm.get(`dutyEndKM${i}`)?.value,
//               totalKm: this.advanceTableForm.get(`totalKm${i}`)?.value,
//               totalHours: this.advanceTableForm.get(`totalHours${i}`)?.value,
//               packageKM: this.advanceTableForm.get(`packageKM${i}`)?.value,
//               packageHours: this.advanceTableForm.get(`packageHours${i}`)?.value,
//               packageBaseRate: this.advanceTableForm.get(`packageBaseRate${i}`)?.value,
//               extraKM: this.advanceTableForm.get(`extraKM${i}`)?.value,
//               extraKMRate: this.advanceTableForm.get(`extraKMRate${i}`)?.value,
//               extraKMAmount: this.advanceTableForm.get(`extraKMAmount${i}`)?.value,
//               extraHour: this.advanceTableForm.get(`extraHour${i}`)?.value,
//               extraHourRate: this.advanceTableForm.get(`extraHourRate${i}`)?.value,
//               extraHourAmount: this.advanceTableForm.get(`extraHourAmount${i}`)?.value,
//               totalToll: this.advanceTableForm.get(`totalToll${i}`)?.value,
//               totalParking: this.advanceTableForm.get(`totalParking${i}`)?.value,
//               totalInterStateTax: this.advanceTableForm.get(`totalInterStateTax${i}`)?.value,
//               driverAllowanceAmount: this.advanceTableForm.get(`driverAllowanceAmount${i}`)?.value,
//               nightChargeAmount: this.advanceTableForm.get(`nightChargeAmount${i}`)?.value,
//               totalAmount: this.advanceTableForm.get(`totalAmount${i}`)?.value,
//               activationStatus: this.advanceTableForm.get(`activationStatus${i}`)?.value,
//               tollImages: this.advanceTableForm.get(`tollImages${i}`)?.value,
//               parkingImages: this.advanceTableForm.get(`parkingImages${i}`)?.value,
//               interStateTaxImages: this.advanceTableForm.get(`interStateTaxImages${i}`)?.value,
//           };
//           formData.push(rowData);
//       }
//     }

//     this.dutySlipLTRStatementService.add(formData).subscribe(
//         (response) => {
//           for (let i = 0; i < response.length; i++) {
//             this.ltrStatementID=response[i].dutySlipLTRStatementID;
//           }
//           this.dataSaved = true;
//           this._generalService.sendUpdate('DutySlipLTRStatementCreate:DutySlipLTRStatementView:Success');
//         },
//         (error) => {
//           this.dataSaved = false;
//           this._generalService.sendUpdate('DutySlipLTRStatementAll:DutySlipLTRStatementView:Failure');
//         }
//     );
// }


 normalizeData(data: any): any[] {
  const rowKeys = Object.keys(data).filter(key => key.endsWith('0')); // Keys for the first row
  const rowCount = rowKeys.length; // Number of rows
  const normalizedData: any[] = [];

  for (let i = 0; i < rowCount; i++) {
    const row: any = {};
    for (const key in data) {
      if (key.endsWith(i.toString())) {
        const baseKey = key.slice(0, -1); // Remove the index part
        row[baseKey] = data[key];
      }
    }
    normalizedData.push(row);
  }

  return normalizedData;
}


openDialog(rowIndex: number, dataForSingle: any) {
  // Normalize the data structure
  const normalizedData = this.normalizeData(dataForSingle.value);

  // Check if the rowIndex is valid
  if (rowIndex < 0 || rowIndex >= normalizedData.length) {
    console.error('Invalid row index:', rowIndex);
    return;
  }

  const selectedRow = normalizedData[rowIndex];
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: selectedRow, 
      index: rowIndex,
      DutySlipID:this.DutySlipID,
      ReservationID:this.ReservationID,
      CustomerID:this.CustomerID,
      PickupDate:this.PickupDate,
      PackageID:this.PackageID,
    },
  });
}

// saveData(rowIndex: number) {
//   if (!this.advanceTableForm.get('holiday' + rowIndex)?.value) {
//       const rowData: Partial<DutySlipLTRStatementModel> = {
//         dutySlipID: this.DutySlipID,
//         reservationID: this.ReservationID,
//         serialNumber:rowIndex,
//         isHoliday:this.advanceTableForm.get(`holiday${rowIndex}`)?.value,
//         guestName: this.advanceTableForm.get(`guestName${rowIndex}`)?.value,
//         dutyStartCityID: this.advanceTableForm.get(`dutyStartCityID${rowIndex}`)?.value,
//         dutyStartCity: this.advanceTableForm.get(`dutyStartCity${rowIndex}`)?.value,
//         dutyStartAddress: this.advanceTableForm.get(`dutyStartAddress${rowIndex}`)?.value,
//         dutyStartDate: this.advanceTableForm.get(`dutyStartDate${rowIndex}`)?.value,
//         dutyStartTime: this.advanceTableForm.get(`dutyStartTime${rowIndex}`)?.value,
//         dutyStartKM: this.advanceTableForm.get(`dutyStartKM${rowIndex}`)?.value,
//         dutyEndCityID: this.advanceTableForm.get(`dutyEndCityID${rowIndex}`)?.value,
//         dutyEndCity: this.advanceTableForm.get(`dutyEndCity${rowIndex}`)?.value,
//         dutyEndAddress: this.advanceTableForm.get(`dutyEndAddress${rowIndex}`)?.value,
//         dutyEndDate: this.advanceTableForm.get(`dutyEndDate${rowIndex}`)?.value,
//         dutyEndTime: this.advanceTableForm.get(`dutyEndTime${rowIndex}`)?.value,
//         dutyEndKM: this.advanceTableForm.get(`dutyEndKM${rowIndex}`)?.value,
//         fkmP2P: this.advanceTableForm.get(`fkmP2P${rowIndex}`)?.value,
//         additionalKM: this.advanceTableForm.get(`additionalKM${rowIndex}`)?.value,
//         totalKm: this.advanceTableForm.get(`totalKm${rowIndex}`)?.value,
//         additionalMinutes: this.advanceTableForm.get(`additionalMinutes${rowIndex}`)?.value,
//         totalHours: this.advanceTableForm.get(`totalHours${rowIndex}`)?.value,
//         packageKM: this.advanceTableForm.get(`packageKM${rowIndex}`)?.value,
//         packageHours: this.advanceTableForm.get(`packageHours${rowIndex}`)?.value,
//         packageBaseRate: this.advanceTableForm.get(`packageBaseRate${rowIndex}`)?.value,
//         extraKM: this.advanceTableForm.get(`extraKM${rowIndex}`)?.value,
//         extraKMRate: this.advanceTableForm.get(`extraKMRate${rowIndex}`)?.value,
//         fixedP2PAmount: this.advanceTableForm.get(`fixedP2PAmount${rowIndex}`)?.value,
//         extraKMAmount: this.advanceTableForm.get(`extraKMAmount${rowIndex}`)?.value,
//         extraHour: this.advanceTableForm.get(`extraHour${rowIndex}`)?.value,
//         extraHourRate: this.advanceTableForm.get(`extraHourRate${rowIndex}`)?.value,
//         extraHourAmount: this.advanceTableForm.get(`extraHourAmount${rowIndex}`)?.value,
//         totalToll: this.advanceTableForm.get(`totalToll${rowIndex}`)?.value,
//         totalParking: this.advanceTableForm.get(`totalParking${rowIndex}`)?.value,
//         totalInterStateTax: this.advanceTableForm.get(`totalInterStateTax${rowIndex}`)?.value,
//         numberOfDays: this.advanceTableForm.get(`numberOfDays${rowIndex}`)?.value,
//         driverAllowanceRate: this.advanceTableForm.get(`driverAllowanceRate${rowIndex}`)?.value,
//         driverAllowanceAmount: this.advanceTableForm.get(`driverAllowanceAmount${rowIndex}`)?.value,
//         numberOfNights: this.advanceTableForm.get(`numberOfNights${rowIndex}`)?.value,
//         nightChargeRate: this.advanceTableForm.get(`nightChargeRate${rowIndex}`)?.value,
//         nightChargeAmount: this.advanceTableForm.get(`nightChargeAmount${rowIndex}`)?.value,
//         totalAmount: this.advanceTableForm.get(`totalAmount${rowIndex}`)?.value,
//         activationStatus: this.advanceTableForm.get(`activationStatus${rowIndex}`)?.value,
//         tollImages: this.advanceTableForm.get(`tollImages${rowIndex}`)?.value,
//         parkingImages: this.advanceTableForm.get(`parkingImages${rowIndex}`)?.value,
//         interStateTaxImages: this.advanceTableForm.get(`interStateTaxImages${rowIndex}`)?.value
//       };

//       this.dutySlipLTRStatementService.add(rowData as DutySlipLTRStatementModel).subscribe(
//           (response) => {
//               this.ltrStatementID = response.dutySlipLTRStatementID;
//               this.dataSaved = true;
//               this.changedControls[rowIndex] = false;
//               this.editControls[rowIndex]=true;
//               this._generalService.sendUpdate('DutySlipLTRStatementCreate:DutySlipLTRStatementView:Success');
//           },
//           (error) => {
//               this.dataSaved = false;
//               this._generalService.sendUpdate('DutySlipLTRStatementAll:DutySlipLTRStatementView:Failure');
//           }
//       );
//   }
// }

updateData(rowIndex: number) 
{
  if (!this.advanceTableForm.get('holiday' + rowIndex)?.value) 
    {
      const rowData: Partial<DutySlipLTRStatementModel> = {
        dutySlipID: this.DutySlipID,
        reservationID: this.ReservationID,
        serialNumber:rowIndex,
        isHoliday:this.advanceTableForm.get(`holiday${rowIndex}`)?.value,
        guestName: this.advanceTableForm.get(`guestName${rowIndex}`)?.value,
        dutyStartCityID: this.advanceTableForm.get(`dutyStartCityID${rowIndex}`)?.value || this.dataSourceLoadData[rowIndex].dutyStartCityID,
        dutyStartCity: this.advanceTableForm.get(`dutyStartCity${rowIndex}`)?.value,
        dutyStartAddress: this.advanceTableForm.get(`dutyStartAddress${rowIndex}`)?.value,
        dutyStartDate: this.advanceTableForm.get(`dutyStartDate${rowIndex}`)?.value,
        dutyStartTime: this.advanceTableForm.get(`dutyStartTime${rowIndex}`)?.value,
        dutyStartKM: this.advanceTableForm.get(`dutyStartKM${rowIndex}`)?.value,
        dutyEndCityID: this.advanceTableForm.get(`dutyEndCityID${rowIndex}`)?.value,
        dutyEndCity: this.advanceTableForm.get(`dutyEndCity${rowIndex}`)?.value,
        dutyEndAddress: this.advanceTableForm.get(`dutyEndAddress${rowIndex}`)?.value,
        dutyEndDate: this.advanceTableForm.get(`dutyEndDate${rowIndex}`)?.value,
        dutyEndTime: this.advanceTableForm.get(`dutyEndTime${rowIndex}`)?.value,
        dutyEndKM: this.advanceTableForm.get(`dutyEndKM${rowIndex}`)?.value,
        fkmP2P: this.advanceTableForm.get(`fkmP2P${rowIndex}`)?.value,
        additionalKM: this.advanceTableForm.get(`additionalKM${rowIndex}`)?.value,
        totalKm: this.advanceTableForm.get(`totalKm${rowIndex}`)?.value,
        additionalMinutes: this.advanceTableForm.get(`additionalMinutes${rowIndex}`)?.value,
        totalHours: this.advanceTableForm.get(`totalHours${rowIndex}`)?.value,
        packageKM: this.advanceTableForm.get(`packageKM${rowIndex}`)?.value,
        packageHours: this.advanceTableForm.get(`packageHours${rowIndex}`)?.value,
        packageBaseRate: this.advanceTableForm.get(`packageBaseRate${rowIndex}`)?.value,
        extraKM: this.advanceTableForm.get(`extraKM${rowIndex}`)?.value,
        extraKMRate: this.advanceTableForm.get(`extraKMRate${rowIndex}`)?.value,
        extraKMAmount: this.advanceTableForm.get(`extraKMAmount${rowIndex}`)?.value,
        extraHour: this.advanceTableForm.get(`extraHour${rowIndex}`)?.value,
        extraHourRate: this.advanceTableForm.get(`extraHourRate${rowIndex}`)?.value,
        fixedP2PAmount: this.advanceTableForm.get(`fixedP2PAmount${rowIndex}`)?.value,
        extraHourAmount: this.advanceTableForm.get(`extraHourAmount${rowIndex}`)?.value,
        totalToll: this.advanceTableForm.get(`totalToll${rowIndex}`)?.value,
        totalParking: this.advanceTableForm.get(`totalParking${rowIndex}`)?.value,
        totalInterStateTax: this.advanceTableForm.get(`totalInterStateTax${rowIndex}`)?.value,
        numberOfDays: this.advanceTableForm.get(`numberOfDays${rowIndex}`)?.value,
        driverAllowanceRate: this.advanceTableForm.get(`driverAllowanceRate${rowIndex}`)?.value,
        driverAllowanceAmount: this.advanceTableForm.get(`driverAllowanceAmount${rowIndex}`)?.value,
        numberOfNights: this.advanceTableForm.get(`numberOfNights${rowIndex}`)?.value,
        nightChargeRate: this.advanceTableForm.get(`nightChargeRate${rowIndex}`)?.value,
        nightChargeAmount: this.advanceTableForm.get(`nightChargeAmount${rowIndex}`)?.value,
        totalAmount: this.advanceTableForm.get(`totalAmount${rowIndex}`)?.value,
        activationStatus: this.advanceTableForm.get(`activationStatus${rowIndex}`)?.value,
        tollImages: this.advanceTableForm.get(`tollImages${rowIndex}`)?.value,
        parkingImages: this.advanceTableForm.get(`parkingImages${rowIndex}`)?.value,
        interStateTaxImages: this.advanceTableForm.get(`interStateTaxImages${rowIndex}`)?.value,
        dutySlipLTRStatementID: this.dataSourceLoadData[rowIndex]?.dutySlipLTRStatementID,
        //dutySlipLTRStatementID: this.ltrStatementID
      };

      this.dutySlipLTRStatementService.update(rowData as DutySlipLTRStatementModel).subscribe(
          (response) => {
              this.ltrStatementID = response.dutySlipLTRStatementID;
              this.dataUpdated = true;
              this.changedControls[rowIndex] = false;
              this.editControls[rowIndex]=true;
              this._generalService.sendUpdate('DutySlipLTRStatementUpdate:DutySlipLTRStatementView:Success');
          },
          (error) => {
              this.dataUpdated = false;
              this._generalService.sendUpdate('DutySlipLTRStatementAll:DutySlipLTRStatementView:Failure');
          }
      );
  }
}



  public loadDatesDiff() {
    this.dutySlipLTRStatementService.getPickupDropoffDate(this.DutySlipID).subscribe(
      (data: any) => {
        const dropoffDate: Date = new Date(data.dropoffDate);
        const pickupDate: Date = new Date(data.pickupDate);
        const timeDifference: number = dropoffDate.getTime() - pickupDate.getTime(); 
        const days: number = timeDifference / (1000 * 3600 * 24) + 1;
        this.dayDifferences = Array.from({ length: days }, (_, i) => i + 1);
        //this.loadData();
        this.dayDifferences.forEach((_, i) => {
          this.advanceTableForm.addControl(`dutyStartCityID${i}`, new FormControl('', Validators.required));
          this.advanceTableForm.addControl(`dutyStartCity${i}`, new FormControl('', Validators.required));
          this.advanceTableForm.addControl(`holiday${i}`, new FormControl(false)); // Initialize checkbox as false
          this.advanceTableForm.addControl(`dutyStartAddress${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`dutyStartDate${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`dutyStartTime${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`dutyStartKM${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`dutyEndCityID${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`dutyEndCity${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`dutyEndAddress${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`dutyEndDate${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`dutyEndTime${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`dutyEndKM${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`fkmP2P${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`additionalKM${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`totalKm${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`additionalMinutes${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`totalHours${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`guestName${i}`, new FormControl(''));
  
          this.advanceTableForm.addControl(`packageKM${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`packageHours${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`packageBaseRate${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`extraKM${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`extraKMRate${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`extraKMAmount${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`extraHourRate${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`fixedP2PAmount${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`extraHourAmount${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`totalToll${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`extraHour${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`tollImages${i}`, new FormControl(null));
          this.advanceTableForm.addControl(`totalParking${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`parkingImages${i}`, new FormControl(null));
          this.advanceTableForm.addControl(`totalInterStateTax${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`interStateTaxImages${i}`, new FormControl(null));
          this.advanceTableForm.addControl(`numberOfDays${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`driverAllowanceRate${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`driverAllowanceAmount${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`numberOfNights${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`nightChargeRate${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`nightChargeAmount${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`totalAmount${i}`, new FormControl(''));
          this.advanceTableForm.addControl(`activationStatus${i}`, new FormControl(true));
        });
        
        //this.loadDataForLTRAfterSave();
        this.loadData();
        // const payload : DutySlipLTRStatementModel = {
        //   dayDifferences: days,
        //   dutySlipID: this.DutySlipID,
        //   reservationID: this.ReservationID,
        //   guestName: this.guestName,
        //   dutyStartCityID: 0,
        //   dutyStartCity: null,
        //   dutyStartAddress: null,
        //   dutyStartDate: null,
        //   dutyStartDateString: null,
        //   dutyStartTime: null,
        //   dutyStartTimeString: null,
        //   dutyStartKM: 0,
        //   dutyEndCityID: 0,
        //   dutyEndCity: null,
        //   dutyEndAddress: null,
        //   dutyEndDate: null,
        //   dutyEndTime: null,
        //   dutyEndDateString: null,
        //   dutyEndTimeString: null,
        //   dutyEndKM: 0,
        //   totalKm: 0,
        //   totalHours: 0,
        //   packageKM: 0,
        //   packageHours: 0,
        //   packageBaseRate: 0,
        //   extraKM: 0,
        //   extraKMRate: 0,
        //   extraKMAmount: 0,
        //   extraHour: 0,
        //   extraHourRate: 0,
        //   extraHourAmount: 0,
        //   totalToll: 0,
        //   tollImages: null,
        //   totalParking: 0,
        //   parkingImages: null,
        //   totalInterStateTax: 0,
        //   interStateTaxImages: null,
        //   driverAllowanceRate: 0,
        //   driverAllowanceAmount: 0,
        //   nightChargeRate: 0,
        //   nightChargeAmount: 0,
        //   totalAmount: 0,
        //   activationStatus: true,
        //   holiday: false,
        //   customerName: null,
        //   numberOfNights: 0,
        //   numberOfDays: 0,
        //   nightChargeable: false,
        //   fkmP2P: 0,
        //   fixedP2PAmount: 0,
        //   additionalKM: 0,
        //   additionalMinutes: 0,
        //   nightChargeStartTime: null,
        //   nightChargeEndTime: null,
        //   graceMinutesForNightCharge: 0,
        //   graceMinutesNightChargeAmount: 0,
        //   isHoliday: false,
        //   serialNumber: 0,
        //   dutySlipLTRStatementID: 0,
        //   pickupCity: '',
        //   pickupCityID: 0,
        //   pickupAddress: '',
        //   pickupDate: undefined,
        //   pickupTime: undefined,
        //   dropOffSpotID: 0,
        //   dropOffSpot: '',
        //   dropOffCity: '',
        //   dropOffCityID: 0,
        //   dropOffAddress: '',
        //   dropOffDate: undefined,
        //   dropOffTime: undefined,
        //   driverAllowance: 0,
        //   nightCharge: 0,
        //   extraHRRate: 0,
        //   dailyKM: 0,
        //   dailyHours: 0,
        //   totalDaysBaseRate: 0
        // };
        // if(this.dataSourceData)
        // {
        //   this.dutySlipLTRStatementService.add(payload).subscribe(
        //     (response) => {
        //         this.dataSaved = true;
        //         this._generalService.sendUpdate('DutySlipLTRStatementCreate:DutySlipLTRStatementView:Success');
        //     },
        //     (error) => {
        //         this.dataSaved = false;
        //         this._generalService.sendUpdate('DutySlipLTRStatementAll:DutySlipLTRStatementView:Failure');
        //     });
        // }
        
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    );
  }

public loadData() {
  this.dutySlipLTRStatementService.getLTRData(this.ReservationID).subscribe(
    (data: LTRDetailsModel[]) => {
      this.dataSourceData = data;
      let initialStartDate = new Date(this.dataSourceData[0].pickupDate);
      let dateString = initialStartDate.toLocaleDateString('en-GB'); // e.g., '27/11/2024'
      let dateParts = dateString.split('/');
      let formattedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`); // '2024-11-27'

      for (let i = 0; i < this.dayDifferences.length; i++) {
        const pickupCity = this.dataSourceData[0].pickupCity;
        const pickupAddress = this.dataSourceData[0].pickupAddress;
        let pickupDate: Date;

        if (i === 0) {
          pickupDate = formattedDate;
        } else {
          pickupDate = new Date(formattedDate); 
          pickupDate.setDate(formattedDate.getDate() + i);
        }
        
        const pickupTime = this.dataSourceData[0].pickupTime;
        const dropOffSpot = this.dataSourceData[0].dropOffSpot;
        const dropOffAddress = this.dataSourceData[0].dropOffAddress;
        //const dropOffDate = this.dataSourceData[0].dropOffDate;
        const dropOffTime = this.dataSourceData[0].dropOffTime;
        const pickupCityID = this.dataSourceData[0].pickupCityID;
        const dropOffSpotID = this.dataSourceData[0].dropOffSpotID;
        this.guestName = this.dataSourceData[0].customerName;
        if (!this.advanceTableForm.get(`dutyStartCityID${i}`)) {
          this.advanceTableForm.addControl(`dutyStartCityID${i}`, new FormControl(''));
        }
        if (!this.advanceTableForm.get(`dutyEndCityID${i}`)) {
          this.advanceTableForm.addControl(`dutyEndCityID${i}`, new FormControl(''));
        }
        if (!this.advanceTableForm.get(`guestName${i}`)) {
          this.advanceTableForm.addControl(`guestName${i}`, new FormControl(''));
        }

        this.advanceTableForm.patchValue({
          [`dutyStartCityID${i}`]: pickupCityID,
          [`dutyStartCity${i}`]: pickupCity,
          [`dutyStartAddress${i}`]: pickupAddress,
          [`dutyStartDate${i}`]: pickupDate.toISOString().split('T')[0],
          [`dutyStartTime${i}`]: pickupTime,
          [`dutyEndDate${i}`]:  pickupDate.toISOString().split('T')[0],
          [`dutyEndCityID${i}`]: dropOffSpotID,
          [`dutyEndCity${i}`]: dropOffSpot,
          [`dutyEndAddress${i}`]: dropOffAddress,
          [`dutyEndTime${i}`]: dropOffTime,
          [`guestName${i}`]: this.guestName
        });
      }

      const payload : DutySlipLTRStatementModel = {
          dayDifferences: this.dayDifferences.length,
          dutySlipID: this.DutySlipID,
          reservationID: this.ReservationID,
          guestName: this.guestName,
          dutyStartCityID: 0,
          dutyStartCity: null,
          dutyStartAddress: null,
          dutyStartDate: null,
          dutyStartDateString: null,
          dutyStartTime: null,
          dutyStartTimeString: null,
          dutyStartKM: 0,
          dutyEndCityID: 0,
          dutyEndCity: null,
          dutyEndAddress: null,
          dutyEndDate: null,
          dutyEndTime: null,
          dutyEndDateString: null,
          dutyEndTimeString: null,
          dutyEndKM: 0,
          totalKm: 0,
          totalHours: 0,
          packageKM: 0,
          packageHours: 0,
          packageBaseRate: 0,
          extraKM: 0,
          extraKMRate: 0,
          extraKMAmount: 0,
          extraHour: 0,
          extraHourRate: 0,
          extraHourAmount: 0,
          totalToll: 0,
          tollImages: null,
          totalParking: 0,
          parkingImages: null,
          totalInterStateTax: 0,
          interStateTaxImages: null,
          driverAllowanceRate: 0,
          driverAllowanceAmount: 0,
          nightChargeRate: 0,
          nightChargeAmount: 0,
          totalAmount: 0,
          activationStatus: true,
          holiday: false,
          customerName: null,
          numberOfNights: 0,
          numberOfDays: 0,
          nightChargeable: false,
          fkmP2P: 0,
          fixedP2PAmount: 0,
          additionalKM: 0,
          additionalMinutes: 0,
          nightChargeStartTime: null,
          nightChargeEndTime: null,
          graceMinutesForNightCharge: 0,
          graceMinutesNightChargeAmount: 0,
          isHoliday: false,
          serialNumber: 0,
          dutySlipLTRStatementID: 0,
          pickupCity: '',
          pickupCityID: 0,
          pickupAddress: '',
          pickupDate: undefined,
          pickupTime: undefined,
          dropOffSpotID: 0,
          dropOffSpot: '',
          dropOffCity: '',
          dropOffCityID: 0,
          dropOffAddress: '',
          dropOffDate: undefined,
          dropOffTime: undefined,
          driverAllowance: 0,
          nightCharge: 0,
          extraHRRate: 0,
          dailyKM: 0,
          dailyHours: 0,
          totalDaysBaseRate: 0
        };
        if(this.dataSourceData)
        {
          this.dutySlipLTRStatementService.add(payload).subscribe(
            (response) => {
                this.dataSaved = true;
                this._generalService.sendUpdate('DutySlipLTRStatementCreate:DutySlipLTRStatementView:Success');
            },
            (error) => {
                //this.dataSaved = false;
                this._generalService.sendUpdate('DutySlipLTRStatementAll:DutySlipLTRStatementView:Failure');
            });
        }
      //this.loadDataForDropOff();
      this.loadDateTimeKM();
      //this.loadDataForLTRAfterSave();
    },
    (error: HttpErrorResponse) => {
      this.dataSourceData = null;
    }
  );
}

getDateTime(i:any)
{
  //---------------- Start Date ----------------
  const dutyStartDate=this.advanceTableForm.get(`dutyStartDate${i}`)?.value;
  const ObjectSD = new Date(dutyStartDate);
  // Extract year, month, and day
  const yearSD = ObjectSD.getFullYear();
  const monthSD = String(ObjectSD.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const daySD = String(ObjectSD.getDate()).padStart(2, '0');
  const StartDate = `${yearSD}-${monthSD}-${daySD}`; // Format as YYYY-MM-DD

  //---------------- Start Time ----------------
  const dutyStartTime=this.advanceTableForm.get(`dutyStartTime${i}`)?.value;
  const ObjectST = new Date(dutyStartTime);
  const StartTime = ObjectST.toTimeString().split(' ')[0]; // Get the time part (HH:mm:ss)

  //---------------- End Date ----------------
  const dutyEndDate=this.advanceTableForm.get(`dutyEndDate${i}`)?.value;
  const ObjectED = new Date(dutyEndDate);
  // Extract year, month, and day
  const year = ObjectED.getFullYear();
  const month = String(ObjectED.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(ObjectED.getDate()).padStart(2, '0');
  const EndDate = `${year}-${month}-${day}`; // Format as YYYY-MM-DD

  //---------------- End Time ----------------
  const dutyEndTime=this.advanceTableForm.get(`dutyEndTime${i}`)?.value;
  const ObjectET = new Date(dutyEndTime);
  const EndTime = ObjectET.toTimeString().split(' ')[0]; // Get the time part (HH:mm:ss)
  const hoursET = ObjectET.getHours().toString().padStart(2, '0'); // Add leading zero if needed
  const minutesET = ObjectET.getMinutes().toString().padStart(2, '0');
  const ETHM = `${hoursET}:${minutesET}`;

  // const inputValue = event.target.value;
  //   const parsedTime = new Date(`1970-01-01T${inputValue}`);
  //   if (!isNaN(parsedTime.getTime())) 
  //   {
  //     const controlName = `dutyStartTime${i}`;
  //     console.log(controlName)
  //     this.advanceTableForm.get(controlName)?.setValue(parsedTime);
  //   }

  //---------------- Combine Date & Time ----------------
  const startDateTime = new Date(`${StartDate}T${StartTime}`);
  const endDateTime = new Date(`${EndDate}T${EndTime}`);

  //---------------- Date & Time Difference ----------------
  const timeDifferenceInMilliSec = endDateTime.getTime() - startDateTime.getTime(); // Time difference in milliseconds
  const timeDifferenceInHours = timeDifferenceInMilliSec / (1000 * 3600);// Time difference in hours
  const days = Math.floor(timeDifferenceInMilliSec / (1000 * 3600 * 24));

  // const additionalHours = this.additionalMinutes / 60;
  // const finalTotalHours = (timeDifferenceInHours * 60) + (additionalHours * 60)
  const additionalHours = this._generalService.convertMinutesToHours(this.additionalMinutes);
  const finalTotalHours = this._generalService.convertHoursToMinutes(timeDifferenceInHours) + this._generalService.convertMinutesToHours(additionalHours);
  //this.advanceTableForm.patchValue({[`totalHours${i}`]: Math.floor(timeDifferenceInHours + additionalHours)});
  this.advanceTableForm.patchValue({[`totalHours${i}`]: Math.floor(finalTotalHours)});

  //---------------- Night Charge Start Time ----------------
  const nightChargeStartTime=this.nightChargeStartTime;
  const objectNCST = new Date(nightChargeStartTime);
  const NCST = objectNCST.toTimeString().split(' ')[0]; // Get the time part (HH:mm:ss)
  // Extract only hours and minutes
  const hoursNCST = objectNCST.getHours().toString().padStart(2, '0');
  const minutesNCST = objectNCST.getMinutes().toString().padStart(2, '0');
  const NCSTHM = `${hoursNCST}:${minutesNCST}`;

  objectNCST.setMinutes(objectNCST.getMinutes() + this.graceMinutesForNightCharge);
  const GraceNCST = objectNCST.toTimeString().split(' ')[0];
  // Extract only hours and minutes
  const hoursGNCST = objectNCST.getHours().toString().padStart(2, '0');
  const minutesGNCST = objectNCST.getMinutes().toString().padStart(2, '0');
  const GraceNCSTHM = `${hoursGNCST}:${minutesGNCST}`;

    if(this.nightChargeable === true)
    {
      if(dutyStartDate === EndDate && ETHM <= NCSTHM)
      {
        this.advanceTableForm.patchValue({[`numberOfDays${i}`]: 1});
        this.advanceTableForm.patchValue({[`driverAllowanceAmount${i}`]: 1 * (this.advanceTableForm.get(`driverAllowanceRate${i}`)?.value)});
        this.advanceTableForm.patchValue({[`numberOfNights${i}`]: 0});
        this.advanceTableForm.patchValue({[`nightChargeRate${i}`]: 0});
        this.advanceTableForm.patchValue({[`nightChargeAmount${i}`]: 0});
        //this.advanceTableForm.patchValue({[`totalHours${i}`]: (timeDifferenceInHours + additionalHours).toFixed(1)});
        //this.advanceTableForm.patchValue({[`totalAmount${i}`]: (this.advanceTableForm.get(`driverAllowanceAmount${i}`)?.value) + (this.advanceTableForm.get(`nightChargeAmount${i}`)?.value)});
      }
      else if(dutyStartDate === EndDate && ETHM <= GraceNCSTHM)
      {
        this.advanceTableForm.patchValue({[`numberOfDays${i}`]: 1});
        this.advanceTableForm.patchValue({[`driverAllowanceAmount${i}`]: 1 * (this.advanceTableForm.get(`driverAllowanceRate${i}`)?.value)});
        this.advanceTableForm.patchValue({[`numberOfNights${i}`]: 0});
        this.advanceTableForm.patchValue({[`nightChargeRate${i}`]: 0});
        this.advanceTableForm.patchValue({[`nightChargeAmount${i}`]: this.graceMinutesNightChargeAmount});
        //this.advanceTableForm.patchValue({[`totalHours${i}`]: (timeDifferenceInHours + additionalHours).toFixed(1)});
        //this.advanceTableForm.patchValue({[`totalAmount${i}`]: (this.advanceTableForm.get(`driverAllowanceAmount${i}`)?.value) + (this.advanceTableForm.get(`nightChargeAmount${i}`)?.value)});
      }
      else if(dutyStartDate !== EndDate && ETHM > GraceNCSTHM)
      {
        this.advanceTableForm.patchValue({[`numberOfDays${i}`]: days + 1});
        this.advanceTableForm.patchValue({[`driverAllowanceAmount${i}`]: (days + 1 )* (this.advanceTableForm.get(`driverAllowanceRate${i}`)?.value)});
        this.advanceTableForm.patchValue({[`numberOfNights${i}`]: days + 1 });
        this.advanceTableForm.patchValue({[`nightChargeRate${i}`]: this.advanceTableForm.get(`nightChargeRate${i}`)?.value});
        this.advanceTableForm.patchValue({[`nightChargeAmount${i}`]: (days * (this.advanceTableForm.get(`nightChargeRate${i}`)?.value)) + this.advanceTableForm.get(`nightChargeRate${i}`)?.value});
        //this.advanceTableForm.patchValue({[`totalHours${i}`]: (timeDifferenceInHours + additionalHours).toFixed(1)});
        //this.advanceTableForm.patchValue({[`totalAmount${i}`]: (this.advanceTableForm.get(`driverAllowanceAmount${i}`)?.value) + (this.advanceTableForm.get(`nightChargeAmount${i}`)?.value)});
      }
      else if(dutyStartDate !== EndDate && ETHM <= NCSTHM)
      {
        this.advanceTableForm.patchValue({[`numberOfDays${i}`]: days + 1});
        this.advanceTableForm.patchValue({[`driverAllowanceAmount${i}`]: (days + 1) * (this.advanceTableForm.get(`driverAllowanceRate${i}`)?.value)});
        this.advanceTableForm.patchValue({[`numberOfNights${i}`]: days});
        this.advanceTableForm.patchValue({[`nightChargeRate${i}`]: this.advanceTableForm.get(`nightChargeRate${i}`)?.value});
        this.advanceTableForm.patchValue({[`nightChargeAmount${i}`]: days * (this.advanceTableForm.get(`nightChargeRate${i}`)?.value)});
        //this.advanceTableForm.patchValue({[`totalHours${i}`]: (timeDifferenceInHours + additionalHours).toFixed(1)});
        //this.advanceTableForm.patchValue({[`totalAmount${i}`]: (this.advanceTableForm.get(`driverAllowanceAmount${i}`)?.value) + (this.advanceTableForm.get(`nightChargeAmount${i}`)?.value)});
      }
      else
      {
        this.advanceTableForm.patchValue({[`numberOfDays${i}`]: days + 1});
        this.advanceTableForm.patchValue({[`driverAllowanceAmount${i}`]: (days + 1) * (this.advanceTableForm.get(`driverAllowanceRate${i}`)?.value)});
        this.advanceTableForm.patchValue({[`numberOfNights${i}`]: days});
        this.advanceTableForm.patchValue({[`nightChargeRate${i}`]: this.advanceTableForm.get(`nightChargeRate${i}`)?.value});
        this.advanceTableForm.patchValue({[`nightChargeAmount${i}`]: (days * (this.advanceTableForm.get(`nightChargeRate${i}`)?.value)) + this.graceMinutesNightChargeAmount});
        //this.advanceTableForm.patchValue({[`totalHours${i}`]: (timeDifferenceInHours + additionalHours).toFixed(1)});
        //this.advanceTableForm.patchValue({[`totalAmount${i}`]: (this.advanceTableForm.get(`driverAllowanceAmount${i}`)?.value) + (this.advanceTableForm.get(`nightChargeAmount${i}`)?.value)});
      }
    }
    else
    {
      if(dutyStartDate === EndDate)
        {
          this.advanceTableForm.patchValue({[`numberOfDays${i}`]: 1});
          this.advanceTableForm.patchValue({[`driverAllowanceAmount${i}`]: 1 * (this.advanceTableForm.get(`driverAllowanceRate${i}`)?.value)});
          this.advanceTableForm.patchValue({[`numberOfNights${i}`]: 0});
          this.advanceTableForm.patchValue({[`nightChargeRate${i}`]: 0});
          this.advanceTableForm.patchValue({[`nightChargeAmount${i}`]: 0});
          //this.advanceTableForm.patchValue({[`totalHours${i}`]: (timeDifferenceInHours + additionalHours).toFixed(1)});
          //this.advanceTableForm.patchValue({[`totalAmount${i}`]: (this.advanceTableForm.get(`driverAllowanceAmount${i}`)?.value) + (this.advanceTableForm.get(`nightChargeAmount${i}`)?.value)});
        }
        else
        {
          this.advanceTableForm.patchValue({[`numberOfDays${i}`]: days + 1});
          this.advanceTableForm.patchValue({[`driverAllowanceAmount${i}`]: (days + 1) * (this.advanceTableForm.get(`driverAllowanceRate${i}`)?.value)});
          this.advanceTableForm.patchValue({[`numberOfNights${i}`]: 0});
          this.advanceTableForm.patchValue({[`nightChargeRate${i}`]: 0});
          this.advanceTableForm.patchValue({[`nightChargeAmount${i}`]: 0});
          //this.advanceTableForm.patchValue({[`totalHours${i}`]: (timeDifferenceInHours + additionalHours).toFixed(1)});
          //this.advanceTableForm.patchValue({[`totalAmount${i}`]: (this.advanceTableForm.get(`driverAllowanceAmount${i}`)?.value) + (this.advanceTableForm.get(`nightChargeAmount${i}`)?.value)});
        }
    }
    this.onTotalTollParkingInterStateChange(i);
    //this.getTotalKMs(i);
    this.loadTotalAmount();
    this.loadDataForLTRAfterSave();
}

openTollImages()
{
  const dialogRef = this.dialog.open(TollParkingISTImagesComponent, 
    {
      width:'30%',
      height:'35%',
      data: 
        {
          ltrStatementID:this.ltrStatementID,
          action:'toll'
        }
    });
}

openParkingImages()
{
  const dialogRef = this.dialog.open(TollParkingISTImagesComponent, 
    {
      width:'30%',
      height:'35%',
      data: 
        {
          ltrStatementID:this.ltrStatementID,
          action:'parking'
        }
    });
}

openISTImages()
{
  const dialogRef = this.dialog.open(TollParkingISTImagesComponent, 
    {
      width:'30%',
      height:'35%',
      data: 
        {
          ltrStatementID:this.ltrStatementID,
          action:'ist'
        }
    });
}

public loadDataForDropOff() {
  this.dutySlipLTRStatementService.getLTRData(this.ReservationID).subscribe(
    (data: any) => {
      this.dataSourceLoadData = data;
      let initialEndDate = new Date(this.dataSourceLoadData[0].pickupDate);

      const formatDateToYYYYMMDD = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      for (let i = 0; i < this.dayDifferences.length; i++) {
        let dropOffDate: Date;

        if (i === 0) {
          dropOffDate=initialEndDate;
        } else {

          dropOffDate = new Date(initialEndDate); 
          dropOffDate.setDate(initialEndDate.getDate() + i); 
        }

        this.advanceTableForm.patchValue({
          [`dutyEndDate${i}`]:  formatDateToYYYYMMDD(dropOffDate),
        });
      }
      this.loadDateTimeKM();
    },
    (error: HttpErrorResponse) => {
      this.dataSource = null;
    }
  );
}


public loadDateTimeKM() {
  this.dutySlipLTRStatementService.getDateTimeKM(this.DutySlipID).subscribe(
      (data: any) => {
          const locationOutDate = new Date(data.locationOutDate);
          const locationOutTime = new Date(data.locationOutTime);
          //const locationOutKM = data.locationOutKM;
          const locationOutKM =0;
          const dropOffDate = new Date(data.dropOffDate);
          const dropOffTime = new Date(data.dropOffTime);
          //const dropOffKM = data.dropOffKM;
          const dropOffKM =0;

          const locoutDateTime = new Date(locationOutDate);
          locoutDateTime.setHours(locationOutTime.getHours());
          locoutDateTime.setMinutes(locationOutTime.getMinutes());

          const dropOffDateTime = new Date(dropOffDate);
          dropOffDateTime.setHours(dropOffTime.getHours());
          dropOffDateTime.setMinutes(dropOffTime.getMinutes());

          const additionalMinutes = this.advanceTableForm.get(`additionalMinutes`)?.value;

          const timeDifference = dropOffDateTime.getTime() - locoutDateTime.getTime();
          this.hours = Math.floor(timeDifference / (1000 * 60 * 60));
          const minutes = String(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
          this.distanceDifference = dropOffKM - locationOutKM;

          // Patch values for each day
          for (let i = 0; i < this.dayDifferences.length; i++) {
              this.advanceTableForm.patchValue({
                  [`dutyStartKM${i}`]: locationOutKM, // Bind to each row
                  [`dutyEndKM${i}`]: dropOffKM,       // Bind to each row
                  [`totalKm${i}`]: this.distanceDifference,
                  [`totalHours${i}`]: 0, // Bind to each row
                  //[`totalHours${i}`]: this.hours      // Bind to each row
              });
              // this.getTotalKMs(i);
          }
          this.loadKMHR();
      },
      (error: HttpErrorResponse) => { 
          console.error('Error loading date and time KM:', error);
          this.dataSource = null; 
      }
  );
}

getTotalKMs(i:any)
{
  if(this.dataSaved===true)
  {
    this.editControls[i]=true;
  }
  else
  {
    this.changedControls[i]=true;
  }
  
    const dutyStartKM=this.advanceTableForm.get(`dutyStartKM${i}`)?.value;
    const dutyEndKM=this.advanceTableForm.get(`dutyEndKM${i}`)?.value;
    const additionalKM=this.advanceTableForm.get(`additionalKM${i}`)?.value;
    const fkmP2P=this.advanceTableForm.get(`fkmP2P${i}`)?.value;

    this.distanceDifference=dutyEndKM - dutyStartKM + additionalKM + fkmP2P;
    this.advanceTableForm.patchValue({
      [`totalKm${i}`]: this.distanceDifference    // Bind to each row
  });

  this.loadKMHRS();
  //this.loadDataForLTRAfterSave();
  //this.loadKMHR();
  //this.getDateTime(i);
  //this.onTotalTollParkingInterStateChange(i);
  //this.loadTotalAmount();
}

public loadKMHRS() {
  this.dutySlipLTRStatementService.getKMHR(this.CustomerID,this.PackageID,this.PickupDate).subscribe(
      (data: any) => {
          this.dataSource = data;
          for (let i = 0; i < this.dayDifferences.length; i++) {
              const dailyKM = this.dataSource.dailyKM;
              const dailyHours = this.dataSource.dailyHours;
              //const extraHours = this.hours - dailyHours;
              const extraHours = this.advanceTableForm.get(`totalHours${i}`)?.value - dailyHours;
              const extraHourRate = this.dataSource.extraHRRate;
              const extraHourAmount = extraHours * extraHourRate;
              this.nightChargeable = this.dataSource.nightChargeable;
              this.additionalMinutes = this.dataSource.additionalMinutes;
              this.nightChargeStartTime = this.dataSource.nightChargeStartTime;
              this.nightChargeEndTime = this.dataSource.nightChargeEndTime;
              this.graceMinutesForNightCharge = this.dataSource.graceMinutesForNightCharge;
              this.graceMinutesNightChargeAmount = this.dataSource.graceMinutesNightChargeAmount;
              this.advanceTableForm.patchValue({
                  [`packageKM${i}`]: dailyKM,
                  [`packageHours${i}`]: dailyHours,
                  [`packageBaseRate${i}`]: this.dataSource.totalDaysBaseRate,
                  [`extraKMRate${i}`]: this.dataSource.extraKMRate,
                  [`extraHourRate${i}`]: this.dataSource.extraHRRate,
                  [`driverAllowanceRate${i}`]: this.dataSource.driverAllowance,
                  [`driverAllowanceAmount${i}`]: this.dataSource.driverAllowance,
                  //[`numberOfNights${i}`]: 0,
                  [`numberOfDays${i}`]: 1,
                  [`nightChargeRate${i}`]: this.dataSource.nightCharge,
                  //[`nightChargeAmount${i}`]: 0,
                  //[`nightChargeAmount${i}`]: this.dataSource.nightCharge,
                  [`extraKM${i}`]: Number(this.advanceTableForm.get(`totalKm${i}`)?.value) - dailyKM,
                  [`extraKMAmount${i}`]: (Number(this.advanceTableForm.get(`totalKm${i}`)?.value) - dailyKM) * this.dataSource.extraKMRate,
                  [`extraHour${i}`]: extraHours,
                  [`extraHourAmount${i}`]: extraHourAmount,
                  [`fkmP2P${i}`]: this.dataSource.fkmP2P,
                  [`fixedP2PAmount${i}`]: this.dataSource.fixedP2PAmount,
                  [`additionalKM${i}`]: this.dataSource.additionalKM,
                  [`additionalMinutes${i}`]: this.dataSource.additionalMinutes
              });
          }

          // After patching values, calculate total amount
          this.loadTotalAmount();
          //this.loadDataForLTRAfterSave();
      },
      (error: HttpErrorResponse) => {
          console.error('Error loading KM and HR:', error);
          this.dataSource = null; 
      }
  );
}

public loadKMHR() {
  this.dutySlipLTRStatementService.getKMHR(this.CustomerID,this.PackageID,this.PickupDate).subscribe(
      (data: any) => {
          this.dataSource = data;
          for (let i = 0; i < this.dayDifferences.length; i++) {
            this.getTotalKMs(i);
              const dailyKM = this.dataSource.dailyKM;
              const dailyHours = this.dataSource.dailyHours;
              const extraHours = this.hours - dailyHours;
              const extraHourRate = this.dataSource.extraHRRate;
              const extraHourAmount = extraHours * extraHourRate;
              this.nightChargeable = this.dataSource.nightChargeable;
              this.additionalMinutes = this.dataSource.additionalMinutes;
              this.nightChargeStartTime = this.dataSource.nightChargeStartTime;
              this.nightChargeEndTime = this.dataSource.nightChargeEndTime;
              this.graceMinutesForNightCharge = this.dataSource.graceMinutesForNightCharge;
              this.graceMinutesNightChargeAmount = this.dataSource.graceMinutesNightChargeAmount;
              this.advanceTableForm.patchValue({
                  [`packageKM${i}`]: dailyKM,
                  [`packageHours${i}`]: dailyHours,
                  [`packageBaseRate${i}`]: this.dataSource.totalDaysBaseRate,
                  [`extraKMRate${i}`]: this.dataSource.extraKMRate,
                  [`extraHourRate${i}`]: this.dataSource.extraHRRate,
                  [`driverAllowanceRate${i}`]: this.dataSource.driverAllowance,
                  [`driverAllowanceAmount${i}`]: this.dataSource.driverAllowance,
                  [`numberOfNights${i}`]: 0,
                  [`numberOfDays${i}`]: 1,
                  [`nightChargeRate${i}`]: this.dataSource.nightCharge,
                  [`nightChargeAmount${i}`]: 0,
                  //[`nightChargeAmount${i}`]: this.dataSource.nightCharge,
                  [`extraKM${i}`]: Number(this.advanceTableForm.get(`totalKm${i}`)?.value) - dailyKM,
                  [`extraKMAmount${i}`]: (Number(this.advanceTableForm.get(`totalKm${i}`)?.value) - dailyKM) * this.dataSource.extraKMRate,
                  [`extraHour${i}`]: extraHours,
                  [`extraHourAmount${i}`]: extraHourAmount,
                  [`fkmP2P${i}`]: this.dataSource.fkmP2P,
                  [`fixedP2PAmount${i}`]: this.dataSource.fixedP2PAmount,
                  [`additionalKM${i}`]: this.dataSource.additionalKM,
                  [`additionalMinutes${i}`]: this.dataSource.additionalMinutes
              });
          }

          // After patching values, calculate total amount
          this.loadTotalAmount();
          //this.loadDataForLTRAfterSave();
      },
      (error: HttpErrorResponse) => {
          console.error('Error loading KM and HR:', error);
          this.dataSource = null; 
      }
  );
}

loadTotalAmount() 
{
  for (let i = 0; i < this.dayDifferences.length; i++) 
    {
      const extraKMAmount = this.advanceTableForm.value[`extraKMAmount${i}`] || 0;
      const extraHourAmount = this.advanceTableForm.value[`extraHourAmount${i}`] || 0;
      const totalAmtForIndex = extraKMAmount + extraHourAmount;
      this.advanceTableForm.patchValue({ [`totalAmount${i}`]: totalAmtForIndex });
  }
}


  onTotalTollParkingInterStateChange(i: number) {
    if(this.dataSaved===true)
    {
      this.editControls[i]=true;
    }
    else{
      this.changedControls[i]=true;
    }
    
    const extraKMAmount = this.advanceTableForm.get(`extraKMAmount${i}`)?.value || 0;
    const extraHourAmount = this.advanceTableForm.get(`extraHourAmount${i}`)?.value || 0;
    
    const totaltoll = Number(this.advanceTableForm.get(`totalToll${i}`)?.value) || 0;
    const totalParking = Number(this.advanceTableForm.get(`totalParking${i}`)?.value) || 0;
    const totalIST = Number(this.advanceTableForm.get(`totalInterStateTax${i}`)?.value) || 0;

    const driverAllowanceAmount = Number(this.advanceTableForm.get(`driverAllowanceAmount${i}`)?.value) || 0;
    const nightChargeAmount = Number(this.advanceTableForm.get(`nightChargeAmount${i}`)?.value) || 0;

    const fixedP2PAmount = this.advanceTableForm.value[`fixedP2PAmount${i}`] || 0;

    const totalAmount = extraKMAmount + extraHourAmount + totaltoll + totalParking + totalIST + driverAllowanceAmount + nightChargeAmount + fixedP2PAmount;

    this.advanceTableForm.patchValue({
        [`totalAmount${i}`]: totalAmount
    });
    this.getDateTime(i);
}

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }


  onContextMenu(event: MouseEvent, item: DutySlipLTRStatementModel) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutySlipLTRStatementID:[],
      dutySlipID:[],
      reservationID:[],
      guestName:[],
      dutyStartCityID: [],
      dutyStartCity: [],
      dutyStartAddress: [],
      dutyStartDate:[],
      dutyStartTime:[],
      dutyStartKM:[],
      dutyEndCityID:[],
      dutyEndCity:[],
      dutyEndAddress:[],
      dutyEndDate:[],
      dutyEndTime:[],
      dutyEndKM:[],
      totalKm:[],
      fkmP2P:[],
      additionalKM:[],
      additionalMinutes:[],
      totalHours:[],
      packageKM:[],
      packageHours:[],
      packageBaseRate:[],
      extraKM:[],
      extraKMRate:[],
      extraKMAmount:[],
      extraHour:[],
      extraHourRate:[],
      fixedP2PAmount:[],
      extraHourAmount:[],
      totalToll:[],
      tollImages:[],
      totalParking:[],
      parkingImages:[],
      totalInterStateTax:[],
      interStateTaxImages:[],
      driverAllowanceRate:[],
      driverAllowanceAmount:[],
      nightChargeRate:[],
      nightChargeAmount:[],
      totalAmount:[],
      activationStatus:[], 
      numberOfNights:[],
      numberOfDays:[],
      holiday:[],
      serialNumber:[]
    });
  }
 

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string;
  public ImagePath1: string = "";
  public ImagePath2: string = "";

  public uploadFinishedTollImage = (event,i:any) => 
  {
    if(this.dataSaved===true)
    {
      this.editControls[i]=true;
    }
    else{
      this.changedControls[i]=true;
    }
    
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({
      [`tollImages${i}`]: this.ImagePath
  });
  }

  public uploadFinishedParkingImage = (event,i:any) => 
  {
    if(this.dataSaved===true)
    {
      this.editControls[i]=true;
    }
    else{
      this.changedControls[i]=true;
    }
    this.response = event;
    this.ImagePath1 = this._generalService.getImageURL() + this.response.dbPath;
    //this.advanceTableForm.patchValue({parkingImages:this.ImagePath1})
    this.advanceTableForm.patchValue({
      [`parkingImages${i}`]: this.ImagePath1
  });
  }

  public uploadFinishedInterStateTaxImages = (event,i:any) => 
  {
    if(this.dataSaved===true)
    {
      this.editControls[i]=true;
    }
    else{
      this.changedControls[i]=true;
    }
    this.response = event;
    this.ImagePath2 = this._generalService.getImageURL() + this.response.dbPath;
    //this.advanceTableForm.patchValue({interStateTaxImages:this.ImagePath2})
    this.advanceTableForm.patchValue({
      [`interStateTaxImages${i}`]: this.ImagePath2
  });
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
            if (this.MessageArray[0] == "DutySlipLTRStatementCreate") {
              if (this.MessageArray[1] == "DutySlipLTRStatementView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Duty Slip LTR Statement Created...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DutySlipLTRStatementUpdate") {
              if (this.MessageArray[1] == "DutySlipLTRStatementView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Duty Slip LTR Statement Updated...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DutySlipLTRStatement") {
              if (this.MessageArray[1] == "DutySlipLTRStatementView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Account unlocked successfully...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DutySlipLTRStatementAll") {
              if (this.MessageArray[1] == "DutySlipLTRStatementView") {
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


  onDateChange(rowIndex: number): void {
    if(this.dataSaved===true)
    {
      this.editControls[rowIndex]=true;
    }
    else{
      this.changedControls[rowIndex]=true;
    }
    
    let startDate:Date;
    startDate = this.advanceTableForm.get(`dutyStartDate${rowIndex}`)?.value;
    let startTime:Date;
    startTime=this.advanceTableForm.get(`dutyStartTime${rowIndex}`)?.value;

    let dropOffDate:Date;
    dropOffDate=this.advanceTableForm.get(`dutyEndDate${rowIndex}`)?.value;

    let dropOffTime:Date;
    dropOffTime=this.advanceTableForm.get(`dutyEndTime${rowIndex}`)?.value;
    if (startTime && startDate) {
      this.dataSource.dutyStartDateString = this._generalService.getTimeApplicable(startDate);
      this.dataSource.dutyStartTimeString = this._generalService.getTimeApplicable(startTime);
      
    }
    this.dataSource.dutyStartCityID=this.advanceTableForm.get(`dutyStartCityID${rowIndex}`)?.value;
    this.dataSource.dutyStartAddress=this.advanceTableForm.get(`dutyStartAddress${rowIndex}`)?.value;  
    this.dataSource.dutyStartKM=this.advanceTableForm.get(`dutyStartKM${rowIndex}`)?.value;
    

    this.dataSource.dutySlipID=this.DutySlipID;

    //const formattedDropOffTime=this.advanceTableForm.get(`dutyEndTime${rowIndex}`)?.value;
    if(dropOffDate && dropOffTime)
    {
      this.dataSource.dutyEndTimeString=this._generalService.getTimeApplicable(dropOffTime);
      this.dataSource.dutyEndDateString=this._generalService.getTimeApplicable(dropOffDate);
    }
    
    this.dataSource.dutyEndCityID=this.advanceTableForm.get(`dutyEndCityID${rowIndex}`)?.value;
    this.dataSource.dutyEndAddress=this.advanceTableForm.get(`dutyEndAddress${rowIndex}`)?.value;
    this.dataSource.dutyEndKM=this.advanceTableForm.get(`dutyEndKM${rowIndex}`)?.value;

    this.dutySlipLTRStatementService.getDataByDate(this.dataSource).subscribe(
        (data: DutySlipLTRStatementModel) => {
            if (data) {
              this.advanceTableForm.patchValue({
                    [`dutySlipLTRStatementID${rowIndex}`]: data.dutySlipLTRStatementID,
                    [`dutySlipID${rowIndex}`]: data.dutySlipID,
                    [`reservationID${rowIndex}`]: data.reservationID,
                    [`guestName${rowIndex}`]: data.guestName,
                    [`dutyStartCityID${rowIndex}`]: data.dutyStartCityID,
                    [`dutyStartCity${rowIndex}`]: data.dutyStartCity,
                    [`dutyStartAddress${rowIndex}`]: data.dutyStartAddress,
                    [`dutyStartDate${rowIndex}`]: data.dutyStartDate, 
                    [`dutyStartTime${rowIndex}`]: data.dutyStartTime,
                    [`dutyStartKM${rowIndex}`]: data.dutyStartKM,
                    [`dutyEndCityID${rowIndex}`]: data.dutyEndCityID,
                    [`dutyEndCity${rowIndex}`]: data.dutyEndCity,
                    [`dutyEndAddress${rowIndex}`]: data.dutyEndAddress,
                    [`dutyEndDate${rowIndex}`]: data.dutyEndDate,
                    [`dutyEndTime${rowIndex}`]: data.dutyEndTime,
                    [`dutyEndKM${rowIndex}`]: data.dutyEndKM,
                    [`totalKm${rowIndex}`]: data.totalKm,
                    [`additionalKM${rowIndex}`]: 0,
                    [`additionalMinutes${rowIndex}`]: 0,
                    [`fkmP2P${rowIndex}`]: 0,
                    [`fixedP2PAmount${rowIndex}`]: 0,
                    [`totalHours${rowIndex}`]: data.totalHours,
                    [`packageKM${rowIndex}`]: data.packageKM,
                    [`packageHours${rowIndex}`]: data.packageHours,
                    [`packageBaseRate${rowIndex}`]: data.packageBaseRate,
                    [`extraKM${rowIndex}`]: data.extraKM,
                    [`extraKMRate${rowIndex}`]: data.extraKMRate,
                    [`extraKMAmount${rowIndex}`]: data.extraKMAmount,
                    [`extraHour${rowIndex}`]: data.extraHour,
                    [`extraHourRate${rowIndex}`]: data.extraHourRate,
                    [`extraHourAmount${rowIndex}`]: data.extraHourAmount,
                    [`totalToll${rowIndex}`]: data.totalToll,
                    [`tollImages${rowIndex}`]: data.tollImages,
                    [`totalParking${rowIndex}`]: data.totalParking,
                    [`parkingImages${rowIndex}`]: data.parkingImages,
                    [`totalInterStateTax${rowIndex}`]: data.totalInterStateTax,
                    [`interStateTaxImages${rowIndex}`]: data.interStateTaxImages,
                    [`driverAllowanceRate${rowIndex}`]: data.driverAllowanceAmount,
                    [`driverAllowanceAmount${rowIndex}`]: data.driverAllowanceAmount,
                    [`numberOfNights${rowIndex}`]: 0,
                    [`numberOfDays${rowIndex}`]: 0,
                    [`nightChargeRate${rowIndex}`]: data.nightChargeAmount,
                    [`nightChargeAmount${rowIndex}`]: data.nightChargeAmount,
                    [`totalAmount${rowIndex}`]: data.totalAmount,
                    [`activationStatus${rowIndex}`]: data.activationStatus,
                });
            }
        },
        (error: HttpErrorResponse) => {
            console.error("Error fetching data for the selected date:", error);
        }
    );
}


//----------- City Drop Down For Start City-----------
InitCitiesForStartCity() {
  this._generalService.GetCitiessAll().subscribe(
    (data) => {
      this.CityList = data;
      for (let i = 0; i < this.dayDifferences.length; i++) 
      {
        const controlName = `dutyStartCity${i}`;
        this.filteredStartCityOptions[i] = this.advanceTableForm.controls[controlName]?.valueChanges.pipe(
          startWith(""),
          map((value) => this._filterCity(value || ""))
        );
      }
    },
    (error) => {
      console.error("Error fetching city data", error);
    }
  );
}

private _filterCity(value: string): any[] {
  const filterValue = value.toLowerCase();
  return this.CityList.filter((data) =>
    data.geoPointName?.toLowerCase().includes(filterValue)
  );
}

OnStartCitySelect(selectedStartCity: string,i:number)
{
  const StartCityName = this.CityList.find(
    data => data.geoPointName === selectedStartCity
  );
  if (selectedStartCity) 
  {
    this.getStartCityID(StartCityName.geoPointID,i);
  }
}

getStartCityID(geoPointID: any, i: number)
{
  this.cityID = geoPointID;
  console.log(this.cityID)
  this.advanceTableForm.patchValue({[`dutyStartCityID${i}`]: this.cityID || this.dataSourceLoadData[i].dutyStartCityID});
}


//----------- City Drop Down For End City-----------
InitCitiesForEndCity() 
{
  this._generalService.GetCitiessAll().subscribe(
    data => {
      this.CityEndList = data; 
      for (let i = 0; i < this.dayDifferences.length; i++) 
        {
          const controlName = `dutyEndCity${i}`;
          this.filteredEndCityOptions[i] = this.advanceTableForm.controls[controlName]?.valueChanges.pipe(
            startWith(""),
            map((value) => this._filterEndCity(value || ""))
          );
        }
    
    },
    error => {}
  );
}
private _filterEndCity(value: string): any {
  const filterValue = value.toLowerCase();
  return this.CityEndList.filter((data) =>
    data.geoPointName.toLowerCase().includes(filterValue));
}

OnEndCitySelect(selectedEndCity: string,i:number)
{
  const EndCityName = this.CityList.find(
    data => data.geoPointName === selectedEndCity
  );
  if (selectedEndCity) 
  {
    this.getEndCityID(EndCityName.geoPointID,i);
  }
}

getEndCityID(geoPointID: any, i:number) 
{
  this.cityID=geoPointID;
  console.log(this.cityID)
  this.advanceTableForm.patchValue({[`dutyEndCityID${i}`]: this.cityID || this.dataSourceLoadData[i].dutyEndCityID});
}

public loadDataForLTRAfterSave() 
{  
  this.dutySlipLTRStatementService.getLTRByIDsDate(this.ReservationID, this.DutySlipID).subscribe(
    (data: any[]) => {
      this.dataSourceLoadData = data;
      if(this.dataSourceLoadData === null)
      {
        this.loadDatesDiff();
        this.InitCitiesForStartCity();
        this.InitCitiesForEndCity();
      }
      else
      {
        this.loadDatesWithRowsDiff();
        this.InitCitiesForStartCity();
        this.InitCitiesForEndCity();
        
      }
    },
    (error: HttpErrorResponse) => {
      this.dataSourceLoadData = [];
    }
  );
}

public loadDatesWithRowsDiff() {
  this.dutySlipLTRStatementService.getPickupDropoffDate(this.DutySlipID).subscribe(
    (data: any) => {
      const dropoffDate: Date = new Date(data.dropoffDate);
      const pickupDate: Date = new Date(data.pickupDate);
      const timeDifference: number = dropoffDate.getTime() - pickupDate.getTime(); 
      const days: number = timeDifference / (1000 * 3600 * 24) + 1;
      this.dayDifferences = Array.from({ length: days }, (_, i) => i + 1);
      this.dayDifferences.forEach((_, i) => {
        this.advanceTableForm.addControl(`dutyStartCityID${i}`, new FormControl('', Validators.required));
        this.advanceTableForm.addControl(`dutyStartCity${i}`, new FormControl('', Validators.required));
        this.advanceTableForm.addControl(`holiday${i}`, new FormControl(false)); // Initialize checkbox as false
        this.advanceTableForm.addControl(`dutyStartAddress${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyStartDate${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyStartTime${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyStartKM${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyEndCityID${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyEndCity${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyEndAddress${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyEndDate${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyEndTime${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyEndKM${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`fkmP2P${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`additionalKM${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`totalKm${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`additionalMinutes${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`totalHours${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`guestName${i}`, new FormControl(''));

        this.advanceTableForm.addControl(`packageKM${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`packageHours${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`packageBaseRate${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`extraKM${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`extraKMRate${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`extraKMAmount${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`extraHourRate${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`fixedP2PAmount${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`extraHourAmount${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`totalToll${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`extraHour${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`tollImages${i}`, new FormControl(null));
        this.advanceTableForm.addControl(`totalParking${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`parkingImages${i}`, new FormControl(null));
        this.advanceTableForm.addControl(`totalInterStateTax${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`interStateTaxImages${i}`, new FormControl(null));
        this.advanceTableForm.addControl(`numberOfDays${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`driverAllowanceRate${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`driverAllowanceAmount${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`numberOfNights${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`nightChargeRate${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`nightChargeAmount${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`totalAmount${i}`, new FormControl(''));
        this.advanceTableForm.addControl(`activationStatus${i}`, new FormControl(true));
      });

      for (let i = 0; i < this.dayDifferences.length; i++) 
        { 
          this[`dutySlipLTRStatementID${i}`] = this.dataSourceLoadData[i].dutySlipLTRStatementID;
          this.advanceTableForm.patchValue({
            [`dutySlipLTRStatementID${i}`]: this.dataSourceLoadData[i].dutySlipLTRStatementID,
            [`dutySlipID${i}`]: this.dataSourceLoadData[i].dutySlipID,
            [`reservationID${i}`]: this.dataSourceLoadData[i].reservationID,
            [`guestName${i}`]: this.dataSourceLoadData[i].guestName,
            [`dutyStartCityID${i}`]: this.dataSourceLoadData[i].dutyStartCityID,
            [`dutyStartCity${i}`]: this.dataSourceLoadData[i].dutyStartCity,
            [`dutyStartAddress${i}`]: this.dataSourceLoadData[i].dutyStartAddress,
            [`dutyStartDate${i}`]: this.dataSourceLoadData[i].dutyStartDate,
            [`dutyStartTime${i}`]: this.dataSourceLoadData[i].dutyStartTime,
            [`dutyStartKM${i}`]: this.dataSourceLoadData[i].dutyStartKM,
            [`dutyEndCityID${i}`]: this.dataSourceLoadData[i].dutyEndCityID,
            [`dutyEndCity${i}`]: this.dataSourceLoadData[i].dutyEndCity,
            [`dutyEndAddress${i}`]: this.dataSourceLoadData[i].dutyEndAddress,
            [`dutyEndDate${i}`]: this.dataSourceLoadData[i].dutyEndDate,
            [`dutyEndTime${i}`]: this.dataSourceLoadData[i].dutyEndTime,
            [`dutyEndKM${i}`]: this.dataSourceLoadData[i].dutyEndKM,
            [`totalKm${i}`]: this.dataSourceLoadData[i].totalKm,
            [`additionalKM${i}`]: this.dataSourceLoadData[i].additionalKM,
            [`additionalMinutes${i}`]: this.dataSourceLoadData[i].additionalMinutes,
            [`fkmP2P${i}`]: this.dataSourceLoadData[i].fkmP2P,
            [`fixedP2PAmount${i}`]: this.dataSourceLoadData[i].fixedP2PAmount,
            [`totalHours${i}`]: this.dataSourceLoadData[i].totalHours,
            [`packageKM${i}`]: this.dataSourceLoadData[i].packageKM,
            [`packageHours${i}`]: this.dataSourceLoadData[i].packageHours,
            [`packageBaseRate${i}`]: this.dataSourceLoadData[i].packageBaseRate,
            [`extraKM${i}`]: this.dataSourceLoadData[i].extraKM,
            [`extraKMRate${i}`]: this.dataSourceLoadData[i].extraKMRate,
            [`extraKMAmount${i}`]: this.dataSourceLoadData[i].extraKMAmount,
            [`extraHour${i}`]: this.dataSourceLoadData[i].extraHour,
            [`extraHourRate${i}`]: this.dataSourceLoadData[i].extraHourRate,
            [`extraHourAmount${i}`]: this.dataSourceLoadData[i].extraHourAmount,
            [`totalToll${i}`]: this.dataSourceLoadData[i].totalToll,
            [`tollImages${i}`]: this.dataSourceLoadData[i].tollImages,
            [`totalParking${i}`]: this.dataSourceLoadData[i].totalParking,
            [`parkingImages${i}`]: this.dataSourceLoadData[i].parkingImages,
            [`totalInterStateTax${i}`]: this.dataSourceLoadData[i].totalInterStateTax,
            [`interStateTaxImages${i}`]: this.dataSourceLoadData[i].interStateTaxImages,
            [`driverAllowanceRate${i}`]: this.dataSourceLoadData[i].driverAllowanceAmount,
            [`driverAllowanceAmount${i}`]: this.dataSourceLoadData[i].driverAllowanceAmount,
            [`numberOfNights${i}`]: this.dataSourceLoadData[i].numberOfNights,
            [`numberOfDays${i}`]: this.dataSourceLoadData[i].numberOfDays,
            [`nightChargeRate${i}`]: this.dataSourceLoadData[i].nightChargeAmount,
            [`nightChargeAmount${i}`]: this.dataSourceLoadData[i].nightChargeAmount,
            [`totalAmount${i}`]: this.dataSourceLoadData[i].totalAmount,
            [`activationStatus${i}`]: this.dataSourceLoadData[i].activationStatus,
          });
          this.changedControls[i] = false;
          this.editControls[i] = true;
        };
    },
    (error: HttpErrorResponse) => {
      console.error(error.message);
    }
  );
}


}




