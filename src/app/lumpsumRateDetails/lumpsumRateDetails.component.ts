// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { LumpsumRateDetailsService } from './lumpsumRateDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LumpsumRateDetails } from './lumpsumRateDetails.model';
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
import { LumpsumRateDetailsDialogComponent } from './dialogs/lumpsumRateDetails/lumpsumRateDetails.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
@Component({
  standalone: false,
  selector: 'app-lumpsumRateDetails',
  templateUrl: './lumpsumRateDetails.component.html',
  styleUrls: ['./lumpsumRateDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class LumpsumRateDetailsComponent implements OnInit {
  @Input() advanceTableLR :LumpsumRateDetails | null;
  @Input() reservationID;
  @Input() status;
  advanceTable: LumpsumRateDetails | null;
  advanceTableForm: FormGroup;
  reservationLumpsumRateID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public lumpsumRateDetailsService: LumpsumRateDetailsService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public _generalService: GeneralService,
    public lumpshumRate: LumpsumRateDetailsService,
  ) {
    
    this.advanceTable = new LumpsumRateDetails({});
    // this.advanceTable.field1='Value 1';
    // this.advanceTable.field2='Value 2';
    // this.advanceTable.field3='Value 3';
    // this.advanceTable.field4='Value 4';
  
  }
  ReservationID: any;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;

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
  
  deleteItem(row)
  {
    this.reservationLumpsumRateID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: this.advanceTableLR[row],
    });
  }

  refresh()
  {
    this.LumPsumRateLoadData();
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
          if(this.MessageArray[0]=="LumpsumRateDetailsCreate")
          {
            if(this.MessageArray[1]=="LumpsumRateDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Lumpsum Rate Details Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="LumpsumRateDetailsUpdate")
          {
            if(this.MessageArray[1]=="LumpsumRateDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'Lumpsum Rate Details Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="LumpsumRateDetailsDelete")
          {
            if(this.MessageArray[1]=="LumpsumRateDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'Lumpsum Rate Details Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="LumpsumRateDetailsAll")
          {
            if(this.MessageArray[1]=="LumpsumRateDetailsView")
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
  LumpsumRate(i:any)
  {
    
    const dialogRef = this.dialog.open(LumpsumRateDetailsDialogComponent, 
      {
        data: 
          {
             advanceTable: this.advanceTableLR[i],
            //data:data,
            action: 'edit',
            status: this.status
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        this.LumPsumRateLoadData();
})
    }

    public LumPsumRateLoadData() 
    {
       this.lumpshumRate.getTableData(this.reservationID,this.SearchActivationStatus, this.PageNumber).subscribe
     (
       (data :LumpsumRateDetails)=>   
       {
         this.advanceTableLR = data;
       },
       (error: HttpErrorResponse) => { this.advanceTable = null;}
     );
     
   }
}



