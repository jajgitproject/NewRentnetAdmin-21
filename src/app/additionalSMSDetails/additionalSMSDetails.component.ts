// @ts-nocheck
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AdditionalSMSDetailsService } from './additionalSMSDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdditionalSMSDetails } from './additionalSMSDetails.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdvanceDialogComponent } from '../advance/dialogs/advance-dialog/advance-dialog.component';
import { AdditionalSMSEmailDialogComponent } from '../additionalSMSEmailWhatsapp/dialogs/additional-SMS-Email-dialog/additional-SMS-Email-dialog.component';
import { AdditionalSMSEmailWhatsappService } from '../additionalSMSEmailWhatsapp/additionalSMSEmailWhatsapp.service';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
@Component({
  standalone: false,
  selector: 'app-additionalSMSDetails',
  templateUrl: './additionalSMSDetails.component.html',
  styleUrls: ['./additionalSMSDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class AdditionalSMSDetailsComponent implements OnInit {
  //advanceTable: AdditionalSMSDetails | null;
  advanceTableForm: FormGroup;
  @Input() advanceTableASE:AdditionalSMSDetails | null;
  @Input() reservationID;
  @Input() status;
  
  private eventsSubscription: Subscription;
  @Input() events: Observable<boolean>;
  //@Output() outputFromStopDetails = new EventEmitter <boolean> ();
  reservationAdditionalMessagingID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public additionalSMSDetailsService: AdditionalSMSDetailsService,
    public additionalSMSEmailWhatsappService: AdditionalSMSEmailWhatsappService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public _generalService: GeneralService  ) {
    
    this.advanceTableASE = new AdditionalSMSDetails({});
    console.log(this.reservationID);
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
  additionalSmsDetailsList = [];
  ngOnInit() {
    this.SubscribeUpdateService();
    this.getAdditionalSmsEmailDetails();
    this.eventsSubscription = this.events.subscribe((res: boolean) => {
      if(res) {
        this.getAdditionalSmsEmailDetails();
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

  additionaSMS(formValue: any)
  {
    const dialogRef = this.dialog.open(AdditionalSMSEmailDialogComponent, 
      {
        data: 
          {
            advanceTable: this.advanceTableASE[formValue],
            action: 'edit',
            //reservationID:this.ReservationID,
            status: this.status
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        if(res !== undefined) {
          // this.outputFromStopDetails.emit(true);
           this.getAdditionalSmsEmailDetails();
        }
      });
  }

  deleteItem(row)
  {
    this.reservationAdditionalMessagingID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: this.advanceTableASE[row],
    });
  }

  refresh()
  {
    this.getAdditionalSmsEmailDetails();
  }


  public getAdditionalSmsEmailDetails() 
  {
     this.additionalSMSDetailsService.getAdditionalSmsDetails(this.reservationID).subscribe
     (
       (data: AdditionalSMSDetails)=>   
       {
         this.advanceTableASE = data;
       },
       (error: HttpErrorResponse) => { this.advanceTableASE = null;}
     );
 }

  // getAdditionalSmsEmailDetails() {
  //   debugger
  //   this.additionalSMSDetailsService.getAdditionalSmsDetails(this.reservationID).subscribe((res:any) => {
  //     console.log(res)
  //     this.additionalSmsDetailsList = res;
  //     if(this.additionalSmsDetailsList.length > 0) {
  //       this.outputFromStopDetails.emit(true);
  //     }
  //   }, (error: HttpErrorResponse) => {
  //     console.log(error);
  //   });
  // }

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
          if(this.MessageArray[0]=="AdditionalSMSDetailsCreate")
          {
            if(this.MessageArray[1]=="AdditionalSMSDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Additional SMS Details Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AdditionalSMSDetailsUpdate")
          {
            if(this.MessageArray[1]=="AdditionalSMSDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'Additional SMS Details Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AdditionalSMSDetailsDelete")
          {
            if(this.MessageArray[1]=="AdditionalSMSDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Additional SMS Details Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AdditionalSMSDetailsAll")
          {
            if(this.MessageArray[1]=="AdditionalSMSDetailsView")
            {
              if(this.MessageArray[2]=="Failure")
              {
                this.refresh();
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
                this.refresh();
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



