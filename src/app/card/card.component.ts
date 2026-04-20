// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CardService } from './card.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Card } from './card.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../card/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { PaymentNetworkDropDown } from '../paymentNetwork/paymentNetworkDropDown.model';
import { CardTypeDropDown } from './cardDropDown.model';

@Component({
  standalone: false,
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CardComponent implements OnInit {
  displayedColumns = [
    'Card',
    'PaymentNetwork',
    'cardType',
    'activationStatus',
    'actions'
  ];
  dataSource: Card[] | null;
  cardID: number;
  advanceTable: Card | null;
  SearchCard: string = '';
  SearchPaymentNetwork: string = '';
  SearchCardType: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  paymentNetwork : FormControl = new FormControl();
  cardType : FormControl = new FormControl();
  sortingData: number;
  sortType: string;
  activation:string;
  public PaymentNetworkList?: PaymentNetworkDropDown[] = [];
  filteredOptions: Observable<PaymentNetworkDropDown[]>;
  filteredCardOptions: Observable<CardTypeDropDown[]>;

  public CardTypeList?: CardTypeDropDown[] = [];

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public cardService: CardService,
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
    this._generalService.GetPaytmentNetwork().subscribe
    (
      data =>   
      {
        this.PaymentNetworkList = data;
        this.filteredOptions = this.paymentNetwork.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
     
      }
    );

    this._generalService.GetCarType().subscribe
    (
      data =>   
      {
        this.CardTypeList = data;
        this.filteredCardOptions = this.cardType.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCard(value || ''))
        );
     
      }
    );
  }
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.PaymentNetworkList.filter(
      customer => 
      {
        return customer.paymentNetwork.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  private _filterCard(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.CardTypeList.filter(
      customer => 
      {
        return customer.cardType.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
 
  refresh() {
    this.SearchCard = '';
    this.paymentNetwork.setValue('');
    this.cardType.setValue('');
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
  this.cardID = row.id;
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit'
    }
  });

}
deleteItem(row)
{
  this.cardID = row.id;
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
      case 'card':
        this.SearchCard =this.searchTerm;
        break;
      case 'paymentNetwork':
        this.paymentNetwork.setValue(this.searchTerm);
        break;
      case 'cardType':
        this.cardType.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.cardService.getTableData(this.SearchCard,this.paymentNetwork.value,this.cardType.value,this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data =>   
        {
          this.dataSource = data;
        
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
  onContextMenu(event: MouseEvent, item: Card) {
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
    //this.SearchCard='';
    
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
          if(this.MessageArray[0]=="CardCreate")
          {
            if(this.MessageArray[1]=="CardView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Card Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CardUpdate")
          {
            if(this.MessageArray[1]=="CardView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Card Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CardDelete")
          {
            if(this.MessageArray[1]=="CardView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Card Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CardAll")
          {
            if(this.MessageArray[1]=="CardView")
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
    this.cardService.getTableDataSort(this.SearchCard,this.SearchPaymentNetwork,this.SearchCardType,this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



