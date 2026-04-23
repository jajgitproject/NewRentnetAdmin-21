// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { LocationGroupLocationMapping } from './locationGroupLocationMapping.model';

@Injectable()
export class LocationGroupLocationMappingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "locationGroupLocationMapping";
  }
  /** CRUD METHODS */
  getTableData(locationGroupID:number,location:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(locationGroupID===0)
      {
        locationGroupID=0;
      }
    if(location==="")
    {
      location="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +locationGroupID + '/' +location + '/' + SearchActivationStatus +'/' + PageNumber + '/LocationGroupLocationMappingID/Ascending');
  }
  getTableDataSort(locationGroupID:number,location:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(locationGroupID===0)
      {
        locationGroupID=0;
      }
    if(location==="")
    {
      location="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"  +locationGroupID + '/' +location + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: LocationGroupLocationMapping) 
  {
    advanceTable.locationGroupLocationMappingID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: LocationGroupLocationMapping)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(locationGroupLocationMappingID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ locationGroupLocationMappingID + '/' + userID);
  }

}
  

