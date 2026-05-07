// @ts-nocheck
import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { DutyPostPickUPCallService } from './dutyPostPickUPCall.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DutyPostPickUPCallModel } from './dutyPostPickUPCall.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { DutyPostFormDialogComponent } from '../dutyPostPickUPCall/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
@Component({
  standalone: false,
  selector: 'app-dutyPostPickUPCall',
  templateUrl: './dutyPostPickUPCall.component.html',
  styleUrls: ['./dutyPostPickUPCall.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutyPostPickUPCallComponent implements OnInit {
  @Input() dutyPostPickUPCalldataSource : DutyPostPickUPCallModel;
  @Input() dutyPostPickUPCallID: number;
  @Input() dutySlipID: number;
  @Input() reservationID: number;
 isLoading = true;
  totalData = 0;
  PageNumber: number = 1;
  recordsPerPage = 2;
 
  dataSource: DutyPostPickUPCallModel[] | null;
  bankID: number;
  advanceTable: DutyPostPickUPCallModel | null;
  SearchDutyPostPickUPCall: string = '';
  SearchActivationStatus : boolean=true;
  // PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  selectedFilter: string = 'search';
  searchTerm: any = '';
  ReservationID: number;
  dialogTitle: string;
  DutySlipID: any;
  dutyPostPickUPCalldataSource: any;


  constructor(
    public dialogRef: MatDialogRef<DutyPostPickUPCallComponent>,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutyPostPickUPCallService: DutyPostPickUPCallService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  {
    this.dialogTitle = 'Post PickUP Call History';
    this.reservationID = data.reservationID;
    console.log(data.dutyPostPickUPCalldataSource)
    this.dutyPostPickUPCalldataSource= data.dutyPostPickUPCalldataSource;
  
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    this.dutySlipID = this.data.dutySlipID;
    this.SubscribeUpdateService();
  }

  refresh() 
  {
    this.selectedFilter='search';
    this.searchTerm='';
    this.SearchDutyPostPickUPCall = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addNew()
  {
    const dialogRef = this.dialog.open(DutyPostFormDialogComponent, 
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
  this.bankID = row.id;
  const dialogRef = this.dialog.open(DutyPostFormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit'
    }
  });

}
deleteItem(row)
{
  this.bankID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: row
  });
}

shouldShowDeleteButton(item: any): boolean {
  return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
}

  public Filter()
  {
    this.PageNumber = 0;
  }

  onBackPress(event) {
    if (event.keyCode === 8) 
    {

    }
  }

   onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.PageNumber = pageData.pageIndex + 1;
 
  }

  

// public postPickUPCallLoadData() {
//   this.dutyPostPickUPCallService.getDataDutyPostPickUpCall(this.dutySlipID, this.reservationID).subscribe(
//     data => {
//       if (data) {
//         this.dutyPostPickUPCalldataSource = data;

//         // Fix: get ID from first item
//         this.DutySlipID = data?.dutySlipID;
//       } else {
//         this.dutyPostPickUPCalldataSource = [];
//       }
//     },
//     (error: HttpErrorResponse) => {
//       console.error('Error fetching pickup call data:', error);
//       this.dutyPostPickUPCalldataSource = [];
//     }
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
  onContextMenu(event: MouseEvent, item: DutyPostPickUPCallModel) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  NextCall()
  {
    if (this.dataSource?.length>0) 
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

    //this.SearchDutyPostPickUPCall='';
    
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
          if(this.MessageArray[0]=="DutyPostPickUPCallCreate")
          {
            if(this.MessageArray[1]=="DutyPostPickUPCallView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'DutyPostPickUPCall Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyPostPickUPCallUpdate")
          {
            if(this.MessageArray[1]=="DutyPostPickUPCallView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'DutyPostPickUPCall Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyPostPickUPCallDelete")
          {
            if(this.MessageArray[1]=="DutyPostPickUPCallView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'DutyPostPickUPCall Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyPostPickUPCallAll")
          {
            if(this.MessageArray[1]=="DutyPostPickUPCallView")
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
   
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.dutyPostPickUPCallService.getTableDataSort(this.SearchDutyPostPickUPCall,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



