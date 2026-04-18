// @ts-nocheck
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { DutyTrackingService } from './dutyTracking.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DutyTrackingModel } from './dutyTracking.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../dutyTracking/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
@Component({
  standalone: false,
  selector: 'app-dutyTracking',
  templateUrl: './dutyTracking.component.html',
  styleUrls: ['./dutyTracking.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutyTrackingComponent implements OnInit {
  displayedColumns = [
    'dutyTracking',
    'DutyTrackingAmount',
    'status',
    'actions'
  ];
  dataSource: DutyTrackingModel[] | null;
  debitTypeID: number;
  advanceTable: DutyTrackingModel | null;
  SearchDutyTracking: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  selectedFilter: string = 'search';
  searchTerm: any = '';
  dialogTitle: string;
  dutySlipID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public passToSupplierService: DutyTrackingService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DutyTrackingComponent>,
  )
  {
    this.dialogTitle = 'Duty Tracking History';
    this.dutySlipID = data.dutySlipID;
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    this.loadData();
  }

   public loadData() 
   {
    this.passToSupplierService.getData(this.dutySlipID).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
  
}



