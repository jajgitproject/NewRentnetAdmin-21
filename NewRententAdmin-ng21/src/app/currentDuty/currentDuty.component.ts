// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CurrentDutyService } from './currentDuty.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CurrentDuty } from './currentDuty.model';
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
//import { FormDialogRDComponent } from './dialogs/form-dialog/form-dialog.component';
@Component({
  standalone: false,
  selector: 'app-currentDuty',
  templateUrl: './currentDuty.component.html',
  styleUrls: ['./currentDuty.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CurrentDutyComponent implements OnInit {
  @Input() ReservationID;
  @Input() DutySlipID;
  advanceTable: CurrentDuty | null;
  advanceTableForm: FormGroup;
  dataSource: CurrentDuty[] | null;
  CustomerType: string;
  Customer: string;
  CustomerGroup: string;
  Booker: string;
  Passenger: string;
  Car: string;
  City: string;
  PackageType: string;
  Package: string;
  isAppCardVisible: boolean = false;
  isDriverCardVisible: boolean = false;
  isGPSCardVisible: boolean = false;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public currentDutyService: CurrentDutyService,
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
    console.log(this.DutySlipID);
    this.loadData();
    //this.loadDataForApp();
    // this.loadDataForDriver();
    // this.loadDataForGPS();
    this.SubscribeUpdateService();
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

  toggleAppCardVisibility(): void {
    this.isAppCardVisible = !this.isAppCardVisible;
    //this.loadDataForApp();
    this.isDriverCardVisible = false;
    this.isGPSCardVisible = false;
    if (this.isAppCardVisible) 
    {
      this.loadDataForApp();
    }
  }

  toggleDriverCardVisibility(): void {
    this.isDriverCardVisible = !this.isDriverCardVisible;
    //this.loadDataForDriver();
    this.isAppCardVisible = false;
    this.isGPSCardVisible = false;
    if (this.isDriverCardVisible) 
    {
      this.loadDataForDriver();
    }
  }

  toggleGPSCardVisibility(): void {
    this.isGPSCardVisible = !this.isGPSCardVisible;
    //this.loadDataForGPS();
    this.isDriverCardVisible = false;
    this.isAppCardVisible = false;
    if (this.isGPSCardVisible)
    {
      this.loadDataForGPS();
    }
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public loadData() 
  {
    console.log(this.DutySlipID);
     this.currentDutyService.getTableData(this.DutySlipID).subscribe
     (
       (data: CurrentDuty)=>   
       {
         this.advanceTable = data;
         console.log(this.advanceTable)
       },
       (error: HttpErrorResponse) => { this.advanceTable = null;}
     );
 }

  public loadDataForApp() 
  {
    console.log(this.DutySlipID);
     this.currentDutyService.getTableDataForApp(this.DutySlipID).subscribe
     (
       (data: CurrentDuty)=>   
       {
         this.advanceTable = data;
         console.log(this.advanceTable)
       },
       (error: HttpErrorResponse) => { this.advanceTable = null;}
     );
 }

 public loadDataForDriver() 
  {
    console.log(this.DutySlipID);
     this.currentDutyService.getTableDataForDriver(this.DutySlipID).subscribe
     (
       (data: CurrentDuty)=>   
       {
         this.advanceTable = data;
         console.log(this.advanceTable)
       },
       (error: HttpErrorResponse) => { this.advanceTable = null;}
     );
 }

 public loadDataForGPS() 
  {
    console.log(this.DutySlipID);
     this.currentDutyService.getTableDataForGPS(this.DutySlipID).subscribe
     (
       (data: CurrentDuty)=>   
       {
         this.advanceTable = data;
         console.log(this.advanceTable)
       },
       (error: HttpErrorResponse) => { this.advanceTable = null;}
     );
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
          if(this.MessageArray[0]=="CurrentDutyCreate")
          {
            if(this.MessageArray[1]=="CurrentDutyView")
            {
              if(this.MessageArray[2]=="Success")
              {
                
                this.showNotification(
                'snackbar-success',
                'Current Duty Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CurrentDutyUpdate")
          {
            if(this.MessageArray[1]=="CurrentDutyView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'Current Duty Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CurrentDutyDelete")
          {
            if(this.MessageArray[1]=="CurrentDutyView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'Current Duty Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CurrentDutyAll")
          {
            if(this.MessageArray[1]=="CurrentDutyView")
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



