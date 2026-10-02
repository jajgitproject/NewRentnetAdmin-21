// @ts-nocheck
import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../bank/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { FormControl } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { DutySlipAccentureModel } from './dutySlipAccenture.model';
import { DutySlipAccentureService } from './dutySlipAccenture.service';
import { ControlPanelDesignService } from '../controlPanelDesign/controlPanelDesign.service';
import { ControlPanelData } from '../controlPanelDesign/controlPanelDesign.model';
import moment from 'moment';


@Component({
  standalone: false,
  selector: 'app-dutySlipAccenture',
  templateUrl: './dutySlipAccenture.component.html',
  styleUrls: ['./dutySlipAccenture.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutySlipAccentureComponent {
  dataSource: DutySlipAccentureModel | null;
  advanceTable: DutySlipAccentureModel | null;
  vehicleName: any;
  DutySlipID: any;
  ReservationID: any;
  reservationInfo: any;
  dialogTitle: string;
  datetime: any;
  totalDays:any;

  constructor(
    @Optional() public dialogRef: MatDialogRef<DutySlipAccentureComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public dutySlipAccentureService: DutySlipAccentureService,
    public _controlPanelDesignService: ControlPanelDesignService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {
    //this.dialogTitle = 'Duty Slip For Accenture';
    //this.DutySlipID = data.dutySlipID;
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild('printSection', { static: false }) printSection: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() 
  {
    this.route.queryParams.subscribe(paramsData =>{
      this.DutySlipID = paramsData.dutySlipID;
      this.ReservationID = paramsData.reservationID;
      this.loadDataForReservation();
      this.loadData();
    });
  }

  onNoClick(): void 
  {
    if (this.dialogRef) 
    {
      this.dialogRef.close();
    }
  }

  public loadDataForReservation()
  {
    const reservationId = this.ReservationID || this.dataSource?.reservationID;
    if (!reservationId) {
      return;
    }
    this._controlPanelDesignService.getReservationDetails(reservationId).subscribe(
    (data: ControlPanelData) =>
    {
      this.reservationInfo = data?.reservationDetails;
      this.applyDropAddressFromReservation();
    },
    (error: HttpErrorResponse) => { this.reservationInfo = null; });
  }

  public loadData() 
  {
    this.dutySlipAccentureService.printDutySlipInfo(this.DutySlipID).subscribe(
    data =>   
    {
      this.dataSource = data;
      this.applyDropAddressFromReservation();
      if (!this.ReservationID && this.dataSource?.reservationID) {
        this.ReservationID = this.dataSource.reservationID;
        this.loadDataForReservation();
      }
      this.GetTimeDays(this.dataSource);
    },
    (error: HttpErrorResponse) => { this.dataSource = null});
  }

  getDropAddress(): string {
    return this.firstNonEmptyAddress(
      this.dataSource?.dropOffAddress,
      this.dataSource?.DropOffAddress,
      this.dataSource?.dropOffAddressDetails,
      this.dataSource?.DropOffAddressDetails,
      this.reservationInfo?.[0]?.drop?.dropOffAddress,
      this.reservationInfo?.[0]?.drop?.DropOffAddress,
      this.reservationInfo?.[0]?.drop?.dropOffAddressDetails,
      this.reservationInfo?.[0]?.drop?.DropOffAddressDetails,
      this.reservationInfo?.[0]?.dropOffAddress,
      this.reservationInfo?.[0]?.DropOffAddress
    );
  }

  private applyDropAddressFromReservation(): void {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.dropOffAddress = this.getDropAddress();
  }

  private firstNonEmptyAddress(...values: any[]): string {
    for (const value of values) {
      const text = (value ?? '').toString().trim();
      if (text) {
        return text;
      }
    }
    return '';
  }

 
  print() 
  {
    window.print();
  }

  GetTimeDays(dataSource:any) 
  {
    // ------------LocationOutDateTime--------------
    var locOutTimeConversion = moment(dataSource?.locationOutTime).format('HH:mm:ss');
    var locOutDateConversion = moment(dataSource?.locationOutDate).format('yyyy-MM-DD');
    var locationOutDateTime = locOutDateConversion + ' ' + locOutTimeConversion;
      
    // ------------PickupDateTime--------------
    var pickUpTimeConversion = moment(dataSource?.pickUpTime).format('HH:mm:ss');
    var pickUpDateConversion = moment(dataSource?.pickUpDate).format('yyyy-MM-DD');
    var pickUpDateTime = pickUpDateConversion + ' ' + pickUpTimeConversion;
     
    // ------------DropOffDateTime--------------
    var dropOffTimeConversion = moment(dataSource?.dropOffTime).format('HH:mm:ss');
    var dropOffDateConversion = moment(dataSource?.dropOffDate).format('yyyy-MM-DD');
    var dropOffDateTime = dropOffDateConversion + ' ' + dropOffTimeConversion;
      
    // ------------LocationInDateTime--------------
    var locInTimeConversion = moment(dataSource?.locationInTime).format('HH:mm:ss');
    var locInDateConversion = moment(dataSource?.locationInDate).format('yyyy-MM-DD');
    var locInDateTime = locInDateConversion + ' ' + locInTimeConversion;
      
    // Calculate Time 
    var time3 = new Date(pickUpDateTime).getTime() - new Date(locationOutDateTime).getTime();
    var time2 = new Date(dropOffDateTime).getTime() - new Date(pickUpDateTime).getTime();
    var time1 = new Date(locInDateTime).getTime() - new Date(dropOffDateTime).getTime();
      
    var totalMilliseconds = time1 + time2 + time3;
    
    // Convert to total minutes
    var totalMinutes = totalMilliseconds / (1000 * 60);
      
    // Extract hours and minutes
    var hours = Math.floor(totalMinutes / 60);
    var minutes = Math.floor(totalMinutes % 60);
     
    // Combine hours and minutes in desired format
    this.datetime = hours + "." + minutes;

    // Convert to Total days
    this.totalDays = Math.ceil(totalMilliseconds / (1000 * 60 * 60 * 24));
  }

}




