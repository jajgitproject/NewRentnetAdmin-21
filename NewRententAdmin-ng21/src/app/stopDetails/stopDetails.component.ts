// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { StopDetailsService } from './stopDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StopDetails } from './stopDetails.model';
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
import { PickupDialogComponent } from '../newForm/dialogs/pickup-dialog/pickup-dialog.component';
import { DropOffDialogComponent } from '../newForm/dialogs/dropoff-dialog/dropoff-dialog.component';
import { Output, EventEmitter } from '@angular/core';
import { FormDialogReservationStopDetailsComponent } from '../reservationStopDetails/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
@Component({
  standalone: false,
  selector: 'app-stopDetails',
  templateUrl: './stopDetails.component.html',
  styleUrls: ['./stopDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class StopDetailsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  @Input() reservationID;
  @Input() status;
  @Output() outputFromStopDetails = new EventEmitter <boolean> ();
  private eventsSubscription: Subscription;
  @Input() events: Observable<boolean>;
  advanceTable: StopDetails | null;
  advanceTableForm: FormGroup;
  dataSource: StopDetails[] | null;
  ReservationStopDate: Date;
  ReservationStopTime: Date;
  ReservationStopType: string;
  ReservationStopSpotType: string;
  ReservationStopAddress: string;
  ReservationStopAddressDetails: string;
  dropOffData = [];
  pickUpData = [];
  enRouteData = [];
  reservationStopID: any;
  //reservationID!: number;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public stopDetailsService: StopDetailsService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public _generalService: GeneralService,
  ) {
    
    this.advanceTable = new StopDetails({});
  }
  ngOnInit() {
    this.loadData();
    this.SubscribeUpdateService();
    this.eventsSubscription = this.events.subscribe((res: boolean) => {
      console.log(res);
      if(res) {
        this.loadData();
      }
    });
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);

  openPickupDropEnroute(formValue: any)
  {
    let formTitle = '';
    if(formValue.reservationStopType?.toLowerCase() === 'pickup') {
      formTitle = 'Pickup Details';
    } else if(formValue.reservationStopType?.toLowerCase() === 'dropoff') {
      formTitle = 'Dropoff Details';
    } else if(formValue.reservationStopType?.toLowerCase() === 'enroute') {
      formTitle = 'Enroute Details';
    }
    const dialogRef = this.dialog.open(FormDialogReservationStopDetailsComponent, 
      {
        data: 
          {
            advanceTable: formValue,
            action: 'edit',
            dialogTitle: formTitle,
            status: this.status
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
          this.outputFromStopDetails.emit(true);
          this.loadData();
        
      });
  }

  advance()
  {
    const dialogRef = this.dialog.open(AdvanceDialogComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
      });
  }
  
  submit() 
  {
    // emppty stuff
  }

  deleteItem(row)
  {
    this.reservationStopID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: this.enRouteData[row],
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if(res !== undefined) 
      {
        this.loadData();
      }
    });
  }

  loadData()
  {
    this.pickUpData = []; this.dropOffData = []; this.enRouteData = [];
    this.stopDetailsService.getReservationStopDetails(this.reservationID).subscribe((res: any) => {
      console.log(res)
      res?.forEach(element => {
        if(element.reservationStopType === 'Pickup') {
          this.pickUpData.push(element);        
        } else if(element.reservationStopType === 'Enroute') {
          this.enRouteData.push(element);
        } else if(element.reservationStopType === 'Dropoff') {
          this.dropOffData.push(element);
          
          console.log(this.dropOffData);
        }
      });
    }, (error: HttpErrorResponse) => {
      console.log(error);
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
          if(this.MessageArray[0]=="StopDetailsCreate")
          {
            if(this.MessageArray[1]=="StopDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                
                this.showNotification(
                'snackbar-success',
                'Stop Details Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="StopDetailsUpdate")
          {
            if(this.MessageArray[1]=="StopDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'Stop Details Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="StopDetailsDelete")
          {
            if(this.MessageArray[1]=="StopDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'Enroute Details Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="StopDetailsAll")
          {
            if(this.MessageArray[1]=="StopDetailsView")
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



