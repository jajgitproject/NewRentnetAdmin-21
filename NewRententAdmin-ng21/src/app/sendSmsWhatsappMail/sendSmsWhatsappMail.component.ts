// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogSendEmsComponent } from '../sendEmsAndEmail/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { SendSmsWhatsappMail } from './sendSmsWhatsappMail.model';
import { SendSmsWhatsappMailService } from './sendSmsWhatsappMail.service';
@Component({
  standalone: false,
  selector: 'app-sendSmsWhatsappMail',
  templateUrl: './sendSmsWhatsappMail.component.html',
  styleUrls: ['./sendSmsWhatsappMail.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SendSmsWhatsappMailComponent implements OnInit {
  displayedColumns = [
    'SendEmsAndEmail',
    'status',
    'actions'
  ];
  dataSource: SendSmsWhatsappMail[] | null;
  sendEmsAndEmailID: number;
  advanceTable: SendSmsWhatsappMail | null;
  SearchSendEmsAndEmail: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  locationOutEntryExecutiveID: any;
  pickupDate: string;
  pickupTime: string;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public sendSmsWhatsappMailService: SendSmsWhatsappMailService,
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
  refresh() {
    this.SearchSendEmsAndEmail = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    
  }

  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogSendEmsComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
    });
  }

  editCall(row) {
  this.locationOutEntryExecutiveID = row.id;
  const dialogRef = this.dialog.open(FormDialogSendEmsComponent, {
    data: {
      advanceTable: row,
      action: 'edit'
    }
  });

}
deleteItem(row)
{
  this.sendEmsAndEmailID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: row
  });
}

  public Filter()
  {
    this.PageNumber = 0;
    //this.loadData();
  }
  //  public fetchData() 
  //  {
  //     this.sendEmsAndEmailService.getSendEmsAndEmail(this.pickupDate, this.pickupTime).subscribe
  //     (
  //       data =>   
  //       {
  //         this.dataSource = data;
  //         console.log(this.dataSource)
  //         // this.dataSource.forEach((ele)=>{
  //         //   if(ele.activationStatus===true){
  //         //    this.activation="Active"
  //         //   }
  //         //   if(ele.activationStatus===false){
  //         //     this.activation="Deleted"
  //         //    }
  //         // })
         
  //       },
  //       (error: HttpErrorResponse) => { this.dataSource = null;}
  //     );
  // }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: SendSmsWhatsappMail) {
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

  public SearchData()
  {
 
    //this.SearchSendEmsAndEmail='';
    
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
          if(this.MessageArray[0]=="SendSmsWhatsappMailCreate")
          {
            if(this.MessageArray[1]=="SendSmsWhatsappMailView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'SendSmsWhatsappMail Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SendSmsWhatsappMailUpdate")
          {
            if(this.MessageArray[1]=="SendSmsWhatsappMailView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'SendSmsWhatsappMail Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SendSmsWhatsappMailDelete")
          {
            if(this.MessageArray[1]=="SendSmsWhatsappMailView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'SendSmsWhatsappMail Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SendSmsWhatsappMailAll")
          {
            if(this.MessageArray[1]=="SendSmsWhatsappMailView")
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



