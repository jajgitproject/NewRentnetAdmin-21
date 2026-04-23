// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SpotInCity } from './spotInCity.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SpotInCityService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "spotInCity";
  }
  /** CRUD METHODS */
  getTableData(SearchName:string, 
    SearchSpotType:string,
    SearchParent:string,
    SearchGeoString:string,
    SearchAPIIntegration:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchSpotType==="")
    {
      SearchSpotType="null";
    }
    if(SearchParent==="")
    {
      SearchParent="null";
    }
    if(SearchGeoString==="")
    {
      SearchGeoString="null";
    }
    if(SearchAPIIntegration==="")
    {
      SearchAPIIntegration="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName+ "/" +SearchSpotType+ "/" +SearchParent+ "/" +SearchGeoString+ "/" +SearchAPIIntegration + '/' + SearchActivationStatus +'/' + PageNumber + '/geoPointName/Ascending');
  }
  getTableDataSort(SearchName:string, 
    SearchSpotType:string,
    SearchParent:string,
    SearchGeoString:string,
    SearchAPIIntegration:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchSpotType==="")
    {
      SearchSpotType="null";
    }
    if(SearchParent==="")
    {
      SearchParent="null";
    }
    if(SearchGeoString==="")
    {
      SearchGeoString="null";
    }
    if(SearchAPIIntegration==="")
    {
      SearchAPIIntegration="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName+ "/" +SearchSpotType+ "/" +SearchParent+ "/" +SearchGeoString+ "/" +SearchAPIIntegration + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: SpotInCity) 
  {
    advanceTable.geoPointID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SpotInCity)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(geoPointID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ geoPointID + '/'+ userID);
  }
}
