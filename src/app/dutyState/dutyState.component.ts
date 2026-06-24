// @ts-nocheck
import { Component, ElementRef, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
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
import { FormDialogComponent} from '../dutyState/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { DutyState } from './dutyState.model';
import { DutyStateService } from './dutyState.service';
@Component({
  standalone: false,
  selector: 'app-dutyState',
  templateUrl: './dutyState.component.html',
  styleUrls: ['./dutyState.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutyStateComponent implements OnInit {
  @Input() advanceTableDutyState;
  @Input() dutySlipID;
  @Input() verifyDutyStatusAndCacellationStatus;
  @Input() verifyDuty: boolean = false;
  @Input() goodForBilling: boolean = false;
  @Input() invoiceGenerated: boolean = false;
  @Output() billingVerificationReset = new EventEmitter<void>();
  displayedColumns = [
    'state',
    'changeDateTime',
    'reasonOfChange',
    'changedBy',
    'actions'
  ];
  dataSource: DutyState[] | null;
  advanceTable: DutyState | null;
  SearchDutyState: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  dutyStateID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutyStateService: DutyStateService,
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
    this.loadDataClosing();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.SearchDutyState = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  addNew()
  {
    if (this.invoiceGenerated) {
      this.showBlockedByInvoiceNotification();
      return;
    }
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          dutySlipID: this.dutySlipID,
          verifyDuty: this.verifyDuty,
          goodForBilling: this.goodForBilling,
          invoiceGenerated: this.invoiceGenerated,
          verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus
        }
    });
    this.handleDutyStateDialogClosed(dialogRef);
  }

  editCall(row) {
    if (this.invoiceGenerated) {
      this.showBlockedByInvoiceNotification();
      return;
    }
    this.dutyStateID = row.id;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        dutySlipID: this.dutySlipID,
        verifyDuty: this.verifyDuty,
        goodForBilling: this.goodForBilling,
        invoiceGenerated: this.invoiceGenerated,
        verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus
      }
    });
    this.handleDutyStateDialogClosed(dialogRef);
  }

  private handleDutyStateDialogClosed(dialogRef): void {
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res?.resetBillingVerification) {
        this.billingVerificationReset.emit();
      }
    });
  }

deleteItem(row)
{
  if (this.invoiceGenerated) {
    this.showBlockedByInvoiceNotification();
    return;
  }
  this.dutyStateID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: {
      ...row,
      verifyDuty: this.verifyDuty,
      goodForBilling: this.goodForBilling,
      invoiceGenerated: this.invoiceGenerated
    }
  });
  this.handleDutyStateDialogClosed(dialogRef);
}

  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }

   public loadData() 
   {
      this.dutyStateService.getTableData(this.dutySlipID).subscribe
      (
        data =>   
        {
          this.advanceTableDutyState = this.dutyStateService.sortDutyStateRecordsNewestFirst(data);
         
        },
        (error: HttpErrorResponse) => { this.advanceTableDutyState = null;}
      );
  }
    public loadDataClosing() 
   {
      this.dutyStateService.getTableDataClosing(this.dutySlipID).subscribe
      (
        data =>   
        {
          this.advanceTableDutyState = this.dutyStateService.sortDutyStateRecordsNewestFirst(data);
         
        },
        (error: HttpErrorResponse) => { this.advanceTableDutyState = null;}
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

  private showBlockedByInvoiceNotification(): void {
    this.showNotification(
      'snackbar-warning',
      'Cannot change Eco Duty State after invoice has been issued for this duty.',
      'bottom',
      'center'
    );
  }
  onContextMenu(event: MouseEvent, item: DutyState) {
    if (this.invoiceGenerated) {
      event.preventDefault();
      this.showBlockedByInvoiceNotification();
      return;
    }
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
    //this.SearchDutyState='';
    
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
          if(this.MessageArray[0]=="DutyStateCreate")
          {
            if(this.MessageArray[1]=="DutyStateView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Duty State Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyStateUpdate")
          {
            if(this.MessageArray[1]=="DutyStateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Duty State Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyStateDelete")
          {
            if(this.MessageArray[1]=="DutyStateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Duty State Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyStateAll")
          {
            if(this.MessageArray[1]=="DutyStateView")
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
   
  //   if (this.sortingData == 1) {

  //     this.sortingData = 0;
  //     this.sortType = "Ascending"
  //   }
  //   else {
  //     this.sortingData = 1;
  //     this.sortType = "Descending";
  //   }
  //   this.dutyStateService.getTableDataSort(this.SearchDutyState,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
  //   (
  //     data =>   
  //     {
  //       this.dataSource = data;
      
  //     },
  //     (error: HttpErrorResponse) => { this.dataSource = null;}
  //   );
  // }
}



