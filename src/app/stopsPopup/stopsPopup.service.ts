// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StopsPopup } from './stopsPopup.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class StopsPopupService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "stopsPopup";
  }
  /** CRUD METHODS */
  getTableData(SearchStopsPopup:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(SearchStopsPopup==="")
    {
      SearchStopsPopup="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchStopsPopup + '/' + SearchActivationStatus +'/' + PageNumber + '/StopsPopup/Ascending');
  }
  getTableDataSort(SearchStopsPopup:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchStopsPopup==="")
    {
      SearchStopsPopup="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchStopsPopup + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: StopsPopup) 
  {
    advanceTable.stopsPopupID=-1;
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: StopsPopup)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(stopsPopupID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ stopsPopupID);
  }

  
}
  

