// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DutyDetails } from './dutyDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DutyDetailsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dutyDetails";
  }
  /** CRUD METHODS */
  getTableData(SearchDutyDetails:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(SearchDutyDetails==="")
    {
      SearchDutyDetails="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchDutyDetails + '/' + SearchActivationStatus +'/' + PageNumber + '/DutyDetails/Ascending');
  }
  getTableDataSort(SearchDutyDetails:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchDutyDetails==="")
    {
      SearchDutyDetails="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchDutyDetails + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: DutyDetails) 
  {
    advanceTable.dutyDetailsID=-1;
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: DutyDetails)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(dutyDetailsID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ dutyDetailsID);
  }

  
}
  

