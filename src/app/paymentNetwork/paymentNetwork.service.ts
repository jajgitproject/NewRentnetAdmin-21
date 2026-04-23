// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaymentNetwork } from './paymentNetwork.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class PaymentNetworkService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "paymentNetwork";
  }
  /** CRUD METHODS */
  getTableData(SearchPaymentNetwork:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchPaymentNetwork==="")
    {
      SearchPaymentNetwork="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    //alert(this.API_URL + "/" + SearchPaymentNetwork + '/' + SearchActivationStatus +'/' + PageNumber + '/City/Ascending');
    return this.httpClient.get(this.API_URL + "/" +SearchPaymentNetwork + '/' + SearchActivationStatus +'/' + PageNumber + '/PaymentNetwork/Ascending');
  }

  getTableDataSort(SearchPaymentNetwork:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchPaymentNetwork==="")
    {
      SearchPaymentNetwork="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchPaymentNetwork + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: PaymentNetwork) 
  {
    advanceTable.paymentNetworkID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: PaymentNetwork)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(paymentNetworkID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ paymentNetworkID + '/'+ userID);
  }

  
}
  

