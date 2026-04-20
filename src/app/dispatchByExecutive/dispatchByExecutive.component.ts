// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DispatchByExecutiveService } from './dispatchByExecutive.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DispatchByExecutive } from './dispatchByExecutive.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogDBEComponent } from '../dispatchByExecutive/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
@Component({
  standalone: false,
  selector: 'app-dispatchByExecutive',
  templateUrl: './dispatchByExecutive.component.html',
  styleUrls: ['./dispatchByExecutive.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DispatchByExecutiveComponent implements OnInit {
  displayedColumns = [
    'DispatchByExecutive',
    'status',
    'actions'
  ];
  dataSource: DispatchByExecutive[] | null;
  dispatchByExecutiveID: number;
  advanceTable: DispatchByExecutive | null;
  SearchDispatchByExecutive: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  locationOutEntryExecutiveID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dispatchByExecutiveService: DispatchByExecutiveService,
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
    this.SearchDispatchByExecutive = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogDBEComponent, 
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
  const dialogRef = this.dialog.open(FormDialogDBEComponent, {
    data: {
      advanceTable: row,
      action: 'edit'
    }
  });

}
deleteItem(row)
{
  this.dispatchByExecutiveID = row.id;
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
      this.dispatchByExecutiveService.getTableData(this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data =>   
        {
          this.dataSource = data;
          console.log(this.dataSource)
          // this.dataSource.forEach((ele)=>{
          //   if(ele.activationStatus===true){
          //    this.activation="Active"
          //   }
          //   if(ele.activationStatus===false){
          //     this.activation="Deleted"
          //    }
          // })
         
        },
        (error: HttpErrorResponse) => { this.dataSource = null;}
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
  onContextMenu(event: MouseEvent, item: DispatchByExecutive) {
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

  public SearchData()
  {
    this.loadData();
    //this.SearchDispatchByExecutive='';
    
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
          if(this.MessageArray[0]=="DispatchByExecutiveCreate")
          {
            if(this.MessageArray[1]=="DispatchByExecutiveView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'DispatchByExecutive Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DispatchByExecutiveUpdate")
          {
            if(this.MessageArray[1]=="DispatchByExecutiveView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'DispatchByExecutive Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DispatchByExecutiveDelete")
          {
            if(this.MessageArray[1]=="DispatchByExecutiveView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'DispatchByExecutive Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DispatchByExecutiveAll")
          {
            if(this.MessageArray[1]=="DispatchByExecutiveView")
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
    this.dispatchByExecutiveService.getTableDataSort(this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
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

        


