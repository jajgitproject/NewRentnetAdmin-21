// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SettledRates } from './settledRates.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SettledRatesService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "settledRates";
  }
  /** CRUD METHODS */
  getTableData(SearchSettledRates:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(SearchSettledRates==="")
    {
      SearchSettledRates="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSettledRates + '/' + SearchActivationStatus +'/' + PageNumber + '/SettledRates/Ascending');
  }

  getTableDataSort(SearchSettledRates:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchSettledRates==="")
    {
      SearchSettledRates="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSettledRates + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: SettledRates) 
  {
    advanceTable.settledRatesID=-1;
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SettledRates)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(settledRatesID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ settledRatesID);
  }

  
}
  

