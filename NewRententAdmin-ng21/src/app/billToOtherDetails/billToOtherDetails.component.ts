// @ts-nocheck
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BillToOtherDetailsService } from './billToOtherDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BillToOtherDetails } from './billToOtherDetails.model';
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
import { AdditionalSMSEmailDialogComponent } from '../additionalSMSEmailWhatsapp/dialogs/additional-SMS-Email-dialog/additional-SMS-Email-dialog.component';
import { FormDialogBillToOtherComponent } from '../billToOther/dialogs/form-dialog/form-dialog.component';
import { BillToOtherService } from '../billToOther/billToOther.service';
@Component({
  standalone: false,
  selector: 'app-billToOtherDetails',
  templateUrl: './billToOtherDetails.component.html',
  styleUrls: ['./billToOtherDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BillToOtherDetailsComponent implements OnInit {
  advanceTable: BillToOtherDetails | null;
  advanceTableForm: FormGroup;
  @Input() advanceTablesINData:BillToOtherDetails | null;
  @Input() reservationID;
  @Input() status;
  @Output() outputFromStopDetails = new EventEmitter <boolean> ();
  private eventsSubscription: Subscription;
  @Input() events: Observable<boolean>;
  ReservationID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public billToOtherDetailsService: BillToOtherDetailsService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public _generalService: GeneralService,
    private billToOtherService: BillToOtherService
  ) {
    
    this.advanceTable = new BillToOtherDetails({});
    // this.advanceTable.field1='Value 1';
    // this.advanceTable.field2='Value 2';
    // this.advanceTable.field3='Value 3';
    // this.advanceTable.field4='Value 4';
    //this.advanceTableForm = this.createContactForm();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  billToOtherDetailsList = [];
  ngOnInit() {
    console.log(this.reservationID);
    this.SubscribeUpdateService();
    this.getBillToOtherDetails();
    this.eventsSubscription = this.events.subscribe((res: boolean) => {
      if(res) {
        this.getBillToOtherDetails();
      }
    });
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);

   billingOtherEdit(formValue: any)
  {
    const dialogRef = this.dialog.open(FormDialogBillToOtherComponent, 
      {
        data: 
          {
            advanceTable: formValue,
            action: 'edit',
            //reservationID:this.ReservationID,
            status: this.status
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        if(res !== undefined) {
          //this.outputFromStopDetails.emit(true);
          // this.loadData();
          this.getBillToOtherDetails();
        }
      });
  }

  getBillToOtherDetails() {
    this.billToOtherService.getBillingToOther(this.reservationID).subscribe((res:any) => {
      this.billToOtherDetailsList = res;
      if(this.billToOtherDetailsList.length > 0) {
        this.outputFromStopDetails.emit(true);
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    });
  }
  
  submit() 
  {
    // emppty stuff
  }

//   public loadData() 
//   {
//     console.log(this.reservationID);
//      this.billToOtherDetailsService.getBillingToOther(this.reservationID).subscribe
//      (
//        (data: BillToOtherDetails)=>   
//        {
//          this.advanceTable = data;
//          console.log(this.advanceTable)
        
//        },
//        (error: HttpErrorResponse) => { this.advanceTable = null;}
//      );
//  }

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
          if(this.MessageArray[0]=="BillToOtherDetailsCreate")
          {
            if(this.MessageArray[1]=="BillToOtherDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                
                this.showNotification(
                'snackbar-success',
                'BillToOtherDetails Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BillToOtherDetailsUpdate")
          {
            if(this.MessageArray[1]=="BillToOtherDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'BillToOtherDetails Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BillToOtherDetailsDelete")
          {
            if(this.MessageArray[1]=="BillToOtherDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'BillToOtherDetails Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BillToOtherDetailsAll")
          {
            if(this.MessageArray[1]=="BillToOtherDetailsView")
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



