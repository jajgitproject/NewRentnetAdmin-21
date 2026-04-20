// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BankBranchService } from './bankBranch.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BankBranch } from './bankBranch.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../bankBranch/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { BankDropDown } from '../bankChargeConfig/bankDropDown.model';
@Component({
  standalone: false,
  selector: 'app-bankBranch',
  templateUrl: './bankBranch.component.html',
  styleUrls: ['./bankBranch.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BankBranchComponent implements OnInit {
  displayedColumns = [
    'bank',
    'bankBranch',
    'GeoPoint.GeoPointName',
    'bankBranchAddress',
    'bankBranchIFSCCode',
    'bankBranchSwiftCode',
    'BankBranch.bankBranchIBanNumber',
    'bankBranchRoutingCode',
    'activationStatus',
    'actions'
  ];
  dataSource: BankBranch[] | null;
  bankBranchID: number;
  advanceTable: BankBranch | null;
  SearchBankBranch: string = '';
  public BankList?: BankDropDown[] = [];
  // : string = '';SearchCity
  SearchBankBranchIFSCCode: string = '';
  SearchBankBranchSwiftCode: string = '';
  SearchBankBranchAddress: string = '';
  SearchBank: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  filteredOptions: Observable<BankDropDown[]>;
  selectedFilter: string = 'search';
  searchTerm: any = '';
  SearchCity:FormControl = new FormControl();
  SearchIBAN:string='';
  SearchRoutingCode:string='';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public bankBranchService: BankBranchService,
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
    this.InitBank();
    this.SubscribeUpdateService();
  }
  refresh() 
  {
    this.SearchBankBranch = '';
    this.search.setValue('');
    // this.SearchCity = '';
    this.SearchBankBranchIFSCCode = '';
    this.SearchBankBranchSwiftCode = '';
    this.SearchBankBranchAddress = '';
    this.SearchActivationStatus = true;
    this.SearchIBAN = '';
    this.SearchRoutingCode = '';
    this.SearchCity.setValue('');
    this.PageNumber=0;
    this.searchTerm='';
    this.selectedFilter='search';
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
  this.bankBranchID = row.id;
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit'
    }
  });

}
deleteItem(row)
{
  this.bankBranchID = row.id;
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

  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

  
   public loadData() 
   {
    switch (this.selectedFilter)
    {
      case 'Bank':
        this.search.setValue(this.searchTerm);
        break;
      case 'Branch':
        this.SearchBankBranch = this.searchTerm;
        break;
      case 'City':
        this.SearchCity.setValue(this.searchTerm);
        break;
        case 'Address':
        this.SearchBankBranchAddress = this.searchTerm;
        break;
      case 'Ifsc':
        this.SearchBankBranchIFSCCode = this.searchTerm;
        break;
      case 'Swift':
        this.SearchBankBranchSwiftCode = this.searchTerm;
        break;
        case 'IBAN':
        this.SearchIBAN = this.searchTerm;
        break;
      case 'RoutingCode':
        this.SearchRoutingCode = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.bankBranchService.getTableData(this.SearchBankBranch,this.search.value,this.SearchBankBranchIFSCCode,this.SearchBankBranchSwiftCode,this.SearchBankBranchAddress,this.SearchCity.value,this.SearchIBAN,this.SearchRoutingCode,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: BankBranch) {
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
    //this.SearchBankBranch='';
    
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
          if(this.MessageArray[0]=="BankBranchCreate")
          {
            if(this.MessageArray[1]=="BankBranchView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Bank Branch Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BankBranchUpdate")
          {
            if(this.MessageArray[1]=="BankBranchView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Bank Branch Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BankBranchDelete")
          {
            if(this.MessageArray[1]=="BankBranchView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                ' Bank Branch Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="BankBranchAll")
          {
            if(this.MessageArray[1]=="BankBranchView")
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

  // InitBank() {
  //   this._generalService.GetBank().subscribe(
  //     data =>
  //     {
  //        ;
  //       this.BankList = data;
  //      
  //     },
  //     error =>
  //     {
       
  //     }
  //   );
  //  }
  InitBank() {
    this._generalService.GetBank().subscribe(
      data =>
      {
         ;
        this.BankList = data;
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
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.BankList.filter(
      customer => 
      {
        return customer.bank.toLowerCase().indexOf(filterValue)===0;
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
    this.bankBranchService.getTableDataSort(this.SearchBankBranch,this.SearchBank,this.SearchBankBranchIFSCCode,this.SearchBankBranchSwiftCode,this.SearchBankBranchAddress,this.SearchCity.value,this.SearchIBAN,this.SearchRoutingCode,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



