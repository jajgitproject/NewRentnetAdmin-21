// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CountryService } from './country.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Country } from './country.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { CurrencyDropDown } from '../general/currencyDropDown.model';
@Component({
  standalone: false,
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CountryComponent implements OnInit {
  displayedColumns = [
    'geoPointName',
    'oldRentNetGeoPointName',
    'icon',
    'geoSearchString',
    'countryISDCode',
    'countryISOCode',
    'countryCurrencyID',
    'actions'
  ];
  dataSource: Country[] | null;
  geoPointID: number;
  advanceTable: Country | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData:any;
  splittedDataShow:any;

  public CurrencyList?: CurrencyDropDown[] = [];
  filteredOptions: Observable<CurrencyDropDown[]>;

  SearchName: string = '';
  search : FormControl = new FormControl();

  SearchISD: string = '';
  ISD : FormControl = new FormControl();

  SearchISO: string = '';
  ISO : FormControl = new FormControl();

  SearchCurrency: string = '';
  currency : FormControl = new FormControl();

  searchTerm: any = '';
  selectedFilter: string = 'search';
  SearchGeoSearchString: string = '';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public countryService: CountryService,
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
    this.InitCurrencies();
  }

  // InitCurrencies() {
  //   this._generalService.GetCurrency().subscribe(
  //     data =>
  //     {
  //        ;
  //       this.CurrencyList = data;
  //     },
  //     error =>
  //     {
       
  //     }
  //   );
  //  }

  InitCurrencies() {
    this._generalService.GetCurrency().subscribe(
      data =>
      {
        this.CurrencyList = data;
        this.filteredOptions = this.currency.valueChanges.pipe(
         startWith(""),
         map(value => this._filter(value || ''))
       );
       
      },
      error =>
      {
       
      }
    );
   }
   private _filter(value: string): any {
     const filterValue = value.toLowerCase();
    //  if (!value || value.length < 3) {
    //   return [];   
    // }
     return this.CurrencyList.filter(
       customer => 
       {
         return customer.currencyName.toLowerCase().indexOf(filterValue)===0;
       }
     );
     
   };

  refresh() {
    this.SearchName = '';
    this.currency.setValue('');
    this.SearchISO = '';
    this.SearchISD = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.SearchGeoSearchString = '';
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  public SearchData()
  {
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
    this.geoPointID = row.geoPointID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: 
      {
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
      case 'country':
        this.SearchName = this.searchTerm;
        break;
      case 'isoCode':
        this.SearchISO = this.searchTerm;
        break;
      case 'isdCode':
        this.SearchISD = this.searchTerm;
        break; 
      case 'currency':
        this.currency.setValue(this.searchTerm);
        break;
      case 'geoSearchString':
        this.SearchGeoSearchString = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.countryService.getTableData(this.SearchName,
        this.SearchISO,
        this.SearchISD,
        this.currency.value,
        this.SearchGeoSearchString,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {        
        this.dataSource = data;    
      //   for(var i=0;i<this.dataSource.length;i++) {
      //   var value = this.dataSource[i].geoLocation.replace(
      //     '(',
      //     ''
      //   );
      //   value = value.replace(')', '');
      //   var lat = value.split(' ')[2];
      //   var long = value.split(' ')[1];
      //   this.splittedDataShow=lat+long;
      // }
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
  onContextMenu(event: MouseEvent, item: Country) {
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
          if(this.MessageArray[0]=="CountryCreate")
          {
            if(this.MessageArray[1]=="CountryView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Country Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CountryUpdate")
          {
            if(this.MessageArray[1]=="CountryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Country Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CountryDelete")
          {
            if(this.MessageArray[1]=="CountryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Country Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CountryAll")
          {
            if(this.MessageArray[1]=="CountryView")
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
     ;
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.countryService.getTableDataSort(this.SearchName,
      this.SearchISO,
      this.SearchISD,
      this.SearchCurrency,
      this.SearchGeoSearchString,
      this.SearchActivationStatus, 
      this.PageNumber,
      coloumName.active,
      this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



