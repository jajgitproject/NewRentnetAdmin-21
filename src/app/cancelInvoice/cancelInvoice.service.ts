// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CancelInvoice } from './cancelInvoice.model';
@Injectable()
export class CancelInvoiceService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "CancelInvoice";
  }
  /** CRUD METHODS */
 
  add(advanceTable: CancelInvoice) 
  {
    advanceTable.cancelationByID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CancelInvoice)
  {
    
     advanceTable.cancelationByID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(ReservationAllotmentID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ ReservationAllotmentID);
  }



}
  

