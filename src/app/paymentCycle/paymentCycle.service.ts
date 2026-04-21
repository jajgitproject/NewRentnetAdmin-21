// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaymentCycle } from './paymentCycle.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class PaymentCycleService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "paymentCycle";
  }
  /** CRUD METHODS */
  getTableData(SearchPaymentCycle:string,SearchNumberOfDays:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchPaymentCycle==="")
    {
      SearchPaymentCycle="null";
    }
    if(SearchNumberOfDays==="")
    {
      SearchNumberOfDays="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchPaymentCycle + '/'+ SearchNumberOfDays +'/' + SearchActivationStatus +'/' + PageNumber + '/PaymentCycle/Ascending');
  }
  getTableDataSort(SearchPaymentCycle:string,SearchNumberOfDays:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchPaymentCycle==="")
    {
      SearchPaymentCycle="null";
    }
    if(SearchNumberOfDays==="")
    {
      SearchNumberOfDays="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchPaymentCycle + '/' + SearchNumberOfDays +'/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: PaymentCycle) 
  {
    advanceTable.paymentCycleID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: PaymentCycle)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(paymentCycleID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ paymentCycleID + '/' + userID);
  }

  
}
  

