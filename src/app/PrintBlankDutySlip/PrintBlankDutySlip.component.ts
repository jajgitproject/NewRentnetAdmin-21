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
    dataSourceForCalculate: any = { 
      totalRecivableAfterAdvace: 0,
      totalBasicAmount: 0,
      totalAmountAfterGST: 0,
      totalAmountAfterGSTInWords: ''
    };
  totalDays: number;
  
    constructor(
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
      public httpClient: HttpClient,
      public dialog: MatDialog,
      public route:ActivatedRoute,
      public dutySlipAccentureService: DutySlipAccentureService,
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
    });
      this.loadData();
    }
  
    onNoClick(): void 
    {
      // if (this.dialogRef) 
      // {
      //   this.dialogRef.close();
      // }
    }
  
    public loadData() 
    {
      this.dutySlipAccentureService.printDutySlipInfo(this.DutySlipID).subscribe(
      data =>   
      {
        this.dataSource = data;
        this.getTime()
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
  
  


