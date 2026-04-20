// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
//import { Bank } from './bank.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponentPUBE } from '../pickUpByExecutive/dialogs/form-dialog/form-dialog.component';
import { FormControl } from '@angular/forms';
import { PickUpByExecutive } from './pickUpByExecutive.model';
import { PickUpByExecutiveService } from './pickUpByExecutive.service';
@Component({
  standalone: false,
  selector: 'app-pickUpByExecutive',
  templateUrl: './pickUpByExecutive.component.html',
  styleUrls: ['./pickUpByExecutive.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class PickUpByExecutiveComponent implements OnInit {
  displayedColumns = [
    'status',
    'actions'
  ];
  dataSource: PickUpByExecutive[] | null;
  pickUpByExecutiveID: number;
  advanceTable: PickUpByExecutive | null;
  SearchBank: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public pickUpByExecutiveService:PickUpByExecutiveService,
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
    this.SearchBank = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
     
  }

  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponentPUBE, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
    });
  }

  editCall(row) {
    //  alert(row.id);
  this.pickUpByExecutiveID = row.id;
  const dialogRef = this.dialog.open(FormDialogComponentPUBE, {
    data: {
      advanceTable: row,
      action: 'edit'
    }
  });

}
// deleteItem(row)
// {
//   this.pickUpByExecutiveID = row.id;
//   const dialogRef = this.dialog.open(DeleteDialogComponent, 
//   {
//     data: row
//   });
// }

  public Filter()
  {
    this.PageNumber = 0;
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: PickUpByExecutive) {
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
     
    //this.SearchBank='';
    
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
          if(this.MessageArray[0]=="BankCreate")
          {
            if(this.MessageArray[1]=="BankView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Bank Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BankUpdate")
          {
            if(this.MessageArray[1]=="BankView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Bank Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BankDelete")
          {
            if(this.MessageArray[1]=="BankView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Bank Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BankAll")
          {
            if(this.MessageArray[1]=="BankView")
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

        


