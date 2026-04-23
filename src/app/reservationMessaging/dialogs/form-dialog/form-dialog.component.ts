// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ReservationMessagingService } from '../../reservationMessaging.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { ReservationMessaging, ReservationMessagingData } from '../../reservationMessaging.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { Bank } from 'src/app/bank/bank.model';
import { BankService } from 'src/app/bank/bank.service';
import { Observable } from 'rxjs';
import { MessageSourceDropDown } from 'src/app/general/sourceDropDown.model';
import { map, startWith } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  displayedColumns: string[] =
   ['recipientAddress','messageSource','messageDate','recipientName','sentToCustomerPersonOrEmployeeOrBooker','messageType','messageStatus'];
  dataSource:ReservationMessaging[]| null;
  
  reservationID: any;
  SearchActivationStatus :boolean=true;
  // PageNumber: number = 1;
  // totalRecord: any;
  // isLoading: boolean;
  PageNumber: number = 0;
  sortingData: number;
  sortType: string;
  // SearchBank: string='';
  searchSentToCustomerPersonOrEmployeeOrBooker: string;
  searchRecipientAddress: string='';
  searchRecipientName: string='';
  searchMessageTime: string='';
  searchMessageDate: string='';
  searchMessageSource: string='';
  searchMessageType: string ='';
  searchmessagingStatus: string ='';
  search : FormControl = new FormControl();
  
  personName : FormControl = new FormControl();
  messageSource : FormControl = new FormControl();
  filteredMessageSourceOptions: Observable<MessageSourceDropDown[]>;
  filteredPersonsList = [];
  filteredPersonsOption: Observable<any[]>;
  public MessageSouceList?: MessageSourceDropDown[] = [];
  allotmentID: number = 0;
  // recordsPerPage = 2;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
   public reservationMessagingService: ReservationMessagingService,
  //public bankService: BankService,
  public _generalService:GeneralService)
  {
    this.reservationID=data.reservationID;
    this.allotmentID=data.allotmentID;
  }

  public ngOnInit(): void
  {
    this.initMessageSource();
    // this.initPerson();
    this.loadData();
    this.filteredPersonsOption = this.personName.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.personName;
        return name ? this._filter(name as string) : this.filteredPersonsList.slice();
      }),
    );
  }

  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();

    return this.filteredPersonsList.filter(option => option?.personName?.toLowerCase().includes(filterValue));
  }

  displayFn(option: any): string {
    return option && option.personName ? option.personName : '';
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

  refresh() {
     this.searchMessageType = '';
     this.messageSource.setValue('');
      this.personName.setValue('');
    // this.personName.value?.personName || null,
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  initMessageSource(){
    this._generalService.getMessageSource().subscribe(
      data=>{
        this.MessageSouceList=data;
        this.filteredMessageSourceOptions = this.messageSource.valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackage(value || ''))
        ); 
      }
    )
  }
  private _filterPackage(value: string): any {
    const filterValue = value.toLowerCase();
    return this.MessageSouceList.filter(
      customer => 
      {
        return customer.messageSource.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

// private _filterPerson(value: string): any[] {
//     const filterValue = value.toLowerCase();
//     return this.filteredPersonsList.filter(
//       customer => 
//         {
//           return customer.personName.toLowerCase().indexOf(filterValue)===0;
//         }
//       );
    
// }

  public loadData() 
  {
     this.reservationMessagingService.getTableData(
      this.reservationID,
      this.allotmentID,
      this.searchMessageType,
      this.messageSource.value,
      this.personName.value?.personName || null,
      this.searchmessagingStatus,
      this.SearchActivationStatus,
       this.PageNumber).subscribe
     (
       data =>   
       {
         this.dataSource = data;
        this.filteredPersonsList = [];
        this.dataSource?.forEach((item: any)=>{
          if(item.customerPersonName !== null && item.customerPersonName !== '' || item.employee !== null && item.employee !== '')
            this.filteredPersonsList.push({reservationMessagingID: item.reservationMessagingID, personName: item.customerPersonName || item.employee});
        });
        
       },
       
       (error: HttpErrorResponse) => { this.dataSource = null;}
     );
 }

 public SearchData()
  {
    this.loadData();
    //this.searchMessageType = '';
    //this.SearchBank='';
    
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
    this.reservationMessagingService.getTableDataSort(this.reservationID,this.allotmentID,
      this.searchMessageType,
      this.searchMessageSource,
      this.searchRecipientName,
      this.searchmessagingStatus,
      this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
  // public loadData() 
  //  {
  //   debugger;
  //     this.advanceTableService.getTableData(this.reservationID,this.SearchActivationStatus, this.PageNumber).subscribe
  //   (
  //     data =>   
  //     {
  //       this.dataSource = data.reservationMessagingDetails;
  //       this.totalRecord=data.totalRecords;
  //       this.isLoading=false;
  //     },
  //     (error: HttpErrorResponse) => { this.dataSource = null;}
  //   );
  // }

  // onChangedPage(pageData: PageEvent) {
  //   this.isLoading = true;
  //   this.PageNumber = pageData.pageIndex + 1;
  //   this.loadData();
  // }
}


