// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerPaymentTermsCode } from './customerPaymentTermsCode.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerPaymentTermsCodeService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerPaymentTermsCode";
  }
  /** CRUD METHODS */
  getTableData(customerID:number,searchcustomerPaymentTermsCode:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(searchcustomerPaymentTermsCode==="")
    {
      searchcustomerPaymentTermsCode="null";
    }
    if(customerID===0)
    {
      customerID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchcustomerPaymentTermsCode + '/'+ SearchActivationStatus +'/' + PageNumber + '/customerPaymentTermsCodeID/Ascending');
  }
  getTableDataSort(customerID:number,searchcustomerPaymentTermsCode:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(searchcustomerPaymentTermsCode==="")
    {
      searchcustomerPaymentTermsCode="null";
    }
    if(customerID===0)
    {
      customerID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchcustomerPaymentTermsCode + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerPaymentTermsCode) 
  {
    advanceTable.customerPaymentTermsCodeID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerPaymentTermsCode)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerPaymentTermsCodeID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerPaymentTermsCodeID+ '/'+ userID);
  }
}
