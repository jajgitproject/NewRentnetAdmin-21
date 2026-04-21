// @ts-nocheck
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SpecialInstructionDetailsService } from './specialInstructionDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SpecialInstructionDetails } from './specialInstructionDetails.model';
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
import { SpecialInstructionService } from '../specialInstruction/specialInstruction.service';
import { SpecialInstructionDialogComponent } from '../specialInstruction/dialogs/special-instruction-dialog/special-instruction-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
//import { SpecialInstructionService } from '../specialInstruction/specialInstruction.service';
@Component({
  standalone: false,
  selector: 'app-specialInstructionDetails',
  templateUrl: './specialInstructionDetails.component.html',
  styleUrls: ['./specialInstructionDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SpecialInstructionDetailsComponent implements OnInit {
  //advanceTable: SpecialInstructionDetails | null;
  advanceTableForm: FormGroup;
  @Input() advanceTableSI:SpecialInstructionDetails | null;
  @Input() reservationID;
  @Input() status;
 // @Output() outputFromStopDetails = new EventEmitter <boolean> ();
  private eventsSubscription: Subscription;
  @Input() events: Observable<boolean>;
  ReservationID: any;
  specialInstrucationDetailsList = [];
  reservationSpecialInstructionID: any;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public specialInstructionDetailsService: SpecialInstructionDetailsService,
    public specialInstructionService: SpecialInstructionService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public _generalService: GeneralService,
  ) {
    
    this.advanceTableSI = new SpecialInstructionDetails({});
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

  ngOnInit() {
    this.SubscribeUpdateService();
    this.getInstrucationDetails();
    this.eventsSubscription = this.events.subscribe((res: boolean) => {
      if(res) {
        this.getInstrucationDetails();
      }
    });
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
      dialogRef.afterClosed().subscribe((res: any) => {
        this.ngOnInit();
      });
  }
  
  // getInstrucationDetails() {
  //   this.specialInstructionDetailsService.getspecialInstructionDetails(this.reservationID).subscribe((res:any) => {
  //     this.specialInstrucationDetailsList = res;
  //     if(this.specialInstrucationDetailsList.length > 0) {
  //       this.outputFromStopDetails.emit(true);
  //     }
  //   }, (error: HttpErrorResponse) => {
  //   });
  // }

  public getInstrucationDetails() 
  {
     this.specialInstructionDetailsService.getspecialInstructionDetails(this.reservationID).subscribe
     (
       (data: SpecialInstructionDetails)=>   
        {
          this.advanceTableSI = data;    
        },
        (error: HttpErrorResponse) => { this.advanceTableSI = null;}
      );
 }

  specialInstrucationEdit(i: any)
  {
    const dialogRef = this.dialog.open(SpecialInstructionDialogComponent, 
      {
        data: 
          {
            advanceTable: this.advanceTableSI[i],
            action: 'edit',
            status: this.status
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        if(res !== undefined) {
          // this.outputFromStopDetails.emit(true);
           this.getInstrucationDetails();
        }
      });
  }

  deleteItem(row)
  {
    this.reservationSpecialInstructionID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: this.advanceTableSI[row],
    });
  }

  refresh()
  {
    this.getInstrucationDetails();
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
          if(this.MessageArray[0]=="SpecialInstructionDetailsCreate")
          {
            if(this.MessageArray[1]=="SpecialInstructionDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Special Instruction Details Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SpecialInstructionDetailsUpdate")
          {
            if(this.MessageArray[1]=="SpecialInstructionDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'Special Instruction Details Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SpecialInstructionDetailsDelete")
          {
            if(this.MessageArray[1]=="SpecialInstructionDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'Special Instruction Details Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SpecialInstructionDetailsAll")
          {
            if(this.MessageArray[1]=="SpecialInstructionDetailsView")
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



