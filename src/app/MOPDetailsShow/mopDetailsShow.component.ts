// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdvanceDialogComponent } from '../advance/dialogs/advance-dialog/advance-dialog.component';
import { MOPDetailsService } from './mopDetailsShow.service';
import { MOPModel } from './mopDetailsShow.model';
import { FormDialogComponent } from './dialogs/mopDetails/mopDetails.component';

@Component({
  standalone: false,
  selector: 'app-mopDetailsShow',
  templateUrl: './mopDetailsShow.component.html',
  styleUrls: ['./mopDetailsShow.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class MOPDetailsComponent implements OnInit {
  @Input() advanceTableMOP
  @Input() reservationID;
  advanceTable: MOPModel | null;
  advanceTableForm: FormGroup;
  paymentMode: any;
  //reservationID: number=547;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public mopDetailsService: MOPDetailsService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public _generalService: GeneralService)
    {
      this.advanceTable = new MOPModel({});
    }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {  
    this.SubscribeUpdateService();
     //this.MOPDetails();
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);

  // ModeOfPayment()
  // {
  //   const dialogRef = this.dialog.open(FormDialogComponent, 
  //     {
  //       data: 
  //         {
  //           advanceTable: this.advanceTableMOP,
  //           action: 'edit',
  //           reservationID:this.reservationID, 
  //         }
  //     });
  //     dialogRef.afterClosed().subscribe((res: any) => {
  //         this.MOPDetails();
  //     });
  // }
  

//   public MOPDetails() 
//   {
//      this.mopDetailsService.getModeOfPaymentDetails(this.reservationID).subscribe
//      (
//        data=>   
//        {
//          this.advanceTableMOP = data;
//        },
//        (error: HttpErrorResponse) => { this.advanceTableMOP = null;}
//      );
//  }

  submit()  {}

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }


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
          if(this.MessageArray[0]=="MOPDetailsCreate")
          {
            if(this.MessageArray[1]=="MOPDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                
                this.showNotification(
                'snackbar-success',
                'MOPDetails Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="MOPDetailsUpdate")
          {
            if(this.MessageArray[1]=="MOPDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'MOPDetails Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="MOPDetailsDelete")
          {
            if(this.MessageArray[1]=="MOPDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'MOPDetails Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="MOPDetailsAll")
          {
            if(this.MessageArray[1]=="MOPDetailsView")
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



