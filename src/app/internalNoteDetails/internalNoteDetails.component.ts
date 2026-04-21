// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { InternalNoteDetailsService } from './internalNoteDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InternalNoteDetails } from './internalNoteDetails.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
//import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdvanceDialogComponent } from '../advance/dialogs/advance-dialog/advance-dialog.component';
import { InternalNoteDialogComponent } from './dialogs/internal-note-dialog/internal-note-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';

@Component({
  standalone: false,
  selector: 'app-internalNoteDetails',
  templateUrl: './internalNoteDetails.component.html',
  styleUrls: ['./internalNoteDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class InternalNoteDetailsComponent implements OnInit {
  @Input() advanceTableINData:InternalNoteDetails | null;
  @Input() reservationID;
  @Input() status;
  ReservationID: any;
  reservationInternalNoteID: any;
  advanceTable: InternalNoteDetails | null;
  advanceTableForm: FormGroup;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public internalNoteDetailsService: InternalNoteDetailsService,
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
  SearchInternalNote: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  ngOnInit() {
    this.SubscribeUpdateService();
    //this.loadData();
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);

  refresh()
  {
    this.loadData();
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
  public loadData() 
   {
      this.internalNoteDetailsService.getTableData(this.reservationID,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      (data :InternalNoteDetails)=>   
      {
        this.advanceTableINData = data;
      },
      (error: HttpErrorResponse) => { this.advanceTableINData = null;}
    );
  }
  InternalNoteEdit(i:any)
  {
    const dialogRef = this.dialog.open(InternalNoteDialogComponent, 
      {
        data: 
          {
            advanceTable: this.advanceTableINData[i],
            //data:data,
            action: 'edit',
            status: this.status
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        debugger;
        this.loadData();
    });
  }

  deleteItem(row)
  {
    this.reservationInternalNoteID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: this.advanceTableINData[row],
    });
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
          if(this.MessageArray[0]=="InternalNoteDetailsCreate")
          {
            if(this.MessageArray[1]=="InternalNoteDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Internal Note Details Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InternalNoteDetailsUpdate")
          {
            if(this.MessageArray[1]=="InternalNoteDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'Internal Note Details Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InternalNoteDetailsDelete")
          {
            if(this.MessageArray[1]=="InternalNoteDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
               this.showNotification(
                'snackbar-success',
                'Internal Note Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InternalNoteDetailsAll")
          {
            if(this.MessageArray[1]=="InternalNoteDetailsView")
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



