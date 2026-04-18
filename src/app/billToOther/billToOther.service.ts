// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BillToOther } from './billToOther.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class BillToOtherService 
{
  private API_URL:string = '';
  private API_URL_Info:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "billtoOther";
    this.API_URL_Info=generalService.BaseURL+ "billToOtherDetails";
  }

  GetAdditionalSMSEmailMessagingData(DutySlipID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_Info + '/'+ 'GetBillToOtherDetails' + '/' + DutySlipID);
  }

  getBillingToOther(reservationID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_URL + '/ForBilltoOther/' + reservationID}`);
  }
  /** CRUD METHODS */
  // getTableData(SearchBillToOther:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  // {
  //   if(SearchBillToOther==="")
  //   {
  //     SearchBillToOther="null";
  //   }
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus="null";
  //   }
  //   return this.httpClient.get(this.API_URL + "/" +SearchBillToOther + '/' + SearchActivationStatus +'/' + PageNumber + '/BillToOther/Ascending');
  // }
  // getTableDataSort(SearchBillToOther:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  // {
  //   if(SearchBillToOther==="")
  //   {
  //     SearchBillToOther="null";
  //   }
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus="null";
  //   }
  //   return this.httpClient.get(this.API_URL + "/" +SearchBillToOther + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  // }

  add(advanceTable: BillToOther) 
  {
    advanceTable.reservationBillToOtherID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: BillToOther)
  {
    
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(billToOtherID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ billToOtherID);
  }

}
  

