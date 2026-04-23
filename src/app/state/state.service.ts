// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { State } from './state.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class StateService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "state";
  }
  /** CRUD METHODS */
  getTableData(SearchGeoPointName:string, SearchGstCode:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchGeoPointName==="")
    {
      SearchGeoPointName="null";
    }
    if(SearchGstCode==="")
    {
      SearchGstCode="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + '/'+SearchGeoPointName + '/'+SearchGstCode + '/' + SearchActivationStatus +'/' + PageNumber + '/GeoPoint.GeoPointName/Ascending');
  }
  getTableDataSort(SearchGeoPointName:string, SearchGstCode:string,  SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchGeoPointName==="")
    {
      SearchGeoPointName="null";
    }
    if(SearchGstCode==="")
    {
      SearchGstCode="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + '/'+SearchGeoPointName +  '/' +SearchGstCode +  '/'+ SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: State) 
  {

    advanceTable.geoPointID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: State)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(stateID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ stateID + '/'+ userID);
  }
}
