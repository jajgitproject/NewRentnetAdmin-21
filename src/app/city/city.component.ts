// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CityService } from './city.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { City } from './city.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../city/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { CountryDropDown } from '../general/countryDropDown.model';
@Component({
  standalone: false,
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CityComponent implements OnInit {
  displayedColumns = [
    'city',
    'oldRentNetGeoPointName',
    'GeoPoint.GeoPointName',
    'icon',
    'geoSearchString',
    'citySTDCode',
    // 'status',
    'actions'
  ];
  dataSource: City[] | null;
  cityID: number;
  advanceTable: City | null;
  SearchCity: string = '';
  SearchState: string = '';
  SearchCitySTDCode: string = '';
  SearchGeoSearchString: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  state : FormControl = new FormControl();
  citySTDCode : FormControl = new FormControl();
  geoSearchString : FormControl = new FormControl();
  activation: any;
  cityGroupID: number;
  sortingData: number;
  sortType: string;
  geoPointID: number;
  public StateList?: CountryDropDown[] = [];
  filteredStateOptions: Observable<CountryDropDown[]>;

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public cityService: CityService,
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
    this.InitStates();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.SearchCity = '';
    this.state.setValue('');
    this.SearchCitySTDCode = '';
    this.SearchGeoSearchString = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
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
    //  alert(row.id);
  //this.cityID = row.id;
  this.geoPointID = row.geoPointID
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit'
    }
  });
 
}
deleteItem(row)
{
  this.geoPointID = row.id;
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

  onBackPress(event) 
  {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

   public loadData() 
   {
    switch (this.selectedFilter)
    {
      case 'city':
        this.SearchCity = this.searchTerm;
        break;
      case 'state':
        this.state.setValue(this.searchTerm);
        break;
      case 'stdCode':
        this.SearchCitySTDCode = this.searchTerm;
        break;
      case 'geoSearchString':
        this.SearchGeoSearchString = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.cityService.getTableData(this.SearchCity,this.state.value,this.SearchCitySTDCode,this.SearchGeoSearchString,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   {
        this.dataSource = data;
       
        this.dataSource.forEach((ele)=>{
          if(ele.activationStatus===true){
           this.activation="Active"
          }
          if(ele.activationStatus===false){
            this.activation="Deleted"
           }
        })
       
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
  onContextMenu(event: MouseEvent, item: City) {
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
    this.loadData()    
  }

  // InitStates() {
  //   this._generalService.getState().subscribe(
  //     data =>
  //     {
  //        ;
  //       this.StateList = data;
  //     },
  //     error =>
  //     {
       
  //     }
  //   );
  //  }

  InitStates() {
    this._generalService.getState().subscribe(
      data => {
        ;
        this.StateList = data;
        this.filteredStateOptions =  this.state.valueChanges.pipe(
          startWith(""),
          map(value => this._filterState(value || ''))
        );
      },
      error => {

      }
    );
  }
 private _filterState(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.StateList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
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
          if(this.MessageArray[0]=="CityCreate")
          {
            if(this.MessageArray[1]=="CityView")
            {
              if(this.MessageArray[2]=="Success")
              {
              
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'City Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CityUpdate")
          {
            if(this.MessageArray[1]=="CityView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'City Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CityDelete")
          {
            if(this.MessageArray[1]=="CityView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'City Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CityAll")
          {
            if(this.MessageArray[1]=="CityView")
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
    if(coloumName.active==='city'){
      coloumName.active='GeoPoint.GeoPointName'
    }
    this.cityService.getTableDataSort(this.SearchCity,this.SearchState,this.SearchCitySTDCode,this.SearchGeoSearchString,this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}


