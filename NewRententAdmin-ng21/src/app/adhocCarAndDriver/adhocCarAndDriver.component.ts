// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DriverGradeDropDown } from '../driverGrade/driverGradeDropDown.model';
import { QualificationDropDown } from '../general/qualificationDropDown.model';
import { AdhocCarAndDriver } from './adhocCarAndDriver.model';
import { AdhocCarAndDriverService } from './adhocCarAndDriver.service';

interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}

@Component({
  standalone: false,
  selector: 'app-adhocCarAndDriver',
  templateUrl: './adhocCarAndDriver.component.html',
  styleUrls: ['./adhocCarAndDriver.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class AdhocCarAndDriverComponent implements OnInit {
  
  dataSource: AdhocCarAndDriver[] | null;
  driverID: number;
  advanceTable: AdhocCarAndDriver | null;
  SearchdriverName: string = '';
  searchdriverFatherName: string = '';
  searchdriverGradeName: string = '';
  searchDriverOfficialIdentityNumber: string = '';
  searchhighestQualification: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  driverFatherName : FormControl = new FormControl();
  driverGrade : FormControl = new FormControl();
  idMark : FormControl = new FormControl();
  highestQualification : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  public DriverGradeList?: DriverGradeDropDown[] = [];
  filteredGradeOptions: Observable<DriverGradeDropDown[]>;
  public QualificationList?: QualificationDropDown[] = [];

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public adhocCarAndDriverService: AdhocCarAndDriverService,
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
  public Filter()
  {
    this.PageNumber = 0;
  }

  onBackPress(event) 
  {
    if (event.keyCode === 8) 
    {

    }
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: AdhocCarAndDriver) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }


  //---------------To Recieve Updates Start-------------------

  
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
          if(this.MessageArray[0]=="AdhocCarAndDriverCreate")
          {
            if(this.MessageArray[1]=="AdhocCarAndDriverView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.showNotification(
                'snackbar-success',
                'AdhocCarAndDriver Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AdhocCarAndDriverUpdate")
          {
            if(this.MessageArray[1]=="AdhocCarAndDriverView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.showNotification(
                'snackbar-success',
                'AdhocCarAndDriver Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AdhocCarAndDriverDelete")
          {
            if(this.MessageArray[1]=="AdhocCarAndDriverView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.showNotification(
                'snackbar-success',
                'AdhocCarAndDriver Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AdhocCarAndDriverAll")
          {
            if(this.MessageArray[1]=="AdhocCarAndDriverView")
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



