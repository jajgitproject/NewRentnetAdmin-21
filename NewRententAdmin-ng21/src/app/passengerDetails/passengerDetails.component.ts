// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PassengerDetailsService } from './passengerDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PassengerDetails } from './passengerDetails.model';
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
import { FormDialogRPComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';

@Component({
  standalone: false,
  selector: 'app-passengerDetails',
  templateUrl: './passengerDetails.component.html',
  styleUrls: ['./passengerDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class PassengerDetailsComponent implements OnInit {
  @Input() advanceTableData:PassengerDetails | null;
  @Input() reservationID;
  @Input() customerGroupID;
  @Input() status;
  advanceTable: PassengerDetails | null;
  advanceTableForm: FormGroup;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  passengerID: number;
  reservationPassengerID: any;
  

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public passengerDetailsService: PassengerDetailsService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public _generalService: GeneralService
  ) {
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.SubscribeUpdateService();
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);

  editPassenger(i:any)
  {
    
    const dialogRef = this.dialog.open(FormDialogRPComponent, 
      {
        width:'700px',
        data: 
          {
             advanceTable:this.advanceTableData[i],
             action: 'edit',
             reservationID:this.reservationID,
             status: this.status,
             customerGroupID:this.customerGroupID
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        this.loadData();
    })
  }

  deleteItem(row)
  {
    this.reservationPassengerID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: this.advanceTableData[row],
    });
  }

  refresh()
  {
    this.loadData();
  }

  public loadData() 
  {
     this.passengerDetailsService.getTableData(this.reservationID,this.SearchActivationStatus, this.PageNumber).subscribe
     (
       (data: PassengerDetails)=>   
       {
         this.advanceTableData = data;        
       },
       (error: HttpErrorResponse) => { this.advanceTable = null;}
     );
 }

 
  
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
          if(this.MessageArray[0]=="PassengerDetailsCreate")
          {
            if(this.MessageArray[1]=="PassengerDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Passenger Details Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="PassengerDetailsUpdate")
          {
            if(this.MessageArray[1]=="PassengerDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'Passenger Details Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="PassengerDetailsDelete")
          {
            if(this.MessageArray[1]=="PassengerDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'Passenger Details Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="PassengerDetailsAll")
          {
            if(this.MessageArray[1]=="PassengerDetailsView")
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



