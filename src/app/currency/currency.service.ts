// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Currency } from './currency.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CurrencyService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "Currency";
  }
  /** CRUD METHODS */
  getTableData(SearchCurrencyName:string,SearchCurrencyCode:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchCurrencyName==="")
    {
      SearchCurrencyName="null";
    }
    if(SearchCurrencyCode==="")
    {
      SearchCurrencyCode="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCurrencyName + '/' +SearchCurrencyCode + '/' + SearchActivationStatus +'/' + PageNumber + '/currencyName/Ascending');
  }
  getTableDataSort(SearchCurrencyName:string,SearchCurrencyCode:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchCurrencyName==="")
    {
      SearchCurrencyName="null";
    }
    if(SearchCurrencyCode==="")
    {
      SearchCurrencyCode="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCurrencyName + '/' +SearchCurrencyCode + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: Currency) 
  {
    advanceTable.currencyID=-1;
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Currency)
  {
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(CurrencyID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ CurrencyID + '/'+ userID);
  }
}
  

