// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DutyInterstateTaxService } from './dutyInterstateTax.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DutyInterstateTax } from './dutyInterstateTax.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { DITFormDialogComponent } from '../dutyInterstateTax/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { FormDialogComponent as  ApprovalFormDialogComponent} from '../dutyInterstateTaxApproval/dialogs/form-dialog/form-dialog.component';

@Component({
  standalone: false,
  selector: 'app-dutyInterstateTax',
  templateUrl: './dutyInterstateTax.component.html',
  styleUrls: ['./dutyInterstateTax.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutyInterstateTaxComponent implements OnInit {
  @Input() advanceTableDIT = [];
  @Input() dutySlipID;
  @Input() verifyDutyStatusAndCacellationStatus;
  @Input() goodForBillingStatusAndCancellationStatus;
  displayedColumns = [
    'startDate',
    'endDate',
    'amount',
    'paidBy',
    'image',
    'approvalStatus',
    'actions'
  ];
  dataSource: DutyInterstateTax[] | null;
  dutyInterstateTaxID: number=0;
  advanceTable: DutyInterstateTax | null;
  SearchDutyInterstateTax: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  ReservationID: any;
  DutySlipID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutyInterstateTaxService: DutyInterstateTaxService,
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
  }
  refresh() {
    this.SearchDutyInterstateTax = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }
  addNew()
  {
    const dialogRef = this.dialog.open(DITFormDialogComponent, 
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
  this.dutyInterstateTaxID = row.id;
  const dialogRef = this.dialog.open(DITFormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit',
      verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus,
      goodForBillingStatusAndCancellationStatus:this.goodForBillingStatusAndCancellationStatus

    }
  });

}
deleteItem(row)
{
  this.dutyInterstateTaxID = row.id;
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

  dutyInterstateTaxApproval(row)
  {
    const dialogRef = this.dialog.open(ApprovalFormDialogComponent, 
      {
        data: 
        {
          advanceTable: row,
          action: "edit",
          // reservationID:this.ReservationID,
          dutySlipID:this.dutySlipID,
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      }); 
      dialogRef.afterClosed().subscribe((res: any) => {
        this.loadData();
    });                       
  }

   public loadData() 
   {
      this.dutyInterstateTaxService.getTableData(this.dutyInterstateTaxID,this.dutySlipID,this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data =>   
        {
          this.advanceTableDIT = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableDIT = null;}
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
  onContextMenu(event: MouseEvent, item: DutyInterstateTax) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  NextCall()
  {
    if (this.advanceTableDIT?.length>0) 
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

  public SearchData()
  {
    this.loadData();
    //this.SearchDutyInterstateTax='';
    
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
          if(this.MessageArray[0]=="DutyInterstateTaxCreate")
          {
            if(this.MessageArray[1]=="DutyInterstateTaxView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Duty Interstate Tax Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyInterstateTaxUpdate")
          {
            if(this.MessageArray[1]=="DutyInterstateTaxView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Duty Interstate Tax Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyInterstateTaxDelete")
          {
            if(this.MessageArray[1]=="DutyInterstateTaxView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Duty Interstate Tax Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyInterstateTaxAll")
          {
            if(this.MessageArray[1]=="DutyInterstateTaxView")
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
    this.dutyInterstateTaxService.getTableDataSort(this.SearchDutyInterstateTax,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  openImageInNewTab(imageUrl: string) {
    window.open(imageUrl, '_blank');
}
}



