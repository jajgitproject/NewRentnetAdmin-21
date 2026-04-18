// @ts-nocheck
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from '@angular/material/dialog';
import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';

import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { PrintDutySlip } from './PrintDutySlip.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PrintDutySlipService } from './PrintDutySlip.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { DutySlipAccentureService } from '../dutySlipAccenture/dutySlipAccenture.service';
import { ControlPanelDesignService } from '../controlPanelDesign/controlPanelDesign.service';
import { ControlPanelData } from '../controlPanelDesign/controlPanelDesign.model';
import moment from 'moment';


@Component({
  standalone: false,
  selector: 'app-PrintDutySlip',
  templateUrl: './PrintDutySlip.component.html',
  styleUrls: ['./PrintDutySlip.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class PrintDutySlipComponent {
  dataSource: any;
  dataSourceForInvoiceDuties: any[] = [];ReservationStatus: any;
  advanceTable: PrintDutySlip | null;
  ReservationID: number;
  DutySlipID: any;
  reservationInfo:any;
  totalDays: number;
  datetime: string;
  totalKms: void;
  
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public dutySlipAccentureService: DutySlipAccentureService,
    public _controlPanelDesignService: ControlPanelDesignService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
    ) { }
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
      });
    this.loadDataForReservation();
    this.loadData();
    }
  
    onNoClick(): void 
    {}

    public loadDataForReservation() 
    {
      this._controlPanelDesignService.getReservationDetails(this.ReservationID).subscribe(
      (data: ControlPanelData) => {
          this.reservationInfo = data?.reservationDetails;
          this.ReservationStatus = this.reservationInfo[0].reservationStatus;
        },
      (error: HttpErrorResponse) => {this.reservationInfo = null;});
    }

    public loadData() 
    {
      this.dutySlipAccentureService.printDutySlipInfo(this.DutySlipID).subscribe(
      data =>   
      {
        this.dataSource = data;
        console.log(this.dataSource);
        this.totalKms =  this.dataSource?.runningDetailsModels ?.reduce((sum: number, item: any) => sum + Number(item.distance || 0), 0);
        this.getTime();
      },
      (error: HttpErrorResponse) => { this.dataSource = null});
    }  
  
    getTime() 
    {
      // ------------LocationOutDateTime--------------
      var locOutTimeConversion = moment(this.dataSource.locationOutTime).format('HH:mm');
      var locOutDateConversion = moment(this.dataSource.locationOutDate).format('yyyy-MM-DD');
      var locationOutDateTime = locOutDateConversion + ' ' + locOutTimeConversion;
    
      // ------------PickupDateTime--------------
      var pickUpTimeConversion = moment(this.dataSource.pickUpTime).format('HH:mm');
      var pickUpDateConversion = moment(this.dataSource.pickUpDate).format('yyyy-MM-DD');
      var pickUpDateTime = pickUpDateConversion + ' ' + pickUpTimeConversion;
    
      // ------------DropoffDateTime--------------
      var dropOffTimeConversion = moment(this.dataSource.dropOffTime).format('HH:mm');
      var dropOffDateConversion = moment(this.dataSource.dropOffDate).format('yyyy-MM-DD');
      var dropOffDateTime = dropOffDateConversion + ' ' + dropOffTimeConversion;
    
      // ------------LocationInDateTime--------------
      var locInTimeConversion = moment(this.dataSource.locationInTime).format('HH:mm');
      var locInDateConversion = moment(this.dataSource.locationInDate).format('yyyy-MM-DD');
      var locInDateTime = locInDateConversion + ' ' + locInTimeConversion;
    
      // Calculate differences
      var diff3 = new Date(pickUpDateTime).getTime() - new Date(locationOutDateTime).getTime();
      var diff2 = new Date(dropOffDateTime).getTime() - new Date(pickUpDateTime).getTime();
      var diff1 = new Date(locInDateTime).getTime() - new Date(dropOffDateTime).getTime();
      
      var totalMilliseconds = diff1 + diff2 + diff3;
    
      // Convert to total minutes
      var totalMinutes = totalMilliseconds / (1000 * 60);
      this.totalDays = Math.ceil(totalMilliseconds/(1000 * 60 * 60 * 24));
    
      // Extract hours and minutes
      var hours = Math.floor(totalMinutes / 60);
      var minutes = Math.floor(totalMinutes % 60);
    
      // Combine hours and minutes in desired format
      this.datetime = hours + "." + minutes;
    }

    print() 
    {
      window.print();
    } 
  }
  
  


