// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ReservationClosingDetailsService } from './reservationClosingDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReservationClosingDetails } from './reservationClosingDetails.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdvanceDialogComponent } from '../advance/dialogs/advance-dialog/advance-dialog.component';
import { FormDialogRDComponent } from './dialogs/form-dialog/form-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { LocationDetailsDialogComponent } from './dialogs/locationDetails-dialog/locationDetails-dialog.component';
@Component({
  standalone: false,
  selector: 'app-reservationClosingDetails',
  templateUrl: './reservationClosingDetails.component.html',
  styleUrls: ['./reservationClosingDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ReservationClosingDetailsComponent implements OnInit {
 @Input() AllotmentID;
 advanceTableRCD: ReservationClosingDetails | null = null;

  advanceTableForm: FormGroup;
  dataSource: ReservationClosingDetails[] | null;
  CustomerType: string;
  Customer: string;
  CustomerGroup: string;
  Booker: string;
  Passenger: string;
  pickupAddress: any;
  Car: string;
  City: string;
  PackageType: string;
  Package: string;
  allotmentID: any;
  reservationCloseDetail: any = null;
  constructor(
    public route:ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public reservationClosingDetailsService: ReservationClosingDetailsService,
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
  ngOnInit() {
 this.route.queryParams.subscribe(paramsData =>{
      const encryptedAllotmentID = paramsData.allotmentID;
      this.allotmentID = this._generalService.decrypt(decodeURIComponent(encryptedAllotmentID)); 
    });       
    this.loadData();
    this.SubscribeUpdateService();
  }

   LocationDetails(value:any) {
      
      const dialogRef = this.dialog.open(LocationDetailsDialogComponent, {
        data: {
          advanceTable:  this.reservationCloseDetail,
          action: value
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

  public loadData() 
  {
    this.reservationClosingDetailsService.getTableData(this.AllotmentID).subscribe((res: any) => {
        this.reservationCloseDetail = res[0];
        // #region agent log
        fetch('http://127.0.0.1:7830/ingest/e71207c4-423e-4a42-a900-5bc43349cfbe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2871b3'},body:JSON.stringify({sessionId:'2871b3',runId:'run1',hypothesisId:'H5',location:'reservationClosingDetails.component.ts:loadData-subscribe',message:'reservation closing details assigned',data:{allotmentIDInput:this.AllotmentID,hasResponse:!!res,hasDetail:!!this.reservationCloseDetail},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
    }, (error: HttpErrorResponse) => {
    });
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
          if(this.MessageArray[0]=="ReservationClosingDetailsCreate")
          {
            if(this.MessageArray[1]=="ReservationClosingDetailsView")
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
          else if(this.MessageArray[0]=="ReservationClosingDetailsUpdate")
          {
            if(this.MessageArray[1]=="ReservationClosingDetailsView")
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
          else if(this.MessageArray[0]=="ReservationClosingDetailsDelete")
          {
            if(this.MessageArray[1]=="ReservationClosingDetailsView")
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
          else if(this.MessageArray[0]=="ReservationClosingDetailsAll")
          {
            if(this.MessageArray[1]=="ReservationClosingDetailsView")
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



