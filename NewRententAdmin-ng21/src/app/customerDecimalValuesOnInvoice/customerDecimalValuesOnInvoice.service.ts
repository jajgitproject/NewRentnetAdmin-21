// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerDecimalValuesOnInvoice } from './customerDecimalValuesOnInvoice.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerDecimalValuesOnInvoiceService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerDecimalValuesOnInvoice";
  }
  /** CRUD METHODS */
  getTableData(customerID:number,searchstartDate:string,searchendDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(customerID===0)
    {
      customerID=0;
    }
    if(searchstartDate==="")
    {
      searchstartDate="null";
    }
    if(searchendDate==="")
    {
      searchendDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchstartDate + '/'+searchendDate + '/' + SearchActivationStatus +'/' + PageNumber + '/customerDecimalValuesOnInvoiceID/Ascending');
  }
  getTableDataSort(customerID:number,searchstartDate:string,searchendDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(customerID===0)
    {
      customerID=0;
    }
    if(searchstartDate==="")
    {
      searchstartDate="null";
    }
    if(searchendDate==="")
    {
      searchendDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchstartDate + '/'+searchendDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerDecimalValuesOnInvoice) 
  {
    advanceTable.customerDecimalValuesOnInvoiceID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    if(advanceTable.endDate)
      {
        advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
      }
      else
      {
        advanceTable.endDate=null;
      }
   
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerDecimalValuesOnInvoice)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
   if(advanceTable.endDate)
      {
        advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
      }
      else
      {
        advanceTable.endDate=null;
      }
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerDecimalValuesOnInvoiceID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerDecimalValuesOnInvoiceID+ '/'+ userID);
  }
}
