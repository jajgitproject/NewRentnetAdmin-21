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
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { DutySlipAccentureService } from '../dutySlipAccenture/dutySlipAccenture.service';
import { PrintBlankDutySlip } from './PrintBlankDutySlip.model';
import { ControlPanelDesignService } from '../controlPanelDesign/controlPanelDesign.service';
import { ControlPanelData } from '../controlPanelDesign/controlPanelDesign.model';
import moment from 'moment';

@Component({
  standalone: false,
  selector: 'app-PrintBlankDutySlip',
  templateUrl: './PrintBlankDutySlip.component.html',
  styleUrls: ['./PrintBlankDutySlip.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class PrintBlankDutySlipComponent {
  dataSource: any;
    dataSourceForInvoiceDuties: any[] = [];
    datetime: string;
    advanceTable:PrintBlankDutySlip | null;
    sortingData: number;
    sortType: string;
    search : FormControl = new FormControl();
    reservationID: number;
    vehicleName: any;
    DutySlipID: any;
    dialogTitle: string;
    reservationInfo: any;
    dataSourceForCalculate: any = { 
      totalRecivableAfterAdvace: 0,
      totalBasicAmount: 0,
      totalAmountAfterGST: 0,
      totalAmountAfterGSTInWords: ''
    };
  totalDays: number;
  blankOutTime = '';
  blankOutDate = '';
  blankReportingTime = '';
  blankReportingDate = '';
  
    constructor(
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
      public httpClient: HttpClient,
      public dialog: MatDialog,
      public route:ActivatedRoute,
      public dutySlipAccentureService: DutySlipAccentureService,
      public _controlPanelDesignService: ControlPanelDesignService,
      private snackBar: MatSnackBar,
      public _generalService: GeneralService
    ) {
     
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
      this.reservationID = paramsData.reservationID;
      this.loadDataForReservation();
      this.loadData();
    });
    }
  
    onNoClick(): void 
    {
      // if (this.dialogRef) 
      // {
      //   this.dialogRef.close();
      // }
    }
  
    public loadDataForReservation()
    {
      const reservationId = this.reservationID || this.dataSource?.reservationID;
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
        this.normalizePrintData(this.dataSource);
        this.refreshBlankOdometerDisplay();
        this.applyDropAddressFromReservation();
        if (!this.reservationID && this.dataSource?.reservationID) {
          this.reservationID = this.dataSource.reservationID;
          this.loadDataForReservation();
        }
      },
      (error: HttpErrorResponse) => { this.dataSource = null});
    }

    /** API may return camelCase or PascalCase (dates/times for blank slip print). */
    private normalizePrintData(data: any): void {
      if (!data) {
        return;
      }
      data.reservationID = data.reservationID ?? data.ReservationID;
      data.locationOutDate = data.locationOutDate ?? data.LocationOutDate;
      data.locationOutTime = data.locationOutTime ?? data.LocationOutTime;
      data.pickUpDate = data.pickUpDate ?? data.PickUpDate;
      data.pickUpTime = data.pickUpTime ?? data.PickUpTime;
      data.dropOffDate = data.dropOffDate ?? data.DropOffDate;
      data.dropOffTime = data.dropOffTime ?? data.DropOffTime;
      data.locationInDate = data.locationInDate ?? data.LocationInDate;
      data.locationInTime = data.locationInTime ?? data.LocationInTime;
    }

    /** Blank slip grid: only Out + Reporting schedule (per blank form layout); no kms or trip legs. */
    private refreshBlankOdometerDisplay(): void {
      this.blankOutTime = '';
      this.blankOutDate = '';
      this.blankReportingTime = '';
      this.blankReportingDate = '';
      if (!this.dataSource) {
        return;
      }
      this.blankOutTime = this.formatBlankDutySlipTime(
        this.dataSource.locationOutDate,
        this.dataSource.locationOutTime
      );
      this.blankOutDate = this.formatBlankDutySlipDate(this.dataSource.locationOutDate);
      this.blankReportingTime = this.formatBlankDutySlipTime(
        this.dataSource.pickUpDate,
        this.dataSource.pickUpTime
      );
      this.blankReportingDate = this.formatBlankDutySlipDate(this.dataSource.pickUpDate);
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
  
    formatBlankDutySlipTime(datePart: unknown, timePart: unknown): string {
      let combined = moment(timePart);
      if (!combined.isValid() || combined.year() < 2000) {
        const dateMoment = moment(datePart);
        const timeMoment = moment(timePart);
        if (!dateMoment.isValid() && !timeMoment.isValid()) {
          return '';
        }
        combined = dateMoment.isValid() ? dateMoment.clone() : moment().startOf('day');
        if (timeMoment.isValid()) {
          combined.hour(timeMoment.hour()).minute(timeMoment.minute()).second(0);
        }
      }
      return combined.isValid()
        ? combined.format('HH') + 'hrs' + combined.format('mm')
        : '';
    }

    formatBlankDutySlipDate(value: unknown): string {
      if (value == null || value === '') {
        return '';
      }
      const parsed = moment(value);
      return parsed.isValid() ? parsed.format('DD/MM/YYYY') : '';
    }

  print() 
  {
    window.print();
  }
  
 
  
  }
  
  


