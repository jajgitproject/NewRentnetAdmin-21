// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { City } from './city.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CityService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "city";
  }
  /** CRUD METHODS */
  getTableData(SearchCity:string,SearchState:string,SearchCitySTDCode:string,SearchGeoSearchString:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchState==="")
    {
      SearchState="null";
    }
    if(SearchCitySTDCode==="")
    {
      SearchCitySTDCode="null";
    }
    if(SearchGeoSearchString==="")
    {
      SearchGeoSearchString="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    //console.log(this.API_URL + "/" +SearchCity + '/' + SearchActivationStatus +'/' + PageNumber + '/GeoPoint.GeoPointName/Ascending');
    return this.httpClient.get(this.API_URL + "/" +SearchCity + '/'+ SearchState +'/'+ SearchCitySTDCode +'/'+ SearchGeoSearchString +'/' + SearchActivationStatus +'/' + PageNumber + '/GeoPoint.GeoPointName/Ascending');
  }
  getTableDataSort(SearchCity:string,SearchState:string,SearchCitySTDCode:string,SearchGeoSearchString:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchState==="")
    {
      SearchState="null";
    }
    if(SearchCitySTDCode==="")
    {
      SearchCitySTDCode="null";
    }
    if(SearchGeoSearchString==="")
    {
      SearchGeoSearchString="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCity + '/'+ SearchState +'/'+ SearchCitySTDCode +'/'+ SearchGeoSearchString +'/'  + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: City) 
  {
    
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.cityID=-1;
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    if(advanceTable.cityGroupID===0)
    {
      advanceTable.cityGroupID=0
    }
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: City)
  {
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(geoPointID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ geoPointID + '/'+ userID);
  }

}
  

