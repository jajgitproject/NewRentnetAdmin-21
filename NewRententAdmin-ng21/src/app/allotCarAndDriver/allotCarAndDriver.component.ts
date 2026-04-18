// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AllotCarAndDriverService } from './allotCarAndDriver.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AllotCarAndDriver } from './allotCarAndDriver.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../allotCarAndDriver/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { FormControl } from '@angular/forms';
@Component({
  standalone: false,
  selector: 'app-allotCarAndDriver',
  templateUrl: './allotCarAndDriver.component.html',
  styleUrls: ['./allotCarAndDriver.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class AllotCarAndDriverComponent implements OnInit {
  displayedColumns = [
    'AllotCarAndDriver',
    'status',
    'actions'
  ];
  dataSource: AllotCarAndDriver[] | null;
  allotCarAndDriverID: number;
  advanceTable: AllotCarAndDriver | null;
  SearchAllotCarAndDriver: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public allotCarAndDriverService: AllotCarAndDriverService,
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

  showNotification(allotCarAndDriverName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: allotCarAndDriverName
    });
  }
  onContextMenu(event: MouseEvent, item: AllotCarAndDriver) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
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
          if(this.MessageArray[0]=="AllotCarAndDriverCreate")
          {
            if(this.MessageArray[1]=="AllotCarAndDriverView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.showNotification(
                'snackbar-success',
                'AllotCarAndDriver Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AllotCarAndDriverUpdate")
          {
            if(this.MessageArray[1]=="AllotCarAndDriverView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.showNotification(
                'snackbar-success',
                'AllotCarAndDriver Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AllotCarAndDriverDelete")
          {
            if(this.MessageArray[1]=="AllotCarAndDriverView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.showNotification(
                'snackbar-success',
                'AllotCarAndDriver Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AllotCarAndDriverAll")
          {
            if(this.MessageArray[1]=="AllotCarAndDriverView")
            {
              if(this.MessageArray[2]=="Failure")
              {
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

        


