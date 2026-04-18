// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SettledRateDetailsService } from './settledRateDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SettledRateDetails } from './settledRateDetails.model';
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
import { FormDialogSRDComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
@Component({
  standalone: false,
  selector: 'app-settledRateDetails',
  templateUrl: './settledRateDetails.component.html',
  styleUrls: ['./settledRateDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SettledRateDetailsComponent implements OnInit {
  @Input() advanceTableSRD;
  @Input() reservationID
  @Input() status;
  advanceTable: SettledRateDetails | null;
  advanceTableForm: FormGroup;

  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  reservationSettledRateID: any;
  PackageType: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public settledRateDetailsService: SettledRateDetailsService,
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
    this.loadData();
    this.SubscribeUpdateService();
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);

  deleteItem(row)
  {
    this.reservationSettledRateID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: this.advanceTableSRD[row],
    });
  }

  refresh()
  {
    this.loadData();
  }
  
  editSettledRate(i:any)
  {
    const dialogRef = this.dialog.open(FormDialogSRDComponent, 
      {
        data: 
          {
             advanceTable: this.advanceTableSRD[i],
             action: 'edit',
             status: this.status
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        this.loadData();
    });
  }

  public loadData() 
  {
     this.settledRateDetailsService.getTableData(this.reservationID,this.SearchActivationStatus, this.PageNumber).subscribe
     (
       (data: SettledRateDetails)=>   
       {
         this.advanceTableSRD = data;
         this.PackageType = this.advanceTableSRD[0].packageType;
       },
       (error: HttpErrorResponse) => { this.advanceTableSRD = null;}
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
          if(this.MessageArray[0]=="SettledRateDetailsCreate")
          {
            if(this.MessageArray[1]=="SettledRateDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Settled Rate Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SettledRateDetailsUpdate")
          {
            if(this.MessageArray[1]=="SettledRateDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'Settled Rate Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SettledRateDetailsDelete")
          {
            if(this.MessageArray[1]=="SettledRateDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'Settled Rate Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SettledRateDetailsAll")
          {
            if(this.MessageArray[1]=="SettledRateDetailsView")
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



