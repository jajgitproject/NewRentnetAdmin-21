// @ts-nocheck
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogCRAComponent } from './dialogs/form-dialog/form-dialog.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { CancelReservationAndAllotment } from './cancelReservationAndAllotment.model';
import { CancelReservationAndAllotmentService } from './cancelReservationAndAllotment.service';
@Component({
  standalone: false,
  selector: 'app-cancelReservationAndAllotment',
  templateUrl: './cancelReservationAndAllotment.component.html',
  styleUrls: ['./cancelReservationAndAllotment.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CancelReservationAndAllotmentComponent {
  displayedColumns = [
    'reservationAllotmentName',
    'reservationAllotmentCode',
    'reservationAllotmentSign',  
    'activationStatus',
    'actions'
  ];
  dataSource: CancelReservationAndAllotment[] | null;
  reservationAllotmentID: number;
  advanceTable: CancelReservationAndAllotment | null;
  SearchReservationAllotmentName: string = '';
  SearchReservationAllotmentCode: string = '';
  search : FormControl = new FormControl();
  code : FormControl = new FormControl();
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  sortingData: number;
  sortType: string;
  activation:any;

  dialogTitle: string;
  CancelReservationData: any;

  constructor(
    public dialogRef: MatDialogRef<CancelReservationAndAllotmentComponent>,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public cancelReservationAndAllotmentService: CancelReservationAndAllotmentService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  {
    // Set the defaults
    this.dialogTitle = 'Cancel Reservation Info';
    this.CancelReservationData = this.data.advanceTable;
    console.log(this.CancelReservationData)
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  onNoClick(): void {
    this.dialogRef.close();
  }
  

}


