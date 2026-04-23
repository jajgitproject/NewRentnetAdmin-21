// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GeoPointType } from './geoPointType.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class GeoPointTypeService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "geoPointType";
  }
  /** CRUD METHODS */
  getTableData(SearchName:string,SearchParent:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchParent==="")
    {
      SearchParent="null";
    }
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + '/' +SearchName+ '/' +SearchParent + '/' + SearchActivationStatus +'/' + PageNumber + '/geoPointType/Ascending');
  }
  getTableDataSort(SearchName:string,SearchParent:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchParent==="")
    {
      SearchParent="null";
    }
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + '/' +SearchName+ '/' +SearchParent + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: GeoPointType) 
  {
    advanceTable.geoPointTypeID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: GeoPointType)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(geoPointTypeID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ geoPointTypeID + '/'+ userID);
  }
}
