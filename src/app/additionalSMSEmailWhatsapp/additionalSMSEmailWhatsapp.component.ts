// @ts-nocheck
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AdditionalSMSEmailWhatsappService } from './additionalSMSEmailWhatsapp.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdditionalSMSEmailWhatsapp } from './additionalSMSEmailWhatsapp.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { AdditionalSMSEmailDialogComponent } from './dialogs/additional-SMS-Email-dialog/additional-SMS-Email-dialog.component';
import { FormGroup } from '@angular/forms';
@Component({
  standalone: false,
  selector: 'app-additionalSMSEmailWhatsapp',
  templateUrl: './additionalSMSEmailWhatsapp.component.html',
  styleUrls: ['./additionalSMSEmailWhatsapp.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class AdditionalSMSEmailWhatsappComponent implements OnInit {
  @Input() advanceTablesINData:AdditionalSMSEmailWhatsapp | null;
  @Input() reservationID;
  @Input() dutySlipID;
  @Input() advanceTableASEW;
  @Input() events: Observable<boolean>;
  @Output() outputFromStopDetails = new EventEmitter <boolean> ();
  private eventsSubscription: Subscription;
  dataSource: AdditionalSMSEmailWhatsapp[] | null;
  additionalSMSEmailWhatsappID: number;
  advanceTable: AdditionalSMSEmailWhatsapp | null;
  advanceTableForm: FormGroup;
  SearchAdditionalSMSEmailWhatsapp: string = '';
  SearchActivationStatus : string='Active';
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;
  reservationAdditionalMessagingID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public additionalSMSEmailWhatsappService: AdditionalSMSEmailWhatsappService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  additionalSmsDetailsList = [];
  ngOnInit() 
  {
    this.GetAdditionalSMSEmailMessagingInfo();
    this.SubscribeUpdateService();
    this.getAdditionalSmsEmailDetails();
    this.eventsSubscription = this.events.subscribe((res: boolean) => {
      if(res) {
        this.getAdditionalSmsEmailDetails();
      }
    });
  
  }

  public GetAdditionalSMSEmailMessagingInfo() 
  {
    this.additionalSMSEmailWhatsappService.GetAdditionalSMSEmailMessagingData(this.dutySlipID).subscribe
    (
      (data)=>   
      {
        this.dataSource = data;     
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  refresh() {
  this.getAdditionalSmsEmailDetails();
   
  }
  getAdditionalSmsEmailDetails() {
    this.additionalSMSEmailWhatsappService.getAdditionalSmsDetails(this.reservationID).subscribe((res:any) => {
      this.additionalSmsDetailsList = res;
      if(this.additionalSmsDetailsList.length > 0) {
        this.outputFromStopDetails.emit(true);
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    });
  }

  addNew()
  {
    const dialogRef = this.dialog.open(AdditionalSMSEmailDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
    });
  }

  additionaSMS(formValue: any)
  {
    console.log(formValue);
    const dialogRef = this.dialog.open(AdditionalSMSEmailDialogComponent, 
      {
        data: 
          {
            advanceTable: formValue,
            action: 'edit',
            //reservationID:this.ReservationID,
            
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        if(res !== undefined) {
          // this.outputFromStopDetails.emit(true);
           this.getAdditionalSmsEmailDetails();
        }
      });
  }
deleteItem(row)
{
  this.reservationAdditionalMessagingID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: row
  });
}

  public Filter()
  {
    this.PageNumber = 0;
   
  }
  //  public loadData() 
  //  {
  //     this.additionalSMSEmailWhatsappService.getTableData(this.SearchAdditionalSMSEmailWhatsapp,this.SearchActivationStatus, this.PageNumber).subscribe
  //   (
  //     data =>   
  //     {
  //       this.dataSource = data;
  //      console.log(this.dataSource);
  //     },
  //     (error: HttpErrorResponse) => { this.dataSource = null;}
  //   );
  // }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: AdditionalSMSEmailWhatsapp) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  NextCall()
  {
    if (this.dataSource.length>0) 
    {
      this.PageNumber++;
     
    }
  }
  PreviousCall()
  {
    if(this.PageNumber>0)
    {
      this.PageNumber--;
      
    } 
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
          if(this.MessageArray[0]=="AdditionalSMSEmailWhatsappCreate")
          {
            if(this.MessageArray[1]=="AdditionalSMSEmailWhatsappView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'AdditionalSMSEmailWhatsapp Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AdditionalSMSEmailWhatsappUpdate")
          {
            if(this.MessageArray[1]=="AdditionalSMSEmailWhatsappView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'AdditionalSMSEmailWhatsapp Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AdditionalSMSEmailWhatsappDelete")
          {
            if(this.MessageArray[1]=="AdditionalSMSEmailWhatsappView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'AdditionalSMSEmailWhatsapp Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AdditionalSMSEmailWhatsappAll")
          {
            if(this.MessageArray[1]=="AdditionalSMSEmailWhatsappView")
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

  SortingData(coloumName:any) {
    debugger;
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.additionalSMSEmailWhatsappService.getTableDataSort(this.SearchAdditionalSMSEmailWhatsapp,this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       console.log(this.dataSource);
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

}



