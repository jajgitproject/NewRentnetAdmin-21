// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BillToOtherDetails } from './billToOtherDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class BillToOtherDetailsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "billtoOther";
  }

  getBillingToOther(reservationID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_URL + '/ForBilltoOther/' + reservationID}`);
  }
  /** CRUD METHODS */
 
  add(advanceTable: BillToOtherDetails) 
  {
    advanceTable.reservationBillToOtherID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: BillToOtherDetails)
  {
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(billToOtherDetailsID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ billToOtherDetailsID);
  }

}
  

