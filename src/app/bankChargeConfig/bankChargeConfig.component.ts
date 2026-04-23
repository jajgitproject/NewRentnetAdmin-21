// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BankChargeConfigService } from './bankChargeConfig.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BankChargeConfig } from './bankChargeConfig.model';
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
import { BankBranchDropDown } from './bankBranchDropDown.model';
import { CardDropDown } from './cardDropDown.model';
import { CardProcessingChargeDropDown } from './cardProcessingChargeDropDown.model';

@Component({
  standalone: false,
  selector: 'app-bankChargeConfig',
  templateUrl: './bankChargeConfig.component.html',
  styleUrls: ['./bankChargeConfig.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BankChargeConfigComponent implements OnInit {
  displayedColumns = [
    'bank',
    'bankBranch',
    'card',
    'cardProcessingCharge',
    'bankChargePercentage',
    'bankChargeConfigIGSTRate',
    'status',
    'actions'
  ];
  dataSource: BankChargeConfig[] | null;
  bankChargeConfigID: number;
  advanceTable: BankChargeConfig | null;

  public BankBranchList?: BankBranchDropDown[] = [];
  filteredBranchOptions: Observable<BankBranchDropDown[]>;
  public CardList?: CardDropDown[] = [];
  filteredCardOptions: Observable<CardDropDown[]>;

  public CardProcessingChargeList?: CardProcessingChargeDropDown[] = [];
  
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  Search: string = '';
  search : FormControl = new FormControl();

  SearchCard:string='';
  card : FormControl = new FormControl();

  SearchCardPercentage:string='';
  cardPercentage : FormControl = new FormControl();
  
  SearchIGST:string='';
  IGST : FormControl = new FormControl();
  SearchcardPercentage: string;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  SearchBank : FormControl = new FormControl();
  SearchCardProcessingCharge : FormControl = new FormControl();
  
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public bankChargeConfigService: BankChargeConfigService,
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
    this.InitBankBranch();
    this.InitCard();
  }

  // InitBankBranch(){
  //   this._generalService.GetBankBranch().subscribe(
  //     data=>{
  //       this.BankBranchList=data;
  //     }
  //   );
  //  }
  
  //  InitCard(){
  //   this._generalService.GetCard().subscribe(
  //     data=>{
  //       this.CardList=data;
  //     }
  //   );
  //  }

  InitBankBranch(){
    // this.bankID=event.option.id;
    // //this.advanceTableForm.controls['bankID'].setValue(this.bankID);  
  
    this._generalService.GetBankBranch().subscribe(
      data=>{
        this.BankBranchList=data;
       
        this.filteredBranchOptions =  this.search.valueChanges.pipe(
          startWith(""),
          map(value => this._filterBranch(value || ''))
        );
       
      }
    );
   }
   private _filterBranch(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.BankBranchList.filter(
      customer => 
      {
        return customer.bankBranch.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
 
   InitCard(){
    this._generalService.GetCard().subscribe(
      data=>{
        this.CardList=data;        
        this.filteredCardOptions = this.card.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCard(value || ''))
        );
      }
    );
   }
  
   private _filterCard(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CardList.filter(
      customer => 
      {
        return customer.card.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  refresh() {
    this.search.setValue('');
    this.card.setValue('');
    this.SearchCardPercentage='';
    this.SearchIGST='';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.SearchBank.setValue('');
    this.SearchCardProcessingCharge.setValue('');
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
    this.bankChargeConfigID = row.bankChargeConfigID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });
   
  }

  deleteItem(row)
  {

    this.bankChargeConfigID = row.id;
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
      case 'bank':
        this.SearchBank.setValue(this.searchTerm);
        break;
      case 'bankBranch':
        this.search.setValue(this.searchTerm);
        break;
      case 'card':
        this.card.setValue(this.searchTerm);
        break;
      case 'chargePercentage':
        this.SearchCardPercentage = this.searchTerm;
        break;
      case 'igst':
        this.SearchIGST = this.searchTerm;
        break;
      case 'cardProcessingCharge':
        this.SearchCardProcessingCharge.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.bankChargeConfigService.getTableData(this.SearchBank.value,
        this.search.value,
        this.card.value,
        this.SearchCardPercentage,
        this.SearchIGST,
        this.SearchCardProcessingCharge.value,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
        // this.dataSource.forEach((ele)=>{
        //   if(ele.activationStatus===true){
        //     this.activeData="Active";
        //   }
        //   if(ele.activationStatus===false){
        //     this.activeData="Deleted";
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
  onContextMenu(event: MouseEvent, item: BankChargeConfig) {
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
          if(this.MessageArray[0]=="BankChargeConfigCreate")
          {
            if(this.MessageArray[1]=="BankChargeConfigView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Bank Charge Config Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BankChargeConfigUpdate")
          {
            if(this.MessageArray[1]=="BankChargeConfigView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Bank Charge Config Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BankChargeConfigDelete")
          {
            if(this.MessageArray[1]=="BankChargeConfigView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Bank Charge Config Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BankChargeConfigAll")
          {
            if(this.MessageArray[1]=="BankChargeConfigView")
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
    this.bankChargeConfigService.getTableDataSort(this.SearchBank.value,
      this.Search,
      this.SearchCard,
      this.SearchCardPercentage,
      this.SearchIGST,
      this.SearchCardProcessingCharge.value,
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



