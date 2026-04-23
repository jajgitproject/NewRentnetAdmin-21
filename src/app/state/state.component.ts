// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StateService } from './state.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { State } from './state.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class StateComponent implements OnInit {
  displayedColumns = [  
    'GeoPoint.GeoPointName',
    'oldRentNetGeoPointName',
    'country',
    'icon',
    'geoSearchString',
    'stateGSTCode',
    'status',
    'actions'
  ];
  dataSource: State[] | null;
  stateID: number;
  advanceTable: State | null;
  SearchName: string = '';
  SearchGstCode :string='';
  SearchGeoPointName :string='';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  searchGst : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  ActiveStatus:any;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;
  menuItems: any[] = [
    { label: 'Tax', route: '/interstateTaxEntry', tooltip: 'Interstate Tax' },
  ];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public stateService: StateService,
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
    this.menuItems.sort((a, b) => a.label.localeCompare(b.label));
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }
  refresh() {
    this.SearchGstCode='';
    this.SearchGeoPointName = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
    
  }

  public SearchData()
  {
    this.loadData();
    //this.SearchName = '';
    
  }
  
  // Ensure search only triggers when at least 3 characters are typed
  private isSearchReady(term: string): boolean {
    return (term || '').toString().trim().length >= 3;
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
      //  alert(row.id);
    this.stateID = row.stateID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });
   
  }
  deleteItem(row)
  {

    this.stateID = row.id;
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
    this.loadData();
  }
   public loadData() 
   {
    switch (this.selectedFilter)
    {
      case 'geoPointName':
          this.SearchGeoPointName = this.isSearchReady(this.searchTerm) ? this.searchTerm : '';
        break;
          case 'gstCode':
              this.SearchGstCode = this.isSearchReady(this.searchTerm) ? this.searchTerm : '';
            break;
      default:
        this.searchTerm = '';
        break;
    }
     
      this.stateService.getTableData(this.SearchGeoPointName ,this.SearchGstCode,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
       
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
  onContextMenu(event: MouseEvent, item: State) {
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
      //alert(this.PageNumber + 'mohit')
      this.loadData();
    }
    //alert([this.PageNumber])
  }
  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData();    } 
  }

  InterstateTax(menuItem: any, rowItem: any) {
    const formURL = this._generalService.FormURL;
    this.stateID = rowItem.geoPointID;
    const queryParams={
       StateID: this.stateID,
       State:rowItem.geoPointName,
       redirectingFrom:'State'
     }
   
    const url = this.router.serializeUrl(this.router.createUrlTree([menuItem.route], { queryParams }));
    
  //   const url = this.router.navigate([
  //    '/interstateTaxEntry',       
    
  //  ],{
  //    queryParams: {
  //      StateID: this.stateID,
  //      State:row.geoPointName,
  //      redirectingFrom:'State'
  //    }
  //  });
   window.open(formURL + url, '_blank');
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
          if(this.MessageArray[0]=="StateCreate")
          {
            if(this.MessageArray[1]=="StateView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'State Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="StateUpdate")
          {
            if(this.MessageArray[1]=="StateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'State Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="StateDelete")
          {
            if(this.MessageArray[1]=="StateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'State Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="StateAll")
          {
            if(this.MessageArray[1]=="StateView")
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
    //debugger;
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.stateService.getTableDataSort(this.SearchGeoPointName,this.SearchGstCode,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



