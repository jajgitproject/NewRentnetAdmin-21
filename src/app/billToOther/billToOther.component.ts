// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BillToOtherService } from './billToOther.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BillToOther } from './billToOther.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogBillToOtherComponent } from '../billToOther/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
@Component({
  standalone: false,
  selector: 'app-billToOther',
  templateUrl: './billToOther.component.html',
  styleUrls: ['./billToOther.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BillToOtherComponent implements OnInit {
  @Input() advanceTableBillingData:BillToOther | null;
  @Input() reservationID;
  @Input() dutySlipID;
  @Input() advanceTableBD;
  dataSource: BillToOther[] | null;
  billToOtherID: number;
  advanceTable: BillToOther | null;
  SearchBillToOther: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  sortingData: number;
  sortType: string;
 
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public billToOtherService: BillToOtherService,
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
    this.loadData();
    this.SubscribeUpdateService();
    this.BillToOtherLoadData();
  }
  refresh() {
    this.SearchBillToOther = '';
    this.SearchActivationStatus =true;
    this.PageNumber=0;
    this.loadData();
  }

  BillToOtherLoadData() 
  {
    this.billToOtherService.getBillingToOther(this.dutySlipID).subscribe
    (
    (data)=>   
      { 
        this.dataSource = data;   
      },
      (error: HttpErrorResponse) => { this.advanceTableBD = null;}
    );
  }
  // addNew()
  // {
  //   const dialogRef = this.dialog.open(FormDialogBillToOtherComponent, 
  //   {
  //     data: 
  //       {
  //         advanceTable: this.advanceTable,
  //         action: 'add'
  //       }
  //   });
  // }

  editBillingToOther(i:any)
  {
    
    const dialogRef = this.dialog.open(FormDialogBillToOtherComponent, 
      {
        data: 
          {
             advanceTable:this.advanceTableBillingData[i],
             action: 'edit'
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        this.loadData();
    })
  }

deleteItem(row)
{
  this.billToOtherID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: row
  });
}

  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }
   public loadData() 
   {
      this.billToOtherService.getBillingToOther(this.reservationID).subscribe
    (
      (data :BillToOther)=> 
      {
        this.advanceTableBillingData = data;
      },
      (error: HttpErrorResponse) => { this.advanceTable = null;}
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
  onContextMenu(event: MouseEvent, item: BillToOther) {
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
      this.loadData();
    }
  }
  PreviousCall()
  {
    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData(); 
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
          if(this.MessageArray[0]=="BillToOtherCreate")
          {
            if(this.MessageArray[1]=="BillToOtherView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'BillToOther Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BillToOtherUpdate")
          {
            if(this.MessageArray[1]=="BillToOtherView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'BillToOther Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BillToOtherDelete")
          {
            if(this.MessageArray[1]=="BillToOtherView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BillToOtherAll")
          {
            if(this.MessageArray[1]=="BillToOtherView")
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

  // SortingData(coloumName:any) {
  //   debugger;
  //   if (this.sortingData == 1) {

  //     this.sortingData = 0;
  //     this.sortType = "Ascending"
  //   }
  //   else {
  //     this.sortingData = 1;
  //     this.sortType = "Descending";
  //   }
  //   this.billToOtherService.getTableDataSort(this.SearchBillToOther,this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
  //   (
  //     data =>   
  //     {
  //       this.dataSource = data;
  //     },
  //     (error: HttpErrorResponse) => { this.dataSource = null;}
  //   );
  // }
}



