// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DutyExpenseService } from './dutyExpense.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DutyExpenseModel } from './dutyExpense.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../dutyExpense/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
@Component({
  standalone: false,
  selector: 'app-dutyExpense',
  templateUrl: './dutyExpense.component.html',
  styleUrls: ['./dutyExpense.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutyExpenseComponent implements OnInit {
  @Input() dutySlipID;
  @Input() advanceTableDE;
  @Input() verifyDutyStatusAndCacellationStatus;
  displayedColumns = [
    'expense',
    'chargeableOrNonChargeable',
    'uomUnits',
    'amountPerUnit',
    'amount',
    'status',
    'actions'
  ];
  dataSource: DutyExpenseModel[] | null;
  dutyExpenseID: number;
  advanceTable: DutyExpenseModel | null;
  SearchExpense: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutyExpenseService: DutyExpenseService,
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
    this.SearchExpense = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
    });
  }

  editCall(row) {
  this.dutyExpenseID = row.id;
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit',
      verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
    }
  });

}

deleteItem(row)
{
  this.dutyExpenseID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: {
      advanceTable: row,
      verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
    }
  });
}
shouldShowDeleteButton(item: any): boolean {
  return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
}

public Filter()
{
  this.PageNumber = 0;
  this.loadData();
}

  public loadData() 
  {
    this.dutyExpenseService.getTableData(this.dutySlipID, this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {
        this.advanceTableDE = data;
      },
      (error: HttpErrorResponse) => { this.advanceTableDE = null;}
    );
  }
   public loadDataClosing() 
  {
    this.dutyExpenseService.getTableDataClosing(this.dutySlipID, this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {
        this.advanceTableDE = data;
      },
      (error: HttpErrorResponse) => { this.advanceTableDE = null;}
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

  onContextMenu(event: MouseEvent, item: DutyExpenseModel) {
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
    //this.SearchExpense='';   
  }

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
         if(this.MessageArray[0]=="DutyExpenseCreate")
         {
           if(this.MessageArray[1]=="DutyExpenseView")
           {
             if(this.MessageArray[2]=="Success")
             {
               this.refresh();
               this.showNotification(
               'snackbar-success',
               'Duty Expense Created...!!!',
               'bottom',
               'center'
             );
             }
           }
         }
         else if(this.MessageArray[0]=="DutyExpenseUpdate")
         {
           if(this.MessageArray[1]=="DutyExpenseView")
           {
             if(this.MessageArray[2]=="Success")
             {
              this.refresh();
              this.showNotification(
               'snackbar-success',
               'Duty Expense Updated...!!!',
               'bottom',
               'center'
             );
             }
           }
         }
         else if(this.MessageArray[0]=="DutyExpenseDelete")
         {
           if(this.MessageArray[1]=="DutyExpenseView")
           {
             if(this.MessageArray[2]=="Success")
             {
              this.refresh();
              this.showNotification(
               'snackbar-success',
               'Duty Expense Deleted...!!!',
               'bottom',
               'center'
             );
             }
           }
         }
         else if(this.MessageArray[0]=="DutyExpenseAll")
         {
           if(this.MessageArray[1]=="DutyExpenseView")
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
    this.dutyExpenseService.getTableDataSort(this.SearchExpense,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;  
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
   
}



