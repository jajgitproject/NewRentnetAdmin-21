// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BillingInstructionsDetailsService } from './billingInstructionsDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BillingInstructionsDetails } from './billingInstructionsDetails.model';
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
import { BillingInstructionsDetailsDialogComponent } from './dialogs/billing-instruction-dialog/billing-instruction-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
@Component({
  standalone: false,
  selector: 'app-billingInstructionsDetails',
  templateUrl: './billingInstructionsDetails.component.html',
  styleUrls: ['./billingInstructionsDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BillingInstructionsDetailsComponent implements OnInit {
  @Input() advanceTableBI: BillingInstructionsDetails | null;
  
  @Input() reservationID;
  @Input() status;
  advanceTable: BillingInstructionsDetails | null;
  advanceTableForm: FormGroup;
  reservationBillingInstructionID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public billingInstructionsDetailsService: BillingInstructionsDetailsService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public _generalService: GeneralService
  ) {
    
    this.advanceTable = new BillingInstructionsDetails({});
    // this.advanceTable.field1='Value 1';
    // this.advanceTable.field2='Value 2';
    // this.advanceTable.field3='Value 3';
    // this.advanceTable.field4='Value 4';
    
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
  ReservationID: any;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
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
  BillingInstructionEdit(i:any)
  {
    const dialogRef = this.dialog.open(BillingInstructionsDetailsDialogComponent, 
      {
        data: 
          {
            advanceTable: this.advanceTableBI[i],
            //data:data,
            action: 'edit',
            status: this.status
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        this.loadData();
      })
  }

  deleteItem(row)
  {
    this.reservationBillingInstructionID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: this.advanceTableBI[row],
    });
  }

  refresh()
  {
    this.loadData();
  }
  
  public loadData() 
  {
     this.billingInstructionsDetailsService.getTableData(this.reservationID,this.SearchActivationStatus, this.PageNumber).subscribe
   (
     (data :BillingInstructionsDetails)=>   
     {
       this.advanceTableBI = data;
     },
     (error: HttpErrorResponse) => { this.advanceTable = null;}
   );
 }
  // createContactForm(): FormGroup 
  // {
  //   return this.fb.group(
  //   {
  //     billingInstructionsDetailsID: [this.advanceTable.billingInstructionsDetailsID],
  //     field1: [this.advanceTable.field1],
  //     field2: [this.advanceTable.field2],
  //     field3: [this.advanceTable.field3],
  //     field4: [this.advanceTable.field4]
  //   });
  // }
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
          if(this.MessageArray[0]=="BillingInstructionsDetailsCreate")
          {
            if(this.MessageArray[1]=="BillingInstructionsDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Billing Instructions Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BillingInstructionsDetailsUpdate")
          {
            if(this.MessageArray[1]=="BillingInstructionsDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'Billing Instructions Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BillingInstructionsDetailsDelete")
          {
            if(this.MessageArray[1]=="BillingInstructionsDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'Billing Instructions Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BillingInstructionsDetailsAll")
          {
            if(this.MessageArray[1]=="BillingInstructionsDetailsView")
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



