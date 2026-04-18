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
import { SingleDutySingleBillForLocal } from './SingleDutySingleBillForLocal.model';
import { SingleDutySingleBillForLocalService } from './SingleDutySingleBillForLocal.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-SingleDutySingleBillForLocal',
  templateUrl: './SingleDutySingleBillForLocal.component.html',
  styleUrls: ['./SingleDutySingleBillForLocal.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SingleDutySingleBillForLocalComponent implements OnInit {
  dataSource: any;
  advanceTable: SingleDutySingleBillForLocal | null;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  invoiceID: number;
  reservationID: number;
  vehicleName: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public singleDutySingleBillForLocalServiceService: SingleDutySingleBillForLocalService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
 @ViewChild('printSection', { static: false }) printSection: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      this.invoiceID   = paramsData.invoiceID;
       this.reservationID=paramsData.reservationID;
       this.vehicleName = paramsData.vehicleName;
       console.log(this.vehicleName)
    });
    this.loadData();
    
  }

  public loadData() 
  {
     this.singleDutySingleBillForLocalServiceService.printDutySlipInfo(this.invoiceID).subscribe
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
  const printContent = this.printSection?.nativeElement.innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload(); // Reload to reset the original content
}
getHoursAndMinutes(totalMinutes: number): { hours: number; minutes: number } {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}

}



