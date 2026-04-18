// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdditionalSMSEmailWhatsapp } from './additionalSMSEmailWhatsapp.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { AdvanceService } from '../advance/advance.service';
@Injectable()
export class AdditionalSMSEmailWhatsappService 
{
  private API_URL:string = '';
  private API_URL_Info:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "additionalMessaging";
    this.API_URL_Info=generalService.BaseURL+ "additionalSMSEmailMessagingDetails";
  }
  /** CRUD METHODS */
  getTableData(SearchAdditionalSMSEmailWhatsapp:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(SearchAdditionalSMSEmailWhatsapp==="")
    {
      SearchAdditionalSMSEmailWhatsapp="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchAdditionalSMSEmailWhatsapp + '/' + SearchActivationStatus +'/' + PageNumber + '/AdditionalSMSEmailWhatsapp/Ascending');
  }

  getTableDataSort(SearchAdditionalSMSEmailWhatsapp:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchAdditionalSMSEmailWhatsapp==="")
    {
      SearchAdditionalSMSEmailWhatsapp="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchAdditionalSMSEmailWhatsapp + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }
  getAdditionalSmsDetails(reservationID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_URL + '/ForAdditionalMessaging/' + reservationID}`);
  }
  add(advanceTable: AdditionalSMSEmailWhatsapp) 
  {
    advanceTable.reservationAdditionalMessagingID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: AdditionalSMSEmailWhatsapp)
  {
    
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(reservationAdditionalMessagingID: number):  Observable<any> 
  {
    
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ reservationAdditionalMessagingID + '/'+ userID);
  }

  GetAdditionalSMSEmailMessagingData(DutySlipID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_Info + '/'+ 'GetAdditionalSMSEmailMessagingDetails' + '/' + DutySlipID);
  }

}
  

