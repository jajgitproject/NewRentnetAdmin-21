// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CurrencyExchangeRateService } from './currencyExchangeRate.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CurrencyExchangeRate } from './currencyExchangeRate.model';
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
import moment from 'moment';
import { CurrencyDropDown } from '../general/currencyDropDown.model';
@Component({
  standalone: false,
  selector: 'app-currencyExchangeRate',
  templateUrl: './currencyExchangeRate.component.html',
  styleUrls: ['./currencyExchangeRate.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CurrencyExchangeRateComponent implements OnInit {
  displayedColumns = [
   
    'currencyName',
    //'exchangeDate',
    'applicableFrom',
    'applicableTo',
    'source',
    'exchangeRate',
    'activationStatus',
    'actions'
  ];
  dataSource: CurrencyExchangeRate[] | null;
  currencyExchangeRateID: number;
  advanceTable: CurrencyExchangeRate | null;
  SearchName: string = '';
  CurrencyName :string='';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  ActiveStatus:any;
  public CurrencyList?: CurrencyDropDown[] = [];
  SearchMessage: string = '';
  Searchcurrency:string ='';
  exchangeRate : FormControl = new FormControl();
  filteredOptions: Observable<CurrencyDropDown[]>;

  SearchApplicableFrom: string = '';
  applicableFrom : FormControl = new FormControl();

  SearchApplicableTo: string = '';
  applicableTo : FormControl = new FormControl();
  currencyName: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  SearchSource: any = '';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public currencyExchangeRateService: CurrencyExchangeRateService,
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
    // this._generalService.GetCurrencies().subscribe
    // (
    //   data =>   
    //   {
    //     this.CurrencyList = data;
    //     console.log(this.CurrencyList)
       
    //   }
    // );
    this.InitCurrencies();
    
  }

  InitCurrencies() {
    this._generalService.GetCurrency().subscribe(
      data =>
      {
         ;
        this.CurrencyList = data;
        this.filteredOptions = this.search.valueChanges.pipe(
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
    if (!value || value.length < 3) {
      return [];   
    }
     return this.CurrencyList.filter(
       customer => 
       {
         return customer.currencyName.toLowerCase().indexOf(filterValue)===0;
       }
     );
     
   };

  refresh() {
    this.search.setValue('');
    this.SearchName = '';
    this.SearchMessage='';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.SearchApplicableFrom = '';
    this.SearchApplicableTo = '';
    this.SearchSource = '';
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  public SearchData()
  {
    this.loadData();
    //this.CurrencyName='';
    
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
    this.currencyExchangeRateID = row.currencyExchangeRateID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });
   
  }
  deleteItem(row)
  {

    this.currencyExchangeRateID = row.id;
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
    if(this.SearchApplicableFrom!==""){
      this.SearchApplicableFrom=moment(this.SearchApplicableFrom).format('MMM DD yyyy');
    }
    if(this.SearchApplicableTo!==""){
      this.SearchApplicableTo=moment(this.SearchApplicableTo).format('MMM DD yyyy');
    }  
    switch (this.selectedFilter)
    {
      case 'currency':
        this.search.setValue(this.searchTerm);
        break;
      case 'applicableFrom':
        this.SearchApplicableFrom = this.searchTerm;
        break;
      case 'applicableTo':
        this.SearchApplicableTo = this.searchTerm;
        break;
      case 'source':
        this.SearchSource = this.searchTerm;
        break;
      case 'exchangeRate':
        this.SearchMessage = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.currencyExchangeRateService.getTableData(this.SearchSource,this.search.value,this.SearchMessage,
        this.SearchApplicableFrom,
        this.SearchApplicableTo,
        this.SearchName,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
        // this.dataSource.forEach((element)=>{
        //   if(element.activationStatus===true){
        //     this.ActiveStatus="Active"
        //   }
        //   else{
        //     this.ActiveStatus="Deleted"
        //   }
         
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
  onContextMenu(event: MouseEvent, item: CurrencyExchangeRate) {
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
          if(this.MessageArray[0]=="CurrencyExchangeRateCreate")
          {
            if(this.MessageArray[1]=="CurrencyExchangeRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Currency Exchange Rate Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CurrencyExchangeRateUpdate")
          {
            if(this.MessageArray[1]=="CurrencyExchangeRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Currency Exchange Rate Updated ...!!!',
                'bottom', 
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CurrencyExchangeRateDelete")
          {
            if(this.MessageArray[1]=="CurrencyExchangeRateView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Currency Exchange Rate Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CurrencyExchangeRateAll")
          {
            if(this.MessageArray[1]=="CurrencyExchangeRateView")
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
    this.currencyExchangeRateService.getTableDataSort(this.SearchSource,this.CurrencyName,this.SearchMessage,
      this.SearchApplicableFrom,
      this.SearchApplicableTo,this.SearchName,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {

        this.dataSource = data;
        this.dataSource.forEach((element)=>{
          if(element.activationStatus===true){
            this.ActiveStatus="Active"
          }
          else{
            this.ActiveStatus="Deleted"
          }
         
        })
      
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




