// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { TollParkingType } from './tollParkingType.model';
@Injectable()
export class TollParkingTypeService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "tollParkingType";
  }
  /** CRUD METHODS */
  getTableData(SearchTollParkingType:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchTollParkingType==="")
    {
      SearchTollParkingType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchTollParkingType + '/' + SearchActivationStatus +'/' + PageNumber + '/TollParkingType/Ascending');
  }
  getTableDataSort(SearchTollParkingType:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchTollParkingType==="")
    {
      SearchTollParkingType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
  
    return this.httpClient.get(this.API_URL + "/" +SearchTollParkingType + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: TollParkingType) 
  {
    advanceTable.tollParkingTypeID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: TollParkingType)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(tollParkingTypeID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ tollParkingTypeID + '/'+ userID);
  }

}
  

