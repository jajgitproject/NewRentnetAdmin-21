// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DutyGSTPercentageService } from './dutyGSTPercentage.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DutyGSTPercentage } from './dutyGSTPercentage.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../dutyGSTPercentage/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
@Component({
  standalone: false,
  selector: 'app-dutyGSTPercentage',
  templateUrl: './dutyGSTPercentage.component.html',
  styleUrls: ['./dutyGSTPercentage.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutyGSTPercentageComponent implements OnInit {
  @Input() advanceTableDGP;
  @Input() dutySlipID;
  @Input() verifyDutyStatusAndCacellationStatus;
  displayedColumns = [
    'reasonOfChange',
    'gstPercentage',
    'changeDateTime',
    'name',
    'actions'
  ];
  dataSource: DutyGSTPercentage[] | null;
  dutyGSTPercentageID: number;
  advanceTable: DutyGSTPercentage | null;
  SearchDutyGSTPercentage: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutyGSTPercentageService: DutyGSTPercentageService,
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
    this.SearchDutyGSTPercentage = '';
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
  this.dutyGSTPercentageID = row.dutyGSTPercentageID;
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
  this.dutyGSTPercentageID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: {
      advanceTable: row,
      verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
    }
  });
}

public Filter()
{
  this.PageNumber = 0;
  this.loadData();
}

public loadData() 
{
   this.dutyGSTPercentageService.getTableData(this.dutySlipID).subscribe
   (
     data =>   
     {
       this.advanceTableDGP = data;
     },
     (error: HttpErrorResponse) => { this.advanceTableDGP = null;}
   );
}
public loadDataClosing() 
{
   this.dutyGSTPercentageService.getTableDataClosing(this.dutySlipID).subscribe
   (
     data =>   
     {
       this.advanceTableDGP = data;
     },
     (error: HttpErrorResponse) => { this.advanceTableDGP = null;}
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

  onContextMenu(event: MouseEvent, item: DutyGSTPercentage) {
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
    //this.SearchDutyGSTPercentage='';
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
          if(this.MessageArray[0]=="DutyGSTPercentageCreate")
          {
            if(this.MessageArray[1]=="DutyGSTPercentageView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Duty GST Percentage Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyGSTPercentageUpdate")
          {
            if(this.MessageArray[1]=="DutyGSTPercentageView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Duty GST Percentage Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyGSTPercentageDelete")
          {
            if(this.MessageArray[1]=="DutyGSTPercentageView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Duty GST Percentage Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DutyGSTPercentageAll")
          {
            if(this.MessageArray[1]=="DutyGSTPercentageView")
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
    this.dutyGSTPercentageService.getTableDataSort(this.dutySlipID).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

}



