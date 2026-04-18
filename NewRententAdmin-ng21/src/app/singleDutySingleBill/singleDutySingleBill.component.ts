// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
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
import { SingleDutySingleBill } from './singleDutySingleBill.model';
import { SingleDutySingleBillService } from './singleDutySingleBill.service';
@Component({
  standalone: false,
  selector: 'app-SingleDutySingleBill',
  templateUrl: './singleDutySingleBill.component.html',
  styleUrls: ['./singleDutySingleBill.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SingleDutySingleBillComponent implements OnInit {
  dataSource: any;
  advanceTable: SingleDutySingleBill | null;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  dutySlipID: number;
  reservationID: number;
  vehicleName: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public singleDutySingleBillService: SingleDutySingleBillService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('printDutyBill', { static: false }) printDutyBill: ElementRef;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      this.dutySlipID   = paramsData.dutySlipID;
       this.reservationID = paramsData.reservationID;
       this.vehicleName = paramsData.vehicleName;
    });
    this.loadData();
  }

  public loadData() 
  {
     this.singleDutySingleBillService.BillInfo(this.dutySlipID).subscribe
   (
     data =>   
     {
       this.dataSource = data;
      console.log(this.dataSource);
     },
     (error: HttpErrorResponse) => { this.dataSource = null;}
   );
 }

 print() {
  const printContent = this.printDutyBill?.nativeElement.innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload(); // Reload to reset the original content
}


}



