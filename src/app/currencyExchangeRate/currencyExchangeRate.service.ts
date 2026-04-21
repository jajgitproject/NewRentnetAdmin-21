// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CurrencyExchangeRate } from './currencyExchangeRate.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CurrencyExchangeRateService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "currencyExchangeRate";
  }
  /** CRUD METHODS */
  getTableData(SearchSource:string,CurrencyName:string ,SearchMessage:string,SearchApplicableFrom:string,SearchApplicableTo:string, SearchName:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchSource==="")
    {
      SearchSource="null";
    }
    if(CurrencyName==="")
    {
      CurrencyName="null";
    }
    if(SearchMessage==="")
    {
      SearchMessage="null";
    }
    if(SearchApplicableFrom==="")
    {
      SearchApplicableFrom="null";
    }
    if(SearchApplicableTo==="")
    {
      SearchApplicableTo="null";
    }
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + SearchSource + '/' +CurrencyName +  "/" +SearchMessage + '/' + SearchApplicableFrom +'/'+SearchApplicableTo +  "/" +SearchName + '/' + SearchActivationStatus +'/' + PageNumber + '/currencyExchangeRateID/Ascending');
  }
  getTableDataSort(SearchSource:string,CurrencyName:string ,SearchMessage:string,SearchApplicableFrom:string,SearchApplicableTo:string,SearchName:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchSource==="")
    {
      SearchSource="null";
    }
    if(CurrencyName==="")
    {
      CurrencyName="null";
    }
    if(SearchMessage==="")
    {
      SearchMessage="null";
    }
    if(SearchApplicableFrom==="")
    {
      SearchApplicableFrom="null";
    }
    if(SearchApplicableTo==="")
    {
      SearchApplicableTo="null";
    }
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"+ SearchSource + '/' +CurrencyName +  "/"+SearchMessage + '/' + SearchApplicableFrom +'/'+SearchApplicableTo +  "/" +SearchName + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CurrencyExchangeRate) 
  {

    advanceTable.currencyExchangeRateID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.applicableFromString=this.generalService.getTimeApplicable(advanceTable.applicableFrom);
    advanceTable.applicableToString=this.generalService.getTimeApplicableTO(advanceTable.applicableTo);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CurrencyExchangeRate)
  {
    
    advanceTable.applicableFromString=this.generalService.getTimeApplicable(advanceTable.applicableFrom);
    advanceTable.applicableToString=this.generalService.getTimeApplicableTO(advanceTable.applicableTo);
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(currencyExchangeRateID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ currencyExchangeRateID + '/'+ userID);
  }
}
