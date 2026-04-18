// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { MailSupplier } from './mailSupplier.model';
@Injectable()
export class MailSupplierService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "mailToSupplier";
  }
  /** CRUD METHODS */
  getmailToSupplier(reservationID: any): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/getMailToSupplier/${reservationID}`);
  }

  add(advanceTable: MailSupplier) 
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

}
  

