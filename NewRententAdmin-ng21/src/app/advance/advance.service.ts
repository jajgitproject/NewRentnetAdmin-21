// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Advance } from './advance.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class AdvanceService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "advance";
  }
  /** CRUD METHODS */
  getTableData(SearchAdvance:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(SearchAdvance==="")
    {
      SearchAdvance="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchAdvance + '/' + SearchActivationStatus +'/' + PageNumber + '/Advance/Ascending');
  }

  getTableDataSort(SearchAdvance:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchAdvance==="")
    {
      SearchAdvance="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchAdvance + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: Advance) 
  {
    advanceTable.advanceID=-1;
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Advance)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(advanceID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ advanceID);
  }

  
}
  

