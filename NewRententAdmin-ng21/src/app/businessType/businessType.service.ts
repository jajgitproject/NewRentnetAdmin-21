// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BusinessTypeModel } from './businessType.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class BusinessTypeService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL = generalService.BaseURL+ "businessType";
  }

  /** CRUD METHODS */
  getTableData(SearchBusinessTypeName:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchBusinessTypeName==="")
    {
      SearchBusinessTypeName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + SearchBusinessTypeName + '/' + SearchActivationStatus + '/' + PageNumber + '/BusinessTypeID/Ascending');
  }

  getTableDataSort(SearchBusinessTypeName:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchBusinessTypeName==="")
    {
      SearchBusinessTypeName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + SearchBusinessTypeName + '/' + SearchActivationStatus + '/' + PageNumber +  '/' + coloumName + '/' + sortType);
  }

  add(advanceTable: BusinessTypeModel) 
  {
    advanceTable.businessTypeID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: BusinessTypeModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  
  delete(businessTypeID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/' + businessTypeID + '/' + userID);
  }

}
  

