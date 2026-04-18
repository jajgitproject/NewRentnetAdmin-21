// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DiscountDetailsService } from './discountDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DiscountDetails } from './discountDetails.model';
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
import { DiscountDetailsDialogComponent } from './dialogs/discountDetails/discountDetails.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
@Component({
  standalone: false,
  selector: 'app-discountDetails',
  templateUrl: './discountDetails.component.html',
  styleUrls: ['./discountDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DiscountDetailsComponent implements OnInit {
  @Input() advanceTableDD:  DiscountDetails | null;
  @Input() reservationID;
   @Input() AllotmentID: number;
   @Input() status;
  advanceTable: DiscountDetails | null;
  advanceTableForm: FormGroup;
  ReservationID: any;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  reservationDiscountID: any;
   showHideaddDiscount:boolean = false;
    panelExpanded = false;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public discountDetailsService: DiscountDetailsService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public discountDetails: DiscountDetailsService,
    public _generalService: GeneralService
  ) {
    
    this.advanceTable = new DiscountDetails({});
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
  ngOnInit() 
  {
    this.discountDetailsLoadData();
    this.loadDataForReservationDiscountClosing();
    this.SubscribeUpdateService();
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);
  
  // createContactForm(): FormGroup 
  // {
  //   return this.fb.group(
  //   {
  //     discountDetailsID: [this.advanceTable.discountDetailsID],
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
  DiscountDetails(i:any)
  {
    const dialogRef = this.dialog.open(DiscountDetailsDialogComponent, 
      {
        data: 
          {
            advanceTable: this.advanceTableDD[i],
            //data:data,
            action: 'edit',
            status: this.status
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        // this.discountDetailsLoadData();
        this.loadDataForReservationDiscountClosing();
      })
    }

    deleteItem(row)
  {
    this.reservationDiscountID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: this.advanceTableDD[row],
    });
  }

  refresh()
  {
    this.discountDetailsLoadData();
    this.loadDataForReservationDiscountClosing();
  }
  
    public discountDetailsLoadData() 
    {
       this.discountDetails.getTableData(this.reservationID,this.SearchActivationStatus, this.PageNumber).subscribe
     (
       (data :DiscountDetails)=>   
       {
         this.advanceTableDD = data;
         console.log(this.advanceTableDD)
       },
       (error: HttpErrorResponse) => { this.advanceTableDD = null;}
     );
     
   }

   public loadDataForReservationDiscountClosing() 
{
  const allotmentID = this.AllotmentID;
   this.discountDetails.getTableDataforReservationDiscountClosing(allotmentID).subscribe
     (
       (data :DiscountDetails)=>   
       {
         this.advanceTableDD = data;
         console.log( this.advanceTableDD)
       },
       (error: HttpErrorResponse) => { this.advanceTableDD = null;}
     );
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
          if(this.MessageArray[0]=="DiscountDetailsCreate")
          {
            if(this.MessageArray[1]=="DiscountDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Discount Details Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DiscountDetailsUpdate")
          {
            if(this.MessageArray[1]=="DiscountDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'Discount Details Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DiscountDetailsDelete")
          {
            if(this.MessageArray[1]=="DiscountDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'Discount Details Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DiscountDetailsAll")
          {
            if(this.MessageArray[1]=="DiscountDetailsView")
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

   togglePanel(): void {
    this.panelExpanded = !this.panelExpanded;

    // Optional: scroll into view only on expand
    if (this.panelExpanded) {
      setTimeout(() => this.scrollToLinkButton(), 300); // wait for animation
    }
  }

  onPanelOpen(): void {
    // Optional logic on open
  }

  onPanelClose(): void {
    // Optional logic on close
  }

   scrollToLinkButton() {
    const element = document.getElementById('linkButtonSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  reservationDiscountDetails() {
  this.addDiscount(); // Open the dialog to add a new discount
}

   addDiscount()
{
  const dialogRef = this.dialog.open(DiscountDetailsDialogComponent, 
    {
      data: 
        {
          // advanceTable: this.advanceTable,
           action: 'add',
          reservationID:this.reservationID
        }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
     this.discountDetailsLoadData();
      this.loadDataForReservationDiscountClosing();
})
}

showAndScrollAddDiscount() {
  this.showHideaddDiscount = true;
  setTimeout(() => {
    const element = document.getElementById('addDiscount');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}

// public discountDetailsLoadData() 
// {
//    this.discountDetails.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
//  (
//    (data :DiscountDetails)=>   
//    {
//     if(data !== null){
//       this.showHideaddDiscount = true;
//     }
//      this.advanceTableDD = data;
//    },
//    (error: HttpErrorResponse) => { this.advanceTableDD = null;}
//  );
 
// }

}



