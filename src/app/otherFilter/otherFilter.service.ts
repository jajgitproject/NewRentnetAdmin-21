// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OtherFilter } from './otherFilter.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class OtherFilterService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "otherFilter";
  }
  /** CRUD METHODS */
  getTableData(SearchOtherFilter:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(SearchOtherFilter==="")
    {
      SearchOtherFilter="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchOtherFilter + '/' + SearchActivationStatus +'/' + PageNumber + '/OtherFilter/Ascending');
  }

  getTableDataSort(SearchOtherFilter:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchOtherFilter==="")
    {
      SearchOtherFilter="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchOtherFilter + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: OtherFilter) 
  {
    advanceTable.otherFilterID=-1;
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: OtherFilter)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(otherFilterID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ otherFilterID);
  }

  
}
  

