// @ts-nocheck
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ReservationDetailsService } from './reservationDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReservationDetails } from './reservationDetails.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdvanceDialogComponent } from '../advance/dialogs/advance-dialog/advance-dialog.component';
import { KamInfoDialogComponent } from './dialogs/kam-info-dialog/kam-info-dialog.component';
@Component({
  standalone: false,
  selector: 'app-reservationDetails',
  templateUrl: './reservationDetails.component.html',
  styleUrls: ['./reservationDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ReservationDetailsComponent implements OnInit, OnChanges {
  @Input() advanceTableRD;
  advanceTable: ReservationDetails | null;
  advanceTableForm: FormGroup;
  dataSource: ReservationDetails[] | null;
  CustomerType: string;
  Customer: string;
  CustomerGroup: string;
  Booker: string;
  Passenger: string;
  Car: string;
  City: string;
  PackageType: string;
  Package: string;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public reservationDetailsService: ReservationDetailsService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  /** KAM name line under the KAM button; keyed by customerID */
  kamSummaryByCustomerId: Record<number, string> = {};
  kamRowsByCustomerId: Record<number, any[]> = {};

  get reservationDetailRows(): any[] {
    const rd = this.advanceTableRD as any;
    if (rd == null) {
      return [];
    }
    return Array.isArray(rd) ? rd : [rd];
  }

  ngOnInit() {
    this.SubscribeUpdateService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['advanceTableRD'] || !changes['advanceTableRD'].currentValue) {
      return;
    }
    this.kamSummaryByCustomerId = {};
    this.kamRowsByCustomerId = {};
    for (const row of this.reservationDetailRows) {
      const cid = row?.customerID;
      if (cid == null || cid === '') {
        continue;
      }
      const n = Number(cid);
      if (Number.isNaN(n)) {
        continue;
      }
      this.kamSummaryByCustomerId[n] = '…';
      this._generalService.GetCustomerKam(n).pipe(take(1)).subscribe(
        (kams: any[]) => {
          const list = kams == null ? [] : Array.isArray(kams) ? kams : [kams];
          this.kamRowsByCustomerId[n] = list;
          if (!list.length) {
            this.kamSummaryByCustomerId[n] = '—';
            return;
          }
          const names = list
            .map((k) =>
              `${k.firstName ?? k.FirstName ?? ''} ${k.lastName ?? k.LastName ?? ''}`.trim()
            )
            .filter(Boolean);
          this.kamSummaryByCustomerId[n] = names.length ? names.join(', ') : '—';
        },
        () => {
          this.kamSummaryByCustomerId[n] = '—';
          this.kamRowsByCustomerId[n] = [];
        }
      );
    }
  }

  kamSummaryText(data: any): string {
    const cid = data?.customerID;
    if (cid == null || cid === '') {
      return '—';
    }
    const n = Number(cid);
    if (Number.isNaN(n)) {
      return '—';
    }
    return this.kamSummaryByCustomerId[n] ?? '…';
  }

  openKamInfo(data: any): void {
    const cid = data?.customerID;
    if (cid == null || cid === '') {
      this.showNotification('snackbar-danger', 'Customer ID is missing.', 'bottom', 'center');
      return;
    }
    const n = Number(cid);
    if (Number.isNaN(n)) {
      this.showNotification('snackbar-danger', 'Invalid customer ID.', 'bottom', 'center');
      return;
    }
    const cached = this.kamRowsByCustomerId[n];
    this.dialog.open(KamInfoDialogComponent, {
      width: '820px',
      maxWidth: '98vw',
      panelClass: 'kam-info-dialog-panel',
      backdropClass: 'kam-info-dialog-backdrop',
      data: {
        customerID: n,
        customerName: data?.customer,
        kamList: Array.isArray(cached) ? cached.slice() : undefined
      }
    });
  }

  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);
  
  submit() 
  {
    // emppty stuff
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
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
  MessageArray:string[]=[];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService()
  {
    this.subscriptionName=this._generalService.getUpdate().subscribe
    (
      message => 
      { 
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="ReservationDetailsCreate")
          {
            if(this.MessageArray[1]=="ReservationDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                
                this.showNotification(
                'snackbar-success',
                'Reservation Details Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ReservationDetailsUpdate")
          {
            if(this.MessageArray[1]=="ReservationDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'Reservation Details Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ReservationDetailsDelete")
          {
            if(this.MessageArray[1]=="ReservationDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'Reservation Details Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ReservationDetailsAll")
          {
            if(this.MessageArray[1]=="ReservationDetailsView")
            {
              if(this.MessageArray[2]=="Failure")
              {
               
               this.showNotification(
                'snackbar-danger',
                'Operation Failed.....!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DataNotFound")
          {
            if(this.MessageArray[1]=="DuplicacyError")
            {
              if(this.MessageArray[2]=="Failure")
              {
               
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

}



