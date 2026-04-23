// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TripDetailsService } from './tripDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TripDetails } from './tripDetails.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
//import { SettledRatesDialogComponent } from '../settledRates/dialogs/settled-rates-dialog/settled-rates-dialog.component';
//import { SpecialInstructionDialogComponent } from '../specialInstruction/dialogs/special-instruction-dialog/special-instruction-dialog.component';
//import { AdditionalSMSEmailDialogComponent } from '../additionalSMSEmailWhatsapp/dialogs/additional-SMS-Email-dialog/additional-SMS-Email-dialog.component';
//import { BillingInstructionDialogComponent } from '../billingInstruction/dialogs/billing-instruction-dialog/billing-instruction-dialog.component';
import { FormDialogBillToOtherComponent } from '../billToOther/dialogs/form-dialog/form-dialog.component';
import { FormDialogAddDiscountComponent } from '../addDiscount/dialogs/form-dialog/form-dialog.component';
import { AdvanceDialogComponent } from '../advance/dialogs/advance-dialog/advance-dialog.component';
import { KamDialogComponent } from '../kamDetails/dialogs/kam-dialog/kam-dialog.component';
import { SettledRatesDialogComponent } from '../settledRates/dialogs/settled-rates-dialog/settled-rates-dialog.component';
import { SpecialInstructionDialogComponent } from '../specialInstruction/dialogs/special-instruction-dialog/special-instruction-dialog.component';
import { AdditionalSMSEmailDialogComponent } from '../additionalSMSEmailWhatsapp/dialogs/additional-SMS-Email-dialog/additional-SMS-Email-dialog.component';
import { BillingInstructionDialogComponent } from '../billingInstruction/dialogs/billing-instruction-dialog/billing-instruction-dialog.component';
import { InternalNoteDialogComponent } from '../internalNoteDetails/dialogs/internal-note-dialog/internal-note-dialog.component';
@Component({
  standalone: false,
  selector: 'app-tripDetails',
  templateUrl: './tripDetails.component.html',
  styleUrls: ['./tripDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class TripDetailsComponent implements OnInit {
  displayedColumns = [
    'tripDetails',
    'activationStatus',
    'actions'
  ];
  dataSource: TripDetails[] | null;
  tripDetailsID: number;
  advanceTable: TripDetails | null;
  SearchTripDetails: string = '';
  SearchActivationStatus : string='Active';
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public tripDetailsService: TripDetailsService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.SubscribeUpdateService();
  }

  settledRates(){
    const dialogRef = this.dialog.open(SettledRatesDialogComponent, 
          {
            data: 
              {
                // advanceTable: this.advanceTable,
                // action: 'add'
              }
          });
  }

  specialInstruction()
  {
    const dialogRef = this.dialog.open(SpecialInstructionDialogComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
      });
  }

  additionaSMS()
  {
    const dialogRef = this.dialog.open(AdditionalSMSEmailDialogComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
      });
  }

  billingInstruction()
  {
    const dialogRef = this.dialog.open(BillingInstructionDialogComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
      });
  }

  internalNote()
  {
    const dialogRef = this.dialog.open(InternalNoteDialogComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
      });
  }

  billToOther()
  {
    const dialogRef = this.dialog.open(FormDialogBillToOtherComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
      });
  }

  addDiscount()
  {
    const dialogRef = this.dialog.open(FormDialogAddDiscountComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
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

  kamDetails()
  {
    const dialogRef = this.dialog.open(KamDialogComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
      });
  }

//   addNew()
//   {
//     const dialogRef = this.dialog.open(FormDialogComponent, 
//     {
//       data: 
//         {
//           advanceTable: this.advanceTable,
//           action: 'add'
//         }
//     });
//   }

//   editCall(row) {
//     //  alert(row.id);
//   this.tripDetailsID = row.id;
//   const dialogRef = this.dialog.open(FormDialogComponent, {
//     data: {
//       advanceTable: row,
//       action: 'edit'
//     }
//   });

// }
// deleteItem(row)
// {
//   this.tripDetailsID = row.id;
//   const dialogRef = this.dialog.open(DeleteDialogComponent, 
//   {
//     data: row
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
  onContextMenu(event: MouseEvent, item: TripDetails) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
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
          if(this.MessageArray[0]=="TripDetailsCreate")
          {
            if(this.MessageArray[1]=="TripDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                
                this.showNotification(
                'snackbar-success',
                'TripDetails Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="TripDetailsUpdate")
          {
            if(this.MessageArray[1]=="TripDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'TripDetails Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="TripDetailsDelete")
          {
            if(this.MessageArray[1]=="TripDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'TripDetails Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="TripDetailsAll")
          {
            if(this.MessageArray[1]=="TripDetailsView")
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



